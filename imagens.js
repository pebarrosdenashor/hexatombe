/* =========================================================
   Imagens das pistas enviadas do computador do mestre.
   Ficam no navegador (IndexedDB), fora do estado do ritual,
   e só viajam para os jogadores quando a pista é revelada.
   Uma pista com imagem do PC guarda img = "arq:<id>".
   ========================================================= */

const DB = "hexatombe-imagens", STORE = "img";
let dbp = null;
function db() {
  if (!dbp) dbp = new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
  return dbp;
}
async function tx(modo, fn) {
  const d = await db();
  return new Promise((res, rej) => { const t = d.transaction(STORE, modo); const q = fn(t.objectStore(STORE)); t.oncomplete = () => res(q?.result); t.onerror = () => rej(t.error); });
}
export const ehArq = (img) => /^arq:[\w-]+$/.test(String(img || ""));
export const arqId = (img) => String(img).slice(4);
export async function pegar(id) { try { return (await tx("readonly", (s) => s.get(id))) || null; } catch { return null; } }
export async function guardar(id, data) { try { await tx("readwrite", (s) => s.put(data, id)); return true; } catch { return false; } }
export async function apagar(id) { try { await tx("readwrite", (s) => s.delete(id)); } catch { /* */ } }
export async function todas() {
  try {
    const d = await db();
    return await new Promise((res, rej) => {
      const out = {}; const t = d.transaction(STORE, "readonly"); const c = t.objectStore(STORE).openCursor();
      c.onsuccess = () => { const k = c.result; if (k) { out[k.key] = k.value; k.continue(); } };
      t.oncomplete = () => res(out); t.onerror = () => rej(t.error);
    });
  } catch { return {}; }
}

/* Preenche <img data-arq="id"> com a imagem guardada; devolve os ids que faltam */
export async function preencher(root = document) {
  const falta = [];
  for (const el of root.querySelectorAll("img[data-arq]")) {
    if (el.dataset.ok) continue;
    const data = await pegar(el.dataset.arq);
    if (data) { el.src = data; el.dataset.ok = "1"; el.classList.remove("carregando"); }
    else { el.classList.add("carregando"); falta.push(el.dataset.arq); }
  }
  return [...new Set(falta)];
}

/* ---------- Converter o arquivo escolhido em imagem leve ---------- */
const LIMITE = 260 * 1024; // ~260 KB por imagem, para chegar rápido aos jogadores
function carregarImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
function encolher(canvas, maxLado) {
  const k = Math.min(1, maxLado / Math.max(canvas.width, canvas.height));
  if (k >= 1) return canvas;
  const c = document.createElement("canvas"); c.width = Math.round(canvas.width * k); c.height = Math.round(canvas.height * k);
  c.getContext("2d").drawImage(canvas, 0, 0, c.width, c.height); return c;
}
function paraJpeg(canvas) {
  // fundo de papel atrás de PNG transparente
  const c = document.createElement("canvas"); c.width = canvas.width; c.height = canvas.height;
  const g = c.getContext("2d"); g.fillStyle = "#e9dfc9"; g.fillRect(0, 0, c.width, c.height); g.drawImage(canvas, 0, 0);
  let lado = Math.max(c.width, c.height), q = 0.85, url = c.toDataURL("image/jpeg", q);
  let cur = c;
  while (url.length * 0.75 > LIMITE && (q > 0.5 || lado > 700)) {
    if (q > 0.55) q -= 0.1; else { lado = Math.round(lado * 0.8); cur = encolher(c, lado); }
    url = cur.toDataURL("image/jpeg", q);
  }
  return url;
}
async function deImagem(file) {
  const src = URL.createObjectURL(file);
  try {
    const img = await carregarImg(src);
    const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
    c.getContext("2d").drawImage(img, 0, 0);
    return paraJpeg(encolher(c, 1600));
  } finally { URL.revokeObjectURL(src); }
}
let pdfjs = null;
async function dePdf(file) {
  if (!pdfjs) {
    pdfjs = await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.min.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs";
  }
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const n = Math.min(doc.numPages, 4); const paginas = [];
  for (let i = 1; i <= n; i++) {
    const pg = await doc.getPage(i); const v1 = pg.getViewport({ scale: 1 }); const vp = pg.getViewport({ scale: 1100 / v1.width });
    const c = document.createElement("canvas"); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
    await pg.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise; paginas.push(c);
  }
  // páginas empilhadas numa imagem só
  const w = Math.max(...paginas.map((p) => p.width)); const gap = 16;
  const h = paginas.reduce((s, p) => s + p.height, 0) + gap * (paginas.length - 1);
  const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d");
  g.fillStyle = "#2a1f17"; g.fillRect(0, 0, w, h);
  let y = 0; for (const p of paginas) { g.drawImage(p, 0, y); y += p.height + gap; }
  return { data: paraJpeg(encolher(c, 2400)), paginas: doc.numPages };
}

/* Lê um arquivo do PC. Devolve { titulo, texto?, data?, aviso? } */
export async function lerArquivo(file) {
  const titulo = file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim().slice(0, 80);
  const tipo = file.type || ""; const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (tipo.startsWith("image/") || ["png", "jpg", "jpeg", "webp", "gif", "bmp", "avif"].includes(ext)) return { titulo, data: await deImagem(file) };
  if (tipo === "application/pdf" || ext === "pdf") {
    const r = await dePdf(file);
    return { titulo, data: r.data, aviso: r.paginas > 4 ? `O PDF tem ${r.paginas} páginas; entraram as 4 primeiras.` : "" };
  }
  if (tipo.startsWith("text/") || ["txt", "md"].includes(ext)) {
    const tudo = await file.text();
    return { titulo, texto: tudo.slice(0, 4000), aviso: tudo.length > 4000 ? "O texto passou de 4000 caracteres e foi cortado." : "" };
  }
  throw new Error("tipo");
}
export const ACEITA = "image/*,.pdf,application/pdf,.txt,.md,text/plain";
