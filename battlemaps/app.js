/* =========================================================
   Battlemaps do Hexatombe (Owlbear Rodeo) — janela do mestre
   - escolhe um dos 15 locais (galeria) e o vincula a uma cena
   - abas: Mapa (pontos de interesse), Local (texto inteiro), Melhorias (Hotel)
   - modo de edição: arrastar, criar, editar e apagar pontos
   A cena é atualizada pelo fundo da extensão (background.js).
   ========================================================= */
import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
import { LOCAIS } from "./dados.js";
import { META, BASE, lerEstado, salvarEstado, pontosDe, locPorId, colocarMapa, vincularImagem, desvincular } from "./sync.js";

const TAGS = { pista: ["Pista", "var(--pista)"], "mistério": ["Mistério", "var(--misterio)"], item: ["Item", "var(--item)"], perigo: ["Perigo", "var(--perigo)"], "": ["Detalhe", "var(--nada)"] };
const TIPO = { base: "Bases das equipes", enigma: "Enigma", explorar: "Exploração" };
const TIPO1 = { base: "Base", enigma: "Enigma", explorar: "Exploração" };
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const $ = (id) => document.getElementById(id);
const clone = (o) => JSON.parse(JSON.stringify(o));
const cor = (p) => TAGS[p.k || ""]?.[1] || "var(--nada)";

/* ícones (traço) */
const I = (d, s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ic = {
  mapa: I(`<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>`, 18),
  lapis: I(`<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>`),
  baixo: I(`<path d="m6 9 6 6 6-6"/>`),
  esq: I(`<path d="m15 18-6-6 6-6"/>`), dir: I(`<path d="m9 18 6-6-6-6"/>`),
  mais: I(`<path d="M12 5v14M5 12h14"/>`), menos: I(`<path d="M5 12h14"/>`),
  ajustar: I(`<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>`),
  x: I(`<path d="M18 6 6 18M6 6l12 12"/>`),
  check: I(`<path d="M20 6 9 17l-5-5"/>`, 14),
  lixo: I(`<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>`, 14),
  voltar: I(`<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>`, 14),
  alvo: I(`<circle cx="12" cy="12" r="8"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>`, 14),
  elo: I(`<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>`, 14),
  desfaz: I(`<path d="m18.8 13.4 1.7-1.7a5 5 0 0 0-7-7l-1.7 1.7M5.2 10.6l-1.7 1.7a5 5 0 0 0 7 7l1.7-1.7M8 2v3M2 8h3M16 22v-3M22 16h-3"/>`, 14),
  busca: I(`<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>`),
  livro: I(`<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>`),
  aviso: I(`<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>`),
  olho: I(`<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>`, 14),
  gota: I(`<path d="M12 2.7s7 7.3 7 12.3a7 7 0 0 1-14 0c0-5 7-12.3 7-12.3z"/>`, 14),
  chave: I(`<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.8-9.8M17 6l3 3"/>`, 14),
};

let sala = "local", E = lerEstado("local");
let cur = "hotel", sel = 0, edit = false, adding = false, zoom = 1, aba = "mapa";
let ocultos = new Set();   // tipos de ponto escondidos pelo filtro
let naCena = [];           // mapas vinculados na cena atual
let cenaPronta = false;

function salvar() { salvarEstado(sala, E); }
const L = () => locPorId(cur);
const pts = () => pontosDe(E, cur);
function pontosEditaveis() { if (!E.edits[cur]) E.edits[cur] = clone(L().pois); return E.edits[cur]; }
const mini = (id) => `${BASE}miniaturas/${id}.webp`;

/* ---------- aviso flutuante ---------- */
let tToast;
function toast(txt, tipo = "ok") {
  const t = $("toast");
  t.className = `toast ${tipo} on`;
  t.innerHTML = `${tipo === "erro" ? ic.aviso : ic.check}<span>${esc(txt)}</span>`;
  clearTimeout(tToast); tToast = setTimeout(() => t.classList.remove("on"), 3600);
}

/* ---------- esqueleto ---------- */
function montar() {
  $("app").innerHTML = `
    <header class="topo">
      <div class="marca"><span class="selo">${ic.mapa}</span><div><h1>Battlemaps</h1><p>Hexatombe · Bom Jesus do Açude</p></div></div>
      <button type="button" class="ico" id="b-editar" aria-pressed="false" title="Editar pontos" aria-label="Editar pontos">${ic.lapis}</button>
    </header>
    <button type="button" class="trocar" id="b-trocar" aria-haspopup="dialog"></button>
    <section class="cena" id="cena" aria-label="Cena"></section>
    <nav class="abas" role="tablist" id="abas"></nav>
    <section class="painel" id="p-mapa" role="tabpanel">
      <div class="barra"><div class="filtros" id="filtros"></div><div class="progresso" id="prog"></div></div>
      <div class="vp-casca">
        <div class="vp" id="vp"><div class="mapa" id="mapa"><img id="img" alt="" draggable="false"></div></div>
        <div class="faixa" id="faixa" hidden></div>
        <div class="ctl">
          <button type="button" id="z-menos" aria-label="Afastar">${ic.menos}</button><span id="z-val">100%</span>
          <button type="button" id="z-mais" aria-label="Aproximar">${ic.mais}</button>
          <button type="button" id="z-fit" aria-label="Mapa inteiro" title="Mapa inteiro">${ic.ajustar}</button>
        </div>
      </div>
      <article class="ficha" id="ficha"></article>
      <div class="secao"><h3 id="lista-tit">Todos os pontos</h3><ol class="lista" id="lista"></ol></div>
    </section>
    <section class="painel" id="p-local" role="tabpanel" hidden></section>
    <section class="painel" id="p-melh" role="tabpanel" hidden></section>
    <p class="rodape">O que você marca fica guardado neste navegador, para esta sala.</p>
    <div class="galeria" id="galeria" role="dialog" aria-modal="true" aria-label="Escolher local" hidden></div>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`;

  $("b-editar").onclick = () => { edit = !edit; adding = false; $("b-editar").setAttribute("aria-pressed", edit); if (edit) irPara("mapa"); else tudo(); };
  $("b-trocar").onclick = abrirGaleria;
  $("z-mais").onclick = () => mudarZoom(zoom + .5);
  $("z-menos").onclick = () => mudarZoom(zoom - .5);
  $("z-fit").onclick = () => mudarZoom(1);
  $("vp").addEventListener("wheel", (ev) => { if (!ev.ctrlKey && !ev.metaKey) return; ev.preventDefault(); mudarZoom(zoom + (ev.deltaY < 0 ? .5 : -.5), ev); }, { passive: false });
  $("mapa").addEventListener("click", (ev) => {
    if (!adding || ev.target.closest(".mk") || $("vp").dataset.arrastou) return;
    const [x, y] = posNoMapa(ev);
    const lista = pontosEditaveis();
    lista.push({ n: "Novo ponto", b: "", a: "", x, y, t: [["Percepção", 10, ""]], d: "", i: [], k: "" });
    sel = lista.length - 1; adding = false; ocultos.delete(""); salvar(); renderMapa(); renderFicha(); renderLista();
    setTimeout(() => $("f-n")?.select(), 0);
  });
  panoramica();
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && !$("galeria").hidden) { fecharGaleria(); return; }
    if (ev.key === "Escape" && adding) { adding = false; renderMapa(); return; }
    if (aba !== "mapa" || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)) return;
    if (ev.key === "ArrowRight") passo(1);
    if (ev.key === "ArrowLeft") passo(-1);
  });
}

/* ---------- troca de local ---------- */
function renderTrocar() {
  const l = L();
  $("b-trocar").innerHTML = `<img src="${mini(cur)}" alt=""><span class="txt"><small>${TIPO1[l.tipo]}${l.eq ? ` · ${esc(l.eq)}` : ""}</small><strong>${esc(l.nome)}</strong></span><span class="seta">${ic.baixo}</span>`;
  $("b-trocar").setAttribute("aria-label", `Local: ${l.nome}. Trocar de local`);
}
function abrirGaleria() {
  const g = $("galeria");
  g.innerHTML = `<div class="galeria-caixa">
      <div class="galeria-topo"><input type="text" id="g-busca" placeholder="Buscar local…" aria-label="Buscar local" autocomplete="off">
        <button type="button" class="ico fantasma" id="g-fechar" aria-label="Fechar">${ic.x}</button></div>
      <div class="galeria-corpo" id="g-corpo"></div></div>`;
  g.hidden = false;
  const desenhar = (q = "") => {
    const n = q.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
    const bate = (x) => !n || (x.nome + " " + (x.eq || "")).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().includes(n);
    const grupos = ["base", "enigma", "explorar"].map((t) => {
      const ls = LOCAIS.filter((x) => x.tipo === t && bate(x));
      if (!ls.length) return "";
      return `<div class="grupo"><h3>${TIPO[t]}</h3><div class="cards">${ls.map((x) => `
        <button type="button" class="card" data-id="${x.id}" ${x.id === cur ? 'aria-current="true"' : ""}>
          <img src="${mini(x.id)}" alt="" loading="lazy">
          ${naCena.some((c) => c.local === x.id) ? `<span class="na-cena">${ic.check}Na cena</span>` : ""}
          <span class="rot"><b>${esc(x.nome)}</b><small>${x.eq ? esc(x.eq) : `${x.pois.length} pontos`}</small></span>
        </button>`).join("")}</div></div>`;
    }).join("");
    $("g-corpo").innerHTML = grupos || `<p class="vazio">Nenhum local com esse nome.</p>`;
    $("g-corpo").querySelectorAll(".card").forEach((b) => b.onclick = () => { escolher(b.dataset.id); fecharGaleria(); });
  };
  desenhar();
  $("g-busca").oninput = (e) => desenhar(e.target.value);
  $("g-busca").onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); const b = $("g-corpo").querySelector(".card"); if (b) b.click(); } };
  $("g-fechar").onclick = fecharGaleria;
  g.onclick = (e) => { if (e.target === g) fecharGaleria(); };
  setTimeout(() => $("g-busca").focus(), 30);
}
function fecharGaleria() { $("galeria").hidden = true; $("galeria").innerHTML = ""; $("b-trocar").focus(); }
function escolher(id) {
  if (id === cur) return;
  cur = id; sel = 0; adding = false; zoom = 1; ocultos = new Set();
  if (aba === "melh" && !L().camadas) aba = "mapa";
  tudo(); $("vp").scrollTo(0, 0);
}

/* ---------- cena ---------- */
async function lerCena() {
  if (!cenaPronta) { naCena = []; return; }
  const itens = await OBR.scene.items.getItems((i) => i.metadata?.[META]?.tipo === "mapa");
  naCena = itens.map((i) => ({ id: i.id, local: i.metadata[META].local }));
}
function renderCena() {
  const l = L();
  const vinc = naCena.filter((n) => n.local === cur);
  const outros = [...new Set(naCena.filter((n) => n.local !== cur).map((n) => n.local))].filter(locPorId);
  const pill = !cenaPronta ? `<span class="pill"><i></i>Nenhuma cena aberta</span>`
    : vinc.length ? `<span class="pill ok"><i></i>Nesta cena</span>` : `<span class="pill"><i></i>Fora desta cena</span>`;
  $("cena").innerHTML = `
    <div class="linha entre">${pill}
      ${outros.length ? `<span class="outros">Na cena: ${outros.map((id) => `<button type="button" class="fantasma" data-ir="${id}">${esc(locPorId(id).nome)}</button>`).join(" ")}</span>` : ""}</div>
    <div class="acoes">
      ${vinc.length
        ? `<button type="button" class="fantasma perigo-btn" id="b-desv">${ic.desfaz}Desvincular</button>`
        : `<button type="button" class="primario" id="b-colocar" ${cenaPronta ? "" : "disabled"}>${ic.mais}Colocar nesta cena</button>`}
      <button type="button" id="b-vincular" ${cenaPronta ? "" : "disabled"} title="Clique numa imagem de mapa na mesa e aperte aqui: ela vira este battlemap, no mesmo lugar.">${ic.elo}Usar imagem selecionada</button>
    </div>
    <label class="switch"><input type="checkbox" id="c-pontos" ${E.pontos ? "checked" : ""}>Mostrar os pontos na mesa <span class="dica">· só o mestre vê</span></label>`;
  $("cena").querySelectorAll("[data-ir]").forEach((b) => b.onclick = () => escolher(b.dataset.ir));
  if ($("b-colocar")) $("b-colocar").onclick = async () => {
    try { await colocarMapa(cur); toast(`${l.nome} entrou na cena, travado na camada de mapa.`); }
    catch { toast("Não deu para colocar o mapa. Confira se você é o mestre da sala.", "erro"); }
    await lerCena(); renderCena();
  };
  $("b-vincular").onclick = async () => {
    const selec = (await OBR.player.getSelection()) || [];
    const itens = selec.length ? await OBR.scene.items.getItems(selec) : [];
    const img = itens.find((i) => i.type === "IMAGE");
    if (!img) { toast("Clique na imagem do mapa na mesa e aperte de novo.", "erro"); return; }
    await vincularImagem(img.id, cur);
    toast(`A imagem selecionada virou o mapa de ${l.nome}.`); await lerCena(); renderCena();
  };
  if ($("b-desv")) $("b-desv").onclick = async () => {
    for (const v of vinc) await desvincular(v.id);
    toast("Desvinculado. A imagem fica na cena, mas não muda mais com a extensão."); await lerCena(); renderCena();
  };
  $("c-pontos").onchange = (e) => { E.pontos = e.target.checked; salvar(); toast(E.pontos ? "Pontos visíveis na mesa (só para você)." : "Pontos tirados da mesa."); };
}

/* ---------- abas ---------- */
function renderAbas() {
  const l = L(), on = (E.melhorias[cur] || []).length;
  const abas = [["mapa", "Mapa", pts().length], ["local", "Local", ""], ...(l.camadas ? [["melh", "Melhorias", `${on}/${l.camadas.length}`]] : [])];
  if (!abas.some((a) => a[0] === aba)) aba = "mapa";
  $("abas").innerHTML = abas.map(([k, n, c]) => `<button type="button" role="tab" data-aba="${k}" aria-selected="${k === aba}">${n}${c !== "" ? `<span class="n">${c}</span>` : ""}</button>`).join("");
  $("abas").querySelectorAll("button").forEach((b) => b.onclick = () => irPara(b.dataset.aba));
  $("p-mapa").hidden = aba !== "mapa"; $("p-local").hidden = aba !== "local"; $("p-melh").hidden = aba !== "melh";
}
function irPara(k) { aba = k; tudo(); }

/* ---------- mapa (prévia) ---------- */
function posNoMapa(ev) {
  const r = $("mapa").getBoundingClientRect(), l = L();
  return [Math.round(((ev.clientX - r.left) / r.width * l.gw) * 10) / 10, Math.round(((ev.clientY - r.top) / r.height * l.gh) * 10) / 10];
}
function mudarZoom(z, ev) {
  z = Math.max(1, Math.min(4, z)); if (z === zoom) return;
  const vp = $("vp"), r = vp.getBoundingClientRect();
  const fx = ev ? ev.clientX - r.left : vp.clientWidth / 2, fy = ev ? ev.clientY - r.top : vp.clientHeight / 2;
  const cx = (vp.scrollLeft + fx) / zoom, cy = (vp.scrollTop + fy) / zoom;
  zoom = z; $("mapa").style.transition = "none"; renderMapa();
  vp.scrollLeft = cx * zoom - fx; vp.scrollTop = cy * zoom - fy;
  requestAnimationFrame(() => { $("mapa").style.transition = ""; });
}
/* arrastar o mapa com o mouse quando ele está aproximado */
function panoramica() {
  const vp = $("vp");
  vp.addEventListener("pointerdown", (ev) => {
    if (zoom <= 1 || ev.button !== 0 || ev.target.closest(".mk")) return;
    const x0 = ev.clientX, y0 = ev.clientY, sl = vp.scrollLeft, st = vp.scrollTop; let andou = false;
    const mover = (e) => {
      const dx = e.clientX - x0, dy = e.clientY - y0;
      if (!andou && Math.hypot(dx, dy) < 4) return;
      if (!andou) { andou = true; vp.classList.add("arrastando"); vp.setPointerCapture(ev.pointerId); }
      vp.scrollLeft = sl - dx; vp.scrollTop = st - dy;
    };
    const soltar = () => {
      vp.removeEventListener("pointermove", mover); vp.removeEventListener("pointerup", soltar); vp.removeEventListener("pointercancel", soltar);
      vp.classList.remove("arrastando");
      if (andou) { vp.dataset.arrastou = "1"; setTimeout(() => delete vp.dataset.arrastou, 0); }
    };
    vp.addEventListener("pointermove", mover); vp.addEventListener("pointerup", soltar); vp.addEventListener("pointercancel", soltar);
  });
}
function renderFiltros() {
  const lista = pts(), cont = {};
  lista.forEach((p) => { cont[p.k || ""] = (cont[p.k || ""] || 0) + 1; });
  $("filtros").innerHTML = Object.entries(TAGS).filter(([k]) => cont[k]).map(([k, [n, c]]) =>
    `<button type="button" class="filtro" data-k="${k}" style="--c:${c}" aria-pressed="${!ocultos.has(k)}" title="Mostrar ou esconder: ${n}"><i></i>${n}<b>${cont[k]}</b></button>`).join("");
  $("filtros").querySelectorAll(".filtro").forEach((b) => b.onclick = () => {
    const k = b.dataset.k; ocultos.has(k) ? ocultos.delete(k) : ocultos.add(k); renderMapa(); renderLista();
  });
  const f = (E.feitos[cur] || []).filter((i) => i < lista.length).length, tot = lista.length || 1;
  $("prog").innerHTML = `<span>${f} de ${lista.length} explorados</span><span class="trilho"><span style="width:${f / tot * 100}%"></span></span>`;
}
function renderMapa() {
  const l = L(), m = $("mapa"), img = $("img");
  if (img.dataset.id !== cur) { img.src = `${BASE}previas/${cur}.jpg`; img.dataset.id = cur; img.alt = "Mapa de " + l.nome; }
  m.style.width = (zoom * 100) + "%";
  $("z-val").textContent = Math.round(zoom * 100) + "%";
  $("z-menos").disabled = zoom <= 1; $("z-mais").disabled = zoom >= 4; $("z-fit").disabled = zoom <= 1;
  m.classList.toggle("adding", adding); $("vp").classList.toggle("editando", edit); $("vp").classList.toggle("pode-arrastar", zoom > 1 && !adding);
  m.querySelectorAll(".mk,.camada").forEach((e) => e.remove());
  const on = new Set(E.melhorias[cur] || []);
  (l.camadas || []).forEach((c) => {
    if (!on.has(c.k)) return;
    const i = document.createElement("img"); i.className = "camada"; i.alt = ""; i.src = `${BASE}imagens/hotel/${c.k}.png`;
    i.style.left = (c.off[0] / l.img[0] * 100) + "%"; i.style.top = (c.off[1] / l.img[1] * 100) + "%"; i.style.width = ((c.off[2] - c.off[0]) / l.img[0] * 100) + "%";
    m.appendChild(i);
  });
  const feitos = new Set(E.feitos[cur] || []);
  pts().forEach((p, i) => {
    if (ocultos.has(p.k || "") && i !== sel) return;
    const b = document.createElement("button"); b.type = "button"; b.className = "mk" + (i === sel ? " sel" : "") + (feitos.has(i) ? " feito" : "");
    b.style.left = (p.x / l.gw * 100) + "%"; b.style.top = (p.y / l.gh * 100) + "%"; b.style.setProperty("--c", cor(p));
    b.textContent = i + 1; b.title = p.n; b.setAttribute("aria-label", `${i + 1}. ${p.n}`);
    b.onclick = (e) => { e.stopPropagation(); if (b.dataset.moveu) return; selecionar(i); };
    if (edit) arrastavel(b, i);
    m.appendChild(b);
  });
  const fx = $("faixa");
  if (edit) {
    fx.hidden = false;
    fx.innerHTML = adding
      ? `<span>Clique no mapa onde o ponto novo deve ficar.</span><button type="button" id="b-cancela">Cancelar</button>`
      : `<span>Modo de edição · arraste os números</span><button type="button" class="primario" id="b-novo">${ic.mais}Novo ponto</button>`;
    if ($("b-novo")) $("b-novo").onclick = () => { adding = true; renderMapa(); };
    if ($("b-cancela")) $("b-cancela").onclick = () => { adding = false; renderMapa(); };
  } else fx.hidden = true;
  renderFiltros();
}
function arrastavel(b, i) {
  b.onpointerdown = (ev) => {
    ev.preventDefault(); ev.stopPropagation(); b.setPointerCapture(ev.pointerId); let moveu = false; const l = L();
    b.onpointermove = (e) => { const [x, y] = posNoMapa(e); const p = pontosEditaveis()[i]; p.x = Math.max(0, Math.min(l.gw, x)); p.y = Math.max(0, Math.min(l.gh, y)); b.style.left = (p.x / l.gw * 100) + "%"; b.style.top = (p.y / l.gh * 100) + "%"; moveu = true; };
    b.onpointerup = () => { b.onpointermove = null; if (moveu) { b.dataset.moveu = "1"; setTimeout(() => delete b.dataset.moveu, 0); sel = i; salvar(); renderMapa(); renderFicha(); } };
  };
}
function selecionar(i) {
  sel = i; renderMapa(); renderFicha(); renderLista();
  /* traz o ponto para dentro da vista se o mapa estiver aproximado */
  const mk = $("mapa").querySelector(".mk.sel"), vp = $("vp");
  if (mk && zoom > 1) {
    const r = vp.getBoundingClientRect(), k = mk.getBoundingClientRect();
    if (k.left < r.left || k.right > r.right || k.top < r.top || k.bottom > r.bottom)
      vp.scrollTo({ left: vp.scrollLeft + k.left - r.left - r.width / 2, top: vp.scrollTop + k.top - r.top - r.height / 2, behavior: "smooth" });
  }
}
function passo(d) { const n = sel + d; if (n >= 0 && n < pts().length) selecionar(n); }

/* ---------- lista de pontos ---------- */
function renderLista() {
  const feitos = new Set(E.feitos[cur] || []);
  const lista = pts().map((p, i) => [p, i]).filter(([p]) => !ocultos.has(p.k || ""));
  $("lista-tit").textContent = ocultos.size ? `Pontos filtrados · ${lista.length}` : "Todos os pontos";
  $("lista").innerHTML = lista.map(([p, i]) => `<li class="${feitos.has(i) ? "feito" : ""}"><button type="button" data-i="${i}" ${i === sel ? 'aria-current="true"' : ""} style="--c:${cor(p)}">
      <span class="bola">${i + 1}</span><span class="nome">${esc(p.n)}</span>${p.a ? `<span class="area">${esc(p.a)}</span>` : ""}${feitos.has(i) ? `<span class="ok" title="Explorado">${ic.check}</span>` : ""}</button></li>`).join("")
    || `<li class="vazio">Nenhum ponto com esses filtros.</li>`;
  $("lista").querySelectorAll("button").forEach((b) => b.onclick = () => { selecionar(+b.dataset.i); $("ficha").scrollIntoView({ behavior: "smooth", block: "nearest" }); });
}

/* ---------- melhorias do hotel ---------- */
function renderMelh() {
  const l = L(), box = $("p-melh");
  if (!l.camadas) { box.innerHTML = ""; return; }
  const on = new Set(E.melhorias[cur] || []);
  box.innerHTML = `<div class="melh-topo"><div><h2>Melhorias da base</h2><p class="dica">Cada melhoria marcada aparece no mapa da mesa.</p></div>
      <div class="progresso"><span>${on.size} de ${l.camadas.length}</span><span class="trilho"><span style="width:${on.size / l.camadas.length * 100}%"></span></span></div></div>
    <div class="melhorias">${l.camadas.map((c) => `<button type="button" class="melh" data-k="${c.k}" aria-pressed="${on.has(c.k)}">
      <span class="marca-m">${ic.check}</span><b>${esc(c.nome)}</b><small>${esc(c.req)}</small></button>`).join("")}</div>`;
  box.querySelectorAll(".melh").forEach((b) => b.onclick = () => {
    const s = new Set(E.melhorias[cur] || []), k = b.dataset.k; s.has(k) ? s.delete(k) : s.add(k);
    E.melhorias[cur] = l.camadas.map((c) => c.k).filter((x) => s.has(x)); salvar(); renderMelh(); renderMapa(); renderAbas();
  });
}

/* ---------- ficha do ponto ---------- */
function renderFicha() {
  const lista = pts(), p = lista[sel], f = $("ficha");
  if (!p) {
    f.style.removeProperty("--c");
    f.innerHTML = `<p class="vazio">${lista.length ? "Escolha um ponto no mapa." : "Este local ainda não tem pontos. Toque no lápis e em “Novo ponto”."}</p>`; return;
  }
  f.style.setProperty("--c", cor(p));
  const topo = `<div class="ficha-topo"><span class="num">${sel + 1}</span>
      <div class="tit"><div class="meta"><span class="chip">${TAGS[p.k || ""][0]}</span>${p.a ? `<span>${esc(p.a)}</span>` : ""}</div>
        <h2>${esc(p.n)}</h2></div>
      <div class="nav"><button type="button" id="p-ant" aria-label="Ponto anterior" ${sel <= 0 ? "disabled" : ""}>${ic.esq}</button>
        <button type="button" id="p-prox" aria-label="Próximo ponto" ${sel >= lista.length - 1 ? "disabled" : ""}>${ic.dir}</button></div></div>`;
  const feito = (E.feitos[cur] || []).includes(sel);
  if (!edit) {
    f.innerHTML = `${topo}
      <div class="poi">
        <div class="poi-cab">${ic.busca}<div><b>${esc(p.n)}</b>${p.b ? `<small>${esc(p.b)}</small>` : ""}</div></div>
        ${p.t.length ? `<table class="poi-quadro"><thead><tr><th>Perícia</th><th>DT</th><th>Informação</th></tr></thead>
          <tbody>${p.t.map(([per, dt, res]) => `<tr><td class="per">${esc(per && per !== "—" ? per : "—")}</td><td class="c-dt">${dt ?? "—"}</td><td>${esc(res)}</td></tr>`).join("")}</tbody></table>` : ""}
        ${p.d ? `<div class="poi-ctx">${ic.livro}<p>${esc(p.d)}</p></div>` : ""}
      </div>
      <p class="dica poi-dica">Leia o cabeçalho quando alguém investigar o ponto. O quadro diz o que cada perícia revela; o texto com o livro é só para você.</p>
      ${p.i.length ? `<div class="secao"><h3>Itens</h3><div class="itens">${p.i.map((x) => `<span>${esc(x)}</span>`).join("")}</div></div>` : ""}
      <button type="button" class="feito-btn" id="f-feito" aria-pressed="${feito}">${feito ? `${ic.check}Explorado pelos jogadores` : "Marcar como explorado"}</button>`;
    $("f-feito").onclick = () => {
      const s = new Set(E.feitos[cur] || []); s.has(sel) ? s.delete(sel) : s.add(sel);
      E.feitos[cur] = [...s].sort((a, b) => a - b); salvar(); renderMapa(); renderFicha(); renderLista();
    };
  } else {
    f.innerHTML = `${topo}
      <label class="campo"><span>Nome</span><input type="text" id="f-n" value="${esc(p.n)}"></label>
      <div class="campo"><span>Tipo</span><div class="tipos" id="f-k">${Object.entries(TAGS).map(([k, [n, c]]) => `<button type="button" data-k="${k}" style="--c:${c}" aria-pressed="${k === (p.k || "")}"><i></i>${n}</button>`).join("")}</div></div>
      <label class="campo"><span>Área</span><input type="text" id="f-a" value="${esc(p.a)}" placeholder="Ex.: Saguão"></label>
      <label class="campo"><span>Descrição básica · cabeçalho, narrada a quem investiga</span><input type="text" id="f-b" value="${esc(p.b || "")}" placeholder="Ex.: Dois pequenos potes de argila, tampados."></label>
      <div class="campo"><span>Quadro de perícias</span><div class="testes" id="f-t">${p.t.map(([a, b, c], j) => `
        <div class="ed-teste" data-j="${j}"><input type="text" data-c="per" value="${esc(a === "—" ? "" : a)}" placeholder="Perícia" aria-label="Perícia">
          <input type="number" data-c="dt" value="${b ?? ""}" placeholder="DT" aria-label="DT">
          <button type="button" class="ico fantasma perigo-btn" data-rm="${j}" aria-label="Tirar linha">${ic.x}</button>
          <textarea data-c="res" placeholder="Informação que o personagem encontra" aria-label="Informação">${esc(c)}</textarea></div>`).join("")}</div>
        <button type="button" class="fantasma" id="f-t-add">${ic.mais}Linha</button></div>
      <label class="campo"><span>Descrição contextual · só para o mestre</span><textarea id="f-d" rows="5">${esc(p.d)}</textarea></label>
      <label class="campo"><span>Itens · separados por vírgula</span><input type="text" id="f-i" value="${esc(p.i.join(", "))}"></label>
      <div class="linha entre"><button type="button" class="fantasma perigo-btn" id="f-del">${ic.lixo}Apagar ponto</button>
        <button type="button" class="fantasma" id="f-orig">${ic.voltar}Restaurar originais</button></div>
      <div class="confirma" id="f-conf" hidden></div>`;
    const q = () => pontosEditaveis()[sel];
    const lerTestes = () => [...f.querySelectorAll(".ed-teste")].map((r) => {
      const v = (c) => r.querySelector(`[data-c="${c}"]`).value.trim();
      return [v("per") || "Percepção", v("dt") ? +v("dt") || null : null, v("res")];
    });
    const sync = (redesenhar) => {
      const x = q(); x.n = $("f-n").value; x.b = $("f-b").value; x.a = $("f-a").value; x.d = $("f-d").value;
      x.i = $("f-i").value.split(",").map((s) => s.trim()).filter(Boolean); x.t = lerTestes();
      salvar(); renderMapa(); renderLista(); if (redesenhar) renderFicha();
    };
    f.querySelectorAll("input,textarea").forEach((e) => e.addEventListener("change", () => sync(false)));
    $("f-n").addEventListener("input", () => { f.querySelector(".tit h2").textContent = $("f-n").value; sync(false); });
    $("f-k").querySelectorAll("button").forEach((b) => b.onclick = () => { q().k = b.dataset.k; ocultos.delete(b.dataset.k); sync(true); });
    $("f-t-add").onclick = () => { sync(false); q().t.push(["Percepção", 10, ""]); salvar(); renderFicha(); f.querySelector(".ed-teste:last-child input")?.focus(); };
    f.querySelectorAll("[data-rm]").forEach((b) => b.onclick = () => { sync(false); q().t.splice(+b.dataset.rm, 1); salvar(); renderFicha(); });
    const pedir = (txt, rot, acao) => {
      const c = $("f-conf"); c.hidden = false;
      c.innerHTML = `<span>${esc(txt)}</span><button type="button" id="f-nao">Cancelar</button><button type="button" class="primario" id="f-sim">${rot}</button>`;
      $("f-sim").onclick = acao; $("f-nao").onclick = () => { c.hidden = true; };
      $("f-sim").focus();
    };
    $("f-del").onclick = () => pedir(`Apagar “${p.n}”?`, "Apagar", () => {
      pontosEditaveis().splice(sel, 1);
      E.feitos[cur] = (E.feitos[cur] || []).filter((n) => n !== sel).map((n) => n > sel ? n - 1 : n);
      sel = Math.max(0, sel - 1); salvar(); tudo(); toast("Ponto apagado.");
    });
    $("f-orig").onclick = () => pedir("Voltar todos os pontos deste local ao original? As edições se perdem.", "Restaurar", () => { delete E.edits[cur]; sel = 0; salvar(); tudo(); toast("Pontos originais de volta."); });
  }
  $("p-ant").onclick = () => passo(-1);
  $("p-prox").onclick = () => passo(1);
}

/* ---------- informações do local ---------- */
function renderInfo() {
  const l = L();
  const blocos = [
    ["Ao chegar", ic.olho, `<p>${esc(l.resumo)}</p>`],
    ["Perigos", ic.aviso, `<p>${esc(l.perigos)}</p>`, "perigos"],
    ["Segredo", ic.chave, `<p>${esc(l.segredo)}</p>`, "segredo"],
    ["Como descobrir", ic.busca, `<ol>${(l.como || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ol>`],
    ["Quando a água chega", ic.gota, `<p>${esc(l.agua)}</p>`, "agua"],
    ...(l.extras || []).filter((x) => x.titulo !== "Melhorias").map((x) => [x.titulo, "", `<ul>${x.linhas.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`]),
  ].filter(([, , h]) => !/^<(p|ol|ul)><\/(p|ol|ul)>$/.test(h));
  $("p-local").innerHTML = `<div class="blocos">${blocos.map(([t, i, h, c]) => `<div class="bloco ${c || ""}"><h3>${i}${t}</h3>${h}</div>`).join("")}</div>`;
}

function tudo() {
  renderTrocar(); renderCena(); renderAbas();
  if (aba === "mapa") { renderMapa(); renderFicha(); renderLista(); }
  if (aba === "local") renderInfo();
  if (aba === "melh") renderMelh();
}

/* ---------- início ---------- */
OBR.onReady(async () => {
  const gm = (await OBR.player.getRole()) === "GM";
  if (!gm) { $("app").innerHTML = `<header class="topo"><div class="marca"><span class="selo">${ic.mapa}</span><div><h1>Battlemaps</h1><p>Hexatombe</p></div></div></header><p class="vazio">Esta extensão é do mestre: os mapas aparecem na mesa quando ele os coloca.</p>`; return; }
  sala = OBR.room.id; E = lerEstado(sala);
  montar();
  cenaPronta = await OBR.scene.isReady(); await lerCena();
  if (naCena[0] && locPorId(naCena[0].local)) cur = naCena[0].local;
  tudo();
  OBR.scene.onReadyChange(async (r) => { cenaPronta = r; await lerCena(); if (naCena[0] && locPorId(naCena[0].local)) cur = naCena[0].local; tudo(); });
  OBR.scene.items.onChange(async () => { const antes = JSON.stringify(naCena); await lerCena(); if (JSON.stringify(naCena) !== antes) renderCena(); });
});
