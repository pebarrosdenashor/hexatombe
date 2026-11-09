/* Primeiro encontro: Família Queiroz, na Fazenda Alto do Cruzeiro.
   Fim de tarde. Você sobe o morro sem bandeira branca; um brilho na caixa d'água,
   um tiro aos seus pés e a família inteira olhando lá de cima. Ao anoitecer, a vela do oratório acende sozinha. */
import { pessoa, chapeu, veu, olhos, rnd } from "./kit.js?v=1.2.0";

const TOPO = 770;

function mandacaru(x, y, s, cor = "#1e1a16") {
  return `<g transform="translate(${x},${y}) scale(${s})" fill="${cor}">
    <rect x="-9" y="-150" width="18" height="150" rx="9"/>
    <path d="M-9,-70 L-30,-70 Q-38,-70 -38,-80 L-38,-120 Q-38,-128 -31,-128 Q-24,-128 -24,-120 L-24,-84 L-9,-84 Z"/>
    <path d="M9,-95 L28,-95 Q36,-95 36,-105 L36,-135 Q36,-142 29,-142 Q22,-142 22,-135 L22,-109 L9,-109 Z"/></g>`;
}

function casa() {
  return `
  <!-- casa sede -->
  <rect x="1980" y="590" width="720" height="${TOPO - 590}" fill="url(#cal)"/>
  <polygon points="1950,596 2340,520 2730,596" fill="#7a3e2a"/><path d="M1950,596 L2730,596" stroke="#4a2418" stroke-width="6"/>
  <g stroke="#5a2c1e" stroke-width="2" opacity=".5">${[...Array(18)].map((_, i) => `<line x1="${1990 + i * 42}" y1="${596 - Math.max(0, 76 - Math.abs(2340 - (1990 + i * 42)) * 0.195)}" x2="${1990 + i * 42}" y2="596"/>`).join("")}</g>
  <rect x="1980" y="636" width="720" height="10" fill="#a89a80" opacity=".5"/>
  ${[2040, 2240, 2500, 2620].map((x) => `<rect x="${x}" y="660" width="44" height="64" fill="#2f4a66"/><rect x="${x + 4}" y="664" width="18" height="56" fill="#3d5f80"/>`).join("")}
  <rect x="2340" y="650" width="70" height="${TOPO - 650}" fill="#2a1e16"/>
  <!-- oratório -->
  <g transform="translate(2170,690)"><path d="M-20,30 L-20,-14 Q0,-34 20,-14 L20,30 Z" fill="#3a2c22"/><path d="M-14,26 L-14,-10 Q0,-24 14,-10 L14,26 Z" fill="#c9b48a"/>
    <path d="M-5,24 L-5,-2 Q0,-10 5,-2 L5,24 Z" fill="#2c4f93"/><circle cx="0" cy="-6" r="3.6" fill="#e2c6a8"/>
    <g id="vela-oratorio" style="opacity:0;transition:opacity 2.4s"><circle cx="0" cy="18" r="40" fill="url(#chama)"/><rect x="-1.6" y="18" width="3.2" height="8" fill="#eee4cc"/><path d="M0,10 Q3,15 0,19 Q-3,15 0,10 Z" fill="#ffd27a"><animateTransform attributeName="transform" type="scale" values="1 1;.85 1.12;1 1" dur=".7s" repeatCount="indefinite" additive="sum"/></path></g></g>
  <!-- varal -->
  <path d="M2720,700 Q2820,716 2900,704" stroke="#3a2c22" stroke-width="2" fill="none"/>
  <g><rect x="2742" y="704" width="22" height="34" fill="#b5372d"/><rect x="2780" y="710" width="30" height="24" fill="#d8d1c2"/><rect x="2830" y="708" width="18" height="40" fill="#2e5ea8"/>
    <animateTransform attributeName="transform" type="skewX" values="0;2;-1;0" dur="5s" repeatCount="indefinite"/></g>
  <rect x="2896" y="680" width="8" height="${TOPO - 680}" fill="#3a2c22"/>
  <!-- caixa d'água -->
  <g fill="#2a2724"><path d="M2985,${TOPO} L3005,470 L3015,470 L2997,${TOPO} Z M3155,${TOPO} L3135,470 L3125,470 L3143,${TOPO} Z"/>
    <path d="M3000,620 L3140,560 M3000,560 L3140,620 M2994,690 L3146,640 M2994,640 L3146,690" stroke="#2a2724" stroke-width="4"/>
    <rect x="2975" y="380" width="190" height="92" rx="6" fill="#4a4540"/><path d="M2975,400 L3165,400 M2975,452 L3165,452" stroke="#2f2b28" stroke-width="3"/>
    <path d="M3168,380 L3168,${TOPO} M3184,380 L3184,${TOPO}" stroke="#2a2724" stroke-width="3"/>${[...Array(14)].map((_, i) => `<line x1="3168" y1="${400 + i * 26}" x2="3184" y2="${400 + i * 26}" stroke="#2a2724" stroke-width="2"/>`).join("")}</g>
  <g id="everaldo"><path d="M3040,378 Q3070,362 3120,368 L3130,378 Z" fill="#1b1612"/><g transform="translate(3046,366)">${chapeu("#4a3220").replace(/27/, "22")}</g>
    <line x1="3060" y1="372" x2="2964" y2="362" stroke="#141110" stroke-width="5"/><circle id="brilho" cx="2992" cy="364" r="7" fill="#fff4d0" style="opacity:0;transition:opacity .12s"/></g>
  <!-- cruzeiro -->
  <g fill="#2c2118"><rect x="1588" y="${TOPO - 300}" width="26" height="300"/><rect x="1530" y="${TOPO - 240}" width="142" height="24"/></g>
  <path d="M1601,${TOPO - 300} L1601,${TOPO}" stroke="#7a5a3a" stroke-width="3" opacity=".5"/>
  <!-- poço -->
  <g><rect x="2296" y="${TOPO - 92}" width="8" height="70" fill="#3a2c22"/><rect x="2426" y="${TOPO - 92}" width="8" height="70" fill="#3a2c22"/><rect x="2290" y="${TOPO - 96}" width="150" height="9" fill="#4a3624"/>
    <line x1="2365" y1="${TOPO - 88}" x2="2335" y2="${TOPO - 34}" stroke="#a69c86" stroke-width="1.6"/></g>
  <!-- cerca e porteira -->
  <g stroke="#3a2c22" stroke-width="5">${[1700, 1780, 1860, 1940, 2020, 2100, 2420, 2500, 2580, 2660, 2740, 2820].map((x) => `<line x1="${x}" y1="${TOPO + 30}" x2="${x}" y2="${TOPO - 22}"/>`).join("")}</g>
  <g stroke="#6a5a48" stroke-width="1.5" opacity=".8"><path d="M1700,${TOPO - 10} L2100,${TOPO - 10} M1700,${TOPO + 6} L2100,${TOPO + 6} M2420,${TOPO - 10} L2820,${TOPO - 10} M2420,${TOPO + 6} L2820,${TOPO + 6}"/></g>
  <g stroke="#5a4330" stroke-width="6"><line x1="2130" y1="${TOPO + 32}" x2="2130" y2="${TOPO - 40}"/><line x1="2200" y1="${TOPO + 30}" x2="2200" y2="${TOPO - 36}"/>
    <path d="M2130,${TOPO - 30} L2200,${TOPO - 30} M2130,${TOPO - 8} L2200,${TOPO - 8} M2130,${TOPO + 14} L2200,${TOPO + 14} M2130,${TOPO + 14} L2200,${TOPO - 30}" stroke-width="5"/></g>`;
}

function familia() {
  const pele = ["#7a5a40", "#8a6a4a", "#6a4a34"];
  const rosto = (i) => `<circle r="14" fill="${pele[i % 3]}"/>` + olhos(5, 0, "#f0e2c0", 1.5);
  return `
  ${pessoa({ id: "sebastiao", x: 2240, y: TOPO + 30, h: 135, cor: "#2b241e", cabeca: rosto(2) + chapeu("#4a3220"),
    frente: `<path d="M22,-150 L66,-220" stroke="#4a3624" stroke-width="5"/><path d="M60,-226 L80,-210 L70,-200 Z" fill="#6a6a64"/>` })}
  ${pessoa({ id: "dalva", x: 2460, y: TOPO - 4, h: 92, pose: "manto", cor: "#2c2428", cabeca: veu("#3a3236") + rosto(1),
    frente: `<g fill="#cfc4a8">${[...Array(9)].map((_, i) => `<circle cx="${(Math.cos(i * 0.7) * 8).toFixed(1)}" cy="${(-90 + Math.sin(i * 0.7) * 8 + i * 2).toFixed(1)}" r="1.8"/>`).join("")}</g><path d="M0,-74 L0,-60 M-4,-66 L4,-66" stroke="#cfc4a8" stroke-width="1.5"/>` })}
  <g id="aurelio">${pessoa({ x: 2405, y: TOPO - 4, h: 86, cor: "#25201c", cabeca: rosto(0) + `<path d="M-6,6 Q0,11 7,5" stroke="#e8dcc0" stroke-width="1.4" fill="none"/>`,
    frente: `<g id="faca"><path d="M-62,-126 L-8,-140 L-6,-132 L-58,-118 Z" fill="#e2e2da"/><path d="M-62,-126 L-8,-140" stroke="#ffffff" stroke-width="1.2"/><rect x="-8" y="-142" width="22" height="12" rx="2" fill="#4a3220"/>
      <path d="M-40,-112 L20,-112 L20,-104 L-40,-104 Z" fill="#5a5048"/>
      <animateTransform attributeName="transform" type="translate" values="0 0;16 -3;0 0" dur=".75s" repeatCount="indefinite"/></g>` })}</g>
  ${pessoa({ id: "sonia", x: 2335, y: TOPO - 4, h: 84, pose: "manto", cor: "#3a2a26", cabeca: rosto(1) + `<path d="M-14,-6 Q-14,-20 0,-20 Q14,-20 14,-6 Q0,-12 -14,-6Z" fill="#7a2a24"/>`,
    frente: `<path d="M0,-150 L0,-100" stroke="#a69c86" stroke-width="1.6"/><path d="M-10,-104 L10,-104 L8,-84 L-8,-84 Z" fill="#6a6a64"/>` })}
  <path d="M2290,${TOPO - 26} Q2365,${TOPO - 40} 2440,${TOPO - 26} L2444,${TOPO + 4} L2286,${TOPO + 4} Z" fill="#6a6258"/>
  <g stroke="#4a443c" stroke-width="2" opacity=".7"><path d="M2300,${TOPO - 16} L2330,${TOPO - 20} M2360,${TOPO - 22} L2400,${TOPO - 20} M2296,${TOPO - 6} L2440,${TOPO - 6}"/></g>`;
}

export const camInicial = { x: 2250, y: 1500, w: 2000, rot: 0, blur: 16, luz: 1.4, balanco: 1.1 };

export function mundo() {
  const r = rnd(1950);
  const cactos = [[1500, 1180, 0.9], [2900, 1060, 0.8], [1200, 1560, 1.4], [3300, 1420, 1.3], [800, 1900, 2.2], [3800, 1880, 2], [1900, 960, 0.6], [2700, 920, 0.55]]
    .map(([x, y, s]) => mandacaru(x, y, s, s > 1.5 ? "#100d0b" : "#241e18")).join("");
  const pedras = [...Array(40)].map(() => `<ellipse cx="${(800 + r() * 3000).toFixed(0)}" cy="${(900 + r() * 1100).toFixed(0)}" rx="${(6 + r() * 16).toFixed(0)}" ry="${(3 + r() * 6).toFixed(0)}" fill="#5a4636" opacity=".6"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block">
<defs>
  <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241c38"/><stop offset=".45" stop-color="#6e3a3e"/><stop offset=".75" stop-color="#c46a3c"/><stop offset="1" stop-color="#e8a85a"/></linearGradient>
  <linearGradient id="morro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a4a34"/><stop offset=".5" stop-color="#4a3424"/><stop offset="1" stop-color="#241810"/></linearGradient>
  <linearGradient id="cal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9a888"/><stop offset="1" stop-color="#e6c49a"/></linearGradient>
  <radialGradient id="sol"><stop offset="0" stop-color="#fff0c0"/><stop offset=".25" stop-color="#ffc06a" stop-opacity=".9"/><stop offset="1" stop-color="#ff8a3a" stop-opacity="0"/></radialGradient>
  <radialGradient id="chama"><stop offset="0" stop-color="#ffc66b" stop-opacity=".7"/><stop offset="1" stop-color="#ff8a2b" stop-opacity="0"/></radialGradient>
  <radialGradient id="po"><stop offset="0" stop-color="#b08a64" stop-opacity=".9"/><stop offset="1" stop-color="#b08a64" stop-opacity="0"/></radialGradient>
</defs>
<rect x="-800" y="-1000" width="6000" height="3400" fill="url(#ceu)"/>
<g id="sol-g" style="transition:transform 7s ease-in, opacity 7s"><circle cx="3700" cy="700" r="320" fill="url(#sol)"/><circle cx="3700" cy="700" r="60" fill="#ffe2a0"/></g>
<path d="M-800,1100 Q400,980 1200,1020 Q1600,1040 1800,1000 L1800,2400 L-800,2400 Z" fill="#3a2a22" opacity=".8"/>
<path d="M-800,2400 L-800,1700 Q500,1500 1300,1000 Q1500,${TOPO + 10} 1700,${TOPO} L2900,${TOPO} Q3200,${TOPO + 20} 3500,1000 Q4100,1450 5200,1600 L5200,2400 Z" fill="url(#morro)"/>
${pedras}
<path d="M2200,2400 Q2050,2000 2280,1700 Q2500,1450 2140,1240 Q1900,1100 2200,960 Q2380,880 2165,${TOPO + 30}" stroke="#8a6a4a" stroke-width="70" fill="none" opacity=".55" stroke-linecap="round"/>
${casa()}
${familia()}
${cactos}
<g id="poeira" style="opacity:0;transition:opacity .2s"><circle cx="2150" cy="1880" r="60" fill="url(#po)"><animate id="po-a" attributeName="r" from="20" to="140" dur="1.4s" begin="indefinite" fill="freeze"/></circle>
  <circle cx="2190" cy="1860" r="40" fill="url(#po)"/><circle cx="2120" cy="1870" r="50" fill="url(#po)"/></g>
<rect id="noite" x="-800" y="-1000" width="6000" height="3400" fill="#0c1020" style="opacity:0;transition:opacity 8s;mix-blend-mode:multiply"/>
<g id="vela-brilho" style="opacity:0;transition:opacity 2.4s"><circle cx="2170" cy="708" r="46" fill="url(#chama)"/><path d="M2170,700 Q2173,705 2170,709 Q2167,705 2170,700 Z" fill="#ffe0a0"/></g>
<path d="M-800,2400 L-800,1980 Q1200,1900 2200,1960 Q3200,1900 5200,1980 L5200,2400 Z" fill="#1a120c"/>
</svg>`;
}

export async function roteiro(a) {
  const { animar, olhos: abre, diz, limpa, cartaz, escurece, espera, som, el, mundo } = a;
  const svg = mundo();
  const vento = som.vento(); vento.alvo(0.35, 2);
  let cigarras = som.insetos(6200, 0.35, 95); cigarras.alvo(0.55, 3);
  let grilos = null;
  const passos = async (n, ms = 560) => { for (let i = 0; i < n; i++) { som.passo(0.2 + Math.random() * 0.08); await espera(ms); } };
  try {
    await espera(600);
    abre(1, 2400);
    await animar({ blur: 0, luz: 1, x: 2250, y: 1300, w: 2600 }, 3000);
    await diz("O caminho sobe o morro em curvas, entre mandacarus.", { segura: 1200 });
    await animar({ x: 2350, y: 700, w: 2000 }, 4200);
    await diz("Lá em cima, uma casa caiada, um cruzeiro de madeira e uma caixa d'água de ferro.", { segura: 1400 });
    await limpa(300);

    animar({ x: 2300, y: 1200, w: 2400 }, 4000);
    await passos(6);
    await diz("O sol está baixo. A poeira gruda na boca.", { segura: 1200 });
    await limpa(300);

    // o brilho
    await animar({ x: 3050, y: 420, w: 560 }, 3200);
    for (let k = 0; k < 2; k++) { el("#brilho").style.opacity = "1"; await espera(160); el("#brilho").style.opacity = "0"; await espera(900); }
    await diz("No alto da caixa d'água, um brilho. Uma vez. Duas.", { segura: 900 });
    await limpa(150);

    // o tiro
    el("#brilho").style.opacity = "1";
    animar({ x: 2200, y: 1640, w: 1500 }, 380);
    som.tiro(0.95); setTimeout(() => (el("#brilho").style.opacity = "0"), 120);
    cigarras.alvo(0.0001, 0.15);
    el("#poeira").style.opacity = "1"; svg.querySelector("#po-a").beginElement(); som.terra(0.35);
    a.cam.tremor = 3; setTimeout(() => (a.cam.tremor = 0.6), 400); setTimeout(() => (a.cam.tremor = 0), 1000);
    await espera(900);
    el("#poeira").style.transition = "opacity 2.5s"; el("#poeira").style.opacity = "0";
    som.coracao(1); await espera(450); som.coracao(1);
    await diz("O tiro levanta a terra a um palmo do seu pé.", { segura: 1300 });
    await animar({ x: 2350, y: 700, w: 1500 }, 2200);
    await diz("— Daí não passa.", { segura: 1000, classe: "fala longe" });
    await diz("— Sem bandeira branca, ninguém sobe o Alto do Cruzeiro.", { segura: 1600, classe: "fala longe" });
    await limpa(300);

    // a família
    svg.querySelectorAll(".olho-b").forEach((o) => (o.style.opacity = "1"));
    await animar({ x: 2215, y: 690, w: 420 }, 2600);
    await diz("Na porteira, um homem do tamanho dela, de enxada no ombro.", { segura: 1300 });
    await animar({ x: 2440, y: 690, w: 380 }, 2200);
    await diz("Uma senhora de véu reza o terço sem tirar os olhos de você.", { segura: 1400 });
    await animar({ x: 2380, y: 700, w: 300 }, 2200);
    await diz("Encostado no poço, um rapaz amola uma faca. Está sorrindo.", { segura: 1400 });
    await diz("Ao lado dele, uma mulher puxa o balde. A água é limpa. A primeira água limpa que você vê nesta cidade.", { segura: 1600 });
    await limpa(300);

    // anoitece
    await animar({ x: 2300, y: 700, w: 1200 }, 2600);
    el("#sol-g").style.transform = "translate(0px,520px)"; el("#sol-g").style.opacity = "0";
    el("#noite").style.opacity = ".62";
    animar({ luz: 0.8 }, 7000);
    vento.alvo(0.2, 4);
    grilos = som.insetos(4400, 1, 28); grilos.alvo(0.4, 6);
    await diz("Ninguém se mexe. O sol vai descendo atrás do morro.", { segura: 2600 });
    await animar({ x: 2170, y: 690, w: 300 }, 3000);
    el("#vela-oratorio").style.opacity = "1"; el("#vela-brilho").style.opacity = "1";
    await espera(1200);
    await diz("No oratório da varanda, uma vela acende. Ninguém chegou perto dela.", { segura: 1400 });
    await diz("E ninguém da família olha para ela.", { segura: 2000 });
    await limpa(500);

    vento.parar(4);
    await Promise.all([abre(0, 2400), escurece(1, 2400)]);
    await espera(700);
    som.impacto(0.8);
    await cartaz(`<div class="t-eq" style="--cor:#c97a3a">FAMÍLIA QUEIROZ</div><div class="t-lin"></div><div class="t-sub">Fazenda Alto do Cruzeiro</div>`, 6000);
  } finally {
    cigarras.parar(1); if (grilos) grilos.parar(2);
  }
}
