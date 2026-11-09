/* Motor da cutscene: câmera em primeira pessoa (viewBox), pálpebras, foco, legendas e título.
   Abre em tela cheia no Owlbear (modal) ou direto no navegador para testar. */
import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
import * as SOM from "./som.js?v=1.1.0";
import { CENAS } from "./cenas.js?v=1.1.0";

const NS = "io.github.pebarrosdenashor.hexatombe-cutscene";
const MODAL = NS + "/cena";
const q = new URLSearchParams(location.search);
const idCena = q.get("c") || "abertura";
const VEL = Math.max(0.1, +q.get("vel") || 1); // só para testes
const $ = (s) => document.querySelector(s);

const palco = $("#palco"), olhoC = $("#olho-c"), olhoB = $("#olho-b"), mundo = $("#mundo");
const leg = $("#legenda"), titulo = $("#titulo"), porta = $("#porta"), veu = $("#veu");

let parado = false;
class Parou extends Error {}
const checa = () => { if (parado) throw new Parou(); };
const espera = (ms) => new Promise((ok, erro) => {
  const t0 = performance.now();
  const passo = () => { if (parado) return erro(new Parou()); if (performance.now() - t0 >= ms / VEL) return ok(); requestAnimationFrame(passo); };
  passo();
});
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- câmera ---------- */
let svg = null;
const cam = { x: 0, y: 0, w: 1000, rot: 0, blur: 0, luz: 1, tremor: 0, balanco: 1 };
const anims = new Set();
function animar(alvos, ms, curva = ease) {
  checa();
  const ini = {}; for (const k in alvos) ini[k] = cam[k];
  return new Promise((ok) => {
    const a = { t0: performance.now(), ms: Math.max(ms / VEL, 1), passo(now) {
      const t = Math.min(1, (now - this.t0) / this.ms), e = curva(t);
      for (const k in alvos) cam[k] = lerp(ini[k], alvos[k], e);
      if (t >= 1) { anims.delete(this); ok(); }
    } };
    anims.add(a);
  });
}
function desenhar(now) {
  anims.forEach((a) => a.passo(now));
  if (svg) {
    const asp = innerHeight / innerWidth, s = now / 1000;
    const bx = (Math.sin(s * 0.53) * 9 + Math.sin(s * 1.31) * 4) * cam.balanco * (cam.w / 1600);
    const by = (Math.sin(s * 0.41 + 1) * 7 + Math.sin(s * 0.97) * 3) * cam.balanco * (cam.w / 1600);
    const tx = cam.tremor ? (Math.random() - 0.5) * cam.tremor * cam.w / 400 : 0;
    const ty = cam.tremor ? (Math.random() - 0.5) * cam.tremor * cam.w / 400 : 0;
    const h = cam.w * asp;
    svg.setAttribute("viewBox", `${(cam.x - cam.w / 2 + bx + tx).toFixed(1)} ${(cam.y - h / 2 + by + ty).toFixed(1)} ${cam.w.toFixed(1)} ${h.toFixed(1)}`);
    mundo.style.transform = `rotate(${(cam.rot + Math.sin(s * 0.37) * 0.35 * cam.balanco).toFixed(2)}deg) scale(1.08)`;
    mundo.style.filter = `blur(${cam.blur.toFixed(1)}px) brightness(${cam.luz.toFixed(3)}) saturate(${(0.55 + cam.luz * 0.35).toFixed(2)})`;
  }
  requestAnimationFrame(desenhar);
}

/* ---------- pálpebras: 0 fechado, 1 aberto ---------- */
let abertura = 0;
function olhos(v, ms = 1200) {
  checa();
  const ini = abertura;
  return new Promise((ok) => {
    const t0 = performance.now();
    const passo = (now) => {
      const t = Math.min(1, (now - t0) / Math.max(ms / VEL, 1)); abertura = lerp(ini, v, ease(t));
      const p = (1 - abertura) * 50; // % da tela coberta por cada pálpebra
      olhoC.style.transform = `translateY(${-100 + p * 2}%)`;
      olhoB.style.transform = `translateY(${100 - p * 2}%)`;
      if (t < 1 && !parado) requestAnimationFrame(passo); else ok();
    };
    requestAnimationFrame(passo);
  });
}
async function piscar(ms = 260) { await olhos(0, ms); await olhos(1, ms * 1.3); }

/* ---------- legendas ---------- */
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
async function diz(txt, { segura = 2400, vel = 34, classe = "" } = {}) {
  checa();
  leg.className = "legenda vis " + classe; leg.innerHTML = "";
  const span = document.createElement("span"); leg.appendChild(span);
  for (let i = 1; i <= txt.length; i++) {
    span.innerHTML = esc(txt.slice(0, i)) + `<i class="resto">${esc(txt.slice(i))}</i>`;
    const c = txt[i - 1];
    await espera(c === "." || c === "?" || c === "!" ? vel * 9 : c === "," || c === ":" ? vel * 5 : vel);
  }
  span.textContent = txt;
  await espera(segura);
}
async function limpa(ms = 600) { leg.classList.remove("vis"); await espera(ms); }

async function cartaz(html, ms = 1800) { checa(); titulo.innerHTML = html; titulo.classList.add("vis"); await espera(ms); }
async function escurece(v = 1, ms = 1500) { checa(); veu.style.transition = `opacity ${ms}ms ease`; veu.style.opacity = String(v); await espera(ms); }

const api = { animar, olhos, piscar, diz, limpa, cartaz, escurece, espera, som: SOM, cam,
  mundo: () => svg, el: (s) => svg.querySelector(s) };

/* ---------- ciclo ---------- */
function grao() {
  const cv = $("#grao"), ctx = cv.getContext("2d"); cv.width = 240; cv.height = 140;
  const img = ctx.createImageData(240, 140);
  setInterval(() => {
    for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    ctx.putImageData(img, 0, 0);
  }, 80);
}

async function fechar() {
  parado = true; SOM.silenciar(0.8);
  try { if (OBR.isAvailable) { await OBR.modal.close(MODAL); return; } } catch { /* */ }
  if (window.opener) window.close(); else location.reload();
}

async function tocar() {
  const def = CENAS[idCena]; if (!def) { porta.querySelector("p").textContent = "Cena não encontrada."; return; }
  const mod = await def.carregar();
  mundo.innerHTML = mod.mundo(); svg = mundo.querySelector("svg");
  Object.assign(cam, mod.camInicial || {});
  porta.querySelector("h2").textContent = def.convite || "Clique para abrir os olhos";
  porta.classList.add("pronto");
  porta.addEventListener("click", async () => {
    SOM.iniciar(); porta.classList.add("sai");
    setTimeout(() => porta.remove(), 1200);
    try { await mod.roteiro(api); $("#fim").classList.add("vis"); }
    catch (e) { if (!(e instanceof Parou)) console.error(e); }
  }, { once: true });
}

addEventListener("keydown", (e) => { if (e.key === "Escape") fechar(); });
$("#fim").addEventListener("click", fechar);
$("#sair").addEventListener("click", fechar);
if (OBR.isAvailable) OBR.onReady(() => {
  OBR.broadcast.onMessage(NS + "/msg", (ev) => { if (ev.data?.kind === "fechar") fechar(); });
});
grao(); requestAnimationFrame(desenhar); tocar();
