/* Fundo da extensão: roda mesmo com a janela fechada.
   Só no mestre: mantém as cenas iguais ao estado (melhorias do Hotel, pontos, versão das imagens). */
import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
import { sincronizar, ehPing } from "./sync.js";

let gm = false;
const vai = () => { if (gm) sincronizar(OBR.room.id); };

OBR.onReady(async () => {
  gm = (await OBR.player.getRole()) === "GM";
  OBR.player.onChange((p) => { const g = p.role === "GM"; if (g !== gm) { gm = g; vai(); } });
  OBR.scene.onReadyChange((pronta) => { if (pronta) vai(); });
  window.addEventListener("storage", (ev) => { if (ehPing(ev.key)) vai(); });
  vai();
});
