import OBR, { buildShape } from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
import * as IMG from "./imagens.js";
import { IMPORT_KEY, lerPedido, apagarPedido, aplicarPedido } from "./importar.js";

/* Fica rodando enquanto a sala está aberta, mesmo com a janela do Hexatombe fechada:
   - toca o sino e deixa o mapa vermelho quando um sacrifício é realizado
   - guarda (para o mestre) os desejos enviados pelos jogadores
   - mantém o estado do ritual sincronizado: o mestre responde aos jogadores que chegam,
     e os jogadores guardam a versão mais nova para abrir a janela já atualizada */

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
    await OBR.modal.open({ id: NS + "/handout", url: new URL("handout.html", location.href).href, width: 620, height: 760 });
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
        if (!(st?.pistas || []).some((p) => p.revelada && p.img === `arq:${id}`)) continue; // só pistas reveladas
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
      if (!cur || (Number(obj.state.rev) || 0) > (Number(cur.rev) || 0)) localStorage.setItem(stateKey(), JSON.stringify(obj.state));
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
window.addEventListener("storage", (e) => { if (e.key === IMPORT_KEY && e.newValue) receberEquipe(); });

OBR.onReady(async () => {
  roomId = OBR.room.id;
  role = await OBR.player.getRole();
  OBR.player.onChange((p) => { role = p.role; });
  OBR.broadcast.onMessage(SYNC, (ev) => onChunk(ev.data));
  OBR.broadcast.onMessage(CHANNEL, async (ev) => {
    const d = ev.data || {};
    if (d.kind === "desejo") { if (role === "GM" && d.desejo) guardarDesejo(d.desejo); return; }
    if (d.kind === "handout") { abrirPista(d.pista); return; }
    if (d.kind === "circo") { if (role === "GM") guardarCirco(d); return; }
    // se a janela do Hexatombe estiver aberta, ela mesma não toca o sino recebido; quem toca é este fundo
    if (d.sino) { bell(); redFlash(); }
  });
});
