/* =========================================================
   Ritmo do ritual (v2.15): peças usadas pela janela, pelo fundo,
   pelo cartão de abertura e pelo relógio na tela.
   - seis velas (uma por estigma; apaga quando o sacrifício daquele estigma morre)
   - relógio do sacrifício (contagem regressiva que o mestre liga)
   - cartão de abertura do dia e da noite
   - preferências de cada pessoa (relógio na tela, posição, reduzir efeitos)
   ========================================================= */

export const NS = "io.github.pebarrosdenashor.hexatombe";
export const ESTIGMAS_R = [
  { nome: "Desejo", ab: "DES", cor: "#e0a33a" },
  { nome: "Rancor", ab: "RAN", cor: "#e2462f" },
  { nome: "Obsessão", ab: "OBS", cor: "#a35ad6" },
  { nome: "Culpa", ab: "CUL", cor: "#5b8fd9" },
  { nome: "Prazer", ab: "PRA", cor: "#e05a9a" },
  { nome: "Orgulho", ab: "ORG", cor: "#d9c94a" },
];
export const FASES_R = ["Preparação", "Execução", "Conclusão"];
export const ROTULOS = ["até a meia-noite", "até o sacrifício", "até o sino", "até o amanhecer", "até os espinhos avançarem"];

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const n = (v) => Number(v) || 0;

/* ---------- preferências deste navegador ---------- */
export const PREF = { hud: NS + ":hud", pos: NS + ":hudPos", calmo: NS + ":calmo", som: NS + ":som" };
const lget = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const lset = (k, v) => { try { localStorage.setItem(k, v); } catch { /* */ } };
export const pref = {
  hud: () => lget(PREF.hud) !== "0",
  setHud: (on) => lset(PREF.hud, on ? "1" : "0"),
  pos: () => (["topo", "direita", "baixo"].includes(lget(PREF.pos)) ? lget(PREF.pos) : "topo"),
  setPos: (p) => lset(PREF.pos, p),
  calmo: () => lget(PREF.calmo) === "1",
  setCalmo: (on) => lset(PREF.calmo, on ? "1" : "0"),
  som: () => lget(PREF.som) !== "0",
};

/* ---------- opções do mestre (vão no estado, para todos) ---------- */
export function opcoes(st) {
  const r = st?.ritmo || {};
  return { hud: r.hud !== false, noite: r.noite !== false, cartao: r.cartao !== false };
}
export const ehNoite = (st) => n(st?.fase) === 2;
export const ehLua = (st) => n(st?.dia) === 6;

/* ---------- as seis velas ---------- */
export function velas(st) {
  const sacs = Array.isArray(st?.sacrificios) ? st.sacrificios : [];
  const final = !!st?.finalFeito;
  return ESTIGMAS_R.map((e) => {
    const s = sacs.find((x) => x.estigma === e.nome);
    return { ...e, acesa: !s, dia: s ? n(s.dia) : 0, final: final && !s };
  });
}

/* ---------- relógio do sacrifício ---------- */
// st.relogio = { id, fim, total, rotulo, pausa? (ms restantes quando pausado) }
export function relogio(st, agora = Date.now()) {
  const r = st?.relogio; if (!r || !r.total) return null;
  const restante = r.pausa != null ? Math.max(0, n(r.pausa)) : Math.max(0, n(r.fim) - agora);
  return { id: r.id, rotulo: r.rotulo || ROTULOS[0], total: n(r.total), restante, pausado: r.pausa != null, frac: Math.max(0, Math.min(1, restante / n(r.total))), acabou: restante <= 0 && r.pausa == null };
}
export function mmss(ms) {
  const s = Math.ceil(ms / 1000); const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const ss = s % 60;
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}` : `${m}:${String(ss).padStart(2, "0")}`;
}

/* ---------- desenho das velas (SVG) ---------- */
// derrete: 0 a 1 (quanto a vela já derreteu; usado pelo relógio)
export function velaSVG(v, { w = 26, h = 54, derrete = 0, fumaca = false, titulo = true } = {}) {
  const corpoH = Math.max(10, 30 * (1 - 0.65 * derrete)); const topo = 50 - corpoH;
  const chama = v.acesa
    ? `<g class="chama"><ellipse cx="13" cy="${topo - 7}" rx="5.5" ry="9" fill="${v.cor}" opacity=".35" class="halo"/>
       <path d="M13 ${topo - 15} C 17 ${topo - 9}, 17 ${topo - 4}, 13 ${topo - 1} C 9 ${topo - 4}, 9 ${topo - 9}, 13 ${topo - 15} Z" fill="#ffd27a" class="fogo"/>
       <path d="M13 ${topo - 9} C 15 ${topo - 6}, 15 ${topo - 3}, 13 ${topo - 1.5} C 11 ${topo - 3}, 11 ${topo - 6}, 13 ${topo - 9} Z" fill="#fff6dc"/></g>`
    : `<g class="${fumaca ? "fumaca" : "fumaca-fixa"}"><path d="M13 ${topo - 1} C 10 ${topo - 6}, 16 ${topo - 10}, 12 ${topo - 16} S 15 ${topo - 24}, 12 ${topo - 30}" stroke="#9a9090" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`;
  const cera = v.acesa ? "#efe3cf" : "#6e6258";
  return `<svg class="vela ${v.acesa ? "acesa" : "apagada"}" viewBox="0 0 26 54" width="${w}" height="${h}" aria-label="${esc(v.nome)}">${titulo ? `<title>${esc(v.nome)}${v.acesa ? " — o sacrifício ainda vive" : ` — sacrifício realizado${v.dia ? ` no dia ${v.dia}` : ""}`}</title>` : ""}
    ${chama}
    <line x1="13" y1="${topo - 1}" x2="13" y2="${topo + 2}" stroke="#2a1d16" stroke-width="1.4"/>
    <rect x="7" y="${topo + 1}" width="12" height="${corpoH - 1}" rx="2" fill="${cera}"/>
    <path d="M7 ${topo + 4} q2 5 0 9" stroke="${v.acesa ? "#fff" : "#8a7d72"}" stroke-width="2" fill="none" opacity=".55"/>
    <rect x="9" y="${topo + 1}" width="3" height="${corpoH - 1}" fill="#fff" opacity="${v.acesa ? 0.18 : 0.06}"/>
    <rect x="3" y="49" width="20" height="4" rx="1.5" fill="${v.cor}" opacity=".85"/>
  </svg>`;
}
export function velasHTML(st, { novas = [], w = 26, h = 54, rotulo = true } = {}) {
  return `<div class="velas">${velas(st).map((v) => `<div class="vcel" title="${esc(v.nome)}">${velaSVG(v, { w, h, fumaca: novas.includes(v.nome) })}${rotulo ? `<span style="color:${v.cor}">${v.ab}</span>` : ""}</div>`).join("")}</div>`;
}
/* CSS das velas (injetado onde precisa) */
export const VELAS_CSS = `
.velas { display: flex; gap: 6px; justify-content: center; align-items: flex-end; }
.vcel { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.vcel span { font: 600 9px/1 "Barlow Condensed", Oswald, sans-serif; letter-spacing: .08em; opacity: .9; }
.vela .fogo { transform-origin: 13px 50px; animation: tremula 1.6s ease-in-out infinite alternate; }
.vela .halo { animation: pulsa 2.4s ease-in-out infinite alternate; }
.vcel:nth-child(2) .fogo { animation-delay: -.4s } .vcel:nth-child(3) .fogo { animation-delay: -.9s }
.vcel:nth-child(4) .fogo { animation-delay: -1.2s } .vcel:nth-child(5) .fogo { animation-delay: -.2s } .vcel:nth-child(6) .fogo { animation-delay: -.7s }
.vela.apagada { filter: saturate(.4); }
.vela .fumaca path { stroke-dasharray: 60; animation: sobe 3.5s ease-out forwards; }
.vela .fumaca-fixa path { opacity: .28; }
@keyframes tremula { 0% { transform: scale(1, 1) skewX(0) } 35% { transform: scale(.94, 1.06) skewX(3deg) } 70% { transform: scale(1.04, .95) skewX(-2deg) } 100% { transform: scale(.97, 1.03) skewX(1deg) } }
@keyframes pulsa { from { opacity: .22 } to { opacity: .45 } }
@keyframes sobe { 0% { stroke-dashoffset: 60; opacity: 0; transform: translateY(4px) } 15% { opacity: .9 } 100% { stroke-dashoffset: 0; opacity: .28; transform: translateY(0) } }
.calmo .vela .fogo, .calmo .vela .halo, .calmo .vela .fumaca path { animation: none !important; }
`;

/* ---------- frases do cartão ---------- */
const FRASE_DIA = [
  "Seis portas se fecharam atrás de vocês. A Coroa conta cada respiração.",
  "Os espinhos cresceram durante a noite. A arena está menor do que ontem.",
  "O sol nasce sem calor. Alguém não acordou com a mesma lealdade de ontem.",
  "A fome tem voz. Hoje ela fala mais alto que a razão.",
  "Restam poucos dias e menos gente. O sino aprendeu o nome de vocês.",
  "O último amanhecer. Quando a lua subir, ela virá cheia de sangue.",
];
const FRASE_NOITE = [
  "A primeira noite. Um sacrifício precisa cair antes do sol.",
  "Escuro. Os passos lá fora não são dos seus.",
  "A noite chega e cobra. Quem dorme, confia demais.",
  "O silêncio da arena é o som de alguém afiando uma lâmina.",
  "Mais uma noite. A Coroa tem paciência; vocês, não.",
  "A Lua de Sangue se ergue. Só seis podem restar.",
];
export function cartaoDe(evt, st) {
  const dia = Math.max(1, Math.min(6, n(st?.dia) || 1)); const sacs = (st?.sacrificios || []).length;
  const acesas = velas(st).filter((v) => v.acesa).length;
  if (evt === "noite") {
    const lua = dia === 6;
    return { evt, dia, lua, kicker: lua ? "A ÚLTIMA NOITE" : "ANOITECE NA ARENA", titulo: lua ? "LUA DE SANGUE" : "NOITE", sub: `dia ${dia} de 6`,
      frase: FRASE_NOITE[dia - 1], info: lua ? "Só seis podem estar vivos no sacrifício final." : "Agora os sacrifícios podem morrer.", sacs, acesas };
  }
  return { evt: "dia", dia, lua: false, kicker: dia === 1 ? "O HEXATOMBE COMEÇA" : "AMANHECE NA ARENA", titulo: `DIA ${dia}`, sub: dia === 6 ? "o último dia" : "de seis",
    frase: FRASE_DIA[dia - 1], info: `${sacs}/6 sacrifícios · ${acesas} ${acesas === 1 ? "vela acesa" : "velas acesas"}`, sacs, acesas };
}
