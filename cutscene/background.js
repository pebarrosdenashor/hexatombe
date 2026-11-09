/* Fundo da extensão: quando o mestre manda tocar, abre a cutscene em tela cheia para todos. */
import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";

const NS = "io.github.pebarrosdenashor.hexatombe-cutscene";
const CH = NS + "/msg", MODAL = NS + "/cena";
const BASE = new URL(".", location.href).href;

OBR.onReady(() => {
  OBR.broadcast.onMessage(CH, async (ev) => {
    const m = ev.data || {};
    if (m.kind === "tocar") {
      try { await OBR.modal.close(MODAL); } catch { /* */ }
      await OBR.modal.open({ id: MODAL, url: `${BASE}cena.html?v=1.2.0&c=${encodeURIComponent(m.cena)}&n=${m.n}`, fullScreen: true, hidePaper: true });
    } else if (m.kind === "fechar") {
      try { await OBR.modal.close(MODAL); } catch { /* */ }
    }
  });
});
