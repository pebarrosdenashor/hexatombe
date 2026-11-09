import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
import { NS, FASES_R, velas, velasHTML, VELAS_CSS, relogio, mmss, pref, PREF, ehNoite, ehLua, opcoes } from "./ritmo.js?v=2.16.0";

/* Relógio do ritual na tela (popover pequeno sobre o mapa):
   dia e fase, as seis velas e o relógio do sacrifício. */
const ID = NS + "/relogio";
const esc = (x) => String(x ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $hud = document.getElementById("hud");
document.getElementById("vcss").textContent = VELAS_CSS;
let roomId = new URLSearchParams(location.search).get("sala") || "local";
const stKey = () => NS + ":state:" + roomId;
const vistasKey = () => NS + ":velasVistas:" + roomId;

let st = null;
function ler() { try { st = JSON.parse(localStorage.getItem(stKey()) || "null"); } catch { st = null; } }

// velas que apagaram desde a última vez que este navegador viu (para soltar a fumaça uma vez)
function velasNovas() {
  const apagadas = velas(st).filter((v) => !v.acesa).map((v) => v.nome);
  let vistas = null; try { vistas = JSON.parse(localStorage.getItem(vistasKey()) || "null"); } catch { /* */ }
  try { localStorage.setItem(vistasKey(), JSON.stringify(apagadas)); } catch { /* */ }
  if (!Array.isArray(vistas)) return []; // primeira vez: nada de animação
  return apagadas.filter((n) => !vistas.includes(n));
}

function desenhar() {
  ler();
  if (!st?.equipes) { $hud.className = "hud"; $hud.innerHTML = `<div class="vazio">O ritual ainda não começou.</div>`; return; }
  const noite = ehNoite(st), bat = !!(st.batalha && !Array.isArray(st.batalha)), lua = (noite && ehLua(st)) || (bat && st.batalha.vermelho);
  $hud.className = `hud ${lua ? "noite lua" : noite ? "noite" : "dia"} ${pref.calmo() ? "calmo" : ""}`;
  const fase = Number(st.fase) || 0;
  $hud.innerHTML = `<div class="topo"><span class="astro"></span>
      <span class="titulo" title="${bat ? esc(`Batalha de intenções: ${st.batalha.nomes?.[0]} contra ${st.batalha.nomes?.[1]}`) : ""}">DIA ${Number(st.dia) || 1} · ${bat ? "⚔ BATALHA" : noite && ehLua(st) ? "LUA DE SANGUE" : noite ? "NOITE" : FASES_R[fase].toUpperCase()}</span>
      <button class="bt" id="mover" title="Mudar o relógio de lugar">⇄</button><button class="bt" id="fechar" title="Esconder (dá para mostrar de novo na aba Ritual)">✕</button></div>
    <div class="velas-wrap">${velasHTML(st, { novas: velasNovas(), w: 22, h: 44 })}</div>
    <div id="relo"></div>`;
  tique();
}

function tique() {
  const box = document.getElementById("relo"); if (!box || !st) return;
  const r = relogio(st);
  if (!r) {
    const fase = Number(st.fase) || 0;
    box.className = "";
    box.innerHTML = `<div class="fases">${FASES_R.map((f, i) => `<span class="${i === fase ? "on" : i < fase ? "feito" : ""}">${i === 2 ? "Noite" : f}</span>`).join("")}</div>`;
    return;
  }
  const pct = (r.frac * 100).toFixed(2);
  box.className = r.acabou ? "acabou" : r.pausado ? "pausado" : r.restante < 60000 ? "urgente" : "";
  const marca = box.dataset.rid === r.id && box.querySelector(".pavio");
  if (marca) { // só atualiza, para a transição andar suave
    box.querySelector(".pavio i").style.width = pct + "%"; box.querySelector(".pavio b").style.left = pct + "%";
    box.querySelector(".tempo").textContent = mmss(r.restante);
    box.querySelector(".rot").textContent = r.acabou ? "A hora chegou" : `${r.rotulo}${r.pausado ? " · pausado" : ""}`;
    return;
  }
  box.dataset.rid = r.id;
  box.innerHTML = `<div class="relo"><div class="pavio"><i style="width:${pct}%"></i>${r.acabou ? "" : `<b style="left:${pct}%"></b>`}</div><span class="tempo">${mmss(r.restante)}</span></div>
    <div class="rot">${r.acabou ? "A hora chegou" : `${r.rotulo}${r.pausado ? " · pausado" : ""}`}</div>`;
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.id === "fechar") { pref.setHud(false); if (OBR.isAvailable) OBR.popover.close(ID).catch(() => {}); }
  if (b.id === "mover") { const ps = ["topo", "direita", "baixo"]; pref.setPos(ps[(ps.indexOf(pref.pos()) + 1) % ps.length]); } // o fundo reabre no lugar novo
});
window.addEventListener("storage", (e) => {
  if (e.key === stKey() || e.key === vistasKey() || e.key === PREF.calmo) desenhar();
});
setInterval(tique, 1000);

if (OBR.isAvailable) OBR.onReady(() => { roomId = OBR.room.id; desenhar(); if (!opcoes(st).hud && st) OBR.popover.close(ID).catch(() => {}); });
else desenhar();
