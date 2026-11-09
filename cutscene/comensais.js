/* Primeiro encontro: Os Comensais, no Matadouro Municipal.
   Noite. O curral é uma armadilha de cordas e sinos de vaca. Lá dentro, ganchos, a câmara fria
   soltando vapor sem energia nenhuma e uma mesa comprida onde alguém para de mastigar. */
import { pessoa, olhos, rnd } from "./kit.js?v=1.3.0";

const CHAO = 1520, IX = 6000; // IX: onde fica o interior do galpão no mundo

/* sino de vaca pendurado numa corda */
const sinoV = (x, y, i) => `<g class="sino-v" style="transform-origin:${x}px ${y}px;animation-delay:${(i * 0.13).toFixed(2)}s">
  <line x1="${x}" y1="${y}" x2="${x}" y2="${y + 14}" stroke="#4a3e30" stroke-width="2"/>
  <path d="M${x - 9},${y + 40} L${x - 6},${y + 14} L${x + 6},${y + 14} L${x + 9},${y + 40} Z" fill="#6a5a3a"/><path d="M${x - 9},${y + 40} L${x + 9},${y + 40}" stroke="#8a7a52" stroke-width="2"/></g>`;

function exterior() {
  const r = rnd(1974);
  let s = `
  <!-- o galpão -->
  <rect x="1200" y="760" width="2200" height="${CHAO - 760}" fill="url(#reboco)"/>
  <polygon points="1160,770 2300,600 3440,770" fill="#1e1b1a"/><path d="M1160,770 L3440,770" stroke="#121010" stroke-width="10"/>
  <rect x="2860" y="560" width="70" height="130" fill="#2a2522"/>
  <text x="2300" y="880" text-anchor="middle" font-family="Georgia,serif" font-size="74" letter-spacing="10" fill="#2e2a26" opacity=".75">MATADOURO MUNICIPAL</text>
  <g fill="#3a1e18" opacity=".35"><path d="M1400,${CHAO} Q1420,1300 1460,1200 L1500,${CHAO} Z"/><path d="M3000,${CHAO} Q3040,1340 3080,1260 L3110,${CHAO} Z"/></g>
  ${[1420, 1700, 2900, 3180].map((x) => `<rect x="${x}" y="1000" width="120" height="90" fill="#141212"/><g stroke="#2a2522" stroke-width="5">${[1, 2, 3].map((k) => `<line x1="${x + k * 30}" y1="1000" x2="${x + k * 30}" y2="1090"/>`).join("")}</g>`).join("")}
  <!-- porta entreaberta com luz -->
  <rect x="2200" y="1080" width="200" height="${CHAO - 1080}" fill="#0c0a08"/>
  <polygon id="fresta" points="2300,1080 2346,1080 2346,${CHAO} 2300,${CHAO}" fill="#d9a03e" opacity=".7"/>
  <polygon points="2300,${CHAO} 2346,${CHAO} 2520,${CHAO + 260} 2300,${CHAO + 260}" fill="url(#luzChao)" opacity=".5"/>
  <path d="M2200,1080 L2300,1080 L2300,${CHAO} L2200,${CHAO} Z" fill="#3a332c"/>
  <!-- urubus no telhado -->
  <g fill="#0a0909">
    <g transform="translate(1900,664)"><path d="M-22,8 Q-18,-14 4,-16 Q20,-14 22,6 L10,10 L-4,4 Z"/><circle cx="14" cy="-22" r="6"/><path d="M14,-28 L14,-40" stroke="#0a0909" stroke-width="4"/></g>
    <g transform="translate(2620,646)"><path d="M-22,8 Q-18,-14 4,-16 Q20,-14 22,6 L10,10 L-4,4 Z"/><circle cx="-12" cy="-20" r="6"/><path d="M-12,-26 L-14,-34" stroke="#0a0909" stroke-width="4"/></g>
  </g>
  <g id="olhos-urubu"><g transform="translate(1914,-14) translate(0,664)">${olhos(2.5, -8, "#d8c48a", 1.4)}</g><g transform="translate(2608,646)">${olhos(2.5, -20, "#d8c48a", 1.4)}</g></g>
  <!-- chão -->
  <rect x="-800" y="${CHAO}" width="5600" height="900" fill="url(#lama)"/>
  ${[...Array(30)].map(() => `<ellipse cx="${(r() * 4400 - 200).toFixed(0)}" cy="${(CHAO + 40 + r() * 600).toFixed(0)}" rx="${(10 + r() * 30).toFixed(0)}" ry="${(3 + r() * 6).toFixed(0)}" fill="#3a3028" opacity=".6"/>`).join("")}
  <g fill="#cfc6b0" opacity=".55"><path d="M1820,1700 l40,-6 l3,6 l-40,6z"/><circle cx="1818" cy="1700" r="5"/><circle cx="1862" cy="1694" r="5"/><path d="M3220,1820 l50,4 l-1,7 l-50,-4z"/></g>`;
  // curral: mourões e cordas com sinos
  const mouroes = [300, 760, 1220, 1680, 2140, 2600, 3060, 3520, 3980];
  s += mouroes.map((x, i) => `<rect x="${x - 12}" y="${1770 + (i % 2) * 30}" width="24" height="230" fill="#2a2018"/>`).join("");
  let sinos = "", k = 0;
  for (let i = 0; i < mouroes.length - 1; i++) {
    const x1 = mouroes[i], x2 = mouroes[i + 1], y1 = 1800 + (i % 2) * 30, y2 = 1800 + ((i + 1) % 2) * 30;
    s += `<path d="M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + 40} ${x2},${y2}" stroke="#7a6a50" stroke-width="3.5" fill="none"/>`;
    s += `<path d="M${x1},${y1 + 60} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + 100} ${x2},${y2 + 60}" stroke="#6a5a44" stroke-width="3" fill="none"/>`;
    sinos += sinoV((x1 + x2) / 2, (y1 + y2) / 2 + 20 + 18, k++);
    if (i % 2) sinos += sinoV((x1 * 3 + x2) / 4, (y1 * 3 + y2) / 4 + 38 + 22, k++);
  }
  return s + `<g id="sinos">${sinos}</g>`;
}

function carcaca(x, y, i) {
  const h = 260 + (i % 3) * 40;
  return `<g transform="translate(${x},${y})"><g>
    <animateTransform attributeName="transform" type="rotate" values="${-3 + i % 2 * 5} 0 0;${3 - i % 2 * 5} 0 0;${-3 + i % 2 * 5} 0 0" dur="${(5 + i * 0.7).toFixed(1)}s" repeatCount="indefinite"/>
    <path d="M0,0 L0,40 M-8,40 Q0,52 8,40" stroke="#8a8a84" stroke-width="5" fill="none"/>
    <path d="M-30,56 Q-50,${h * 0.5} -26,${h} Q0,${h + 26} 26,${h} Q50,${h * 0.5} 30,56 Q0,40 -30,56 Z" fill="#4a1c18"/>
    <path d="M-18,80 Q-30,${h * 0.5} -14,${h - 20} M8,74 Q20,${h * 0.5} 10,${h - 30}" stroke="#c9b49a" stroke-width="5" fill="none" opacity=".35"/>
    <path d="M-30,56 Q0,40 30,56" stroke="#6a2a22" stroke-width="6" fill="none"/></g></g>`;
}

function interior() {
  const r = rnd(77);
  const azulejos = [...Array(40)].map((_, i) => `<line x1="${IX - 1000 + i * 100}" y1="200" x2="${IX - 1000 + i * 100}" y2="${CHAO - 300}" stroke="#1c1a16" stroke-width="3"/>`).join("") +
    [...Array(10)].map((_, i) => `<line x1="${IX - 1000}" y1="${260 + i * 100}" x2="${IX + 3000}" y2="${260 + i * 100}" stroke="#1c1a16" stroke-width="3"/>`).join("");
  const manchas = [...Array(18)].map(() => `<path d="M${(IX - 900 + r() * 3800).toFixed(0)},${(400 + r() * 700).toFixed(0)} q${(r() * 10 - 5).toFixed(0)},${(40 + r() * 120).toFixed(0)} ${(r() * 6 - 3).toFixed(0)},${(80 + r() * 160).toFixed(0)}" stroke="#5a2a20" stroke-width="${(4 + r() * 8).toFixed(0)}" opacity=".35" fill="none"/>`).join("");
  const comensal = (x, i) => pessoa({ id: `c-${i}`, x, y: 1404, h: 250, pose: "sentado", cor: ["#3e352e", "#44382e", "#3a332e", "#423830", "#3e3630"][i],
    cabeca: `<circle r="15" fill="${["#9a8270", "#8a6e5a", "#a08a78", "#7a6250", "#94806e"][i]}"/><path d="M-8,6 Q0,11 8,6 L9,13 Q0,17 -9,13 Z" fill="#4a0c0a"/><path d="M-4,10 L-5,17 M4,11 L5,16" stroke="#4a0c0a" stroke-width="2"/>` + olhos(5, -2, "#f0e0c0", 1.8),
    frente: `<path d="M-15,-150 L15,-150 L17,-80 L-17,-80 Z" fill="#7a7262" opacity=".85"/><path d="M-8,-136 q5,20 -2,44 M6,-140 q-5,24 3,48" stroke="#7a1e18" stroke-width="5" opacity=".7" fill="none"/>`, giro: (i - 2) * 4 });
  return `
  <rect x="${IX - 1100}" y="-200" width="4300" height="${CHAO + 900}" fill="#0a0908"/>
  <rect x="${IX - 1000}" y="200" width="4000" height="${CHAO - 500}" fill="url(#azulejo)"/>${azulejos}${manchas}
  <rect x="${IX - 1000}" y="${CHAO - 300}" width="4000" height="300" fill="#2a2520"/>
  <rect x="${IX - 1000}" y="${CHAO}" width="4000" height="900" fill="url(#pisoMolhado)"/>
  <ellipse cx="${IX + 1000}" cy="${CHAO + 220}" rx="70" ry="14" fill="#141210"/>
  <!-- câmara fria -->
  <rect x="${IX - 820}" y="520" width="440" height="${CHAO - 520}" fill="#5a5e60"/><rect x="${IX - 800}" y="540" width="400" height="${CHAO - 540}" fill="url(#aco)"/>
  <rect x="${IX - 450}" y="900" width="26" height="140" rx="6" fill="#2a2c2e"/><path d="M${IX - 800},560 L${IX - 400},560" stroke="#e8eef0" stroke-width="8" opacity=".5"/>
  <g id="vapor" opacity=".7">${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="${IX - 560 + i * 60}" cy="${CHAO - 30}" rx="${120 + i * 30}" ry="40" fill="#dfe6ea" opacity=".14"><animate attributeName="cy" values="${CHAO - 20};${CHAO - 180 - i * 30};${CHAO - 20}" dur="${(7 + i * 1.3).toFixed(1)}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".18;0;.18" dur="${(7 + i * 1.3).toFixed(1)}s" repeatCount="indefinite"/></ellipse>`).join("")}</g>
  <!-- sacos de sal -->
  <g fill="#c8bea6">${[0, 1, 2].map((i) => `<path d="M${IX + 2300 + i * 90},${CHAO} Q${IX + 2290 + i * 90},${CHAO - 120} ${IX + 2340 + i * 90},${CHAO - 130} Q${IX + 2390 + i * 90},${CHAO - 120} ${IX + 2380 + i * 90},${CHAO} Z"/>`).join("")}</g>
  <text x="${IX + 2430}" y="${CHAO - 50}" font-family="Georgia,serif" font-size="22" fill="#6a6250" text-anchor="middle">SAL GROSSO</text>
  <!-- trilho e ganchos -->
  <rect x="${IX - 300}" y="280" width="2600" height="16" fill="#3a3a38"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => carcaca(IX - 160 + i * 300 + (i > 2 ? 900 : 0), 296, i)).join("")}
  <!-- a mesa -->
  ${[0, 1, 2, 3, 4].map((i) => (i === 4 ? "" : comensal(IX + 640 + i * 190, i))).join("")}
  <g id="c-4-sentado">${comensal(IX + 1400, 4)}</g>
  <g id="anfitriao" style="opacity:0;transition:opacity .5s">${pessoa({ x: IX + 1430, y: 1520, h: 340, cor: "#2a2522",
    cabeca: `<circle r="15" fill="#94806e"/><path d="M-9,5 Q0,13 9,5" stroke="#5a100c" stroke-width="2.4" fill="none"/><path d="M-10,8 Q0,16 10,8" stroke="#6a120e" stroke-width="2" fill="none" opacity=".7"/>` + olhos(5, -2, "#f0e0c0", 1.8),
    frente: `<path d="M-24,-150 L24,-150 L22,-40 L-22,-40 Z" fill="#8a8270" opacity=".9"/><path d="M-12,-130 q6,30 -2,70 M10,-140 q-8,40 4,80" stroke="#7a1e18" stroke-width="6" opacity=".75" fill="none"/>` })}</g>
  <rect x="${IX + 520}" y="1300" width="1060" height="26" fill="#3a2c22"/><rect x="${IX + 540}" y="1326" width="20" height="194" fill="#2a2018"/><rect x="${IX + 1540}" y="1326" width="20" height="194" fill="#2a2018"/>
  <g fill="#cfc6b0">${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="${IX + 640 + i * 190}" cy="1298" rx="44" ry="8"/><ellipse cx="${IX + 640 + i * 190}" cy="1296" rx="28" ry="5" fill="#5a1610"/>`).join("")}</g>
  <!-- lampião -->
  <g id="lampiao"><animateTransform id="lamp-a" attributeName="transform" type="rotate" values="-4 ${IX + 1000} 0;4 ${IX + 1000} 0;-4 ${IX + 1000} 0" dur="4.2s" repeatCount="indefinite"/>
    <line x1="${IX + 1000}" y1="0" x2="${IX + 1000}" y2="560" stroke="#2a2826" stroke-width="3"/>
    <g id="lamp-luz"><circle cx="${IX + 1000}" cy="600" r="900" fill="url(#lamp)"/></g>
    <path d="M${IX + 980},560 L${IX + 1020},560 L${IX + 1030},640 L${IX + 970},640 Z" fill="#3a3226"/><ellipse id="lamp-chama" cx="${IX + 1000}" cy="604" rx="9" ry="16" fill="#ffd27a"/></g>
  <rect id="breu" x="${IX - 1100}" y="-200" width="4300" height="${CHAO + 900}" fill="#000" style="opacity:0;transition:opacity 1.6s"/>`;
}

export const camInicial = { x: 2300, y: 1150, w: 2600, rot: 0, blur: 12, luz: 0.4, balanco: 1 };

export function mundo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block">
<style>.sino-v.balanca{animation:balanca .45s ease-in-out 7 alternate}@keyframes balanca{from{transform:rotate(-26deg)}to{transform:rotate(26deg)}}</style>
<defs>
  <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07080c"/><stop offset="1" stop-color="#1c1d22"/></linearGradient>
  <linearGradient id="reboco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a544c"/><stop offset="1" stop-color="#2e2a26"/></linearGradient>
  <linearGradient id="lama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a221b"/><stop offset="1" stop-color="#0e0b08"/></linearGradient>
  <linearGradient id="luzChao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8b44a" stop-opacity=".6"/><stop offset="1" stop-color="#e8b44a" stop-opacity="0"/></linearGradient>
  <linearGradient id="azulejo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26241f"/><stop offset=".6" stop-color="#4a463c"/><stop offset="1" stop-color="#3a362e"/></linearGradient>
  <linearGradient id="pisoMolhado" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3028"/><stop offset="1" stop-color="#120e0b"/></linearGradient>
  <linearGradient id="aco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a5256"/><stop offset=".5" stop-color="#6a767a"/><stop offset="1" stop-color="#424a4e"/></linearGradient>
  <radialGradient id="lamp"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".45"/><stop offset=".45" stop-color="#e8a04a" stop-opacity=".16"/><stop offset="1" stop-color="#e8a04a" stop-opacity="0"/></radialGradient>
</defs>
<rect x="-800" y="-1000" width="12000" height="3400" fill="url(#ceu)"/>
<circle cx="3500" cy="200" r="50" fill="#bfc2bc" opacity=".35"/>
${exterior()}
${interior()}
</svg>`;
}

export async function roteiro(a) {
  const { animar, olhos: abre, diz, limpa, cartaz, escurece, espera, som, el, mundo } = a;
  const svg = mundo();
  const vento = som.vento(); vento.alvo(0.22, 2);
  const moscas = som.moscas(); moscas.alvo(0.08, 4);
  let vapor = null, comer = true;
  const mastiga = async () => { while (comer) { som.mastigar(1.4, 0.07, 0.05); await new Promise((ok) => setTimeout(ok, 1500)); } };
  try {
    await espera(600);
    abre(1, 2400);
    await animar({ blur: 0, luz: 0.95 }, 2600);
    await diz("O cheiro chega antes do prédio. Sal, ferrugem e outra coisa por baixo.", { segura: 1400 });
    await animar({ x: 2300, y: 860, w: 1800 }, 3600);
    await diz("Um galpão comprido. Na parede, letras desbotadas: MATADOURO MUNICIPAL.", { segura: 1200 });
    await animar({ x: 2260, y: 680, w: 1200 }, 2600);
    svg.querySelectorAll("#olhos-urubu .olho-b").forEach((o) => (o.style.opacity = "1"));
    await diz("No telhado, dois urubus. Acordados.", { segura: 1400 });
    await limpa(300);

    await animar({ x: 2330, y: 1300, w: 900 }, 3200);
    mastiga();
    await diz("Pela porta entreaberta sai uma luz amarela. E um som molhado, ritmado.", { segura: 1200 });
    await diz("Alguém está comendo.", { segura: 1600 });
    await limpa(300);

    // o curral
    await animar({ x: 2000, y: 1640, w: 2400 }, 3000);
    for (let i = 0; i < 3; i++) { som.passo(0.22); await espera(560); }
    await diz("O curral está cheio de cordas, esticadas de mourão em mourão, quase na altura do joelho.", { segura: 1000 });
    await limpa(150);
    som.passo(0.3);
    a.cam.tremor = 1.4; setTimeout(() => (a.cam.tremor = 0), 300);
    svg.querySelectorAll(".sino-v").forEach((s) => s.classList.add("balanca"));
    for (let i = 0; i < 9; i++) { som.sinoVaca(0.45 - i * 0.03, (i % 5) / 2.5 - 0.8); await espera(140 + Math.random() * 120); }
    await diz("Você esbarra numa corda. Um sino de vaca. Depois outro. Depois todos.", { segura: 1000 });
    for (let i = 0; i < 5; i++) { som.sinoVaca(0.2, Math.random() * 2 - 1); await espera(260); }
    await limpa(300);
    comer = false;
    moscas.alvo(0.0001, 0.4); vento.alvo(0.05, 1);
    await animar({ x: 2320, y: 1260, w: 1100 }, 2400);
    await diz("Lá dentro, o som de comer para.", { segura: 2000 });
    som.rangido(2, 0.09, 120, 1100);
    el("#fresta").setAttribute("points", `2300,1080 2390,1080 2390,${CHAO} 2300,${CHAO}`);
    await diz("A porta range e se abre um pouco mais. Ninguém aparece.", { segura: 1600 });
    await limpa(300);

    // entrar
    await escurece(1, 1200);
    Object.assign(a.cam, { x: IX + 300, y: 900, w: 2600, luz: 0.8 });
    moscas.alvo(0.12, 2); vapor = som.vapor(); vapor.alvo(0.05, 3);
    await espera(400);
    escurece(0, 1600);
    await diz("Ganchos num trilho do teto. Carne pendurada, balançando devagar, embora não entre vento.", { segura: 1400 });
    await animar({ x: IX - 600, y: 1100, w: 1300 }, 3000);
    vapor.alvo(0.12, 2);
    await diz("Uma porta de ferro solta um vapor gelado. Não existe energia nesta cidade.", { segura: 1600 });
    await limpa(300);

    // a mesa
    await animar({ x: IX + 1020, y: 1170, w: 1600 }, 3600);
    await diz("No fundo, uma mesa comprida. Cinco pessoas curvadas sobre os pratos.", { segura: 1200 });
    const ordem = [2, 0, 3, 1, 4];
    for (let k = 0; k < ordem.length; k++) {
      const p = svg.querySelector(`#c-${ordem[k]} .olho-b`); if (p) p.style.opacity = "1";
      if (k < 2) som.coracao(0.8);
      if (k === 0) await diz("Uma levanta o rosto. Depois outra.", { segura: 500 });
      else await espera(700);
    }
    await animar({ x: IX + 1020, y: 1180, w: 980 }, 2000);
    await diz("Têm a boca suja de vermelho até o queixo.", { segura: 1600 });
    await limpa(300);

    // a da ponta se levanta
    el("#c-4-sentado").style.transition = "opacity .5s"; el("#c-4-sentado").style.opacity = "0";
    el("#anfitriao").style.opacity = "1"; el("#anfitriao .olho-b").style.opacity = "1";
    som.rangido(0.7, 0.08, 80, 500);
    await animar({ x: IX + 1430, y: 1240, w: 760 }, 2200);
    await diz("A da ponta se levanta, limpa a boca na manga e sorri.", { segura: 1400 });
    await diz("— Senta.", { segura: 1100, classe: "fala" });
    await diz("— Tem pra todo mundo.", { segura: 2200, classe: "fala" });
    await limpa(300);

    // o lampião apaga
    el("#lamp-a").setAttribute("values", `-14 ${IX + 1000} 0;14 ${IX + 1000} 0;-14 ${IX + 1000} 0`);
    el("#lamp-a").setAttribute("dur", "1.4s");
    for (const v of [0.3, 1, 0.1, 0.8, 0]) { el("#lamp-luz").style.opacity = String(v); el("#lamp-chama").style.opacity = String(v); await espera(160); }
    el("#breu").style.opacity = ".92";
    moscas.alvo(0.2, 1);
    await espera(1600);
    await Promise.all([abre(0, 1600), escurece(1, 1600)]);
    await espera(700);
    som.impacto(0.85);
    await cartaz(`<div class="t-eq" style="--cor:#a8322a">OS COMENSAIS</div><div class="t-lin"></div><div class="t-sub">Matadouro Municipal</div>`, 6000);
  } finally {
    comer = false; moscas.parar(2); if (vapor) vapor.parar(1);
  }
}
