import OBR, { buildShape } from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";

/* Fica rodando enquanto a sala está aberta, mesmo com a janela do Hexatombe fechada:
   - toca o sino e deixa o mapa vermelho quando um sacrifício é realizado
   - guarda (para o mestre) os desejos enviados pelos jogadores
   - mantém o estado do ritual sincronizado: o mestre responde aos jogadores que chegam,
     e os jogadores guardam a versão mais nova para abrir a janela já atualizada */

const NS = "io.github.pebarrosdenashor.hexatombe";
const CHANNEL = NS + "/roll";
let role = "PLAYER", roomId = "";
let actx = null;

function bell() {
  try { if (localStorage.getItem(NS + ":som") === "0") return; } catch { /* */ }
  try {
    const c = (actx ||= new (window.AudioContext || window.webkitAudioContext)());
    if (c.state === "suspended") c.resume();
    const t0 = c.currentTime + 0.05;
    for (let k = 0; k < 3; k++) {
      const t = t0 + k * 1.6;
      for (const [mult, amp, dec] of [[1, 0.5, 4.5], [2.0, 0.25, 3.5], [2.76, 0.2, 2.5], [5.4, 0.08, 1.2], [0.5, 0.3, 5]]) {
        const o = c.createOscillator(); const g = c.createGain();
        o.type = "sine"; o.frequency.value = 98 * mult;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(amp * 0.6, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
        o.connect(g).connect(c.destination); o.start(t); o.stop(t + dec + 0.1);
      }
    }
  } catch { /* sem áudio */ }
}
function guardarDesejo(d) {
  const k = NS + ":desejos:" + roomId;
  try {
    const ds = JSON.parse(localStorage.getItem(k) || "[]");
    if (ds.some((x) => x.id === d.id)) return;
    const i = ds.findIndex((x) => x.nome === d.nome); if (i >= 0) ds.splice(i, 1);
    ds.unshift(d); localStorage.setItem(k, JSON.stringify(ds.slice(0, 40)));
  } catch { /* */ }
}

const SYNC = NS + "/state";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const parts = {};
async function sendChunks(payload) {
  const str = JSON.stringify(payload); const n = Math.max(1, Math.ceil(str.length / 5000)); const m = uid();
  for (let i = 0; i < n; i++) { try { await OBR.broadcast.sendMessage(SYNC, { m, i, n, d: str.slice(i * 5000, (i + 1) * 5000) }); } catch { return; } if (n > 1) await sleep(60); }
}
const stateKey = () => NS + ":state:" + roomId;
async function onSync(obj) {
  if (obj.kind === "hello" && role === "GM") {
    if (await OBR.action.isOpen()) return; // a janela aberta responde sozinha
    try { const st = JSON.parse(localStorage.getItem(stateKey()) || "null"); if (st) sendChunks({ kind: "state", state: st }); } catch { /* */ }
  }
  if (obj.kind === "diario" && role === "GM") {
    if (await OBR.action.isOpen()) return; // a janela aberta cuida disso
    try {
      const st = JSON.parse(localStorage.getItem(stateKey()) || "null"); if (!st) return;
      st.diarios ||= {}; const cur = st.diarios[obj.ti];
      if (cur && (Number(cur.at) || 0) > (Number(obj.at) || 0)) return;
      st.diarios[obj.ti] = { text: obj.text, by: obj.by, at: obj.at }; st.rev = Date.now();
      localStorage.setItem(stateKey(), JSON.stringify(st)); sendChunks({ kind: "state", state: st });
    } catch { /* */ }
  }
  if (obj.kind === "state" && obj.state && role !== "GM") {
    try {
      const cur = JSON.parse(localStorage.getItem(stateKey()) || "null");
      if (!cur || (Number(obj.state.rev) || 0) > (Number(cur.rev) || 0)) localStorage.setItem(stateKey(), JSON.stringify(obj.state));
    } catch { /* */ }
  }
}
function onChunk(d) {
  if (!d?.m) return;
  const p = (parts[d.m] ||= { n: d.n, parts: [], got: 0, at: Date.now() });
  if (p.parts[d.i] === undefined) { p.parts[d.i] = d.d; p.got++; }
  if (p.got === p.n) { delete parts[d.m]; try { onSync(JSON.parse(p.parts.join(""))); } catch { /* */ } }
}
async function redFlash() {
  try {
    if (!(await OBR.scene.isReady())) return;
    const id = NS + "-sangue";
    await OBR.scene.local.deleteItems([id]).catch(() => {});
    const shape = buildShape().id(id).shapeType("RECTANGLE").width(400000).height(400000).position({ x: -200000, y: -200000 })
      .fillColor("#b0001a").fillOpacity(0.45).strokeWidth(0).strokeOpacity(0).layer("TEXT").locked(true).disableHit(true).build();
    await OBR.scene.local.addItems([shape]);
    for (const o of [0.25, 0.5, 0.25, 0.5, 0.3, 0.45, 0.25, 0.12, 0.05]) { await sleep(550); await OBR.scene.local.updateItems([id], (ds) => { for (const x of ds) x.style.fillOpacity = o; }); }
    await OBR.scene.local.deleteItems([id]);
  } catch { /* */ }
}

OBR.onReady(async () => {
  roomId = OBR.room.id;
  role = await OBR.player.getRole();
  OBR.player.onChange((p) => { role = p.role; });
  OBR.broadcast.onMessage(SYNC, (ev) => onChunk(ev.data));
  OBR.broadcast.onMessage(CHANNEL, async (ev) => {
    const d = ev.data || {};
    if (d.kind === "desejo") { if (role === "GM" && d.desejo) guardarDesejo(d.desejo); return; }
    // se a janela do Hexatombe estiver aberta, ela mesma não toca o sino recebido; quem toca é este fundo
    if (d.sino) { bell(); redFlash(); }
  });
});
