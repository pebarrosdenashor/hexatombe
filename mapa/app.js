/* =========================================================
   Mapa do Hexatombe — Bom Jesus do Açude (Owlbear Rodeo)
   Mestre: escolhe o que os jogadores sabem de cada local e edita tudo.
   Jogadores: veem o mapa do dia e só o que foi liberado.
   Lê o dia da extensão "Hexatombe" quando ela está na sala.
   ========================================================= */
import OBR, { buildImage } from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
import { montarCidade, alagaPorPosicao, COTA, CSS_MAPA, el } from "./cidade.js";
import { LOCAIS_PADRAO, EQUIPES, TIPOS, DIAS_MESTRE, DIAS_JOGADOR } from "./locais.js";

const NS = "io.github.pebarrosdenashor.hexatombe-mapa";
const PUB = NS + "/pub";
const IMG_KEY = NS + "/imagem";
const MODAL_ID = NS + "/tela";
const HEX_STATE = "io.github.pebarrosdenashor.hexatombe/state";
const BASE = new URL(".", location.href).href;
const params = new URLSearchParams(location.search);
const modoTela = params.get("modo") === "tela";
const LIMITE = 14000;

let obr = false, gm = true, sala = "demo", cenaPronta = false;
let estado = null, pub = null, hexDia = null;
const ui = { sel: null, verComo: false, posicionando: null, apagar: false, restaurar: false, aviso: "" };

/* ---------- utilidades ---------- */
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const lsKey = () => NS + "/gm/" + sala;
const lsGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* sem armazenamento */ } };
const alagaDe = (l) => (l.alaga === null || l.alaga === undefined || l.alaga === "") ? alagaPorPosicao(l.x, l.y) : +l.alaga;
const hexagono = (r) => { let p = ""; for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i - Math.PI / 2; p += (i ? "L" : "M") + (r * Math.cos(a)).toFixed(1) + "," + (r * Math.sin(a)).toFixed(1); } return p + "Z"; };
const corEq = (eq) => EQUIPES[eq] || "#e6dcc4";

/* ---------- estado do mestre ---------- */
function localPadrao(d) {
  return {
    id: d.id || uid(), nome: d.nome || "Novo local", tipo: d.tipo || "explorar", eq: d.eq || "",
    x: d.x ?? 500, y: d.y ?? 350, lx: d.lx, ly: d.ly, anchor: d.anchor,
    alaga: d.alaga ?? null, txt: d.txt || "", alerta: d.alerta || "", notas: "",
    din: (d.din || []).map((t) => ({ id: uid(), t, v: false })),
    estado: "oculto", rev: { eq: false, txt: false, alerta: false, alaga: false }, desde: {}
  };
}
function novoEstado() {
  const s = { v: 1, dia: 1, seguir: true, auto: true, locais: LOCAIS_PADRAO.map(localPadrao), log: [] };
  const forca = s.locais.find((l) => l.id === "forca");
  if (forca) { revelarTudo(forca, 1, false); }
  const igreja = s.locais.find((l) => l.id === "igreja");
  if (igreja) { igreja.estado = "avistado"; igreja.desde.avistado = 1; }
  return s;
}
function carregar() {
  const raw = lsGet(lsKey());
  if (raw) { try { const s = JSON.parse(raw); if (s?.locais) return s; } catch { /* arquivo corrompido */ } }
  return novoEstado();
}
let pubTimer;
function salvar({ painel = true } = {}) {
  lsSet(lsKey(), JSON.stringify(estado));
  desenharMapa();
  if (painel) renderPainel();
  clearTimeout(pubTimer);
  pubTimer = setTimeout(publicar, 400);
}
function registrar(t) { estado.log.push({ dia: diaAtual(), t, at: Date.now() }); if (estado.log.length > 300) estado.log.shift(); }

function revelarTudo(l, dia, log = true) {
  l.estado = "explorado"; l.desde.explorado ??= dia; l.desde.avistado ??= dia;
  l.rev = { eq: true, txt: true, alerta: true, alaga: true };
  l.din.forEach((d) => d.v = true);
  if (log) registrar(`${l.nome}: tudo liberado`);
}

/* visão que os jogadores recebem */
function montarPub() {
  return {
    rev: Date.now(), dia: estado.dia, seguir: estado.seguir,
    locais: estado.locais.filter((l) => l.estado !== "oculto").map((l) => {
      const o = { id: l.id, nome: l.nome, x: Math.round(l.x), y: Math.round(l.y), estado: l.estado, desde: l.desde?.[l.estado] || l.desde?.avistado || null };
      if (l.lx !== undefined) o.lx = l.lx; if (l.ly !== undefined) o.ly = l.ly; if (l.anchor) o.anchor = l.anchor;
      if (l.estado === "explorado") o.tipo = l.tipo;
      if (l.rev.eq && l.eq) { o.eq = l.eq; o.tipo = l.tipo; }
      if (l.rev.txt && l.txt) o.txt = l.txt;
      const din = l.din.filter((d) => d.v && d.t.trim()).map((d) => d.t);
      if (din.length) o.din = din;
      if (l.rev.alerta && l.alerta) o.alerta = l.alerta;
      if (l.rev.alaga) o.alaga = alagaDe(l);
      return o;
    })
  };
}
async function publicar() {
  const p = montarPub();
  const tam = JSON.stringify(p).length;
  ui.aviso = tam > LIMITE ? `O que está liberado passou do limite do Owlbear (${tam} de ${LIMITE} caracteres). Esconda alguns textos ou encurte.` : "";
  if (!obr || !cenaPronta || tam > LIMITE) { if (gm) renderAviso(); return; }
  try { await OBR.scene.setMetadata({ [PUB]: p }); } catch { ui.aviso = "Não deu para salvar na cena. Abra a cena da arena."; }
  renderAviso();
}

/* ---------- dia ---------- */
function diaAtual() {
  const base = gm ? estado : pub;
  if (!base) return 1;
  return base.seguir && hexDia ? hexDia : (base.dia || 1);
}

/* ---------- mapa ---------- */
const svg = document.getElementById("mapa");
const style = document.createElement("style"); style.textContent = CSS_MAPA; document.head.appendChild(style);
const cidade = montarCidade(svg, LOCAIS_PADRAO.filter((l) => l.id !== "igreja").map((l) => [l.x, l.y]));
LOCAIS_PADRAO.find((l) => l.id === "igreja").x = cidade.igreja[0];
LOCAIS_PADRAO.find((l) => l.id === "igreja").y = cidade.igreja[1];

function locaisVisiveis() {
  if (gm && !ui.verComo) return estado.locais.map((l) => ({ ...l, oculto: l.estado === "oculto", af: alagaDe(l) }));
  const p = gm ? montarPub() : pub;
  return (p?.locais || []).map((l) => ({ ...l, af: l.alaga ?? alagaPorPosicao(l.x, l.y) }));
}

const vb = { x: 0, y: 0, w: 1000 };
function escalaMarcador() {
  const px = svg.getBoundingClientRect().width || 1000;
  return Math.max(Math.pow(vb.w / 1000, .75), vb.w / px * .65);   // na janela estreita, nomes um pouco maiores
}
new ResizeObserver(() => aplicaZoom()).observe(svg);

function desenharMapa() {
  const dia = diaAtual();
  cidade.setDia(dia);
  const camada = cidade.camada; camada.innerHTML = "";
  const k = escalaMarcador();
  const visao = gm && !ui.verComo ? "mestre" : "jogador";
  for (const l of locaisVisiveis()) {
    const g = el("g", { class: "loc", transform: `translate(${l.x},${l.y}) scale(${k.toFixed(3)})`, tabindex: "0", role: "button", "aria-label": l.nome, "data-id": l.id });
    const conhecido = visao === "mestre" || l.tipo;
    const cor = l.eq ? corEq(l.eq) : "#e6dcc4";
    let halo, forma;
    if (conhecido && l.tipo === "base") { halo = el("path", { class: "halo", d: hexagono(20) }); forma = el("path", { d: hexagono(13), fill: cor, stroke: "#14171a", "stroke-width": 2 }); }
    else if (conhecido && l.tipo === "enigma") { halo = el("path", { class: "halo", d: "M0,-20 L20,0 L0,20 L-20,0 Z" }); forma = el("path", { d: "M0,-12 L12,0 L0,12 L-12,0 Z", fill: "#b23a2e", stroke: "#14171a", "stroke-width": 2 }); }
    else if (conhecido) { halo = el("circle", { class: "halo", r: 13 }); forma = el("circle", { r: 6.5, fill: "#e6dcc4", stroke: "#14171a", "stroke-width": 2 }); }
    else { halo = el("circle", { class: "halo", r: 13 }); forma = el("circle", { r: 7, fill: "#14171a", stroke: "#e6dcc4", "stroke-width": 2, "stroke-dasharray": "3 2" }); }
    g.append(halo, forma);
    const anc = l.anchor || "middle";
    const tx = el("text", { x: l.lx ?? 0, y: l.ly ?? (l.anchor ? 5 : (l.tipo === "base" && conhecido ? 32 : 22)), "text-anchor": anc });
    tx.textContent = l.nome; g.appendChild(tx);
    if (l.oculto) g.classList.add("oculto");
    if (l.af && dia >= l.af) g.classList.add("afogado");
    if (l.id === ui.sel) g.classList.add("sel");
    if (conhecido && l.tipo === "base") g.classList.add("base");
    g.addEventListener("click", (e) => { e.stopPropagation(); if (arrastou || ui.posicionando) return; ui.sel = l.id; ui.apagar = false; renderTudo(); });
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ui.sel = l.id; renderTudo(); } });
    camada.appendChild(g);
  }
  document.getElementById("cota").textContent = "cota " + COTA[dia - 1] + " m";
  document.getElementById("mapbox").classList.toggle("posicionando", !!ui.posicionando);
}

/* ---------- zoom e arrasto ---------- */
const MINW = 180;
function aplicaZoom() {
  vb.w = Math.min(1000, Math.max(MINW, vb.w)); const h = vb.w * .7;
  vb.x = Math.min(1000 - vb.w, Math.max(0, vb.x)); vb.y = Math.min(700 - h, Math.max(0, vb.y));
  svg.setAttribute("viewBox", `${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${h.toFixed(1)}`);
  const k = escalaMarcador().toFixed(3);
  svg.querySelectorAll(".loc").forEach((g) => g.setAttribute("transform", g.getAttribute("transform").replace(/scale\([^)]*\)/, `scale(${k})`)));
  document.getElementById("z-nivel").textContent = (1000 / vb.w).toFixed(1).replace(".0", "") + "×";
}
const pt = (cx, cy) => { const r = svg.getBoundingClientRect(); return [vb.x + (cx - r.left) / r.width * vb.w, vb.y + (cy - r.top) / r.height * vb.w * .7]; };
function zoomEm(px, py, f) { const nw = Math.min(1000, Math.max(MINW, vb.w * f)), k = nw / vb.w; vb.x = px - (px - vb.x) * k; vb.y = py - (py - vb.y) * k; vb.w = nw; aplicaZoom(); }
const centroVB = () => [vb.x + vb.w / 2, vb.y + vb.w * .35];
document.getElementById("z-mais").onclick = () => zoomEm(...centroVB(), 1 / 1.5);
document.getElementById("z-menos").onclick = () => zoomEm(...centroVB(), 1.5);
document.getElementById("z-reset").onclick = () => { vb.x = 0; vb.y = 0; vb.w = 1000; aplicaZoom(); };
svg.addEventListener("wheel", (e) => { e.preventDefault(); const [px, py] = pt(e.clientX, e.clientY); zoomEm(px, py, Math.exp(e.deltaY * .0015)); }, { passive: false });
svg.addEventListener("dblclick", (e) => { if (ui.posicionando) return; const [px, py] = pt(e.clientX, e.clientY); zoomEm(px, py, 1 / 1.8); });
const toques = new Map(); let arrastou = false, inicio = null, pinca = null;
svg.addEventListener("pointerdown", (e) => {
  toques.set(e.pointerId, [e.clientX, e.clientY]);
  if (toques.size === 1) { arrastou = false; inicio = [e.clientX, e.clientY]; }
  if (toques.size === 2) { const [a, b] = [...toques.values()]; pinca = { d: Math.hypot(a[0] - b[0], a[1] - b[1]) }; }
});
window.addEventListener("pointermove", (e) => {
  if (!toques.has(e.pointerId)) return;
  const prev = toques.get(e.pointerId); toques.set(e.pointerId, [e.clientX, e.clientY]);
  const r = svg.getBoundingClientRect();
  if (toques.size === 1) {
    if (!arrastou && Math.hypot(e.clientX - inicio[0], e.clientY - inicio[1]) > 5) { arrastou = true; svg.classList.add("arrastando"); }
    if (arrastou) { vb.x -= (e.clientX - prev[0]) / r.width * vb.w; vb.y -= (e.clientY - prev[1]) / r.height * vb.w * .7; aplicaZoom(); }
  } else if (toques.size === 2 && pinca) {
    arrastou = true;
    const [a, b] = [...toques.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
    const [px, py] = pt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
    zoomEm(px, py, pinca.d / d); pinca.d = d;
  }
});
const solta = (e) => { toques.delete(e.pointerId); if (toques.size < 2) pinca = null; if (!toques.size) { svg.classList.remove("arrastando"); setTimeout(() => { arrastou = false; }, 0); } };
window.addEventListener("pointerup", solta); window.addEventListener("pointercancel", solta);

// posicionar local (mestre)
svg.addEventListener("click", (e) => {
  if (!ui.posicionando || arrastou || !gm) return;
  const [x, y] = pt(e.clientX, e.clientY);
  if (ui.posicionando === "novo") {
    const l = localPadrao({ nome: "Novo local", x, y }); estado.locais.push(l); ui.sel = l.id;
    registrar(`Local criado: ${l.nome}`);
  } else {
    const l = estado.locais.find((z) => z.id === ui.posicionando);
    if (l) { l.x = x; l.y = y; delete l.lx; delete l.ly; delete l.anchor; }
  }
  ui.posicionando = null; salvar(); renderTopo();
});

/* ---------- topo ---------- */
function renderTopo() {
  const dia = diaAtual();
  const textos = gm && !ui.verComo ? DIAS_MESTRE : DIAS_JOGADOR;
  const seguindo = (gm ? estado.seguir : pub?.seguir) && hexDia;
  const botoes = gm && !ui.verComo
    ? [1, 2, 3, 4, 5, 6].map((d) => `<button type="button" class="dia-btn" data-dia="${d}" aria-pressed="${d === dia}" ${seguindo ? "disabled" : ""}>${d}</button>`).join("")
    : `<span class="dia-fixo">Dia ${dia}</span>`;
  const acoes = [];
  if (gm) acoes.push(`<button type="button" class="ghost" id="b-vercomo" aria-pressed="${ui.verComo}">${ui.verComo ? "Voltar ao mestre" : "Ver como jogador"}</button>`);
  if (gm && !ui.verComo && obr) acoes.push(`<button type="button" class="ghost" id="b-cena">Pôr mapa do dia ${dia} na cena</button>`);
  if (obr) acoes.push(modoTela ? `<button type="button" class="ghost" id="b-fechar">Fechar</button>` : `<button type="button" class="ghost" id="b-tela">Tela cheia</button>`);
  document.getElementById("topo").innerHTML = `
    <div class="t-esq">
      <div class="eyebrow">Hexatombe · ${gm && !ui.verComo ? "mestre" : "arena"}</div>
      <h1>Bom Jesus do Açude</h1>
    </div>
    <div class="t-dir">
      <div class="dias" role="group" aria-label="Dia do ritual">${botoes}</div>
      ${seguindo && gm && !ui.verComo ? `<div class="mini">Dia vindo da extensão Hexatombe</div>` : ""}
    </div>
    <div class="dia-box"><strong>Dia ${dia} · ${esc(textos[dia][0])}</strong><span>${esc(textos[dia][1])}</span></div>
    <div class="acoes">${acoes.join("")}</div>`;
}
document.getElementById("topo").addEventListener("click", async (e) => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.dia) { estado.dia = +b.dataset.dia; salvar(); renderTopo(); if (estado.auto) atualizarImagemSeExistir(); return; }
  if (b.id === "b-vercomo") { ui.verComo = !ui.verComo; renderTudo(); return; }
  if (b.id === "b-cena") { await porMapaNaCena(diaAtual()); return; }
  if (b.id === "b-tela") { OBR.modal.open({ id: MODAL_ID, url: BASE + "index.html?modo=tela", fullScreen: true }); return; }
  if (b.id === "b-fechar") { OBR.modal.close(MODAL_ID); }
});

/* ---------- imagem na cena ---------- */
const urlImagem = (d) => BASE + `imagens/dia-${d}.png`;
async function porMapaNaCena(dia) {
  if (!obr || !cenaPronta) { ui.aviso = "Abra uma cena no Owlbear antes de pôr o mapa."; renderAviso(); return; }
  const itens = await OBR.scene.items.getItems((i) => i.metadata?.[IMG_KEY]);
  if (itens.length) {
    await OBR.scene.items.updateItems(itens.map((i) => i.id), (ds) => { for (const d of ds) { d.image.url = urlImagem(dia); d.name = `Bom Jesus do Açude · dia ${dia}`; d.metadata[IMG_KEY] = { dia }; } });
    OBR.notification.show(`Mapa da cena trocado para o dia ${dia}.`);
  } else {
    const item = buildImage({ width: 2000, height: 1400, url: urlImagem(dia), mime: "image/png" }, { dpi: 150, offset: { x: 0, y: 0 } })
      .layer("MAP").locked(true).name(`Bom Jesus do Açude · dia ${dia}`).metadata({ [IMG_KEY]: { dia } }).build();
    await OBR.scene.items.addItems([item]);
    OBR.notification.show(`Mapa do dia ${dia} colocado na cena.`);
  }
}
async function atualizarImagemSeExistir() {
  if (!obr || !cenaPronta) return;
  const itens = await OBR.scene.items.getItems((i) => i.metadata?.[IMG_KEY]);
  if (itens.length && itens[0].metadata[IMG_KEY].dia !== diaAtual()) await porMapaNaCena(diaAtual());
}

/* ---------- painel ---------- */
const painel = document.getElementById("painel");
function renderAviso() { const a = document.getElementById("aviso"); if (a) { a.textContent = ui.aviso; a.hidden = !ui.aviso; } }
function renderTudo() { renderTopo(); desenharMapa(); renderPainel(); }

function renderPainel() {
  if (gm && !ui.verComo) {
    const l = estado.locais.find((z) => z.id === ui.sel);
    painel.innerHTML = `<p class="aviso" id="aviso" ${ui.aviso ? "" : "hidden"}>${esc(ui.aviso)}</p>` + (l ? editorLocal(l) : listaMestre());
  } else {
    const p = gm ? montarPub() : pub;
    const l = p?.locais?.find((z) => z.id === ui.sel);
    painel.innerHTML = (gm ? `<p class="mini destaque">Prévia: é isso que os jogadores veem.</p>` : "") + (l ? fichaJogador(l) : listaJogador(p));
  }
}

const ESTADOS = { oculto: "Oculto", avistado: "Avistado", explorado: "Explorado" };
function chipEstado(e) { return `<span class="chip ${e}">${ESTADOS[e]}</span>`; }

function listaMestre() {
  const ordem = { explorado: 0, avistado: 1, oculto: 2 };
  const itens = [...estado.locais].sort((a, b) => ordem[a.estado] - ordem[b.estado] || a.nome.localeCompare(b.nome));
  const porDia = {};
  for (const r of estado.log) (porDia[r.dia] ||= []).push(r);
  const dias = Object.keys(porDia).sort((a, b) => b - a);
  return `
  <section class="bloco">
    <div class="bloco-topo"><h2>Locais</h2><button type="button" id="b-novo" class="${ui.posicionando === "novo" ? "ativo" : ""}">${ui.posicionando === "novo" ? "Clique no mapa…" : "+ Novo local"}</button></div>
    <ul class="lista">${itens.map((l) => `<li><button type="button" class="item" data-abrir="${l.id}">
      <span class="marca ${l.tipo}" style="--c:${l.eq ? corEq(l.eq) : "#e6dcc4"}"></span>
      <span class="nome">${esc(l.nome)}</span>${chipEstado(l.estado)}</button></li>`).join("")}</ul>
  </section>
  <section class="bloco">
    <h2>Liberado em cada dia</h2>
    ${dias.length ? dias.map((d) => `<h3>Dia ${d}</h3><ul class="log">${porDia[d].map((r) => `<li>${esc(r.t)}</li>`).join("")}</ul>`).join("") : `<p class="mini">Nada liberado ainda. Abra um local e mude o que os jogadores veem.</p>`}
  </section>
  <section class="bloco">
    <h2>Ajustes</h2>
    <label class="linha"><input type="checkbox" id="c-seguir" ${estado.seguir ? "checked" : ""}> Seguir o dia da extensão Hexatombe ${hexDia ? `(agora: dia ${hexDia})` : "(não encontrada na sala)"}</label>
    <label class="linha"><input type="checkbox" id="c-auto" ${estado.auto ? "checked" : ""}> Trocar a imagem do mapa na cena quando o dia mudar</label>
    <div class="botoes">
      <button type="button" class="ghost" id="b-exportar">Baixar cópia</button>
      <label class="ghost botao-arquivo">Carregar cópia<input type="file" id="f-importar" accept="application/json" hidden></label>
      <button type="button" class="ghost perigo" id="b-restaurar">${ui.restaurar ? "Confirmar: apagar tudo" : "Voltar ao padrão"}</button>
    </div>
    <p class="mini">Os textos e o que foi liberado ficam guardados neste navegador. Baixe uma cópia antes de trocar de computador.</p>
  </section>`;
}

function toggle(attr, on, rotulo = "Jogadores veem") {
  return `<label class="olho"><input type="checkbox" ${attr} ${on ? "checked" : ""}><span>${rotulo}</span></label>`;
}
function editorLocal(l) {
  const af = alagaDe(l);
  const eqOpts = [`<option value="">Nenhuma</option>`, ...Object.keys(EQUIPES).map((n) => `<option ${n === l.eq ? "selected" : ""}>${esc(n)}</option>`)].join("");
  const tipoOpts = Object.entries(TIPOS).map(([k, v]) => `<option value="${k}" ${k === l.tipo ? "selected" : ""}>${v}</option>`).join("");
  const alagaAuto = l.alaga === null || l.alaga === undefined || l.alaga === "";
  const alagaOpts = [`<option value="" ${alagaAuto ? "selected" : ""}>Pelo mapa (${af ? "dia " + af : "nunca"})</option>`, `<option value="0" ${!alagaAuto && +l.alaga === 0 ? "selected" : ""}>Nunca</option>`,
    ...[1, 2, 3, 4, 5, 6].map((d) => `<option value="${d}" ${!alagaAuto && +l.alaga === d ? "selected" : ""}>Dia ${d}</option>`)].join("");
  return `
  <div class="ed">
    <button type="button" class="voltar" data-voltar>← Todos os locais</button>
    <input class="titulo" data-f="nome" value="${esc(l.nome)}" aria-label="Nome do local">
    <div class="seg" role="group" aria-label="O que os jogadores sabem">
      ${Object.entries(ESTADOS).map(([k, v]) => `<button type="button" data-estado="${k}" aria-pressed="${l.estado === k}">${v}</button>`).join("")}
    </div>
    <p class="mini">${{ oculto: "Os jogadores não sabem que este lugar existe.", avistado: "Aparece no mapa só com o nome, mais o que você marcar abaixo.", explorado: "Aparece com o tipo e tudo o que estiver marcado abaixo." }[l.estado]}</p>
    <div class="botoes"><button type="button" data-tudo="1">Liberar tudo</button><button type="button" class="ghost" data-tudo="0">Esconder tudo</button></div>

    <div class="campo"><div class="campo-topo"><span>Tipo e equipe</span>${toggle('data-rev="eq"', l.rev.eq, "Jogadores sabem de quem é")}</div>
      <div class="dupla"><select data-f="tipo" aria-label="Tipo">${tipoOpts}</select><select data-f="eq" aria-label="Equipe">${eqOpts}</select></div></div>

    <div class="campo"><div class="campo-topo"><span>Descrição</span>${toggle('data-rev="txt"', l.rev.txt)}</div>
      <textarea data-f="txt" rows="3">${esc(l.txt)}</textarea></div>

    <div class="campo"><div class="campo-topo"><span>Detalhes</span><button type="button" class="mini-btn" data-din-add>+ Detalhe</button></div>
      <ul class="din">${l.din.map((d, i) => `<li>
        ${toggle(`data-din-rev="${i}"`, d.v, "")}
        <textarea data-din="${i}" rows="2" aria-label="Detalhe ${i + 1}">${esc(d.t)}</textarea>
        <button type="button" class="x" data-din-del="${i}" aria-label="Remover detalhe">×</button></li>`).join("")}</ul>
      ${l.din.length ? "" : `<p class="mini">Sem detalhes. Cada detalhe pode ser liberado separado.</p>`}</div>

    <div class="campo"><div class="campo-topo"><span>Alerta</span>${toggle('data-rev="alerta"', l.rev.alerta)}</div>
      <textarea data-f="alerta" rows="2" placeholder="Aviso em destaque (opcional)">${esc(l.alerta)}</textarea></div>

    <div class="campo"><div class="campo-topo"><span>Quando afunda</span>${toggle('data-rev="alaga"', l.rev.alaga)}</div>
      <select data-f="alaga">${alagaOpts}</select></div>

    <div class="campo notas"><div class="campo-topo"><span>Notas do mestre</span><span class="mini">nunca aparece para os jogadores</span></div>
      <textarea data-f="notas" rows="3">${esc(l.notas)}</textarea></div>

    <div class="botoes">
      <button type="button" class="ghost ${ui.posicionando === l.id ? "ativo" : ""}" data-mover>${ui.posicionando === l.id ? "Clique no mapa…" : "Mover no mapa"}</button>
      <button type="button" class="ghost perigo" data-apagar>${ui.apagar ? "Confirmar: apagar local" : "Apagar local"}</button>
    </div>
  </div>`;
}

function fichaJogador(l) {
  const tags = [];
  if (l.tipo) tags.push(`<span class="tag">${TIPOS[l.tipo]}</span>`);
  if (l.eq) tags.push(`<span class="tag eq" style="background:${corEq(l.eq)}">${esc(l.eq)}</span>`);
  if (l.alaga !== undefined) tags.push(`<span class="tag">${l.alaga ? "Afunda no dia " + l.alaga : "Nunca afunda"}</span>`);
  if (l.alaga && diaAtual() >= l.alaga) tags.push(`<span class="tag alerta">Debaixo d'água</span>`);
  const nada = !l.txt && !l.din && !l.alerta;
  return `
  <div class="ficha">
    <button type="button" class="voltar" data-voltar>← Todos os locais</button>
    <div class="tags">${tags.join("")}</div>
    <h2>${esc(l.nome)}</h2>
    ${l.txt ? `<p>${esc(l.txt)}</p>` : ""}
    ${l.din ? `<ul>${l.din.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
    ${l.alerta ? `<p class="alerta-txt">${esc(l.alerta)}</p>` : ""}
    ${nada ? `<p class="mini">${l.estado === "avistado" ? "Vocês sabem que este lugar existe, mas ainda não o exploraram." : "Nada anotado sobre este lugar."}</p>` : ""}
  </div>`;
}
function listaJogador(p) {
  const ls = p?.locais || [];
  if (!ls.length) return `<section class="bloco"><h2>Locais conhecidos</h2><p class="mini">${p ? "Nenhum lugar descoberto ainda." : "O mestre ainda não abriu o mapa nesta cena."}</p></section>`;
  const grupos = {};
  for (const l of ls) (grupos[l.desde || 0] ||= []).push(l);
  return `<section class="bloco"><h2>Locais conhecidos</h2>
    ${Object.keys(grupos).sort((a, b) => b - a).map((d) => `<h3>${+d ? "Descobertos no dia " + d : "Conhecidos"}</h3>
      <ul class="lista">${grupos[d].map((l) => `<li><button type="button" class="item" data-abrir="${l.id}">
        <span class="marca ${l.tipo || "desconhecido"}" style="--c:${l.eq ? corEq(l.eq) : "#e6dcc4"}"></span>
        <span class="nome">${esc(l.nome)}</span>${chipEstado(l.estado)}</button></li>`).join("")}</ul>`).join("")}
    <p class="mini">Toque num local do mapa ou da lista para ver o que vocês sabem.</p></section>`;
}

/* eventos do painel */
const atual = () => estado.locais.find((z) => z.id === ui.sel);
painel.addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.abrir) { ui.sel = b.dataset.abrir; ui.apagar = false; renderTudo(); return; }
  if (b.hasAttribute("data-voltar")) { ui.sel = null; ui.posicionando = null; renderTudo(); return; }
  if (!gm || ui.verComo) return;
  if (b.id === "b-novo") { ui.posicionando = ui.posicionando === "novo" ? null : "novo"; renderPainel(); desenharMapa(); return; }
  if (b.id === "b-exportar") { exportar(); return; }
  if (b.id === "b-restaurar") {
    if (!ui.restaurar) { ui.restaurar = true; renderPainel(); return; }
    ui.restaurar = false; estado = novoEstado(); ui.sel = null; salvar(); renderTopo(); return;
  }
  const l = atual(); if (!l) return;
  if (b.dataset.estado) {
    const novo = b.dataset.estado; if (novo === l.estado) return;
    l.estado = novo; if (novo !== "oculto") l.desde[novo] ??= diaAtual();
    if (novo === "explorado") revelarTudo(l, diaAtual(), false);
    registrar(`${l.nome}: ${ESTADOS[novo].toLowerCase()}`);
    salvar(); return;
  }
  if (b.dataset.tudo !== undefined) {
    if (b.dataset.tudo === "1") revelarTudo(l, diaAtual());
    else { l.rev = { eq: false, txt: false, alerta: false, alaga: false }; l.din.forEach((d) => d.v = false); registrar(`${l.nome}: detalhes escondidos`); }
    salvar(); return;
  }
  if (b.hasAttribute("data-din-add")) { l.din.push({ id: uid(), t: "", v: false }); salvar(); painel.querySelector(`[data-din="${l.din.length - 1}"]`)?.focus(); return; }
  if (b.dataset.dinDel !== undefined) { l.din.splice(+b.dataset.dinDel, 1); salvar(); return; }
  if (b.hasAttribute("data-mover")) { ui.posicionando = ui.posicionando === l.id ? null : l.id; renderPainel(); desenharMapa(); return; }
  if (b.hasAttribute("data-apagar")) {
    if (!ui.apagar) { ui.apagar = true; renderPainel(); return; }
    estado.locais = estado.locais.filter((z) => z !== l); registrar(`Local apagado: ${l.nome}`); ui.sel = null; ui.apagar = false; salvar();
  }
});
painel.addEventListener("input", (e) => {
  const t = e.target; if (!gm || ui.verComo) return;
  const l = atual();
  if (l && t.dataset.f && t.tagName !== "SELECT") { l[t.dataset.f] = t.value; salvar({ painel: false }); return; }
  if (l && t.dataset.din !== undefined) { l.din[+t.dataset.din].t = t.value; salvar({ painel: false }); }
});
painel.addEventListener("change", (e) => {
  const t = e.target; if (!gm || ui.verComo) return;
  if (t.id === "c-seguir") { estado.seguir = t.checked; salvar(); renderTopo(); return; }
  if (t.id === "c-auto") { estado.auto = t.checked; salvar(); return; }
  if (t.id === "f-importar") { importar(t.files?.[0]); return; }
  const l = atual(); if (!l) return;
  if (t.tagName === "SELECT" && t.dataset.f) { l[t.dataset.f] = t.dataset.f === "alaga" ? (t.value === "" ? null : +t.value) : t.value; salvar(); return; }
  if (t.dataset.rev) { l.rev[t.dataset.rev] = t.checked; if (t.checked) registrar(`${l.nome}: ${{ eq: "dono", txt: "descrição", alerta: "alerta", alaga: "dia em que afunda" }[t.dataset.rev]} liberado`); salvar(); return; }
  if (t.dataset.dinRev !== undefined) { const d = l.din[+t.dataset.dinRev]; d.v = t.checked; if (t.checked) registrar(`${l.nome}: detalhe liberado`); salvar(); }
});

function exportar() {
  const blob = new Blob([JSON.stringify(estado, null, 1)], { type: "application/json" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "mapa-hexatombe.json";
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function importar(f) {
  if (!f) return;
  f.text().then((t) => { const s = JSON.parse(t); if (!s?.locais) throw new Error(); estado = s; ui.sel = null; salvar(); renderTopo(); })
    .catch(() => { ui.aviso = "Esse arquivo não é uma cópia do mapa."; renderAviso(); });
}

// outra janela do mestre (popover e tela cheia) mudou o estado
window.addEventListener("storage", (e) => { if (gm && e.key === lsKey() && e.newValue) { try { estado = JSON.parse(e.newValue); renderTudo(); } catch { /* */ } } });

/* ---------- início ---------- */
function lerHex(md) { const d = md?.[HEX_STATE]?.dia; return Number.isFinite(+d) && +d >= 1 && +d <= 6 ? +d : null; }

if (modoTela) document.body.classList.add("tela");
if (OBR.isAvailable) {
  OBR.onReady(async () => {
    obr = true;
    gm = (await OBR.player.getRole()) === "GM";
    sala = OBR.room.id || "sala";
    try { hexDia = lerHex(await OBR.room.getMetadata()); } catch { /* */ }
    OBR.room.onMetadataChange((md) => {
      const d = lerHex(md); if (d === hexDia) return; hexDia = d;
      renderTudo(); if (gm && estado?.auto && estado.seguir) atualizarImagemSeExistir();
    });
    if (gm) estado = carregar();
    const lerCena = async () => {
      cenaPronta = await OBR.scene.isReady();
      if (cenaPronta) { const md = await OBR.scene.getMetadata(); pub = md[PUB] || null; if (gm) publicar(); }
      renderTudo();
    };
    OBR.scene.onReadyChange(lerCena);
    OBR.scene.onMetadataChange((md) => { if (gm) return; pub = md[PUB] || null; renderTudo(); });
    OBR.player.onChange(async (p) => { const novo = p.role === "GM"; if (novo !== gm) { gm = novo; if (gm && !estado) estado = carregar(); renderTudo(); } });
    try { OBR.action.setBadgeText(undefined); } catch { /* */ }
    await lerCena();
  });
} else {
  estado = carregar();
  renderTudo();
}
aplicaZoom();
