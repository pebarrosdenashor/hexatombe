/* Primeiro encontro: A Romaria, no Morro do Calvário.
   Noite. Você está ao pé da escadaria das 14 estações; as velas acendem morro acima
   e a procissão sai do portão do pátio murado com o andor da santa. */
import { pessoa, vela, veu, defsHalo, olhos, rnd } from "./kit.js?v=1.3.0";

const BASE_Y = 1960, TOPO_Y = 770, CX = 2000;
const prog = (u) => 1 - Math.pow(1 - u, 1.75);
const yU = (u) => BASE_Y - (BASE_Y - TOPO_Y) * prog(u);
const meia = (u) => 470 * (1 - prog(u)) + 78 * prog(u);
const esc = (u) => meia(u) / 470;

function escadaria() {
  let s = `<polygon points="${CX - meia(0)},${BASE_Y} ${CX - meia(1)},${TOPO_Y} ${CX + meia(1)},${TOPO_Y} ${CX + meia(0)},${BASE_Y}" fill="url(#pedra)"/>`;
  for (let i = 0; i <= 60; i++) {
    const u = i / 60, y = yU(u), m = meia(u);
    s += `<line x1="${(CX - m).toFixed(1)}" y1="${y.toFixed(1)}" x2="${(CX + m).toFixed(1)}" y2="${y.toFixed(1)}" stroke="#0b0b0e" stroke-width="${(3.4 * esc(u) + 0.5).toFixed(2)}" opacity=".55"/>`;
    s += `<line x1="${(CX - m).toFixed(1)}" y1="${(y - 2.2 * esc(u)).toFixed(1)}" x2="${(CX + m).toFixed(1)}" y2="${(y - 2.2 * esc(u)).toFixed(1)}" stroke="#77736a" stroke-width="${(1.4 * esc(u) + 0.2).toFixed(2)}" opacity=".35"/>`;
  }
  // muretas laterais
  s += `<polygon points="${CX - meia(0) - 60},${BASE_Y} ${CX - meia(1) - 10},${TOPO_Y} ${CX - meia(1)},${TOPO_Y} ${CX - meia(0)},${BASE_Y}" fill="#232024"/>`;
  s += `<polygon points="${CX + meia(0) + 60},${BASE_Y} ${CX + meia(1) + 10},${TOPO_Y} ${CX + meia(1)},${TOPO_Y} ${CX + meia(0)},${BASE_Y}" fill="#232024"/>`;
  return s;
}

/* nicho de azulejo com a cena da estação; a vela fica apagada até a cena acender */
function nicho(i) {
  const u = (i + 0.35) / 14.6, lado = i % 2 ? 1 : -1, k = esc(u), y = yU(u);
  const x = CX + lado * (meia(u) + 70 * k);
  const w = 74 * k, h = 118 * k;
  const pintura = i === 0
    ? `<g fill="#2e4e8f"><circle cx="0" cy="-74" r="7"/><path d="M-9,-66 Q-12,-40 -8,-22 L8,-22 Q12,-40 9,-66 Z"/><path d="M-8,-80 L-5,-86 L-2,-81 L1,-87 L4,-81 L7,-86 L8,-79" stroke="#2e4e8f" stroke-width="1.6" fill="none"/>
       <circle cx="-22" cy="-70" r="5"/><path d="M-28,-64 L-30,-30 L-16,-30 L-17,-64 Z"/><path d="M-16,-60 L-4,-56" stroke="#2e4e8f" stroke-width="2"/></g>`
    : `<g fill="#3a5a9a" opacity=".85"><circle cx="${-6 + (i % 3) * 5}" cy="-72" r="6"/><path d="M${-14 + (i % 3) * 5},-64 Q-16,-40 -10,-24 L10,-24 Q14,-40 ${4 + (i % 3) * 5},-64 Z"/><path d="M-20,-50 L20,-${40 + (i % 4) * 6}" stroke="#3a5a9a" stroke-width="3"/></g>`;
  return `<g id="nicho-${i}" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${k.toFixed(3)})">
    <path d="M-48,0 L-48,-112 Q-48,-146 0,-150 Q48,-146 48,-112 L48,0 Z" fill="#2c292c"/>
    <path d="M-37,-14 L-37,-104 Q-37,-132 0,-135 Q37,-132 37,-104 L37,-14 Z" fill="#d9dcd6"/>
    <g stroke="#9fb0c9" stroke-width=".8" opacity=".7">${[-24, -10, 4, 18, 32].map((dx) => `<line x1="${dx - 4}" y1="-134" x2="${dx - 4}" y2="-14"/>`).join("")}${[-30, -46, -62, -78, -94, -110].map((dy) => `<line x1="-37" y1="${dy}" x2="37" y2="${dy}"/>`).join("")}</g>
    <path d="M-34,-18 L34,-18 M-34,-100 Q0,-126 34,-100" stroke="#2e4e8f" stroke-width="2.4" fill="none"/>
    ${pintura}
    <text x="0" y="-122" font-size="9" fill="#2e4e8f" text-anchor="middle" font-family="Georgia,serif">${["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV"][i]}</text>
    <rect x="-52" y="-4" width="104" height="8" fill="#3a363a"/>
    ${vela(0, -4, 1.3, `vela-${i}`, false)}
  </g>`;
  void w; void h;
}

/* um romeiro: manto, fita no pescoço, vela na mão */
/* fita de romeiro no pescoço */
const fita = (cor) => `<path d="M-10,-160 Q0,-150 10,-160 L6,-120 M-10,-160 L-12,-118" stroke="${cor}" stroke-width="3" fill="none"/>`;
const rosto = (pele, extra = "") => `<ellipse cx="0" cy="1" rx="12" ry="14" fill="${pele}"/>${extra}` + olhos(4.5, 0, "#f3d79b", 1.5);

/* a santa, em cima do andor */
const santa = (x, y) => `<g id="santa" transform="translate(${x},${y})">
    <circle cx="0" cy="-58" r="14" fill="none" stroke="#e8c76c" stroke-width="1.6" opacity=".9"/>
    ${[...Array(12)].map((_, i) => `<line x1="0" y1="-58" x2="${(Math.cos(i * Math.PI / 6) * 19).toFixed(1)}" y2="${(-58 + Math.sin(i * Math.PI / 6) * 19).toFixed(1)}" stroke="#e8c76c" stroke-width=".7" opacity=".55"/>`).join("")}
    <path d="M-15,0 Q-17,-30 -9,-46 Q0,-52 9,-46 Q17,-30 15,0 Z" fill="#2c4f93"/>
    <path d="M-11,-46 Q-14,-62 0,-66 Q14,-62 11,-46 Q8,-30 12,-8 Q0,-14 -12,-8 Q-8,-30 -11,-46 Z" fill="#e9e3d6"/>
    <path d="M-15,0 Q0,-6 15,0" stroke="#d4b25c" stroke-width="1.4" fill="none"/>
    <ellipse cx="0" cy="-55" rx="6.2" ry="7.6" fill="#e2c6a8"/>
    <path d="M-3.2,-57 Q-2.2,-58 -1.2,-57 M1.2,-57 Q2.2,-58 3.2,-57" stroke="#3a2a22" stroke-width=".7" fill="none"/>
    <path d="M-1.2,-51.5 Q0,-51 1.2,-51.5" stroke="#8a4a42" stroke-width=".6" fill="none"/>
    <g id="lagrimas" stroke="#3a0d09" stroke-width=".55" stroke-linecap="round" fill="none" opacity=".9">
      <path d="M-2.4,-56.3 Q-2.9,-53 -2.2,-50.5 Q-2.6,-49 -2,-47.6"/><path d="M2.4,-56.3 Q2.8,-53.2 2.3,-50.6 Q2.7,-49.2 2.1,-47.8"/></g>
    <path d="M-5,-36 Q0,-40 5,-36 L3,-28 L-3,-28 Z" fill="#e2c6a8"/>
  </g>`;

/* A Romaria são cinco: Seu Damião, Dona Zefa, Irmão Lázaro, Graça e Tião. Ninguém mais. */
function procissao() {
  const yC = 790, yA = yC - 58; // carregadores e tábua do andor
  let s = "";
  // Graça e Tião carregam o andor (precisa de dois, lado a lado)
  s += `<g id="andor">`;
  s += pessoa({ id: "tiao", x: CX - 64, y: yC, h: 70, cor: "#3a2a22", cabeca: rosto("#7a5a40", `<path d="M-12,-6 Q-10,-16 0,-16 Q10,-16 12,-6 Q4,-10 -12,-6 Z" fill="#1a120c"/>`),
    frente: `<path d="M-8,-156 L0,-128 L8,-156" fill="#8a6a4a"/>${fita("#d4a63c")}<g fill="#a8322a">${[-16, -8, 0, 8].map((d) => `<rect x="${d}" y="-104" width="6" height="22" rx="2"/>`).join("")}</g><path d="M-18,-104 L18,-104" stroke="#2a1a10" stroke-width="3"/>
      <path d="M26,-150 L34,-176" stroke="#3a2a22" stroke-width="9" stroke-linecap="round"/>` });
  s += pessoa({ id: "graca", x: CX + 64, y: yC, h: 66, pose: "manto", cor: "#6e6658", cabeca: veu("#e9e3d6") + rosto("#c9a888"),
    frente: `${fita("#b5372d")}<path d="M-25,-150 L-33,-176" stroke="#6e6658" stroke-width="9" stroke-linecap="round"/>
      <g fill="#e9e3d6"><rect x="-40" y="-186" width="13" height="11" rx="3"/><rect x="24" y="-104" width="13" height="11" rx="3"/></g>
      <g fill="#7a120c"><circle cx="-33.5" cy="-180.5" r="2.8"/><circle cx="30.5" cy="-98.5" r="2.8"/></g>` });
  s += `<rect x="${CX - 56}" y="${yA}" width="112" height="5" fill="#5a3a20"/><rect x="${CX - 58}" y="${yA + 4}" width="116" height="4" fill="#3e2716"/>`;
  s += `<rect x="${CX - 30}" y="${yA - 12}" width="60" height="13" fill="#b08a3a"/><path d="M${CX - 30},${yA - 12} L${CX + 30},${yA - 12}" stroke="#e4c36a" stroke-width="1.4"/>`;
  s += `<g fill="#d6d0c4" opacity=".9">${[-24, -14, 14, 24].map((d) => `<circle cx="${CX + d}" cy="${yA - 14}" r="3.5"/><circle cx="${CX + d + 2}" cy="${yA - 17}" r="2.5" fill="#b5372d"/>`).join("")}</g>`;
  s += vela(CX - 27, yA - 12, 0.5) + vela(CX + 27, yA - 12, 0.5);
  s += santa(CX, yA - 12);
  s += `</g>`;
  // Dona Zefa, de preto, chorando atrás
  s += pessoa({ id: "zefa", x: CX - 98, y: yC + 18, h: 74, pose: "manto", cor: "#141214", cabeca: veu("#1c1a1c") + rosto("#8a6e5a") + `<path d="M-6,4 L6,4 L4,14 L-4,14 Z" fill="#e9e3d6"/>`,
    frente: fita("#2e5ea8") + vela(24, -96, 0.9) });
  // Irmão Lázaro, com a cruz nas costas
  s += pessoa({ id: "lazaro", x: CX + 100, y: yC + 22, h: 80, cor: "#2a2420", giro: 8,
    atras: `<g fill="#4a3624" transform="rotate(14 0 -120)"><rect x="-9" y="-290" width="18" height="300"/><rect x="-62" y="-230" width="124" height="16"/></g>`,
    cabeca: rosto("#6e5a48", `<path d="M-12,-8 Q0,-18 12,-8" stroke="#3a2a1a" stroke-width="3" fill="none"/>`), frente: fita("#3f8a55") });
  // Seu Damião, na frente, puxando a reza com o chapéu no peito
  s += pessoa({ id: "damiao", x: CX - 4, y: yC + 44, h: 84, cor: "#2e2a26",
    cabeca: rosto("#8a6e58", `<path d="M-12,-3 Q-14,3 -11,8 M12,-3 Q14,3 11,8" stroke="#d8d4cc" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M-8,8 Q0,18 8,8 Q0,22 -8,8 Z" fill="#d8d4cc"/>`),
    frente: fita("#c6c0b0") + `<ellipse cx="-4" cy="-128" rx="22" ry="6" fill="#5a4630"/><path d="M-14,-130 Q-14,-146 -4,-146 Q6,-146 6,-130 Z" fill="#5a4630"/>` + vela(30, -96, 0.9) });
  return s;
}

export const camInicial = { x: 2000, y: 1500, w: 2200, rot: 4, blur: 14, luz: 0.5, balanco: 1.1 };

export function mundo() {
  const r = rnd(5);
  const estrelas = [...Array(90)].map(() => `<circle cx="${(r() * 4400 - 200).toFixed(0)}" cy="${(r() * 900 - 600).toFixed(0)}" r="${(r() * 2.2 + 0.6).toFixed(1)}" fill="#d9dbe6" opacity="${(r() * 0.5 + 0.2).toFixed(2)}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block">
<defs>${defsHalo}
  <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070d"/><stop offset=".7" stop-color="#121826"/><stop offset="1" stop-color="#232a36"/></linearGradient>
  <linearGradient id="morro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1c20"/><stop offset="1" stop-color="#0c0c0e"/></linearGradient>
  <linearGradient id="pedra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4743"/><stop offset="1" stop-color="#2a2826"/></linearGradient>
  <linearGradient id="nevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a90a0" stop-opacity="0"/><stop offset=".5" stop-color="#8a90a0" stop-opacity=".22"/><stop offset="1" stop-color="#8a90a0" stop-opacity="0"/></linearGradient>
  <radialGradient id="brilhoTopo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffb35a" stop-opacity=".35"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient>
  <filter id="nuvem" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="30"/></filter>
</defs>
<rect x="-800" y="-1000" width="5800" height="3200" fill="url(#ceu)"/>
${estrelas}
<circle cx="3200" cy="-120" r="70" fill="#cfd2c8" opacity=".55"/><circle cx="3200" cy="-120" r="160" fill="#cfd2c8" opacity=".06"/>
<g filter="url(#nuvem)" fill="#0d1018" opacity=".9"><ellipse cx="900" cy="-200" rx="800" ry="120"/><ellipse cx="2900" cy="-40" rx="700" ry="90"/></g>
<!-- o morro e o pátio murado -->
<path d="M-800,2100 L-800,1500 Q600,1200 1300,900 Q1600,700 1720,660 L2280,660 Q2420,700 2700,900 Q3400,1250 4800,1500 L4800,2100 Z" fill="url(#morro)"/>
<g fill="#121214"><rect x="1880" y="560" width="240" height="70"/><polygon points="1860,565 2000,505 2140,565"/><rect x="1990" y="470" width="20" height="50"/><rect x="1976" y="482" width="48" height="8"/></g>
<path d="M1660,780 L1660,640 L2340,640 L2340,780 Z" fill="#1d1c1f"/>
<g fill="#29272a">${[...Array(18)].map((_, i) => `<rect x="${1660 + i * 38}" y="626" width="22" height="16"/>`).join("")}</g>
<g fill="#050506">${[1700, 1760, 1820, 1880, 2120, 2180, 2240, 2300].map((x) => `<rect x="${x}" y="676" width="5" height="34"/>`).join("")}</g>
<path id="portao" d="M1942,780 L1942,700 Q2000,664 2058,700 L2058,780 Z" fill="#050405"/>
<ellipse id="brilho-portao" cx="2000" cy="730" rx="140" ry="90" fill="url(#brilhoTopo)" style="opacity:0;transition:opacity 4s"/>
<rect x="-800" y="760" width="5600" height="170" fill="url(#nevoa)"/>
${escadaria()}
${[...Array(14)].map((_, i) => nicho(i)).join("")}
<g id="procissao" style="opacity:0;transform:translate(0px,-26px);transition:opacity 4s ease, transform 9s ease-out">${procissao()}</g>
<rect x="-800" y="1640" width="5600" height="300" fill="url(#nevoa)" opacity=".7"/>
<!-- o chão onde você está -->
<path d="M-800,2100 L-800,1960 Q1000,1930 2000,1960 Q3000,1930 4800,1960 L4800,2100 Z" fill="#0a0a0b"/>
</svg>`;
}

export async function roteiro(a) {
  const { animar, olhos: abre, piscar, diz, limpa, cartaz, escurece, espera, som, el, mundo } = a;
  const svg = mundo();
  const vento = som.vento(); vento.alvo(0.3, 2);
  const grilos = som.insetos(4600, 1.3, 30); grilos.alvo(0.5, 3);
  let canto = null;
  try {
    await espera(900);
    abre(1, 2400);
    await animar({ blur: 0, luz: 0.95, rot: 0 }, 2600);
    await diz("Uma escadaria de pedra sobe o morro até sumir na névoa.", { segura: 1400 });
    await animar({ x: 2000, y: 1200, w: 2600 }, 4200);
    await diz("Lá em cima, um muro comprido, com frestas no lugar das janelas.", { segura: 1400 });
    await limpa(300);

    // a primeira estação
    await animar({ x: 1440, y: 1840, w: 520 }, 3600);
    await diz("Ao lado do primeiro degrau, um nicho de azulejo. Um homem coroado de espinhos, sendo condenado.", { segura: 1600 });
    await diz("Embaixo dele, o toco de uma vela. Velas assim, nicho após nicho, até o topo.", { segura: 1400 });
    await limpa(300);

    // alguém lá em cima sabe que você chegou
    animar({ x: 2000, y: 1100, w: 2900 }, 3200);
    await espera(1400);
    som.sininho(0.4);
    await espera(1200);
    grilos.alvo(0.0001, 0.6);
    await diz("Um sininho, lá no alto. E então, silêncio. Até os grilos param.", { segura: 1800 });
    await limpa(300);

    // as velas acendem, morro acima
    await animar({ x: 1470, y: 1800, w: 900 }, 2000);
    el("#vela-0").style.opacity = "1"; som.pingo(0.08);
    await diz("A vela do primeiro nicho acende.", { segura: 600 });
    el("#vela-1").style.opacity = "1"; som.pingo(0.06);
    animar({ x: 2000, y: 1050, w: 2000 }, 9000);
    await diz("Depois a do segundo. A do terceiro. Subindo, uma por uma.", { segura: 400 });
    for (let i = 2; i < 14; i++) { el(`#vela-${i}`).style.opacity = "1"; if (i % 3 === 0) som.pingo(0.04); await espera(520); }
    await diz("Você não vê quem acende.", { segura: 1500 });
    await limpa(300);

    // o canto e a procissão
    canto = som.cantico([98, 146.8, 196, 233]); canto.alvo(0.35, 6);
    el("#brilho-portao").style.opacity = "1";
    await animar({ x: 2000, y: 760, w: 760 }, 4200);
    await diz("Um canto começa atrás do muro. Uma voz de velho puxa a reza, e outras poucas respondem.", { segura: 1200 });
    const p = el("#procissao"); p.style.opacity = "1"; p.style.transform = "translate(0px,10px)";
    canto.alvo(0.5, 5);
    await diz("Pelo portão saem cinco pessoas. Só cinco.", { segura: 1300 });
    await limpa(200);
    await animar({ x: 1996, y: 790, w: 300 }, 2600);
    await diz("Na frente, um velho de barba branca, com o chapéu no peito, puxando o canto.", { segura: 1300 });
    await animar({ x: 2000, y: 735, w: 300 }, 2200);
    await diz("Atrás dele, dois carregam um andor nos ombros: um rapaz com rojões na cintura e uma moça de mãos enfaixadas. O pano está vermelho.", { segura: 1400 });
    await animar({ x: 2090, y: 740, w: 300 }, 2200);
    await diz("Um homem magro arrasta uma cruz de madeira enorme nas costas.", { segura: 1200 });
    await animar({ x: 1910, y: 760, w: 300 }, 2200);
    await diz("E uma mulher toda de preto chora baixinho, sem parar.", { segura: 1300 });
    await limpa(300);

    // a santa
    await animar({ x: 2000, y: 680, w: 130, balanco: 0.5 }, 4800);
    await diz("Uma santa de manto azul, com uma coroa de raios.", { segura: 1300 });
    await animar({ x: 2000, y: 672, w: 84 }, 3200);
    await diz("Dos olhos dela descem dois riscos escuros, até o queixo.", { segura: 1600 });
    await diz("Estão secos.", { segura: 1800 });
    await limpa(300);

    // o canto para
    canto.alvo(0.0001, 0.25); vento.alvo(0.12, 1);
    await animar({ x: 2000, y: 760, w: 640, balanco: 1 }, 1600);
    svg.querySelectorAll("#procissao .olho-b").forEach((o) => (o.style.opacity = "1"));
    som.coracao(0.8);
    await diz("O canto para. Todos ao mesmo tempo.", { segura: 1200 });
    som.coracao(0.8);
    await diz("Os cinco ficam parados na escadaria. Só as chamas se mexem.", { segura: 1600 });
    await limpa(200);
    await diz("— Quem sobe o Calvário, sobe pagando promessa.", { segura: 1800, classe: "fala longe" });
    await diz("— Qual é a sua?", { segura: 2200, classe: "fala longe" });
    await limpa(400);

    // título
    som.sininho(0.3);
    canto.alvo(0.25, 3);
    vento.parar(4);
    await Promise.all([abre(0, 2600), escurece(1, 2600)]);
    canto.parar(4);
    await espera(700);
    som.impacto(0.8);
    await cartaz(`<div class="t-eq" style="--cor:#c9a24a">A ROMARIA</div><div class="t-lin"></div><div class="t-sub">Morro do Calvário</div>`, 6000);
  } finally {
    grilos.parar(1);
    if (canto) canto.parar(2);
  }
  void piscar;
}
