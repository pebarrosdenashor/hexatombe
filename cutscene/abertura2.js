/* Abertura do Hexatombe, versão pintada: o mesmo despertar diante do Hotel Bela Vista,
   agora em canvas, com textura, névoa, água viva e profundidade.
   As camadas são pintadas uma vez (montar) e compostas a cada quadro (quadro). */

const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sm = (a, b, v) => { v = clamp((v - a) / (b - a)); return v * v * (3 - 2 * v); };
const rnd = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const mix = (c, d, t) => [c[0] + (d[0] - c[0]) * t, c[1] + (d[1] - c[1]) * t, c[2] + (d[2] - c[2]) * t];
const css = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const NEVOA = [138, 146, 134];

/* ---------- ruído e texturas ---------- */
function ruido(n, per, oct, seed, gain = 0.5) {
  const r = rnd(seed), out = new Float32Array(n * n); let amp = 1, tot = 0;
  for (let o = 0; o < oct && per <= n; o++, per *= 2, amp *= gain) {
    const g = new Float32Array(per * per); for (let i = 0; i < g.length; i++) g[i] = r();
    const k = per / n;
    for (let y = 0; y < n; y++) {
      const fy = y * k, iy = fy | 0, ty = fy - iy, sy = ty * ty * (3 - 2 * ty), y0 = (iy % per) * per, y1 = ((iy + 1) % per) * per;
      for (let x = 0; x < n; x++) {
        const fx = x * k, ix = fx | 0, tx = fx - ix, sx = tx * tx * (3 - 2 * tx), x0 = ix % per, x1 = (ix + 1) % per;
        const a = g[y0 + x0], b = g[y0 + x1], c = g[y1 + x0], d = g[y1 + x1];
        out[y * n + x] += amp * (a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy);
      }
    }
    tot += amp;
  }
  let mn = 9, mx = -9; for (let i = 0; i < out.length; i++) { out[i] /= tot; if (out[i] < mn) mn = out[i]; if (out[i] > mx) mx = out[i]; }
  for (let i = 0; i < out.length; i++) out[i] = (out[i] - mn) / (mx - mn);
  return out;
}
function tela(w, h) { const c = document.createElement("canvas"); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }
function tex(n, campo, fn) {
  const c = tela(n, n), g = c.getContext("2d"), im = g.createImageData(n, n), d = im.data;
  for (let i = 0, j = 0; i < campo.length; i++, j += 4) fn(campo[i], d, j, i);
  g.putImageData(im, 0, 0); return c;
}
const texA = (n, campo, cor, fa) => tex(n, campo, (v, d, j) => { d[j] = cor[0]; d[j + 1] = cor[1]; d[j + 2] = cor[2]; d[j + 3] = 255 * clamp(fa(v)); });

/* preenche um retângulo com um padrão esticado e deslocado */
function padrao(g, pat, x, y, w, h, sx = 1, sy = 1, dx = 0, dy = 0, alfa = 1, modo = "source-atop") {
  g.save(); g.globalCompositeOperation = modo; g.globalAlpha = alfa;
  g.translate(dx, dy); g.scale(sx, sy); g.fillStyle = pat;
  g.fillRect((x - dx) / sx, (y - dy) / sy, w / sx, h / sy); g.restore();
}
function poly(g, p, fill) { g.beginPath(); g.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) g.lineTo(p[i], p[i + 1]); g.closePath(); if (fill !== false) g.fill(); }
function grad(g, x0, y0, x1, y1, ...stops) { const lg = g.createLinearGradient(x0, y0, x1, y1); for (let i = 0; i < stops.length; i += 2) lg.addColorStop(stops[i], stops[i + 1]); return lg; }
function rgrad(g, x, y, r, ...stops) { const lg = g.createRadialGradient(x, y, 0, x, y, r); for (let i = 0; i < stops.length; i += 2) lg.addColorStop(stops[i], stops[i + 1]); return lg; }
/* desenha algo desfocado: pinta em baixa resolução e amplia */
function suave(g, x, y, w, h, fator, fn) {
  const c = tela(w / fator, h / fator), k = c.getContext("2d");
  k.scale(1 / fator, 1 / fator); k.translate(-x, -y); fn(k);
  g.save(); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high"; g.drawImage(c, x, y, w, h); g.restore();
}

/* ---------- estado da cena ---------- */
let Q = 1, cv, ctx, caixa, L = {}, T = {}, P = {};
const E = { pano: 0, sino: 0, ergue: 0 };
const ondas = [];
let redu = 1, qn = 0, qsoma = 0, qant = 0; // se o computador não der conta, a cena baixa a própria resolução
function tw(chave, alvo, ms, curva = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)) {
  const ini = E[chave], t0 = performance.now();
  return new Promise((ok) => { const p = (now) => { const t = Math.min(1, (now - t0) / ms); E[chave] = lerp(ini, alvo, curva(t)); if (t < 1) requestAnimationFrame(p); else ok(); }; requestAnimationFrame(p); });
}
function camada(x0, y0, x1, y1, dens, pinta, ax = 0, p = 0) {
  dens *= Q; const c = tela((x1 - x0) * dens, (y1 - y0) * dens), g = c.getContext("2d");
  g.scale(c.width / (x1 - x0), c.height / (y1 - y0)); g.translate(-x0, -y0); g.lineCap = "round"; g.lineJoin = "round";
  pinta(g); return { c, x0, y0, w: x1 - x0, h: y1 - y0, ax, p };
}

/* topo da muralha d'água */
const TOPO = [[1380, 338], [1480, 330], [1950, 286], [2500, 262], [3100, 248], [3700, 240], [4400, 236], [4900, 234]];
function topoY(x) { for (let i = 1; i < TOPO.length; i++) if (x <= TOPO[i][0]) { const a = TOPO[i - 1], b = TOPO[i], t = sm(a[0], b[0], x); return lerp(a[1], b[1], t * 0.5 + 0.5 * (x - a[0]) / (b[0] - a[0])); } return 234; }
function caminhoMuralha(alvo) {
  alvo.moveTo(1380, 1120); for (let x = 1380; x <= 4900; x += 40) alvo.lineTo(x, topoY(x) + Math.sin(x * 0.013) * 2.5); alvo.lineTo(4900, 1120); alvo.closePath();
}

/* ---------- pinturas ---------- */
function pintaCeu(g) {
  g.fillStyle = grad(g, 0, -900, 0, 1150, 0, "#090d10", 0.3, "#1b2224", 0.55, "#444d4a", 0.78, "#7f867a", 1, "#959886");
  g.fillRect(-900, -900, 6000, 2100);
  g.fillStyle = rgrad(g, 2380, 110, 1100, 0, "rgba(232,228,204,.5)", 0.12, "rgba(214,212,190,.32)", 0.45, "rgba(170,174,158,.12)", 1, "rgba(150,156,140,0)");
  g.fillRect(-900, -900, 6000, 2100);
  g.fillStyle = rgrad(g, 2380, 110, 70, 0, "rgba(246,243,226,.55)", 1, "rgba(246,243,226,0)"); g.fillRect(2200, -80, 360, 360);
}

function pintaMuralha(g) {
  const cam = new Path2D(); caminhoMuralha(cam);
  g.save(); g.clip(cam);
  g.fillStyle = grad(g, 0, 236, 0, 1120, 0, "#8fa9a0", 0.03, "#68877f", 0.1, "#3f5f5a", 0.3, "#27443f", 0.62, "#172f2d", 1, "#0d1e1e");
  g.fillRect(1300, 200, 3700, 950);
  // luz que desce da superfície
  const r = rnd(77);
  for (let i = 0; i < 26; i++) {
    const x = 1500 + r() * 3200, w = 30 + r() * 150, y = topoY(x), c = 300 + r() * 420;
    g.fillStyle = grad(g, 0, y, 0, y + c, 0, `rgba(190,220,208,${0.025 + r() * 0.05})`, 1, "rgba(190,220,208,0)");
    poly(g, [x, y, x + w, y, x + w - 90 - r() * 60, y + c, x - 90 - r() * 60, y + c]);
  }
  padrao(g, T.sombra, 1300, 200, 3700, 950, 5, 3.4, 0, 0, 0.55);
  padrao(g, T.luz, 1300, 200, 3700, 950, 1.1, 9, 0, 0, 0.07);
  padrao(g, T.sombra2, 1300, 200, 3700, 950, 1, 10, 130, 0, 0.16);
  // o que ficou suspenso dentro da água
  suave(g, 1500, 300, 3200, 800, 9, (k) => {
    k.lineCap = "round";
    const sil = (x, y, rot, a, fn) => { k.save(); k.translate(x, y); k.rotate(rot); k.globalAlpha = a; k.fillStyle = k.strokeStyle = "#040c0c"; fn(); k.restore(); };
    sil(2280, 560, -0.42, 0.42, () => { // carro
      k.beginPath(); k.roundRect(-84, -22, 168, 40, 14); k.fill(); k.beginPath(); k.moveTo(-52, -22); k.quadraticCurveTo(-36, -58, 0, -58); k.quadraticCurveTo(40, -56, 56, -22); k.fill();
      k.beginPath(); k.arc(-50, 20, 19, 0, TAU); k.arc(52, 20, 19, 0, TAU); k.fill();
    });
    sil(3420, 470, 2.8, 0.34, () => { k.lineWidth = 13; k.beginPath(); k.moveTo(0, 0); k.lineTo(0, 200); k.moveTo(0, 60); k.lineTo(-62, 8); k.lineTo(-88, -24); k.moveTo(0, 95); k.lineTo(56, 30); k.lineTo(84, -2); k.moveTo(0, 135); k.lineTo(-42, 100); k.stroke(); });
    sil(2760, 730, 0.14, 0.45, () => { k.beginPath(); k.moveTo(-78, 0); k.quadraticCurveTo(-20, 34, 74, 6); k.lineTo(86, -14); k.quadraticCurveTo(0, 8, -86, -12); k.closePath(); k.fill(); });
    sil(3950, 640, -1.4, 0.42, () => { k.fillRect(-10, -100, 20, 200); k.fillRect(-64, -62, 128, 13); });
    sil(1900, 640, 0.5, 0.35, () => { k.fillRect(-34, -70, 68, 140); });
    sil(3120, 600, 0.9, 0.3, () => { k.beginPath(); k.moveTo(-60, 20); k.lineTo(0, -34); k.lineTo(60, 20); k.closePath(); k.fill(); k.fillRect(-46, 20, 92, 52); });
    sil(4240, 460, 0.3, 0.3, () => { k.beginPath(); k.ellipse(0, 0, 60, 26, 0, 0, TAU); k.fill(); k.fillRect(30, -8, 60, 12); k.fillRect(-50, 10, 9, 50); k.fillRect(26, 10, 9, 50); });
    const q = rnd(31); for (let i = 0; i < 70; i++) sil(1560 + q() * 3000, 420 + q() * 560, q() * 3, 0.18 + q() * 0.3, () => { k.beginPath(); k.ellipse(0, 0, 6 + q() * 26, 2 + q() * 8, 0, 0, TAU); k.fill(); });
  });
  // escurece o fundo e dissolve a base na névoa
  g.fillStyle = grad(g, 0, 760, 0, 1120, 0, "rgba(128,138,126,0)", 0.55, "rgba(132,142,130,.5)", 1, "rgba(140,148,136,.92)"); g.fillRect(1300, 760, 3700, 360);
  g.fillStyle = css(NEVOA, 0.13); g.fillRect(1300, 200, 3700, 950);
  g.restore();
  // a crista: a linha onde a água termina, de pé
  g.save(); g.beginPath(); for (let x = 1380; x <= 4900; x += 40) g[x === 1380 ? "moveTo" : "lineTo"](x, topoY(x) + Math.sin(x * 0.013) * 2.5 + 2);
  g.shadowColor = "rgba(200,232,220,.9)"; g.shadowBlur = 22 * Q; g.strokeStyle = "rgba(214,236,226,.7)"; g.lineWidth = 3.5; g.stroke();
  g.shadowBlur = 0; g.strokeStyle = "rgba(240,250,244,.55)"; g.lineWidth = 1.2; g.setLineDash([26, 9, 60, 14, 8, 20]); g.stroke(); g.restore();
}

function arvore(g, r, x, y, len, wd, prof, ang = -Math.PI / 2) {
  const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
  g.lineWidth = wd; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo((x + x2) / 2 + (r() - 0.5) * len * 0.35, (y + y2) / 2, x2, y2); g.stroke();
  if (prof > 0) { const n = 2 + (r() < 0.35 ? 1 : 0); for (let i = 0; i < n; i++) arvore(g, r, x2, y2, len * (0.52 + r() * 0.26), wd * 0.6, prof - 1, ang + (r() - 0.5) * 1.5); }
}

const PAREDES = [[216, 207, 186], [198, 180, 150], [178, 192, 188], [210, 188, 178], [190, 188, 172], [204, 198, 160], [172, 162, 142], [222, 214, 200]];
const JANELAS = [[58, 88, 108], [66, 98, 70], [118, 58, 48], [90, 74, 52]];
function casa(g, r, x, base, w, h, rh, k, hz) {
  const H = (c, a = 1) => css(mix(c, NEVOA, hz), a);
  const b = 0.74 + r() * 0.26, par = PAREDES[(r() * PAREDES.length) | 0].map((v) => v * b), top = base - h;
  const lado = r() < 0.45, d = w * (0.14 + r() * 0.1), ov = 4 * k;
  g.fillStyle = css([18, 14, 10], 0.4 * (1 - hz)); g.beginPath(); g.ellipse(x + w / 2 + (lado ? d / 2 : 0), base + 1.5 * k, w * 0.62, 4.5 * k, 0, 0, TAU); g.fill();
  if (lado) {
    g.fillStyle = H(par.map((v) => v * 0.6)); poly(g, [x + w, top, x + w + d, top - d * 0.4, x + w + d, base - d * 0.4, x + w, base]);
    poly(g, [x + w, top, x + w + d, top - d * 0.4, x + w + d / 2, top - rh - d * 0.2]);
    g.fillStyle = H([70, 56, 40], 0.75); poly(g, [x + w, base - h * 0.6, x + w + d, base - h * 0.6 - d * 0.4, x + w + d, base - d * 0.4, x + w, base]);
  }
  g.fillStyle = grad(g, 0, top, 0, base, 0, H(par), 1, H(par.map((v) => v * 0.88))); g.fillRect(x, top, w, h);
  // janelas e porta
  const nj = w > 70 * k ? 2 : 1, cj = JANELAS[(r() * JANELAS.length) | 0], jw = w * 0.17, jh = h * 0.32, jy = top + h * 0.2;
  for (let j = 0; j < nj; j++) {
    const jx = x + w * (nj === 2 ? 0.14 + j * 0.56 : 0.16);
    g.fillStyle = H(par.map((v) => Math.min(255, v * 1.12))); g.fillRect(jx - 1.5 * k, jy - 1.5 * k, jw + 3 * k, jh + 3 * k);
    g.fillStyle = H([16, 15, 14]); g.fillRect(jx, jy, jw, jh);
    if (r() < 0.6) { g.fillStyle = H(cj); g.fillRect(jx + (r() < 0.5 ? -jw * 0.55 : jw * 0.55), jy, jw * 0.5, jh); }
  }
  const px = x + w * (nj === 2 ? 0.42 : 0.56), pw = w * 0.17, ph = h * 0.5;
  g.fillStyle = H(par.map((v) => Math.min(255, v * 1.1))); g.fillRect(px - 1.5 * k, base - ph - 1.5 * k, pw + 3 * k, ph + 1.5 * k);
  g.fillStyle = r() < 0.5 ? H([14, 12, 10]) : H(cj.map((v) => v * 0.7)); g.fillRect(px, base - ph, pw, ph);
  // a marca da água
  const hs = h * (0.56 + r() * 0.1);
  g.fillStyle = grad(g, 0, base - hs, 0, base, 0, H([112, 94, 66], 0.66), 0.5, H([84, 68, 48], 0.84), 1, H([58, 46, 32], 0.95)); g.fillRect(x, base - hs, w, hs);
  g.fillStyle = H([172, 158, 122], 0.55); g.fillRect(x, base - hs - 0.7 * k, w, 1.3 * k);
  g.fillStyle = H([20, 16, 12], 0.4); g.fillRect(x, top, w, 3.2 * k);
  // telhado
  const tel = mix([152, 90, 62], [90, 82, 58], 0.25 + r() * 0.55).map((v) => v * (0.68 + r() * 0.3));
  let pts;
  if (lado) pts = [x - ov, top + k, x + w + ov, top + k, x + w + ov + d / 2, top - rh - d * 0.2, x - ov + d / 2, top - rh - d * 0.2];
  else if (r() < 0.68) { const ins = rh * (0.25 + r() * 0.3); pts = [x - ov, top + k, x + w + ov, top + k, x + w + ov - ins, top - rh * 0.8, x - ov + ins, top - rh * 0.8]; }
  else {
    g.fillStyle = H(par); poly(g, [x, top, x + w / 2, top - rh, x + w, top]);
    g.strokeStyle = H(tel); g.lineWidth = 5 * k; g.beginPath(); g.moveTo(x - ov, top + k); g.lineTo(x + w / 2, top - rh - k); g.lineTo(x + w + ov, top + k); g.stroke(); pts = null;
  }
  if (pts) {
    g.save(); poly(g, pts, false); g.clip();
    g.fillStyle = grad(g, 0, top - rh, 0, top, 0, H(tel.map((v) => v * 1.12)), 1, H(tel.map((v) => v * 0.82))); g.fillRect(x - ov - 4, top - rh - d - 4, w + d + ov * 2 + 8, rh + d + 12);
    g.strokeStyle = H([30, 22, 16], 0.3); g.lineWidth = 0.7 * k; g.beginPath();
    for (let y = top - rh - d; y < top + 2; y += 2.7 * k) { g.moveTo(x - ov - 4, y); g.lineTo(x + w + d + ov + 4, y); } g.stroke();
    for (let i = 0; i < 3; i++) if (r() < 0.75) { g.fillStyle = H([74, 96, 50], 0.3 + r() * 0.35); g.beginPath(); g.ellipse(x + r() * w, top - r() * rh * 0.8, w * (0.1 + r() * 0.2), rh * (0.12 + r() * 0.2), r(), 0, TAU); g.fill(); }
    if (r() < 0.3) { g.fillStyle = H([20, 15, 11], 0.8); g.fillRect(x + r() * w * 0.8, top - rh * (0.3 + r() * 0.4), w * 0.12, rh * 0.16); }
    g.restore();
    g.strokeStyle = H(tel.map((v) => Math.min(255, v * 1.3)), 0.7); g.lineWidth = 1.2 * k; g.beginPath(); g.moveTo(pts[6], pts[7]); g.lineTo(pts[4], pts[5]); g.stroke();
    if (r() < 0.16) { g.strokeStyle = H([40, 40, 40], 0.8); g.lineWidth = 0.8 * k; const ax = x + w * (0.3 + r() * 0.4), ay = top - rh * 0.8; g.beginPath(); g.moveTo(ax, ay); g.lineTo(ax, ay - 22 * k); g.moveTo(ax - 7 * k, ay - 20 * k); g.lineTo(ax + 7 * k, ay - 20 * k); g.moveTo(ax - 5 * k, ay - 16 * k); g.lineTo(ax + 5 * k, ay - 16 * k); g.stroke(); }
  }
}

function matriz(g) {
  const hz = 0.2, H = (c, a = 1) => css(mix(c, NEVOA, hz), a), cal = [206, 200, 182], ped = [168, 150, 114];
  g.fillStyle = "rgba(18,14,10,.4)"; g.beginPath(); g.ellipse(2960, 1252, 130, 9, 0, 0, TAU); g.fill();
  // nave lateral em perspectiva
  g.fillStyle = H(cal.map((v) => v * 0.62)); poly(g, [3050, 1112, 3120, 1090, 3120, 1226, 3050, 1250]);
  g.fillStyle = H([104, 66, 48]); poly(g, [3058, 1112, 3128, 1090, 3052, 1036, 2955, 1050]);
  // fachada
  g.fillStyle = grad(g, 2860, 0, 3050, 0, 0, H(cal), 0.6, H(cal.map((v) => v * 0.97)), 1, H(cal.map((v) => v * 0.84))); g.fillRect(2860, 1110, 190, 140);
  poly(g, [2852, 1112, 2955, 1048, 3058, 1112]);
  g.fillStyle = H(ped); g.fillRect(2860, 1110, 12, 140); g.fillRect(3038, 1110, 12, 140); g.fillRect(2852, 1106, 206, 7);
  g.strokeStyle = H(ped); g.lineWidth = 5; g.beginPath(); g.moveTo(2850, 1112); g.lineTo(2955, 1047); g.lineTo(3060, 1112); g.stroke();
  // torre
  g.fillStyle = grad(g, 2918, 0, 2992, 0, 0, H(cal.map((v) => v * 1.02)), 0.55, H(cal), 1, H(cal.map((v) => v * 0.78))); g.fillRect(2918, 850, 74, 214);
  g.fillStyle = H(ped); g.fillRect(2918, 850, 7, 214); g.fillRect(2985, 850, 7, 214); g.fillRect(2912, 846, 86, 8); g.fillRect(2913, 982, 84, 8); g.fillRect(2913, 1058, 84, 7);
  g.fillStyle = "rgba(20,16,12,.3)"; g.fillRect(2918, 854, 74, 6); g.fillRect(2918, 990, 74, 5);
  g.fillStyle = H([112, 70, 50]); poly(g, [2910, 848, 2955, 768, 3000, 848]); g.fillStyle = H([78, 50, 38]); poly(g, [2955, 768, 3000, 848, 2972, 848]);
  g.fillStyle = H([14, 12, 10]); g.beginPath(); g.moveTo(2934, 912); g.lineTo(2934, 880); g.quadraticCurveTo(2955, 860, 2976, 880); g.lineTo(2976, 912); g.closePath(); g.fill();
  g.fillStyle = H(ped); g.fillRect(2930, 911, 50, 5);
  // relógio parado
  g.fillStyle = H([226, 220, 198]); g.beginPath(); g.arc(2955, 948, 15, 0, TAU); g.fill(); g.strokeStyle = H([60, 50, 38]); g.lineWidth = 2; g.stroke();
  g.lineWidth = 1.6; g.beginPath(); g.moveTo(2955, 948); g.lineTo(2955, 937); g.moveTo(2955, 948); g.lineTo(2947, 955); g.stroke();
  // cruz torta
  g.save(); g.translate(2955, 770); g.rotate(0.24); g.strokeStyle = H([44, 38, 30]); g.lineWidth = 5; g.beginPath(); g.moveTo(0, 2); g.lineTo(0, -46); g.moveTo(-15, -30); g.lineTo(15, -30); g.stroke(); g.restore();
  // óculo, porta, degraus
  g.fillStyle = H([18, 16, 14]); g.beginPath(); g.arc(2955, 1096, 11, 0, TAU); g.fill(); g.strokeStyle = H(ped); g.lineWidth = 3; g.stroke();
  g.fillStyle = H(ped); g.beginPath(); g.moveTo(2924, 1250); g.lineTo(2924, 1192); g.quadraticCurveTo(2955, 1160, 2986, 1192); g.lineTo(2986, 1250); g.closePath(); g.fill();
  g.fillStyle = H([16, 13, 10]); g.beginPath(); g.moveTo(2931, 1250); g.lineTo(2931, 1195); g.quadraticCurveTo(2955, 1170, 2979, 1195); g.lineTo(2979, 1250); g.closePath(); g.fill();
  g.fillStyle = H([74, 52, 34]); g.fillRect(2931, 1198, 15, 52);
  // marca da água
  g.fillStyle = grad(g, 0, 1176, 0, 1250, 0, H([112, 94, 66], 0.62), 1, H([58, 46, 32], 0.95)); g.fillRect(2860, 1176, 190, 74); poly(g, [3050, 1176, 3120, 1154, 3120, 1226, 3050, 1250]);
  g.fillStyle = H([174, 160, 124], 0.6); g.fillRect(2860, 1174.5, 190, 2);
  g.fillStyle = H([16, 13, 10], 0.72); g.beginPath(); g.moveTo(2946, 1250); g.lineTo(2946, 1182); g.quadraticCurveTo(2962, 1172, 2979, 1195); g.lineTo(2979, 1250); g.closePath(); g.fill();
  g.fillStyle = H([150, 140, 120]); g.fillRect(2906, 1248, 98, 5);
}

function pintaVale(g) {
  g.fillStyle = grad(g, 0, 1040, 0, 1600, 0, "#7d7c68", 0.18, "#69614d", 0.5, "#4f4333", 1, "#32271c"); g.fillRect(1400, 1040, 3500, 600);
  padrao(g, T.sombra, 1400, 1040, 3500, 600, 3.4, 0.55, 0, 0, 0.5);
  padrao(g, T.brilho, 1400, 1040, 3500, 600, 4.5, 0.35, 90, 0, 0.3);
  // ruas de lama molhada
  g.lineCap = "round";
  const rua = (x1, y1, cx, cy, x2, y2, l1, l2) => { g.fillStyle = "rgba(128,120,100,.42)"; g.beginPath(); g.moveTo(x1, y1 - l1); g.quadraticCurveTo(cx, cy - (l1 + l2) / 2, x2, y2 - l2); g.lineTo(x2, y2 + l2); g.quadraticCurveTo(cx, cy + (l1 + l2) / 2, x1, y1 + l1); g.closePath(); g.fill(); };
  rua(1500, 1470, 2300, 1310, 2950, 1266, 20, 7); rua(4500, 1450, 3600, 1320, 2960, 1266, 20, 7);
  g.fillStyle = "rgba(128,120,100,.42)"; poly(g, [2944, 1266, 2970, 1266, 3030, 1640, 2900, 1640]);
  g.fillStyle = "rgba(150,146,124,.35)"; g.beginPath(); g.ellipse(2958, 1290, 190, 44, 0, 0, TAU); g.fill();
  const q = rnd(404);
  for (let i = 0; i < 46; i++) { const y = 1090 + q() * 440, k = (y - 1000) / 420; g.fillStyle = `rgba(168,176,166,${0.16 + q() * 0.22})`; g.beginPath(); g.ellipse(1500 + q() * 3200, y, (22 + q() * 60) * k, (3 + q() * 5) * k, 0, 0, TAU); g.fill(); }

  // tudo o que fica de pé, ordenado do fundo para a frente
  const itens = [], r = rnd(1974);
  for (let row = 0; row < 7; row++) {
    const base = 1095 + row * 52, k = 0.42 + row * 0.12, hz = 0.5 - row * 0.075;
    let x = 1520 + r() * 60, ultimo = null;
    while (x < 4780) {
      const w = (62 + r() * 58) * k, h = (42 + r() * 34) * k, rh = (20 + r() * 16) * k, sem = Math.floor(r() * 1e6) + 1;
      if (!(x + w > 2800 && x < 3140 && row < 5)) itens.push({ y: base, f: () => casa(g, rnd(sem), x0, base, w, h, rh, k, hz) });
      const x0 = x;
      if (r() < 0.2 && !(x > 2780 && x < 3160)) { // poste e fio
        const pxp = x + w + 8 * k, inc = (r() - 0.5) * 9 * k, alt = 78 * k, at = ultimo;
        itens.push({ y: base + 0.5, f: () => {
          g.strokeStyle = css(mix([34, 28, 22], NEVOA, hz)); g.lineWidth = 2.4 * k; g.beginPath(); g.moveTo(pxp, base + 2 * k); g.lineTo(pxp + inc, base - alt); g.moveTo(pxp + inc - 9 * k, base - alt + 7 * k); g.lineTo(pxp + inc + 9 * k, base - alt + 5 * k); g.stroke();
          if (at && pxp - at[0] < 700 * k) { g.lineWidth = 0.7 * k; g.globalAlpha = 0.6; g.beginPath(); g.moveTo(at[0], at[1]); g.quadraticCurveTo((at[0] + pxp + inc) / 2, Math.max(at[1], base - alt) + 30 * k, pxp + inc, base - alt + 6 * k); g.stroke(); g.globalAlpha = 1; }
        } });
        ultimo = [pxp + inc, base - alt + 6 * k];
      }
      if (r() < 0.14) { const ax = x + w + 20 * k, sem2 = Math.floor(r() * 1e6) + 1; itens.push({ y: base + 1, f: () => { g.strokeStyle = css(mix([30, 24, 18], NEVOA, hz)); arvore(g, rnd(sem2), ax, base + 2 * k, 30 * k, 4 * k, 3); } }); }
      x += w + (6 + r() * 40) * k + (r() < 0.14 ? 46 * k : 0);
    }
  }
  itens.push({ y: 1250, f: () => matriz(g) });
  // carro atolado
  itens.push({ y: 1318, f: () => { g.save(); g.translate(2150, 1318); g.rotate(-0.07); g.fillStyle = "rgba(16,12,9,.45)"; g.beginPath(); g.ellipse(0, 3, 44, 6, 0, 0, TAU); g.fill();
    g.fillStyle = "#6a5c46"; g.beginPath(); g.moveTo(-38, 0); g.quadraticCurveTo(-40, -14, -24, -16); g.quadraticCurveTo(-12, -34, 8, -32); g.quadraticCurveTo(24, -30, 30, -15); g.quadraticCurveTo(40, -12, 38, 0); g.closePath(); g.fill();
    g.fillStyle = "#1b1a18"; g.beginPath(); g.moveTo(-17, -17); g.quadraticCurveTo(-8, -29, 6, -28); g.lineTo(6, -17); g.closePath(); g.fill(); g.beginPath(); g.moveTo(10, -28); g.quadraticCurveTo(20, -26, 24, -17); g.lineTo(10, -17); g.closePath(); g.fill();
    g.fillStyle = "#3f3426"; g.fillRect(-40, -6, 80, 8); g.restore(); } });
  // a árvore com o barco
  itens.push({ y: 1330, f: () => {
    g.fillStyle = "rgba(16,12,9,.4)"; g.beginPath(); g.ellipse(2390, 1332, 70, 8, 0, 0, TAU); g.fill();
    g.strokeStyle = "#2b231b"; const rr = rnd(9); arvore(g, rr, 2380, 1334, 96, 13, 4);
    g.save(); g.translate(2372, 1128); g.rotate(-0.2);
    g.fillStyle = "rgba(10,8,6,.5)"; g.beginPath(); g.ellipse(0, 26, 70, 7, 0, 0, TAU); g.fill();
    g.fillStyle = grad(g, 0, -14, 0, 30, 0, "#86705a", 1, "#40352a"); g.beginPath(); g.moveTo(-82, -12); g.quadraticCurveTo(-50, 26, 0, 28); g.quadraticCurveTo(52, 26, 84, -6); g.lineTo(76, -13); g.quadraticCurveTo(30, 4, -10, 4); g.quadraticCurveTo(-50, 2, -76, -15); g.closePath(); g.fill();
    g.strokeStyle = "rgba(30,24,18,.6)"; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-70, -2); g.quadraticCurveTo(0, 22, 76, 0); g.moveTo(-58, 9); g.quadraticCurveTo(0, 30, 62, 11); g.stroke();
    g.strokeStyle = "rgba(190,176,150,.75)"; g.lineWidth = 2.2; g.beginPath(); g.moveTo(-80, -13); g.quadraticCurveTo(-48, 3, -10, 4); g.quadraticCurveTo(32, 4, 80, -9); g.stroke();
    g.strokeStyle = "rgba(96,140,150,.6)"; g.lineWidth = 3; g.beginPath(); g.moveTo(-66, 4); g.quadraticCurveTo(0, 26, 70, 6); g.stroke();
    g.restore();
    g.strokeStyle = "#2b231b"; g.lineWidth = 5; g.beginPath(); g.moveTo(2340, 1165); g.quadraticCurveTo(2332, 1130, 2312, 1108); g.moveTo(2410, 1150); g.quadraticCurveTo(2420, 1120, 2440, 1100); g.stroke();
  } });
  itens.sort((a, b) => a.y - b.y).forEach((i) => i.f());
  // entulho solto
  for (let i = 0; i < 120; i++) { const y = 1110 + q() * 420, k = (y - 1000) / 420; g.fillStyle = `rgba(${28 + q() * 30 | 0},${22 + q() * 22 | 0},${16 + q() * 14 | 0},${0.5 + q() * 0.4})`; g.beginPath(); g.ellipse(1500 + q() * 3200, y, (3 + q() * 12) * k, (1.5 + q() * 4) * k, q() * 3, 0, TAU); g.fill(); }
  padrao(g, T.sombra, 1400, 740, 3500, 900, 1.6, 1.6, 40, 0, 0.3);
  padrao(g, T.sombra2, 1400, 740, 3500, 900, 0.35, 0.35, 0, 0, 0.22);
  g.save(); g.globalCompositeOperation = "source-atop"; g.fillStyle = grad(g, 0, 1040, 0, 1300, 0, css(NEVOA, 0.5), 1, css(NEVOA, 0)); g.fillRect(1400, 740, 3500, 640); g.restore();
}

function pintaBarragem(g) {
  const face = [-700, 330, 1720, 330, 1760, 1520, -700, 1520];
  g.save(); poly(g, face, false); g.clip();
  g.fillStyle = grad(g, 0, 330, 0, 1520, 0, "#9a9b90", 0.5, "#84857b", 1, "#66675f"); g.fillRect(-700, 300, 2600, 1240);
  g.fillStyle = grad(g, -700, 0, 1760, 0, 0, "rgba(0,0,0,.2)", 0.4, "rgba(0,0,0,0)", 0.8, "rgba(255,255,255,.04)", 1, "rgba(0,0,0,.22)"); g.fillRect(-700, 300, 2600, 1240);
  const r = rnd(55);
  // escorridos
  for (let i = 0; i < 90; i++) {
    const x = -700 + r() * 2450, w = 8 + r() * 46, c = 140 + r() * 900, cl = r() < 0.22;
    g.fillStyle = grad(g, 0, 338, 0, 338 + c, 0, cl ? `rgba(214,212,196,${0.1 + r() * 0.14})` : `rgba(26,26,22,${0.08 + r() * 0.2})`, 1, "rgba(30,30,26,0)"); g.fillRect(x, 338, w, c);
  }
  padrao(g, T.sombra, -700, 300, 2600, 1240, 0.8, 7, 0, 0, 0.3);
  padrao(g, T.sombra2, -700, 300, 2600, 1240, 2.6, 2.2, 0, 0, 0.4);
  padrao(g, T.musgo, -700, 336, 2600, 120, 0.9, 0.8, 0, 0, 0.5);
  padrao(g, T.musgo, -700, 456, 2600, 1064, 0.5, 2.6, 70, 0, 0.16);
  // juntas da forma
  for (let i = 0; i < 13; i++) { const x = -640 + i * 200; g.strokeStyle = "rgba(30,30,26,.42)"; g.lineWidth = 2.4; g.beginPath(); g.moveTo(x, 336); g.lineTo(x + 12, 1520); g.stroke(); g.strokeStyle = "rgba(220,220,206,.1)"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x + 2.4, 336); g.lineTo(x + 14.4, 1520); g.stroke(); }
  for (let y = 450; y < 1520; y += 118) { g.strokeStyle = "rgba(30,30,26,.26)"; g.lineWidth = 1.8; g.beginPath(); g.moveTo(-700, y); g.lineTo(1760, y); g.stroke(); g.strokeStyle = "rgba(220,220,206,.07)"; g.beginPath(); g.moveTo(-700, y + 2); g.lineTo(1760, y + 2); g.stroke(); }
  g.fillStyle = grad(g, 0, 1150, 0, 1520, 0, "rgba(38,31,23,0)", 1, "rgba(38,31,23,.4)"); g.fillRect(-700, 1150, 2600, 380);
  g.fillStyle = grad(g, 0, 338, 0, 384, 0, "rgba(0,0,0,.5)", 1, "rgba(0,0,0,0)"); g.fillRect(-700, 338, 2600, 46);
  // a sombra macia do hotel na parede
  g.shadowColor = "rgba(0,0,0,.5)"; g.shadowBlur = 80 * Q; g.shadowOffsetX = 14 * Q; g.fillStyle = "#4a3b38"; g.fillRect(392, 600, 1016, 940); g.shadowBlur = 0; g.shadowOffsetX = 0;
  padrao(g, T.graoE, -700, 300, 2600, 1240, 0.45, 0.45, 0, 0, 0.42);
  g.restore();
  // topo da barragem, testa e guarda-corpo
  g.fillStyle = grad(g, 0, 330, 0, 1520, 0, "#4c4d46", 1, "#22231f"); poly(g, [1720, 330, 1792, 322, 1838, 1520, 1760, 1520]);
  g.fillStyle = grad(g, 0, 316, 0, 338, 0, "#b0b1a4", 0.25, "#9c9d91", 1, "#74756b"); g.fillRect(-700, 316, 2424, 22); poly(g, [1724, 316, 1794, 308, 1794, 328, 1724, 338]);
  g.strokeStyle = "rgba(24,25,24,.85)"; g.lineWidth = 2.6; g.beginPath();
  for (let x = -690; x < 1724; x += 58) { g.moveTo(x, 317); g.lineTo(x + (x > 1250 && x < 1420 ? 9 : 0), 280); }
  g.stroke(); g.lineWidth = 2; g.beginPath(); g.moveTo(-700, 281); g.lineTo(1262, 281); g.quadraticCurveTo(1330, 300, 1420, 284); g.lineTo(1724, 281); g.moveTo(-700, 298); g.lineTo(1724, 298); g.stroke();
}

function vidro(g, x, y, w, h, r) {
  g.fillStyle = grad(g, x, y, x + w * 0.4, y + h, 0, "#75827d", 0.3, "#414c4b", 0.62, "#1b2223", 1, "#101516"); g.fillRect(x, y, w, h);
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = "rgba(205,214,204,.13)"; poly(g, [x - 10, y + h * 0.5, x + w * 0.5, y - 4, x + w * 0.86, y - 4, x - 10, y + h * 0.82]);
  padrao(g, T.luz, x, y, w, h * 0.55, 0.5, 0.22, x * 3, y, 0.22, "source-over");
  if (r() < 0.6) { const lado = r() < 0.5, cw = w * (0.2 + r() * 0.16), cx = lado ? x : x + w - cw; g.fillStyle = grad(g, cx, 0, cx + cw, 0, 0, "rgba(214,204,188,.34)", 0.3, "rgba(170,160,146,.2)", 0.6, "rgba(214,204,188,.36)", 1, "rgba(160,150,138,.2)"); g.fillRect(cx, y, cw, h); }
  g.fillStyle = grad(g, 0, y, 0, y + 16, 0, "rgba(0,0,0,.6)", 1, "rgba(0,0,0,0)"); g.fillRect(x, y, w, 16);
  g.fillStyle = grad(g, x, 0, x + 10, 0, 0, "rgba(0,0,0,.45)", 1, "rgba(0,0,0,0)"); g.fillRect(x, y, 10, h);
  g.restore();
}

function pintaHotel(g) {
  const X0 = 380, X1 = 1420, r = rnd(74);
  // estrutura do letreiro
  const aco = (x1, y1, x2, y2, w) => { g.strokeStyle = "#1f2122"; g.lineWidth = w; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.strokeStyle = "rgba(150,156,152,.35)"; g.lineWidth = w * 0.22; g.beginPath(); g.moveTo(x1 - w * 0.25, y1); g.lineTo(x2 - w * 0.25, y2); g.stroke(); };
  g.lineCap = "butt";
  for (const x of [470, 700, 900, 1100, 1330]) { aco(x, 588, x, 446, 9); aco(x, 588, x + 46, 470, 3.5); }
  aco(452, 466, 1348, 466, 6); aco(452, 578, 1348, 578, 6); aco(452, 446, 1348, 446, 3);
  g.font = "700 92px Georgia, 'Times New Roman', serif"; g.textAlign = "center"; try { g.letterSpacing = "6px"; } catch { /* */ }
  g.lineJoin = "round";
  g.shadowColor = "rgba(0,0,0,.5)"; g.shadowBlur = 6 * Q; g.shadowOffsetY = 3 * Q;
  g.fillStyle = "#262422"; g.strokeStyle = "#262422"; g.lineWidth = 9; g.strokeText("HOTEL BELA VISTA", 900, 558); g.fillText("HOTEL BELA VISTA", 900, 558);
  g.shadowBlur = 0; g.shadowOffsetY = 0;
  g.strokeStyle = "rgba(120,122,116,.5)"; g.lineWidth = 1.3; g.strokeText("HOTEL BELA VISTA", 898.5, 556.5);
  g.fillStyle = grad(g, 0, 480, 0, 560, 0, "#56524c", 1, "#3a3733"); g.fillText("HOTEL BELA VISTA", 900, 558);
  g.lineCap = "round"; g.setLineDash([0.01, 13.5]);
  g.strokeStyle = "#121212"; g.lineWidth = 7.4; g.strokeText("HOTEL BELA VISTA", 900, 558);
  g.strokeStyle = "#a59d8f"; g.lineWidth = 5.2; g.strokeText("HOTEL BELA VISTA", 900, 558);
  g.strokeStyle = "rgba(238,234,220,.8)"; g.lineWidth = 1.8; g.strokeText("HOTEL BELA VISTA", 899, 557);
  g.setLineDash([]); try { g.letterSpacing = "0px"; } catch { /* */ }

  // corpo do prédio
  g.fillStyle = grad(g, X0, 0, X1, 0, 0, "#d6a59e", 0.3, "#e8bfb7", 0.62, "#e2b6ae", 1, "#cb9891"); g.fillRect(X0, 618, X1 - X0, 882);
  g.fillStyle = grad(g, 0, 618, 0, 1500, 0, "rgba(255,244,236,.14)", 0.5, "rgba(255,244,236,0)", 0.86, "rgba(60,30,30,.05)", 1, "rgba(60,30,30,.22)"); g.fillRect(X0, 618, X1 - X0, 882);
  padrao(g, T.graoE, X0, 618, 1040, 882, 0.3, 0.3, 0, 0, 0.16);
  padrao(g, T.graoC, X0, 618, 1040, 882, 0.3, 0.3, 37, 11, 0.1);
  padrao(g, T.sombra2, X0, 618, 1040, 882, 2.4, 2.4, 0, 0, 0.07);
  // pilastras
  for (const x of [X0, X1 - 26]) { g.fillStyle = grad(g, x, 0, x + 26, 0, 0, "#f1d3cb", 0.7, "#ecc9c1", 1, "#c99f98"); g.fillRect(x, 618, 26, 834); }
  g.fillStyle = "rgba(90,50,48,.22)"; g.fillRect(X0 + 26, 618, 3, 834); g.fillRect(X1 - 29, 618, 3, 834);
  // cornija
  g.fillStyle = grad(g, 0, 619, 0, 668, 0, "rgba(70,34,34,.42)", 1, "rgba(70,34,34,0)"); g.fillRect(X0, 619, X1 - X0, 50);
  g.fillStyle = grad(g, 0, 578, 0, 620, 0, "#f6dcd5", 0.2, "#eccac2", 0.55, "#dbaea6", 0.8, "#c2928b", 1, "#b4847e"); g.fillRect(X0 - 22, 578, X1 - X0 + 44, 42);
  g.fillStyle = "rgba(255,246,240,.6)"; g.fillRect(X0 - 22, 578, X1 - X0 + 44, 3); g.fillStyle = "rgba(90,50,48,.35)"; g.fillRect(X0 - 14, 606, X1 - X0 + 28, 3);
  // faixas entre os andares
  for (const y of [940, 1220]) {
    g.fillStyle = grad(g, 0, y + 8, 0, y + 34, 0, "rgba(70,34,34,.32)", 1, "rgba(70,34,34,0)"); g.fillRect(X0, y + 8, X1 - X0, 26);
    g.fillStyle = grad(g, 0, y - 8, 0, y + 8, 0, "#f3d7cf", 0.5, "#e2b9b1", 1, "#c69790"); g.fillRect(X0 - 7, y - 8, X1 - X0 + 14, 16);
  }
  // rodapé de pedra
  g.fillStyle = grad(g, 0, 1452, 0, 1500, 0, "#c9bbb4", 0.15, "#b7a8a1", 1, "#93857f"); g.fillRect(X0 - 4, 1452, X1 - X0 + 8, 48);
  g.fillStyle = "rgba(255,250,244,.4)"; g.fillRect(X0 - 4, 1452, X1 - X0 + 8, 2.5);
  padrao(g, T.sombra2, X0 - 4, 1454, 1048, 46, 0.5, 0.5, 0, 0, 0.3);

  // janelas e varandas
  for (let f = 0; f < 3; f++) {
    const y = 680 + f * 280;
    for (let i = 0; i < 6; i++) {
      const x = 440 + i * 165; if (f === 2 && i >= 2 && i <= 4) continue;
      const W = 92, Hh = f === 2 ? 132 : 160;
      // moldura
      g.fillStyle = "rgba(70,34,34,.3)"; g.fillRect(x - 11, y - 12, W + 26, Hh + 14);
      g.fillStyle = grad(g, x - 14, 0, x + W + 14, 0, 0, "#f7e6de", 0.8, "#f0d9d0", 1, "#d9bab2"); g.fillRect(x - 14, y - 14, W + 28, Hh + 14);
      g.fillStyle = grad(g, 0, y - 30, 0, y - 14, 0, "#f9ebe4", 0.6, "#e6c8bf", 1, "#bf958e"); g.fillRect(x - 22, y - 30, W + 44, 16);
      g.fillStyle = grad(g, 0, y - 14, 0, y - 2, 0, "rgba(70,34,34,.35)", 1, "rgba(70,34,34,0)"); g.fillRect(x - 14, y - 14, W + 28, 12);
      vidro(g, x, y, W, Hh, r);
      // caixilho
      g.strokeStyle = "#efe2d8"; g.lineWidth = 6; g.strokeRect(x + 3, y + 3, W - 6, Hh - 6);
      g.lineWidth = 4.5; g.beginPath(); g.moveTo(x + W / 2, y); g.lineTo(x + W / 2, y + Hh); g.stroke();
      g.lineWidth = 3.2; g.beginPath(); g.moveTo(x, y + 46); g.lineTo(x + W, y + 46); g.stroke();
      g.strokeStyle = "rgba(60,40,40,.35)"; g.lineWidth = 1; g.beginPath(); g.moveTo(x + W / 2 + 2.6, y + 6); g.lineTo(x + W / 2 + 2.6, y + Hh - 6); g.moveTo(x + 6.4, y + 6); g.lineTo(x + 6.4, y + Hh - 6); g.stroke();
      if (f < 2) {
        // laje e sombra da varanda
        g.fillStyle = grad(g, 0, y + 172, 0, y + 222, 0, "rgba(64,30,30,.5)", 0.35, "rgba(64,30,30,.2)", 1, "rgba(64,30,30,0)"); g.fillRect(x - 26, y + 172, W + 52, 50);
        g.fillStyle = "#b08f89"; g.fillRect(x - 16, y + 172, 9, 13); g.fillRect(x + W + 7, y + 172, 9, 13);
        g.fillStyle = grad(g, 0, y + 158, 0, y + 173, 0, "#f2ded6", 0.25, "#dcc0b8", 1, "#a98a84"); g.fillRect(x - 28, y + 158, W + 56, 15);
        // grade de ferro
        g.strokeStyle = "#17191a"; g.lineWidth = 2.1; g.beginPath();
        for (let b = 0; b <= 14; b++) { const bx = x - 25 + b * (W + 50) / 14; g.moveTo(bx, y + 98); g.lineTo(bx, y + 158); }
        g.stroke(); g.lineWidth = 1.3; g.beginPath();
        for (let b = 0; b < 14; b += 2) { const bx = x - 25 + (b + 0.5) * (W + 50) / 14; g.moveTo(bx + 4, y + 128); g.arc(bx, y + 128, 4, 0, TAU); g.moveTo(bx + (W + 50) / 14 + 3, y + 114); g.arc(bx + (W + 50) / 14, y + 114, 3, 0, TAU); }
        g.stroke();
        g.lineWidth = 4.6; g.beginPath(); g.moveTo(x - 28, y + 97); g.lineTo(x + W + 28, y + 97); g.stroke(); g.lineWidth = 2.4; g.beginPath(); g.moveTo(x - 26, y + 152); g.lineTo(x + W + 26, y + 152); g.moveTo(x - 26, y + 106); g.lineTo(x + W + 26, y + 106); g.stroke();
        g.strokeStyle = "rgba(190,198,196,.4)"; g.lineWidth = 1; g.beginPath(); g.moveTo(x - 28, y + 95.4); g.lineTo(x + W + 28, y + 95.4); g.stroke();
      } else {
        g.fillStyle = grad(g, 0, y + Hh, 0, y + Hh + 12, 0, "#f6e6de", 1, "#bb968f"); g.fillRect(x - 20, y + Hh, W + 40, 11);
        g.fillStyle = grad(g, 0, y + Hh + 11, 0, y + Hh + 30, 0, "rgba(64,30,30,.36)", 1, "rgba(64,30,30,0)"); g.fillRect(x - 16, y + Hh + 11, W + 36, 20);
      }
    }
  }
  // entrada: marquise, porta dupla de vidro, degraus
  g.fillStyle = grad(g, 0, 1258, 0, 1340, 0, "rgba(52,24,24,.55)", 1, "rgba(52,24,24,0)"); g.fillRect(744, 1258, 312, 82);
  g.fillStyle = grad(g, 0, 1230, 0, 1260, 0, "#f6e2da", 0.2, "#e3c4bc", 0.75, "#c79a93", 1, "#9d7771"); g.fillRect(744, 1230, 312, 30);
  g.fillStyle = "#5c4a3c"; g.fillRect(820, 1262, 160, 238);
  vidro(g, 830, 1270, 140, 230, rnd(3));
  g.strokeStyle = "#6e5a45"; g.lineWidth = 7; g.strokeRect(830, 1270, 140, 230); g.lineWidth = 6; g.beginPath(); g.moveTo(900, 1270); g.lineTo(900, 1500); g.moveTo(830, 1322); g.lineTo(970, 1322); g.stroke();
  g.strokeStyle = "rgba(226,200,150,.5)"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(827.4, 1268); g.lineTo(827.4, 1500); g.moveTo(897.6, 1272); g.lineTo(897.6, 1500); g.stroke();
  g.strokeStyle = "#c9a35c"; g.lineWidth = 4; g.beginPath(); g.moveTo(889, 1376); g.lineTo(889, 1432); g.moveTo(911, 1376); g.lineTo(911, 1432); g.stroke();
  g.strokeStyle = "rgba(255,240,200,.6)"; g.lineWidth = 1; g.beginPath(); g.moveTo(888, 1378); g.lineTo(888, 1430); g.moveTo(910, 1378); g.lineTo(910, 1430); g.stroke();
  g.fillStyle = grad(g, 0, 1500, 0, 1519, 0, "#cfc5bd", 0.25, "#aaa098", 1, "#7d746d"); g.fillRect(784, 1500, 232, 19);
  g.fillStyle = grad(g, 0, 1519, 0, 1540, 0, "#c2b8b0", 0.25, "#9c928a", 1, "#6d655f"); g.fillRect(762, 1519, 276, 21);
  g.fillStyle = "#6f1f22"; g.fillRect(852, 1500, 96, 40); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(852, 1517, 96, 3);
}

/* corpo deitado no barro. Origem no chão, cabeça para a direita. ergue: 0 deitado, 1 apoiado no braço */
function corpo(g, x, y, s, ergue = 0, cores = {}) {
  const { camisa = "#181b1c", calca = "#12100e", pele = "#5a4739", cabelo = "#0b0a09" } = cores, luz = "rgba(168,176,168,.3)";
  g.save(); g.translate(x, y); g.scale(s, s); g.lineCap = "round"; g.lineJoin = "round";
  g.fillStyle = rgrad(g, 0, 0, 1, 0, "rgba(0,0,0,.7)", 0.6, "rgba(0,0,0,.35)", 1, "rgba(0,0,0,0)"); g.save(); g.scale(350, 22); g.beginPath(); g.arc(-0.08, 0.1, 1, 0, TAU); g.fill(); g.restore();
  // pernas: coxa grossa, canela mais fina
  const perna = (p, w1, w2) => { g.strokeStyle = calca; g.lineWidth = w1; g.beginPath(); g.moveTo(p[0], p[1]); g.quadraticCurveTo(p[2], p[3], p[4], p[5]); g.stroke(); g.lineWidth = w2; g.beginPath(); g.moveTo(p[4], p[5]); g.lineTo(p[6], p[7]); g.stroke(); };
  perna([-44, -24, -120, -30, -176, -22, -292, -12], 38, 27);
  perna([-40, -38, -120, -78, -190, -56, -306, -18], 40, 28);
  g.strokeStyle = luz; g.lineWidth = 2.4; g.beginPath(); g.moveTo(-66, -62); g.quadraticCurveTo(-124, -92, -192, -76); g.lineTo(-296, -34); g.stroke();
  g.fillStyle = "#090807"; g.beginPath(); g.ellipse(-322, -20, 24, 13, -0.6, 0, TAU); g.ellipse(-308, -8, 23, 11, 0.1, 0, TAU); g.fill();
  // tronco, braço e cabeça giram a partir do quadril
  g.translate(-40, -14); g.rotate(-ergue * 0.6); g.translate(40, 14);
  g.fillStyle = camisa; g.beginPath(); g.moveTo(-64, -62); g.quadraticCurveTo(10, -92, 120, -84); g.quadraticCurveTo(170, -78, 176, -50); g.quadraticCurveTo(170, -14, 120, -5); g.lineTo(-50, -4); g.quadraticCurveTo(-80, -26, -64, -62); g.closePath(); g.fill();
  g.strokeStyle = "rgba(0,0,0,.45)"; g.lineWidth = 2; g.beginPath(); g.moveTo(-10, -70); g.quadraticCurveTo(10, -40, -6, -8); g.moveTo(60, -80); g.quadraticCurveTo(84, -46, 70, -8); g.moveTo(112, -78); g.quadraticCurveTo(124, -50, 116, -18); g.stroke();
  g.strokeStyle = luz; g.lineWidth = 2.6; g.beginPath(); g.moveTo(-54, -68); g.quadraticCurveTo(10, -93, 120, -85); g.quadraticCurveTo(160, -80, 172, -62); g.stroke();
  const cx = lerp(204, 150, ergue), cy = lerp(-16, 34, ergue), mx = lerp(262, 136, ergue), my = lerp(-9, 86, ergue);
  g.strokeStyle = camisa; g.lineWidth = 25; g.beginPath(); g.moveTo(140, -58); g.lineTo(cx, cy); g.stroke(); g.lineWidth = 19; g.beginPath(); g.moveTo(cx, cy); g.lineTo(mx, my); g.stroke();
  g.fillStyle = pele; g.beginPath(); g.ellipse(mx + 10, my + 1, 13, 9, 0.2, 0, TAU); g.fill();
  g.fillRect(168, -72, 22, 22);
  g.beginPath(); g.ellipse(208, -62, 26, 23, 0.25, 0, TAU); g.fill();
  g.fillStyle = cabelo; g.beginPath(); g.ellipse(212, -66, 28, 23, 0.3, Math.PI * 0.75, Math.PI * 2.35); g.fill();
  g.strokeStyle = luz; g.lineWidth = 2.2; g.beginPath(); g.ellipse(212, -66, 27, 22, 0.3, Math.PI * 1.15, Math.PI * 1.9); g.stroke();
  g.restore();
}

function peixe(g, x, y, s, rot) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.fillStyle = "rgba(0,0,0,.4)"; g.beginPath(); g.ellipse(4, 9, 40, 5, 0, 0, TAU); g.fill();
  g.fillStyle = grad(g, 0, -13, 0, 12, 0, "#56635f", 0.5, "#9aa7a0", 1, "#c7cdc2"); g.beginPath(); g.moveTo(-36, 0); g.quadraticCurveTo(-6, -17, 28, -2); g.lineTo(44, -13); g.lineTo(42, 12); g.lineTo(28, 2); g.quadraticCurveTo(-6, 16, -36, 0); g.closePath(); g.fill();
  g.fillStyle = "#0d0f0e"; g.beginPath(); g.arc(-25, -2, 2.6, 0, TAU); g.fill(); g.strokeStyle = "rgba(235,240,232,.5)"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-20, -6); g.quadraticCurveTo(0, -11, 22, -3); g.stroke();
  g.restore();
}

const POCAS = [[420, 1640, 260, 34], [1350, 1700, 200, 26], [2400, 1826, 330, 40], [-200, 1880, 300, 44], [3500, 1930, 380, 46]];
function pintaFrente(g) {
  const A = [-700, 1500, 1660, 1500, 1764, 1604, 1960, 2450, -700, 2450];
  // a beira do mirante, mais escura, do lado do vale
  g.beginPath(); g.moveTo(1740, 1600); const q = rnd(88);
  for (let x = 1760; x <= 4900; x += 34) g.lineTo(x, 1612 + Math.sin(x * 0.004) * 14 + q() * 9); g.lineTo(4900, 2450); g.lineTo(1900, 2450); g.closePath();
  g.fillStyle = grad(g, 0, 1600, 0, 2300, 0, "#362b20", 0.3, "#261d15", 1, "#0f0b08"); g.fill();
  // mato seco e cerca na beirada
  for (let i = 0; i < 150; i++) {
    const x = 1770 + q() * 3100, y = 1622 + Math.sin(x * 0.004) * 14 + q() * 14, t = 14 + q() * 40;
    { const b = 0.55 + q() * 0.75; g.strokeStyle = css([62 * b, 52 * b, 32 * b], 0.95); } g.lineWidth = 1.2 + q() * 1.6; g.beginPath();
    for (let j = 0; j < 7; j++) { g.moveTo(x + (q() - 0.5) * 12, y); g.quadraticCurveTo(x + (q() - 0.5) * 20, y - t * 0.6, x + (q() - 0.5) * 44, y - t * (0.6 + q() * 0.5)); }
    g.stroke();
  }
  g.strokeStyle = "#1b150f"; let ant = null;
  for (let i = 0; i < 9; i++) { const x = 1900 + i * 330 + q() * 50, y = 1626 + Math.sin(x * 0.004) * 14, inc = (q() - 0.5) * 16; g.lineWidth = 7; g.beginPath(); g.moveTo(x, y + 14); g.lineTo(x + inc, y - 74); g.stroke();
    if (ant) { g.lineWidth = 1.3; g.beginPath(); for (const f of [0.25, 0.6]) { g.moveTo(lerp(ant[0], ant[2], f), lerp(ant[1], ant[3], f)); g.quadraticCurveTo((ant[0] + x) / 2, (ant[1] + y) / 2 - 30 + 16, lerp(x, x + inc, 1 - f), lerp(y + 14, y - 74, 1 - f)); } g.stroke(); }
    ant = [x + inc, y - 74, x, y + 14]; }
  // a pedra e o barro
  g.save(); poly(g, A, false); g.clip();
  g.fillStyle = grad(g, 0, 1500, 0, 2300, 0, "#5b4937", 0.1, "#4a3a2b", 0.45, "#34281d", 1, "#150f0a"); g.fillRect(-700, 1480, 2700, 980);
  g.fillStyle = grad(g, 1500, 0, 1960, 0, 0, "rgba(0,0,0,0)", 1, "rgba(0,0,0,.5)"); g.fillRect(1500, 1480, 480, 980);
  padrao(g, T.sombra, -700, 1480, 2700, 980, 3, 0.8, 0, 0, 0.62);
  padrao(g, T.sombra2, -700, 1480, 2700, 980, 0.9, 0.35, 0, 0, 0.4);
  padrao(g, T.brilho, -700, 1480, 2700, 980, 4.2, 0.5, 0, 0, 0.42);
  padrao(g, T.brilho, -700, 1480, 2700, 980, 1.3, 0.22, 200, 60, 0.28);
  // sombra de contato do hotel e reflexo rosa no chão molhado
  g.save(); g.translate(900, 1500); g.scale(1, 0.085); g.fillStyle = rgrad(g, 0, 0, 760, 0, "rgba(0,0,0,.75)", 0.7, "rgba(0,0,0,.45)", 1, "rgba(0,0,0,0)"); g.fillRect(-800, -40, 1600, 900); g.restore();
  g.save(); g.translate(900, 1530); g.scale(1, 0.4); g.fillStyle = rgrad(g, 0, 0, 640, 0, "rgba(232,184,176,.2)", 1, "rgba(232,184,176,0)"); g.fillRect(-700, 0, 1400, 700); g.restore();
  g.restore();
  // pedras da borda
  for (let i = 0; i < 9; i++) { const t = i / 8, x = lerp(1640, 1880, t) + q() * 30, y = lerp(1508, 2100, t * t) + q() * 20, w = 30 + q() * 60; g.fillStyle = grad(g, 0, y - w * 0.5, 0, y + w * 0.3, 0, "#6e665b", 1, "#231d17"); g.beginPath(); g.moveTo(x - w, y + w * 0.2); g.quadraticCurveTo(x - w * 0.7, y - w * 0.6, x, y - w * 0.5); g.quadraticCurveTo(x + w * 0.9, y - w * 0.3, x + w, y + w * 0.25); g.closePath(); g.fill(); }
  // poças: céu, hotel e borda escura
  POCAS.forEach(([cx, cy, rx, ry], i) => {
    const forma = () => { g.beginPath(); const qq = rnd(600 + i); for (let k = 0; k <= 40; k++) { const a = k / 40 * TAU, d = 0.8 + 0.2 * Math.sin(a * 3 + i) + 0.12 * Math.sin(a * 7 + i * 2) + qq() * 0.04; g[k ? "lineTo" : "moveTo"](cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d); } g.closePath(); };
    g.save(); forma(); g.shadowColor = "rgba(10,7,4,.9)"; g.shadowBlur = 10 * Q; g.fillStyle = "#2a231b"; g.fill(); g.shadowBlur = 0; g.clip();
    g.fillStyle = grad(g, 0, cy - ry, 0, cy + ry, 0, "#9aa094", 0.5, "#6c736b", 1, "#353c39"); g.fillRect(cx - rx * 2, cy - ry * 2, rx * 4, ry * 4);
    if (i < 2 && L.hotel) suave(g, cx - rx * 1.3, cy - ry * 1.3, rx * 2.6, ry * 2.6, 3, (k) => { k.globalAlpha = 0.42; k.translate(0, 3010); k.scale(1, -1); k.drawImage(L.hotel.c, L.hotel.x0, L.hotel.y0, L.hotel.w, L.hotel.h); });
    padrao(g, T.sombra, cx - rx * 1.3, cy - ry * 1.3, rx * 2.6, ry * 2.6, 2, 0.3, 0, 0, 0.3, "source-over");
    g.fillStyle = grad(g, 0, cy + ry * 0.2, 0, cy + ry * 1.2, 0, "rgba(20,14,9,0)", 1, "rgba(20,14,9,.6)"); g.fillRect(cx - rx * 2, cy - ry * 2, rx * 4, ry * 4);
    g.restore();
  });
  // peixes, pedrinhas, os outros
  const pq = rnd(12);
  for (let i = 0; i < 260; i++) { const y = 1520 + pq() * pq() * 700, k = 0.4 + (y - 1500) / 500; g.fillStyle = `rgba(${20 + pq() * 60 | 0},${16 + pq() * 46 | 0},${12 + pq() * 34 | 0},${0.5 + pq() * 0.5})`; g.beginPath(); g.ellipse(-650 + pq() * 2400, y, (2 + pq() * 7) * k, (1 + pq() * 3) * k, pq() * 3, 0, TAU); g.fill(); }
  peixe(g, 1150, 1650, 1, 0.1); peixe(g, 2930, 1764, 1.3, -0.2); peixe(g, 640, 1590, 0.7, 2.9);
  corpo(g, 1420, 1574, 0.36, 0, { camisa: "#2a211e", calca: "#16130f" });
  corpo(g, 470, 1792, 1, 0);
  // grãos e vinheta do chão
  g.save(); g.globalCompositeOperation = "source-atop";
  g.fillStyle = grad(g, 0, 1900, 0, 2450, 0, "rgba(0,0,0,0)", 1, "rgba(0,0,0,.75)"); g.fillRect(-700, 1900, 5600, 560); g.restore();
  padrao(g, T.graoE, -700, 1470, 5600, 990, 0.6, 0.6, 0, 0, 0.3);
}

/* ---------- montagem ---------- */
const pausa = () => new Promise((ok) => setTimeout(ok, 0));
export const camInicial = { x: 900, y: 240, w: 1500, rot: -14, blur: 24, luz: 0.45, balanco: 1.6 };

export async function montar(alvo) {
  caixa = alvo;
  const largura = Math.max(innerWidth, innerHeight) * Math.min(devicePixelRatio || 1, 1.5);
  Q = clamp(largura / 1900, 0.5, 1);
  cv = document.createElement("canvas"); cv.style.cssText = "position:absolute;display:block"; alvo.innerHTML = ""; alvo.appendChild(cv);
  ctx = cv.getContext("2d", { alpha: false });
  const nA = ruido(512, 4, 7, 11), nB = ruido(512, 8, 6, 23), nC = ruido(512, 4, 7, 5, 0.58), nF = ruido(256, 64, 3, 9), nD = ruido(512, 2, 8, 41, 0.55);
  await pausa();
  T.sombra = texA(512, nA, [14, 12, 10], (v) => sm(0.25, 0.95, v) * 0.9);
  T.sombra2 = texA(512, nB, [16, 14, 12], (v) => sm(0.35, 0.9, v) * 0.85);
  T.luz = texA(512, nB, [236, 240, 230], (v) => sm(0.45, 0.95, v));
  T.brilho = texA(512, nC, [186, 196, 190], (v) => sm(0.6, 0.82, v) * 0.8);
  T.musgo = texA(512, nC, [58, 78, 40], (v) => sm(0.52, 0.8, v) * 0.9);
  T.graoE = texA(256, nF, [0, 0, 0], (v) => Math.max(0, v - 0.5) * 0.9);
  T.graoC = texA(256, nF, [255, 255, 255], (v) => Math.max(0, 0.5 - v) * 0.9);
  T.agua = texA(512, nA, [176, 214, 202], (v, _d) => Math.pow(1 - Math.abs(2 * v - 1), 6) * 0.9);
  for (const k in T) T[k] = ctx.createPattern(T[k], "repeat");
  // nuvens: quanto mais densa, mais escura
  const nuvem = (campo, claro, escuro, a0, a1) => tex(512, campo, (v, d, j) => { const t = sm(0.45, 0.85, v); d[j] = lerp(claro[0], escuro[0], t); d[j + 1] = lerp(claro[1], escuro[1], t); d[j + 2] = lerp(claro[2], escuro[2], t); d[j + 3] = 255 * sm(a0, a1, v); });
  P.nuvem1 = nuvem(nD, [150, 156, 142], [22, 28, 31], 0.3, 0.62);
  P.nuvem2 = nuvem(nC, [128, 134, 124], [34, 41, 43], 0.48, 0.74);
  // faixa de névoa: ruído com as bordas de cima e de baixo dissolvidas
  const faixa = (campo, cor) => { const c = texA(512, campo, cor, (v) => sm(0.3, 0.8, v)), g = c.getContext("2d"); g.globalCompositeOperation = "destination-in"; g.fillStyle = grad(g, 0, 0, 0, 512, 0, "rgba(0,0,0,0)", 0.45, "#000", 0.6, "#000", 1, "rgba(0,0,0,0)"); g.fillRect(0, 0, 512, 512); return c; };
  P.nevoa1 = faixa(nA, [156, 164, 152]); P.nevoa2 = faixa(nB, [170, 176, 164]);
  P.muralha = new Path2D(); caminhoMuralha(P.muralha);
  { const c = tela(256, 256), k = c.getContext("2d"), im = k.createImageData(256, 256), d = im.data, rr = rnd(3);
    for (let j = 0; j < d.length; j += 4) { const v = rr() < 0.5 ? 0 : 255; d[j] = d[j + 1] = d[j + 2] = v; d[j + 3] = rr() * rr() * 30; }
    k.putImageData(im, 0, 0); P.grao = ctx.createPattern(c, "repeat"); }
  const graoVelho = document.getElementById("grao"); if (graoVelho) graoVelho.style.display = "none";
  await pausa();
  L.ceu = camada(-900, -900, 5100, 1150, 0.3, pintaCeu, 2000, 0.18); await pausa();
  L.muralha = camada(1300, 190, 5000, 1125, 0.9, pintaMuralha, 2900, 0.07); await pausa();
  L.vale = camada(1400, 740, 4900, 1640, 1.45, pintaVale, 2900, 0.03); await pausa();
  L.barragem = camada(-700, 270, 1860, 1525, 1, pintaBarragem); await pausa();
  L.hotel = camada(340, 430, 1460, 1545, 2.2, pintaHotel); await pausa();
  L.frente = camada(-700, 1470, 4900, 2450, 1.15, pintaFrente, 900, -0.05); await pausa();
}

function ajusta() {
  const cw = caixa.clientWidth || innerWidth, ch = caixa.clientHeight || innerHeight;
  const fh = ch / cw > 0.8 ? cw * 0.5625 : ch, mx = 0.08, my = 0.14;
  const w = cw * (1 + 2 * mx), h = fh * (1 + 2 * my), dpr = Math.min(devicePixelRatio || 1, 1.5), esc = Math.min(dpr, 2100 / w) * redu;
  const pw = Math.round(w * esc), ph = Math.round(h * esc);
  if (cv.width !== pw || cv.height !== ph) {
    cv.width = pw; cv.height = ph;
    cv.style.width = w + "px"; cv.style.height = h + "px"; cv.style.left = -cw * mx + "px"; cv.style.top = (ch - fh) / 2 - fh * my + "px";
  }
  return mx;
}

function plaquinha(g) {
  // placa de bronze
  g.fillStyle = "rgba(40,18,18,.4)"; g.fillRect(993, 1294, 128, 80);
  g.fillStyle = grad(g, 995, 1290, 1115, 1368, 0, "#9a7a40", 0.35, "#7c5d2c", 0.7, "#8a6a35", 1, "#55401e"); g.fillRect(995, 1290, 120, 78);
  g.strokeStyle = "#3f2f16"; g.lineWidth = 2; g.strokeRect(996, 1291, 118, 76); g.strokeStyle = "rgba(240,214,150,.45)"; g.lineWidth = 1; g.strokeRect(1000, 1295, 110, 68);
  g.fillStyle = "#3a2b14"; for (const [x, y] of [[1003, 1298], [1107, 1298], [1003, 1360], [1107, 1360]]) { g.beginPath(); g.arc(x, y, 1.7, 0, TAU); g.fill(); }
  g.textAlign = "center"; g.font = "11px Georgia, serif";
  g.fillStyle = "rgba(40,28,10,.8)"; g.fillText("INAUGURAÇÃO", 1055.6, 1318.8); g.fillStyle = "#e6c88c"; g.fillText("INAUGURAÇÃO", 1055, 1318);
  g.font = "19px Georgia, serif"; g.fillStyle = "rgba(40,28,10,.8)"; g.fillText("4·V·1974", 1055.8, 1352.9); g.fillStyle = "#f3d9a0"; g.fillText("4·V·1974", 1055, 1352);
  // o pano, que o vento levanta
  const p = E.pano, t = performance.now() / 1000, bal = Math.sin(t * 5.1) * 0.02 * (0.3 + p) + Math.sin(t * 1.3) * 0.012;
  g.save(); g.translate(992, 1284); g.transform(1, 0, Math.tan(-0.26 * p + bal), 1, 0, 0); g.scale(1, 1 - 0.68 * p);
  const forma = () => { g.beginPath(); g.moveTo(-4, -1); g.quadraticCurveTo(62, 7, 130, -1); g.quadraticCurveTo(136, 44, 126, 90); g.quadraticCurveTo(112, 97 + bal * 200, 96, 88); g.quadraticCurveTo(80, 100, 62, 92); g.quadraticCurveTo(40, 101 - bal * 200, 24, 91); g.quadraticCurveTo(10, 97, -2, 88); g.quadraticCurveTo(-9, 44, -4, -1); g.closePath(); };
  g.shadowColor = "rgba(30,10,10,.55)"; g.shadowBlur = 10; g.shadowOffsetY = 5; g.shadowOffsetX = 2;
  forma(); g.fillStyle = "#d3ccbc"; g.fill(); g.shadowColor = "transparent"; g.save(); g.clip();
  const dob = [[8, 9, 0.2], [27, 14, 0.3], [49, 8, 0.16], [66, 17, 0.32], [92, 11, 0.22], [113, 13, 0.28]];
  for (const [dx, lw, al] of dob) { g.fillStyle = grad(g, dx - lw, 0, dx + lw, 0, 0, "rgba(70,62,50,0)", 0.5, `rgba(70,62,50,${al})`, 1, "rgba(70,62,50,0)"); poly(g, [dx - lw, -4, dx + lw, -4, dx + lw * 1.5 + 5, 104, dx - lw * 1.5 + 5, 104]);
    g.fillStyle = grad(g, dx + lw * 0.6, 0, dx + lw * 2.2, 0, 0, "rgba(255,252,240,0)", 0.5, `rgba(255,252,240,${al * 0.7})`, 1, "rgba(255,252,240,0)"); poly(g, [dx + lw * 0.6, -4, dx + lw * 2.2, -4, dx + lw * 2.6 + 5, 104, dx + lw + 5, 104]); }
  g.fillStyle = grad(g, 0, 0, 0, 100, 0, "rgba(60,54,44,.34)", 0.12, "rgba(60,54,44,0)", 0.78, "rgba(60,54,44,0)", 1, "rgba(60,54,44,.36)"); g.fillRect(-10, -6, 150, 112);
  padrao(g, T.sombra2, -10, -6, 150, 112, 0.12, 0.12, 0, 0, 0.3, "source-over");
  g.restore();
  g.fillStyle = "#3a3026"; for (const nx of [-1, 127]) { g.beginPath(); g.arc(nx, 1, 2.2, 0, TAU); g.fill(); }
  g.restore();
}

function sinoVivo(g) {
  g.save(); g.translate(2955, 876); g.rotate(E.sino);
  g.strokeStyle = "#2a2118"; g.lineWidth = 3; g.beginPath(); g.moveTo(-12, 0); g.lineTo(12, 0); g.stroke();
  g.fillStyle = grad(g, -15, 0, 15, 0, 0, "#2a2116", 0.35, "#6e5c38", 0.6, "#4a3c24", 1, "#1e1810");
  g.beginPath(); g.moveTo(-7, 3); g.quadraticCurveTo(-9, 20, -15, 27); g.lineTo(15, 27); g.quadraticCurveTo(9, 20, 7, 3); g.quadraticCurveTo(0, -2, -7, 3); g.closePath(); g.fill();
  g.fillStyle = "#1a140d"; g.beginPath(); g.arc(-E.sino * 9, 29, 3.2, 0, TAU); g.fill();
  g.restore();
}

/* ---------- quadro ---------- */
export function quadro(v, now) {
  if (!cv) return;
  { const dt = now - qant; qant = now; if (dt > 0 && dt < 250) { qsoma += dt; if (++qn >= 50) { if (qsoma / qn > 30) redu = Math.max(0.5, redu * 0.8); qn = qsoma = 0; } } }
  const mx = ajusta(), t = now / 1000, W = cv.width, Hh = cv.height, vw = v.w * (1 + 2 * mx), s = W / vw, vh = Hh / s;
  const vx = v.x - vw / 2, vy = v.y - vh / 2, g = ctx;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.fillStyle = "#0a0d0e"; g.fillRect(0, 0, W, Hh);
  g.setTransform(s, 0, 0, s, -vx * s, -vy * s); g.imageSmoothingQuality = "high";
  const des = (Lc) => { const ox = (v.x - Lc.ax) * Lc.p; g.drawImage(Lc.c, Lc.x0 + ox, Lc.y0, Lc.w, Lc.h); return ox; };
  const dentro = (x0, y0, x1, y1) => x1 > vx && x0 < vx + vw && y1 > vy && y0 < vy + vh;
  const telha = (img, x, y, tw_, th, desl, alfa) => { g.globalAlpha = alfa; const d = ((desl % tw_) + tw_) % tw_; for (let px = Math.floor((vx - x - d) / tw_) * tw_ + x + d; px < vx + vw; px += tw_) g.drawImage(img, px, y, tw_ + 1, th); g.globalAlpha = 1; };

  // céu e nuvens
  let ox = des(L.ceu);
  if (vy < 700) {
    telha(P.nuvem1, 0, -1000, 3400, 1500, ox + t * 7, 0.95);
    telha(P.nuvem2, 0, -640, 2300, 1050, ox * 1.3 + t * 15 + 700, 0.7);
    // urubus rodando sobre a cidade
    g.strokeStyle = "rgba(14,14,14,.8)"; g.lineCap = "round";
    for (let i = 0; i < 5; i++) {
      const a = t * (0.16 + i * 0.013) + i * 1.9, rx = 150 + i * 46, bx = 3050 + ox * 0.5 + Math.cos(a) * rx + i * 60, by = 80 - i * 34 + Math.sin(a) * rx * 0.3, e = 9 + i * 1.2 + Math.sin(a) * 2, incl = Math.cos(a) * 0.3;
      g.lineWidth = 1.8; g.beginPath(); g.moveTo(bx - e * 1.6, by - e * (0.25 + incl)); g.quadraticCurveTo(bx - e * 0.6, by - e * 0.1, bx, by + 1); g.quadraticCurveTo(bx + e * 0.6, by - e * 0.1, bx + e * 1.6, by - e * (0.25 - incl)); g.stroke();
    }
  }
  // muralha d'água, viva
  if (dentro(1300, 190, 5000, 1125)) {
    ox = des(L.muralha);
    g.save(); g.translate(ox, 0); g.clip(P.muralha);
    padrao(g, T.agua, vx - ox, 200, vw, 930, 2.2, 6.5, 0, -t * 9, 0.13, "source-over");
    padrao(g, T.agua, vx - ox, 200, vw, 930, 4.4, 3.2, 300 + Math.sin(t * 0.21) * 40, -t * 4, 0.12, "source-over");
    padrao(g, T.sombra, vx - ox, 200, vw, 930, 4, 5, Math.sin(t * 0.05) * 80, -t * 3, 0.14, "source-over");
    g.restore();
    telha(P.nevoa1, 0, 900, 2600, 300, t * 9, 0.85);
  }
  // vale e cidade
  if (dentro(1400, 740, 4900, 1640)) {
    ox = des(L.vale);
    g.save(); g.translate(ox, 0); sinoVivo(g); g.restore();
    telha(P.nevoa2, 0, 1000, 2100, 220, -t * 14, 0.4);
    telha(P.nevoa1, 0, 1180, 3000, 300, t * 11 + 900, 0.28);
  }
  if (dentro(-700, 270, 1860, 1525)) des(L.barragem);
  if (dentro(340, 430, 1460, 1545)) { des(L.hotel); plaquinha(g); }
  // o chão onde você acorda
  ox = des(L.frente);
  g.save(); g.translate(ox, 0);
  if (E.ergue >= 0) corpo(g, 1010, 1640, 0.6, E.ergue, { camisa: "#1d2422", calca: "#14110d" });
  for (let i = ondas.length - 1; i >= 0; i--) {
    const o = ondas[i], k = (now - o.t0) / 2200; if (k >= 1) { ondas.splice(i, 1); continue; }
    g.strokeStyle = `rgba(226,232,222,${0.5 * (1 - k)})`; g.lineWidth = 1.4;
    for (const f of [1, 0.55]) { g.beginPath(); g.ellipse(o.x, o.y, 4 + k * 54 * f, (4 + k * 54 * f) * 0.16, 0, 0, TAU); g.stroke(); }
  }
  g.restore();
  telha(P.nevoa2, 0, 1420, 3600, 520, t * 20, 0.2);
  // leve névoa geral, para assentar as cores
  g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "rgba(96,112,110,.07)"; g.fillRect(0, 0, W, Hh);
  const gx = (Math.random() * 256) | 0, gy = (Math.random() * 256) | 0; g.translate(gx, gy); g.fillStyle = P.grao; g.fillRect(-gx, -gy, W, Hh);
}

function pingaNaPoca() { const [cx, cy, rx, ry] = POCAS[(Math.random() * 3) | 0], a = Math.random() * TAU, d = Math.sqrt(Math.random()) * 0.7; ondas.push({ x: cx + Math.cos(a) * rx * d, y: cy + Math.sin(a) * ry * d, t0: performance.now() }); }

/* ---------- roteiro: o mesmo despertar ---------- */
export async function roteiro(a) {
  const { animar, olhos, piscar, diz, limpa, cartaz, escurece, espera, som } = a;
  const zumbido = som.zumbido(), vento = som.vento();
  let gotas = setInterval(() => { som.pingo(0.08 + Math.random() * 0.1); pingaNaPoca(); }, 1700);
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
    tw("pano", 1, 2400, (t) => 1 - Math.pow(1 - t, 3));
    await diz("Ao lado da porta, uma placa coberta por um pano. Uma rajada levanta a ponta: 1974.", { segura: 1400 });
    vento.alvo(0.5, 2);
    tw("pano", 0.22, 2600);
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
    tw("ergue", 1, 3600);
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
      tw("sino", i % 2 ? 0.42 : -0.42, 1400);
      a.cam.tremor = 0.6; setTimeout(() => (a.cam.tremor = 0), 400);
      await espera(2700);
    }
    tw("sino", 0, 1800);
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
