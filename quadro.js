import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
import * as IMG from "./imagens.js?v=2.9.4";
import { revelaDe, NIVEL_CURTO } from "./bestiario.js?v=2.9.4";
import { TAM_OK, NS, LARG, ALT, ler, gravar, mesclar, vivos, novoId, enviador, qKey, QCH, receptor, tokenServe, nomeToken, cardDeToken } from "./quadro-dados.js?v=2.9.4";

/* =========================================================
   Quadro de investigação do Hexatombe (v2.8)
   Cartões presos com alfinete e ligados por barbante.
   Todos mexem; as mudanças vão para a mesa na hora.
   ========================================================= */

const MODAL = NS + "/quadro";
const SYNC = NS + "/state";
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const num = (v) => Number(v) || 0;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const $ = (id) => document.getElementById(id);

let obrOk = false, roomId = "local", role = "PLAYER", me = { id: "local", name: "Teste" };
let q = { cards: {}, fios: {} };
let enviar = async () => true;
let zoom = clamp(Number(localStorage.getItem(NS + ":qzoom")) || 0.7, 0.3, 1.6);
const ui = { ligar: false, sel: null, editando: null, confirmar: null, novos: new Set(), fioSel: null };
const isGM = () => role === "GM";

/* ---------- Estado do Hexatombe (pistas e bestiário) ---------- */
function hx() { try { return JSON.parse(localStorage.getItem(`${NS}:state:${roomId}`) || "null"); } catch { return null; } }
function minhasEquipes(st) {
  if (!st?.equipes) return [];
  if (isGM()) return st.equipes.map((_, i) => i);
  return st.equipes.map((t, i) => ((t.membros || []).some((m) => m.ownerId === me.id) ? i : -1)).filter((i) => i >= 0);
}
function pistaVisivel(st, p) {
  if (isGM()) return true;
  if (!p?.revelada) return false;
  if (!p.para || p.para === "todos" || !p.para.length) return true;
  const mi = new Set(minhasEquipes(st)); return p.para.some((ti) => mi.has(Number(ti)));
}
function pistasVisiveis(st) { return (st?.pistas || []).filter((p) => pistaVisivel(st, p) && p.revelada); }
function nomeCriatura(st, k) { if (k.startsWith("l:")) return k.slice(2); return (st?.bestiario || []).find((c) => `c:${c.id}` === k)?.nome || "Criatura"; }
function criaturasVisiveis(st) { return Object.keys(st?.revela || {}).filter((k) => revelaDe(st, k).n >= 1).map((k) => ({ k, r: revelaDe(st, k), nome: nomeCriatura(st, k) })); }

/* ---------- Mudanças ---------- */
function salvar(itens) {
  for (const [t, xs] of Object.entries(itens)) for (const it of Object.values(xs)) it.at = Date.now();
  mesclar(q, itens); gravar(roomId, q);
  if (obrOk) enviar({ k: "op", q: itens });
}
let opTimer = null, opPend = null;
function salvarDevagar(card) {
  // durante o arraste, manda no máximo 8 vezes por segundo
  card.at = Date.now(); q.cards[card.id] = card; opPend = card;
  if (opTimer) return;
  opTimer = setTimeout(() => { opTimer = null; if (opPend) { const c = opPend; opPend = null; gravar(roomId, q); if (obrOk) enviar({ k: "op", q: { cards: { [c.id]: c }, fios: {} } }); } }, 120);
}
function novoCard(tipo, campos = {}) {
  const v = $("vista");
  const cx = (v.scrollLeft + v.clientWidth / 2) / zoom, cy = (v.scrollTop + v.clientHeight / 2) / zoom;
  const c = { id: novoId(), tipo, ref: "", titulo: "", txt: "", url: "", cor: "", x: clamp(cx - 85 + (Math.random() - 0.5) * 420, 20, LARG - 220), y: clamp(cy - 70 + (Math.random() - 0.5) * 260, 20, ALT - 220), rot: Math.round((Math.random() - 0.5) * 8 * 10) / 10, autor: me.name, ...campos };
  ui.novos.add(c.id); salvar({ cards: { [c.id]: c }, fios: {} }); desenhar();
  return c;
}
function apagarCard(id) {
  const fios = {}; for (const f of vivos(q, "fios")) if (f.a === id || f.b === id) fios[f.id] = { id: f.id, del: true };
  salvar({ cards: { [id]: { id, del: true } }, fios }); ui.sel = null; desenhar();
}
function ligar(a, b) {
  if (a === b) return;
  if (vivos(q, "fios").some((f) => (f.a === a && f.b === b) || (f.a === b && f.b === a))) { dica("Esses dois já estão ligados."); return; }
  const f = { id: novoId(), a, b, rotulo: "", cor: "vermelho", autor: me.name };
  salvar({ cards: {}, fios: { [f.id]: f } }); desenhar(); editarFio(f.id);
}

/* ---------- Desenho ---------- */
function silhueta(r) {
  if (r.img) return IMG.ehArq(r.img) ? `<img data-arq="${esc(IMG.arqId(r.img))}" alt="">` : `<img src="${esc(r.img)}" alt="" loading="lazy">`;
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><path fill="#050304" d="M50 14c-12 0-20 10-20 22 0 8 4 14 8 18-12 4-20 14-22 30h68c-2-16-10-26-22-30 4-4 8-10 8-18 0-12-8-22-20-22Z"/><circle cx="44" cy="33" r="2.6" fill="#ff2a48"/><circle cx="57" cy="33" r="2.6" fill="#ff2a48"/></svg>`;
}
function conteudo(c, st) {
  if (ui.editando === c.id) {
    if (c.tipo === "foto") return `<input data-ed="url" value="${esc(c.url)}" placeholder="Link da imagem https://…"><textarea data-ed="txt" rows="2" placeholder="Legenda">${esc(c.txt)}</textarea><button data-q="edOk">OK</button>`;
    if (c.tipo === "pessoa") return `<input data-ed="titulo" value="${esc(c.titulo)}" placeholder="Nome"><textarea data-ed="txt" rows="3" placeholder="O que sabem dela">${esc(c.txt)}</textarea><button data-q="edOk">OK</button>`;
    return `<textarea data-ed="txt" rows="5" placeholder="Escreva…">${esc(c.txt)}</textarea>
      ${c.tipo === "nota" ? `<div class="cores">${[["", "#f6e27a"], ["rosa", "#f5a8b8"], ["azul", "#a9d4ee"], ["verde", "#b9e4a5"], ["branca", "#f4f1ea"]].map(([k, cor]) => `<button data-q="cor" data-cor="${k}" class="${(c.cor || "") === k ? "on" : ""}" style="background:${cor}" title="Cor do papel"></button>`).join("")}</div>` : ""}<button data-q="edOk">OK</button>`;
  }
  if (c.tipo === "pista") {
    const p = (st?.pistas || []).find((x) => x.id === c.ref);
    if (!p || !pistaVisivel(st, p)) return `<div class="t">Documento</div><div class="x">${isGM() ? "(pista escondida ou apagada)" : "Vocês ainda não têm este documento."}</div>`;
    const img = IMG.ehArq(p.img) ? `<img data-arq="${esc(IMG.arqId(p.img))}" alt="">` : /^https?:\/\//.test(p.img || "") ? `<img src="${esc(p.img)}" alt="" loading="lazy">` : "";
    return `<div class="t">${esc(p.titulo || "Documento")}</div>${img}${p.texto ? `<div class="x">${esc(p.texto.slice(0, 140))}${p.texto.length > 140 ? "…" : ""}</div>` : ""}<button class="ler" data-q="ler" data-id="${esc(p.id)}">📖 Ler</button>`;
  }
  if (c.tipo === "criatura") {
    const r = revelaDe(st, c.ref);
    if (r.n < 1 && !isGM()) return `<div class="t">???</div><div class="x">Algo que ainda não apareceu.</div>`;
    return `<div class="${r.n === 1 ? "silh" : ""}">${silhueta(r)}</div><div class="t">${r.n >= 2 ? esc(nomeCriatura(st, c.ref)) : "???"}</div><div class="nivel">${NIVEL_CURTO[r.n]}${r.n === 1 && r.rumor ? ` · “${esc(r.rumor.slice(0, 60))}”` : ""}</div>`;
  }
  if (c.tipo === "pessoa") return `<div class="rosto">${esc((c.titulo || "?").trim().slice(0, 1).toUpperCase())}</div><div class="t">${esc(c.titulo || "Sem nome")}</div>${c.txt ? `<div class="x">${esc(c.txt)}</div>` : ""}`;
  // o token do jeito que está na sala: só a imagem (o nome aparece ao passar o mouse)
  if (c.tipo === "token") return `${c.url ? `<img class="tk" src="${esc(c.url)}" alt="${esc(c.titulo || "Token")}" loading="lazy" draggable="false">` : ""}${c.txt ? `<div class="x">${esc(c.txt)}</div>` : ""}`;
  if (c.tipo === "foto") return `${c.url ? `<img src="${esc(c.url)}" alt="" loading="lazy">` : `<div class="rosto" style="height:110px;display:grid;place-items:center;background:#ddd;color:#777">sem foto</div>`}${c.txt ? `<div class="x">${esc(c.txt)}</div>` : ""}`;
  return `<div class="x">${esc(c.txt) || "<i style=opacity:.5>(nota vazia)</i>"}</div>`;
}
function cardHTML(c, st) {
  const editavel = ["nota", "pessoa", "foto", "token"].includes(c.tipo);
  return `<div class="qc ${c.tipo} ${c.tipo === "nota" ? esc(c.cor || "") : ""} ${ui.sel === c.id ? "sel" : ""} ${ui.novos.has(c.id) ? "novo" : ""}" data-card="${esc(c.id)}" tabindex="0"
      style="left:${c.x}px;top:${c.y}px;transform:${transformDe(c)}" aria-label="${esc(c.tipo === "token" ? c.titulo || "Token" : c.tipo)}" ${c.tipo === "token" ? `title="${esc(c.titulo || "Token")}"` : ""}>
    ${c.tipo === "token" ? "" : `<span class="pino"></span>`}
    <span class="ctl">${editavel ? `<button data-q="editar" data-id="${esc(c.id)}" title="Editar">✎</button>` : ""}<button data-q="tamMenos" data-id="${esc(c.id)}" title="Diminuir (tecla −)">−</button><button data-q="tamMais" data-id="${esc(c.id)}" title="Aumentar (tecla +)">＋</button><button data-q="ligarDe" data-id="${esc(c.id)}" title="Ligar com barbante">🧶</button><button data-q="apagar" data-id="${esc(c.id)}" class="${ui.confirmar === c.id ? "confirm" : ""}" title="${ui.confirmar === c.id ? "Clique de novo para tirar do quadro" : "Tirar do quadro"}">${ui.confirmar === c.id ? "?" : "✕"}</button></span>
    ${conteudo(c, st)}
    <span class="alca" data-alca title="Arraste para aumentar ou diminuir" aria-hidden="true"></span>
    ${c.autor && c.tipo !== "token" ? `<div class="autor">por ${esc(c.autor)}</div>` : ""}
  </div>`;
}
// cresce a partir do alfinete (meio do topo), então o barbante continua preso no mesmo lugar
function transformDe(c) { return `rotate(${c.tipo === "token" ? 0 : num(c.rot)}deg) scale(${TAM_OK(c.tam)})`; }
function mudarTam(id, fator) {
  const c = q.cards[id]; if (!c || c.del) return;
  const novo = { ...c, tam: TAM_OK(TAM_OK(c.tam) * fator) }; if (novo.tam === TAM_OK(c.tam)) return;
  const el = cartaoEl(id); if (el) el.style.transform = transformDe(novo);
  salvar({ cards: { [id]: novo }, fios: {} }); desenharFios();
}
function pinoDe(id) {
  const c = q.cards[id]; if (!c || c.del) return null;
  const el = document.querySelector(`[data-card="${CSS.escape(id)}"]`);
  const w = el ? el.offsetWidth : 170;
  return { x: c.x + w / 2, y: c.y + 1 };
}
function desenharFios() {
  const svg = $("fios"); let html = ""; const rotulos = [];
  for (const f of vivos(q, "fios")) {
    const a = pinoDe(f.a), b = pinoDe(f.b); if (!a || !b) continue;
    const dx = b.x - a.x, dy = b.y - a.y; const dist = Math.hypot(dx, dy);
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 + Math.min(120, dist * 0.12); // barbante cede no meio
    const d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    html += `<path class="alvo" data-fio="${esc(f.id)}" d="${d}"/><path class="fio ${f.cor === "preto" ? "preto" : ""} ${ui.fioSel === f.id ? "sel" : ""}" d="${d}"/>`;
    if (f.rotulo) rotulos.push(`<span class="rotulo" data-fio="${esc(f.id)}" style="left:${mx.toFixed(0)}px;top:${((a.y + b.y) / 2 + Math.min(120, dist * 0.12) / 2).toFixed(0)}px">${esc(f.rotulo)}</span>`);
  }
  svg.innerHTML = html;
  document.querySelectorAll("#cartoes .rotulo").forEach((x) => x.remove());
  $("cartoes").insertAdjacentHTML("beforeend", rotulos.join(""));
}
function desenhar() {
  if (arraste) return; // não redesenha no meio do arraste
  const st = hx();
  const cards = vivos(q, "cards").sort((a, b) => num(a.at) - num(b.at));
  $("cartoes").innerHTML = (cards.length ? "" : `<div class="vazio">O quadro está vazio.<br>Prenda uma nota, uma pista ou uma criatura e ligue tudo com barbante.</div>`) + cards.map((c) => cardHTML(c, st)).join("");
  desenharFios();
  acoes();
  IMG.preencher($("cartoes")).then(pedirImagens);
  setTimeout(() => ui.novos.clear(), 600);
  if (ui.editando) { const t = document.querySelector(`[data-card="${CSS.escape(ui.editando)}"] [data-ed]`); if (t && document.activeElement?.dataset?.ed === undefined) t.focus(); }
}
function acoes() {
  $("acoes").innerHTML = `<button data-q="nota" title="Prender um papel com anotação">📝 Nota</button><button data-q="pista" title="Prender um documento do Arquivo">📜 Pista</button>
    <button data-q="criatura" title="Prender uma criatura do Bestiário">🐾 Criatura</button><button data-q="pessoa" title="Prender uma pessoa (suspeito, NPC)">👤 Pessoa</button><button data-q="foto" title="Prender uma foto por link">📷 Foto</button>${obrOk ? `<button data-q="token" title="Prender um token do mapa">🎭 Token</button>` : ""}
    <button data-q="ligar" class="${ui.ligar ? "on" : ""}" title="Clique em dois cartões para ligar com barbante">🧶 Ligar</button>
    ${isGM() ? `<button data-q="limpar" class="perigo ${ui.confirmar === "limpar" ? "on" : ""}" title="Tira tudo do quadro, para todos">${ui.confirmar === "limpar" ? "Confirmar: limpar tudo?" : "🗑 Limpar"}</button>` : ""}`;
  $("zoomTxt").textContent = Math.round(zoom * 100) + "%";
}
function aplicarZoom(z, foco) {
  const v = $("vista"); const antes = zoom;
  zoom = clamp(Math.round(z * 100) / 100, 0.3, 1.6); localStorage.setItem(NS + ":qzoom", String(zoom));
  $("quadro").style.transform = `scale(${zoom})`; $("escala").style.width = LARG * zoom + "px"; $("escala").style.height = ALT * zoom + "px";
  const fx = foco?.x ?? v.clientWidth / 2, fy = foco?.y ?? v.clientHeight / 2;
  v.scrollLeft = ((v.scrollLeft + fx) / antes) * zoom - fx; v.scrollTop = ((v.scrollTop + fy) / antes) * zoom - fy;
  $("zoomTxt").textContent = Math.round(zoom * 100) + "%";
}
let dicaTimer;
function dica(t, fixa = false) { const d = $("dica"); d.textContent = t; d.classList.toggle("on", !!t); clearTimeout(dicaTimer); if (t && !fixa) dicaTimer = setTimeout(() => d.classList.remove("on"), 3500); }

/* ---------- Janelas ---------- */
function janela(html, cls = "") {
  $("camada").innerHTML = `<div class="fundo" data-q="fecharJanela"></div><div class="janela ${cls}" role="dialog">${html}</div>`;
  $("camada").querySelector("input,textarea,button:not([data-q=fecharJanela])")?.focus();
}
function fecharJanela() { $("camada").innerHTML = ""; ui.fioSel = null; desenharFios(); }
function escolherPista() {
  const st = hx(); const ps = pistasVisiveis(st);
  janela(`<h3>Prender uma pista</h3>${ps.length ? `<div class="lista">${ps.map((p) => `<button data-q="addPista" data-id="${esc(p.id)}">📜 ${esc(p.titulo || "Documento")}${p.texto ? `<br><span class="muted">${esc(p.texto.slice(0, 80))}</span>` : ""}</button>`).join("")}</div>` : `<p class="muted">${isGM() ? "Nenhuma pista revelada ainda. Revele no Hexatombe → Arquivo → Pistas." : "O grupo ainda não encontrou pistas."}</p>`}
    <div class="linha"><button data-q="fecharJanela">Fechar</button></div>`);
}
/* Tokens da cena aberta no Owlbear (jogadores só veem os visíveis) */
let tokensCena = [];
async function escolherToken() {
  janela(`<h3>Prender um token do mapa</h3><p class="muted">Procurando tokens na cena…</p>`);
  try {
    if (!(await OBR.scene.isReady())) { janela(`<h3>Prender um token do mapa</h3><p class="muted">Abra uma cena no Owlbear primeiro.</p><div class="linha"><button data-q="fecharJanela">Fechar</button></div>`); return; }
    const its = (await OBR.scene.items.getItems((it) => tokenServe(it, isGM()))).sort((a, b) => nomeToken(a).localeCompare(nomeToken(b)));
    // tokens repetidos (mesma imagem e nome) aparecem uma vez só
    const vistos = new Set(); tokensCena = its.filter((it) => { const k = nomeToken(it) + "|" + it.image.url; if (vistos.has(k)) return false; vistos.add(k); return true; });
  } catch { tokensCena = []; }
  janela(`<h3>Prender um token do mapa</h3>${tokensCena.length ? `<input id="tkBusca" placeholder="🔍 Buscar…" style="width:100%;margin-bottom:8px"><div class="lista tokens">${tokensCena.map((it, i) => `<button data-q="addToken" data-i="${i}" data-nome="${esc(nomeToken(it).toLowerCase())}"><img src="${esc(it.image.url)}" alt="" loading="lazy"> ${esc(nomeToken(it))}${isGM() && it.visible === false ? ' <span class="muted">(escondido)</span>' : ""}</button>`).join("")}</div>`
    : `<p class="muted">Nenhum token nesta cena.</p>`}
    <p class="muted">Também dá para clicar com o botão direito num token do mapa → “📌 Prender no quadro”.</p><div class="linha"><button data-q="fecharJanela">Fechar</button></div>`);
  $("tkBusca")?.addEventListener("input", (e) => { const t = e.target.value.toLowerCase(); document.querySelectorAll("[data-q=addToken]").forEach((b) => { b.style.display = b.dataset.nome.includes(t) ? "" : "none"; }); });
}
function escolherCriatura() {
  const st = hx(); const cs = criaturasVisiveis(st);
  janela(`<h3>Prender uma criatura</h3>${cs.length ? `<div class="lista">${cs.map((c) => `<button data-q="addCriatura" data-id="${esc(c.k)}">🐾 ${c.r.n >= 2 ? esc(c.nome) : "??? (pressentida)"} <span class="muted">· ${NIVEL_CURTO[c.r.n]}</span></button>`).join("")}</div>` : `<p class="muted">Nenhuma criatura no Bestiário ainda.</p>`}
    <div class="linha"><button data-q="fecharJanela">Fechar</button></div>`);
}
function lerPista(id) {
  const st = hx(); const p = (st?.pistas || []).find((x) => x.id === id); if (!p || !pistaVisivel(st, p)) return;
  const img = IMG.ehArq(p.img) ? `<img data-arq="${esc(IMG.arqId(p.img))}" alt="">` : /^https?:\/\//.test(p.img || "") ? `<img src="${esc(p.img)}" alt="">` : "";
  janela(`<h3>${esc(p.titulo || "Documento")}</h3>${img}<div class="txt">${esc(p.texto || "")}</div><div class="linha"><button data-q="fecharJanela">Fechar</button></div>`, "leitor");
  IMG.preencher($("camada")).then(pedirImagens);
}
function editarFio(id) {
  const f = q.fios[id]; if (!f || f.del) return;
  ui.fioSel = id; desenharFios();
  janela(`<h3>Barbante</h3><div class="linha"><input id="fRot" maxlength="60" value="${esc(f.rotulo)}" placeholder="O que liga os dois? (ex.: “viu no lago”, “mentiu”)"></div>
    <div class="linha"><span class="muted">Cor:</span><button data-q="fioCor" data-cor="vermelho" class="${f.cor !== "preto" ? "on" : ""}">Vermelho</button><button data-q="fioCor" data-cor="preto" class="${f.cor === "preto" ? "on" : ""}">Preto (dúvida)</button></div>
    <div class="linha"><button data-q="fioOk" data-id="${esc(id)}">OK</button><button class="perigo" data-q="fioApagar" data-id="${esc(id)}">✂ Cortar o barbante</button></div>`);
  const inp = $("fRot"); inp?.addEventListener("keydown", (e) => { if (e.key === "Enter") document.querySelector('[data-q="fioOk"]')?.click(); });
}

/* ---------- Imagens que faltam (vêm do mestre) ---------- */
const pedidas = new Set();
async function pedirImagens(falta) {
  if (!obrOk || isGM() || !falta?.length) return;
  const novas = falta.filter((id) => !pedidas.has(id)); if (!novas.length) return;
  novas.forEach((id) => pedidas.add(id));
  const str = JSON.stringify({ kind: "pedeImg", ids: novas.slice(0, 12) });
  OBR.broadcast.sendMessage(SYNC, { m: novoId(), i: 0, n: 1, d: str }).catch(() => {});
  setTimeout(() => novas.forEach((id) => pedidas.delete(id)), 30000);
  setTimeout(() => IMG.preencher(document.body), 4000);
}

/* ---------- Cliques ---------- */
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-q]");
  const fioEl = e.target.closest("[data-fio]");
  if (!b && fioEl) return editarFio(fioEl.dataset.fio);
  const cardEl = e.target.closest("[data-card]");
  if (!b && cardEl && ui.ligar) {
    const id = cardEl.dataset.card;
    if (!ui.sel) { ui.sel = id; dica("Agora clique no outro cartão.", true); desenhar(); return; }
    const a = ui.sel; ui.sel = null; dica(""); ligar(a, id); return;
  }
  if (!b) { if (ui.confirmar) { ui.confirmar = null; desenhar(); } return; }
  const a = b.dataset.q; const id = b.dataset.id;
  switch (a) {
    case "fechar": if (obrOk) OBR.modal.close(MODAL); else window.close(); return;
    case "fecharJanela": return fecharJanela();
    case "zoomMais": return aplicarZoom(zoom + 0.1);
    case "zoomMenos": return aplicarZoom(zoom - 0.1);
    case "caber": { const v = $("vista"); return aplicarZoom(Math.min(v.clientWidth / LARG, v.clientHeight / ALT)); }
    case "nota": { const c = novoCard("nota", { cor: "" }); ui.editando = c.id; return desenhar(); }
    case "pessoa": { const c = novoCard("pessoa"); ui.editando = c.id; return desenhar(); }
    case "foto": { const c = novoCard("foto"); ui.editando = c.id; return desenhar(); }
    case "pista": return escolherPista();
    case "criatura": return escolherCriatura();
    case "addPista": fecharJanela(); novoCard("pista", { ref: id }); return;
    case "addCriatura": fecharJanela(); novoCard("criatura", { ref: id }); return;
    case "token": return escolherToken();
    case "addToken": {
      const it = tokensCena[Number(b.dataset.i)]; if (!it) return; fecharJanela();
      const v = $("vista"); const c = cardDeToken(it, me.name, (v.scrollLeft + v.clientWidth / 2) / zoom, (v.scrollTop + v.clientHeight / 2) / zoom);
      ui.novos.add(c.id); salvar({ cards: { [c.id]: c }, fios: {} }); desenhar(); return;
    }
    case "ler": return lerPista(id);
    case "ligar": ui.ligar = !ui.ligar; ui.sel = null; dica(ui.ligar ? "Clique em dois cartões para ligá-los com barbante." : "", ui.ligar); return desenhar();
    case "ligarDe": ui.ligar = true; ui.sel = id; dica("Agora clique no outro cartão.", true); return desenhar();
    case "editar": ui.editando = id; return desenhar();
    case "tamMais": return mudarTam(id, 1.15);
    case "tamMenos": return mudarTam(id, 1 / 1.15);
    case "edOk": return terminarEdicao();
    case "cor": { const c = q.cards[ui.editando]; if (c) { gravarEdicao(); c.cor = b.dataset.cor; salvar({ cards: { [c.id]: { ...c } }, fios: {} }); desenhar(); } return; }
    case "apagar": if (ui.confirmar !== id) { ui.confirmar = id; return desenhar(); } ui.confirmar = null; return apagarCard(id);
    case "limpar": {
      if (ui.confirmar !== "limpar") { ui.confirmar = "limpar"; return acoes(); }
      ui.confirmar = null; const cards = {}, fios = {};
      for (const c of vivos(q, "cards")) cards[c.id] = { id: c.id, del: true };
      for (const f of vivos(q, "fios")) fios[f.id] = { id: f.id, del: true };
      salvar({ cards, fios }); return desenhar();
    }
    case "fioOk": { const f = q.fios[id]; if (f) salvar({ cards: {}, fios: { [id]: { ...f, rotulo: $("fRot")?.value.trim().slice(0, 60) || "" } } }); fecharJanela(); return; }
    case "fioCor": { const f = q.fios[ui.fioSel]; if (!f) return; salvar({ cards: {}, fios: { [f.id]: { ...f, rotulo: $("fRot")?.value.trim().slice(0, 60) ?? f.rotulo, cor: b.dataset.cor } } }); return editarFio(f.id); }
    case "fioApagar": salvar({ cards: {}, fios: { [id]: { id, del: true } } }); fecharJanela(); return;
  }
});
function gravarEdicao() {
  const c = q.cards[ui.editando]; if (!c) return;
  const box = document.querySelector(`[data-card="${CSS.escape(c.id)}"]`); if (!box) return;
  const novo = { ...c };
  box.querySelectorAll("[data-ed]").forEach((el) => { novo[el.dataset.ed] = el.value.trim().slice(0, el.dataset.ed === "txt" ? 500 : 600); });
  if (novo.url && !/^https:\/\//i.test(novo.url)) { dica("O link da foto precisa começar com https://"); novo.url = ""; }
  if (JSON.stringify(novo) !== JSON.stringify(c)) salvar({ cards: { [c.id]: novo }, fios: {} });
}
function terminarEdicao() { gravarEdicao(); ui.editando = null; desenhar(); }
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { if ($("camada").innerHTML) return fecharJanela(); if (ui.editando) return terminarEdicao(); if (ui.ligar) { ui.ligar = false; ui.sel = null; dica(""); desenhar(); } }
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && ui.editando) terminarEdicao();
});
document.addEventListener("dblclick", (e) => {
  const el = e.target.closest("[data-card]"); if (!el || ui.ligar) return;
  const c = q.cards[el.dataset.card]; if (c && ["nota", "pessoa", "foto", "token"].includes(c.tipo)) { ui.editando = c.id; desenhar(); }
});

/* ---------- Arrastar ----------
   Os movimentos são ouvidos na página inteira (não só no cartão), para o arraste
   não se perder dentro da janela do Owlbear; e o navegador não pode iniciar o
   "arrastar texto/imagem" dele, que cancelaria o nosso. */
let arraste = null;
function cartaoEl(id) { return document.querySelector(`[data-card="${CSS.escape(id)}"]`); }
document.addEventListener("dragstart", (e) => { if (e.target.closest?.("#quadro")) e.preventDefault(); });
$("cartoes").addEventListener("pointerdown", (e) => {
  const el = e.target.closest("[data-card]"); if (!el || ui.ligar) return;
  if (e.pointerType === "mouse" && e.button !== 0) return;
  if (e.target.closest("button,textarea,input,select,[data-ed]")) return;
  const c = q.cards[el.dataset.card]; if (!c) return;
  const alca = !!e.target.closest("[data-alca]");
  if (ui.editando === c.id && !alca) return; // escrevendo neste cartão
  if (ui.editando && ui.editando !== c.id) terminarEdicao(); // clicou em outro: termina a edição e já pode arrastar
  e.preventDefault(); // sem seleção de texto nem arraste do próprio navegador
  arraste = { id: c.id, x0: e.clientX, y0: e.clientY, cx: c.x, cy: c.y, mexeu: false, pid: e.pointerId,
    modo: alca ? "tam" : "mover", t0: TAM_OK(c.tam), w: el.offsetWidth || 170, h: el.offsetHeight || 120 };
  const atual = cartaoEl(c.id); atual?.classList.add("arrasta"); atual?.focus({ preventScroll: true });
  try { atual?.setPointerCapture(e.pointerId); } catch { /* segue sem captura: a página toda escuta */ }
});
document.addEventListener("pointermove", (e) => {
  if (!arraste || (arraste.pid !== undefined && e.pointerId !== arraste.pid)) return;
  if (e.pointerType === "mouse" && e.buttons === 0) return soltar(); // soltou fora da janela
  const dx = (e.clientX - arraste.x0) / zoom, dy = (e.clientY - arraste.y0) / zoom;
  if (!arraste.mexeu && Math.hypot(dx, dy) < 3) return;
  arraste.mexeu = true;
  const c = q.cards[arraste.id]; if (!c || c.del) { arraste = null; return; }
  if (arraste.modo === "tam") {
    // o canto de baixo à direita anda w/2 na horizontal e h na vertical para cada +1 de tamanho
    const tam = TAM_OK(arraste.t0 + (dx / (arraste.w / 2) + dy / arraste.h) / 2);
    q.cards[arraste.id] = { ...c, tam };
    const el = cartaoEl(arraste.id); if (el) { el.style.transform = transformDe(q.cards[arraste.id]); el.classList.add("arrasta"); }
    desenharFios(); salvarDevagar({ ...q.cards[arraste.id] }); return;
  }
  const x = clamp(arraste.cx + dx, 0, LARG - 60), y = clamp(arraste.cy + dy, 0, ALT - 60);
  q.cards[arraste.id] = { ...c, x, y };
  const el = cartaoEl(arraste.id); // pode ter sido redesenhado no meio do caminho
  if (el) { el.style.left = x + "px"; el.style.top = y + "px"; el.classList.add("arrasta"); }
  desenharFios(); salvarDevagar({ ...q.cards[arraste.id] });
});
function soltar() {
  if (!arraste) return;
  const a = arraste; arraste = null;
  cartaoEl(a.id)?.classList.remove("arrasta");
  if (a.mexeu) salvar({ cards: { [a.id]: { ...q.cards[a.id] } }, fios: {} });
}
document.addEventListener("pointerup", soltar);
document.addEventListener("pointercancel", soltar);
window.addEventListener("blur", soltar);
// setas do teclado movem o cartão selecionado (Shift = passo maior)
document.addEventListener("keydown", (e) => {
  const el = document.activeElement?.closest?.("[data-card]"); if (!el || ui.editando) return;
  if (["+", "=", "-", "_"].includes(e.key) && !e.ctrlKey && !e.metaKey) { e.preventDefault(); return mudarTam(el.dataset.card, e.key === "+" || e.key === "=" ? 1.15 : 1 / 1.15); }
  const passo = e.shiftKey ? 40 : 10; const d = { ArrowLeft: [-passo, 0], ArrowRight: [passo, 0], ArrowUp: [0, -passo], ArrowDown: [0, passo] }[e.key];
  if (!d) return; e.preventDefault();
  const c = q.cards[el.dataset.card]; if (!c) return;
  const novo = { ...c, x: clamp(c.x + d[0], 0, LARG - 60), y: clamp(c.y + d[1], 0, ALT - 60) };
  el.style.left = novo.x + "px"; el.style.top = novo.y + "px";
  salvar({ cards: { [c.id]: novo }, fios: {} }); desenharFios();
});
// arrastar o fundo do quadro rola a vista
let rolando = null;
$("vista").addEventListener("pointerdown", (e) => { if (e.target.closest("[data-card],[data-fio],.rotulo") || e.button !== 0) return; if (ui.editando) terminarEdicao(); rolando = { x: e.clientX, y: e.clientY, l: $("vista").scrollLeft, t: $("vista").scrollTop }; });
window.addEventListener("pointermove", (e) => { if (!rolando) return; $("vista").scrollLeft = rolando.l - (e.clientX - rolando.x); $("vista").scrollTop = rolando.t - (e.clientY - rolando.y); });
window.addEventListener("pointerup", () => { rolando = null; });
$("vista").addEventListener("wheel", (e) => { if (!e.ctrlKey) return; e.preventDefault(); const r = $("vista").getBoundingClientRect(); aplicarZoom(zoom * (e.deltaY < 0 ? 1.1 : 0.9), { x: e.clientX - r.left, y: e.clientY - r.top }); }, { passive: false });

/* ---------- Mudanças vindas de fora ---------- */
window.addEventListener("storage", (e) => {
  if (e.key === qKey(roomId) && !arraste) {
    const antes = new Set(vivos(q, "cards").map((c) => c.id));
    if (!mesclar(q, ler(roomId))) return;
    for (const c of vivos(q, "cards")) if (!antes.has(c.id)) ui.novos.add(c.id);
    if (!ui.editando) desenhar(); else desenharFios();
  }
  if (e.key === `${NS}:state:${roomId}` && !ui.editando) desenhar();
});

/* ---------- Início ---------- */
function iniciar() {
  q = ler(roomId);
  aplicarZoom(zoom); desenhar();
  if (!vivos(q, "cards").length) { const v = $("vista"); v.scrollLeft = (LARG * zoom - v.clientWidth) / 2; v.scrollTop = (ALT * zoom - v.clientHeight) / 3; }
}
if (OBR.isAvailable) {
  OBR.onReady(async () => {
    obrOk = true; roomId = OBR.room.id;
    [role, me.id, me.name] = await Promise.all([OBR.player.getRole(), OBR.player.getId(), OBR.player.getName()]);
    enviar = enviador(OBR);
    // a janela também ouve direto, para não depender do fundo
    OBR.broadcast.onMessage(QCH, (ev) => recebe(ev.data));
    iniciar();
    enviar({ k: "pede" }); // quem tiver o quadro manda a versão completa
    OBR.player.onChange((p) => { if (p.role !== role) { role = p.role; desenhar(); } });
  });
} else {
  if (new URLSearchParams(location.search).has("gm")) role = "GM";
  iniciar();
}
const recebe = receptor((p) => {
  if ((p.k === "op" || p.k === "tudo") && p.q) {
    const antes = new Set(vivos(q, "cards").map((c) => c.id));
    if (mesclar(q, p.q)) { gravar(roomId, q); for (const c of vivos(q, "cards")) if (!antes.has(c.id)) ui.novos.add(c.id); if (!ui.editando) desenhar(); else desenharFios(); }
  }
});
