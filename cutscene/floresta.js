/* Primeiro encontro: Os da Floresta, na Mata dos Afogados.
   Noite de lua. A enchente deixou coisas nos galhos. Na clareira, um cervo pasta,
   até levantar a cabeça e olhar demais. Um piscar de olhos depois, não é um cervo. */
import { pessoa, MASCARA, olhos, rnd } from "./kit.js?v=1.2.0";

const CHAO = 1560;

function tronco(x, base, larg, alt, cor, r, galhos = 3) {
  const topo = base - alt, inc = (r() - 0.5) * larg * 0.6;
  let s = `<path d="M${x - larg / 2},${base} Q${x - larg * 0.42 + inc / 2},${(base + topo) / 2} ${x - larg * 0.3 + inc},${topo} L${x + larg * 0.3 + inc},${topo} Q${x + larg * 0.42 + inc / 2},${(base + topo) / 2} ${x + larg / 2},${base} Z" fill="${cor}"/>`;
  for (let g = 0; g < galhos; g++) {
    const gy = base - alt * (0.45 + r() * 0.5), lado = r() < 0.5 ? -1 : 1, comp = alt * (0.15 + r() * 0.2);
    s += `<path d="M${x + inc * 0.6},${gy} Q${x + lado * comp * 0.5},${gy - comp * 0.35} ${x + lado * comp},${gy - comp * (0.3 + r() * 0.5)}" stroke="${cor}" stroke-width="${(larg * 0.16).toFixed(1)}" fill="none" stroke-linecap="round"/>`;
  }
  return s;
}

function mata() {
  const r = rnd(808);
  let longe = "", meio = "", perto = "";
  for (let x = -400; x < 4800; x += 70 + r() * 70) longe += tronco(x, CHAO - 80, 26 + r() * 18, 1500 + r() * 300, "#1c2430", r, 2);
  for (let x = -300; x < 4800; x += 180 + r() * 160) if (Math.abs(x - 2200) > 340) meio += tronco(x, CHAO + 10, 60 + r() * 30, 1700, "#10151c", r, 3);
  for (const [x, l] of [[-120, 260], [600, 190], [3900, 220], [4500, 280]]) perto += tronco(x, CHAO + 400, l, 2400, "#06080b", r, 2);
  return { longe, meio, perto };
}

/* coisas que a enchente deixou nos galhos */
function entulho() {
  return `<g fill="none" stroke="#4d5a6b" stroke-width="5" stroke-linecap="round">
    <g transform="translate(1480,520) rotate(-12)"><circle cx="-34" cy="0" r="26"/><circle cx="34" cy="0" r="26"/><path d="M-34,0 L-6,-30 L22,-30 L34,0 M-6,-30 L4,0 L-34,0 M22,-30 L26,-44 L16,-46"/></g>
    <g transform="translate(3420,600) rotate(18)"><path d="M-30,0 L30,0 M-24,0 L-26,46 M24,0 L26,46 M-28,0 L-30,-48 M28,0 L30,-48 M-29,-26 L29,-26"/></g>
  </g>
  <g fill="#465161">
    <path d="M2920,380 L2905,390 Q2890,470 2876,520 L2964,520 Q2950,470 2935,390 Z" opacity=".9"/>
    <path d="M2910,520 L2900,560 L2930,560 L2924,520 Z M2944,520 L2950,566 L2960,540 Z" opacity=".7"/>
    <g id="boneca" transform="translate(2620,640)"><line x1="0" y1="-60" x2="0" y2="-20" stroke="#465161" stroke-width="2"/>
      <path d="M-3,-22 L-4,6 L4,6 L3,-22 Z"/><path d="M-9,6 Q-11,30 -8,38 L8,38 Q11,30 9,6 Z"/><circle cx="0" cy="48" r="9"/><path d="M8,12 L16,30" stroke="#465161" stroke-width="3"/>
      <animateTransform attributeName="transform" type="rotate" values="-4 0 -60;5 0 -60;-4 0 -60" dur="7s" repeatCount="indefinite" additive="sum"/></g>
    <path d="M1780,430 q30,-10 50,4 q-14,36 -44,28 z" opacity=".8"/>
    <path d="M1020,610 L1110,600 L1104,640 Q1060,660 1024,640 Z" opacity=".75"/>
  </g>
  <g stroke="#56627a" stroke-width="2" opacity=".7"><path d="M3100,520 q8,40 -2,90 M3112,520 q4,30 10,70 M1880,560 q-4,40 6,80"/></g>`;
}

/* o cervo: bicho de cabeça baixa, bicho de cabeça erguida e o homem com a máscara */
function cervos() {
  const x = 2200, y = CHAO - 4, cor = "#1a1712";
  const corpo = `<path d="M-70,-90 Q-40,-118 30,-112 Q70,-108 76,-84 Q80,-60 66,-56 L-64,-56 Q-84,-64 -70,-90 Z" fill="${cor}"/>
    <path d="M-58,-62 L-62,0 L-54,0 L-48,-60 Z M-34,-60 L-32,0 L-25,0 L-26,-58 Z M44,-62 L42,0 L50,0 L54,-60 Z M62,-60 L70,0 L77,0 L70,-62 Z" fill="${cor}"/>
    <path d="M-72,-88 L-80,-96" stroke="${cor}" stroke-width="6" stroke-linecap="round"/>`;
  const chifres = `<g stroke="#1a1712" stroke-width="3.5" fill="none" stroke-linecap="round"><path d="M0,0 Q-6,-26 -22,-40 M-6,-20 Q-18,-20 -26,-14 M-14,-32 Q-14,-46 -10,-54"/><path d="M8,0 Q14,-26 30,-38 M14,-20 Q26,-20 34,-14 M22,-30 Q24,-44 20,-52"/></g>`;
  const baixo = `<g id="cervo-bicho" transform="translate(${x},${y})">${corpo}
      <path d="M58,-96 Q84,-80 98,-40 L112,-18 Q118,-10 108,-6 L92,-14 Q82,-40 60,-74 Z" fill="${cor}"/>
      <g transform="translate(96,-40) rotate(70)">${chifres}</g>
      <animateTransform attributeName="transform" type="translate" values="${x},${y};${x + 2},${y};${x},${y}" dur="3s" repeatCount="indefinite"/></g>`;
  const alto = `<g id="cervo-alto" transform="translate(${x},${y})" style="opacity:0">${corpo}
      <path d="M56,-100 Q74,-130 80,-168 L96,-178 Q106,-176 104,-164 L90,-150 Q84,-120 70,-90 Z" fill="${cor}"/>
      <path d="M86,-176 L80,-190 L90,-182 Z" fill="${cor}"/>
      <g transform="translate(88,-180)">${chifres}</g>
      <circle cx="96" cy="-168" r="2.2" fill="#e8e0c8"/></g>`;
  const homem = `<g id="cervo-homem" style="opacity:0">${pessoa({ x: x + 60, y, h: 250, cor: "#14120f", cabeca: MASCARA.cervo + olhos(6, -2, "#f2ead0", 1.7) })}</g>`;
  return baixo + alto + homem;
}

function bando() {
  return `
  <path d="M1500,${CHAO + 20} Q1488,900 1480,300 L1530,300 Q1530,900 1560,${CHAO + 20} Z" fill="#0d1218"/>
  <path d="M1250,700 L1500,520 M1290,700 L1310,790 M1470,560 L1470,790" stroke="#2a2a24" stroke-width="3"/>
  <rect x="1250" y="790" width="250" height="14" fill="#2a241c"/><path d="M1250,790 L1500,790" stroke="#4a4030" stroke-width="2"/>
  <g id="leopardo" class="membro" style="opacity:0;transition:opacity 2.2s">
    ${pessoa({ x: 1370, y: 790, h: 170, pose: "agachado", cor: "#16130f", cabeca: MASCARA.leopardo + olhos(6, -1, "#f4d27a", 1.6) })}
  </g>
  <path d="M2600,800 Q2800,756 3060,770" stroke="#10151c" stroke-width="22" fill="none" stroke-linecap="round"/>
  <g id="morcego" class="membro" style="opacity:0;transition:opacity 2.2s">
    ${pessoa({ x: 2860, y: 766, h: 180, pose: "agachado", cor: "#121014", giro: 24, cabeca: MASCARA.morcego })}
  </g>
  <g id="urso" class="membro" style="opacity:0;transition:opacity 2.2s">
    <g transform="translate(3560,${CHAO + 60}) scale(1.35,1) translate(-3560,-${CHAO + 60})">${pessoa({ x: 3560, y: CHAO + 60, h: 330, cor: "#100d0b", cabeca: MASCARA.urso + olhos(7, -6, "#e6c48a", 1.6) })}</g>
  </g>
`;
}

export const camInicial = { x: 2200, y: 900, w: 2600, rot: -3, blur: 12, luz: 0.45, balanco: 1.2 };

export function mundo() {
  const { longe, meio, perto } = mata();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block">
<defs>
  <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0f18"/><stop offset="1" stop-color="#1d2733"/></linearGradient>
  <linearGradient id="feixe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d4e0" stop-opacity=".02"/><stop offset=".8" stop-color="#c9d4e0" stop-opacity=".16"/><stop offset="1" stop-color="#c9d4e0" stop-opacity=".22"/></linearGradient>
  <radialGradient id="clareira"><stop offset="0" stop-color="#55606a" stop-opacity=".75"/><stop offset="1" stop-color="#55606a" stop-opacity="0"/></radialGradient>
  <linearGradient id="nevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f9caa" stop-opacity="0"/><stop offset=".5" stop-color="#8f9caa" stop-opacity=".2"/><stop offset="1" stop-color="#8f9caa" stop-opacity="0"/></linearGradient>
</defs>
<rect x="-800" y="-800" width="6000" height="3200" fill="url(#ceu)"/>
<circle cx="2500" cy="-160" r="80" fill="#dfe4e8" opacity=".7"/>
<g>${longe}</g>
<rect x="-800" y="1200" width="6000" height="320" fill="url(#nevoa)"/>
<polygon points="2380,-300 2560,-300 2560,${CHAO} 1880,${CHAO}" fill="url(#feixe)"/>
<rect x="-800" y="${CHAO - 30}" width="6000" height="900" fill="#0b0e12"/>
<ellipse cx="2240" cy="${CHAO}" rx="420" ry="60" fill="url(#clareira)"/>
<g>${meio}</g>
${entulho()}
${cervos()}
${bando()}
<rect x="-800" y="${CHAO - 120}" width="6000" height="220" fill="url(#nevoa)" opacity=".8"/>
<g>${perto}</g>
<path d="M-800,2200 L-800,${CHAO + 120} Q1200,${CHAO + 60} 2200,${CHAO + 110} Q3400,${CHAO + 70} 5200,${CHAO + 120} L5200,2200 Z" fill="#050608"/>
  <g id="cachorro" class="membro" style="opacity:0;transition:opacity 1.8s">
    ${pessoa({ x: 1180, y: CHAO + 200, h: 230, pose: "agachado", cor: "#1a1f27", giro: -14, cabeca: MASCARA.cachorro + olhos(6, -4, "#f0e2b8", 1.7) })}
  </g>
</svg>`;
}

export async function roteiro(a) {
  const { animar, olhos: abre, diz, limpa, cartaz, escurece, espera, som, el } = a;
  const vento = som.vento(); vento.alvo(0.28, 2);
  const grilos = som.insetos(4300, 0.9, 26); grilos.alvo(0.7, 3);
  const passos = async (n, ms = 520) => { for (let i = 0; i < n; i++) { som.passo(0.18 + Math.random() * 0.08); await espera(ms); } };
  try {
    await espera(700);
    abre(1, 2600);
    await animar({ blur: 0, luz: 0.9, rot: 0 }, 2800);
    await diz("Árvores demais, plantadas perto demais umas das outras.", { segura: 1400 });
    await animar({ x: 2350, y: 620, w: 2400 }, 4200);
    som.rangido(1.8, 0.07, 70, 600);
    await diz("Nos galhos altos, o que a enchente deixou: uma bicicleta, um vestido, uma boneca pendurada pelo pé.", { segura: 1600 });
    await limpa(300);

    animar({ x: 2200, y: 1150, w: 2000 }, 5000);
    await passos(5);
    await diz("Cada passo seu faz barulho. Folha seca, galho, água parada.", { segura: 1200 });
    await animar({ x: 2240, y: 1330, w: 900, balanco: 0.7 }, 3200);
    await diz("Numa clareira, sob a lua, um cervo pasta.", { segura: 1800 });
    await limpa(300);

    // os grilos param
    grilos.alvo(0.0001, 0.5);
    await espera(1300);
    await diz("Os grilos param.", { segura: 1200 });
    som.galho(0.45, -0.6);
    await espera(500);
    el("#cervo-bicho").style.opacity = "0"; el("#cervo-alto").style.opacity = "1";
    som.coracao(0.7);
    await diz("O cervo levanta a cabeça e olha para você.", { segura: 1000 });
    som.coracao(0.75);
    await diz("Muito tempo. Mais tempo do que um bicho olha.", { segura: 1400 });
    await limpa(200);

    // piscar: não é um cervo
    await abre(0, 220);
    el("#cervo-alto").style.opacity = "0"; el("#cervo-homem").style.opacity = "1";
    await espera(260);
    await abre(1, 360);
    som.coracao(1); a.cam.tremor = 0.5; setTimeout(() => (a.cam.tremor = 0), 300);
    el("#cervo-homem .olho-b").style.opacity = "1";
    await animar({ x: 2260, y: 1290, w: 520 }, 1800);
    await diz("Não é um cervo.", { segura: 1300 });
    await diz("É um homem de pé, com a cabeça de um cervo no lugar do rosto. A máscara não tem costura nem amarra.", { segura: 1800 });
    await limpa(300);

    // o resto do bando
    vento.alvo(0.15, 2);
    await animar({ x: 1380, y: 760, w: 700, balanco: 1 }, 3000);
    el("#leopardo").style.opacity = "1"; setTimeout(() => (el("#leopardo .olho-b").style.opacity = "1"), 900);
    await diz("Numa plataforma de tábuas, entre os galhos, um leopardo agachado.", { segura: 1400 });
    await animar({ x: 2860, y: 700, w: 620 }, 3000);
    el("#morcego").style.opacity = "1";
    await diz("Mais alto, um homem com cara de morcego, de cabeça torta. Os olhos da máscara são costurados.", { segura: 1300 });
    await diz("Ele não precisa olhar. Está ouvindo você respirar.", { segura: 1500 });
    await limpa(300);
    await animar({ x: 3500, y: 1250, w: 1100 }, 2800);
    el("#urso").style.opacity = "1"; setTimeout(() => (el("#urso .olho-b").style.opacity = "1"), 1200);
    som.respiro(3.2, 0.32);
    await diz("Atrás de um tronco grosso, uma coisa grande demais respira devagar.", { segura: 1600 });
    await limpa(300);

    // o mais perto
    som.respiro(1.2, 0.18);
    await animar({ x: 1240, y: 1575, w: 760, rot: 2 }, 1800);
    el("#cachorro").style.opacity = "1"; setTimeout(() => (el("#cachorro .olho-b").style.opacity = "1"), 600);
    som.coracao(0.9);
    await diz("E perto. Muito perto. Agachado no chão, farejando o seu rastro, um cão.", { segura: 1800 });
    await limpa(300);

    // somem
    await animar({ x: 2200, y: 1050, w: 2600, rot: 0 }, 2600);
    await espera(900);
    await abre(0, 240);
    el("#cervo-homem").style.opacity = "0";
    document.querySelectorAll(".membro").forEach((m) => { m.style.transition = "none"; m.style.opacity = "0"; });
    await espera(300);
    await abre(1, 420);
    await diz("Você pisca. A clareira está vazia.", { segura: 1300 });
    grilos.alvo(0.65, 2.5);
    await diz("Os grilos voltam a cantar, como se nada tivesse estado ali.", { segura: 2000 });
    await limpa(500);

    vento.parar(4);
    await Promise.all([abre(0, 2400), escurece(1, 2400)]);
    grilos.parar(3);
    await espera(700);
    som.impacto(0.8);
    await cartaz(`<div class="t-eq" style="--cor:#6f9a5a">OS DA FLORESTA</div><div class="t-lin"></div><div class="t-sub">Mata dos Afogados</div>`, 6000);
  } finally {
    grilos.parar(1);
  }
}
