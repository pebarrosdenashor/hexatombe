import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
import { NS, velasHTML, VELAS_CSS, pref } from "./ritmo.js?v=2.17.0";

/* Cartão de abertura do dia / da noite, em tela cheia, aberto pelo fundo da extensão.
   Fecha sozinho depois de alguns segundos ou com um clique. */
const KEY = NS + ":cartao";
const ID = NS + "/cartao";
const $ = (id) => document.getElementById(id);
document.getElementById("vcss").textContent = VELAS_CSS;

let c = null; try { c = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { /* */ }
const calmo = pref.calmo();

let fechando = false;
function fechar() {
  if (fechando) return; fechando = true;
  document.body.classList.add("sai");
  setTimeout(() => { if (OBR.isAvailable) OBR.modal.close(ID).catch(() => {}); else window.close(); }, calmo ? 300 : 1100);
}

function montar() {
  if (!c) { fechar(); return; }
  const b = document.body;
  b.classList.add(c.evt === "dia" ? "dia" : "noite");
  if (c.lua) b.classList.add("lua");
  if (calmo) b.classList.add("calmo");
  $("kicker").textContent = c.kicker || "";
  $("titulo").textContent = c.titulo || "";
  $("sub").textContent = c.sub || "";
  $("info").textContent = c.info || "";
  $("velas").innerHTML = c.velasSt ? velasHTML(c.velasSt, { novas: [], w: 34, h: 70 }) : "";
  // a frase aparece palavra por palavra
  const palavras = String(c.frase || "").split(/\s+/).filter(Boolean);
  $("frase").innerHTML = palavras.map((p) => `<span>${p.replace(/[&<>]/g, (x) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[x]))}</span>`).join(" ");
  requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add("on")));
  const spans = [...$("frase").querySelectorAll("span")];
  const ini = calmo ? 200 : 2900, passo = calmo ? 0 : 140;
  spans.forEach((s, i) => setTimeout(() => s.classList.add("v"), ini + i * passo));
  const fimFrase = ini + spans.length * passo;
  setTimeout(() => b.classList.add("mostra-info"), fimFrase + (calmo ? 0 : 400));
  setTimeout(fechar, Math.max(7500, fimFrase + 3800));
}

document.addEventListener("click", fechar);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" || e.key === " " || e.key === "Enter") fechar(); });
// cartão velho (aberto de novo sem querer): fecha logo
if (c && Date.now() - (Number(c.at) || 0) > 60000) c = null;
montar();
