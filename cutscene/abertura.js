/* Cutscene de abertura do Hexatombe: o despertar diante do Hotel Bela Vista.
   O mundo é um SVG de 4000×2000; a câmera anda por ele em primeira pessoa. */

function rnd(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }

function cidade() {
  const r = rnd(1974); let s = "";
  for (let row = 0; row < 7; row++) {
    const base = 1095 + row * 52, k = 0.42 + row * 0.12;
    let x = 1560 + r() * 60;
    while (x < 4350) {
      const w = (62 + r() * 58) * k, h = (42 + r() * 34) * k, rh = (20 + r() * 16) * k;
      if (!(x > 2830 && x < 3100 && row < 5)) {
        const tom = 58 + Math.floor(r() * 26), mur = `rgb(${tom + 18},${tom + 6},${tom - 8})`, tel = `rgb(${tom - 6},${tom - 14},${tom - 24})`;
        s += `<g>`;
        s += `<rect x="${x.toFixed(0)}" y="${(base - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${mur}"/>`;
        s += `<rect x="${x.toFixed(0)}" y="${(base - h * 0.62).toFixed(0)}" width="${w.toFixed(0)}" height="${(h * 0.08 + 1).toFixed(0)}" fill="#8a7a62" opacity=".45"/>`;
        s += `<polygon points="${(x - 3 * k).toFixed(0)},${(base - h).toFixed(0)} ${(x + w / 2).toFixed(0)},${(base - h - rh).toFixed(0)} ${(x + w + 3 * k).toFixed(0)},${(base - h).toFixed(0)}" fill="${tel}"/>`;
        if (r() < 0.6) s += `<polygon points="${(x + w * 0.2).toFixed(0)},${(base - h - rh * 0.3).toFixed(0)} ${(x + w / 2).toFixed(0)},${(base - h - rh * 0.85).toFixed(0)} ${(x + w * 0.62).toFixed(0)},${(base - h - rh * 0.35).toFixed(0)}" fill="#4f6136" opacity=".55"/>`;
        const nj = w > 70 * k ? 2 : 1;
        for (let j = 0; j < nj; j++) s += `<rect x="${(x + w * (0.2 + j * 0.42)).toFixed(0)}" y="${(base - h * 0.75).toFixed(0)}" width="${(w * 0.16).toFixed(0)}" height="${(h * 0.32).toFixed(0)}" fill="#1a1612"/>`;
        s += `<rect x="${(x + w * 0.5 - w * 0.08).toFixed(0)}" y="${(base - h * 0.42).toFixed(0)}" width="${(w * 0.16).toFixed(0)}" height="${(h * 0.42).toFixed(0)}" fill="#14110d"/>`;
        s += `</g>`;
      }
      x += w + (6 + r() * 40) * k;
    }
  }
  return s;
}

function hotel() {
  let s = "";
  const X0 = 380, X1 = 1420;
  s += `<rect x="${X0 - 18}" y="585" width="${X1 - X0 + 36}" height="34" fill="#c99d97"/>`;
  s += `<rect x="${X0}" y="618" width="${X1 - X0}" height="882" fill="url(#rosa)"/>`;
  for (const y of [940, 1220]) s += `<rect x="${X0 - 6}" y="${y - 6}" width="${X1 - X0 + 12}" height="14" fill="#cfa39d"/>`;
  for (let f = 0; f < 3; f++) {
    const y = 680 + f * 280;
    for (let i = 0; i < 6; i++) {
      const x = 440 + i * 165;
      if (f === 2 && i >= 2 && i <= 4) continue;
      s += `<rect x="${x}" y="${y}" width="92" height="160" fill="url(#vidro)" stroke="#b78c86" stroke-width="6"/>`;
      s += `<line x1="${x + 46}" y1="${y}" x2="${x + 46}" y2="${y + 160}" stroke="#b78c86" stroke-width="4"/>`;
      if (f < 2) {
        s += `<rect x="${x - 22}" y="${y + 160}" width="136" height="10" fill="#2c2a2a"/>`;
        s += `<rect x="${x - 22}" y="${y + 160}" width="136" height="60" fill="url(#grade)"/>`;
        s += `<rect x="${x - 22}" y="${y + 214}" width="136" height="6" fill="#2c2a2a"/>`;
      }
    }
  }
  // porta de vidro e marquise
  s += `<rect x="760" y="1235" width="280" height="22" fill="#b98f89"/>`;
  s += `<rect x="830" y="1262" width="140" height="238" fill="url(#vidro)" stroke="#8f6d68" stroke-width="7"/>`;
  s += `<line x1="900" y1="1262" x2="900" y2="1500" stroke="#8f6d68" stroke-width="5"/>`;
  s += `<rect x="780" y="1500" width="240" height="18" fill="#9a908a"/><rect x="760" y="1518" width="280" height="18" fill="#8d837d"/>`;
  // placa de bronze coberta por um pano
  s += `<g id="placa"><rect x="995" y="1290" width="120" height="78" rx="3" fill="#7a5a2c" stroke="#5a4020" stroke-width="3"/>
    <text x="1055" y="1318" font-size="11" fill="#e0c088" text-anchor="middle" font-family="Georgia,serif" letter-spacing="1">INAUGURAÇÃO</text>
    <text x="1055" y="1352" font-size="19" fill="#f0d39a" text-anchor="middle" font-family="Georgia,serif">4·V·1974</text>
    <g id="pano" style="transform-origin:995px 1288px;transition:transform 2.4s cubic-bezier(.3,.7,.2,1)">
      <path d="M990,1284 L1121,1284 Q1124,1330 1118,1376 Q1060,1384 992,1374 Q986,1330 990,1284 Z" fill="#d9d2c3" stroke="#a69c8a" stroke-width="2"/>
      <path d="M1010,1290 Q1016,1330 1008,1372 M1050,1288 Q1046,1330 1054,1378 M1092,1290 Q1098,1330 1090,1374" stroke="#b5ab98" stroke-width="2" fill="none"/>
    </g></g>`;
  // letreiro de lâmpadas apagadas
  s += `<g id="letreiro">
    <line x1="560" y1="590" x2="560" y2="430" stroke="#2c2a2a" stroke-width="10"/><line x1="1240" y1="590" x2="1240" y2="430" stroke="#2c2a2a" stroke-width="10"/>
    <line x1="470" y1="468" x2="1330" y2="468" stroke="#2c2a2a" stroke-width="6"/><line x1="470" y1="575" x2="1330" y2="575" stroke="#2c2a2a" stroke-width="6"/>
    <text x="900" y="558" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-weight="700" font-size="92" letter-spacing="6"
      fill="none" stroke="#7d7268" stroke-width="9" stroke-linecap="round" stroke-dasharray="0 17">HOTEL BELA VISTA</text>
    <text x="900" y="558" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-weight="700" font-size="92" letter-spacing="6"
      fill="none" stroke="#3e3934" stroke-width="2" opacity=".6">HOTEL BELA VISTA</text></g>`;
  return s;
}

export const camInicial = { x: 900, y: 240, w: 1500, rot: -14, blur: 24, luz: 0.45, balanco: 1.6 };

export function mundo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block">
<defs>
  <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0e1316"/><stop offset=".55" stop-color="#3a423f"/><stop offset="1" stop-color="#7b7d6e"/></linearGradient>
  <linearGradient id="agua" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#4c6a63"/><stop offset=".05" stop-color="#26403d"/><stop offset=".6" stop-color="#132a29"/><stop offset="1" stop-color="#0b1a1a"/></linearGradient>
  <pattern id="veios" width="90" height="400" patternUnits="userSpaceOnUse">
    <rect width="90" height="400" fill="none"/>
    <path d="M10,0 Q16,200 8,400 M48,0 Q40,180 52,400 M75,0 Q80,220 72,400" stroke="#6f9089" stroke-width="2" fill="none" opacity=".18"/>
    <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="0 -400" dur="38s" repeatCount="indefinite"/></pattern>
  <linearGradient id="vale" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4c3b"/><stop offset="1" stop-color="#3a2e23"/></linearGradient>
  <linearGradient id="nevoa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa093" stop-opacity="0"/><stop offset=".5" stop-color="#9aa093" stop-opacity=".45"/><stop offset="1" stop-color="#9aa093" stop-opacity="0"/></linearGradient>
  <linearGradient id="rosa" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9a7a1"/><stop offset=".5" stop-color="#e8bdb6"/><stop offset="1" stop-color="#cf9b95"/></linearGradient>
  <linearGradient id="vidro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b4547"/><stop offset=".45" stop-color="#151a1c"/><stop offset=".5" stop-color="#2a3335"/><stop offset="1" stop-color="#0f1213"/></linearGradient>
  <pattern id="grade" width="17" height="60" patternUnits="userSpaceOnUse"><rect x="7" width="3" height="60" fill="#2c2a2a"/></pattern>
  <linearGradient id="concreto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#77786f"/><stop offset="1" stop-color="#4c4d46"/></linearGradient>
  <linearGradient id="rocha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b5248"/><stop offset="1" stop-color="#2e2924"/></linearGradient>
  <linearGradient id="barro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4d3d2d"/><stop offset="1" stop-color="#211a13"/></linearGradient>
  <radialGradient id="poca" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#8d9286" stop-opacity=".55"/><stop offset="1" stop-color="#5d625a" stop-opacity="0"/></radialGradient>
  <filter id="nuvem" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="40"/></filter>
  <filter id="suave"><feGaussianBlur stdDeviation="3"/></filter>
</defs>

<rect x="-600" y="-900" width="5600" height="2100" fill="url(#ceu)"/>
<circle cx="2620" cy="360" r="90" fill="#d8d6c4" opacity=".18" filter="url(#suave)"/>
<g filter="url(#nuvem)" fill="#262d2d" opacity=".85">
  <ellipse cx="300" cy="80" rx="700" ry="140"/><ellipse cx="1500" cy="-60" rx="900" ry="200"/><ellipse cx="2900" cy="120" rx="800" ry="120"/><ellipse cx="4000" cy="40" rx="700" ry="160"/>
  <ellipse cx="2300" cy="300" rx="500" ry="60" fill="#3a4240"/></g>

<!-- a muralha d'água -->
<g id="muralha">
  <path d="M1480,1090 L1480,330 Q1700,300 1950,285 T2500,262 T3100,248 T3700,240 T4400,236 L4400,1090 Z" fill="url(#agua)"/>
  <path d="M1480,1090 L1480,330 Q1700,300 1950,285 T2500,262 T3100,248 T3700,240 T4400,236 L4400,1090 Z" fill="url(#veios)"/>
  <g fill="#050d0d" opacity=".32">
    <g transform="translate(2280,560) rotate(-24)"><rect x="-80" y="-26" width="160" height="44" rx="14"/><rect x="-50" y="-52" width="92" height="34" rx="10"/><circle cx="-48" cy="20" r="18"/><circle cx="50" cy="20" r="18"/></g>
    <g transform="translate(3420,470) rotate(160)" stroke="#050d0d" stroke-width="12" fill="none"><path d="M0,0 L0,190 M0,60 L-60,10 M0,90 L55,30 M0,130 L-40,100 M-60,10 L-85,-20 M55,30 L80,0"/></g>
    <g transform="translate(2750,720) rotate(8)"><path d="M-70,0 Q-20,-40 70,-6 L90,-26 L88,20 L70,6 Q-20,40 -70,0Z"/></g>
    <g transform="translate(3950,640) rotate(-80)"><rect x="-14" y="-90" width="28" height="180"/><rect x="-60" y="-50" width="120" height="16"/></g>
    <ellipse cx="2050" cy="800" rx="26" ry="9"/><ellipse cx="2120" cy="760" rx="20" ry="7"/><ellipse cx="3150" cy="850" rx="24" ry="8"/><ellipse cx="3700" cy="900" rx="30" ry="10"/></g>
  <path d="M1480,333 Q1700,303 1950,288 T2500,265 T3100,251 T3700,243 T4400,239" stroke="#a9c2b8" stroke-width="5" fill="none" opacity=".35"/>
</g>

<!-- o vale e a cidade -->
<rect x="1480" y="1040" width="3000" height="700" fill="url(#vale)"/>
<path d="M1500,1060 Q2000,1050 2600,1062 T4400,1056" stroke="#8a907f" stroke-width="10" fill="none" opacity=".35"/>
<g stroke="#6e604c" stroke-width="16" fill="none" opacity=".55"><path d="M1700,1440 Q2300,1300 2950,1240"/><path d="M4200,1420 Q3600,1310 3000,1240"/><path d="M2950,1250 L2960,1480"/></g>
<g id="cidade">${cidade()}</g>

<!-- a árvore com o barco -->
<g transform="translate(2380,1330)">
  <path d="M0,0 L-6,-170 M-4,-110 L-70,-190 M-6,-150 L40,-230 M-50,-165 L-90,-200 M30,-215 L70,-240 M-4,-80 L46,-130" stroke="#2a221a" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M-80,-205 Q-20,-180 52,-226 L60,-240 Q-10,-208 -86,-222 Z" fill="#6a5644" stroke="#3a2e22" stroke-width="3"/></g>

<!-- a Matriz -->
<g id="matriz">
  <rect x="2860" y="1110" width="190" height="140" fill="#8e8371"/>
  <polygon points="2850,1112 2955,1050 3060,1112" fill="#7a6f5e"/>
  <rect x="2860" y="1180" width="190" height="8" fill="#a39780" opacity=".5"/>
  <path d="M2930,1250 L2930,1195 Q2955,1170 2980,1195 L2980,1250 Z" fill="#1a1612"/>
  <rect x="2918" y="850" width="74" height="210" fill="#958a77"/>
  <polygon points="2910,852 2955,770 3000,852" fill="#6d6352"/>
  <path d="M2934,910 L2934,880 Q2955,862 2976,880 L2976,910 Z" fill="#14110d"/>
  <g id="sino" style="transform-origin:2955px 878px"><path d="M2946,882 Q2944,900 2940,904 L2970,904 Q2966,900 2964,882 Q2955,874 2946,882Z" fill="#6b5a3a"/></g>
  <g transform="rotate(14 2955 770)" stroke="#3b342b" stroke-width="5"><line x1="2955" y1="770" x2="2955" y2="725"/><line x1="2940" y1="740" x2="2970" y2="740"/></g>
  <rect x="2918" y="985" width="74" height="7" fill="#a39780" opacity=".55"/>
</g>
<rect x="1480" y="990" width="3000" height="190" fill="url(#nevoa)"/>

<!-- a barragem, colada ao hotel -->
<polygon points="-600,330 1720,330 1760,1500 -600,1500" fill="url(#concreto)"/>
<g stroke="#3f403a" stroke-width="3" opacity=".5">${Array.from({ length: 12 }, (_, i) => `<line x1="${-500 + i * 200}" y1="335" x2="${-490 + i * 202}" y2="1500"/>`).join("")}</g>
<rect x="-600" y="318" width="2330" height="20" fill="#86877d"/>
<path d="M1700,338 Q1690,800 1740,1500" stroke="#2a2b26" stroke-width="16" fill="none" opacity=".4"/>
<g fill="#3e4d34" opacity=".35"><ellipse cx="200" cy="420" rx="90" ry="20"/><ellipse cx="1500" cy="470" rx="110" ry="16"/></g>

<g id="hotel">${hotel()}</g>

<!-- a Pedra do Mirante e o barro onde você acorda -->
<polygon points="-600,1500 1660,1500 1760,1600 1950,2100 -600,2100" fill="url(#rocha)"/>
<rect x="-600" y="1530" width="2400" height="600" fill="url(#barro)" opacity=".85"/>
<polygon points="1760,1600 4500,1620 4500,2100 1950,2100" fill="#2a2119"/>
<ellipse cx="420" cy="1640" rx="260" ry="34" fill="url(#poca)"/><ellipse cx="1350" cy="1700" rx="200" ry="26" fill="url(#poca)"/><ellipse cx="2400" cy="1820" rx="330" ry="40" fill="url(#poca)"/>
<g id="corpo" fill="#17120e"><path d="M180,1760 Q260,1712 420,1722 Q520,1716 600,1742 Q640,1770 560,1790 Q420,1806 260,1800 Q170,1795 180,1760Z"/><ellipse cx="640" cy="1738" rx="44" ry="32"/><path d="M600,1760 Q680,1800 760,1790" stroke="#17120e" stroke-width="22" fill="none" stroke-linecap="round"/></g>
<g fill="#5f6b63" opacity=".8"><path d="M1120,1650 q30,-14 60,0 q-30,12 -60,0z M1180,1650 l16,-10 l0,20z"/><path d="M2900,1760 q40,-18 80,0 q-40,16 -80,0z M2980,1760 l20,-12 l0,24z"/></g>
<path d="M1500,1600 Q1520,1580 1560,1590 L1580,1620 Q1540,1630 1500,1620Z" fill="#2c2620"/>
</svg>`;
}

export async function roteiro(a) {
  const { animar, olhos, piscar, diz, limpa, cartaz, escurece, espera, som, el } = a;
  const zumbido = som.zumbido(), vento = som.vento();
  let gotas = setInterval(() => som.pingo(0.08 + Math.random() * 0.1), 1700);
  try {
    // escuro: só o corpo
    zumbido.alvo(0.05, 3);
    await espera(1800);
    som.coracao(0.9); await espera(1100); som.coracao(0.9);
    await diz("Frio.", { segura: 1600 });
    som.coracao(0.8);
    await diz("Um zumbido fino, dentro da cabeça, que não vai embora.", { segura: 1800 });
    som.respiro(2.6, 0.3);
    await diz("Gosto de terra na boca.", { segura: 1600 });
    await limpa();

    // primeira tentativa de abrir os olhos
    vento.alvo(0.25, 2);
    olhos(0.3, 1400); animar({ luz: 0.6 }, 1400);
    await diz("Você abre os olhos. O céu é da cor de água parada.", { segura: 1200 });
    await olhos(0, 900); som.coracao(1);
    await diz("Não lembra de ter dormido. Não lembra de ter chegado.", { segura: 1600 });
    await limpa(400);

    // acordar de verdade: o hotel entra em foco
    zumbido.parar(6); vento.alvo(0.5, 4); som.respiro(3, 0.35);
    olhos(1, 2200);
    await animar({ blur: 9, luz: 0.85 }, 2400);
    animar({ x: 900, y: 990, w: 2000, rot: -3, blur: 0, luz: 1, balanco: 1 }, 6500);
    await diz("Barro. Você está deitado no barro, e ele ainda está molhado.", { segura: 1600 });
    await diz("À sua frente, um prédio cor-de-rosa. Três andares. Varandas de ferro viradas para o vale.", { segura: 1600 });
    await animar({ rot: 0 }, 400);

    await animar({ x: 900, y: 520, w: 1150 }, 3200);
    som.rangido(1.6, 0.08);
    await diz("No alto, um letreiro de lâmpadas apagadas: HOTEL BELA VISTA.", { segura: 1600 });
    await animar({ x: 900, y: 1000, w: 1900 }, 3000);
    await diz("O prédio está limpo. Limpo demais. Nenhuma marca de lama nas paredes, como se a água tivesse desviado dele.", { segura: 1800 });
    await diz("Ninguém nunca entrou ali.", { segura: 1500 });
    await limpa(300);

    // a placa coberta
    await animar({ x: 1050, y: 1325, w: 560 }, 3200);
    vento.alvo(0.85, 0.8); som.rangido(1.2, 0.05);
    el("#pano").style.transform = "skewX(-14deg) scaleY(.32) rotate(-3deg)";
    await diz("Ao lado da porta, uma placa coberta por um pano. Uma rajada levanta a ponta: 1974.", { segura: 1400 });
    vento.alvo(0.5, 2);
    el("#pano").style.transform = "scaleY(.8) rotate(-2deg)";
    await espera(900); await limpa(300);

    // virar a cabeça: a cidade
    animar({ x: 1500, y: 1150, w: 2100 }, 2200);
    await espera(1300); await piscar(240);
    await animar({ x: 2880, y: 1180, w: 2300 }, 3800);
    await diz("Você vira a cabeça. Lá embaixo, uma cidade inteira.", { segura: 1500 });
    animar({ x: 2620, y: 1200, w: 1700 }, 9000, (t) => t);
    await diz("Telhados cobertos de limo. Ruas de lama. Um barco preso no alto de uma árvore seca.", { segura: 1500 });
    await diz("Em todas as paredes, a marca de onde a água chegou. Mais alta que uma pessoa.", { segura: 1600 });
    await limpa(300);

    // a muralha
    const ronco = som.muralha(); ronco.alvo(0.6, 4);
    await animar({ x: 2850, y: 720, w: 2750 }, 5200);
    await diz("E, cercando tudo, a água.", { segura: 1700 });
    animar({ tremor: 1.2 }, 2000);
    await diz("Ela não secou. Ela recuou, e ficou de pé, como uma muralha. Parada. Olhando para a cidade.", { segura: 2400 });
    await animar({ tremor: 0 }, 1500);
    ronco.alvo(0.25, 3);
    await limpa(400);

    // os outros acordam
    animar({ x: 820, y: 1560, w: 1700 }, 3500);
    await espera(1600);
    som.tosse(0.25);
    await diz("Perto de você, alguém tosse.", { segura: 1200 });
    await espera(400); som.tosse(0.18);
    await diz("Outro corpo se mexe no barro. Depois outro. Rostos que você conhece.", { segura: 1800 });
    await limpa(400);

    // os sinos
    clearInterval(gotas); gotas = null;
    vento.alvo(0.2, 3); ronco.alvo(0.1, 3);
    await animar({ x: 2955, y: 980, w: 1250 }, 4200);
    await espera(600);
    await diz("Então, da torre da igreja, um sino.", { segura: 400 });
    for (let i = 0; i < 6; i++) {
      som.sino(0.75);
      el("#sino").style.transition = "transform 1.4s ease-in-out";
      el("#sino").style.transform = `rotate(${i % 2 ? 22 : -22}deg)`;
      a.cam.tremor = 0.6; setTimeout(() => (a.cam.tremor = 0), 400);
      await espera(2700);
    }
    el("#sino").style.transform = "rotate(0)";
    await diz("Seis badaladas. Seis grupos. Seis dias.", { segura: 2200, classe: "forte" });
    await limpa(600);

    // título
    vento.parar(4); ronco.parar(5);
    await Promise.all([olhos(0, 2600), escurece(1, 2600)]);
    await espera(800);
    som.impacto(0.9);
    await cartaz(`<div class="t-hex">HEXATOMBE</div><div class="t-sub">Bom Jesus do Açude</div><div class="t-dia">Dia 1 · A água recua</div>`, 6000);
  } finally {
    if (gotas) clearInterval(gotas);
  }
}
