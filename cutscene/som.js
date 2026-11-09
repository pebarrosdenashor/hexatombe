/* Sons da cutscene, todos sintetizados na hora (sem arquivos de áudio). */
let C = null, mestre = null, ruido = null;
const fontes = new Set();

export function iniciar() {
  C ||= new (window.AudioContext || window.webkitAudioContext)();
  if (C.state === "suspended") C.resume();
  if (!mestre) {
    mestre = C.createGain(); mestre.gain.value = 0.9;
    const comp = C.createDynamicsCompressor();
    mestre.connect(comp).connect(C.destination);
    const n = C.sampleRate * 3, b = C.createBuffer(1, n, C.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    ruido = b;
  }
  return C;
}
const agora = () => C.currentTime;
function env(g, t, pico, ataque, dur) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(pico, 0.0002), t + ataque);
  g.gain.exponentialRampToValueAtTime(0.0001, t + ataque + dur);
}
function noise() { const s = C.createBufferSource(); s.buffer = ruido; s.loop = true; return s; }
function guardar(no, ...extras) { const h = { no, extras }; fontes.add(h); no.onended = () => fontes.delete(h); return no; }

/* camada contínua com volume controlável: devolve { alvo(v, s), parar(s) } */
function camada(montar) {
  const g = C.createGain(); g.gain.value = 0.0001; g.connect(mestre);
  const nos = montar(g);
  nos.forEach((n) => { n.start?.(); guardar(n); });
  return {
    alvo(v, s = 2) { g.gain.cancelScheduledValues(agora()); g.gain.setTargetAtTime(Math.max(v, 0.0001), agora(), s / 3); },
    parar(s = 2) { this.alvo(0.0001, s); setTimeout(() => nos.forEach((n) => { try { n.stop(); } catch { /* */ } }), s * 1000 + 300); }
  };
}

export const zumbido = () => camada((g) => {
  const o = C.createOscillator(); o.frequency.value = 7400;
  const o2 = C.createOscillator(); o2.frequency.value = 7412;
  const m = C.createGain(); m.gain.value = 0.5;
  o.connect(m); o2.connect(m); m.connect(g); return [o, o2];
});

export const vento = () => camada((g) => {
  const s = noise();
  const bp = C.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 380; bp.Q.value = 0.7;
  const lfo = C.createOscillator(); lfo.frequency.value = 0.11;
  const lg = C.createGain(); lg.gain.value = 220; lfo.connect(lg).connect(bp.frequency);
  const vol = C.createGain(); vol.gain.value = 0.55;
  const lfo2 = C.createOscillator(); lfo2.frequency.value = 0.07;
  const lg2 = C.createGain(); lg2.gain.value = 0.3; lfo2.connect(lg2).connect(vol.gain);
  s.connect(bp).connect(vol).connect(g); return [s, lfo, lfo2];
});

/* ronco grave da muralha d'água */
export const muralha = () => camada((g) => {
  const lp = C.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 160;
  const os = [36.7, 37.3, 55].map((f, i) => { const o = C.createOscillator(); o.type = i < 2 ? "sawtooth" : "sine"; o.frequency.value = f; o.connect(lp); return o; });
  const s = noise(); const lp2 = C.createBiquadFilter(); lp2.type = "lowpass"; lp2.frequency.value = 90;
  const ng = C.createGain(); ng.gain.value = 1.4; s.connect(lp2).connect(ng).connect(g);
  const v = C.createGain(); v.gain.value = 0.5; lp.connect(v).connect(g);
  return [...os, s];
});

export function coracao(intensidade = 1) {
  const t = agora() + 0.02;
  [[0, 1], [0.24, 0.65]].forEach(([dt, a]) => {
    const o = C.createOscillator(); o.frequency.setValueAtTime(70, t + dt); o.frequency.exponentialRampToValueAtTime(38, t + dt + 0.18);
    const g = C.createGain(); env(g, t + dt, 0.9 * a * intensidade, 0.012, 0.22);
    o.connect(g).connect(mestre); o.start(t + dt); o.stop(t + dt + 0.4); guardar(o);
  });
}

export function respiro(dur = 2.2, vol = 0.25) {
  const t = agora() + 0.02, s = noise();
  const f = C.createBiquadFilter(); f.type = "bandpass"; f.frequency.setValueAtTime(700, t); f.frequency.linearRampToValueAtTime(1100, t + dur * 0.5); f.frequency.linearRampToValueAtTime(600, t + dur); f.Q.value = 0.6;
  const g = C.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + dur * 0.35); g.gain.linearRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(mestre); s.start(t); s.stop(t + dur + 0.1); guardar(s);
}

export function pingo(vol = 0.18) {
  const t = agora() + 0.02, o = C.createOscillator(), f0 = 1300 + Math.random() * 900;
  o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 1.9, t + 0.06);
  const g = C.createGain(); env(g, t, vol, 0.003, 0.12);
  o.connect(g).connect(mestre); o.start(t); o.stop(t + 0.2); guardar(o);
}

export function rangido(dur = 1.4, vol = 0.12, base = 95, banda = 900) {
  const t = agora() + 0.02, o = C.createOscillator(); o.type = "sawtooth";
  o.frequency.setValueAtTime(base, t); o.frequency.linearRampToValueAtTime(base * 1.47, t + dur * 0.6); o.frequency.linearRampToValueAtTime(base * 1.16, t + dur);
  const am = C.createOscillator(); am.frequency.value = 23; const amg = C.createGain(); amg.gain.value = 0.5;
  const g = C.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.15); g.gain.linearRampToValueAtTime(0.0001, t + dur);
  am.connect(amg).connect(g.gain);
  const bp = C.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = banda; bp.Q.value = 3;
  o.connect(bp).connect(g).connect(mestre); o.start(t); am.start(t); o.stop(t + dur + 0.1); am.stop(t + dur + 0.1); guardar(o); guardar(am);
}

export function tosse(vol = 0.22) {
  const t = agora() + 0.02;
  [0, 0.28].forEach((dt, i) => {
    const s = noise(), f = C.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 520 - i * 80; f.Q.value = 1.4;
    const g = C.createGain(); env(g, t + dt, vol * (i ? 0.7 : 1), 0.01, 0.2);
    s.connect(f).connect(g).connect(mestre); s.start(t + dt); s.stop(t + dt + 0.35); guardar(s);
  });
}

/* sino da Matriz: grave, com parciais desafinadas de sino de bronze */
export function sino(vol = 0.7, base = 196) {
  const t = agora() + 0.03;
  for (const [mult, amp, dec] of [[0.5, 0.35, 7], [1, 0.55, 6], [1.19, 0.25, 4.5], [1.5, 0.18, 4], [2.0, 0.22, 3.5], [2.74, 0.14, 2.6], [5.4, 0.05, 1.2]]) {
    const o = C.createOscillator(); o.frequency.value = base * mult;
    const g = C.createGain(); env(g, t, amp * vol, 0.006, dec);
    o.connect(g).connect(mestre); o.start(t); o.stop(t + dec + 0.2); guardar(o);
  }
  const s = noise(), f = C.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 2500;
  const g = C.createGain(); env(g, t, 0.12 * vol, 0.002, 0.08);
  s.connect(f).connect(g).connect(mestre); s.start(t); s.stop(t + 0.15); guardar(s);
}

/* batida grave para o título */
export function impacto(vol = 0.9) {
  const t = agora() + 0.02, o = C.createOscillator();
  o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(28, t + 1.6);
  const g = C.createGain(); env(g, t, vol, 0.01, 2.4); o.connect(g).connect(mestre); o.start(t); o.stop(t + 2.6); guardar(o);
  const s = noise(), lp = C.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 300;
  const g2 = C.createGain(); env(g2, t, vol * 0.6, 0.01, 1.5); s.connect(lp).connect(g2).connect(mestre); s.start(t); s.stop(t + 1.7); guardar(s);
}

/* ---------- sons das cenas de equipe ---------- */
function rndS(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }
function saida(pan = 0) {
  if (!pan || !C.createStereoPanner) return mestre;
  const p = C.createStereoPanner(); p.pan.value = pan; p.connect(mestre); return p;
}

/* cântico de romeiros: várias vozes num acorde lento, com vogal "a" */
export const cantico = () => camada((g) => {
  const f1 = C.createBiquadFilter(); f1.type = "bandpass"; f1.frequency.value = 720; f1.Q.value = 4;
  const f2 = C.createBiquadFilter(); f2.type = "bandpass"; f2.frequency.value = 1150; f2.Q.value = 5;
  const lp = C.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2400;
  const v = C.createGain(); v.gain.value = 0.9;
  lp.connect(f1).connect(v); lp.connect(f2).connect(v); v.connect(g);
  const nos = [];
  const vib = C.createOscillator(); vib.frequency.value = 4.6; const vg = C.createGain(); vg.gain.value = 2.2; vib.connect(vg); nos.push(vib);
  const resp = C.createOscillator(); resp.frequency.value = 0.09; const rg = C.createGain(); rg.gain.value = 0.35; nos.push(resp);
  const corpo = C.createGain(); corpo.gain.value = 0.6; resp.connect(rg).connect(corpo.gain); corpo.connect(lp);
  for (const f of [110, 130.8, 164.8, 220, 261.6, 329.6]) for (const d of [-5, 4]) {
    const o = C.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.detune.value = d + (Math.random() - 0.5) * 6;
    vg.connect(o.frequency); const og = C.createGain(); og.gain.value = f > 200 ? 0.07 : 0.1;
    o.connect(og).connect(corpo); nos.push(o);
  }
  return nos;
});

/* sininho de mão (Estação 1) */
export function sininho(vol = 0.35) {
  const t = agora() + 0.02;
  for (let k = 0; k < 5; k++) {
    const tt = t + k * 0.16 + Math.random() * 0.03;
    for (const [m, a, d] of [[1, 0.5, 1.1], [2.76, 0.2, 0.6], [5.4, 0.08, 0.3]]) {
      const o = C.createOscillator(); o.frequency.value = 1560 * m;
      const g = C.createGain(); env(g, tt, a * vol, 0.002, d); o.connect(g).connect(mestre); o.start(tt); o.stop(tt + d + 0.1); guardar(o);
    }
  }
}

/* sino de vaca: lata batida, seco */
export function sinoVaca(vol = 0.5, pan = 0) {
  const t = agora() + 0.02 + Math.random() * 0.05, out = saida(pan), b = 480 + Math.random() * 160;
  for (const [m, a, d] of [[1, 0.5, 0.5], [1.48, 0.35, 0.35], [2.31, 0.25, 0.25], [3.9, 0.12, 0.15]]) {
    const o = C.createOscillator(); o.type = "square"; o.frequency.value = b * m;
    const bp = C.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = b * m; bp.Q.value = 6;
    const g = C.createGain(); env(g, t, a * vol, 0.002, d); o.connect(bp).connect(g).connect(out); o.start(t); o.stop(t + d + 0.1); guardar(o);
  }
}

/* galho estalando */
export function galho(vol = 0.5, pan = 0) {
  const t = agora() + 0.02, out = saida(pan);
  [0, 0.05, 0.13].forEach((dt, i) => {
    const s = noise(), f = C.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1800 + i * 600; f.Q.value = 1.2;
    const g = C.createGain(); env(g, t + dt, vol * (i ? 0.5 : 1), 0.001, 0.05 + i * 0.02);
    s.connect(f).connect(g).connect(out); s.start(t + dt); s.stop(t + dt + 0.15); guardar(s);
  });
}

/* tiro de espingarda, com eco no vale */
export function tiro(vol = 0.9) {
  const t = agora() + 0.02;
  const d = C.createDelay(2); d.delayTime.value = 0.42; const fb = C.createGain(); fb.gain.value = 0.38;
  const dl = C.createBiquadFilter(); dl.type = "lowpass"; dl.frequency.value = 900;
  d.connect(dl).connect(fb).connect(d); dl.connect(mestre);
  const s = noise(), lp = C.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3200;
  const g = C.createGain(); env(g, t, vol, 0.001, 0.3); s.connect(lp).connect(g); g.connect(mestre); g.connect(d);
  s.start(t); s.stop(t + 0.5); guardar(s);
  const o = C.createOscillator(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(35, t + 0.4);
  const g2 = C.createGain(); env(g2, t, vol * 0.9, 0.002, 0.5); o.connect(g2).connect(mestre); o.start(t); o.stop(t + 0.7); guardar(o);
}

/* terra levantada pelo tiro */
export function terra(vol = 0.3) {
  const t = agora() + 0.05, s = noise(), f = C.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 1200;
  const g = C.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
  s.connect(f).connect(g).connect(mestre); s.start(t); s.stop(t + 1.2); guardar(s);
}

/* coruja: dois pios */
export function coruja(vol = 0.25, pan = 0) {
  const t = agora() + 0.02, out = saida(pan);
  [[0, 0.5], [0.62, 0.9]].forEach(([dt, dur]) => {
    const o = C.createOscillator(); o.frequency.setValueAtTime(410, t + dt); o.frequency.linearRampToValueAtTime(370, t + dt + dur);
    const g = C.createGain(); g.gain.setValueAtTime(0.0001, t + dt); g.gain.linearRampToValueAtTime(vol, t + dt + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + dt + dur);
    o.connect(g).connect(out); o.start(t + dt); o.stop(t + dt + dur + 0.1); guardar(o);
  });
}

/* grito de suindara (coruja-das-torres): chiado rasgado */
export function gritoCoruja(vol = 0.35, pan = 0) {
  const t = agora() + 0.02, out = saida(pan), s = noise();
  const f = C.createBiquadFilter(); f.type = "bandpass"; f.frequency.setValueAtTime(2600, t); f.frequency.linearRampToValueAtTime(3400, t + 0.5); f.frequency.linearRampToValueAtTime(2200, t + 1.3); f.Q.value = 3;
  const am = C.createOscillator(); am.frequency.value = 38; const amg = C.createGain(); amg.gain.value = 0.4;
  const g = C.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.12); g.gain.linearRampToValueAtTime(vol * 0.7, t + 1); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
  am.connect(amg).connect(g.gain); s.connect(f).connect(g).connect(out); s.start(t); am.start(t); s.stop(t + 1.5); am.stop(t + 1.5); guardar(s); guardar(am);
}

/* página virando */
export function pagina(vol = 0.18, pan = 0) {
  const t = agora() + 0.02, out = saida(pan), s = noise();
  const f = C.createBiquadFilter(); f.type = "bandpass"; f.frequency.setValueAtTime(1600, t); f.frequency.linearRampToValueAtTime(4200, t + 0.16); f.Q.value = 0.9;
  const g = C.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.05); g.gain.linearRampToValueAtTime(vol * 0.4, t + 0.14); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);
  s.connect(f).connect(g).connect(out); s.start(t); s.stop(t + 0.3); guardar(s);
}

/* sussurro: com a mesma semente, várias vozes falam exatamente juntas */
export function sussurro(dur = 2.4, vol = 0.2, pan = 0, semente = 7, tom = 1) {
  const t = agora() + 0.03, out = saida(pan), r = rndS(semente), s = noise();
  const f = C.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 2.2;
  const f2 = C.createBiquadFilter(); f2.type = "highpass"; f2.frequency.value = 700;
  const g = C.createGain(); g.gain.setValueAtTime(0.0001, t);
  let x = 0;
  while (x < dur) {
    const sil = 0.09 + r() * 0.14, fala = r() < 0.18 ? 0.25 : 0;
    f.frequency.setValueAtTime((1100 + r() * 2200) * tom, t + x);
    g.gain.linearRampToValueAtTime(vol * (0.5 + r() * 0.5), t + x + 0.03);
    g.gain.linearRampToValueAtTime(vol * 0.08, t + x + sil);
    x += sil + fala;
  }
  g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.1);
  s.connect(f2).connect(f).connect(g).connect(out); s.start(t); s.stop(t + dur + 0.2); guardar(s);
}

/* correntes */
export function tilintar(vol = 0.15, pan = 0) {
  const t = agora() + 0.02, out = saida(pan);
  for (let k = 0; k < 6; k++) {
    const tt = t + Math.random() * 0.45, o = C.createOscillator(); o.frequency.value = 2200 + Math.random() * 2600;
    const g = C.createGain(); env(g, tt, vol * (0.4 + Math.random() * 0.6), 0.001, 0.09); o.connect(g).connect(out); o.start(tt); o.stop(tt + 0.15); guardar(o);
  }
}

/* passo em terra ou madeira */
export function passo(vol = 0.25) {
  const t = agora() + 0.02, s = noise(), f = C.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 380;
  const g = C.createGain(); env(g, t, vol, 0.004, 0.13); s.connect(f).connect(g).connect(mestre); s.start(t); s.stop(t + 0.2); guardar(s);
  const o = C.createOscillator(); o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.1);
  const g2 = C.createGain(); env(g2, t, vol * 0.7, 0.004, 0.1); o.connect(g2).connect(mestre); o.start(t); o.stop(t + 0.18); guardar(o);
}

/* mastigar molhado */
export function mastigar(dur = 2, vol = 0.12, pan = 0) {
  const t = agora() + 0.02, out = saida(pan);
  for (let x = 0; x < dur; x += 0.32 + Math.random() * 0.12) {
    const s = noise(), f = C.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 420 + Math.random() * 300; f.Q.value = 1.5;
    const g = C.createGain(); env(g, t + x, vol, 0.02, 0.16); s.connect(f).connect(g).connect(out); s.start(t + x); s.stop(t + x + 0.25); guardar(s);
  }
}

/* insetos: grilos à noite, cigarras com tom alto e contínuo */
export const insetos = (freq = 4400, ritmo = 1.1, pulso = 28) => camada((g) => {
  const o = C.createOscillator(); o.frequency.value = freq;
  const o2 = C.createOscillator(); o2.frequency.value = freq * 1.013;
  const g1 = C.createGain(); g1.gain.value = 0.5;
  const l1 = C.createOscillator(); l1.type = "square"; l1.frequency.value = pulso; const l1g = C.createGain(); l1g.gain.value = 0.5; l1.connect(l1g).connect(g1.gain);
  const g2 = C.createGain(); g2.gain.value = 0.5;
  const l2 = C.createOscillator(); l2.type = "square"; l2.frequency.value = ritmo; const l2g = C.createGain(); l2g.gain.value = 0.5; l2.connect(l2g).connect(g2.gain);
  const v = C.createGain(); v.gain.value = 0.08;
  o.connect(g1); o2.connect(g1); g1.connect(g2).connect(v).connect(g);
  return [o, o2, l1, l2];
});

/* moscas */
export const moscas = () => camada((g) => {
  const lp = C.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1100;
  const nos = [];
  for (const [f, vr] of [[188, 7.3], [214, 5.1], [241, 9.2]]) {
    const o = C.createOscillator(); o.type = "sawtooth"; o.frequency.value = f;
    const l = C.createOscillator(); l.frequency.value = vr; const lg = C.createGain(); lg.gain.value = 18; l.connect(lg).connect(o.frequency);
    const og = C.createGain(); og.gain.value = 0.12; o.connect(og).connect(lp); nos.push(o, l);
  }
  lp.connect(g); return nos;
});

/* zumbido de frio / vapor da câmara fria */
export const vapor = () => camada((g) => {
  const s = noise(), f = C.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 3000;
  const v = C.createGain(); v.gain.value = 0.25; s.connect(f).connect(v).connect(g); return [s];
});

export function silenciar(s = 1.2) {
  if (!mestre) return;
  mestre.gain.cancelScheduledValues(agora());
  mestre.gain.setTargetAtTime(0.0001, agora(), s / 3);
  setTimeout(() => { fontes.forEach((h) => { try { h.no.stop(); } catch { /* */ } }); fontes.clear(); }, s * 1000 + 200);
}
