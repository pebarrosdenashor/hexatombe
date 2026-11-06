/* =========================================================
   Fichas de NPC em arquivo de texto (.txt), fáceis de editar
   no Bloco de Notas e importar de volta. Também aceita .json.
   Um arquivo pode ter vários NPCs, cada um começando com
   "=== NPC ===".
   ========================================================= */

// [rótulo no arquivo, campo no NPC]
const CAMPOS = [
  ["Nome", "nome"], ["Tipo", "tipo"], ["VD", "vd"], ["Defesa", "def"],
  ["PV", "pv"], ["PV atual", "pvAtual"], ["PE", "pe"], ["PE atual", "peAtual"],
  ["Machucado", "maq"], ["Deslocamento", "desl"], ["Atributos", "attrs"],
  ["Percepção", "per"], ["Iniciativa", "ini"],
  ["Fortitude", "res.Fortitude"], ["Reflexos", "res.Reflexos"], ["Vontade", "res.Vontade"],
  ["Presença perturbadora", "pp"], ["Resistências", "rd"], ["Vulnerabilidades", "vuln"],
];
const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const CAMPO_DE = Object.fromEntries(CAMPOS.map(([r, k]) => [norm(r), k]));
const pegar = (n, k) => k.startsWith("res.") ? n.res?.[k.slice(4)] : n[k];
const habsDe = (n) => Array.isArray(n.habs) ? n.habs : (n.hab || []).map((h) => ({ nome: "", desc: String(h) }));
const linha = (v) => String(v ?? "").replace(/\s*\n\s*/g, " ").trim();

const CABECALHO = `# Fichas de NPC do Hexatombe
# Edite à vontade e importe de volta na aba NPCs (botão "Importar fichas").
# - Cada NPC começa com a linha === NPC ===
# - Ataques: nome | teste | dano | tipo (um por linha)
# - Outras rolagens e perícias: nome | dados
# - Habilidades: cada uma começa com "## Nome" e o texto vem embaixo, com quantas linhas quiser
# - Não mude a linha "ID": é ela que faz a importação atualizar o NPC certo
#   (apague a linha ID para importar como um NPC novo)
`;

export function npcParaTexto(n) {
  const out = ["=== NPC ==="];
  for (const [rot, k] of CAMPOS) {
    if ((k === "pvAtual" || k === "peAtual") && (n[k] === "" || n[k] === undefined)) continue;
    out.push(`${rot}: ${linha(pegar(n, k))}`);
  }
  if (n.id && n.custom) out.push(`ID: ${n.id}`);
  out.push("", "[Ataques]", ...(n.atq || []).map((a) => [a[0], a[1], a[2], a[3]].map(linha).join(" | ")));
  out.push("", "[Outras rolagens]", ...(n.extra || []).map((a) => [a[0], a[1]].map(linha).join(" | ")));
  out.push("", "[Perícias]", ...(n.pericias || []).map((a) => [a[0], a[1]].map(linha).join(" | ")));
  out.push("", "[Habilidades]");
  for (const h of habsDe(n)) out.push(`## ${linha(h.nome)}`, String(h.desc || "").trim(), "");
  out.push("[Lore]", String(n.lore || "").trim(), "");
  if ((n.historia || []).length) out.push("[História]", ...n.historia.map((h) => String(h)), "");
  out.push("[Notas do mestre]", String(n.notas || "").trim(), "");
  return out.join("\n");
}
export function npcsParaArquivo(lista) { return CABECALHO + "\n" + lista.map(npcParaTexto).join("\n") + "\n"; }
export function modeloNpc() {
  return npcsParaArquivo([{ nome: "Nome do NPC", tipo: "Criatura de Sangue Média", per: "1d20", ini: "1d20", res: { Fortitude: "1d20", Reflexos: "1d20", Vontade: "1d20" },
    atq: [["Mordida", "2d20+5", "1d6+2", "corte"]], extra: [], pericias: [["Furtividade", "2d20+10"]],
    habs: [{ nome: "Nome da habilidade", desc: "O que ela faz.\nPode ter várias linhas." }], lore: "Quem é, de onde veio, o que quer." }]);
}

function textoParaNpc(bloco) {
  const n = { res: {}, atq: [], extra: [], pericias: [], habs: [], lore: "", notas: "", historia: [] };
  let sec = null; const corpo = { lore: [], notas: [], historia: [] }; let hab = null;
  const partes = (l) => l.split("|").map((x) => x.trim());
  for (const raw of bloco.split(/\r?\n/)) {
    const l = raw.replace(/\s+$/, "");
    const s = /^\[(.+)\]\s*$/.exec(l.trim());
    if (s) { sec = norm(s[1]); hab = null; continue; }
    if (sec === null) {
      const m = /^([^:]+):\s?(.*)$/.exec(l); if (!m) continue;
      const rot = norm(m[1]); const v = m[2].trim();
      if (rot === "id") { if (v) n.id = v; continue; }
      const k = CAMPO_DE[rot]; if (!k) continue;
      if (k.startsWith("res.")) n.res[k.slice(4)] = v; else n[k] = v;
      continue;
    }
    if (sec.startsWith("habilidade")) {
      const h = /^##\s?(.*)$/.exec(l);
      if (h) { hab = { nome: h[1].trim(), desc: [] }; n.habs.push(hab); continue; }
      if (!hab) { if (!l.trim()) continue; hab = { nome: "", desc: [] }; n.habs.push(hab); }
      hab.desc.push(l); continue;
    }
    if (sec === "lore") { corpo.lore.push(l); continue; }
    if (sec.startsWith("nota")) { corpo.notas.push(l); continue; }
    if (sec.startsWith("historia")) { if (l.trim()) corpo.historia.push(l.trim()); continue; }
    if (!l.trim()) continue;
    const p = partes(l);
    if (sec.startsWith("ataque")) n.atq.push([p[0] || "Ataque", p[1] || "1d20", p[2] || "", p[3] || ""]);
    else if (sec.startsWith("outra") || sec.startsWith("rolage")) n.extra.push([p[0] || "Rolagem", p[1] || "1d6"]);
    else if (sec.startsWith("peric")) n.pericias.push([p[0] || "Perícia", p[1] || "1d20"]);
  }
  n.habs = n.habs.map((h) => ({ nome: h.nome, desc: h.desc.join("\n").trim() })).filter((h) => h.nome || h.desc);
  n.lore = corpo.lore.join("\n").trim(); n.notas = corpo.notas.join("\n").trim(); n.historia = corpo.historia;
  return n;
}

// Devolve uma lista de NPCs (sem mexer no estado). Lança erro se não reconhecer nada.
export function lerArquivoNpcs(texto) {
  const t = String(texto || "").replace(/^﻿/, "");
  if (/^\s*[[{]/.test(t)) {
    const o = JSON.parse(t);
    const lista = Array.isArray(o) ? o : Array.isArray(o.npcs) ? o.npcs : Array.isArray(o.state?.bestiario) ? o.state.bestiario : [o];
    return lista.filter((x) => x && typeof x === "object" && x.nome).map(limpar);
  }
  const blocos = t.split(/^\s*===\s*NPC\s*===\s*$/m).slice(1);
  const lista = (blocos.length ? blocos : [t]).map(textoParaNpc).filter((n) => n.nome).map(limpar);
  if (!lista.length) throw new Error("nenhum NPC");
  return lista;
}

const S = (v, max = 400) => String(v ?? "").slice(0, max);
function limpar(n) {
  const habs = habsDe(n).map((h) => ({ nome: S(h.nome, 120), desc: S(h.desc, 4000) })).slice(0, 40);
  const par = (arr, k) => (Array.isArray(arr) ? arr : []).slice(0, 30).map((a) => Array.from({ length: k }, (_, i) => S(a?.[i], 120)));
  const out = {
    id: n.id ? S(n.id, 40) : "", custom: true, nome: S(n.nome, 80), tipo: S(n.tipo, 120), vd: S(n.vd, 20), def: S(n.def, 20), pv: S(n.pv, 20), pe: S(n.pe, 20),
    maq: S(n.maq, 20), desl: S(n.desl, 80), attrs: S(n.attrs, 200), per: S(n.per || "1d20", 40), ini: S(n.ini || "1d20", 40),
    res: { Fortitude: S(n.res?.Fortitude || "1d20", 40), Reflexos: S(n.res?.Reflexos || "1d20", 40), Vontade: S(n.res?.Vontade || "1d20", 40) },
    pp: S(n.pp), rd: S(n.rd), vuln: S(n.vuln),
    atq: par(n.atq, 4), extra: par(n.extra, 2), pericias: par(n.pericias, 2),
    habs, hab: habs.map((h) => (h.nome ? `${h.nome}. ${h.desc}` : h.desc).trim()),
    lore: S(n.lore, 8000), notas: S(n.notas, 4000), historia: (n.historia || []).map((h) => S(h, 1000)).slice(0, 30),
  };
  if (n.pvAtual !== undefined && n.pvAtual !== "") out.pvAtual = S(n.pvAtual, 20);
  if (n.peAtual !== undefined && n.peAtual !== "") out.peAtual = S(n.peAtual, 20);
  return out;
}

export function nomeArquivo(nome) {
  return "npc-" + (String(nome || "npcs").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "npc") + ".txt";
}
