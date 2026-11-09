/* Primeiro encontro: A Romaria, no Morro do Calvário.
   Noite. Você está ao pé da escadaria das 14 estações; as velas acendem morro acima
   e a procissão sai do portão do pátio murado com o andor da santa. */
import { pessoa, vela, veu, defsHalo, olhos, rnd } from "./kit.js?v=1.1.0";

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
function romeiro(x, y, h, r, carrega = false) {
  const cores = ["#d8d1c2", "#bfb6a4", "#cfc5b1", "#9e9585"], fitas = ["#b5372d", "#2e5ea8", "#d4a63c", "#3f8a55", "#c6c0b0"];
  const cor = ["#2b2626", "#332c29", "#262224", "#3a302a"][Math.floor(r() * 4)];
  const fita = `<path d="M-10,-160 Q0,-150 10,-160 L6,-120 M-10,-160 L-12,-118" stroke="${fitas[Math.floor(r() * 5)]}" stroke-width="3" fill="none"/>`;
  const mao = carrega ? "" : vela(26, -94, 0.9);
  return pessoa({ x, y, h, cor, pose: "manto", cabeca: veu(cores[Math.floor(r() * 4)]) + `<ellipse cx="0" cy="2" rx="9" ry="11" fill="#6e5a48"/>` + olhos(4, 0, "#f3d79b", 1.4), frente: fita + mao, classe: "romeiro" });
}

function procissao() {
  const r = rnd(33);
  let s = "";
  // atrás: povo saindo do portão
  for (let i = 0; i < 7; i++) s += romeiro(CX - 60 + i * 20 + r() * 6, 708 + r() * 6, 46, r);
  // andor: quatro carregadores e a santa
  const yA = 752;
  s += `<g id="andor">`;
  s += romeiro(CX - 34, yA - 10, 54, r, true) + romeiro(CX + 34, yA - 10, 54, r, true);
  s += `<rect x="${CX - 62}" y="${yA - 50}" width="124" height="5" fill="#5a3a20"/><rect x="${CX - 66}" y="${yA - 46}" width="132" height="4" fill="#3e2716"/>`;
  s += `<rect x="${CX - 30}" y="${yA - 62}" width="60" height="13" fill="#b08a3a"/><path d="M${CX - 30},${yA - 62} L${CX + 30},${yA - 62}" stroke="#e4c36a" stroke-width="1.4"/>`;
  s += `<g fill="#d6d0c4" opacity=".9">${[-24, -14, 14, 24].map((d) => `<circle cx="${CX + d}" cy="${yA - 64}" r="3.5"/><circle cx="${CX + d + 2}" cy="${yA - 67}" r="2.5" fill="#b5372d"/>`).join("")}</g>`;
  // a santa
  s += `<g id="santa" transform="translate(${CX},${yA - 62})">
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
  s += romeiro(CX - 40, yA + 14, 64, r, true) + romeiro(CX + 40, yA + 14, 64, r, true);
  s += `</g>`;
  // frente: os que descem primeiro
  for (const [dx, dy, h] of [[-70, 30, 70], [-52, 46, 76], [56, 34, 72], [74, 50, 78], [-10, 62, 82], [16, 66, 84]]) s += romeiro(CX + dx, 760 + dy, h, r);
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
    canto = som.cantico(); canto.alvo(0.35, 6);
    el("#brilho-portao").style.opacity = "1";
    await animar({ x: 2000, y: 760, w: 760 }, 4200);
    await diz("Um canto começa atrás do muro. Muitas vozes, devagar, sem pressa nenhuma.", { segura: 1200 });
    const p = el("#procissao"); p.style.opacity = "1"; p.style.transform = "translate(0px,10px)";
    canto.alvo(0.6, 5);
    await diz("Pelo portão sai uma procissão. Gente descalça, de fita no pescoço e vela na mão.", { segura: 1600 });
    await diz("No meio deles, nos ombros de quatro homens, um andor.", { segura: 1400 });
    await limpa(300);

    // a santa
    await animar({ x: 2000, y: 650, w: 130, balanco: 0.5 }, 4800);
    await diz("Uma santa de manto azul, com uma coroa de raios.", { segura: 1300 });
    await animar({ x: 2000, y: 642, w: 84 }, 3200);
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
    await diz("Ninguém na escadaria se mexe. Só as chamas.", { segura: 1600 });
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
