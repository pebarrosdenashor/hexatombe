import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
import * as IMG from "./imagens.js?v=2.8.0";

const NS = "io.github.pebarrosdenashor.hexatombe";
const KEY = NS + ":handout";
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $doc = document.getElementById("doc");

let espera = null;
function mostrar() {
  let p = null; try { p = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { /* */ }
  clearInterval(espera);
  if (!p) { $doc.innerHTML = `<p class="vazio">Nenhuma pista aberta.</p>`; return; }
  const img = IMG.ehArq(p.img) ? `<img data-arq="${esc(IMG.arqId(p.img))}" alt="" title="Clique para ampliar">`
    : /^https?:\/\//i.test(p.img || "") ? `<img src="${esc(p.img)}" alt="" title="Clique para ampliar">` : "";
  $doc.innerHTML = `${p.titulo ? `<h1>${esc(p.titulo)}</h1>` : ""}${img}${p.texto ? `<div class="txt">${esc(p.texto)}</div>` : ""}`;
  document.title = p.titulo || "Pista";
  $doc.querySelector("img")?.addEventListener("click", () => $doc.classList.toggle("zoom"));
  if (IMG.ehArq(p.img)) {
    // a imagem pode ainda estar chegando do mestre
    let tentativas = 0;
    const tenta = async () => { const falta = await IMG.preencher($doc); if (!falta.length || ++tentativas > 60) clearInterval(espera); };
    tenta(); espera = setInterval(tenta, 500);
  }
}
mostrar();
window.addEventListener("storage", (e) => { if (e.key === KEY) mostrar(); });
document.getElementById("fechar").addEventListener("click", () => {
  if (OBR.isAvailable) OBR.modal.close(NS + "/handout"); else window.close();
});
