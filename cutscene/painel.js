import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
import { CENAS } from "./cenas.js?v=1.1.0";

const NS = "io.github.pebarrosdenashor.hexatombe-cutscene";
const CH = NS + "/msg", MODAL = NS + "/cena";
const BASE = new URL(".", location.href).href;
const $l = document.getElementById("lista");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function montar(gm) {
  if (!gm) { $l.innerHTML = `<div class="aviso">O mestre controla as cutscenes. Quando ele tocar uma, ela abre na sua tela.</div>`; return; }
  document.getElementById("rodape").hidden = false;
  let grupo = null;
  $l.innerHTML = Object.entries(CENAS).map(([id, c]) => {
    const cab = c.grupo && c.grupo !== grupo ? `<div class="eyebrow grupo">${esc((grupo = c.grupo))}</div>` : "";
    return cab + `
    <div class="cena"><h2>${esc(c.nome)}</h2><p>${esc(c.resumo)}</p><span class="mini">${esc(c.duracao || "")}</span>
      <div class="acoes"><button class="prim" data-tocar="${id}">Tocar para todos</button><button data-testar="${id}">Testar só pra mim</button></div></div>`;
  }).join("");
}

$l.addEventListener("click", async (e) => {
  const b = e.target.closest("button"); if (!b) return;
  const id = b.dataset.tocar || b.dataset.testar;
  if (!OBR.isAvailable) { window.open(`cena.html?c=${id}`, "_blank"); return; }
  if (b.dataset.tocar) await OBR.broadcast.sendMessage(CH, { kind: "tocar", cena: id, n: Date.now() }, { destination: "ALL" });
  else await OBR.modal.open({ id: MODAL, url: `${BASE}cena.html?v=1.1.0&c=${id}`, fullScreen: true, hidePaper: true });
});
document.getElementById("parar").addEventListener("click", () => {
  if (OBR.isAvailable) OBR.broadcast.sendMessage(CH, { kind: "fechar" }, { destination: "ALL" }).catch(() => {});
});

if (OBR.isAvailable) OBR.onReady(async () => montar((await OBR.player.getRole()) === "GM"));
else montar(true);
