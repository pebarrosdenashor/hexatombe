/* =========================================================
   Contadores especiais de equipe: Fome (Os Comensais) e
   Fervor (A Romaria). O mestre soma ou tira pontos aqui ou no
   Escudo do Mestre; o Escudo deixa os pedidos no navegador
   (mesmo site) e quem estiver aberto aqui aplica.
   ========================================================= */
export const CONTADOR_KEY = "io.github.pebarrosdenashor.hexatombe:contador";

export const CONTADORES = {
  fome: { nome: "Fome", ic: "🩸" },
  fervor: { nome: "Fervor", ic: "🕯" },
};

/* Qual contador a equipe usa: escolhido pelo mestre ou, sem escolha, pelo nome */
export function contadorDe(t) {
  if (!t) return "";
  if (t.contador != null) return CONTADORES[t.contador] ? t.contador : "";
  const n = String(t.nome || "").toLowerCase();
  if (/comensa/.test(n)) return "fome";
  if (/romaria|romeir/.test(n)) return "fervor";
  return "";
}

export function lerOps() {
  try { const a = JSON.parse(localStorage.getItem(CONTADOR_KEY) || "[]"); return Array.isArray(a) ? a : []; } catch { return []; }
}
/* Tira só os pedidos já lidos: um clique que chegue no meio do caminho não se perde */
export function apagarOps(lidos = []) {
  try {
    const id = (o) => `${o.at}|${o.ti}|${o.k}|${o.dv}|${o.set}`;
    const ja = new Set(lidos.map(id)); const resto = lerOps().filter((o) => !ja.has(id(o)));
    if (resto.length) localStorage.setItem(CONTADOR_KEY, JSON.stringify(resto)); else localStorage.removeItem(CONTADOR_KEY);
  } catch { /* */ }
}

/* Aplica os pedidos no estado; devolve as linhas para o registro */
export function aplicarOps(state, ops) {
  const linhas = [];
  for (const op of ops || []) {
    const t = state?.equipes?.[Number(op.ti)]; const k = op.k;
    if (!t || !CONTADORES[k]) continue;
    if (op.set != null) t[k] = Math.max(0, Math.round(Number(op.set) || 0));
    else t[k] = Math.max(0, (Number(t[k]) || 0) + (Number(op.dv) || 0));
    linhas.push(`${t.nome}: ${CONTADORES[k].ic} ${CONTADORES[k].nome} ${t[k]}`);
  }
  if (linhas.length) state.rev = Date.now();
  return linhas;
}
