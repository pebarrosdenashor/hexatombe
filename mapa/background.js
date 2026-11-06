/* Fundo da extensão (roda mesmo com a janela fechada):
   - jogadores: avisa quando o mestre libera algo novo no mapa ou o dia muda
   - mestre: troca a imagem do mapa na cena quando o dia do Hexatombe muda */
import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
import { DIAS_JOGADOR } from "./locais.js";

const NS = "io.github.pebarrosdenashor.hexatombe-mapa";
const PUB = NS + "/pub";
const IMG_KEY = NS + "/imagem";
const HEX_STATE = "io.github.pebarrosdenashor.hexatombe/state";
const BASE = new URL(".", location.href).href;

let gm = false, hexDia = null, ultimo = null, pendentes = 0;

const assinatura = (l) => JSON.stringify([l.estado, l.eq, l.txt, l.din, l.alerta, l.alaga]);
const lerHex = (md) => { const d = md?.[HEX_STATE]?.dia; return Number.isFinite(+d) && +d >= 1 && +d <= 6 ? +d : null; };
const diaDe = (p) => (p?.seguir && hexDia) ? hexDia : (p?.dia || 1);

function badge() {
  try {
    if (pendentes) { OBR.action.setBadgeText(String(pendentes)); OBR.action.setBadgeBackgroundColor("#b23a2e"); }
    else OBR.action.setBadgeText(undefined);
  } catch { /* */ }
}

async function compararPub(p) {
  if (gm || !p) return;
  if (ultimo) {
    const antes = new Map((ultimo.locais || []).map((l) => [l.id, assinatura(l)]));
    const novos = [], mudou = [];
    for (const l of p.locais || []) {
      if (!antes.has(l.id)) novos.push(l.nome);
      else if (antes.get(l.id) !== assinatura(l)) mudou.push(l.nome);
    }
    if (novos.length) OBR.notification.show(`Mapa: ${novos.join(", ")} ${novos.length > 1 ? "apareceram" : "apareceu"} no mapa.`);
    else if (mudou.length) OBR.notification.show(`Mapa: vocês sabem mais sobre ${mudou.join(", ")}.`);
    const d0 = diaDe(ultimo), d1 = diaDe(p);
    if (d1 !== d0) OBR.notification.show(`Dia ${d1}: ${DIAS_JOGADOR[d1][1]}`);
    if (novos.length || mudou.length || d1 !== d0) { pendentes++; badge(); }
  }
  ultimo = p;
}

async function trocarImagem() {
  if (!gm || !hexDia) return;
  let s = null; try { s = JSON.parse(localStorage.getItem(NS + "/gm/" + OBR.room.id) || "null"); } catch { /* */ }
  if (!s?.auto || !s?.seguir) return;
  if (!(await OBR.scene.isReady())) return;
  const itens = await OBR.scene.items.getItems((i) => i.metadata?.[IMG_KEY]);
  if (!itens.length || itens[0].metadata[IMG_KEY].dia === hexDia) return;
  const dia = hexDia;
  await OBR.scene.items.updateItems(itens.map((i) => i.id), (ds) => { for (const d of ds) { d.image.url = BASE + `imagens/dia-${dia}.png`; d.name = `Bom Jesus do Açude · dia ${dia}`; d.metadata[IMG_KEY] = { dia }; } });
}

OBR.onReady(async () => {
  gm = (await OBR.player.getRole()) === "GM";
  OBR.player.onChange((p) => { gm = p.role === "GM"; });
  try { hexDia = lerHex(await OBR.room.getMetadata()); } catch { /* */ }
  OBR.room.onMetadataChange((md) => {
    const d = lerHex(md); if (d === hexDia) return;
    const antes = ultimo ? diaDe(ultimo) : null; hexDia = d;
    if (!gm && ultimo && ultimo.seguir && d && d !== antes) { OBR.notification.show(`Dia ${d}: ${DIAS_JOGADOR[d][1]}`); pendentes++; badge(); }
    trocarImagem();
  });
  const lerCena = async () => { if (await OBR.scene.isReady()) { ultimo = (await OBR.scene.getMetadata())[PUB] || null; } };
  OBR.scene.onReadyChange(lerCena);
  OBR.scene.onMetadataChange((md) => compararPub(md[PUB] || null));
  // quando o jogador abre o mapa, o próprio mapa limpa o contador
  try { OBR.action.onOpenChange((aberto) => { if (aberto) { pendentes = 0; badge(); } }); } catch { /* versão antiga do Owlbear */ }
  await lerCena();
});
