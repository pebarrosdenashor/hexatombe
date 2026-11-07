/* Desenho da cidade de Bom Jesus do Açude (SVG 1000 x 700).
   Usado pela extensão e pelo gerador de imagens. Determinístico: sempre o mesmo traçado. */

export const S = [1.08, 1.08, 1.08, .56, .40, .24];   // tamanho da terra seca por dia
export const AGUA = ["#3d6672", "#4e5c66", "#654b55", "#7a3a43", "#842631", "#741520"];
export const MURALHA = ["#1d3239", "#272b33", "#30232b", "#3a1b22", "#3c1218", "#330b10"];
export const ONDA = ["#2f4f58", "#3b4550", "#4a3a44", "#582e36", "#5e2229", "#55161d"];
export const COTA = [382, 389, 396, 403, 410, 417];
export const ILHAS = [{ x: 780, y: 135, r: 80, ate: 6 }, { x: 215, y: 145, r: 72, ate: 5 }];
export const USINA = /* Pedra do Mirante, onde fica o Hotel Bela Vista */ { x: 890, y: 306, w: 52, h: 48 };

export const rElip = (x, y) => Math.hypot((x - 500) / 470, (y - 350) / 320);

// dia em que um ponto afunda (0 = nunca), pela geografia do mapa
export function alagaPorPosicao(x, y) {
  if (x >= USINA.x && x <= USINA.x + USINA.w && y >= USINA.y && y <= USINA.y + USINA.h) return 0;
  for (const i of ILHAS) if (Math.hypot(x - i.x, y - i.y) < i.r - 6) return i.ate;
  for (let d = 2; d <= 6; d++) if (rElip(x, y) > S[d - 1]) return d;
  return 0;
}

const ns = "http://www.w3.org/2000/svg";
export const el = (t, a = {}) => { const e = document.createElementNS(ns, t); for (const k in a) e.setAttribute(k, a[k]); return e; };

const ESTATICO = `
<defs>
  <filter id="lama" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="7"/>
    <feColorMatrix values="0 0 0 0 0.20  0 0 0 0 0.18  0 0 0 0 0.13  0 0 0 0.5 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="recorte" x="-60" y="-60" width="1120" height="820" filterUnits="userSpaceOnUse">
    <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="3" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="22" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <pattern id="ondas" width="24" height="12" patternUnits="userSpaceOnUse">
    <path class="onda-path" d="M0 6 Q6 2 12 6 T24 6" fill="none" stroke="var(--onda)" stroke-width="1.2"/>
  </pattern>
  <clipPath id="arena"><ellipse cx="500" cy="350" rx="470" ry="320"/></clipPath>
  <mask id="seco" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="700">
    <rect width="1000" height="700" fill="white"/>
    <g filter="url(#recorte)">
      <ellipse class="terra" cx="500" cy="350" rx="470" ry="320" fill="black"/>
      <circle class="ilha" data-ate="6" cx="780" cy="135" r="80" fill="black"/>
      <circle class="ilha" data-ate="5" cx="215" cy="145" r="72" fill="black"/>
    </g>
    <rect x="890" y="306" width="52" height="48" fill="black"/>
  </mask>
</defs>
<rect class="muralha-fill" width="1000" height="700" fill="var(--muralha)"/>
<rect width="1000" height="700" fill="url(#ondas)"/>
<ellipse cx="500" cy="350" rx="470" ry="320" fill="var(--ground)"/>
<ellipse cx="500" cy="350" rx="470" ry="320" fill="#000" filter="url(#lama)"/>
<g clip-path="url(#arena)">
  <g fill="none" stroke="var(--line)" stroke-width="1.2" stroke-dasharray="4 4">
    <ellipse cx="780" cy="135" rx="150" ry="95"/><ellipse cx="780" cy="135" rx="105" ry="64"/><ellipse cx="780" cy="135" rx="58" ry="36"/>
    <ellipse cx="215" cy="145" rx="150" ry="100"/><ellipse cx="215" cy="145" rx="100" ry="66"/><ellipse cx="215" cy="145" rx="52" ry="34"/>
  </g>
  <text class="nota" x="872" y="80">cota 431</text>
  <text class="nota" x="70" y="70">cota 428</text>
  <path id="rio" d="M20,470 C150,480 230,490 320,535 C400,575 520,575 590,520 C630,488 660,455 720,440 C800,420 880,410 975,405" fill="none" stroke="#252219" stroke-width="26" stroke-linecap="round"/>
  <path d="M20,470 C150,480 230,490 320,535 C400,575 520,575 590,520 C630,488 660,455 720,440 C800,420 880,410 975,405" fill="none" stroke="#4a4535" stroke-width="1.5" stroke-dasharray="3 6"/>
  <text class="rua" font-size="11"><textPath href="#rio" startOffset="6%">leito do rio Vaza-Rosário</textPath></text>
  <g fill="none" stroke="var(--road)" stroke-linecap="round">
    <path id="r-estadual" d="M20,345 C120,340 200,330 262,330" stroke-width="12"/>
    <path id="r-norte" d="M480,20 C485,90 492,140 500,178" stroke-width="10"/>
    <path id="r-fazenda" d="M690,205 C720,190 745,165 770,150" stroke-width="9"/>
    <path id="r-barragem" d="M760,330 L898,330" stroke-width="14"/>
    <path id="r-cemiterio" d="M700,450 C715,455 725,462 738,468" stroke-width="8"/>
    <path id="r-acude" d="M640,425 C655,470 668,520 700,600 C715,640 730,670 740,690" stroke-width="10"/>
    <path id="r-sul" d="M470,555 C460,600 440,640 420,690" stroke-width="8"/>
    <path id="r-mata" d="M270,395 C245,425 222,455 205,478" stroke-width="5" stroke-dasharray="6 5"/>
  </g>
  <path d="M300,230 L222,156" stroke="#7a705a" stroke-width="6" fill="none"/>
  <g class="estacoes"></g>
  <g class="periferia"></g>
  <g transform="translate(655,466) rotate(68)">
    <rect x="-26" y="-7" width="20" height="14" fill="#7a705a"/>
    <rect x="6" y="-7" width="20" height="14" fill="#7a705a"/>
    <path d="M-6,-8 L-2,-2 L-5,3 L-1,8 M6,-8 L2,-3 L5,2 L1,8" stroke="#14171a" stroke-width="1.5" fill="none"/>
  </g>
  <g class="mata"></g>
  <g transform="translate(380,615) rotate(-7)">
    <rect x="-38" y="-22" width="76" height="44" fill="#3f4a2c" stroke="#7a8a5a" stroke-width="1"/>
    <line x1="0" y1="-22" x2="0" y2="22" stroke="#7a8a5a"/><circle r="7" fill="none" stroke="#7a8a5a"/>
  </g>
  <text class="nota" x="380" y="653" text-anchor="middle">CAMPO DO BOM JESUS</text>
  <g transform="translate(745,470) rotate(-7)">
    <rect x="-36" y="-26" width="72" height="52" fill="#2b2a24" stroke="#8a8270" stroke-width="2"/>
    <g class="cruzes" stroke="#9a917b" stroke-width="1.2"></g>
  </g>
  <g transform="translate(780,135)">
    <rect x="-22" y="-12" width="34" height="20" fill="var(--civic)"/>
    <rect x="20" y="-14" width="38" height="30" fill="none" stroke="#9a8f74" stroke-dasharray="3 3"/>
    <circle cx="-34" cy="14" r="7" fill="none" stroke="#c9bfa5" stroke-width="2"/>
  </g>
  <text class="nota" x="746" y="182">caixa d'água · curral</text>
  <g transform="rotate(-7 214 140)">
    <rect x="193" y="120" width="44" height="38" fill="none" stroke="#9a8f74" stroke-width="2"/>
    <rect x="197" y="124" width="26" height="9" fill="var(--civic)"/>
    <rect x="227" y="124" width="7" height="14" fill="var(--civic)"/>
    <circle cx="203" cy="150" r="3.5" fill="none" stroke="#c9bfa5" stroke-width="1.5"/>
  </g>
  <g>
    <rect x="896" y="312" width="40" height="14" fill="var(--civic)"/>
    <rect x="896" y="326" width="14" height="22" fill="var(--civic)"/>
    <rect x="915" y="331" width="18" height="12" fill="#5b7f8a" stroke="#c9bfa5" stroke-width="1"/>
  </g>
  <g class="grade" transform="translate(500,350) rotate(-7)"></g>
  <rect class="agua" width="1000" height="700" fill="var(--agua)" mask="url(#seco)" opacity=".93"/>
  <g class="costa" fill="none" stroke="#d9cfb4" stroke-width="1.2" opacity="0" filter="url(#recorte)">
    <ellipse class="terra" cx="500" cy="350" rx="470" ry="320"/>
    <circle class="ilha" data-ate="6" cx="780" cy="135" r="80"/>
    <circle class="ilha" data-ate="5" cx="215" cy="145" r="72"/>
  </g>
</g>
<path d="M948,190 Q985,350 948,510" fill="none" stroke="#8f8a7a" stroke-width="10"/>
<text class="nota" x="978" y="350" transform="rotate(90 978 350)" text-anchor="middle">BARRAGEM</text>
<ellipse cx="500" cy="350" rx="470" ry="320" fill="none" stroke="#d9cfb4" stroke-width="1.5" opacity=".35"/>
<text class="nota" x="500" y="16" text-anchor="middle" letter-spacing="3">MURALHA D'ÁGUA</text>
<text class="nota" x="500" y="694" text-anchor="middle" letter-spacing="3">MURALHA D'ÁGUA</text>
<text class="nota" x="30" y="335">ESTRADA ESTADUAL · CORTADA</text>
<g transform="translate(60,640)">
  <path d="M0,-18 L5,0 L0,18 L-5,0 Z" fill="var(--ink-dim)"/>
  <text class="nota" y="-24" text-anchor="middle">N</text>
</g>
<g transform="translate(830,660)">
  <line x1="0" y1="0" x2="100" y2="0" stroke="var(--ink-dim)" stroke-width="2"/>
  <line x1="0" y1="-4" x2="0" y2="4" stroke="var(--ink-dim)"/><line x1="50" y1="-4" x2="50" y2="4" stroke="var(--ink-dim)"/><line x1="100" y1="-4" x2="100" y2="4" stroke="var(--ink-dim)"/>
  <text class="nota" x="50" y="-8" text-anchor="middle">200 m</text>
</g>
<g class="locais"></g>`;

export const CSS_MAPA = `
.mapa-svg{--ground:#2f2b22;--road:#575040;--block:#3a352a;--roof-a:#6b604a;--roof-b:#5d5442;--civic:#8a7d5e;--line:#5a5442;--ink:#e6dcc4;--ink-dim:#a69e89;--agua:#3d6672;--muralha:#1d3239;--onda:#2f4f58}
.mapa-svg .rua{font-family:"Alegreya Sans","Trebuchet MS",sans-serif;font-style:italic;font-size:10.5px;fill:#bfb39a;letter-spacing:.04em}
.mapa-svg .nota{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:10px;fill:var(--ink-dim);letter-spacing:.06em}
.mapa-svg .agua,.mapa-svg .muralha-fill{transition:fill 1.2s}
.mapa-svg .onda-path{transition:stroke 1.2s}
.mapa-svg .terra{transform-box:view-box;transform-origin:500px 350px;transition:transform 1.4s cubic-bezier(.4,0,.2,1)}
.mapa-svg .ilha{transform-box:fill-box;transform-origin:center;transition:transform 1.2s ease}
.mapa-svg .costa{transition:opacity .6s}
.mapa-svg.sem-animacao *{transition:none!important}
@media (prefers-reduced-motion:reduce){.mapa-svg *{transition:none!important}}`;

/* Monta a cidade dentro de um <svg>. `publicos` = posições [x,y] de prédios públicos (fora a igreja). */
export function montarCidade(svg, publicos) {
  svg.setAttribute("viewBox", "0 0 1000 700");
  svg.classList.add("mapa-svg");
  svg.innerHTML = ESTATICO;
  const q = (s) => svg.querySelector(s);

  let seed = 11;
  const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  const A = -7 * Math.PI / 180;
  const toWorld = (lx, ly) => [500 + lx * Math.cos(A) - ly * Math.sin(A), 350 + lx * Math.sin(A) + ly * Math.cos(A)];
  const rio = q("#rio"); const rioLen = rio.getTotalLength();
  const rioPts = []; for (let s = 0; s <= rioLen; s += 8) { const p = rio.getPointAtLength(s); rioPts.push([p.x, p.y]); }
  const dRio = (x, y) => Math.min(...rioPts.map((p) => Math.hypot(p[0] - x, p[1] - y)));

  /* ---- malha urbana irregular ---- */
  const grade = q(".grade");
  const ST = 14, COLS = 7, ROWS = 6;
  const colW = [], rowH = [];
  for (let i = 0; i < COLS; i++) colW.push(58 + rnd() * 26);
  for (let j = 0; j < ROWS; j++) rowH.push(44 + rnd() * 20);
  const xs = [0], ys = [0];
  colW.forEach((w) => xs.push(xs[xs.length - 1] + w + ST));
  rowH.forEach((h) => ys.push(ys[ys.length - 1] + h + ST));
  const ox = (xs[3] + xs[4]) / 2, oy = (ys[2] + ys[3]) / 2;
  const N = [];
  for (let i = 0; i <= COLS; i++) { N[i] = []; for (let j = 0; j <= ROWS; j++) {
    const x = xs[i] - ox, y = ys[j] - oy;
    const bx = x + 9 * Math.sin(y / 95 + 1.3), by = y + 13 * Math.sin(x / 130);
    const jit = (i === 3 || i === 4) && (j === 2 || j === 3) ? 3 : 9;
    N[i][j] = [bx + (rnd() - .5) * 2 * jit, by + (rnd() - .5) * 2 * jit];
  } }
  const ruas = el("g", { stroke: "var(--road)", "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none" });
  const quart = el("g"), casas = el("g"), nomes = el("g");
  grade.append(quart, casas, ruas, nomes);
  const centro = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  const poly = (pts) => pts.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const shrink = (pts, f) => { const c = centro(pts); return pts.map((p) => [c[0] + (p[0] - c[0]) * f, c[1] + (p[1] - c[1]) * f]); };

  const blocos = [];
  for (let i = 0; i < COLS; i++) for (let j = 0; j < ROWS; j++) {
    const pts = [N[i][j], N[i + 1][j], N[i + 1][j + 1], N[i][j + 1]];
    const [lx, ly] = centro(pts), [wx, wy] = toWorld(lx, ly);
    if (rElip(wx, wy) > .78 || dRio(wx, wy) < 44) continue;
    const praca = i === 3 && j === 2;
    const pub = publicos.some((p) => Math.hypot(p[0] - wx, p[1] - wy) < 46);
    blocos.push({ i, j, pts, praca, pub });
  }
  const temBloco = (i, j) => blocos.some((b) => b.i === i && b.j === j);
  const seg = (a, b, w) => ruas.appendChild(el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], "stroke-width": w }));
  for (let i = 0; i <= COLS; i++) for (let j = 0; j <= ROWS; j++) {
    if (i < COLS && (temBloco(i, j) || temBloco(i, j - 1))) seg(N[i][j], N[i + 1][j], j === 2 ? 22 : ST);
    if (j < ROWS && (temBloco(i, j) || temBloco(i - 1, j))) seg(N[i][j], N[i][j + 1], ST);
  }
  let igreja = [500, 346];
  blocos.forEach((b) => {
    if (b.praca) {
      quart.appendChild(el("polygon", { points: poly(b.pts), fill: "#3d4630" }));
      const p = b.pts;
      quart.appendChild(el("path", { d: `M${p[0]} L${p[2]} M${p[1]} L${p[3]}`, stroke: "#6a7350", "stroke-width": 1.5 }));
      shrink(b.pts, .82).forEach((c, k, arr) => { const n = arr[(k + 1) % 4]; for (let t = 0; t < 1; t += .25) quart.appendChild(el("circle", { cx: c[0] + (n[0] - c[0]) * t, cy: c[1] + (n[1] - c[1]) * t, r: 3, fill: "#55603f" })); });
      const [cx, cy] = centro(b.pts);
      quart.appendChild(el("path", { d: `M${cx - 7},${cy - 17} h14 v8 h9 v9 h-9 v17 h-14 v-17 h-9 v-9 h9 Z`, fill: "#b9ab86", stroke: "#14171a", "stroke-width": 1 }));
      quart.appendChild(el("rect", { x: cx - 5, y: cy + 14, width: 10, height: 8, fill: "#d6c9a5", stroke: "#14171a", "stroke-width": 1 }));
      igreja = toWorld(cx, cy);
      return;
    }
    quart.appendChild(el("polygon", { points: poly(b.pts), fill: "var(--block)" }));
    if (b.pub) {
      casas.appendChild(el("polygon", { points: poly(shrink(b.pts, .66)), fill: "var(--civic)", stroke: "#14171a", "stroke-width": 1 }));
      casas.appendChild(el("polygon", { points: poly(shrink(b.pts, .25)), fill: "var(--block)" }));
      return;
    }
    const c = centro(b.pts);
    for (let k = 0; k < 4; k++) {
      const P = b.pts[k], Q = b.pts[(k + 1) % 4];
      const dx = Q[0] - P[0], dy = Q[1] - P[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
      let nx = -uy, ny = ux;
      if ((c[0] - P[0]) * nx + (c[1] - P[1]) * ny < 0) { nx = -nx; ny = -ny; }
      const flip = nx * (-uy) + ny * ux < 0;
      const ang = Math.atan2(uy, ux) * 180 / Math.PI;
      const m = 10, inset = ST / 2 + .5;
      let t = m;
      while (t < len - m) {
        const w = Math.min(6 + rnd() * 8, len - m - t), d = 9 + rnd() * 6;
        if (rnd() > .12 && w > 3) {
          const x = P[0] + ux * t + nx * inset, y = P[1] + uy * t + ny * inset;
          casas.appendChild(el("rect", { x: 0, y: flip ? -d : 0, width: (w - 1).toFixed(1), height: d.toFixed(1),
            fill: rnd() < .5 ? "var(--roof-a)" : "var(--roof-b)", transform: `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${ang.toFixed(1)})` }));
        }
        t += w;
      }
    }
  });
  let pid = 0;
  const rotulo = (a, b, nome) => {
    let [p, qq] = a[0] <= b[0] ? [a, b] : [b, a];
    if (Math.abs(a[0] - b[0]) < Math.abs(a[1] - b[1])) [p, qq] = a[1] >= b[1] ? [a, b] : [b, a];
    const id = "rua-" + (pid++);
    nomes.appendChild(el("path", { id, d: `M${p[0]},${p[1]} L${qq[0]},${qq[1]}`, fill: "none" }));
    const t = el("text", { class: "rua", dy: "3.5" }); const tp = el("textPath", { href: "#" + id, startOffset: "50%", "text-anchor": "middle" });
    tp.textContent = nome; t.appendChild(tp); nomes.appendChild(t);
  };
  [[1, "Rua do Rosário"], [2, "Av. Coronel Tibúrcio"], [3, "Rua da Matriz"], [4, "Rua Sete de Setembro"], [5, "Rua do Comércio"]].forEach(([j, n]) => {
    const i = [2, 4, 1, 5, 3].find((i) => temBloco(i, j) || temBloco(i, j - 1)); if (i !== undefined) rotulo(N[i][j], N[i + 1][j], n);
  });
  [[1, "Rua das Almas"], [2, "Rua São Benedito"], [4, "Travessa do Sino"], [5, "Rua Santa Luzia"], [6, "Rua do Mirante"]].forEach(([i, n]) => {
    const j = [3, 1, 4, 0, 2].find((j) => temBloco(i, j) || temBloco(i - 1, j)); if (j !== undefined) rotulo(N[i][j], N[i][j + 1], n);
  });

  /* ---- detalhes ---- */
  const est = q(".estacoes");
  for (let i = 0; i < 14; i++) { const t = i / 13; est.appendChild(el("circle", { cx: 300 + (222 - 300) * t, cy: 230 + (156 - 230) * t, r: 2.6, fill: "#d8ccad" })); }
  const per = q(".periferia");
  ["r-estadual", "r-norte", "r-fazenda", "r-barragem", "r-acude", "r-sul"].forEach((id) => {
    const p = q("#" + id), len = p.getTotalLength();
    for (let s = 10; s < len - 10; s += 13) {
      if (rnd() < .45) continue;
      const a = p.getPointAtLength(s), b = p.getPointAtLength(s + 1);
      const ang = Math.atan2(b.y - a.y, b.x - a.x), side = rnd() < .5 ? 1 : -1, off = 11 + rnd() * 4;
      const x = a.x - Math.sin(ang) * off * side, y = a.y + Math.cos(ang) * off * side;
      if (rElip(x, y) > .97 || dRio(x, y) < 20) continue;
      per.appendChild(el("rect", { x: -4, y: -3.5, width: 8, height: 7, fill: rnd() < .5 ? "var(--roof-a)" : "var(--roof-b)", transform: `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(ang * 180 / Math.PI).toFixed(0)})` }));
    }
  });
  const mata = q(".mata");
  for (let k = 0; k < 70; k++) {
    const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd());
    const x = 195 + Math.cos(a) * r * 105, y = 482 + Math.sin(a) * r * 72;
    if (dRio(x, y) < 18) continue;
    const g = el("g", { transform: `translate(${x.toFixed(1)},${y.toFixed(1)})`, stroke: "#7d775f", "stroke-width": 1.2, fill: "none" });
    g.appendChild(el("path", { d: "M0,4 L0,-4 M0,-1 L-3,-4 M0,0 L3,-3" }));
    mata.appendChild(g);
  }
  const cz = q(".cruzes");
  for (let i = 0; i < 7; i++) for (let j = 0; j < 5; j++) { if (rnd() < .2) continue; const x = -29 + i * 9.6, y = -19 + j * 9.5; cz.appendChild(el("path", { d: `M${x},${y - 3} V${y + 3} M${x - 2},${y - 1} H${x + 2}` })); }

  function setDia(dia) {
    const i = Math.min(6, Math.max(1, dia)) - 1;
    svg.style.setProperty("--agua", AGUA[i]);
    svg.style.setProperty("--muralha", MURALHA[i]);
    svg.style.setProperty("--onda", ONDA[i]);
    svg.querySelectorAll(".terra").forEach((e) => e.style.transform = `scale(${S[i]})`);
    svg.querySelectorAll(".ilha").forEach((e) => e.style.transform = `scale(${dia >= +e.dataset.ate ? 0 : 1})`);
    q(".costa").style.opacity = dia < 4 ? 0 : .55;
  }
  return { setDia, igreja, camada: q(".locais") };
}
