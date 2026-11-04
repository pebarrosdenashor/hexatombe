/* =========================================================
   v2.8 — Quadro de investigação: dados e sincronia
   O quadro é de todos: cada um guarda uma cópia no navegador
   e as mudanças viajam por mensagem. Cada cartão e cada fio
   tem a hora da última mudança; vale a mais nova.
   Usado pela janela do quadro (quadro.js) e pelo fundo.
   ========================================================= */

export const NS = "io.github.pebarrosdenashor.hexatombe";
export const QCH = NS + "/quadro";
export const LARG = 2400, ALT = 1600; // tamanho do quadro
export const TAM_MIN = 0.4, TAM_MAX = 3; // tamanho de cada cartão (1 = normal)
export const TAM_OK = (t) => { const n = Number(t); return n > 0 ? Math.round(clamp(n, TAM_MIN, TAM_MAX) * 100) / 100 : 1; };
export const TIPOS = ["nota", "pista", "criatura", "pessoa", "foto", "token"];
const num = (v) => Number(v) || 0;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const corta = (v, n) => String(v ?? "").slice(0, n);
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const qKey = (roomId) => `${NS}:quadro:${roomId}`;
export function vazio() { return { cards: {}, fios: {} }; }
export function ler(roomId) {
  try { const q = JSON.parse(localStorage.getItem(qKey(roomId)) || "null"); if (q && q.cards && q.fios) return q; } catch { /* */ }
  return vazio();
}
export function gravar(roomId, q) { try { localStorage.setItem(qKey(roomId), JSON.stringify(q)); return true; } catch { return false; } }

/* Limpa o que chega de fora (tamanhos, números) */
function limpaCard(c) {
  if (!c || typeof c !== "object" || !c.id) return null;
  if (c.del) return { id: corta(c.id, 40), del: true, at: num(c.at) };
  return {
    id: corta(c.id, 40), tipo: TIPOS.includes(c.tipo) ? c.tipo : "nota", ref: corta(c.ref, 120), titulo: corta(c.titulo, 80), txt: corta(c.txt, 500),
    url: /^https:\/\//i.test(c.url || "") ? corta(c.url, 600) : "", cor: corta(c.cor, 12), x: clamp(num(c.x), 0, LARG - 60), y: clamp(num(c.y), 0, ALT - 60),
    rot: clamp(num(c.rot), -6, 6), tam: TAM_OK(c.tam), autor: corta(c.autor, 60), at: num(c.at),
  };
}
function limpaFio(f) {
  if (!f || typeof f !== "object" || !f.id) return null;
  if (f.del) return { id: corta(f.id, 40), del: true, at: num(f.at) };
  return { id: corta(f.id, 40), a: corta(f.a, 40), b: corta(f.b, 40), rotulo: corta(f.rotulo, 60), cor: f.cor === "preto" ? "preto" : "vermelho", autor: corta(f.autor, 60), at: num(f.at) };
}
/* Junta "add" em "q"; devolve true se algo mudou */
export function mesclar(q, add) {
  let mudou = false;
  for (const [tipo, limpa] of [["cards", limpaCard], ["fios", limpaFio]]) {
    for (const it0 of Object.values(add?.[tipo] || {})) {
      const it = limpa(it0); if (!it) continue;
      const cur = q[tipo][it.id];
      if (!cur || it.at > num(cur.at) || (it.at === num(cur.at) && JSON.stringify(it) > JSON.stringify(cur))) { q[tipo][it.id] = it; mudou = true; }
    }
  }
  podar(q); return mudou;
}
/* Apaga de vez as marcas de "apagado" muito antigas */
function podar(q) {
  const lim = Date.now() - 14 * 864e5;
  for (const t of ["cards", "fios"]) for (const [id, it] of Object.entries(q[t])) if (it.del && num(it.at) < lim) delete q[t][id];
}
export const vivos = (q, t) => Object.values(q[t]).filter((x) => !x.del);
export function novoId() { return uid(); }

/* ---------- Tokens do mapa (v2.9) ---------- */
export const CAMADAS_TOKEN = ["CHARACTER", "MOUNT", "PROP"];
export function nomeToken(it) { return String(it?.text?.plainText || it?.name || "Token").trim().slice(0, 80) || "Token"; }
export function tokenServe(it, gm) { return it?.type === "IMAGE" && CAMADAS_TOKEN.includes(it.layer) && /^https:\/\//i.test(it.image?.url || "") && (gm || it.visible !== false); }
/* Cartão de um token, perto de (x, y) no quadro */
export function cardDeToken(it, autor, x = LARG / 2, y = ALT / 2) {
  return { id: uid(), tipo: "token", ref: corta(it.id, 120), titulo: nomeToken(it), txt: "", url: corta(it.image.url, 600), cor: "",
    x: clamp(x - 75 + (Math.random() - 0.5) * 420, 20, LARG - 220), y: clamp(y - 80 + (Math.random() - 0.5) * 260, 20, ALT - 240),
    rot: 0, autor: corta(autor, 60), at: Date.now() };
}

/* ---------- Mensagens em partes ---------- */
export function enviador(OBR) {
  return async function enviar(payload, destino = "REMOTE") {
    const str = JSON.stringify(payload); const n = Math.max(1, Math.ceil(str.length / 6000)); const m = uid();
    for (let i = 0; i < n; i++) {
      try { await OBR.broadcast.sendMessage(QCH, { m, i, n, d: str.slice(i * 6000, (i + 1) * 6000) }, { destination: destino }); } catch { return false; }
      if (n > 1) await sleep(60);
    }
    return true;
  };
}
export function receptor(cb) {
  const partes = {};
  return (data) => {
    if (!data?.m) return;
    const p = (partes[data.m] ||= { n: data.n, parts: [], got: 0, at: Date.now() });
    if (p.parts[data.i] === undefined) { p.parts[data.i] = data.d; p.got++; }
    for (const [k, v] of Object.entries(partes)) if (Date.now() - v.at > 60000) delete partes[k];
    if (p.got !== p.n) return;
    delete partes[data.m];
    try { cb(JSON.parse(p.parts.join(""))); } catch { /* */ }
  };
}
