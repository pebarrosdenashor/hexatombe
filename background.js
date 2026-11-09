import OBR, { buildShape } from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
import * as IMG from "./imagens.js?v=2.15.0";
import { IMPORT_KEY, lerPedido, apagarPedido, aplicarPedido } from "./importar.js?v=2.15.0";
import { CONTADOR_KEY, lerOps, apagarOps, aplicarOps } from "./contadores.js?v=2.15.0";
import { imgLiberada, aplicarPesquisa } from "./bestiario.js?v=2.15.0";
import { PREF, pref, opcoes, ehNoite, ehLua, relogio as relogioDe } from "./ritmo.js?v=2.15.0";
import { QCH, ler as lerQuadro, gravar as gravarQuadro, mesclar, vivos, enviador, receptor, tokenServe, cardDeToken, CAMADAS_TOKEN } from "./quadro-dados.js?v=2.15.0";

/* Fica rodando enquanto a sala está aberta, mesmo com a janela do Hexatombe fechada:
   - toca o sino e deixa o mapa vermelho quando um sacrifício é realizado
   - guarda (para o mestre) os desejos enviados pelos jogadores
   - mantém o estado do ritual sincronizado: o mestre responde aos jogadores que chegam,
     e os jogadores guardam a versão mais nova para abrir a janela já atualizada
   - v2.8: aplica as pesquisas do bestiário com a janela do mestre fechada
   - v2.8: guarda o quadro de investigação e manda a cópia a quem abrir o quadro
   - v2.15: ritmo do ritual — mapa escurece à noite, relógio e velas na tela, cartão de abertura */

const NS = "io.github.pebarrosdenashor.hexatombe";
const CHANNEL = NS + "/roll";
let role = "PLAYER", roomId = "";
let actx = null;

function bell() {
  try { if (localStorage.getItem(NS + ":som") === "0") return; } catch { /* */ }
  try {
    const c = (actx ||= new (window.AudioContext || window.webkitAudioContext)());
    if (c.state === "suspended") c.resume();
    const t0 = c.currentTime + 0.05;
    for (let k = 0; k < 3; k++) {
      const t = t0 + k * 1.6;
      for (const [mult, amp, dec] of [[1, 0.5, 4.5], [2.0, 0.25, 3.5], [2.76, 0.2, 2.5], [5.4, 0.08, 1.2], [0.5, 0.3, 5]]) {
        const o = c.createOscillator(); const g = c.createGain();
        o.type = "sine"; o.frequency.value = 98 * mult;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(amp * 0.6, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
        o.connect(g).connect(c.destination); o.start(t); o.stop(t + dec + 0.1);
      }
    }
  } catch { /* sem áudio */ }
}
function guardarDesejo(d) {
  const k = NS + ":desejos:" + roomId;
  try {
    const ds = JSON.parse(localStorage.getItem(k) || "[]");
    if (ds.some((x) => x.id === d.id)) return;
    const i = ds.findIndex((x) => x.nome === d.nome); if (i >= 0) ds.splice(i, 1);
    ds.unshift(d); localStorage.setItem(k, JSON.stringify(ds.slice(0, 40)));
  } catch { /* */ }
}

/* Pista mostrada pelo mestre: abre na tela de quem pode vê-la */
async function abrirPista(p) {
  if (!p) return;
  try {
    if (role !== "GM" && Array.isArray(p.para) && p.para.length) {
      const st = JSON.parse(localStorage.getItem(stateKey()) || "null");
      const me = await OBR.player.getId();
      const minhas = (st?.equipes || []).map((t, i) => ((t.membros || []).some((m) => m.ownerId === me) ? i : -1)).filter((i) => i >= 0);
      if (!p.para.some((ti) => minhas.includes(Number(ti)))) return;
    }
    localStorage.setItem(NS + ":handout", JSON.stringify({ ...p, at: Date.now() }));
    await OBR.modal.open({ id: NS + "/handout", url: new URL("handout.html?v=2.15.0", location.href).href, width: 620, height: 760 });
  } catch { /* */ }
}
/* Jogada de circo de um jogador, com a janela do mestre fechada */
async function guardarCirco(d) {
  if (await OBR.action.isOpen()) return; // a janela aberta registra sozinha
  try {
    const st = JSON.parse(localStorage.getItem(stateKey()) || "null"); if (!st) return;
    const jogo = d.jogo === "soco" ? "soco" : d.jogo === "dardos" ? "dardos" : null; if (!jogo) return;
    st.circo ||= {}; st.circo[jogo] ||= []; st.circo.hist ||= [];
    const nome = String(d.nome || "?").slice(0, 60); const pts = Math.max(0, Number(d.pts) || 0);
    const meu = st.circo[jogo].find((r) => r.nome === nome);
    if (!meu) st.circo[jogo].push({ nome, pts }); else if (pts > (Number(meu.pts) || 0)) meu.pts = pts;
    st.circo.hist.unshift({ jogo, nome, pts, det: String(d.det || "").slice(0, 60), dia: st.dia, at: Date.now() }); st.circo.hist = st.circo.hist.slice(0, 40);
    st.rev = Date.now(); localStorage.setItem(stateKey(), JSON.stringify(st)); sendChunks({ kind: "state", state: st });
  } catch { /* */ }
}

const SYNC = NS + "/state";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const parts = {};
async function sendChunks(payload, tam = 5000) {
  const str = JSON.stringify(payload); const n = Math.max(1, Math.ceil(str.length / tam)); const m = uid();
  for (let i = 0; i < n; i++) { try { await OBR.broadcast.sendMessage(SYNC, { m, i, n, d: str.slice(i * tam, (i + 1) * tam) }); } catch { return; } if (n > 1) await sleep(70); }
}
const stateKey = () => NS + ":state:" + roomId;
async function onSync(obj) {
  // imagem de pista enviada do computador do mestre: todos guardam no navegador
  if (obj.kind === "img" && obj.id && /^data:image\//.test(obj.data || "")) { await IMG.guardar(String(obj.id), obj.data); return; }
  if (obj.kind === "pedeImg" && role === "GM") {
    if (await OBR.action.isOpen()) return; // a janela aberta responde sozinha
    try {
      const st = JSON.parse(localStorage.getItem(stateKey()) || "null");
      for (const id of (obj.ids || []).slice(0, 12)) {
        if (!imgLiberada(st, id)) continue; // só pistas reveladas e criaturas já vistas
        const data = await IMG.pegar(String(id)); if (data) await sendChunks({ kind: "img", id: String(id), data }, 12000);
      }
    } catch { /* */ }
    return;
  }
  if (obj.kind === "hello" && role === "GM") {
    if (await OBR.action.isOpen()) return; // a janela aberta responde sozinha
    try { const st = JSON.parse(localStorage.getItem(stateKey()) || "null"); if (st) sendChunks({ kind: "state", state: st }); } catch { /* */ }
  }
  if (obj.kind === "diario" && role === "GM") {
    if (await OBR.action.isOpen()) return; // a janela aberta cuida disso
    try {
      const st = JSON.parse(localStorage.getItem(stateKey()) || "null"); if (!st) return;
      st.diarios ||= {}; const cur = st.diarios[obj.ti];
      if (cur && (Number(cur.at) || 0) > (Number(obj.at) || 0)) return;
      st.diarios[obj.ti] = { text: obj.text, by: obj.by, at: obj.at }; st.rev = Date.now();
      localStorage.setItem(stateKey(), JSON.stringify(st)); sendChunks({ kind: "state", state: st });
    } catch { /* */ }
  }
  if (obj.kind === "state" && obj.state && role !== "GM") {
    try {
      const cur = JSON.parse(localStorage.getItem(stateKey()) || "null");
      if (!cur || (Number(obj.state.rev) || 0) > (Number(cur.rev) || 0)) { localStorage.setItem(stateKey(), JSON.stringify(obj.state)); atualizarRitmo(); }
    } catch { /* */ }
  }
}
function onChunk(d) {
  if (!d?.m) return;
  const p = (parts[d.m] ||= { n: d.n, parts: [], got: 0, at: Date.now() });
  if (p.parts[d.i] === undefined) { p.parts[d.i] = d.d; p.got++; }
  if (p.got === p.n) { delete parts[d.m]; try { onSync(JSON.parse(p.parts.join(""))); } catch { /* */ } }
}
async function redFlash() {
  try {
    if (!(await OBR.scene.isReady())) return;
    const id = NS + "-sangue";
    await OBR.scene.local.deleteItems([id]).catch(() => {});
    const shape = buildShape().id(id).shapeType("RECTANGLE").width(400000).height(400000).position({ x: -200000, y: -200000 })
      .fillColor("#b0001a").fillOpacity(0.45).strokeWidth(0).strokeOpacity(0).layer("TEXT").locked(true).disableHit(true).build();
    await OBR.scene.local.addItems([shape]);
    for (const o of [0.25, 0.5, 0.25, 0.5, 0.3, 0.45, 0.25, 0.12, 0.05]) { await sleep(550); await OBR.scene.local.updateItems([id], (ds) => { for (const x of ds) x.style.fillOpacity = o; }); }
    await OBR.scene.local.deleteItems([id]);
  } catch { /* */ }
}

/* ---------- Ritmo do ritual (v2.15) ---------- */
const lerSt = () => { try { return JSON.parse(localStorage.getItem(stateKey()) || "null"); } catch { return null; } };
let stR = null;

// sons: toques graves de sino (noite / hora chegou) e um acorde claro (amanhecer)
function toque(tipo) {
  if (!pref.som()) return;
  try {
    const c = (actx ||= new (window.AudioContext || window.webkitAudioContext)());
    if (c.state === "suspended") c.resume();
    const t0 = c.currentTime + 0.05;
    const notas = tipo === "dia" ? [[196, 0], [247, 0.35], [294, 0.7], [392, 1.05]] : tipo === "hora" ? [[73.4, 0], [73.4, 1.9]] : [[82.4, 0]];
    for (const [f, dt] of notas) {
      const t = t0 + dt;
      const parciais = tipo === "dia" ? [[1, 0.18, 3.2], [2, 0.06, 2.2], [3, 0.03, 1.4]] : [[1, 0.5, 6], [2.0, 0.22, 4.5], [2.76, 0.16, 3], [5.4, 0.06, 1.4], [0.5, 0.35, 7]];
      for (const [mult, amp, dec] of parciais) {
        const o = c.createOscillator(); const g = c.createGain();
        o.type = "sine"; o.frequency.value = f * mult;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(amp * 0.6, t + (tipo === "dia" ? 0.25 : 0.01)); g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
        o.connect(g).connect(c.destination); o.start(t); o.stop(t + dec + 0.1);
      }
    }
  } catch { /* sem áudio */ }
}

// Mapa escurecendo à noite: um retângulo local (só nesta tela) entre o mapa e os tokens
const NOITE_ID = NS + "-noite";
let filaNoite = Promise.resolve();
function aplicarNoite() { filaNoite = filaNoite.then(aplicarNoiteJa).catch(() => {}); return filaNoite; }
async function aplicarNoiteJa() {
  if (!(await OBR.scene.isReady())) return;
  const st = stR;
  const quer = st?.equipes && opcoes(st).noite && ehNoite(st) ? (ehLua(st) ? { cor: "#3d0010", op: 0.5 } : { cor: "#02040f", op: 0.55 }) : null;
  const [ja] = await OBR.scene.local.getItems([NOITE_ID]);
  const atual = ja ? ja.style.fillOpacity : 0;
  const passos = pref.calmo() ? 1 : 14;
  const fade = async (de, para) => {
    for (let i = 1; i <= passos; i++) {
      const o = de + (para - de) * (i / passos);
      await OBR.scene.local.updateItems([NOITE_ID], (ds) => { for (const x of ds) x.style.fillOpacity = o; });
      if (passos > 1) await sleep(180);
    }
  };
  if (!quer) { if (ja) { await fade(atual, 0); await OBR.scene.local.deleteItems([NOITE_ID]); } return; }
  if (!ja) {
    const sh = buildShape().id(NOITE_ID).shapeType("RECTANGLE").width(400000).height(400000).position({ x: -200000, y: -200000 })
      .fillColor(quer.cor).fillOpacity(0).strokeWidth(0).strokeOpacity(0).layer("GRID").locked(true).disableHit(true).build();
    await OBR.scene.local.addItems([sh]);
    return fade(0, quer.op);
  }
  if (ja.style.fillColor !== quer.cor) await OBR.scene.local.updateItems([NOITE_ID], (ds) => { for (const x of ds) x.style.fillColor = quer.cor; });
  if (Math.abs(atual - quer.op) > 0.01) await fade(atual, quer.op);
}

// Relógio e velas na tela (popover pequeno sobre o mapa)
const HUD_ID = NS + "/relogio";
let hudAberto = false, hudPos = "";
async function abrirHud() {
  const pos = pref.pos();
  let w = 1200, h = 800; try { [w, h] = await Promise.all([OBR.viewport.getWidth(), OBR.viewport.getHeight()]); } catch { /* */ }
  const cfg = pos === "direita" ? { a: { left: w - 12, top: 64 }, o: { horizontal: "RIGHT", vertical: "TOP" } }
    : pos === "baixo" ? { a: { left: w / 2, top: h - 10 }, o: { horizontal: "CENTER", vertical: "BOTTOM" } }
    : { a: { left: w / 2, top: 10 }, o: { horizontal: "CENTER", vertical: "TOP" } };
  await OBR.popover.open({
    id: HUD_ID, url: new URL(`relogio.html?v=2.15.0&sala=${encodeURIComponent(roomId)}`, location.href).href,
    width: 270, height: 148, anchorReference: "POSITION", anchorPosition: cfg.a, anchorOrigin: cfg.o, transformOrigin: cfg.o,
    hidePaper: true, disableClickAway: true, marginThreshold: 4,
  });
  hudAberto = true; hudPos = pos;
}
async function ajustarHud(forcar = false) {
  const quer = !!stR?.equipes && opcoes(stR).hud && pref.hud();
  try {
    if (quer && (!hudAberto || forcar || hudPos !== pref.pos())) await abrirHud();
    else if (!quer && hudAberto) { await OBR.popover.close(HUD_ID); hudAberto = false; }
  } catch { /* */ }
}

// Cartão de abertura do dia / da noite, em tela cheia
async function mostrarCartao(c) {
  if (!c) return;
  try {
    localStorage.setItem(NS + ":cartao", JSON.stringify({ ...c, at: Date.now() }));
    await OBR.modal.open({ id: NS + "/cartao", url: new URL(`cartao.html?v=2.15.0&t=${Date.now()}`, location.href).href, fullScreen: true, hideBackdrop: true, hidePaper: true });
  } catch { /* */ }
  setTimeout(() => toque(c.evt === "noite" ? "noite" : "dia"), pref.calmo() ? 100 : 900);
}

// O relógio do sacrifício chegou a zero: toca o sino uma vez em cada tela
const tocados = new Set();
function vigiarRelogio() {
  const r = relogioDe(stR); if (!r || !r.acabou || tocados.has(r.id)) return;
  tocados.add(r.id);
  if (Date.now() - (Number(stR.relogio.fim) || 0) > 15000) return; // já tinha acabado antes de abrir a sala
  toque("hora");
  OBR.notification.show(`⏳ A hora chegou (${r.rotulo}).`, "WARNING").catch?.(() => {});
}

function atualizarRitmo() {
  stR = lerSt();
  aplicarNoite(); ajustarHud();
}

/* Pesquisa de um jogador no bestiário, com a janela do mestre fechada */
async function guardarPesquisa(d) {
  if (await OBR.action.isOpen()) return; // a janela aberta registra sozinha
  try {
    const st = JSON.parse(localStorage.getItem(stateKey()) || "null"); if (!st) return;
    const res = aplicarPesquisa(st, d); if (!res) return;
    st.rev = Date.now(); localStorage.setItem(stateKey(), JSON.stringify(st)); sendChunks({ kind: "state", state: st });
    OBR.notification.show(res.texto);
    OBR.broadcast.sendMessage(CHANNEL, { text: res.texto }, { destination: "REMOTE" }).catch(() => {});
    if (res.ok) OBR.broadcast.sendMessage("io.github.pebarrosdenashor.mestre-hx/msg", { kind: "som", k: "revela" }, { destination: "ALL" }).catch(() => {});
  } catch { /* */ }
}

/* ---------- Quadro de investigação ---------- */
let enviarQ = null, ultimoTudo = 0;
const recebeQ = receptor((p) => {
  if ((p.k === "op" || p.k === "tudo") && p.q) {
    if (p.k === "tudo") ultimoTudo = Date.now();
    const q = lerQuadro(roomId); if (mesclar(q, p.q)) gravarQuadro(roomId, q);
  }
  if (p.k === "pede") {
    // o mestre responde primeiro; os outros só se ninguém tiver respondido
    const espera = role === "GM" ? 150 : 700 + Math.random() * 1200; const pedido = Date.now();
    setTimeout(() => {
      if (ultimoTudo > pedido) return;
      const q = lerQuadro(roomId); if (!vivos(q, "cards").length && !vivos(q, "fios").length) return;
      enviarQ?.({ k: "tudo", q });
    }, espera);
  }
});

/* Clique direito num token → "Prender no quadro" (v2.9) */
function menuQuadro() {
  OBR.contextMenu.create({
    id: NS + "/quadro-token",
    icons: [{ icon: new URL("icon.svg", location.href).href, label: "📌 Prender no quadro",
      filter: { every: [{ key: "type", value: "IMAGE" }, ...CAMADAS_TOKEN.map((l, i) => (i < CAMADAS_TOKEN.length - 1 ? { key: "layer", value: l, coordinator: "||" } : { key: "layer", value: l }))] } }],
    async onClick(ctx) {
      const its = ctx.items.filter((it) => tokenServe(it, role === "GM")).slice(0, 12);
      if (!its.length) return OBR.notification.show("Esse token não pode ir para o quadro (precisa ser uma imagem visível).", "WARNING");
      let nome = "?"; try { nome = await OBR.player.getName(); } catch { /* */ }
      const q = lerQuadro(roomId); const cards = {};
      for (const it of its) { const c = cardDeToken(it, nome); cards[c.id] = c; }
      mesclar(q, { cards, fios: {} }); gravarQuadro(roomId, q); // a janela do quadro, se aberta, vê pela mudança no navegador
      enviarQ?.({ k: "op", q: { cards, fios: {} } });
      OBR.notification.show(`📌 ${its.length === 1 ? "Token preso" : `${its.length} tokens presos`} no quadro de investigação.`, "SUCCESS");
    },
  });
}

/* Equipe gerada no Escudo do Mestre, com a janela do Hexatombe fechada */
async function receberEquipe() {
  if (role !== "GM") return;
  if (await OBR.action.isOpen()) return; // a janela aberta cuida disso
  const p = lerPedido(); if (!p) return;
  try {
    const st = JSON.parse(localStorage.getItem(stateKey()) || "null");
    if (!st?.equipes) return; // sem ritual salvo ainda: a janela pega quando abrir
    apagarPedido();
    const ti = aplicarPedido(st, p, NS + ":agenda:" + roomId);
    if (ti < 0) { OBR.notification.show("Hexatombe: não há equipe livre para a equipe gerada.", "WARNING"); return; }
    localStorage.setItem(stateKey(), JSON.stringify(st)); sendChunks({ kind: "state", state: st });
    OBR.notification.show(`Hexatombe: ${st.equipes[ti].nome} entrou como equipe ${ti + 1}.`, "SUCCESS");
  } catch { /* */ }
}
/* Fome e Fervor marcados no Escudo do Mestre, com a janela do Hexatombe fechada */
async function receberContadores() {
  if (role !== "GM") return;
  if (await OBR.action.isOpen()) return; // a janela aberta cuida disso
  const ops = lerOps(); if (!ops.length) return;
  try {
    const st = JSON.parse(localStorage.getItem(stateKey()) || "null");
    if (!st?.equipes) return;
    apagarOps(ops);
    if (!aplicarOps(st, ops).length) return;
    localStorage.setItem(stateKey(), JSON.stringify(st)); sendChunks({ kind: "state", state: st });
  } catch { /* */ }
}
window.addEventListener("storage", (e) => {
  if (e.key === stateKey()) atualizarRitmo(); // o mestre mudou o ritual na janela dele
  if (e.key === PREF.hud || e.key === PREF.pos) ajustarHud();
  if (e.key === PREF.calmo) aplicarNoite();
  if (e.key === IMPORT_KEY && e.newValue) receberEquipe();
  if (e.key === CONTADOR_KEY && e.newValue) receberContadores();
});

OBR.onReady(async () => {
  roomId = OBR.room.id;
  role = await OBR.player.getRole();
  OBR.player.onChange((p) => { role = p.role; });
  OBR.broadcast.onMessage(SYNC, (ev) => onChunk(ev.data));
  enviarQ = enviador(OBR);
  OBR.broadcast.onMessage(QCH, (ev) => recebeQ(ev.data));
  menuQuadro();
  // ritmo do ritual
  stR = lerSt(); const r0 = relogioDe(stR); if (r0?.acabou) tocados.add(r0.id);
  atualizarRitmo();
  OBR.scene.onReadyChange((pronta) => { if (pronta) aplicarNoite(); });
  setInterval(() => { stR = lerSt() || stR; vigiarRelogio(); }, 1000);
  OBR.broadcast.onMessage(CHANNEL, async (ev) => {
    const d = ev.data || {};
    if (d.kind === "desejo") { if (role === "GM" && d.desejo) guardarDesejo(d.desejo); return; }
    if (d.kind === "handout") { abrirPista(d.pista); return; }
    if (d.kind === "circo") { if (role === "GM") guardarCirco(d); return; }
    if (d.kind === "pesquisa") { if (role === "GM") guardarPesquisa(d); return; }
    if (d.kind === "ritmo") { mostrarCartao(d.cartao); return; }
    // se a janela do Hexatombe estiver aberta, ela mesma não toca o sino recebido; quem toca é este fundo
    if (d.sino) { bell(); redFlash(); }
  });
});
