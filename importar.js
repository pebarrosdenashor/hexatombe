/* =========================================================
   Equipe gerada no Escudo do Mestre, entregue ao Hexatombe.
   O Escudo deixa o pedido no navegador (mesmo site) e quem
   estiver aberto aqui (a janela ou o fundo) coloca a equipe
   numa das equipes do ritual, com os NPCs na aba NPCs.
   ========================================================= */
export const IMPORT_KEY = "io.github.pebarrosdenashor.hexatombe:importar";
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

export function lerPedido() {
  try { const p = JSON.parse(localStorage.getItem(IMPORT_KEY) || "null"); return p?.equipe?.membros ? p : null; } catch { return null; }
}
export function apagarPedido() { try { localStorage.removeItem(IMPORT_KEY); } catch { /* */ } }

/* Muda o estado do ritual; devolve o índice da equipe usada, ou -1 */
export function aplicarPedido(state, pedido, agendaKey) {
  if (!state?.equipes?.length || !pedido) return -1;
  let ti = Number(pedido.ti);
  if (!(ti >= 0 && ti < state.equipes.length)) ti = state.equipes.findIndex((t) => !(t.membros || []).length);
  if (ti < 0) return -1;
  const t = state.equipes[ti]; const eq = pedido.equipe;
  state.bestiario ||= [];
  const membros = [];
  for (const m of eq.membros.slice(0, 8)) {
    const npc = { ...m, id: uid(), custom: true };
    state.bestiario.push(npc);
    membros.push({ id: uid(), nome: npc.nome, npcId: npc.id, sheetId: null, vivo: true, sac: null, des: false });
  }
  // fichas de jogadores nunca saem da equipe; só os NPCs são trocados
  t.membros = [...(t.membros || []).filter((m) => m.sheetId), ...membros];
  t.nome = String(eq.nome || t.nome).slice(0, 60);
  t.perfil = (eq.perfil || []).map((x) => String(x).slice(0, 400)).slice(0, 12);
  try {
    const ag = JSON.parse(localStorage.getItem(agendaKey) || "{}");
    ag[ti] = (ag[ti] ? ag[ti] + "\n" : "") + (eq.plano || "");
    localStorage.setItem(agendaKey, JSON.stringify(ag));
  } catch { /* */ }
  state.rev = Date.now();
  return ti;
}
