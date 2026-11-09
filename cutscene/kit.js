/* Peças de desenho compartilhadas pelas cenas: pessoas em silhueta, máscaras e luz.
   Coordenadas locais de uma pessoa: pés em y=0, topo da cabeça em y≈-196, altura 200. */

export function rnd(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }

const CORPOS = {
  pe: `<path d="M-14,-92 L-17,0 L-6,0 L-2,-58 L2,-58 L6,0 L17,0 L14,-92 Z"/>
       <path d="M-26,-156 Q-31,-120 -19,-90 L19,-90 Q31,-120 26,-156 Q0,-166 -26,-156 Z"/>
       <path d="M-26,-154 Q-37,-120 -33,-84 L-25,-84 Q-27,-118 -18,-146 Z"/><path d="M26,-154 Q37,-120 33,-84 L25,-84 Q27,-118 18,-146 Z"/>
       <rect x="-6" y="-168" width="12" height="14"/>`,
  manto: `<path d="M-25,-156 Q-38,-80 -36,0 L36,0 Q38,-80 25,-156 Q0,-167 -25,-156 Z"/>
       <path d="M-25,-154 Q-36,-124 -30,-96 L-22,-96 Q-24,-122 -17,-146 Z"/><path d="M25,-154 Q36,-124 30,-96 L22,-96 Q24,-122 17,-146 Z"/>
       <rect x="-6" y="-168" width="12" height="14"/>`,
  agachado: `<path d="M-30,-104 Q-38,-62 -32,-24 L-44,0 L-8,0 L0,-20 L8,0 L44,0 L32,-24 Q38,-62 30,-104 Q0,-116 -30,-104 Z"/>
       <path d="M-30,-100 Q-40,-70 -26,-40 L-18,-42 Q-28,-70 -22,-94 Z"/><path d="M30,-100 Q40,-70 26,-40 L18,-42 Q28,-70 22,-94 Z"/>
       <rect x="-6" y="-116" width="12" height="14"/>`,
  sentado: `<path d="M-26,-156 Q-31,-120 -21,-80 L21,-80 Q31,-120 26,-156 Q0,-166 -26,-156 Z"/>
       <path d="M-26,-154 Q-40,-124 -30,-96 L-10,-88 L-12,-80 L-34,-88 Q-44,-122 -18,-146 Z"/>
       <path d="M26,-154 Q40,-124 30,-96 L10,-88 L12,-80 L34,-88 Q44,-122 18,-146 Z"/>
       <rect x="-6" y="-168" width="12" height="14"/>`
};
const ALT_CABECA = { pe: -180, manto: -180, sentado: -180, agachado: -128 };

/* pessoa({ x, y, h, cor, pose, cabeca, frente, atras, id, classe, giro })
   cabeca: desenho da cabeça (centro em 0,0); sem ele, um círculo.
   frente/atras: desenhos extras em coordenadas locais (objetos na mão etc.). */
export function pessoa(o) {
  const { x = 0, y = 0, h = 200, cor = "#0c0b0c", pose = "pe", cabeca, frente = "", atras = "", id = "", classe = "", giro = 0, espelho = false } = o;
  const s = h / 200, hy = ALT_CABECA[pose];
  return `<g ${id ? `id="${id}"` : ""} class="pessoa ${classe}" transform="translate(${x},${y}) scale(${espelho ? -s : s},${s})">
    ${atras}<g fill="${cor}">${CORPOS[pose]}</g>
    <g class="cab" transform="translate(0,${hy}) rotate(${giro})">${cabeca ?? `<circle r="15" fill="${cor}"/>`}</g>
    ${frente}</g>`;
}

/* olhos que brilham no escuro: começam apagados (classe .olho-b) */
export const olhos = (dx = 5.5, y = -1, cor = "#efe6c8", r = 2.1) =>
  `<g class="olho-b" style="opacity:0;transition:opacity 1.6s"><circle cx="${-dx}" cy="${y}" r="${r}" fill="${cor}"/><circle cx="${dx}" cy="${y}" r="${r}" fill="${cor}"/></g>`;

/* ---------- máscaras de Os da Floresta ---------- */
export const MASCARA = {
  cervo: `<g stroke="#bfb196" stroke-width="3.2" fill="none" stroke-linecap="round">
      <path d="M-8,-12 Q-14,-34 -30,-46 M-14,-30 Q-28,-30 -36,-24 M-22,-40 Q-22,-54 -18,-62 M-30,-46 Q-42,-50 -46,-60"/>
      <path d="M8,-12 Q14,-34 30,-46 M14,-30 Q28,-30 36,-24 M22,-40 Q22,-54 18,-62 M30,-46 Q42,-50 46,-60"/></g>
    <path d="M-14,-10 Q-20,-14 -26,-8 Q-20,-2 -12,-4 Z M14,-10 Q20,-14 26,-8 Q20,-2 12,-4 Z" fill="#a89a80"/>
    <path d="M-13,-12 Q0,-20 13,-12 Q14,4 7,18 Q4,30 0,32 Q-4,30 -7,18 Q-14,4 -13,-12 Z" fill="#cbbfa6"/>
    <path d="M-3,26 Q0,31 3,26" stroke="#3a3328" stroke-width="2" fill="none"/>
    <ellipse cx="-6" cy="-2" rx="3.6" ry="2.2" fill="#14110d"/><ellipse cx="6" cy="-2" rx="3.6" ry="2.2" fill="#14110d"/>`,
  leopardo: `<path d="M-15,-14 L-11,-24 L-5,-15 Z M15,-14 L11,-24 L5,-15 Z" fill="#a0844c"/>
    <path d="M-16,-12 Q0,-20 16,-12 Q19,4 11,13 Q0,20 -11,13 Q-19,4 -16,-12 Z" fill="#b89a5c"/>
    <g fill="#2a2015"><circle cx="-10" cy="-10" r="1.6"/><circle cx="-4" cy="-14" r="1.4"/><circle cx="5" cy="-13" r="1.6"/><circle cx="11" cy="-8" r="1.5"/><circle cx="-13" cy="3" r="1.4"/><circle cx="13" cy="4" r="1.6"/><circle cx="-7" cy="9" r="1.2"/><circle cx="8" cy="10" r="1.3"/></g>
    <path d="M-10,-3 L-3,-1 L-9,1 Z M10,-3 L3,-1 L9,1 Z" fill="#15110b"/>
    <path d="M-3,5 L3,5 L0,9 Z" fill="#3a2a1a"/><path d="M0,9 L0,12 M0,12 Q-4,14 -6,12 M0,12 Q4,14 6,12" stroke="#3a2a1a" stroke-width="1.2" fill="none"/>`,
  urso: `<circle cx="-15" cy="-15" r="7" fill="#4a3a2c"/><circle cx="15" cy="-15" r="7" fill="#4a3a2c"/>
    <path d="M-19,-8 Q-19,-24 0,-24 Q19,-24 19,-8 Q20,14 0,18 Q-20,14 -19,-8 Z" fill="#5a4634"/>
    <ellipse cx="0" cy="8" rx="9" ry="7" fill="#8a7158"/><ellipse cx="0" cy="4" rx="3.6" ry="2.5" fill="#1a130d"/>
    <circle cx="-8" cy="-6" r="2.4" fill="#120d09"/><circle cx="8" cy="-6" r="2.4" fill="#120d09"/>`,
  morcego: `<path d="M-12,-8 L-24,-34 L-8,-16 Z M12,-8 L24,-34 L8,-16 Z" fill="#5a5054"/>
    <path d="M-20,-30 L-11,-12 M20,-30 L11,-12" stroke="#5b5154" stroke-width="1.5"/>
    <path d="M-14,-12 Q0,-20 14,-12 Q16,6 6,14 L0,18 L-6,14 Q-16,6 -14,-12 Z" fill="#6a6064"/>
    <path d="M-3,6 L0,3 L3,6" stroke="#191516" stroke-width="2" fill="none"/>
    <g stroke="#d8ccb0" stroke-width="1.4"><path d="M-11,-5 L-4,-1 M-11,-1 L-4,-5 M-9.5,-6 L-9.5,0 M-6,-6 L-6,0"/><path d="M11,-5 L4,-1 M11,-1 L4,-5 M9.5,-6 L9.5,0 M6,-6 L6,0"/></g>`,
  cachorro: `<path d="M-14,-12 Q-26,-6 -22,14 Q-16,10 -12,0 Z M14,-12 Q26,-6 22,14 Q16,10 12,0 Z" fill="#3b3026"/>
    <path d="M-13,-12 Q0,-20 13,-12 Q15,2 8,8 L6,22 Q0,26 -6,22 L-8,8 Q-15,2 -13,-12 Z" fill="#7a6650"/>
    <ellipse cx="0" cy="20" rx="5" ry="3.2" fill="#15100c"/>
    <circle cx="-6" cy="-4" r="2.2" fill="#15100c"/><circle cx="6" cy="-4" r="2.2" fill="#15100c"/>`
};

/* chapéu de couro sertanejo e outros acessórios de cabeça */
export const chapeu = (cor = "#5a3d22") => `<ellipse cx="0" cy="-11" rx="27" ry="6" fill="${cor}"/><path d="M-14,-12 Q-14,-28 0,-28 Q14,-28 14,-12 Z" fill="${cor}"/><path d="M-14,-14 L14,-14" stroke="#2a1c10" stroke-width="2"/>`;
export const veu = (cor = "#d8d1c2") => `<path d="M-17,-8 Q-18,-22 0,-22 Q18,-22 17,-8 L20,22 Q0,16 -20,22 Z" fill="${cor}"/>`;
export const turbante = (cor = "#2d2620", ouro = "#c89b3c") => `<path d="M-18,-6 Q-20,-26 0,-28 Q20,-26 18,-6 Q0,-12 -18,-6 Z" fill="${cor}"/><path d="M-16,4 Q-18,22 -10,30 L10,30 Q18,22 16,4 Q0,10 -16,4 Z" fill="${cor}"/><path d="M-17,-8 Q0,-14 17,-8" stroke="${ouro}" stroke-width="2" fill="none"/>`;

/* vela acesa (apagada se começar com opacity 0); chama tremula com animação SMIL */
export function vela(x, y, s = 1, id = "", acesa = true) {
  return `<g ${id ? `id="${id}"` : ""} class="vela" transform="translate(${x},${y}) scale(${s})" style="opacity:${acesa ? 1 : 0};transition:opacity 1.2s">
    <circle cx="0" cy="-14" r="34" fill="url(#halo)"/>
    <rect x="-2.6" y="-10" width="5.2" height="12" fill="#e8dfc8"/>
    <path d="M0,-21 Q4,-15 0,-10 Q-4,-15 0,-21 Z" fill="#ffd27a"><animateTransform attributeName="transform" type="scale" values="1 1;0.85 1.12;1.05 0.95;1 1" dur="${(0.6 + Math.random() * 0.5).toFixed(2)}s" repeatCount="indefinite" additive="sum"/></path></g>`;
}
export const defsHalo = `<radialGradient id="halo"><stop offset="0" stop-color="#ffc66b" stop-opacity=".55"/><stop offset=".35" stop-color="#ff9d3b" stop-opacity=".18"/><stop offset="1" stop-color="#ff8a2b" stop-opacity="0"/></radialGradient>`;

/* liga ou desliga uma lista de elementos pelo seletor */
export function mostra(svg, sel, v = 1) { svg.querySelectorAll(sel).forEach((e) => (e.style.opacity = String(v))); }

/* gira a cabeça de uma pessoa (graus) com transição */
export function giraCabeca(el, graus, ms = 900, inclina = 0) {
  const c = el.querySelector(".cab"); if (!c) return;
  const base = c.getAttribute("data-base") || c.getAttribute("transform").replace(/ rotate\([^)]*\)/, "");
  c.setAttribute("data-base", base);
  const ini = +(c.getAttribute("data-g") || 0), t0 = performance.now();
  const passo = (now) => {
    const t = Math.min(1, (now - t0) / ms), e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, g = ini + (graus - ini) * e;
    c.setAttribute("transform", `${base} rotate(${g.toFixed(2)})${inclina ? ` translate(0,${(inclina * e).toFixed(2)})` : ""}`);
    c.setAttribute("data-g", g);
    if (t < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}
