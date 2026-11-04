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
export const TIPOS = ["nota", "pista", "criatura", "pessoa", "foto"];
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
    rot: clamp(num(c.rot), -6, 6), autor: corta(c.autor, 60), at: num(c.at),
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
