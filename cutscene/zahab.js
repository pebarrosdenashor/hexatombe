/* Primeiro encontro: Os Zahab, no Cartório, Biblioteca e Câmara.
   Noite. Luar pelas janelas altas. Cinco pessoas em cinco cantos da sala, cada uma com um livro,
   viram a página no mesmo instante, respiram juntas e levantam a cabeça juntas. */
import { pessoa, turbante, olhos, rnd } from "./kit.js?v=1.3.0";

const CHAO = 1500, OURO = "#d4a63c";

function estante(x0, x1, y0, y1, r) {
  let s = `<rect x="${x0 - 14}" y="${y0 - 20}" width="${x1 - x0 + 28}" height="${y1 - y0 + 20}" fill="#1c140f"/>`;
  for (let y = y0; y < y1 - 60; y += 150) {
    s += `<rect x="${x0}" y="${y + 132}" width="${x1 - x0}" height="12" fill="#2b1f16"/>`;
    for (let x = x0 + 4; x < x1 - 20;) {
      const w = 12 + r() * 16, h = 90 + r() * 38;
      if (r() < 0.07) { x += 30; continue; }
      const c = ["#3b2a20", "#4a3424", "#2f2a26", "#45352a", "#3a3a32", "#5a3e2a", "#2d2620"][Math.floor(r() * 7)];
      s += `<rect x="${x.toFixed(0)}" y="${(y + 132 - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${c}"/>`;
      if (r() < 0.4) s += `<rect x="${x.toFixed(0)}" y="${(y + 146 - h).toFixed(0)}" width="${w.toFixed(0)}" height="4" fill="#8a6a3a" opacity=".5"/>`;
      x += w + 1;
    }
  }
  return s;
}

/* livro aberto nas mãos; a folha que vira tem a lombada em x=0 */
const livro = (x, y, s = 1, giro = 0) => `<g transform="translate(${x},${y}) rotate(${giro}) scale(${s})">
  <path d="M0,0 L-22,-4 L-22,10 L0,14 Z" fill="#d9cfb6"/><path d="M0,0 L22,-4 L22,10 L0,14 Z" fill="#cfc4a8"/>
  <path d="M0,0 L0,14" stroke="#5a4a36" stroke-width="1"/>
  <g class="folha"><path d="M0,0 L21,-3.5 L21,10 L0,14 Z" fill="#e6dcc2" stroke="#b9ab8c" stroke-width=".5"/></g></g>`;

function zahabs() {
  const tb = (c = "#2d2620") => turbante(c, OURO) + `<rect x="-11" y="-6" width="22" height="9" fill="#6a5240"/>` + olhos(5, -2, "#f1c65a", 1.8);
  return `
  ${pessoa({ id: "z-voz", x: 2000, y: 1355, h: 240, pose: "sentado", cor: "#211b17", cabeca: tb("#3a2e25"),
    frente: livro(0, -84, 1.5) + `<path d="M-26,-150 Q0,-136 26,-150" stroke="${OURO}" stroke-width="3" fill="none"/>` })}
  ${pessoa({ id: "z-lanca", x: 1260, y: CHAO, h: 270, cor: "#1d1814", cabeca: tb(),
    atras: `<line x1="38" y1="10" x2="44" y2="-262" stroke="#4a3a2a" stroke-width="5"/><path d="M44,-262 L36,-300 L44,-318 L52,-300 Z" fill="#9a8f80"/>`,
    frente: livro(-20, -92, 1.2, -8) })}
  ${pessoa({ id: "z-escudo", x: 3100, y: CHAO, h: 280, cor: "#1f1915", cabeca: tb("#352a22"),
    atras: `<circle cx="0" cy="-120" r="54" fill="#3a2c1e" stroke="${OURO}" stroke-width="5"/><circle cx="0" cy="-120" r="10" fill="${OURO}"/><circle cx="0" cy="-120" r="36" fill="none" stroke="#5a4428" stroke-width="2"/>`,
    frente: livro(0, -94, 1.2) })}
  ${pessoa({ id: "z-arco", x: 3340, y: 652, h: 200, cor: "#1d1814", cabeca: tb(),
    atras: `<path d="M-30,-182 Q-62,-110 -30,-34" stroke="#5a4428" stroke-width="5" fill="none"/><line x1="-30" y1="-182" x2="-30" y2="-34" stroke="#bfb196" stroke-width="1"/>`,
    frente: livro(0, -92, 1.2) })}
  ${pessoa({ id: "z-correntes", x: 860, y: CHAO + 30, h: 230, pose: "agachado", cor: "#1d1814", cabeca: tb("#3a2e25"),
    frente: livro(0, -54, 1.4) + `<g stroke="${OURO}" stroke-width="3" fill="none"><path d="M-34,-96 Q-44,-70 -30,-50 Q-20,-70 -34,-96"/><path d="M34,-96 Q44,-70 30,-50 Q20,-70 34,-96"/><path d="M-30,-52 Q0,-30 30,-52"/><path d="M28,-50 Q60,-30 70,6 Q86,20 100,4"/></g>` })}`;
}

export const camInicial = { x: 2000, y: 900, w: 2200, rot: 0, blur: 10, luz: 0.25, balanco: 0.8 };

export function mundo() {
  const r = rnd(1889);
  const janela = (x) => `<path d="M${x - 110},900 L${x - 110},420 Q${x - 110},300 ${x},290 Q${x + 110},300 ${x + 110},420 L${x + 110},900 Z" fill="#26364a"/>
    <path d="M${x - 92},885 L${x - 92},425 Q${x - 92},318 ${x},310 Q${x + 92},318 ${x + 92},425 L${x + 92},885 Z" fill="url(#vidro)"/>
    <g stroke="#1a2230" stroke-width="7"><line x1="${x}" y1="310" x2="${x}" y2="885"/><line x1="${x - 92}" y1="560" x2="${x + 92}" y2="560"/><line x1="${x - 92}" y1="720" x2="${x + 92}" y2="720"/></g>
    <rect x="${x - 128}" y="896" width="256" height="18" fill="#2a2420"/>`;
  const feixe = (x) => `<polygon points="${x - 92},420 ${x + 92},420 ${x + 360},${CHAO} ${x - 10},${CHAO}" fill="url(#luar)"/>
    <polygon points="${x - 10},${CHAO} ${x + 360},${CHAO} ${x + 420},${CHAO + 60} ${x + 20},${CHAO + 60}" fill="#aab9cc" opacity=".08"/>`;
  const poeira = [...Array(46)].map(() => {
    const x = 1200 + r() * 2000, y = 450 + r() * 1000;
    return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1.2 + r() * 1.8).toFixed(1)}" fill="#dfe6f0" opacity="${(0.15 + r() * 0.35).toFixed(2)}"><animate attributeName="cy" values="${y.toFixed(0)};${(y + 40 + r() * 60).toFixed(0)};${y.toFixed(0)}" dur="${(14 + r() * 12).toFixed(0)}s" repeatCount="indefinite"/></circle>`;
  }).join("");
  const papeis = [...Array(26)].map(() => `<rect x="${(500 + r() * 3200).toFixed(0)}" y="${(CHAO + 20 + r() * 260).toFixed(0)}" width="${(30 + r() * 30).toFixed(0)}" height="${(20 + r() * 16).toFixed(0)}" fill="#bdb29a" opacity="${(0.25 + r() * 0.3).toFixed(2)}" transform="rotate(${(r() * 80 - 40).toFixed(0)} 0 0)" style="transform-box:fill-box;transform-origin:center"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block">
<defs>
  <linearGradient id="parede" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c0b0d"/><stop offset="1" stop-color="#1b1816"/></linearGradient>
  <linearGradient id="vidro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fb2c8"/><stop offset="1" stop-color="#5d7088"/></linearGradient>
  <linearGradient id="luar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9c8da" stop-opacity=".2"/><stop offset="1" stop-color="#b9c8da" stop-opacity=".05"/></linearGradient>
  <linearGradient id="piso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a211a"/><stop offset="1" stop-color="#0d0a08"/></linearGradient>
</defs>
<rect x="-600" y="-400" width="5200" height="2600" fill="url(#parede)"/>
<!-- caibros do sótão e as corujas -->
<g fill="#080708"><rect x="-600" y="0" width="5200" height="60"/>${[...Array(14)].map((_, i) => `<rect x="${-400 + i * 360}" y="0" width="40" height="190"/>`).join("")}</g>
<g id="corujas"><g transform="translate(1530,110)">${olhos(9, 0, "#e9d48a", 4)}</g><g transform="translate(2660,95)">${olhos(9, 0, "#e9d48a", 4)}</g><g transform="translate(3420,130)">${olhos(8, 0, "#e9d48a", 3.4)}</g></g>
${janela(1300)}${janela(2000)}${janela(2700)}
<rect x="-600" y="${CHAO}" width="5200" height="700" fill="url(#piso)"/>
<g stroke="#120d0a" stroke-width="3" opacity=".7">${[...Array(16)].map((_, i) => `<line x1="${-400 + i * 320}" y1="${CHAO}" x2="${-900 + i * 420}" y2="${CHAO + 700}"/>`).join("")}</g>
${estante(160, 1040, 260, CHAO, r)}${estante(3000, 3900, 760, CHAO, r)}
<!-- mezanino e escada -->
<rect x="2560" y="652" width="1500" height="26" fill="#2a1f17"/>
<g stroke="#2a1f17" stroke-width="6">${[...Array(18)].map((_, i) => `<line x1="${2580 + i * 80}" y1="652" x2="${2580 + i * 80}" y2="560"/>`).join("")}<line x1="2560" y1="560" x2="4060" y2="560" stroke-width="10"/></g>
${estante(3000, 3900, 230, 640, r)}
<path d="M2240,${CHAO} L2560,678 L2610,678 L2290,${CHAO} Z" fill="#251b14"/>
<g stroke="#120d0a" stroke-width="4">${[...Array(12)].map((_, i) => { const t = (i + 1) / 13; return `<line x1="${2240 + t * 320}" y1="${CHAO - t * 822}" x2="${2290 + t * 320}" y2="${CHAO - t * 822}"/>`; }).join("")}</g>
${feixe(1300)}${feixe(2000)}${feixe(2700)}
<!-- a mesa -->
<rect x="1560" y="1268" width="880" height="26" fill="#3a2a1e"/><rect x="1580" y="1294" width="24" height="206" fill="#2a1e15"/><rect x="2396" y="1294" width="24" height="206" fill="#2a1e15"/>
<g fill="#cfc4a8" opacity=".8"><rect x="1660" y="1256" width="70" height="12" transform="rotate(-6 1660 1256)"/><rect x="2210" y="1258" width="90" height="10"/><rect x="2240" y="1246" width="70" height="12" transform="rotate(4 2240 1246)"/></g>
<rect x="2330" y="1236" width="22" height="32" fill="#1a1a1e"/>
${zahabs()}
<rect x="1560" y="1268" width="880" height="10" fill="#4a3624" opacity=".0"/>
${poeira}
${papeis}
</svg>`;
}

const IDS = ["#z-voz", "#z-lanca", "#z-escudo", "#z-arco", "#z-correntes"];
const PANS = [0, -0.7, 0.6, 0.85, -0.85];

/* vira a folha do livro: escala de 1 a -1 em torno da lombada */
function vira(el, ms = 380) {
  const f = el.querySelector(".folha"); if (!f) return;
  const t0 = performance.now();
  const passo = (now) => {
    const t = Math.min(1, (now - t0) / ms);
    f.setAttribute("transform", `scale(${Math.cos(t * Math.PI).toFixed(3)},1)`);
    if (t < 1) requestAnimationFrame(passo); else f.setAttribute("transform", "scale(1,1)");
  };
  requestAnimationFrame(passo);
}

export async function roteiro(a) {
  const { animar, olhos: abre, diz, limpa, cartaz, escurece, espera, som, el, mundo } = a;
  const svg = mundo();
  const pessoas = IDS.map((i) => el(i));
  const todos = (fn) => pessoas.forEach((p, i) => fn(p, i));
  const viramJuntas = (ids = [0, 1, 2, 3, 4], vol = 0.16) => ids.forEach((i) => { vira(pessoas[i]); som.pagina(vol, PANS[i]); });
  const vento = som.vento(); vento.alvo(0.08, 2);
  try {
    // a porta
    await espera(600);
    som.rangido(2.2, 0.1, 150, 1300);
    abre(1, 2400);
    await animar({ blur: 0, luz: 0.9 }, 2600);
    await diz("A porta do Cartório está destrancada.", { segura: 1000 });
    await diz("Lá dentro, cheiro de papel molhado e mofo.", { segura: 1400 });
    await animar({ x: 700, y: 900, w: 1500 }, 4000);
    await diz("Estantes até o teto. Livros de registro, atas, certidões. A memória inteira de uma cidade.", { segura: 1400 });
    som.coruja(0.12, -0.4);
    await limpa(300);

    // alguém lendo
    await animar({ x: 2000, y: 1180, w: 900 }, 3800);
    await diz("Na mesa comprida, alguém lê à luz da lua.", { segura: 900 });
    vira(pessoas[0]); som.pagina(0.2, 0);
    await espera(1500);
    await limpa(300);
    await animar({ x: 1300, y: 1250, w: 1100 }, 3000);
    await diz("Perto da janela, outra pessoa, de pé, apoiada numa lança. Também lê.", { segura: 800 });
    viramJuntas([0, 1], 0.2);
    await espera(400);
    await diz("As duas viram a página no mesmo instante.", { segura: 1400 });
    await limpa(300);

    // os cinco
    await animar({ x: 2150, y: 1060, w: 3000 }, 4200);
    await diz("Um escudo redondo, perto da estante. Um arco, lá no mezanino. Correntes douradas nos braços de alguém sentado no chão.", { segura: 600 });
    viramJuntas();
    await espera(1300);
    await diz("Cinco pessoas, cinco livros diferentes.", { segura: 600 });
    viramJuntas();
    await espera(1000);
    await diz("E as cinco viram a página juntas.", { segura: 1400 });
    await limpa(300);
    PANS.forEach((p) => som.respiro(2.4, 0.07));
    await diz("Respiram juntas, também.", { segura: 1600 });
    await limpa(300);

    // levantam a cabeça
    await animar({ x: 2000, y: 1150, w: 1500 }, 2000);
    todos((p) => { p.querySelector(".olho-b").style.opacity = "1"; });
    pessoas.forEach((p) => { const c = p.querySelector(".cab"); c.style.transition = "transform 1s"; c.setAttribute("transform", c.getAttribute("transform") + " translate(0,-4)"); });
    som.coracao(1);
    await diz("E levantam a cabeça. Ao mesmo tempo.", { segura: 1200 });
    som.coracao(0.9);
    await limpa(200);
    await animar({ x: 2000, y: 1110, w: 700 }, 2200);
    PANS.forEach((p, i) => som.sussurro(2.6, 0.22, p, 41, 0.9 + i * 0.06));
    await diz("— Nós já lemos o seu nome.", { segura: 1600, classe: "fala" });
    await diz("A voz sai da boca de quem está na mesa. Mas você a ouve vir dos cinco lados da sala.", { segura: 1600 });
    await limpa(300);

    // as corujas
    som.gritoCoruja(0.4, 0.3); a.cam.tremor = 0.8; setTimeout(() => (a.cam.tremor = 0), 500);
    svg.querySelectorAll("#corujas .olho-b").forEach((o) => (o.style.opacity = "1"));
    await animar({ x: 2400, y: 300, w: 2600 }, 1600);
    await diz("No sótão, as corujas gritam.", { segura: 1200 });
    som.gritoCoruja(0.25, -0.5);
    await animar({ x: 2150, y: 1060, w: 3000 }, 2400);
    // voltam a ler
    pessoas.forEach((p) => { const c = p.querySelector(".cab"); c.setAttribute("transform", c.getAttribute("transform").replace(" translate(0,-4)", "")); p.querySelector(".olho-b").style.opacity = "0"; });
    viramJuntas();
    await diz("Quando você olha de novo, os cinco já voltaram a ler.", { segura: 2000 });
    await limpa(500);

    vento.parar(3);
    await Promise.all([abre(0, 2400), escurece(1, 2400)]);
    viramJuntas([0, 1, 2, 3, 4], 0.1);
    await espera(900);
    som.impacto(0.8);
    await cartaz(`<div class="t-eq" style="--cor:${OURO}">OS ZAHAB</div><div class="t-lin"></div><div class="t-sub">Cartório, Biblioteca e Câmara</div>`, 6000);
  } finally { /* nada contínuo além do vento */ }
}
