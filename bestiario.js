/* =========================================================
   v2.8 — Bestiário revelado aos poucos (regras comuns)
   Usado pela janela (app.js) e pelo fundo (background.js),
   que aplica as pesquisas dos jogadores com a janela fechada.
   ========================================================= */

export const NIVEIS = [
  ["0", "Oculta — os jogadores não sabem que existe"],
  ["1", "Pressentida — só a silhueta e um rumor"],
  ["2", "Avistada — nome, tipo, imagem e descrição"],
  ["3", "Estudada — + deslocamento, atributos, resistências, vulnerabilidade e presença"],
  ["4", "Dissecada — + Defesa, PV, VD, ataques e habilidades"],
];
export const NIVEL_CURTO = ["oculta", "pressentida", "avistada", "estudada", "dissecada"];
// campo da criatura, rótulo e o nível em que ele se revela sozinho
export const CAMPOS = [
  ["desl", "Deslocamento", 3], ["attrs", "Atributos", 3], ["rd", "Resistências", 3], ["vuln", "Vulnerável a", 3], ["pp", "Presença perturbadora", 3],
  ["def", "Defesa", 4], ["pv", "PV", 4], ["vd", "VD", 4], ["atq", "Ataques", 4], ["hab", "Habilidades", 4],
];
export const PESQ_MAX = 3; // pesquisa leva no máximo até "estudada"; dissecar é com o mestre
const num = (v) => Number(v) || 0;

/* Antes da v2.8 eram 4 níveis (0 oculta, 1 avistada, 2 estudada, 3 dissecada): sobe um, para caber "pressentida" */
export function migrarRevela(st) {
  if (!st || st.revelaV >= 2) return st;
  for (const r of Object.values(st.revela || {})) if (num(r.n) > 0) r.n = Math.min(4, num(r.n) + 1);
  st.revelaV = 2; return st;
}
export function revelaDe(st, k) {
  const r = st?.revela?.[k] || {};
  return { n: num(r.n), nota: r.nota || "", rumor: r.rumor || "", img: r.img || "", extra: Array.isArray(r.extra) ? r.extra : [], pesq: !!r.pesq, dt: num(r.dt) || 20, tent: r.tent || {} };
}
export function sabe(r, campo) { const c = CAMPOS.find(([k]) => k === campo); return !!c && (r.n >= c[2] || r.extra.includes(campo)); }

/* Imagem guardada no navegador do mestre que já pode ir para os jogadores */
export function imgLiberada(st, id) {
  const ref = `arq:${id}`;
  return (st?.pistas || []).some((p) => p.revelada && p.img === ref) || Object.values(st?.revela || {}).some((r) => num(r.n) >= 1 && r.img === ref);
}

/* Nome que os jogadores podem ver */
export function nomeDaChave(st, k, livro = []) {
  if (k.startsWith("l:")) return k.slice(2);
  const c = (st?.bestiario || []).find((x) => `c:${x.id}` === k) || livro.find((x) => `l:${x.nome}` === k);
  return c?.nome || "criatura";
}

/* Pesquisa de um jogador: d = { k, pid, nome, total, txt }.
   Muda o estado (st) e devolve o texto do anúncio, ou null se não valeu. */
export function aplicarPesquisa(st, d) {
  const k = String(d.k || ""); const r0 = st?.revela?.[k]; if (!r0) return null;
  const r = revelaDe(st, k);
  if (!r.pesq || r.n < 1 || r.n >= PESQ_MAX) return null; // de pressentida ou avistada, sobe um nível
  const chave = `${d.pid}:${r.n}`;
  if ((r0.tent ||= {})[chave] !== undefined) return null; // uma tentativa por pessoa em cada nível
  const total = num(d.total); r0.tent[chave] = total;
  const quem = String(d.nome || "Alguém").slice(0, 60);
  const nomeAntes = r.n >= 2 ? nomeDaChave(st, k) : "a criatura desconhecida";
  if (total >= r.dt) {
    r0.n = r.n + 1;
    return { ok: true, n: r0.n, texto: `🔍 ${quem} pesquisou ${nomeAntes} (${total} contra DT ${r.dt}) e descobriu mais: agora ${NIVEL_CURTO[r0.n]}.` };
  }
  return { ok: false, n: r.n, texto: `🔍 ${quem} pesquisou ${nomeAntes} (${total} contra DT ${r.dt}), mas não achou nada novo.` };
}
