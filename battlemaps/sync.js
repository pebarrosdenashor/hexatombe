/* Battlemaps do Hexatombe — estado do mestre e sincronização com a cena.
   O estado fica no navegador do mestre (localStorage, por sala).
   Quem mexe nos itens da cena é só o fundo da extensão (background.js),
   para a janela e o fundo nunca criarem itens em dobro. */
import OBR, { buildImage, buildLabel } from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
import { LOCAIS, VERSAO } from "./dados.js";

export const NS = "io.github.pebarrosdenashor.hexatombe-battlemaps";
export const META = NS + "/item";          // metadado dos itens que a extensão cuida
export const BASE = new URL(".", import.meta.url).href;
export const DPI_IMG = 50;                  // 50 px da imagem = 1 quadrado da grade
const PING = NS + "/ping";

export const locPorId = (id) => LOCAIS.find((l) => l.id === id);
const chave = (sala) => `${NS}/estado/${sala}`;

export function estadoVazio() { return { melhorias: {}, feitos: {}, pontos: false, edits: {}, copa: {}, fmt: 2 }; }
export function lerEstado(sala) {
  try { return migrar(Object.assign(estadoVazio(), { fmt: 1 }, JSON.parse(localStorage.getItem(chave(sala)) || "{}"))); } catch { return estadoVazio(); }
}
/* formato 2 dos pontos: cabeçalho (b), quadro de perícias (t) e descrição contextual (d).
   Pontos editados no formato antigo recebem o texto novo e mantêm posição, nome e itens. */
function migrar(e) {
  if (e.fmt >= 2) return e;
  for (const [id, lista] of Object.entries(e.edits || {})) {
    const orig = locPorId(id)?.pois || [];
    lista.forEach((p) => {
      const o = orig.find((x) => x.n === p.n);
      if (o) { p.b = o.b; p.t = JSON.parse(JSON.stringify(o.t)); p.d = o.d; }
      else { p.b = p.b || ""; p.t = (p.t || []).map(([a, b, c]) => [a && a !== "—" ? a : "Percepção", b ?? 5, c]); }
    });
  }
  e.fmt = 2; return e;
}
export function salvarEstado(sala, e) {
  try { localStorage.setItem(chave(sala), JSON.stringify(e)); localStorage.setItem(PING, String(Date.now())); } catch { /* sem armazenamento */ }
}
export function pedirSincronia() { try { localStorage.setItem(PING, String(Date.now())); } catch { /* */ } }
export function ehPing(k) { return k === PING || (k || "").startsWith(NS + "/estado/"); }

/* pontos do local, com as edições do mestre por cima */
export function pontosDe(e, id) { return e.edits?.[id] || locPorId(id).pois; }

export const urlMapa = (id) => `${BASE}imagens/${id}.png?v=${VERSAO}`;
export const urlCamada = (k) => `${BASE}imagens/hotel/${k}.png?v=${VERSAO}`;
/* copa das árvores (Mata): camada acima dos personagens; plataformas e cordas ficam no mapa, sempre opacas */
export const modoCopa = (e, id) => { const c = locPorId(id)?.copa; if (!c) return null; const k = e.copa?.[id]; return c.modos.some((m) => m.k === k) ? k : c.modos[0].k; };
export const urlCopa = (id, k) => { const c = locPorId(id).copa; return `${BASE}imagens/${id}/${c.modos.find((m) => m.k === k).arq}.png?v=${VERSAO}`; };

/* põe um mapa novo na cena */
export async function colocarMapa(id, pos = { x: 0, y: 0 }) {
  const l = locPorId(id);
  const item = buildImage({ width: l.img[0], height: l.img[1], url: urlMapa(id), mime: "image/png" }, { dpi: DPI_IMG, offset: { x: 0, y: 0 } })
    .layer("MAP").locked(true).position(pos).name(`Battlemap · ${l.nome}`)
    .metadata({ [META]: { tipo: "mapa", local: id, v: VERSAO } }).build();
  await OBR.scene.items.addItems([item]);
  pedirSincronia();
}

/* transforma uma imagem que já está na cena no mapa escolhido, no mesmo lugar */
export async function vincularImagem(itemId, id) {
  const l = locPorId(id);
  await OBR.scene.items.updateItems([itemId], (ds) => {
    for (const d of ds) {
      d.image.url = urlMapa(id); d.image.width = l.img[0]; d.image.height = l.img[1]; d.image.mime = "image/png";
      d.grid.dpi = DPI_IMG; d.grid.offset = { x: 0, y: 0 };
      d.name = `Battlemap · ${l.nome}`; d.layer = "MAP"; d.locked = true;
      d.metadata[META] = { tipo: "mapa", local: id, v: VERSAO };
    }
  });
  pedirSincronia();
}

export async function desvincular(itemId) {
  const filhos = await OBR.scene.items.getItems((i) => i.metadata?.[META]?.pai === itemId);
  if (filhos.length) await OBR.scene.items.deleteItems(filhos.map((i) => i.id));
  await OBR.scene.items.updateItems([itemId], (ds) => { for (const d of ds) delete d.metadata[META]; });
}

/* ---------- sincronia: deixa a cena igual ao estado ---------- */
let rodando = false, deNovo = false;
export async function sincronizar(sala) {
  if (rodando) { deNovo = true; return; }
  rodando = true;
  try {
    do { deNovo = false; await passo(sala); } while (deNovo);
  } catch (err) { console.warn("battlemaps: sincronia falhou", err); }
  finally { rodando = false; }
}

async function passo(sala) {
  if (!(await OBR.scene.isReady())) return;
  const e = lerEstado(sala);
  const dpiCena = await OBR.scene.grid.getDpi();
  const todos = await OBR.scene.items.getItems((i) => i.metadata?.[META]);
  const mapas = todos.filter((i) => i.metadata[META].tipo === "mapa" && locPorId(i.metadata[META].local));
  const ids = new Set(mapas.map((m) => m.id));
  const add = [], del = [], upd = new Map();

  // filhos órfãos (o mapa foi apagado ou desvinculado)
  for (const i of todos) { const p = i.metadata[META].pai; if (p && !ids.has(p)) del.push(i.id); }

  for (const m of mapas) {
    const id = m.metadata[META].local, l = locPorId(id);
    const u = (dpiCena / DPI_IMG) * (m.scale?.x || 1);
    const ponto = (px, py) => ({ x: m.position.x + px * u, y: m.position.y + py * u });
    const filhos = todos.filter((i) => i.metadata[META].pai === m.id);

    // versão nova da imagem
    if (m.metadata[META].v !== VERSAO) upd.set(m.id, (d) => { d.image.url = urlMapa(id); d.image.width = l.img[0]; d.image.height = l.img[1]; d.metadata[META] = { ...d.metadata[META], v: VERSAO }; });

    // camadas de melhoria
    const querCam = new Set(l.camadas ? (e.melhorias[id] || []) : []);
    const temCam = filhos.filter((i) => i.metadata[META].tipo === "camada");
    for (const c of temCam) if (!querCam.has(c.metadata[META].k) || c.metadata[META].v !== VERSAO) del.push(c.id);
    const okCam = new Set(temCam.filter((c) => querCam.has(c.metadata[META].k) && c.metadata[META].v === VERSAO).map((c) => c.metadata[META].k));
    (l.camadas || []).forEach((c, n) => {
      if (!querCam.has(c.k) || okCam.has(c.k)) return;
      const [x0, y0, x1, y1] = c.off;
      add.push(buildImage({ width: x1 - x0, height: y1 - y0, url: urlCamada(c.k), mime: "image/png" }, { dpi: DPI_IMG, offset: { x: 0, y: 0 } })
        .layer("MAP").locked(true).disableHit(true).position(ponto(x0, y0)).scale(m.scale || { x: 1, y: 1 })
        .zIndex((m.zIndex || 0) + 1 + n).attachedTo(m.id).name(`Melhoria · ${c.nome}`)
        .metadata({ [META]: { tipo: "camada", pai: m.id, k: c.k, v: VERSAO } }).build());
    });

    // copa das árvores: fica na camada ATTACHMENT, acima dos tokens, e não pega cliques
    const temCopa = filhos.filter((i) => i.metadata[META].tipo === "copa");
    const querCopa = modoCopa(e, id);
    for (const c of temCopa) if (c.metadata[META].modo !== querCopa || c.metadata[META].v !== VERSAO) del.push(c.id);
    if (querCopa && !temCopa.some((c) => c.metadata[META].modo === querCopa && c.metadata[META].v === VERSAO)) {
      const [x0, y0, x1, y1] = l.copa.off;
      add.push(buildImage({ width: x1 - x0, height: y1 - y0, url: urlCopa(id, querCopa), mime: "image/png" }, { dpi: DPI_IMG, offset: { x: 0, y: 0 } })
        .layer("ATTACHMENT").locked(true).disableHit(true).position(ponto(x0, y0)).scale(m.scale || { x: 1, y: 1 })
        .attachedTo(m.id).name(`${l.copa.nome} · ${l.copa.modos.find((x) => x.k === querCopa).nome}`)
        .metadata({ [META]: { tipo: "copa", pai: m.id, modo: querCopa, v: VERSAO } }).build());
    }

    // pontos de interesse (só o mestre vê: itens ocultos)
    const temPt = filhos.filter((i) => i.metadata[META].tipo === "ponto");
    const pts = e.pontos ? pontosDe(e, id) : [];
    const feitos = new Set(e.feitos[id] || []);
    temPt.forEach((it) => { if (it.metadata[META].n >= pts.length) del.push(it.id); });
    pts.forEach((p, n) => {
      const txt = `${n + 1}${feitos.has(n) ? " ✓" : ""} ${p.n}`;
      const pos = ponto(p.x * DPI_IMG, p.y * DPI_IMG);
      const ex = temPt.find((it) => it.metadata[META].n === n);
      if (ex) {
        const mudou = ex.text?.plainText !== txt || Math.abs(ex.position.x - pos.x) > .5 || Math.abs(ex.position.y - pos.y) > .5;
        if (mudou) upd.set(ex.id, (d) => { d.text.plainText = txt; d.position = pos; d.style.backgroundColor = feitos.has(n) ? "#4b5a3a" : "#7a2a20"; });
      } else {
        add.push(buildLabel().plainText(txt).position(pos).layer("TEXT").visible(false).locked(true).attachedTo(m.id)
          .fontSize(16).fontWeight(600).fillColor("#f3ead2").backgroundColor(feitos.has(n) ? "#4b5a3a" : "#7a2a20").backgroundOpacity(.9)
          .pointerHeight(0).cornerRadius(6).padding(6).name(`Ponto ${n + 1} · ${p.n}`)
          .metadata({ [META]: { tipo: "ponto", pai: m.id, n } }).build());
      }
    });
  }

  if (del.length) await OBR.scene.items.deleteItems([...new Set(del)]);
  if (upd.size) {
    const ids2 = [...upd.keys()].filter((k) => !del.includes(k));
    if (ids2.length) await OBR.scene.items.updateItems(ids2, (ds) => { for (const d of ds) upd.get(d.id)(d); });
  }
  if (add.length) await OBR.scene.items.addItems(add);
}
