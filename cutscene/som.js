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

export function rangido(dur = 1.4, vol = 0.12) {
  const t = agora() + 0.02, o = C.createOscillator(); o.type = "sawtooth";
  o.frequency.setValueAtTime(95, t); o.frequency.linearRampToValueAtTime(140, t + dur * 0.6); o.frequency.linearRampToValueAtTime(110, t + dur);
  const am = C.createOscillator(); am.frequency.value = 23; const amg = C.createGain(); amg.gain.value = 0.5;
  const g = C.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.15); g.gain.linearRampToValueAtTime(0.0001, t + dur);
  am.connect(amg).connect(g.gain);
  const bp = C.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 900; bp.Q.value = 3;
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
export function sino(vol = 0.7) {
  const t = agora() + 0.03;
  for (const [mult, amp, dec] of [[0.5, 0.35, 7], [1, 0.55, 6], [1.19, 0.25, 4.5], [1.5, 0.18, 4], [2.0, 0.22, 3.5], [2.74, 0.14, 2.6], [5.4, 0.05, 1.2]]) {
    const o = C.createOscillator(); o.frequency.value = 196 * mult;
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

export function silenciar(s = 1.2) {
  if (!mestre) return;
  mestre.gain.cancelScheduledValues(agora());
  mestre.gain.setTargetAtTime(0.0001, agora(), s / 3);
  setTimeout(() => { fontes.forEach((h) => { try { h.no.stop(); } catch { /* */ } }); fontes.clear(); }, s * 1000 + 200);
}
