/* =========================================================
   Battlemaps do Hexatombe (Owlbear Rodeo) — janela do mestre
   - escolhe um dos 15 locais e o vincula a uma cena
   - vê e edita os pontos de interesse (testes, DTs, achados)
   - marca as melhorias do Hotel: a cena muda junto
   A cena é atualizada pelo fundo da extensão (background.js).
   ========================================================= */
import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
import { LOCAIS } from "./dados.js";
import { META, BASE, lerEstado, salvarEstado, pontosDe, locPorId, colocarMapa, vincularImagem, desvincular } from "./sync.js";

const TAGS = { pista: ["Pista", "var(--pista)"], "mistério": ["Mistério", "var(--misterio)"], item: ["Item", "var(--item)"], perigo: ["Perigo", "var(--perigo)"], "": ["Detalhe", "#8b857a"] };
const TCLS = { pista: "t-pista", "mistério": "t-misterio", item: "t-item", perigo: "t-perigo", "": "t-nada" };
const TIPO = { base: "Bases", enigma: "Enigma", explorar: "Exploração" };
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const $ = (id) => document.getElementById(id);
const clone = (o) => JSON.parse(JSON.stringify(o));

let sala = "local", E = lerEstado("local");
let cur = "hotel", sel = 0, edit = false, adding = false, zoom = 1;
let naCena = [];      // mapas vinculados na cena atual
let cenaPronta = false, aviso = "";

function salvar() { salvarEstado(sala, E); }
const L = () => locPorId(cur);
const pts = () => pontosDe(E, cur);
function pontosEditaveis() { if (!E.edits[cur]) E.edits[cur] = clone(L().pois); return E.edits[cur]; }

/* ---------- esqueleto ---------- */
function montar() {
  $("app").innerHTML = `
    <header class="linha entre"><h1>Battlemaps do Hexatombe</h1>
      <button type="button" id="b-editar" aria-pressed="false">Editar pontos</button></header>
    <section class="cena" id="cena"></section>
    <div class="linha entre">
      <div class="linha" id="filtros"></div>
      <div class="linha"><button type="button" id="b-novo" hidden>Novo ponto</button>
        <button type="button" id="z-menos" aria-label="Afastar">−</button><button type="button" id="z-mais" aria-label="Aproximar">+</button></div>
    </div>
    <div class="vp" id="vp"><div class="mapa" id="mapa"><img id="img" alt=""></div></div>
    <p class="dica" id="dica"></p>
    <section class="ficha" id="ficha"></section>
    <section id="melh"></section>
    <details id="info"></details>
    <p class="dica">O que você marca aqui fica guardado neste navegador, para esta sala.</p>`;
  $("b-editar").onclick = () => { edit = !edit; adding = false; $("b-editar").setAttribute("aria-pressed", edit); $("b-novo").hidden = !edit; tudo(); };
  $("b-novo").onclick = () => { adding = !adding; renderMapa(); };
  $("z-mais").onclick = () => { zoom = Math.min(3, zoom + .5); renderMapa(); };
  $("z-menos").onclick = () => { zoom = Math.max(1, zoom - .5); renderMapa(); };
  $("mapa").addEventListener("click", (ev) => {
    if (!adding || ev.target.closest(".mk")) return;
    const [x, y] = posNoMapa(ev);
    const lista = pontosEditaveis();
    lista.push({ n: "Novo ponto", a: "", x, y, t: [["Investigação", 15, ""]], d: "", i: [], k: "" });
    sel = lista.length - 1; adding = false; salvar(); tudo();
  });
}

/* ---------- cena ---------- */
async function lerCena() {
  if (!cenaPronta) { naCena = []; return; }
  const itens = await OBR.scene.items.getItems((i) => i.metadata?.[META]?.tipo === "mapa");
  naCena = itens.map((i) => ({ id: i.id, local: i.metadata[META].local }));
}
function renderCena() {
  const l = L();
  const opts = ["base", "enigma", "explorar"].map((t) => `<optgroup label="${TIPO[t]}">${LOCAIS.filter((x) => x.tipo === t).map((x) => `<option value="${x.id}" ${x.id === cur ? "selected" : ""}>${esc(x.nome)}${naCena.some((n) => n.local === x.id) ? " ✓" : ""}</option>`).join("")}</optgroup>`).join("");
  const vinc = naCena.filter((n) => n.local === cur);
  $("cena").innerHTML = `
    <label class="campo"><span>Local</span><select id="sel-local">${opts}</select></label>
    <div class="linha">${!cenaPronta ? `<span class="tag nao">Nenhuma cena aberta</span>`
      : vinc.length ? `<span class="tag ok">Nesta cena</span>` : `<span class="tag nao">Fora desta cena</span>`}
      ${naCena.length && !vinc.length ? `<span class="dica">Na cena: ${naCena.map((n) => esc(locPorId(n.local).nome)).join(", ")}</span>` : ""}</div>
    <div class="linha">
      <button type="button" class="primario" id="b-colocar" ${cenaPronta ? "" : "disabled"}>Colocar nesta cena</button>
      <button type="button" id="b-vincular" ${cenaPronta ? "" : "disabled"}>Vincular à imagem selecionada</button>
      ${vinc.length ? `<button type="button" class="perigo-btn" id="b-desv">Desvincular</button>` : ""}
    </div>
    <label class="chk"><input type="checkbox" id="c-pontos" ${E.pontos ? "checked" : ""}> Mostrar os pontos de interesse na mesa (só o mestre vê)</label>
    ${aviso ? `<p class="aviso">${esc(aviso)}</p>` : ""}`;
  $("sel-local").onchange = (e) => { cur = e.target.value; sel = 0; adding = false; aviso = ""; tudo(); };
  $("b-colocar").onclick = async () => {
    try { await colocarMapa(cur); aviso = `${l.nome} entrou na cena, travado na camada de mapa.`; }
    catch { aviso = "Não deu para colocar o mapa. Confira se você é o mestre da sala."; }
    await lerCena(); renderCena();
  };
  $("b-vincular").onclick = async () => {
    const selec = (await OBR.player.getSelection()) || [];
    const itens = selec.length ? await OBR.scene.items.getItems(selec) : [];
    const img = itens.find((i) => i.type === "IMAGE");
    if (!img) { aviso = "Selecione na mesa a imagem do mapa (clique nela) e aperte de novo."; renderCena(); return; }
    await vincularImagem(img.id, cur);
    aviso = `A imagem selecionada virou o battlemap de ${l.nome}, no mesmo lugar.`; await lerCena(); renderCena();
  };
  if ($("b-desv")) $("b-desv").onclick = async () => {
    for (const v of vinc) await desvincular(v.id);
    aviso = "Desvinculado. A imagem continua na cena, mas não muda mais com a extensão."; await lerCena(); renderCena();
  };
  $("c-pontos").onchange = (e) => { E.pontos = e.target.checked; salvar(); };
}

/* ---------- mapa (prévia) ---------- */
function posNoMapa(ev) {
  const r = $("mapa").getBoundingClientRect(), l = L();
  return [Math.round(((ev.clientX - r.left) / r.width * l.gw) * 10) / 10, Math.round(((ev.clientY - r.top) / r.height * l.gh) * 10) / 10];
}
function renderFiltros() {
  $("filtros").innerHTML = `<span class="dica">${pts().length} pontos · ${(E.feitos[cur] || []).length} explorados</span>`;
}
function renderMapa() {
  const l = L(), m = $("mapa"), img = $("img");
  if (img.dataset.id !== cur) { img.src = `${BASE}previas/${cur}.jpg`; img.dataset.id = cur; img.alt = "Mapa de " + l.nome; }
  m.style.width = (zoom * 100) + "%";
  m.classList.toggle("adding", adding); $("vp").classList.toggle("editando", edit);
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
    const b = document.createElement("button"); b.type = "button"; b.className = "mk" + (i === sel ? " sel" : "") + (feitos.has(i) ? " feito" : "");
    b.style.left = (p.x / l.gw * 100) + "%"; b.style.top = (p.y / l.gh * 100) + "%"; b.style.setProperty("--c", TAGS[p.k || ""]?.[1] || "#888");
    b.textContent = i + 1; b.title = p.n; b.setAttribute("aria-label", `${i + 1}. ${p.n}`);
    b.onclick = (e) => { e.stopPropagation(); if (b.dataset.moveu) return; sel = i; renderMapa(); renderFicha(); };
    if (edit) arrastavel(b, i);
    m.appendChild(b);
  });
  $("dica").textContent = adding ? "Clique no mapa onde o novo ponto deve ficar." : edit ? "Arraste um número para mudá-lo de lugar; ele muda na mesa também." : "Clique num número para ver o ponto.";
  renderFiltros();
}
function arrastavel(b, i) {
  b.onpointerdown = (ev) => {
    ev.preventDefault(); b.setPointerCapture(ev.pointerId); let moveu = false; const l = L();
    b.onpointermove = (e) => { const [x, y] = posNoMapa(e); const p = pontosEditaveis()[i]; p.x = Math.max(0, Math.min(l.gw, x)); p.y = Math.max(0, Math.min(l.gh, y)); b.style.left = (p.x / l.gw * 100) + "%"; b.style.top = (p.y / l.gh * 100) + "%"; moveu = true; };
    b.onpointerup = () => { b.onpointermove = null; if (moveu) { b.dataset.moveu = "1"; setTimeout(() => delete b.dataset.moveu, 0); sel = i; salvar(); renderMapa(); renderFicha(); } };
  };
}

/* ---------- melhorias do hotel ---------- */
function renderMelh() {
  const l = L(), box = $("melh");
  if (!l.camadas) { box.innerHTML = ""; return; }
  const on = new Set(E.melhorias[cur] || []);
  box.innerHTML = `<div class="melhorias"><h3>Melhorias da base · ${on.size} de ${l.camadas.length}</h3>
    ${l.camadas.map((c) => `<label class="melh ${on.has(c.k) ? "on" : ""}"><input type="checkbox" data-k="${c.k}" ${on.has(c.k) ? "checked" : ""}><b>${esc(c.nome)}</b><small>${esc(c.req)}</small></label>`).join("")}</div>`;
  box.querySelectorAll("input[data-k]").forEach((cb) => cb.onchange = () => {
    const s = new Set(E.melhorias[cur] || []); cb.checked ? s.add(cb.dataset.k) : s.delete(cb.dataset.k);
    E.melhorias[cur] = l.camadas.map((c) => c.k).filter((k) => s.has(k)); salvar(); renderMelh(); renderMapa();
  });
}

/* ---------- ficha do ponto ---------- */
function renderFicha() {
  const lista = pts(), p = lista[sel], f = $("ficha");
  if (!p) { f.innerHTML = `<p class="vazio">${lista.length ? "Escolha um ponto no mapa." : "Sem pontos. Use “Editar pontos” e “Novo ponto”."}</p>`; return; }
  const nav = `<div class="linha entre"><button type="button" id="p-ant" ${sel <= 0 ? "disabled" : ""}>← Anterior</button><span class="dica">${sel + 1} de ${lista.length}</span><button type="button" id="p-prox" ${sel >= lista.length - 1 ? "disabled" : ""}>Próximo →</button></div>`;
  const feitos = new Set(E.feitos[cur] || []);
  if (!edit) {
    f.innerHTML = `${nav}
      <div class="linha"><span class="chip ${TCLS[p.k || ""]}">${TAGS[p.k || ""][0]}</span>${p.a ? `<span class="dica">${esc(p.a)}</span>` : ""}</div>
      <h2>${sel + 1}. ${esc(p.n)}</h2>
      <h3>Testes</h3>
      ${p.t.length ? p.t.map(([per, dt, res]) => `<div class="teste"><b>${esc(per && per !== "—" ? per : "Sem teste")}</b>${dt ? `<span class="dt">DT ${esc(dt)}</span>` : `<span class="dt sem">livre</span>`}${res ? `<span class="res">${esc(res)}</span>` : ""}</div>`).join("") : `<p class="vazio">Nenhum teste.</p>`}
      <h3>O que se descobre</h3>${p.d ? `<div class="descobre">${esc(p.d)}</div>` : `<p class="vazio">Nada além do que os testes dizem.</p>`}
      <h3>Itens</h3>${p.i.length ? `<div class="itens">${p.i.map((x) => `<span>${esc(x)}</span>`).join("")}</div>` : `<p class="vazio">Nenhum item.</p>`}
      <label class="chk"><input type="checkbox" id="f-feito" ${feitos.has(sel) ? "checked" : ""}> Já explorado pelos jogadores</label>`;
    $("f-feito").onchange = (e) => { const s = new Set(E.feitos[cur] || []); e.target.checked ? s.add(sel) : s.delete(sel); E.feitos[cur] = [...s].sort((a, b) => a - b); salvar(); renderMapa(); };
  } else {
    f.innerHTML = `${nav}
      <label class="campo"><span>Nome</span><input type="text" id="f-n" value="${esc(p.n)}"></label>
      <div class="duas"><label class="campo"><span>Área</span><input type="text" id="f-a" value="${esc(p.a)}"></label>
        <label class="campo"><span>Tipo</span><select id="f-k">${Object.entries(TAGS).map(([k, [n]]) => `<option value="${k}" ${k === (p.k || "") ? "selected" : ""}>${n}</option>`).join("")}</select></label></div>
      <label class="campo"><span>Testes · um por linha: Perícia | DT | o que acontece</span><textarea id="f-t" rows="4">${esc(p.t.map(([a, b, c]) => `${a} | ${b ?? ""} | ${c}`).join("\n"))}</textarea></label>
      <label class="campo"><span>O que se descobre</span><textarea id="f-d">${esc(p.d)}</textarea></label>
      <label class="campo"><span>Itens · separados por vírgula</span><input type="text" id="f-i" value="${esc(p.i.join(", "))}"></label>
      <div class="linha entre"><button type="button" class="perigo-btn" id="f-del">Apagar este ponto</button>
        <button type="button" id="f-orig">Restaurar os pontos originais deste local</button></div>
      <p class="aviso" id="f-conf" hidden></p>`;
    const sync = () => {
      const q = pontosEditaveis()[sel];
      q.n = $("f-n").value; q.a = $("f-a").value; q.k = $("f-k").value; q.d = $("f-d").value;
      q.i = $("f-i").value.split(",").map((s) => s.trim()).filter(Boolean);
      q.t = $("f-t").value.split("\n").map((s) => s.trim()).filter(Boolean).map((s) => { const [a, b, ...c] = s.split("|").map((z) => z.trim()); return [a || "—", b ? +b || null : null, c.join(" | ")]; });
      salvar(); renderMapa();
    };
    f.querySelectorAll("input,textarea,select").forEach((e) => e.addEventListener("change", sync));
    $("f-n").addEventListener("input", sync);
    let confirma = null;
    const pedir = (txt, acao) => { confirma = acao; $("f-conf").hidden = false; $("f-conf").innerHTML = `${esc(txt)} <button type="button" id="f-sim" class="primario">Confirmar</button> <button type="button" id="f-nao">Cancelar</button>`; $("f-sim").onclick = () => confirma(); $("f-nao").onclick = () => { $("f-conf").hidden = true; }; };
    $("f-del").onclick = () => pedir(`Apagar “${p.n}”?`, () => {
      pontosEditaveis().splice(sel, 1);
      E.feitos[cur] = (E.feitos[cur] || []).filter((n) => n !== sel).map((n) => n > sel ? n - 1 : n);
      sel = Math.max(0, sel - 1); salvar(); tudo();
    });
    $("f-orig").onclick = () => pedir("Voltar todos os pontos deste local ao original? As suas edições aqui se perdem.", () => { delete E.edits[cur]; sel = 0; salvar(); tudo(); });
  }
  $("p-ant").onclick = () => { sel--; renderMapa(); renderFicha(); };
  $("p-prox").onclick = () => { sel++; renderMapa(); renderFicha(); };
}

/* ---------- informações do local ---------- */
function renderInfo() {
  const l = L();
  const blocos = [["Ao chegar", `<p>${esc(l.resumo)}</p>`], ["Perigos", `<p>${esc(l.perigos)}</p>`], ["Segredo", `<p>${esc(l.segredo)}</p>`, "segredo"],
    ["Como descobrir", `<ol>${(l.como || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ol>`], ["Quando a água chega", `<p>${esc(l.agua)}</p>`, "agua"],
    ...(l.extras || []).filter((x) => x.titulo !== "Melhorias").map((x) => [x.titulo, `<ul>${x.linhas.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`])];
  const aberto = $("info").open;
  $("info").innerHTML = `<summary>${esc(l.nome)}: o local inteiro</summary>${blocos.map(([t, h, c]) => `<div class="bloco ${c || ""}"><h3>${t}</h3>${h}</div>`).join("")}`;
  $("info").open = aberto;
}

function tudo() { renderCena(); renderMapa(); renderMelh(); renderFicha(); renderInfo(); }

/* ---------- início ---------- */
OBR.onReady(async () => {
  const gm = (await OBR.player.getRole()) === "GM";
  if (!gm) { $("app").innerHTML = `<h1>Battlemaps do Hexatombe</h1><p class="vazio">Esta extensão é do mestre: os mapas aparecem na mesa quando ele os coloca.</p>`; return; }
  sala = OBR.room.id; E = lerEstado(sala);
  montar();
  cenaPronta = await OBR.scene.isReady(); await lerCena();
  const vinc = naCena[0]; if (vinc) cur = vinc.local;
  tudo();
  OBR.scene.onReadyChange(async (r) => { cenaPronta = r; await lerCena(); if (naCena[0]) cur = naCena[0].local; tudo(); });
  OBR.scene.items.onChange(async () => { const antes = JSON.stringify(naCena); await lerCena(); if (JSON.stringify(naCena) !== antes) renderCena(); });
});
