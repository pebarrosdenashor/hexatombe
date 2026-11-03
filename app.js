import OBR, { buildLabel, buildShape } from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";

/* =========================================================
   Hexatombe — extensão para Owlbear Rodeo
   Regras: Arquivos Secretos #2 e #3 (Ordem Paranormal RPG)
   Conversa com a extensão "Ficha Ordem Paranormal"
   ========================================================= */

const NS = "io.github.pebarrosdenashor.hexatombe";
const STATE_KEY = NS + "/state";
const CHANNEL = NS + "/roll";
const FICHA_NS = "io.github.pebarrosdenashor.ficha-op";
const FICHA_CH = FICHA_NS + "/sync";
const LINK_KEY = FICHA_NS + "/link";

/* ---------- Regras ---------- */
const ESTIGMAS = [
  { nome: "Desejo", sent: "Ambição, Inveja", missao: "Ficar morrendo e se recuperar por completo.", mand: "Encare o limiar e retorne à tua forma prístina.", rec: "Após cair morrendo pela primeira vez no dia, recebe +15 PV temporários e levanta." },
  { nome: "Rancor", sent: "Frustração, Ansiedade, Ira", missao: "Matar duas pessoas no mesmo dia.", mand: "Liberta tua cólera primordial e aniquila a díade.", rec: "Sempre que causa dano, causa +5 do mesmo tipo." },
  { nome: "Obsessão", sent: "Servidão, Paixão", missao: "Ser gravemente ferido por alguém da própria equipe.", mand: "Testifica tua lealdade e sangra sob as mãos de teu vínculo.", rec: "Recebe RD 5." },
  { nome: "Culpa", sent: "Vergonha, Arrependimento, Sofrimento", missao: "Deixar morrer um aliado que poderia ter sido salvo.", mand: "Carrega o fardo daquele sucumbido em teu amparo.", rec: "Recebe um poder de quem morreu." },
  { nome: "Prazer", sent: "Euforia, Luxúria, Gula", missao: "Consumir 3 águas e 3 comidas na mesma noite.", mand: "Farta-te em um banquete superior à tua fome e sorva insaciável além da tua sede.", rec: "+10 PV máximos." },
  { nome: "Orgulho", sent: "Desprezo, Arrogância", missao: "Matar alguém sem ser ferido por essa pessoa.", mand: "Abata incólume o indigno que ousaria te flagelar.", rec: "+10 PE máximos (na ficha: Determinação)." },
];
const EST = Object.fromEntries(ESTIGMAS.map((e) => [e.nome, e]));
const FASES = ["Preparação", "Execução", "Conclusão"];
const FASE_DESC = [
  "Os personagens conversam e decidem quem fica na base (descansar, construir) e quem sai para explorar.",
  "Manhã e tarde: cada um faz o que decidiu. Encontros podem acontecer.",
  "Noite: reencontro na base, troca de informações, consumo de água e comida e descanso. É quando os sacrifícios podem ser mortos.",
];
const MELHORIAS = [
  { k: "limpeza", nome: "Limpeza da base", custo: 0, ef: "Obrigatória para liberar as outras melhorias." },
  { k: "filtro", nome: "Filtro de água", custo: 1, ef: "Fornece 6 águas por dia.", agua: 6 },
  { k: "geladeira", nome: "Geladeira", custo: 1, ef: "Fornece 6 comidas por dia.", comida: 6 },
  { k: "camas", nome: "Camas", custo: 1, ef: "O descanso passa de precário para normal." },
  { k: "casa", nome: "Casa na árvore", custo: 2, ef: "Observatório: uma pergunta por dia sobre o estado do Hexatombe." },
  { k: "defesas", nome: "Defesas externas", custo: 1, ef: "Quem está na base recebe +2 em Iniciativa, Luta, Pontaria e Defesa." },
  { k: "academia", nome: "Academia", custo: 1, ef: "O bônus de exercitar-se passa a ser +2d6." },
  { k: "enfermaria", nome: "Enfermaria improvisada", custo: 0, req: "materiais de enfermaria", ef: "Dormir sempre conta com cuidados prolongados." },
  { k: "biblioteca", nome: "Biblioteca", custo: 0, req: "documentos ou livros", ef: "Novas informações todo dia, ou o bônus de ler passa a ser +2d6." },
  { k: "musica", nome: "Sala de música", custo: 0, req: "equipamento de som", ef: "Dançar no interlúdio: +2 em testes de AGI e PRE e −2 em FOR e VIG até o fim do dia." },
  { k: "adega", nome: "Adega de vinho", custo: 0, req: "vinhos", ef: "Beber: +2 em testes de FOR e VIG e −2 em INT e PRE até o fim do dia." },
  { k: "garagem", nome: "Garagem", custo: 0, req: "um veículo", ef: "Guarda um veículo. Sem efeito de regras." },
];

const CONSEQ = [
  ["Encontro inesperado", "A jornada é interrompida: role agora um encontro de exploração (diurno ou noturno, conforme o horário).", "encontro"],
  ["Barranco", "Um personagem aleatório cai: 2d6 de impacto e fica fatigado até o fim da próxima cena (Fortitude DT 20 reduz à metade e evita a condição).", "2d6"],
  ["Animal peçonhento", "Um personagem aleatório perde 1 PV e fica envenenado (enjoado) até dormir (Fortitude DT 20 evita a condição).", ""],
  ["Solo instável", "Todos ficam agarrados e afundam a cada rodada; no fim da 3ª rodada ficam asfixiados e paralisados. Escapar: Atletismo ou Acrobacia DT 20.", ""],
  ["Espinheiro", "Dois personagens aleatórios sofrem 2d4 de perfuração (Reflexos DT 20 reduz à metade).", "2d4"],
  ["“Pacote” aéreo", "Um personagem aleatório leva uma ‘bomba’ de uma ave: fica alquebrado e sofre −2 em testes de Presença até se limpar.", ""],
];
const RECURSOS_TAB = {
  15: ["Comida", "Sucata", "Água", "Bandagem", "Incenso", "Dose de Álcool", "Balas Curtas", "Balas Longas", "Cartuchos", "Catalisador Ampliador", "Catalisador Perturbador", "Catalisador Potencializador"],
  20: ["Bandagem", "Incenso", "Pedra de Amolar", "Comida", "Sucata", "Água", "Bússola", "Caixa de Ferramentas", "Dose de Álcool", "Balas Curtas", "Balas Longas", "Cartuchos"],
  25: ["Bússola", "Caixa de Ferramentas", "Kit de Escalada", "Catalisador Ampliador", "Catalisador Perturbador", "Catalisador Potencializador", "Comida", "Sucata", "Água", "Pedra de Amolar", "Munição Explosiva", "Dinamite"],
};
const ENCONTROS = {
  noturnoBase: { nome: "Noturno de base", dado: 6, op: [
    [2, "Acerto de contas", "Um membro de equipe rival chega ao anoitecer exigindo uma luta um contra um."],
    [4, "Sobrevivente", "Gritos se aproximam: um sobrevivente muito ferido chega sozinho pedindo ajuda… ou é uma armadilha?"],
    [6, "Caçadores", "Três rivais atacam para matar o sacrifício da equipe. Vão embora assim que algum sacrifício for realizado."],
  ] },
  diurnoBase: { nome: "Diurno de base", dado: 8, op: [
    [2, "Uma ajuda extra", "Um participante forte de outra equipe propõe uma parceria pontual. Se aceitarem, ele volta depois para ajudar."],
    [4, "Bisbilhoteiro", "Barulhos ao redor da base. Percepção contra Furtividade para achar um rival espionando escondido."],
    [6, "Visita mal-intencionada", "Uma dupla rival visita a base fazendo perguntas e, ao sair, deixa um ‘presente’ adulterado (comida envenenada, armadilha…)."],
    [8, "Invasão acanhada", "Um animal assustado invade a base. Matá-lo rende 3 comidas; se for poupado, vira uma criatura sanguinária no fim do 5º dia."],
  ] },
  diurnoExpl: { nome: "Diurno de exploração", dado: 10, op: [
    [2, "Fogo cruzado", "O grupo chega no meio de uma luta entre duas equipes. Pode ajudar um lado ou ficar de fora."],
    [4, "Negociação", "Uma dupla rival vasculha o local. Dá para negociar e dividir os recursos; a atitude deles depende da relação entre as equipes."],
    [6, "Encontro às escondidas", "Dois participantes de equipes diferentes se encontram em segredo."],
    [8, "Pedágio", "Um rival forte exige toda a comida e água que o grupo carrega em troca de deixá-los passar. Ou luta."],
    [10, "Armadilha", "Uma armadilha debilitante impede a fuga (arame farpado, armadilha de caça, fosso…). Logo três rivais aparecem para ameaçar o grupo."],
  ] },
  noturnoExpl: { nome: "Noturno de exploração", dado: 8, op: [
    [2, "Armadilha", "Uma armadilha debilitante impede a fuga. Logo três rivais aparecem para questionar e ameaçar o grupo."],
    [4, "Predador noturno", "Um animal perigoso caça o grupo. Percepção contra Furtividade; quem falhar fica surpreendido na 1ª rodada."],
    [6, "Criatura noturna", "Uma criatura paranormal ataca. Percepção contra Furtividade; quem falhar fica surpreendido na 1ª rodada."],
    [8, "Confronto antecipado", "Uma equipe a caminho de matar um sacrifício esbarra no grupo. Sem sacrifício do grupo presente, dá para conversar; com ele, luta até um sacrifício morrer."],
  ] },
};
const ITENS = [
  { nome: "Bandagem", esp: 0.5, desc: "Ação padrão: cura 2d4+2 PV e remove a condição sangrando (em você ou num ser adjacente). Com uma dose de álcool, cura 2d8+2." },
  { nome: "Bússola", esp: 1, desc: "Utensílio: +2 em Sobrevivência para se guiar e não se perder." },
  { nome: "Caixa de Ferramentas", esp: 2, desc: "Utensílio: +2 em Profissão quando as ferramentas fizerem sentido." },
  { nome: "Dose de Álcool", esp: 0.5, desc: "Ação padrão: +2 em testes contra infecções e doenças por contato. Melhora a bandagem. Inflamável." },
  { nome: "Incenso", esp: 0.5, desc: "Ação de interlúdio: todos na mesma cena de interlúdio recuperam 1d4 PE (uma vez por dia)." },
  { nome: "Kit de Escalada", esp: 2, desc: "Utensílio: +2 em Atletismo para escalar." },
  { nome: "Pedra de Amolar", esp: 0.5, desc: "Ação de interlúdio: amola uma arma corpo a corpo de corte ou perfuração, que causa +1d4 de dano na próxima cena em que for usada." },
];
const BESTIARIO = [
  { nome: "Arara-vermelha", tipo: "Animal Pequeno", vd: 10, def: 12, pv: 8, maq: 4, per: "2d20+5", ini: "2d20+5", res: { Fortitude: "1d20", Reflexos: "2d20+5", Vontade: "2d20" },
    desl: "3m, voo 9m", attrs: "AGI 2 · FOR 1 · INT 0 · PRE 2 · VIG 1",
    hab: ["E do nada: na 1ª rodada de combate, quem agir depois dela fica desprevenido contra ela."],
    atq: [["Bicada", "2d20+5", "1d6+2", "perfuração"], ["Arranhão (×2)", "2d20+5", "1d4+2", "corte"]] },
  { nome: "Arara-devorada", tipo: "Criatura de Sangue Média", vd: 80, def: 21, pv: 120, maq: 60, per: "2d20+5", ini: "3d20+10", res: { Fortitude: "2d20+5", Reflexos: "3d20+10", Vontade: "2d20" },
    pp: "DT 20 · 3d8 mental · NEX 40% imune", rd: "Balístico, impacto e perfuração 5 · Sangue 10", vuln: "Morte",
    desl: "9m, voo 12m", attrs: "AGI 3 · FOR 2 · INT 0 · PRE 2 · VIG 2",
    hab: ["E do nada (como a arara-vermelha).", "Agarrão (livre): ao acertar as garras, pode agarrar (teste 3d20+7).", "Penas afiadas (completa): raio de 9m, Reflexos DT 20 evita. Role 1d6 por atingido: 1–2 vermelha (sangrando), 3–4 azul (lento até recuperar PV), 5–6 amarela (fraco até o fim da cena)."],
    atq: [["Bicada", "3d20+5", "1d8+5+1d8", "perfuração + Sangue"], ["Garras (×2)", "3d20+5", "1d6+5", "corte"]], extra: [["Penas afiadas (1d6 cor)", "1d6"]] },
  { nome: "Arara-infernal", tipo: "Criatura de Sangue Grande", vd: 120, def: 26, pv: 220, maq: 110, per: "2d20+5", ini: "4d20+10", res: { Fortitude: "3d20+10", Reflexos: "4d20+10", Vontade: "2d20+5" },
    pp: "DT 23 · 4d6 mental · NEX 50% imune", rd: "Balístico, impacto e perfuração 10 · Sangue 20", vuln: "Morte",
    desl: "12m, voo 15m", attrs: "AGI 4 · FOR 2 · INT 0 · PRE 2 · VIG 3",
    hab: ["E do nada (como a arara-vermelha).", "Agarrão (livre): ao acertar as garras, pode agarrar (teste 4d20+12).", "Mastigar (movimento): ser agarrado sofre 6d10 de Sangue (Fortitude DT 23 reduz à metade). Se ficar morrendo, é engolido e ela recupera 2d10 PV.", "Penas afiadas (completa): raio de 9m, Reflexos DT 23 evita. Cada atingido perde 2d6 PV e role 1d6: 1–2 sangrando, 3–4 lento, 5–6 fraco."],
    atq: [["Bicada", "4d20+10", "1d10+10+1d10", "perfuração + Sangue"], ["Garras (×4)", "4d20+10", "1d8+10", "corte"]], extra: [["Mastigar", "6d10"], ["Penas (perda)", "2d6"], ["Penas (cor)", "1d6"]] },
  { nome: "Jaguatirica", tipo: "Animal Pequeno", vd: 10, def: 13, pv: 16, maq: 8, per: "1d20+5", ini: "2d20+5", res: { Fortitude: "1d20", Reflexos: "2d20+5", Vontade: "1d20" },
    desl: "12m", attrs: "AGI 2 · FOR 1 · INT 0 · PRE 1 · VIG 1",
    hab: ["Pulo do gato (movimento): salta até um alvo em alcance curto; se agredir no mesmo turno, +1d4 de dano. Contra alvo desprevenido, vira ação livre uma vez por rodada."],
    atq: [["Mordida", "2d20+5", "1d6+2", "corte"], ["Arranhar (×2)", "2d20+5", "1d4+2", "corte"]] },
  { nome: "Felino-devorado", tipo: "Criatura de Sangue Média", vd: 80, def: 23, pv: 140, maq: 70, per: "2d20+10", ini: "3d20+10", res: { Fortitude: "2d20+5", Reflexos: "3d20+10", Vontade: "2d20" },
    pp: "DT 20 · 3d8 mental · NEX 40% imune", rd: "Balístico, impacto e perfuração 5 · Sangue 10", vuln: "Morte",
    desl: "12m", attrs: "AGI 3 · FOR 2 · INT 0 · PRE 2 · VIG 2",
    hab: ["Camuflagem perversa: sempre com camuflagem leve; uma vez por cena ignora um acerto crítico; testes para percebê-lo ou rastreá-lo sofrem −1d.", "Pulo do felino (movimento): como o pulo do gato, mas +1d8 de dano.", "Chicotada perfurante (padrão): alvo em alcance curto sofre 4d8 de Sangue, fica caído e é puxado (Reflexos DT 20 reduz à metade e evita)."],
    atq: [["Mordidas (×2)", "3d20+10", "1d8+5+1d8", "corte + Sangue"], ["Garras (×2)", "3d20+10", "1d6+5", "corte"]], extra: [["Chicotada perfurante", "4d8"], ["Pulo do felino (extra)", "1d8"]] },
  { nome: "Felino-infernal", tipo: "Criatura de Sangue Grande", vd: 120, def: 28, pv: 230, maq: 125, per: "2d20+10", ini: "4d20+10", res: { Fortitude: "3d20+10", Reflexos: "4d20+10", Vontade: "2d20+5" },
    pp: "DT 23 · 4d6 mental · NEX 50% imune", rd: "Balístico, impacto e perfuração 10 · Sangue 20", vuln: "Morte",
    desl: "12m", attrs: "AGI 4 · FOR 2 · INT 0 · PRE 2 · VIG 3",
    hab: ["Camuflagem perversa (como o felino-devorado, mas −2d para percebê-lo).", "Pulo do felino: +2d8 de dano.", "Boca da loucura (padrão): ser adjacente faz Reflexos DT 23; se falhar, fica agarrado e sofre 4d6 de Sangue + 4d6 mental, repetindo no início dos turnos do felino. Soltar: ação + Acrobacia, Atletismo ou Luta DT 23. Enquanto agarra, não usa mordidas.", "Chicotada perfurante: 6d8 de Sangue, caído, sangrando e puxado (Reflexos DT 23 reduz à metade e evita)."],
    atq: [["Mordidas (×2)", "4d20+10", "2d8+5+2d8", "corte + Sangue"], ["Garras (×2)", "4d20+10", "2d6+5", "corte"]], extra: [["Boca da loucura", "4d6+4d6"], ["Chicotada perfurante", "6d8"], ["Pulo do felino (extra)", "2d8"]] },
];
const PERICIAS = ["Acrobacia", "Adestramento", "Artes", "Atletismo", "Atualidades", "Ciências", "Crime", "Diplomacia", "Enganação", "Fortitude", "Furtividade", "Iniciativa", "Intimidação", "Intuição", "Investigação", "Luta", "Medicina", "Ocultismo", "Percepção", "Pilotagem", "Pontaria", "Profissão", "Reflexos", "Religião", "Sobrevivência", "Tática", "Tecnologia", "Vontade"];
const PER_ATTR = { Acrobacia: "AGI", Adestramento: "PRE", Artes: "PRE", Atletismo: "FOR", Atualidades: "INT", "Ciências": "INT", Crime: "AGI", Diplomacia: "PRE", "Enganação": "PRE", Fortitude: "VIG", Furtividade: "AGI", Iniciativa: "AGI", "Intimidação": "PRE", "Intuição": "PRE", "Investigação": "INT", Luta: "FOR", Medicina: "INT", Ocultismo: "INT", "Percepção": "PRE", Pilotagem: "AGI", Pontaria: "AGI", "Profissão": "INT", Reflexos: "AGI", "Religião": "PRE", "Sobrevivência": "INT", "Tática": "INT", Tecnologia: "INT", Vontade: "PRE" };
// Condições da ficha que tiram dados (mesma tabela da extensão da ficha)
const COND_D = { Abalado: { dAll: 1 }, Apavorado: { dAll: 2 }, Debilitado: { dFis: 2 }, Esmorecido: { dMen: 2 }, Exausto: { dFis: 2 }, Fatigado: { dFis: 1 }, Fraco: { dFis: 1 }, Frustrado: { dMen: 1 }, Desprevenido: { dPer: { Reflexos: 1 } }, Ofuscado: { dPer: { "Percepção": 1 } } };
const CORES = ["#c8102e", "#d4a017", "#2f9e5b", "#2f7ad1", "#9b4dff", "#e07b39"];

/* ---------- Utilidades ---------- */
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = (n) => (n >= 0 ? "+" + n : String(n));
const die = (f) => 1 + Math.floor(Math.random() * f);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function lsGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); return true; } catch { return false; } }

function rollExpr(expr, mult = 1) {
  const str = String(expr || "").replace(/\s+/g, "").toLowerCase();
  const re = /([+-]?)(\d*)d(\d+)|([+-]?)(\d+)/g; let m, total = 0; const parts = [];
  while ((m = re.exec(str))) {
    if (m[3]) {
      const sign = m[1] === "-" ? -1 : 1; const qty = (Number(m[2]) || 1) * mult; const f = Number(m[3]);
      const rs = Array.from({ length: Math.min(qty, 200) }, () => die(f)); const sum = rs.reduce((a, b) => a + b, 0);
      total += sign * sum; parts.push(`${sign < 0 ? "−" : ""}${qty}d${f}[${rs.join(",")}]`);
    } else { const v = (m[4] === "-" ? -1 : 1) * Number(m[5]); total += v; parts.push(fmt(v)); }
  }
  return { total, txt: parts.join(" "), ok: parts.length > 0 };
}
// Teste de Ordem: Xd20 fica com o maior; 0 ou menos → (2−X)d20 e fica com o menor
function rollTest(n) {
  const k = n > 0 ? n : 2 - n; const dice = Array.from({ length: k }, () => die(20));
  return { dice, pick: n > 0 ? Math.max(...dice) : Math.min(...dice), worst: n <= 0 };
}
// "3d20+10" → teste de criatura
function rollMonster(expr) {
  const m = /^(\d+)d20([+-]\d+)?$/.exec(expr.replace(/\s+/g, ""));
  if (!m) return { total: rollExpr(expr).total, txt: expr };
  const r = rollTest(Number(m[1])); const b = num(m[2]); diceAnim(r.dice, r.pick, false);
  return { total: r.pick + b, txt: `[${r.dice.join(", ")}] → ${r.pick}${b ? " " + fmt(b) : ""} = ${r.pick + b}` };
}

/* ---------- Estado ---------- */
function defaultState() {
  return {
    v: 1, dia: 1, fase: 0, fracassou: false, herdeiro: null, finalFeito: false,
    equipes: Array.from({ length: 6 }, (_, i) => ({ id: uid(), nome: `Equipe ${i + 1}`, cor: CORES[i], membros: [], agua: 0, comida: 0, sucata: 0, base: [], jornada: [] })),
    sacrificios: [], intencoes: {}, batalha: null, circo: { dardos: [], soco: [] }, log: [], areas: [], rel: {}, conhece: {}, melhorias: MELHORIAS.map((m) => ({ ...m })), bestiario: [], rev: 0, mortes: [], diarios: {}, epilogo: null,
  };
}
let state = defaultState();
let obrOk = false, sceneOk = false, role = "PLAYER", me = { id: "local", name: "" }, roomId = "local";
let tab = "ritual";
let rollLog = [];
let selTeam = 0;
const ui = {}; // valores de formulários entre renders
const isGM = () => role === "GM";

function addEvent(txt) { state.log.unshift({ at: Date.now(), dia: state.dia, txt }); state.log = state.log.slice(0, 30); }
let saveTimer;
function save(quiet = false) {
  if (!quiet) render();
  if (!isGM()) return;
  fillOwners(); state.rev = Date.now();
  lsSet(lsState(), JSON.stringify(state));
  broadcastState();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    if (!obrOk) return;
    const json = JSON.stringify(state);
    // cópia de segurança na sala, só se couber no limite de 16 KB
    try { await OBR.room.setMetadata({ [STATE_KEY]: json.length < 12000 ? state : { rev: state.rev, grande: true } }); } catch { /* sem espaço: as mensagens e o navegador do mestre seguram o estado */ }
  }, 600);
}
function allMembers() { return state.equipes.flatMap((t, ti) => t.membros.map((m) => ({ m, t, ti }))); }
function findM(id) { return allMembers().find((x) => x.m.id === id) || null; }
function aliveMembers() { return allMembers().filter((x) => x.m.vivo); }
function mName(m) { if (m.npcId) { const n = state.bestiario.find((c) => c.id === m.npcId); if (n) return n.nome; } const s = m.sheetId && getSheet(m.sheetId); return s?.header?.personagem || m.nome || "?"; }
function sacrificiosHoje() { return state.sacrificios.filter((s) => s.dia === state.dia); }
function estigmasLiberados() { return new Set(state.sacrificios.map((s) => s.estigma)); }

/* ---------- Fichas (extensão da ficha, mesma origem) ---------- */
function fichaKey() { return `${FICHA_NS}:${roomId}`; }
function readFichas() {
  try { const st = JSON.parse(lsGet(fichaKey()) || "null"); if (st) { st.own ||= {}; st.others ||= {}; return st; } } catch { /* */ }
  return { own: {}, others: {}, currentId: null };
}
function getSheet(id) { const st = readFichas(); return st.own[id] || (isGM() ? st.others[id] : null) || null; }
function visibleSheets() {
  const st = readFichas(); const list = Object.values(st.own).map((s) => ({ s, own: true }));
  if (isGM()) for (const s of Object.values(st.others)) list.push({ s, own: false });
  return list;
}
function canEditSheet(id) { const st = readFichas(); return !!(st.own[id] || (isGM() && st.others[id])); }
const FCHUNK = 5000;
async function fichaSend(msg) {
  if (!obrOk) return;
  const str = JSON.stringify(msg); const n = Math.max(1, Math.ceil(str.length / FCHUNK)); const m = uid();
  for (let i = 0; i < n; i++) {
    try { await OBR.broadcast.sendMessage(FICHA_CH, { m, i, n, d: str.slice(i * FCHUNK, (i + 1) * FCHUNK) }); } catch { return; }
    if (n > 1) await sleep(70);
  }
}
async function syncTokenMeta(s) {
  if (!sceneOk) return;
  const data = { sheetId: s.id, ownerId: s.owner?.id || me.id, nome: s.header.personagem, pv: [num(s.pv.atual), num(s.pv.max)], pd: [num(s.pd.atual), num(s.pd.max)], todos: s.token?.barrasTodos !== false };
  try {
    const items = await OBR.scene.items.getItems((it) => it.metadata?.[LINK_KEY]?.sheetId === s.id);
    if (items.length) await OBR.scene.items.updateItems(items.map((i) => i.id), (ds) => { for (const d of ds) d.metadata[LINK_KEY] = data; });
  } catch { /* sem permissão */ }
}
// Altera uma ficha e envia a mudança ao dono (e aos tokens vinculados)
function applySheet(id, fn) {
  if (!id) return null;
  const st = readFichas(); const s = st.own[id] || (isGM() ? st.others[id] : null);
  if (!s) return null;
  noteSheetBefore(id, s);
  s.hexa ||= {}; s.pv ||= { atual: 0, max: 0 }; s.pd ||= { atual: 0, max: 0 };
  fn(s);
  s.updatedAt = Date.now();
  lsSet(fichaKey(), JSON.stringify(st));
  fichaSend({ t: "sheet", sheet: s }); syncTokenMeta(s);
  return s;
}
function sheetTest(s, pericia, extra = 0) {
  const p = s.pericias?.[pericia] || { attr: PER_ATTR[pericia] || "AGI", treino: 0, outros: 0 };
  const attr = p.attr; let pen = 0; const fx = { dAll: 0, dFis: 0, dMen: 0, dPer: 0 };
  for (const c of s.condicoes || []) {
    const e = COND_D[c]; if (!e) continue;
    for (const k of ["dAll", "dFis", "dMen"]) if (e[k]) fx[k] = Math.max(fx[k], e[k]);
    if (e.dPer?.[pericia]) fx.dPer = Math.max(fx.dPer, e.dPer[pericia]);
  }
  pen = fx.dAll + fx.dPer + (["FOR", "AGI", "VIG"].includes(attr) ? fx.dFis : 0) + (["INT", "PRE"].includes(attr) ? fx.dMen : 0) + (s.hexa?.desertor ? 1 : 0);
  const n = clamp(num(s.attrs?.[attr]), 0, 5) - pen;
  const r = rollTest(n);
  const bonus = num(p.treino) + num(p.outros) - clamp(num(s.hexa?.pen), 0, 6) + num(extra);
  return { ...r, bonus, total: r.pick + bonus, txt: `[${r.dice.join(", ")}]${r.worst ? " (pior)" : ""} → ${r.pick} ${fmt(bonus)} = ${r.pick + bonus}` };
}
// Teste de um membro: com ficha usa a ficha; sem ficha (NPC) usa 1d20 + bônus informado
function memberTest(mid, pericia, extra = 0) {
  const x = findM(mid); if (!x) return null;
  const s = x.m.sheetId && getSheet(x.m.sheetId);
  if (s) { const t = sheetTest(s, pericia, extra); diceAnim(t.dice, t.pick, t.worst); return { nome: mName(x.m), ...t, ficha: true }; }
  const npc = x.m.npcId && npcGet(x.m.npcId);
  if (npc) return { nome: mName(x.m), ...npcTest(npc, pericia, extra), ficha: false };
  const r = rollTest(1); const b = num(extra); diceAnim(r.dice, r.pick, false);
  return { nome: mName(x.m), ...r, bonus: b, total: r.pick + b, txt: `[${r.dice[0]}] ${fmt(b)} = ${r.pick + b}`, ficha: false };
}

/* ---------- Anúncios / rolagens ---------- */
function announce(text, local = false, sino = false) {
  rollLog.unshift({ at: Date.now(), text }); rollLog = rollLog.slice(0, 40);
  lsSet(NS + ":log:" + roomId, JSON.stringify(rollLog));
  if (sino) { bell(); redFlash(); document.body.classList.add("sino"); setTimeout(() => document.body.classList.remove("sino"), 5000); }
  if (obrOk) { OBR.notification.show(text.split("\n")[0]); if (!local) OBR.broadcast.sendMessage(CHANNEL, { text, sino }).catch(() => {}); }
  else toast(text);
  softRender();
}

/* ---------- Mecânicas do ritual ---------- */
function tornarDesertor(x, motivo) {
  if (x.m.des || !x.m.vivo) return null;
  x.m.des = true;
  let info = `${mName(x.m)} virou desertor (${motivo})`;
  const npc = x.m.npcId && npcGet(x.m.npcId);
  if (npc) { npcPv(npc); npc.des = true; npc.pv = Math.floor(num(npc.pv) / 2); npc.pvAtual = Math.min(num(npc.pvAtual), npc.pv); return info + ` — PV máx. agora ${npc.pv}`; }
  const s = applySheet(x.m.sheetId, (s) => {
    s.hexa.desertor = true;
    s.pv.max = Math.floor(num(s.pv.max) / 2); s.pv.atual = Math.min(num(s.pv.atual), s.pv.max);
  });
  if (s) info += ` — PV máx. agora ${s.pv.max}`;
  else if (x.m.sheetId) info += " — ficha não encontrada neste navegador; aplique à mão";
  return info;
}
function badalarSino() {
  const linhas = [];
  for (const x of aliveMembers().filter((x) => x.m.des)) {
    const npc = x.m.npcId && npcGet(x.m.npcId);
    if (npc) {
      npcPv(npc); const fort = npcTest(npc, "Fortitude"); const perdeu = num(npc.pen) < 6 ? die(10) : 0;
      if (perdeu) { npc.pv = num(npc.pv) - perdeu; npc.pvAtual = num(npc.pvAtual) - perdeu; npc.pen = clamp(num(npc.pen) + 1, 0, 6); }
      if (fort.total < 20) { npc.cond ||= []; if (!npc.cond.includes("Inconsciente")) npc.cond.push("Inconsciente"); }
      linhas.push(`${mName(x.m)}: ${perdeu ? `−${perdeu} PV máx./atuais e −1 em testes` : "já no limite (−6)"}; Fortitude ${fort.total} ${fort.total >= 20 ? "✓" : "✗ inconsciente até o amanhecer"}`);
      continue;
    }
    const s = x.m.sheetId && getSheet(x.m.sheetId);
    if (s && canEditSheet(s.id)) {
      const fort = sheetTest(s, "Fortitude");
      const perdeu = num(s.hexa?.pen) < 6 ? die(10) : 0;
      applySheet(s.id, (s) => {
        if (perdeu) { s.pv.max = num(s.pv.max) - perdeu; s.pv.atual = num(s.pv.atual) - perdeu; s.hexa.pen = clamp(num(s.hexa.pen) + 1, 0, 6); }
        if (fort.total < 20 && !(s.condicoes || []).includes("Inconsciente")) (s.condicoes ||= []).push("Inconsciente");
      });
      linhas.push(`${mName(x.m)}: ${perdeu ? `−${perdeu} PV máx./atuais e −1 em testes` : "já no limite (−6)"}; Fortitude ${fort.total} ${fort.total >= 20 ? "✓" : "✗ inconsciente até o amanhecer"}`);
    } else {
      linhas.push(`${mName(x.m)}: −${die(10)} PV máx./atuais, −1 em testes e Fortitude DT 20 (aplicar à mão)`);
    }
  }
  return linhas;
}
function registrarMorte(vid, kid, diurna) {
  const v = findM(vid); if (!v || !v.m.vivo) return;
  const k = kid ? findM(kid) : null;
  v.m.vivo = false;
  (state.mortes ||= []).push({ dia: state.dia, nome: mName(v.m), equipe: v.t.nome, algoz: k ? mName(k.m) : "", sac: v.m.sac || null });
  const linhas = [`☠ ${mName(v.m)} (${v.t.nome}) morreu${k ? ` pelas mãos de ${mName(k.m)}` : ""}.`];
  if (!v.m.sac) { addEvent(linhas[0]); announce(linhas[0]); return save(); }
  const est = v.m.sac;
  const valido = !diurna && sacrificiosHoje().length === 0;
  if (valido) {
    state.sacrificios.push({ dia: state.dia, estigma: est, vitima: mName(v.m), equipe: v.t.nome, algoz: k ? mName(k.m) : "" });
    linhas.push(`🔔 O SINO TOCA. Sacrifício ${state.sacrificios.length}/6 realizado (${est}). Nenhum outro sacrifício deve morrer esta noite.`);
    linhas.push(`Intenção liberada — ${est}: ${EST[est].missao} Recompensa: ${EST[est].rec}`);
    const castigo = badalarSino();
    if (castigo.length) linhas.push("Desertores castigados:\n" + castigo.join("\n"));
    for (const x of v.t.membros.map((m) => ({ m, t: v.t })).filter((x) => x.m.vivo && !x.m.sac)) { const i = tornarDesertor(x, "perdeu o sacrifício"); if (i) linhas.push(i); }
    if (state.dia === 6) linhas.push("Lua de Sangue: veja a aba Ritual para o sacrifício final.");
  } else {
    linhas.push(diurna ? "A morte aconteceu fora da noite: o sacrifício não conta e o estigma passa adiante." : "Já houve um sacrifício esta noite: este não conta e o estigma passa adiante.");
    if (k && k.m.vivo && !k.m.sac) { k.m.sac = est; linhas.push(`${mName(k.m)} herda o estigma de ${est} e vira sacrifício.`); }
    else { state.herdeiro = est; linhas.push(`Ninguém pode herdar: a Coroa escolhe um novo sacrifício digno (${est}). Mestre: escolha na aba Ritual.`); }
    for (const x of v.t.membros.map((m) => ({ m, t: v.t })).filter((x) => x.m.vivo && !x.m.sac)) { const i = tornarDesertor(x, "perdeu o sacrifício"); if (i) linhas.push(i); }
  }
  for (const l of linhas) addEvent(l.split("\n")[0]);
  announce(linhas.join("\n"), false, valido);
  save();
}
function avancarFase() {
  if (state.fase < 2) { state.fase++; addEvent(`Dia ${state.dia}: ${FASES[state.fase]}.`); announce(`Hexatombe — dia ${state.dia}: ${FASES[state.fase]}`); return save(); }
  if (state.dia >= 6) return toast("O sexto dia é o último. Use o sacrifício final na aba Ritual.");
  const linhas = [];
  if (!sacrificiosHoje().length) { state.fracassou = true; linhas.push(`⚠ O dia ${state.dia} terminou sem sacrifício: pelas regras, o Hexatombe fracassa.`); }
  state.dia++; state.fase = 0;
  for (const t of state.equipes) {
    const a = t.base.reduce((s, k) => s + num(melGet(k)?.agua), 0), c = t.base.reduce((s, k) => s + num(melGet(k)?.comida), 0);
    if (a || c) { t.agua += a; t.comida += c; linhas.push(`${t.nome}: +${a} água, +${c} comida da base.`); }
  }
  for (const a of state.areas) if (!a.engolida && a.fecha && a.fecha <= state.dia) { a.engolida = true; linhas.push(`Os espinhos engoliram ${a.nome}.`); marcarEngolida(a); }
  linhas.unshift(`☀ Amanhece o dia ${state.dia}${state.dia === 6 ? " — a noite será de Lua de Sangue" : ""}.`);
  for (const l of linhas) addEvent(l);
  announce(linhas.join("\n"));
  save();
}
function sacrificioFinal() {
  const vivos = aliveMembers();
  const restante = vivos.find((x) => x.m.sac)?.m.sac || state.sacrificios.at(-1)?.estigma || "Desejo";
  for (const x of vivos) x.m.sac = restante;
  state.finalFeito = true;
  const txt = `🔔🔔 O SINO RUGE. Restam ${vivos.length}: ${vivos.map((x) => mName(x.m)).join(", ")}. Todos herdam o estigma de ${restante} — qualquer um pode ser o sacrifício final.`;
  addEvent(txt); announce(txt, false, true); save();
}
function aplicarRecompensa(mid, est) {
  const x = findM(mid); if (!x) return;
  const lista = (state.intencoes[est] ||= []);
  if (lista.includes(mid)) return toast("Essa pessoa já recebeu esta recompensa.");
  lista.push(mid);
  const npc = x.m.npcId && npcGet(x.m.npcId);
  if (npc) {
    npcPv(npc); npc.rewards ||= []; if (!npc.rewards.includes(est)) npc.rewards.push(est);
    if (est === "Prazer") { npc.pv = num(npc.pv) + 10; npc.pvAtual = num(npc.pvAtual) + 10; }
    if (est === "Orgulho") { npc.pe = num(npc.pe) + 10; npc.peAtual = num(npc.peAtual) + 10; }
  }
  const s = applySheet(x.m.sheetId, (s) => {
    s.hexa.rewards ||= [];
    if (!s.hexa.rewards.includes(est)) s.hexa.rewards.push(est);
    if (est === "Prazer") { s.pv.max = num(s.pv.max) + 10; s.pv.atual = num(s.pv.atual) + 10; }
    if (est === "Orgulho") { s.pd.max = num(s.pd.max) + 10; s.pd.atual = num(s.pd.atual) + 10; }
  });
  const txt = `✦ ${mName(x.m)} cumpriu a intenção de ${est}: ${EST[est].rec}${x.m.sheetId && !s ? " (ficha não encontrada: aplicar à mão)" : ""}`;
  addEvent(txt); announce(txt); save();
}
function consumir(ti, entradas, silent = false) {
  const t = state.equipes[ti]; const linhas = [`${t.nome} — consumo do dia ${state.dia}:`];
  const totA = entradas.reduce((s, e) => s + e.a, 0), totC = entradas.reduce((s, e) => s + e.c, 0);
  if (totA > t.agua || totC > t.comida) { toast(`Estoque insuficiente em ${t.nome}: ${t.agua} água e ${t.comida} comida.`); return null; }
  t.agua -= totA; t.comida -= totC;
  for (const e of entradas) {
    const x = findM(e.id); if (!x) continue;
    const efeitos = [];
    const npc = x.m.npcId && npcGet(x.m.npcId);
    if (npc) {
      npcPv(npc);
      if (e.a === 0) { npc.semAgua = num(npc.semAgua) + 1; npc.pv = num(npc.pv) - 10; npc.pvAtual = Math.min(num(npc.pvAtual), npc.pv); efeitos.push("sem água: −10 PV máx."); }
      else if (e.a > 1 && num(npc.semAgua) > 0) { const r = Math.min(e.a - 1, num(npc.semAgua)); npc.semAgua -= r; npc.pv = num(npc.pv) + 10 * r; efeitos.push(`recuperou ${10 * r} PV máx.`); }
      if (e.c === 0) { npc.semComida = num(npc.semComida) + 1; npc.pe = num(npc.pe) - 10; npc.peAtual = Math.min(num(npc.peAtual), npc.pe); efeitos.push("sem comida: −10 PE máx."); }
      else if (e.c > 1 && num(npc.semComida) > 0) { const r = Math.min(e.c - 1, num(npc.semComida)); npc.semComida -= r; npc.pe = num(npc.pe) + 10 * r; efeitos.push(`recuperou ${10 * r} PE máx.`); }
      linhas.push(`${mName(x.m)}: ${e.a} água, ${e.c} comida${efeitos.length ? " — " + efeitos.join("; ") : ""}`);
      continue;
    }
    const s = applySheet(x.m.sheetId, (s) => {
      s.hexa.ultimoConsumo = { dia: state.dia, agua: e.a, comida: e.c }; s.hexa.equipe = t.nome;
      if (e.a === 0) { s.hexa.semAgua = num(s.hexa.semAgua) + 1; s.pv.max = num(s.pv.max) - 10; s.pv.atual = Math.min(num(s.pv.atual), s.pv.max); efeitos.push("sem água: −10 PV máx."); }
      else if (e.a > 1 && num(s.hexa.semAgua) > 0) { const r = Math.min(e.a - 1, num(s.hexa.semAgua)); s.hexa.semAgua -= r; s.pv.max = num(s.pv.max) + 10 * r; efeitos.push(`recuperou ${10 * r} PV máx.`); }
      if (e.c === 0) { s.hexa.semComida = num(s.hexa.semComida) + 1; s.pd.max = num(s.pd.max) - 10; s.pd.atual = Math.min(num(s.pd.atual), s.pd.max); efeitos.push("sem comida: −10 PD máx."); }
      else if (e.c > 1 && num(s.hexa.semComida) > 0) { const r = Math.min(e.c - 1, num(s.hexa.semComida)); s.hexa.semComida -= r; s.pd.max = num(s.pd.max) + 10 * r; efeitos.push(`recuperou ${10 * r} PD máx.`); }
    });
    if (!s) { if (e.a === 0) efeitos.push("sem água: −10 PV máx. (à mão)"); if (e.c === 0) efeitos.push("sem comida: −10 PE máx. (à mão)"); }
    if (e.a >= 3 && e.c >= 3 && estigmasLiberados().has("Prazer")) efeitos.push("✦ pode ter cumprido a intenção do Prazer (aplique na aba Intenções)");
    linhas.push(`${mName(x.m)}: ${e.a} água, ${e.c} comida${efeitos.length ? " — " + efeitos.join("; ") : ""}`);
  }
  linhas.push(`Estoque restante: ${t.agua} água, ${t.comida} comida.`);
  if (silent) return linhas;
  addEvent(linhas[0] + " aplicado"); announce(linhas.join("\n")); save();
}

/* =========================================================
   v1.1 — desfazer, backup em arquivo, sino com som, arena,
   agenda das equipes, relações, desejo final, animação
   ========================================================= */

/* ---------- Desfazer (mestre) ---------- */
let hist = []; let curAction = null;
function beginAction(label) { curAction = { label: label || "ação", state: JSON.stringify(state), sheets: {} }; }
function noteSheetBefore(id, s) { if (curAction && !(id in curAction.sheets)) curAction.sheets[id] = JSON.stringify(s); }
function endAction() {
  const a = curAction; curAction = null; if (!a) return;
  if (a.state !== JSON.stringify(state) || Object.keys(a.sheets).length) { hist.push(a); if (hist.length > 20) hist.shift(); }
  const btn = document.getElementById("btnUndoH"); if (btn) { btn.disabled = !hist.length; btn.title = hist.length ? `Desfazer: ${hist[hist.length - 1].label}` : "Nada para desfazer"; }
}
function undoAction() {
  const a = hist.pop(); if (!a) return toast("Nada para desfazer.");
  state = normalize(JSON.parse(a.state));
  const st = readFichas();
  for (const [id, json] of Object.entries(a.sheets)) {
    const old = JSON.parse(json); old.updatedAt = Date.now();
    if (st.own[id]) st.own[id] = old; else if (st.others[id]) st.others[id] = old; else continue;
    fichaSend({ t: "sheet", sheet: old }); syncTokenMeta(old);
  }
  lsSet(fichaKey(), JSON.stringify(st));
  save(); toast(`Desfeito: ${a.label}`);
}
const wrapGM = (fn) => (e) => {
  const b = e.target.closest?.("button") || e.target;
  const lbl = (b.textContent || "edição").replace(/\s+/g, " ").trim().slice(0, 40);
  const track = isGM() && !b.dataset?.tab && b.id !== "btnUndoH";
  if (track) beginAction(lbl);
  try { fn(e); } finally { if (track) endAction(); }
};

/* ---------- Som do sino e dos dados ---------- */
let somOn = lsGet(NS + ":som") !== "0";
let actx = null;
function ctx() { return (actx ||= new (window.AudioContext || window.webkitAudioContext)()); }
function bell() {
  if (!somOn) return;
  try {
    const c = ctx(); const t0 = c.currentTime + 0.05;
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
function rollSound() {
  if (!somOn) return;
  try {
    const c = ctx(); const t0 = c.currentTime;
    for (let i = 0; i < 5; i++) {
      const o = c.createOscillator(); const g = c.createGain(); o.type = "triangle"; o.frequency.value = 500 + Math.random() * 700;
      const t = t0 + i * 0.07 + Math.random() * 0.03;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.08);
    }
  } catch { /* */ }
}
function diceAnim(dice, pick, worst) {
  if (!dice?.length) return;
  document.querySelector(".dice-anim")?.remove();
  const box = document.createElement("div"); box.className = "dice-anim";
  box.innerHTML = dice.slice(0, 8).map(() => `<span class="d20">?</span>`).join("");
  document.body.appendChild(box); rollSound();
  const spans = [...box.children]; let n = 0;
  const iv = setInterval(() => {
    spans.forEach((sp) => { sp.textContent = 1 + Math.floor(Math.random() * 20); });
    if (++n > 8) {
      clearInterval(iv); let marked = false;
      spans.forEach((sp, i) => { sp.textContent = dice[i]; sp.classList.add("done"); if (!marked && dice[i] === pick) { sp.classList.add(...(worst ? ["pick", "worst"] : ["pick"])); marked = true; } });
      setTimeout(() => box.classList.add("out"), 1300); setTimeout(() => box.remove(), 1800);
    }
  }, 60);
}

/* ---------- Backup em arquivo ---------- */
function downloadFile(name, content, type) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; a.click(); }
const lsAgenda = () => NS + ":agenda:" + roomId;
const lsDesejos = () => NS + ":desejos:" + roomId;
function readJSON(k, def) { try { return JSON.parse(lsGet(k) || "null") ?? def; } catch { return def; } }

/* ---------- Arena (point crawl) ---------- */
const AREA_KEY = NS + "/area";
async function viewportCenter() {
  const [w, h] = await Promise.all([OBR.viewport.getWidth(), OBR.viewport.getHeight()]);
  return OBR.viewport.inverseTransformPoint({ x: w / 2, y: h / 2 });
}
async function criarArea(nome, modo) {
  const a = { id: uid(), nome, itemId: null, exp: [], fecha: 0, notas: "", buscas: [], engolida: false };
  if (obrOk && sceneOk && modo === "sel") {
    const sel = await OBR.player.getSelection();
    if (!sel?.length) return toast("Selecione algo no mapa primeiro.");
    a.itemId = sel[0];
  } else if (obrOk && sceneOk && modo === "pin") {
    try {
      const pos = await viewportCenter();
      const item = buildLabel().plainText(nome).position(pos).fillColor("#ffffff").backgroundColor("#1a0a0d").backgroundOpacity(0.85)
        .strokeColor("#c8102e").strokeWidth(2).cornerRadius(8).pointerDirection("DOWN").pointerHeight(8).pointerWidth(12)
        .fontSize(18).fontWeight(700).name("Área: " + nome).metadata({ [AREA_KEY]: a.id }).build();
      await OBR.scene.items.addItems([item]); a.itemId = item.id;
    } catch (e) { console.warn(e); toast("Não consegui criar o marcador; a área ficou só na lista."); }
  } else if (modo !== "lista") toast("Abra uma cena no Owlbear para ligar ao mapa; a área ficou só na lista.");
  beginAction("Nova área"); state.areas.push(a); addEvent(`Nova área na arena: ${nome}.`); save(); endAction();
}
async function marcarEngolida(a) {
  if (!a.itemId || !sceneOk) return;
  try {
    await OBR.scene.items.updateItems([a.itemId], (ds) => { for (const d of ds) { if (d.text) d.text.plainText = "✖ " + a.nome; if (d.style && "backgroundColor" in d.style) d.style.backgroundColor = "#8a0f22"; } });
  } catch { /* item apagado ou sem permissão */ }
}
async function irAte(a) {
  if (!a.itemId || !sceneOk) return toast("Esta área não está ligada a um item do mapa.");
  try { const b = await OBR.scene.items.getItemBounds([a.itemId]); await OBR.viewport.animateToBounds({ ...b, min: { x: b.min.x - 300, y: b.min.y - 300 }, max: { x: b.max.x + 300, y: b.max.y + 300 }, width: b.width + 600, height: b.height + 600, center: b.center }); }
  catch { toast("O item ligado a esta área não está nesta cena."); }
}
function arenaSVG() {
  const rings = [1, 2, 3, 4, 5, 6].map((d) => {
    const r = 92 - (d - 1) * 14; const passed = d < state.dia; const now = d === state.dia;
    return `<circle cx="100" cy="100" r="${r}" fill="${now ? "#3a0610" : passed ? "#120607" : "none"}" stroke="${now ? "#c8102e" : passed ? "#5a1d26" : "#3a2a2e"}" stroke-width="${now ? 3 : 1.5}" ${passed ? 'stroke-dasharray="4 4"' : ""}/>`;
  }).reverse().join("");
  const spikes = Array.from({ length: 24 }, (_, i) => {
    const ang = (i / 24) * Math.PI * 2; const r1 = 92 - (state.dia - 1) * 14 + 2; const r2 = r1 + 9;
    return `<line x1="${100 + Math.cos(ang) * r1}" y1="${100 + Math.sin(ang) * r1}" x2="${100 + Math.cos(ang) * r2}" y2="${100 + Math.sin(ang) * r2}" stroke="#c8102e" stroke-width="2"/>`;
  }).join("");
  return `<svg viewBox="0 0 200 200" class="arena">${rings}${spikes}<text x="100" y="105" text-anchor="middle" fill="#fff" font-family="Cinzel,serif" font-size="14">Dia ${state.dia}</text></svg>`;
}
function tabArena() {
  if (isGM()) return tabArenaGM();
  const mt = myTeams(); if (!mt.length) return semEquipe();
  const mine = state.areas.filter((a) => a.exp.some((ti) => mt.includes(ti)));
  return `<section class="card arenacard">${arenaSVG()}<div><h3>A arena se estreita</h3><p class="muted">A cada dia os espinhos avançam e empurram as equipes umas contra as outras.</p></div></section>
  <section class="card"><h3>Áreas descobertas <span class="muted">${mine.length}</span></h3>
    ${mine.length ? mine.map((a) => `<div class="area ${a.engolida ? "gone" : ""}"><div class="row"><b class="aname">${a.engolida ? "✖ " : ""}${esc(a.nome)}</b>
      ${a.itemId ? `<button class="icon" data-goarea="${state.areas.indexOf(a)}" title="Mostrar no mapa">👁</button>` : ""}${a.engolida ? `<span class="muted small">engolida pelos espinhos</span>` : ""}</div>
      <textarea data-nota="area:${a.id}" rows="2" placeholder="Suas anotações sobre este lugar…">${esc(nota("area:" + a.id))}</textarea></div>`).join("")
      : `<p class="muted">Sua equipe ainda não descobriu nenhuma área.</p>`}
  </section>`;
}
function tabArenaGM() {
  const eqs = state.equipes;
  const fechando = state.areas.filter((a) => !a.engolida && a.fecha === state.dia + 1);
  return `
  <section class="card arenacard">${arenaSVG()}
    <div><h3>A arena se estreita</h3><p class="muted">A cada dia os espinhos avançam e empurram as equipes umas contra as outras, até o encontro final sob a Lua de Sangue.</p>
    ${fechando.length ? `<p class="warnt">Amanhã os espinhos engolem: ${fechando.map((a) => esc(a.nome)).join(", ")}.</p>` : ""}</div>
  </section>
  ${isGM() ? `<section class="card"><h3>Nova área</h3>
    <div class="row"><input id="arNome" placeholder="Nome (ex.: Capela, Rancho do Zé)"></div>
    <div class="row" style="margin-top:6px"><button class="primary" data-newarea="pin">📍 Marcador no centro da tela</button><button data-newarea="sel">Usar item selecionado</button><button class="ghost" data-newarea="lista">Só na lista</button></div>
  </section>` : ""}
  <section class="card"><h3>Áreas <span class="muted">${state.areas.filter((a) => !a.engolida).length} abertas</span></h3>
    ${state.areas.length ? state.areas.map((a, i) => `<div class="area ${a.engolida ? "gone" : ""}">
      <div class="row"><b class="aname">${a.engolida ? "✖ " : ""}${esc(a.nome)}</b>
        ${a.itemId ? `<button class="icon" data-goarea="${i}" title="Mostrar no mapa">👁</button>` : ""}
        ${isGM() ? `<select data-areafecha="${i}" title="Dia em que os espinhos engolem a área"><option value="0">não fecha</option>${[2, 3, 4, 5, 6].map((d) => `<option value="${d}" ${a.fecha === d ? "selected" : ""}>fecha no dia ${d}</option>`).join("")}</select>
        <button class="icon danger" data-delarea="${i}">✕</button>` : a.fecha ? `<span class="muted small">fecha no dia ${a.fecha}</span>` : ""}</div>
      <div class="chips">${eqs.map((t, ti) => `<button class="chip ${a.exp.includes(ti) ? "on" : ""}" style="--tc:${t.cor}" data-areaexp="${i}|${ti}" ${isGM() ? "" : "disabled"} title="Explorada por ${esc(t.nome)}">${esc(t.nome)}</button>`).join("")}</div>
      ${isGM() ? `<input data-areanota="${i}" value="${esc(a.notas)}" placeholder="Notas do mestre (recursos, perigos…)">` : a.notas ? `<p class="muted small">${esc(a.notas)}</p>` : ""}
      ${a.buscas.length ? `<p class="muted small">Já vasculharam: ${a.buscas.map((id) => esc(findM(id) ? mName(findM(id).m) : "?")).join(", ")}${isGM() ? ` <button class="ghost icon" data-areazera="${i}">zerar</button>` : ""}</p>` : ""}
    </div>`).join("") : `<p class="muted">Nenhuma área ainda.${isGM() ? " Crie as áreas do point crawl acima." : ""}</p>`}
  </section>`;
}

/* ---------- Agenda das equipes rivais (privada do mestre) ---------- */
const ESTRATEGIAS = [
  ["Defensiva", "Fica na base reforçando defesas e protegendo o sacrifício."],
  ["Coleta", "Sai para explorar e juntar água, comida e sucata."],
  ["Caçada", "Planeja matar o sacrifício de {alvo} esta noite."],
  ["Aliança", "Procura {alvo} para propor uma parceria pontual."],
  ["Espionagem", "Manda alguém observar a base de {alvo}."],
  ["Emboscada", "Prepara uma armadilha no caminho de {alvo}."],
  ["Sabotagem", "Tenta roubar ou estragar os recursos de {alvo}."],
  ["Negociação", "Oferece informações em troca de recursos a {alvo}."],
];
function sortearEstrategia(ti) {
  const outros = state.equipes.filter((t, i) => i !== ti && t.membros.some((m) => m.vivo));
  const alvo = outros.length ? outros[Math.floor(Math.random() * outros.length)].nome : "outra equipe";
  const [n, d] = ESTRATEGIAS[Math.floor(Math.random() * ESTRATEGIAS.length)];
  return `Dia ${state.dia} — ${n}: ${d.replace("{alvo}", alvo)}`;
}

/* ---------- Relações entre equipes ---------- */
const ATITUDES = ["Aliada", "Amistosa", "Neutra", "Desconfiada", "Hostil"];
const relKey = (i, j) => (i < j ? `${i}-${j}` : `${j}-${i}`);
const relDe = (i, j) => state.rel?.[relKey(i, j)] || "Neutra";
function relacoesCard() {
  const ativos = state.equipes.map((t, i) => ({ t, i })).filter((x) => x.t.membros.length);
  const pares = []; for (let a = 0; a < ativos.length; a++) for (let b = a + 1; b < ativos.length; b++) pares.push([ativos[a], ativos[b]]);
  return `<section class="card"><h3>Relações entre equipes</h3>
    ${pares.length ? `<table class="rel">${pares.map(([A, B]) => `<tr><td><span style="color:${A.t.cor}">●</span> ${esc(A.t.nome)}</td><td><span style="color:${B.t.cor}">●</span> ${esc(B.t.nome)}</td>
      <td>${isGM() ? `<select data-rel="${relKey(A.i, B.i)}">${opt(ATITUDES, relDe(A.i, B.i))}</select>` : `<span class="att ${relDe(A.i, B.i)}">${relDe(A.i, B.i)}</span>`}</td></tr>`).join("")}</table>`
      : `<p class="muted">Adicione membros a pelo menos duas equipes.</p>`}
    <p class="muted small">A atitude aparece nos encontros de negociação.</p>
  </section>`;
}

/* ---------- Desejo final ---------- */
function desejoCard() {
  if (isGM()) {
    const ds = readJSON(lsDesejos(), []);
    return `<section class="card"><h3>Desejos para a Coroa <span class="muted">só você vê</span></h3>
      ${ds.length ? `<ul class="plain">${ds.map((d) => `<li><b>${esc(d.nome)}:</b> ${esc(d.texto)} <span class="muted small">${new Date(d.at).toLocaleString("pt-BR")}</span></li>`).join("")}</ul>` : `<p class="muted">Nenhum desejo recebido ainda.</p>`}
      <p class="muted small">O pedido pode ser interpretado da maneira mais cínica possível — principalmente se não for bem detalhado.</p>
      ${ds.length ? `<button class="ghost" id="btnDesejosClr">Limpar lista</button>` : ""}</section>`;
  }
  const meu = lsGet(NS + ":meudesejo:" + roomId) || "";
  return `<section class="card"><h3>Seu desejo para a Coroa</h3>
    <p class="muted">Só o mestre recebe. Detalhe bem: a Coroa pode interpretar o pedido da maneira mais cínica possível.</p>
    <textarea id="meuDesejo" rows="3" placeholder="O que você pediria?">${esc(meu)}</textarea>
    <button class="primary" id="btnDesejo">Enviar ao mestre</button></section>`;
}
function guardarDesejo(d) {
  const ds = readJSON(lsDesejos(), []);
  if (ds.some((x) => x.id === d.id)) return;
  const i = ds.findIndex((x) => x.nome === d.nome); if (i >= 0) ds.splice(i, 1);
  ds.unshift(d); lsSet(lsDesejos(), JSON.stringify(ds.slice(0, 40)));
}

/* =========================================================
   v2 — sincronia por mensagens, visões de mestre e jogador,
   melhorias e bestiário editáveis, mapa vermelho no sino
   ========================================================= */

/* ---------- Sincronia ---------- */
const SYNC = NS + "/state";
const lsState = () => NS + ":state:" + roomId;
const SCH = 5000; const syncParts = {};
async function sendChunks(payload) {
  if (!obrOk) return;
  const str = JSON.stringify(payload); const n = Math.max(1, Math.ceil(str.length / SCH)); const m = uid();
  for (let i = 0; i < n; i++) {
    try { await OBR.broadcast.sendMessage(SYNC, { m, i, n, d: str.slice(i * SCH, (i + 1) * SCH) }); } catch { return; }
    if (n > 1) await sleep(60);
  }
}
function onSyncChunk(data) {
  if (!data?.m) return;
  const p = (syncParts[data.m] ||= { n: data.n, parts: [], got: 0, at: Date.now() });
  if (p.parts[data.i] === undefined) { p.parts[data.i] = data.d; p.got++; }
  if (p.got === p.n) { delete syncParts[data.m]; try { onSync(JSON.parse(p.parts.join(""))); } catch { /* */ } }
  for (const [k, v] of Object.entries(syncParts)) if (Date.now() - v.at > 60000) delete syncParts[k];
}
let bcastTimer;
function broadcastState() { clearTimeout(bcastTimer); bcastTimer = setTimeout(() => sendChunks({ kind: "state", state }), 150); }
function onSync(obj) {
  if (obj.kind === "hello") { if (isGM()) broadcastState(); return; }
  if (obj.kind === "diario") {
    if (!isGM()) return;
    const cur = state.diarios?.[obj.ti]; if (cur && num(cur.at) > num(obj.at)) return;
    (state.diarios ||= {})[obj.ti] = { text: obj.text, by: obj.by, at: obj.at }; save(true); softRender(); return;
  }
  if (obj.kind === "state" && obj.state && !isGM()) {
    if (num(obj.state.rev) >= num(state.rev)) { state = normalize(obj.state); lsSet(lsState(), JSON.stringify(state)); softRender(); }
  }
}
function fillOwners() {
  for (const x of allMembers()) if (x.m.sheetId && !x.m.ownerId) { const s = getSheet(x.m.sheetId); if (s?.owner?.id) x.m.ownerId = s.owner.id; }
}

/* ---------- Mapa vermelho enquanto o sino toca ---------- */
async function redFlash() {
  if (!obrOk) return;
  try {
    if (!(await OBR.scene.isReady())) return;
    const id = NS + "-sangue";
    await OBR.scene.local.deleteItems([id]).catch(() => {});
    const shape = buildShape().id(id).shapeType("RECTANGLE").width(400000).height(400000).position({ x: -200000, y: -200000 })
      .fillColor("#b0001a").fillOpacity(0.45).strokeWidth(0).strokeOpacity(0).layer("TEXT").locked(true).disableHit(true).build();
    await OBR.scene.local.addItems([shape]);
    for (const o of [0.25, 0.5, 0.25, 0.5, 0.3, 0.45, 0.25, 0.12, 0.05]) {
      await sleep(550);
      await OBR.scene.local.updateItems([id], (ds) => { for (const d of ds) d.style.fillOpacity = o; });
    }
    await OBR.scene.local.deleteItems([id]);
  } catch (e) { console.warn("Não consegui tingir o mapa", e); }
}

/* ---------- Visões por jogador ---------- */
function myTeams() {
  if (isGM()) return state.equipes.map((_, i) => i);
  return state.equipes.map((t, i) => (t.membros.some((m) => m.ownerId && m.ownerId === me.id) ? i : -1)).filter((i) => i >= 0);
}
function myMemberIds() { return allMembers().filter((x) => x.m.ownerId === me.id).map((x) => x.m.id); }
function conhecido(v) { state.conhece ||= {}; return (state.conhece[v] ||= { t: [], m: [] }); }
function knownByMe() {
  const t = new Set(), m = new Set();
  for (const v of myTeams()) { const c = state.conhece?.[v]; if (c) { c.t.forEach((x) => t.add(x)); c.m.forEach((x) => m.add(x)); } }
  return { t, m };
}
const lsNotas = () => NS + ":notas:" + roomId;
function nota(k) { return readJSON(lsNotas(), {})[k] || ""; }
function setNota(k, v) { const n = readJSON(lsNotas(), {}); n[k] = v; lsSet(lsNotas(), JSON.stringify(n)); }
const semEquipe = () => `<section class="card"><p class="muted">Você ainda não está em uma equipe. Peça ao mestre para adicionar sua ficha na aba Equipes.</p></section>`;

/* ---------- Melhorias editáveis ---------- */
function melList() { return state.melhorias; }
function melGet(k) { return state.melhorias.find((m) => m.k === k); }
function melBloqueada(t, m) { return m.k !== "limpeza" && melGet("limpeza") && !t.base.includes("limpeza"); }
function melCusto(m) { return [m.custo ? `${m.custo} sucata` : "", m.req ? `requer ${m.req}` : ""].filter(Boolean).join(" · ") || "sem custo"; }

/* ---------- Bestiário com criaturas do mestre ---------- */
function bestList() { return [...BESTIARIO, ...state.bestiario]; }
function bestForm(c) {
  c ||= { nome: "", tipo: "", vd: "", def: "", pv: "", maq: "", desl: "", attrs: "", per: "1d20", ini: "1d20", res: { Fortitude: "1d20", Reflexos: "1d20", Vontade: "1d20" }, pp: "", rd: "", vuln: "", hab: [], atq: [], extra: [] };
  const f = (id, label, v, extra = "") => `<label>${label} <input id="bf-${id}" value="${esc(v ?? "")}" ${extra}></label>`;
  return `<div class="bestform">
    <div class="grid2">${f("nome", "Nome", c.nome)}${f("tipo", "Tipo e tamanho", c.tipo, 'placeholder="Criatura de Sangue Média"')}</div>
    <div class="grid3">${f("vd", "VD / NEX", c.vd)}${f("def", "Defesa", c.def)}${f("pv", "PV máximos", c.pv)}${f("pe", "PE máximos", c.pe)}${f("maq", "Machucado", c.maq)}${f("desl", "Deslocamento", c.desl)}</div>
    ${f("attrs", "Atributos", c.attrs, 'placeholder="AGI 2 · FOR 1 · INT 1 · PRE 3 · VIG 2"')}
    <label>Perícias (uma por linha: perícia | teste) <textarea id="bf-per" rows="3" placeholder="Furtividade | 2d20+20&#10;Investigação | 1d20+15">${esc((c.pericias || []).map((p) => p.join(" | ")).join("\n"))}</textarea></label>
    <div class="grid3">${f("per", "Percepção", c.per, 'placeholder="2d20+5"')}${f("ini", "Iniciativa", c.ini)}${f("fort", "Fortitude", c.res?.Fortitude)}${f("ref", "Reflexos", c.res?.Reflexos)}${f("von", "Vontade", c.res?.Vontade)}</div>
    <div class="grid3">${f("pp", "Presença perturbadora", c.pp, 'placeholder="DT 20 · 3d8 mental"')}${f("rd", "Resistências", c.rd)}${f("vuln", "Vulnerabilidades", c.vuln)}</div>
    <label>Ataques (um por linha: nome | teste | dano | tipo) <textarea id="bf-atq" rows="3" placeholder="Mordida | 2d20+5 | 1d6+2 | corte">${esc((c.atq || []).map((a) => a.join(" | ")).join("\n"))}</textarea></label>
    <label>Outras rolagens (nome | dados) <textarea id="bf-extra" rows="2" placeholder="Chicotada | 4d8">${esc((c.extra || []).map((a) => a.join(" | ")).join("\n"))}</textarea></label>
    <label>Habilidades (uma por linha) <textarea id="bf-hab" rows="4">${esc((c.hab || []).join("\n"))}</textarea></label>
    <div class="row"><button class="primary" id="btnBestSave">${ui.bestEdit ? "Salvar alterações" : "Adicionar ao bestiário"}</button>${ui.bestEdit ? `<button class="ghost" id="btnBestCancel">Cancelar</button>` : ""}</div>
  </div>`;
}
function bestFromForm() {
  const v = (id) => (document.getElementById("bf-" + id)?.value || "").trim();
  const lines = (id) => v(id).split("\n").map((l) => l.trim()).filter(Boolean);
  const nome = v("nome"); if (!nome) { toast("Dê um nome à criatura."); return null; }
  return {
    id: ui.bestEdit || uid(), custom: true, nome, tipo: v("tipo"), vd: v("vd"), def: v("def"), pv: v("pv"), maq: v("maq"), desl: v("desl"), attrs: v("attrs"),
    per: v("per") || "1d20", ini: v("ini") || "1d20", res: { Fortitude: v("fort") || "1d20", Reflexos: v("ref") || "1d20", Vontade: v("von") || "1d20" },
    pp: v("pp"), rd: v("rd"), vuln: v("vuln"), hab: lines("hab"), pe: v("pe"),
    pericias: lines("per").map((l) => { const p = l.split("|").map((x) => x.trim()); return [p[0] || "Perícia", p[1] || "1d20"]; }),
    atq: lines("atq").map((l) => { const p = l.split("|").map((x) => x.trim()); return [p[0] || "Ataque", p[1] || "1d20", p[2] || "", p[3] || ""]; }),
    extra: lines("extra").map((l) => { const p = l.split("|").map((x) => x.trim()); return [p[0] || "Rolagem", p[1] || "1d6"]; }),
  };
}

/* =========================================================
   v2.2 — NPCs nas equipes, diário da equipe, epílogo
   ========================================================= */

/* ---------- NPCs ---------- */
function npcGet(id) { return state.bestiario.find((c) => c.id === id) || null; }
function npcPv(n) { if (n.pvAtual === undefined || n.pvAtual === "") n.pvAtual = num(n.pv); if (n.peAtual === undefined || n.peAtual === "") n.peAtual = num(n.pe); return n; }
function npcMember(id) { return allMembers().find((x) => x.m.npcId === id) || null; }
function npcsLivres() { return state.bestiario.filter((c) => !npcMember(c.id)); }
function novoNpc(nome) {
  const c = { id: uid(), custom: true, nome, tipo: "NPC", vd: "", def: "", pv: "", pvAtual: "", pe: "", peAtual: "", desl: "", attrs: "", per: "1d20", ini: "1d20",
    res: { Fortitude: "1d20", Reflexos: "1d20", Vontade: "1d20" }, pp: "", rd: "", vuln: "", hab: [], atq: [], extra: [], pericias: [] };
  state.bestiario.push(c); return c;
}
function npcExpr(n, pericia) {
  const p = (n.pericias || []).find((x) => x[0].toLowerCase() === pericia.toLowerCase());
  return p?.[1] || n.res?.[pericia] || (pericia === "Percepção" ? n.per : pericia === "Iniciativa" ? n.ini : "") || "1d20";
}
function npcTest(n, pericia, extra = 0) {
  const m = /^(\d+)d20([+-]\d+)?$/.exec(String(npcExpr(n, pericia)).replace(/\s+/g, ""));
  const dados = (m ? Number(m[1]) : 1) - (n.des ? 1 : 0);
  const r = rollTest(dados); const b = (m ? num(m[2]) : 0) - clamp(num(n.pen), 0, 6) + num(extra);
  diceAnim(r.dice, r.pick, r.worst);
  return { ...r, bonus: b, total: r.pick + b, txt: `[${r.dice.join(", ")}]${r.worst ? " (pior)" : ""} → ${r.pick} ${fmt(b)} = ${r.pick + b}` };
}
function npcCard(c, ci) {
  npcPv(c); const mem = npcMember(c.id); const tIdx = mem ? state.equipes.indexOf(mem.t) : -1;
  const tags = [mem && !mem.m.vivo ? `<span class="tag bad">morto</span>` : "", c.des ? `<span class="tag bad">desertor${num(c.pen) ? ` −${num(c.pen)}` : ""}</span>` : "",
    (c.cond || []).length ? `<span class="tag bad">${esc(c.cond.join(", "))} <button class="icon" data-npcclr="${c.id}" title="Limpar condições">✕</button></span>` : "",
    num(c.semAgua) ? `<span class="tag">sem água ×${c.semAgua}</span>` : "", num(c.semComida) ? `<span class="tag">sem comida ×${c.semComida}</span>` : "",
    ...(c.rewards || []).map((r) => `<span class="tag good">✦ ${esc(r)}</span>`)].filter(Boolean).join(" ");
  return `<details class="card beast custom npc" data-npcbox="${c.id}" ${ui.npcOpen === c.id ? "open" : ""}><summary><b>${esc(c.nome)}</b> <span class="muted">${esc(c.tipo || "NPC")}${tIdx >= 0 ? ` · ${esc(state.equipes[tIdx].nome)}` : " · sem equipe"}</span></summary>
    <div class="row npc-top"><label class="inline">Equipe <select data-npcteam="${c.id}"><option value="-1">— nenhuma —</option>${opt(state.equipes.map((t, i) => [i, t.nome]), tIdx)}</select></label>
      <span class="grow"></span><button class="ghost icon" data-bestedit="${c.id}">✎ editar</button><button class="ghost icon danger" data-bestdel="${c.id}">✕ apagar</button></div>
    <div class="grid2 npc-pv">
      <label>PV <span class="row"><input type="number" data-npc="${c.id}|pvAtual" value="${esc(c.pvAtual)}"> / <input type="number" data-npc="${c.id}|pv" value="${esc(c.pv)}"></span></label>
      <label>PE <span class="row"><input type="number" data-npc="${c.id}|peAtual" value="${esc(c.peAtual)}"> / <input type="number" data-npc="${c.id}|pe" value="${esc(c.pe)}"></span></label>
    </div>
    ${tags ? `<div class="row" style="margin:4px 0">${tags}</div>` : ""}
    ${c.def || c.desl || c.attrs ? `<p class="muted small">${c.def ? `Defesa ${esc(c.def)} · ` : ""}${c.desl ? `Desloc. ${esc(c.desl)} · ` : ""}${esc(c.attrs || "")}${c.pp ? `<br>Presença perturbadora: ${esc(c.pp)}` : ""}${c.rd ? `<br>Resistências: ${esc(c.rd)}` : ""}${c.vuln ? ` · Vulnerável: ${esc(c.vuln)}` : ""}</p>` : ""}
    <div class="rolls">
      <button data-mon="${ci}|per">Percepção ${esc(c.per)}</button><button data-mon="${ci}|ini">Iniciativa ${esc(c.ini)}</button>
      ${Object.entries(c.res || {}).map(([k, v]) => `<button data-mon="${ci}|res|${k}">${k} ${esc(v)}</button>`).join("")}
      ${(c.pericias || []).map((p, pi) => `<button data-npcper="${c.id}|${pi}">${esc(p[0])} ${esc(p[1])}</button>`).join("")}
    </div>
    <div class="atks">${(c.atq || []).map((a, ai) => `<button class="primary" data-monatk="${ci}|${ai}">🎲 ${esc(a[0])} <small>${esc(a[1])} · ${esc(a[2])} ${esc(a[3])}</small></button>`).join("")}
      ${(c.extra || []).map((e, ei) => `<button data-monex="${ci}|${ei}">🎲 ${esc(e[0])} <small>${esc(e[1])}</small></button>`).join("")}</div>
    ${(c.hab || []).length ? `<ul class="plain small">${c.hab.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
    <textarea data-npc="${c.id}|notas" rows="2" placeholder="Notas do mestre sobre este NPC…">${esc(c.notas || "")}</textarea>
  </details>`;
}

/* ---------- Diário da equipe ---------- */
let diarioTimer = null;
function diarioBox(ti) {
  const d = state.diarios?.[ti];
  return `<label class="diario">📓 Diário da equipe <span class="muted small">(todos da equipe e o mestre leem e editam)</span>
    <textarea data-diario="${ti}" rows="5" placeholder="Planos, pistas, quem é suspeito, o que falta construir…">${esc(d?.text || "")}</textarea></label>
    ${d?.at ? `<p class="muted small">Última edição: ${esc(d.by || "?")}, ${new Date(d.at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>` : ""}`;
}
function editarDiario(ti, text) {
  state.diarios ||= {};
  const d = { text, by: me.name || (isGM() ? "Mestre" : "Jogador"), at: Date.now() };
  if (isGM()) { state.diarios[ti] = d; save(true); return; }
  state.diarios[ti] = d; // mostra já para quem está digitando
  clearTimeout(diarioTimer);
  diarioTimer = setTimeout(() => sendChunks({ kind: "diario", ti: Number(ti), ...d }), 700);
}

/* ---------- Epílogo ---------- */
function epilogoHTML(desejos) {
  const vivos = aliveMembers();
  const mortesReg = state.mortes || [];
  const nomesReg = new Set(mortesReg.map((m) => m.nome));
  const outrosMortos = allMembers().filter((x) => !x.m.vivo && !nomesReg.has(mName(x.m)));
  const des = allMembers().filter((x) => x.m.des);
  const ints = ESTIGMAS.filter((e) => (state.intencoes[e.nome] || []).length);
  const desfecho = state.finalFeito ? "O sacrifício final foi realizado sob a Lua de Sangue." : state.fracassou ? "O Hexatombe fracassou." : `O ritual chegou ao dia ${state.dia} de 6.`;
  const log = [...state.log].reverse();
  return `<div class="epi">
    <p class="epi-lead">${desfecho} ${state.sacrificios.length} de 6 sacrifícios realizados.</p>
    <h4>Sobreviventes (${vivos.length})</h4>
    <ul>${state.equipes.map((t) => { const v = t.membros.filter((m) => m.vivo); return v.length ? `<li><b>${esc(t.nome)}:</b> ${v.map((m) => esc(mName(m)) + (m.sac ? ` ✠${esc(m.sac)}` : "")).join(", ")}</li>` : ""; }).join("") || "<li>Ninguém.</li>"}</ul>
    <h4>Sacrifícios</h4>
    <ol>${state.sacrificios.map((s) => `<li><b>${esc(s.estigma)}</b> — ${esc(s.vitima)} (${esc(s.equipe)}), dia ${s.dia}${s.algoz ? `, pelas mãos de ${esc(s.algoz)}` : ""}</li>`).join("") || "<li>Nenhum.</li>"}</ol>
    <h4>Mortos</h4>
    <ul>${mortesReg.map((m) => `<li>${esc(m.nome)} (${esc(m.equipe)}) — dia ${m.dia}${m.algoz ? `, por ${esc(m.algoz)}` : ""}${m.sac ? ` · sacrifício de ${esc(m.sac)}` : ""}</li>`).join("")}${outrosMortos.map((x) => `<li>${esc(mName(x.m))} (${esc(x.t.nome)})</li>`).join("")}${!mortesReg.length && !outrosMortos.length ? "<li>Ninguém.</li>" : ""}</ul>
    <h4>Intenções cumpridas</h4>
    <ul>${ints.map((e) => `<li><b>${esc(e.nome)}:</b> ${(state.intencoes[e.nome] || []).map((id) => findM(id)).filter(Boolean).map((x) => esc(mName(x.m))).join(", ")}</li>`).join("") || "<li>Nenhuma.</li>"}</ul>
    ${des.length ? `<h4>Desertores</h4><p>${des.map((x) => esc(mName(x.m)) + (x.m.vivo ? "" : " ☠")).join(", ")}</p>` : ""}
    ${desejos?.length ? `<h4>Desejos para a Coroa</h4><ul>${desejos.map((d) => `<li><b>${esc(d.nome)}:</b> “${esc(d.texto)}”</li>`).join("")}</ul>` : ""}
    ${log.length ? `<h4>Últimos acontecimentos</h4><ul class="epi-log">${log.map((l) => `<li><span>Dia ${l.dia}</span> ${esc(l.txt)}</li>`).join("")}</ul>` : ""}
  </div>`;
}
function tabEpilogo() {
  const ds = readJSON(lsDesejos(), []);
  const incl = ui.epiDesejos !== false;
  return `<section class="card"><h3>Epílogo</h3>
    <p class="muted">O resumo do Hexatombe: sobreviventes, sacrifícios, mortes, intenções e desejos. Publique para que os jogadores vejam na aba Ritual, ou baixe para guardar.</p>
    <label class="check"><input type="checkbox" id="epiDes" ${incl ? "checked" : ""}> Incluir os desejos (${ds.length})</label>
    <div class="row">
      <button class="primary" id="btnEpiPub">${state.epilogo ? "Atualizar o epílogo publicado" : "Publicar para os jogadores"}</button>
      ${state.epilogo ? `<button class="ghost" id="btnEpiOff">Despublicar</button>` : ""}
      <button id="btnEpiDown">Baixar (HTML)</button>
    </div>
    ${state.epilogo ? `<p class="okt">Publicado em ${new Date(state.epilogo.at).toLocaleString("pt-BR")}.</p>` : ""}
  </section>
  <section class="card epicard"><h3>Prévia</h3>${epilogoHTML(incl ? ds : [])}</section>`;
}
function epilogoArquivo(desejos) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Epílogo do Hexatombe</title>
<style>body{background:#0b0708;color:#ece6e1;font:15px/1.55 Georgia,serif;max-width:760px;margin:30px auto;padding:0 18px}h1{font:900 34px Georgia,serif;letter-spacing:.2em;color:#b3001b;margin:0}
h4{font:600 14px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#fff;border-left:3px solid #b3001b;padding-left:8px;margin:22px 0 6px}.epi-lead{font-size:18px}li{margin:3px 0}.epi-log span{color:#a8969a;font-size:12px;margin-right:6px}</style></head>
<body><h1>HEXATOMBE</h1><p style="color:#a8969a">Epílogo · ${new Date().toLocaleDateString("pt-BR")}</p>${epilogoHTML(desejos)}</body></html>`;
}

/* ---------- Encerrar o dia (assistente do mestre) ---------- */
function encerrarDiaDialog() {
  const hoje = sacrificiosHoje();
  const equipes = state.equipes.map((t, ti) => ({ t, ti, vivos: t.membros.filter((m) => m.vivo) })).filter((x) => x.vivos.length);
  const prod = state.equipes.map((t) => ({ t, a: t.base.reduce((s, k) => s + num(melGet(k)?.agua), 0), c: t.base.reduce((s, k) => s + num(melGet(k)?.comida), 0) })).filter((x) => x.a || x.c);
  const fecham = state.areas.filter((a) => !a.engolida && a.fecha && a.fecha <= state.dia + 1);
  const ultimo = state.dia >= 6;
  const wrap = document.createElement("div"); wrap.className = "dialog";
  wrap.innerHTML = `<div class="box wide-box">
    <h3>Encerrar o dia ${state.dia}</h3>
    <div class="ed-sec ${hoje.length ? "ok" : "bad"}"><b>${hoje.length ? "✓ Houve sacrifício hoje" : "⚠ Nenhum sacrifício hoje"}</b>
      <span>${hoje.length ? hoje.map((s) => `${esc(s.vitima)} (${esc(s.estigma)})`).join(", ") : "Pelas regras, se o dia terminar assim, o Hexatombe fracassa. Registre a morte antes, se ela aconteceu."}</span></div>
    <div class="ed-sec"><b>Consumo de água e comida</b><span class="muted small">Ajuste quanto cada um consome. Marcado com 0 = fica sem; 2 ou mais recupera uma penalidade antiga.</span>
      ${equipes.map(({ t, ti, vivos }) => {
        let a = t.agua, c = t.comida;
        return `<div class="ed-team" data-edteam="${ti}"><label class="check"><input type="checkbox" class="ed-on" checked> <b style="color:${t.cor}">${esc(t.nome)}</b> <span class="muted small">estoque: 💧 ${t.agua} · 🍖 ${t.comida}</span></label>
          <table class="cons"><tbody>${vivos.map((m) => { const da = a > 0 ? 1 : 0; a -= da; const dc = c > 0 ? 1 : 0; c -= dc;
            return `<tr><td>${esc(mName(m))}</td><td>💧 <input type="number" min="0" value="${da}" data-edc="${m.id}|a"></td><td>🍖 <input type="number" min="0" value="${dc}" data-edc="${m.id}|c"></td></tr>`; }).join("")}</tbody></table>
          <p class="ed-warn muted small"></p></div>`;
      }).join("") || `<p class="muted">Nenhum membro vivo.</p>`}
    </div>
    ${ultimo ? `<div class="ed-sec"><b>Último dia</b><span>O sexto dia não amanhece de novo: aqui só o consumo é aplicado. Use o sacrifício final na aba Ritual.</span></div>` : `
    <div class="ed-sec"><b>Ao amanhecer (dia ${state.dia + 1})</b>
      <span>${prod.length ? "Produção da base: " + prod.map((x) => `${esc(x.t.nome)} +${x.a} 💧 +${x.c} 🍖`).join(" · ") : "Nenhuma base produz recursos."}</span>
      <span>${fecham.length ? "Os espinhos engolem: " + fecham.map((a) => esc(a.nome)).join(", ") : "Nenhuma área fecha."}</span>
      ${state.dia + 1 === 6 ? `<span>A próxima noite é a da <b>Lua de Sangue</b>.</span>` : ""}</div>`}
    <div class="row"><button class="primary" id="edGo">${ultimo ? "Aplicar consumo" : `Aplicar e amanhecer o dia ${state.dia + 1}`}</button><button id="edCancel">Cancelar</button></div>
  </div>`;
  document.body.appendChild(wrap);
  const check = () => {
    let ok = true;
    wrap.querySelectorAll(".ed-team").forEach((box) => {
      const t = state.equipes[box.dataset.edteam]; const on = box.querySelector(".ed-on").checked;
      let a = 0, c = 0; box.querySelectorAll("[data-edc]").forEach((i) => { if (i.dataset.edc.endsWith("|a")) a += num(i.value); else c += num(i.value); });
      const falta = on && (a > t.agua || c > t.comida);
      box.querySelector(".ed-warn").textContent = falta ? `Estoque insuficiente: pedem ${a} água e ${c} comida.` : on ? `Gasta ${a} água e ${c} comida.` : "Esta equipe fica de fora (sem consumo registrado).";
      box.classList.toggle("falta", falta); if (falta) ok = false;
    });
    wrap.querySelector("#edGo").disabled = !ok;
  };
  wrap.addEventListener("input", check); check();
  wrap.querySelector("#edCancel").addEventListener("click", () => wrap.remove());
  wrap.addEventListener("click", (e) => { if (e.target === wrap) wrap.remove(); });
  wrap.querySelector("#edGo").addEventListener("click", () => {
    beginAction("Encerrar o dia");
    const linhas = [`🌙 Fim do dia ${state.dia}.`];
    wrap.querySelectorAll(".ed-team").forEach((box) => {
      if (!box.querySelector(".ed-on").checked) return;
      const map = {}; box.querySelectorAll("[data-edc]").forEach((i) => { const [id, k] = i.dataset.edc.split("|"); (map[id] ||= { id, a: 0, c: 0 })[k] = Math.max(0, num(i.value)); });
      const r = consumir(Number(box.dataset.edteam), Object.values(map), true); if (r) linhas.push(...r);
    });
    wrap.remove();
    if (ultimo) { addEvent(linhas[0] + " Consumo aplicado."); announce(linhas.join("\n")); save(); endAction(); return; }
    addEvent(linhas[0] + " Consumo aplicado."); announce(linhas.join("\n"));
    state.fase = 2; avancarFase(); endAction();
  });
}

/* ---------- HTML ---------- */
const app = document.getElementById("app");
const dis = () => (isGM() ? "" : "disabled");
function memberOptions(filter = () => true, sel = "", empty = "") {
  let h = empty ? `<option value="">${esc(empty)}</option>` : "";
  for (const t of state.equipes) {
    const ms = t.membros.filter(filter); if (!ms.length) continue;
    h += `<optgroup label="${esc(t.nome)}">${ms.map((m) => `<option value="${m.id}" ${m.id === sel ? "selected" : ""}>${esc(mName(m))}${m.sac ? " ✠" : ""}${m.des ? " ✝" : ""}</option>`).join("")}</optgroup>`;
  }
  return h;
}
const opt = (list, sel) => list.map((v) => { const [val, lab] = Array.isArray(v) ? v : [v, v]; return `<option value="${esc(val)}" ${String(val) === String(sel) ? "selected" : ""}>${esc(lab)}</option>`; }).join("");
const fmtT = (t) => new Date(t).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

function tabRitual() {
  const vivos = aliveMembers(); const des = vivos.filter((x) => x.m.des).length;
  const hoje = sacrificiosHoje().length;
  return `${state.epilogo && !isGM() ? `<section class="card epicard"><h3>Epílogo do Hexatombe</h3>${epilogoHTML(state.epilogo.desejos)}</section>` : ""}
  <section class="card dayhead">
    <div class="moon ${state.dia === 6 ? "blood" : ""}"><b>${state.dia}</b><span>de 6</span></div>
    <div class="dayinfo">
      <div class="fases">${FASES.map((f, i) => `<span class="${i === state.fase ? "on" : i < state.fase ? "done" : ""}">${f}</span>`).join("")}</div>
      <p class="muted">${FASE_DESC[state.fase]}</p>
      ${isGM() ? `<button class="ghost" id="btnEncerrar">🌙 Encerrar o dia ${state.dia}…</button>` : ""}
      ${isGM() ? `<button class="primary" id="btnFase">${state.fase < 2 ? `Avançar para ${FASES[state.fase + 1]}` : state.dia < 6 ? `Amanhecer: dia ${state.dia + 1}` : "Último dia"}</button>` : ""}
    </div>
  </section>

  <section class="card stats">
    <div><b>${state.sacrificios.length}/6</b><span>sacrifícios</span></div>
    <div class="${hoje ? "ok" : state.fase === 2 ? "warnc" : ""}"><b>${hoje ? "✓" : "—"}</b><span>sacrifício hoje</span></div>
    <div><b>${vivos.length}</b><span>vivos</span></div>
    <div><b>${des}</b><span>desertores</span></div>
  </section>

  ${state.fracassou ? `<div class="banner bad"><b>O HEXATOMBE FRACASSOU</b><span>Um dia passou sem sacrifício.</span>${isGM() ? `<button id="btnUnfail" class="ghost">Ignorar (continuar mesmo assim)</button>` : ""}</div>` : ""}
  ${state.herdeiro ? `<div class="banner"><b>NOVO SACRIFÍCIO DIGNO — ${esc(state.herdeiro)}</b><span>A Coroa deve escolher quem herda o estigma.</span>
    ${isGM() ? `<div class="row"><select id="heirSel">${memberOptions((m) => m.vivo && !m.sac)}</select><button class="primary" id="btnHeir">Marcar</button></div>` : ""}</div>` : ""}
  ${state.dia === 6 ? `<div class="banner blood"><b>LUA DE SANGUE</b><span>Só 6 podem estar vivos no sacrifício final (agora: ${vivos.length}). Desertores morrem se o sacrifício final não acontecer até a meia-noite.</span>
    ${isGM() && !state.finalFeito ? `<button class="primary" id="btnFinal" ${vivos.length > 6 ? 'title="Ainda há mais de 6 vivos"' : ""}>Restam 6: todos herdam o último estigma</button>` : state.finalFeito ? "<span>✓ Os seis herdaram o estigma.</span>" : ""}</div>` : ""}

  ${isGM() ? `<section class="card">
    <h3>Registrar morte</h3>
    <div class="grid2">
      <label>Quem morreu <select id="dVit">${memberOptions((m) => m.vivo, ui.dVit, "—")}</select></label>
      <label>Quem matou <select id="dKil">${memberOptions((m) => m.vivo, ui.dKil, "Ninguém / acidente")}</select></label>
    </div>
    <label class="check"><input type="checkbox" id="dDia"> Foi durante o dia (fora da lua)</label>
    <button class="danger-btn" id="btnMorte">☠ Registrar morte</button>
    <p class="muted">Se for sacrifício, o sino toca sozinho: castiga os desertores, transforma a equipe da vítima em desertora e libera a intenção do estigma. Um segundo sacrifício na mesma noite passa o estigma para quem matou.</p>
  </section>` : ""}

  <section class="card"><h3>Sacrifícios</h3>
    ${state.sacrificios.length ? `<ol class="sacs">${state.sacrificios.map((s) => `<li><span class="est">${esc(s.estigma)}</span> Dia ${s.dia} — ${esc(s.vitima)} <span class="muted">(${esc(s.equipe)}${s.algoz ? `, por ${esc(s.algoz)}` : ""})</span></li>`).join("")}</ol>` : `<p class="muted">Nenhum ainda.</p>`}
  </section>

  <section class="card"><h3>Acontecimentos</h3>
    ${state.log.length ? `<ul class="log">${state.log.map((l) => `<li><span class="t">D${l.dia}</span><pre>${esc(l.txt)}</pre></li>`).join("")}</ul>` : `<p class="muted">Nada ainda.</p>`}
  </section>
  <section class="card"><h3>Rolagens recentes</h3>
    ${rollLog.length ? `<ul class="log">${rollLog.map((l) => `<li><span class="t">${fmtT(l.at)}</span><pre>${esc(l.text)}</pre></li>`).join("")}</ul>` : `<p class="muted">Nenhuma.</p>`}
  </section>
  ${desejoCard()}
  ${isGM() ? `<section class="card"><h3>Backup do ritual</h3>
    <div class="row"><button id="btnSaveFile">Baixar estado (arquivo)</button><button id="btnLoadFile">Carregar arquivo</button></div>
    <p class="muted small">O estado do ritual já fica guardado na sala do Owlbear. O arquivo serve para levar a outra sala ou guardar uma cópia.</p>
    <input type="file" id="hxFile" accept=".json,application/json" hidden>
    <button class="ghost danger" id="btnReset" style="margin-top:8px">Começar um novo Hexatombe (zera tudo)</button></section>` : ""}`;
}

function tabEquipes() { return isGM() ? tabEquipesGM() : tabEquipesPlayer(); }
function knowTeamBox(ti) {
  const v = ui.viewTeam; if (v == null || v < 0 || v === ti) return "";
  return `<label class="check know"><input type="checkbox" data-know="t|${ti}" ${conhecido(v).t.includes(ti) ? "checked" : ""}> conhecida pela equipe ${esc(state.equipes[v]?.nome)}</label>`;
}
function knowMemBox(ti, m) {
  const v = ui.viewTeam; if (v == null || v < 0 || v === ti) return "";
  return `<input type="checkbox" class="knowm" title="Conhecido pela equipe ${esc(state.equipes[v]?.nome)}" data-know="m|${m.id}|${ti}" ${conhecido(v).m.includes(m.id) ? "checked" : ""}> `;
}
function tabEquipesPlayer() {
  const mt = myTeams(); if (!mt.length) return semEquipe();
  const k = knownByMe();
  const memRow = (m) => `<div class="pmem ${m.vivo ? "" : "dead"}"><div class="row"><b>${esc(mName(m))}</b>${m.sac ? `<span class="tag">✠ ${esc(m.sac)}</span>` : ""}${m.des ? `<span class="tag bad">desertor</span>` : ""}${m.vivo ? "" : `<span class="muted small">morto</span>`}</div>
    <textarea data-nota="m:${m.id}" rows="1" placeholder="Anotações sobre ${esc(mName(m))}…">${esc(nota("m:" + m.id))}</textarea></div>`;
  const teamCard = (t, mine, ms) => `<section class="card team" style="--tc:${t.cor}"><h3>${esc(t.nome)}${mine ? ` <span class="muted">sua equipe</span>` : ""}</h3>
    ${mine ? diarioBox(state.equipes.indexOf(t)) : ""}
    ${ms.length ? ms.map(memRow).join("") : `<p class="muted">Você ainda não conhece ninguém desta equipe.</p>`}
    <label>Anotações sobre a equipe <textarea data-nota="t:${t.id}" rows="2">${esc(nota("t:" + t.id))}</textarea></label></section>`;
  const outras = state.equipes.map((t, ti) => ({ t, ti })).filter((x) => !mt.includes(x.ti) && k.t.has(x.ti));
  return mt.map((ti) => teamCard(state.equipes[ti], true, state.equipes[ti].membros)).join("") +
    `<div class="section-title">Outras equipes</div>` +
    (outras.length ? outras.map(({ t }) => teamCard(t, false, t.membros.filter((m) => k.m.has(m.id)))).join("") : `<section class="card"><p class="muted">Sua equipe ainda não conheceu nenhuma outra.</p></section>`);
}
function tabEquipesGM() {
  const sheets = visibleSheets(); const usados = new Set(allMembers().map((x) => x.m.sheetId).filter(Boolean));
  const viewSel = `<section class="card"><h3>O que cada equipe conhece</h3>
    <div class="row"><span class="muted">Marcar o que a equipe</span><select id="viewTeam"><option value="-1">— escolha —</option>${opt(state.equipes.map((t, i) => [i, t.nome]), ui.viewTeam ?? -1)}</select><span class="muted">já conheceu</span></div>
    <p class="muted small">Os jogadores só veem as equipes e os integrantes marcados aqui, e nunca os recursos de ninguém nesta aba.</p></section>`;
  return viewSel + state.equipes.map((t, ti) => {
    const sac = t.membros.find((m) => m.sac && m.vivo);
    const desertora = t.membros.some((m) => m.des);
    return `<section class="card team" style="--tc:${t.cor}">
    <div class="row">
      <input type="color" data-team="${ti}|cor" value="${t.cor}" ${dis()} class="color">
      <input data-team="${ti}|nome" value="${esc(t.nome)}" ${dis()} class="tname">
      ${desertora ? `<span class="tag bad">desertora</span>` : sac ? `<span class="tag">✠ ${esc(sac.sac)}</span>` : `<span class="tag muted">sem sacrifício</span>`}
    </div>${knowTeamBox(ti)}
    <table class="members"><tbody>
    ${t.membros.map((m, mi) => `<tr class="${m.vivo ? "" : "dead"}">
      <td>${knowMemBox(ti, m)}${esc(mName(m))}${m.sheetId ? ` <span class="tag small" title="Ligado a uma ficha">ficha</span>` : m.npcId ? ` <span class="tag small npc" title="NPC (aba NPCs)">npc</span>` : ""}${m.des ? ` <span class="tag small bad">desertor</span>` : ""}</td>
      <td>${isGM() ? `<select data-mem="${ti}|${mi}|sac" title="Estigma (sacrifício)"><option value="">—</option>${opt(ESTIGMAS.map((e) => e.nome), m.sac || "")}</select>` : m.sac ? `✠ ${esc(m.sac)}` : ""}</td>
      <td>${isGM() ? `<button class="icon" data-memtog="${ti}|${mi}|vivo" title="Vivo/morto">${m.vivo ? "♥" : "☠"}</button><button class="icon" data-memtog="${ti}|${mi}|des" title="Desertor (só marca, sem efeitos)">✝</button><button class="icon danger" data-memdel="${ti}|${mi}">✕</button>` : m.vivo ? "♥" : "☠"}</td>
    </tr>`).join("") || `<tr><td class="muted">Sem membros.</td></tr>`}
    </tbody></table>
    ${isGM() ? (ti === 0 ? `<div class="row addm">
      <select data-addsheet="${ti}"><option value="">+ Ficha de jogador…</option>${sheets.filter(({ s }) => !usados.has(s.id)).map(({ s }) => `<option value="${s.id}">${esc(s.header?.personagem || "?")}${s.owner?.name ? " — " + esc(s.owner.name) : ""}</option>`).join("")}</select>
      <input placeholder="ou novo NPC" data-npcname="${ti}"><button data-addnpc="${ti}">+</button>
    </div>` : `<div class="row addm">
      <select data-addnpcsel="${ti}"><option value="">+ NPC da lista…</option>${npcsLivres().map((c) => `<option value="${c.id}">${esc(c.nome)}</option>`).join("")}</select>
      <input placeholder="ou novo NPC" data-npcname="${ti}"><button data-addnpc="${ti}">+</button>
    </div>`) : ""}
    ${diarioBox(ti)}
    ${isGM() ? `<details class="agenda" ${ui.agendaOpen === ti ? "open" : ""}><summary class="muted">🗒 Plano secreto do mestre</summary>
      <textarea data-agenda="${ti}" rows="2" placeholder="O que esta equipe pretende fazer?">${esc(readJSON(lsAgenda(), {})[ti] || "")}</textarea>
      <button class="ghost" data-sortear="${ti}">🎲 Sortear estratégia</button></details>` : ""}
    <div class="res">
      ${["agua", "comida", "sucata"].map((r) => `<div><span>${{ agua: "💧 Água", comida: "🍖 Comida", sucata: "🔩 Sucata" }[r]}</span>
        <div class="row">${isGM() ? `<button class="icon" data-res="${ti}|${r}|-1">−</button>` : ""}<b>${t[r]}</b>${isGM() ? `<button class="icon" data-res="${ti}|${r}|1">+</button>` : ""}</div></div>`).join("")}
    </div>
  </section>`;
  }).join("") + relacoesCard() + (isGM() && !visibleSheets().length ? `<p class="muted">Nenhuma ficha encontrada neste navegador. Abra a extensão da ficha nesta sala (como mestre) para receber as fichas dos jogadores.</p>` : "");
}

function tabIntencoes() {
  if (isGM()) return tabIntencoesGM();
  const lib = estigmasLiberados(); const mids = myMemberIds();
  const shown = ESTIGMAS.filter((e) => lib.has(e.nome));
  return shown.map((e) => {
    const cumpri = (state.intencoes[e.nome] || []).some((id) => mids.includes(id));
    return `<section class="card intent on"><h3>${esc(e.nome)}</h3><p class="mand">“${esc(e.mand)}”</p><p><b>Missão:</b> ${esc(e.missao)}</p>
      ${cumpri ? `<p class="good"><b>Sua recompensa:</b> ${esc(e.rec)}</p>` : ""}</section>`;
  }).join("") + Array.from({ length: 6 - shown.length }, () => `<section class="card intent sealed"><h3>Intenção selada</h3><p class="muted">Será revelada quando o sino tocar por este estigma.</p></section>`).join("");
}
function tabIntencoesGM() {
  const lib = estigmasLiberados();
  return ESTIGMAS.map((e) => {
    const on = lib.has(e.nome); const por = (state.intencoes[e.nome] || []).map((id) => findM(id)).filter(Boolean);
    return `<section class="card intent ${on ? "on" : "off"}">
      <h3>${esc(e.nome)} <span class="muted">${esc(e.sent)}</span></h3>
      <p class="mand">“${esc(e.mand)}”</p>
      <p><b>Missão:</b> ${esc(e.missao)}</p>
      <p><b>Recompensa:</b> ${esc(e.rec)}</p>
      ${on ? `${por.length ? `<p class="muted">Cumprida por: ${por.map((x) => esc(mName(x.m))).join(", ")}</p>` : ""}
        ${isGM() ? `<div class="row"><select data-intsel="${e.nome}">${memberOptions((m) => m.vivo)}</select><button class="primary" data-intapply="${e.nome}">Cumpriu</button></div>` : ""}`
        : `<p class="muted">🔒 Liberada quando o sacrifício com este estigma morrer.</p>`}
    </section>`;
  }).join("");
}

function teamSelect(id) { return `<select id="${id}" data-selteam="1">${opt(state.equipes.map((t, i) => [i, t.nome]), selTeam)}</select>`; }
function tabBase() {
  if (!isGM()) {
    const mt = myTeams(); if (!mt.length) return semEquipe();
    if (!mt.includes(selTeam)) selTeam = mt[0];
    const t = state.equipes[selTeam];
    return `<section class="card">${mt.length > 1 ? `<div class="row"><b>Equipe:</b> <select id="teamSel" data-selteam="1">${opt(mt.map((i) => [i, state.equipes[i].nome]), selTeam)}</select></div>` : `<h3>${esc(t.nome)}</h3>`}
      <div class="res">${["agua", "comida", "sucata"].map((r) => `<div><span>${{ agua: "💧 Água", comida: "🍖 Comida", sucata: "🔩 Sucata" }[r]}</span><b>${t[r]}</b></div>`).join("")}</div></section>
    <section class="card"><h3>Consumo do dia</h3><p class="muted">Cada um precisa de 1 água e 1 comida até a conclusão do dia. O mestre registra o consumo; o efeito aparece na sua ficha.</p></section>
    <section class="card"><h3>Melhorias da base</h3><ul class="mel">${melList().map((m) => {
      const tem = t.base.includes(m.k);
      return `<li class="${tem ? "on" : ""}"><div><b>${esc(m.nome)}</b> <span class="muted">${esc(melCusto(m))}</span>
        <div class="muted small">${tem ? esc(m.ef) : "Recompensa: <i>desconhecida até construir</i>"}</div></div>${tem ? `<span class="tag">✓</span>` : melBloqueada(t, m) ? `<span class="muted small">limpe a base antes</span>` : ""}</li>`;
    }).join("")}</ul></section>
    <section class="card"><h3>Ações na base (descansar)</h3>
      <p class="muted">Funciona como interlúdio, mas cada personagem só faz uma ação: dormir, exercitar-se, ler, manutenção ou relaxar.</p></section>
    <section class="card"><h3>Tempo de construção</h3>
      <div class="row"><label class="inline">Pessoas trabalhando <input type="number" min="1" id="tcN" value="${num(ui.tcN) || 1}" style="width:70px"></label><b id="tcOut">${Math.max(3, 8 - Math.max(1, num(ui.tcN) || 1))} dias</b></div></section>`;
  }
  const t = state.equipes[selTeam];
  const vivos = t.membros.filter((m) => m.vivo);
  let a = t.agua, c = t.comida;
  const rows = vivos.map((m) => {
    const s = m.sheetId && getSheet(m.sheetId);
    const da = a > 0 ? 1 : 0; a -= da; const dc = c > 0 ? 1 : 0; c -= dc;
    const flags = [s?.hexa?.semAgua ? `sem água ×${s.hexa.semAgua}` : "", s?.hexa?.semComida ? `sem comida ×${s.hexa.semComida}` : ""].filter(Boolean).join(", ");
    return `<tr><td>${esc(mName(m))}${flags ? `<div class="muted small">${flags} — dê 2 para recuperar</div>` : ""}</td>
      <td><input type="number" min="0" value="${da}" data-cons="${m.id}|a" ${dis()}></td><td><input type="number" min="0" value="${dc}" data-cons="${m.id}|c" ${dis()}></td></tr>`;
  }).join("");
  return `
  <section class="card"><div class="row"><b>Equipe:</b> ${teamSelect("teamSel")}</div>
    <p class="muted">Estoque: 💧 ${t.agua} · 🍖 ${t.comida} · 🔩 ${t.sucata}</p></section>

  <section class="card"><h3>Consumo do dia</h3>
    <p class="muted">Cada um precisa de 1 água e 1 comida até a conclusão do dia. Sem água: −10 PV máximos; sem comida: −10 PE (Determinação) máximos. Para recuperar, consuma 1 unidade além do necessário em outro dia.</p>
    ${vivos.length ? `<table class="cons"><thead><tr><th>Quem</th><th>💧</th><th>🍖</th></tr></thead><tbody>${rows}</tbody></table>
    ${isGM() ? `<button class="primary" id="btnConsumo">Aplicar consumo</button>` : ""}` : `<p class="muted">Sem membros vivos.</p>`}
  </section>

  <section class="card"><h3>Melhorias da base <button class="ghost" id="btnMelEdit">${ui.editMel ? "✓ Concluir edição" : "✎ Editar melhorias"}</button></h3>
    ${ui.editMel ? `<p class="muted small">Personalize nome, custo em sucata, requisito e recompensa. Os jogadores só veem a recompensa depois de construir.</p>
      <div class="meledit">${melList().map((m, i) => `<div class="mrow">
        <input data-meled="${i}|nome" value="${esc(m.nome)}" placeholder="Nome">
        <div class="row"><label class="inline">Sucata <input type="number" min="0" data-meled="${i}|custo" value="${num(m.custo)}" style="width:60px"></label>
          <label class="inline">💧/dia <input type="number" min="0" data-meled="${i}|agua" value="${num(m.agua)}" style="width:55px"></label>
          <label class="inline">🍖/dia <input type="number" min="0" data-meled="${i}|comida" value="${num(m.comida)}" style="width:55px"></label>
          <button class="icon danger" data-meldel="${i}">✕</button></div>
        <input data-meled="${i}|req" value="${esc(m.req || "")}" placeholder="Requisito (opcional), ex.: materiais de enfermaria">
        <input data-meled="${i}|ef" value="${esc(m.ef || "")}" placeholder="Recompensa / efeito">
      </div>`).join("")}<button class="add" id="btnMelAdd">+ Nova melhoria</button></div>` : ""}
    <ul class="mel">${ui.editMel ? "" : melList().map((m) => {
      const tem = t.base.includes(m.k); const bloq = melBloqueada(t, m);
      return `<li class="${tem ? "on" : ""}"><div><b>${esc(m.nome)}</b> <span class="muted">${esc(melCusto(m))}</span><div class="muted small">${esc(m.ef)}</div></div>
        ${tem ? `<span class="tag">✓</span>${isGM() ? `<button class="icon danger" data-melrm="${m.k}">✕</button>` : ""}` : bloq ? `<span class="muted small">limpe a base antes</span>` : isGM() ? `<button data-melsel="${m.k}" class="${ui.mel === m.k ? "primary" : ""}">Construir</button>` : ""}</li>`;
    }).join("")}</ul>
    ${isGM() && ui.mel && melGet(ui.mel) && !ui.editMel ? `<div class="build">
      <b>Construir ${esc(melGet(ui.mel).nome)}</b> <span class="muted">(DT 20 · ${esc(melCusto(melGet(ui.mel)))})</span>
      <div class="grid3">
        <label>Quem <select id="bMem">${memberOptions((m) => m.vivo, ui.bMem)}</select></label>
        <label>Perícia <select id="bPer">${opt(PERICIAS, ui.bPer || "Atletismo")}</select></label>
        <label>Bônus extra <input type="number" id="bBon" value="${num(ui.bBon)}"></label>
      </div>
      <div class="row"><button class="primary" id="btnBuild">🎲 Testar</button><button class="ghost" id="btnBuildAuto">Construir sem teste</button></div>
      <p class="muted small">Passou: constrói e gasta a sucata. Falhou: nada acontece. Falhou por 5 ou mais: perde a sucata.</p>
    </div>` : ""}
  </section>

  <section class="card"><h3>Ações na base (descansar)</h3>
    <p class="muted">Funciona como interlúdio, mas cada personagem só faz uma ação: dormir, exercitar-se, ler, manutenção ou relaxar.</p>
    ${t.base.length ? `<ul class="plain small">${t.base.map((k) => melGet(k)).filter(Boolean).map((m) => `<li><b>${esc(m.nome)}:</b> ${esc(m.ef)}</li>`).join("")}</ul>` : ""}
  </section>

  <section class="card"><h3>Tempo de construção (regra opcional)</h3>
    <div class="row"><label class="inline">Pessoas trabalhando <input type="number" min="1" id="tcN" value="${num(ui.tcN) || 1}" style="width:70px"></label>
    <b id="tcOut">${Math.max(3, 8 - Math.max(1, num(ui.tcN) || 1))} dias</b></div>
    <p class="muted small">1 pessoa leva 7 dias; cada pessoa extra tira 1 dia, até o mínimo de 3.</p>
  </section>

  <section class="card"><h3>Troca de informações</h3>
    <p class="muted">Informação (pista pequena): 1 recurso. Segredo (pista importante): 3 recursos.</p>
    ${isGM() ? `<div class="row"><select id="trTipo"><option value="1">Informação (1)</option><option value="3">Segredo (3)</option></select>
      <select id="trRec"><option value="agua">Água</option><option value="comida">Comida</option><option value="sucata">Sucata</option></select>
      <button id="btnTroca">Pagar</button></div>` : ""}
  </section>`;
}

function tabExplorar() {
  const t = state.equipes[selTeam];
  return `
  <section class="card"><div class="row"><b>Equipe:</b> ${teamSelect("teamSel2")}</div></section>
  <section class="card"><h3>Teste de jornada</h3>
    <p class="muted">Ao ir para uma área ainda não explorada. Um faz o teste, os outros ajudam. Falhar não impede de chegar: só causa uma consequência ruim. Outras perícias além de Sobrevivência só podem ser usadas uma vez em todo o Hexatombe.${state.dia === 6 ? " <b>Dia final: falhar provoca um encontro com uma criatura infernal.</b>" : ""}</p>
    <div class="grid2">
      <label class="wide2">Destino <select id="jArea"><option value="">— área não listada —</option>${state.areas.filter((a) => !a.engolida).map((a) => `<option value="${a.id}" ${ui.jArea === a.id ? "selected" : ""}>${esc(a.nome)}${a.exp.includes(selTeam) ? " (já explorada)" : ""}</option>`).join("")}</select></label>
      ${(() => { const a = state.areas.find((x) => x.id === ui.jArea); return a && a.exp.includes(selTeam) ? `<p class="okt wide2">Caminho conhecido: pelas regras, refazer o mesmo trajeto não exige teste.</p>` : ""; })()}
      <label>Quem testa <select id="jMem">${memberOptions((m) => m.vivo, ui.jMem)}</select></label>
      <label>Perícia <select id="jPer">${PERICIAS.map((p) => `<option ${p === (ui.jPer || "Sobrevivência") ? "selected" : ""} ${p !== "Sobrevivência" && t.jornada.includes(p) ? "disabled" : ""}>${p}</option>`).join("")}</select></label>
      <label>DT <input type="number" id="jDT" value="${num(ui.jDT) || 20}"></label>
      <label>Bônus (ajuda, itens) <input type="number" id="jBon" value="${num(ui.jBon)}"></label>
    </div>
    <button class="primary" id="btnJornada">🎲 Teste de jornada</button>
    ${t.jornada.length ? `<p class="muted small">Já usadas por ${esc(t.nome)}: ${t.jornada.map(esc).join(", ")}</p>` : ""}
    <details><summary class="muted">Consequências ruins (1d6)</summary><ol class="tbl">${CONSEQ.map((c) => `<li><b>${esc(c[0])}:</b> ${esc(c[1])}</li>`).join("")}</ol></details>
  </section>

  <section class="card"><h3>Procurar recursos</h3>
    <p class="muted">Ao chegar num ambiente novo, cada personagem faz um único teste (Investigação ou outra perícia justificada). 15+, 20+ e 25+ sorteiam itens em tabelas cada vez melhores.</p>
    <div class="grid3">
      <label>Local <select id="rArea"><option value="">—</option>${state.areas.filter((a) => !a.engolida).map((a) => `<option value="${a.id}" ${ui.rArea === a.id ? "selected" : ""}>${esc(a.nome)}</option>`).join("")}</select></label>
      <label>Quem <select id="rMem">${memberOptions((m) => m.vivo, ui.rMem)}</select></label>
      <label>Perícia <select id="rPer">${opt(PERICIAS, ui.rPer || "Investigação")}</select></label>
      <label>Bônus <input type="number" id="rBon" value="${num(ui.rBon)}"></label>
    </div>
    <button class="primary" id="btnRecurso">🎲 Procurar</button>
    ${ui.achados?.length ? `<div class="achados"><b>Encontrado:</b> ${ui.achados.map(esc).join(", ")}
      ${isGM() ? `<button id="btnAchados">Guardar água/comida/sucata no estoque de ${esc(t.nome)}</button>` : ""}</div>` : ""}
  </section>

  <section class="card"><h3>Encontros</h3>
    <div class="grid2">${Object.entries(ENCONTROS).map(([k, e]) => `<button data-enc="${k}">🎲 ${esc(e.nome)} (1d${e.dado})</button>`).join("")}</div>
    ${ui.enc ? `<div class="encres"><b>${esc(ui.enc.titulo)}</b><p>${esc(ui.enc.txt)}</p></div>` : ""}
  </section>

  <section class="card"><h3>Aliados em perigo</h3>
    <p class="muted">Quando a habilidade de um aliado é usada numa situação de risco, role 1d6: par, tudo bem; ímpar, o aliado se fere. Ferido duas vezes na mesma cena, morre.</p>
    <div class="row"><input id="alName" placeholder="Nome do aliado" value="${esc(ui.alName || "")}"><button id="btnAliado">🎲 1d6</button><button class="ghost" id="btnAliadoReset">Nova cena</button></div>
    ${Object.keys(ui.aliados || {}).length ? `<ul class="plain">${Object.entries(ui.aliados).map(([n, f]) => `<li>${esc(n)}: ${f >= 2 ? "☠ morreu" : f ? "ferido 1×" : "intacto"}</li>`).join("")}</ul>` : ""}
  </section>`;
}

function tabExtras() {
  const b = state.batalha;
  const ranking = (arr, un = "") => arr.length ? `<ol class="rank">${[...arr].sort((x, y) => y.pts - x.pts).map((r) => `<li>${esc(r.nome)} <b>${r.pts}${un}</b></li>`).join("")}</ol>` : "";
  return `
  <section class="card"><h3>Batalha de intenções</h3>
    <p class="muted">Duelo forçado entre duas pessoas: cada uma causa +1d10 de dano na outra e sofre metade de qualquer dano que não venha da rival.</p>
    ${b ? `<p><b>${esc(mName(findM(b[0])?.m || { nome: "?" }))}</b> ⚔ <b>${esc(mName(findM(b[1])?.m || { nome: "?" }))}</b></p>${isGM() ? `<button id="btnBatEnd">Encerrar batalha</button>` : ""}`
      : isGM() ? `<div class="row"><select id="bA">${memberOptions((m) => m.vivo)}</select><span>⚔</span><select id="bB">${memberOptions((m) => m.vivo)}</select><button class="primary" id="btnBat">Iniciar</button></div>` : `<p class="muted">Nenhuma batalha agora.</p>`}
  </section>

  <section class="card"><h3>Jogos do circo — Acerte os dardos</h3>
    <p class="muted">Três testes de Pontaria. DT 10 = 5 pts · 15 = 10 · 20 = 15 · 25 = 25 · 30 = 50.</p>
    <div class="row"><select id="dMem">${memberOptions((m) => m.vivo)}</select><input type="number" id="dBon" placeholder="bônus" style="width:80px"><button class="primary" id="btnDardos">🎯 Jogar</button>${isGM() ? `<button class="ghost" id="btnDardosReset">Zerar</button>` : ""}</div>
    ${ranking(state.circo.dardos, " pts")}
  </section>

  <section class="card"><h3>Jogos do circo — Máquina de soco</h3>
    <p class="muted">Role o dano desarmado (1d3 + FOR). Pode gastar PV (golpe descuidado) ou PE (golpe intenso), até o limite de PE por rodada, para +2 de dano a cada 2 gastos. Pontos = dano × 100. 18+ de dano quebra a máquina.</p>
    <div class="grid3">
      <label>Quem <select id="sMem">${memberOptions((m) => m.vivo)}</select></label>
      <label>Golpe <select id="sTipo"><option value="pv">Descuidado (PV)</option><option value="pd">Intenso (PE/PD)</option></select></label>
      <label>Gastar <input type="number" id="sGasto" min="0" step="2" value="0"></label>
    </div>
    <div class="row"><button class="primary" id="btnSoco">👊 Socar</button>${isGM() ? `<button class="ghost" id="btnSocoReset">Zerar</button>` : ""}</div>
    ${ranking(state.circo.soco)}
  </section>

  <section class="card"><h3>Boas recordações</h3>
    <p class="muted">Foto no painel do circo: recupera 1d4 PV ou PE. Uma vez por missão, olhar a foto (ação padrão) dá +1d6 num teste até o fim do dia.</p>
    <div class="row"><select id="fMem">${memberOptions((m) => m.vivo)}</select><select id="fTipo"><option value="pv">PV</option><option value="pd">PE/PD</option></select><button id="btnFoto">📷 Recuperar 1d4</button><button class="ghost" id="btnFoto6">+1d6</button></div>
  </section>

  <section class="card"><h3>Novos itens</h3>
    <div class="row"><b>Para:</b> <select id="iMem">${memberOptions((m) => m.vivo && !!m.sheetId)}</select></div>
    <ul class="mel">${ITENS.map((it, i) => `<li><div><b>${esc(it.nome)}</b> <span class="muted">Cat. I · ${String(it.esp).replace(".", ",")} espaço</span><div class="muted small">${esc(it.desc)}</div></div><button data-additem="${i}">+ ficha</button></li>`).join("")}</ul>
  </section>`;
}

function tabBestiario() {
  const edit = ui.bestEdit ? state.bestiario.find((c) => c.id === ui.bestEdit) : null;
  const all = bestList();
  const npcs = state.bestiario.map((c) => npcCard(c, all.indexOf(c))).join("");
  const livro = BESTIARIO.map((c) => { const ci = all.indexOf(c); return `<details class="card beast"><summary><b>${esc(c.nome)}</b> <span class="muted">${esc(c.tipo)} · VD ${c.vd}</span></summary>
    <div class="bstats"><div><span>Defesa</span><b>${c.def}</b></div><div><span>PV</span><b>${c.pv}</b><small>machucado ${c.maq}</small></div><div><span>Desloc.</span><b class="small">${esc(c.desl)}</b></div></div>
    <p class="muted small">${esc(c.attrs)}${c.pp ? `<br>Presença perturbadora: ${esc(c.pp)}` : ""}${c.rd ? `<br>Resistências: ${esc(c.rd)}` : ""}${c.vuln ? ` · Vulnerável: ${esc(c.vuln)}` : ""}</p>
    <div class="rolls"><button data-mon="${ci}|per">Percepção ${esc(c.per)}</button><button data-mon="${ci}|ini">Iniciativa ${esc(c.ini)}</button>${Object.entries(c.res || {}).map(([k, v]) => `<button data-mon="${ci}|res|${k}">${k} ${esc(v)}</button>`).join("")}</div>
    <div class="atks">${c.atq.map((a, ai) => `<button class="primary" data-monatk="${ci}|${ai}">🎲 ${esc(a[0])} <small>${esc(a[1])} · ${esc(a[2])} ${esc(a[3])}</small></button>`).join("")}${(c.extra || []).map((e, ei) => `<button data-monex="${ci}|${ei}">🎲 ${esc(e[0])} <small>${esc(e[1])}</small></button>`).join("")}</div>
    <ul class="plain small">${(c.hab || []).map((h) => `<li>${esc(h)}</li>`).join("")}</ul></details>`; }).join("");
  return `<details class="card" ${ui.bestEdit ? "open" : ""} id="bestNewBox"><summary><b>${edit ? `Editando: ${esc(edit.nome)}` : "＋ Novo NPC"}</b></summary>${bestForm(edit)}</details>
  <div class="section-title">NPCs (${state.bestiario.length})</div>
  <p class="muted">Ligue cada NPC a uma equipe pelo seletor “Equipe” (ou pela aba Equipes). Testes, desertores, sino, consumo e recompensas usam os dados daqui.</p>
  ${npcs || `<section class="card"><p class="muted">Nenhum NPC ainda.</p></section>`}
  <details class="card"><summary><b>Ameaças do Hexatombe (livro)</b> <span class="muted">${BESTIARIO.length}</span></summary>
    <p class="muted">Também aparecem o Quibungo (SaH, p. 142) e zumbis de Sangue (OPRPG, p. 202–203).</p>${livro}</details>`;
}

const TABS = [["ritual", "Ritual"], ["arena", "Arena"], ["equipes", "Equipes"], ["intencoes", "Intenções"], ["base", "Recursos e base"], ["explorar", "Exploração"], ["extras", "Extras"], ["bestiario", "NPCs"], ["epilogo", "Epílogo"]];
let renderPending = false;
function render() {
  renderPending = false;
  selTeam = clamp(selTeam, 0, state.equipes.length - 1);
  const y = window.scrollY;
  const tabsOk = isGM() ? TABS : TABS.filter(([k]) => ["ritual", "arena", "equipes", "intencoes", "base"].includes(k));
  if (!tabsOk.some(([k]) => k === tab)) tab = "ritual";
  const body = { ritual: tabRitual, arena: tabArena, equipes: tabEquipes, intencoes: tabIntencoes, base: tabBase, explorar: tabExplorar, extras: tabExtras, bestiario: tabBestiario, epilogo: tabEpilogo }[tab]();
  app.innerHTML = `<header class="top"><span class="logo" data-text="HEXATOMBE">HEXATOMBE</span><span class="role ${isGM() ? "gm" : ""}">${isGM() ? "Mestre" : "Jogador"}</span>
    <span class="daypill">Dia ${state.dia} · ${FASES[state.fase]}</span>
    ${isGM() ? `<button class="icon" id="btnUndoH" ${hist.length ? `title="Desfazer: ${esc(hist[hist.length - 1].label)}"` : 'disabled title="Nada para desfazer"'}>↶</button>` : ""}
    <button class="icon" id="btnSom" title="Som do sino e dos dados">${somOn ? "🔔" : "🔕"}</button></header>
    <nav class="tabs">${tabsOk.map(([k, l]) => `<button data-tab="${k}" class="${k === tab ? "on" : ""}">${l}</button>`).join("")}</nav>
    <main>${body}</main>`;
  window.scrollTo(0, y);
}
function softRender() {
  const a = document.activeElement;
  if (a && app.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) { renderPending = true; return; }
  render();
}
app.addEventListener("focusout", () => { if (renderPending) setTimeout(() => renderPending && softRender(), 60); });

/* ---------- Eventos ---------- */
const val = (id) => document.getElementById(id)?.value ?? "";
function onChange(e) {
  const el = e.target; const d = el.dataset;
  if (d.selteam) { selTeam = Number(el.value); ui.achados = null; render(); return; }
  if (!isGM()) return;
  if (d.team) { const [ti, k] = d.team.split("|"); state.equipes[ti][k] = el.value; save(k === "nome"); return; } // nome: sem redesenhar, para não engolir o próximo clique
  if (d.mem) {
    const [ti, mi, k] = d.mem.split("|"); const m = state.equipes[ti].membros[mi];
    m[k] = el.value || null; addEvent(`${mName(m)} ${m.sac ? `é o sacrifício (${m.sac})` : "deixou de ser sacrifício"}.`); save(); return;
  }
  if (d.addsheet) {
    if (!el.value) return; const s = getSheet(el.value);
    state.equipes[d.addsheet].membros.push({ id: uid(), nome: s?.header?.personagem || "?", sheetId: el.value, ownerId: s?.owner?.id || null, vivo: true, sac: null, des: !!s?.hexa?.desertor });
    applySheet(el.value, (sh) => { sh.hexa.equipe = state.equipes[d.addsheet].nome; });
    save(); return;
  }
  if (d.rel) { state.rel[d.rel] = el.value; save(); return; }
  if (d.addnpcsel) {
    if (!el.value) return; const c = npcGet(el.value);
    state.equipes[d.addnpcsel].membros.push({ id: uid(), nome: c.nome, npcId: c.id, sheetId: null, vivo: true, sac: null, des: !!c.des }); save(); return;
  }
  if (d.npcteam) {
    const to = Number(el.value); const x = npcMember(d.npcteam); const c = npcGet(d.npcteam);
    let m = null; if (x) { x.t.membros = x.t.membros.filter((y) => y !== x.m); m = x.m; }
    if (to >= 0) state.equipes[to].membros.push(m || { id: uid(), nome: c.nome, npcId: c.id, sheetId: null, vivo: true, sac: null, des: !!c.des });
    ui.npcOpen = d.npcteam; save(); return;
  }
  if (d.npc) { const [id, f] = d.npc.split("|"); const c = npcGet(id); if (!c) return; c[f] = f === "notas" ? el.value : (el.value === "" ? "" : num(el.value)); ui.npcOpen = id; save(true); return; }
  if (el.id === "epiDes") { ui.epiDesejos = el.checked; render(); return; }
  if (el.id === "viewTeam") { ui.viewTeam = Number(el.value); render(); return; }
  if (d.know) {
    const [k, id, ti] = d.know.split("|"); const c = conhecido(ui.viewTeam);
    if (k === "t") { const n = Number(id); c.t = el.checked ? [...new Set([...c.t, n])] : c.t.filter((x) => x !== n); if (!el.checked) { const ids = state.equipes[n].membros.map((m) => m.id); c.m = c.m.filter((x) => !ids.includes(x)); } }
    else { c.m = el.checked ? [...new Set([...c.m, id])] : c.m.filter((x) => x !== id); if (el.checked) c.t = [...new Set([...c.t, Number(ti)])]; }
    save(); return;
  }
  if (d.meled) { const [i, f] = d.meled.split("|"); const m = state.melhorias[i]; m[f] = ["custo", "agua", "comida"].includes(f) ? Math.max(0, num(el.value)) : el.value; save(true); return; }
  if (d.areafecha !== undefined) { state.areas[d.areafecha].fecha = Number(el.value); save(); return; }
  if (d.areanota !== undefined) { state.areas[d.areanota].notas = el.value; save(true); return; }
}
app.addEventListener("change", wrapGM(onChange));
app.addEventListener("input", (e) => {
  const el = e.target;
  if (["dVit", "dKil", "bMem", "bPer", "bBon", "jMem", "jPer", "jDT", "jBon", "rMem", "rPer", "rBon", "alName", "rArea"].includes(el.id)) ui[el.id] = el.value;
  if (el.id === "jArea") { ui.jArea = el.value; render(); return; }
  if (el.dataset.agenda !== undefined) { const ag = readJSON(lsAgenda(), {}); ag[el.dataset.agenda] = el.value; lsSet(lsAgenda(), JSON.stringify(ag)); return; }
  if (el.dataset.nota) { setNota(el.dataset.nota, el.value); return; }
  if (el.dataset.diario !== undefined) { editarDiario(el.dataset.diario, el.value); return; }
  if (el.id === "meuDesejo") { lsSet(NS + ":meudesejo:" + roomId, el.value); return; }
  if (el.id === "tcN") { ui.tcN = el.value; const o = document.getElementById("tcOut"); if (o) o.textContent = `${Math.max(3, 8 - Math.max(1, num(el.value) || 1))} dias`; }
});

function onClick(e) {
  const b = e.target.closest("button"); if (!b) return;
  const d = b.dataset;
  if (b.id === "btnSom") { somOn = !somOn; lsSet(NS + ":som", somOn ? "1" : "0"); if (somOn) rollSound(); render(); return; }
  if (b.id === "btnDesejo") {
    const texto = val("meuDesejo").trim(); if (!texto) return toast("Escreva seu desejo primeiro.");
    const dsj = { id: uid(), nome: me.name || "Jogador", texto, at: Date.now() };
    if (obrOk) OBR.broadcast.sendMessage(CHANNEL, { kind: "desejo", desejo: dsj }).catch(() => {});
    toast("Desejo enviado ao mestre."); return;
  }
  if (d.goarea !== undefined) return irAte(state.areas[d.goarea]);
  if (d.tab) { tab = d.tab; render(); window.scrollTo(0, 0); return; }

  // --- rolagens que qualquer um pode fazer ---
  if (d.enc) {
    const enc = ENCONTROS[d.enc]; const r = die(enc.dado); const o = enc.op.find((x) => r <= x[0]);
    let extra = "";
    if (o[1] === "Negociação" || o[1] === "Uma ajuda extra" || o[1] === "Pedágio") {
      const outros = state.equipes.map((t, i) => i).filter((i) => i !== selTeam && state.equipes[i].membros.length);
      if (outros.length) { const j = outros[Math.floor(Math.random() * outros.length)]; extra = ` Equipe envolvida: ${state.equipes[j].nome} (atitude: ${relDe(selTeam, j).toLowerCase()}).`; }
    }
    ui.enc = { titulo: `${enc.nome}: ${r} — ${o[1]}`, txt: o[2] + extra };
    announce(`Encontro ${enc.nome.toLowerCase()} (1d${enc.dado} = ${r}): ${o[1]}`, !isGM()); return;
  }
  if (d.mon) {
    const [ci, k, rk] = d.mon.split("|"); const c = bestList()[ci];
    const expr = k === "res" ? c.res[rk] : c[k]; const r = rollMonster(expr);
    announce(`${c.nome} — ${k === "per" ? "Percepção" : k === "ini" ? "Iniciativa" : rk}: ${r.txt}`, true); return;
  }
  if (d.npcper) {
    const [id, pi] = d.npcper.split("|"); const c = npcGet(id); const p = c?.pericias?.[pi]; if (!p) return;
    const r = npcTest(c, p[0]); announce(`${c.nome} — ${p[0]}: ${r.txt}`, true); return;
  }
  if (d.monatk) {
    const [ci, ai] = d.monatk.split("|").map(Number); const c = bestList()[ci]; const a = c.atq[ai];
    const t = rollMonster(a[1]); const dm = rollExpr(a[2]);
    announce(`${c.nome} — ${a[0]}: ${t.txt}\nDano: ${dm.total} ${a[3]}  —  ${dm.txt}`, true); return;
  }
  if (d.monex) {
    const [ci, ei] = d.monex.split("|").map(Number); const c = bestList()[ci]; const x = c.extra[ei]; const r = rollExpr(x[1]);
    announce(`${c.nome} — ${x[0]}: ${r.total}  —  ${r.txt}`, true); return;
  }
  if (b.id === "btnAliado") {
    const n = val("alName").trim() || "Aliado"; ui.alName = n; ui.aliados ||= {};
    const r = die(6); const ferido = r % 2 === 1; if (ferido) ui.aliados[n] = (ui.aliados[n] || 0) + 1; else ui.aliados[n] ||= 0;
    announce(`Aliado em perigo — ${n}: 1d6 = ${r} → ${ferido ? (ui.aliados[n] >= 2 ? "ferido de novo: MORREU" : "se feriu") : "intacto"}`); return;
  }
  if (b.id === "btnAliadoReset") { ui.aliados = {}; render(); return; }
  if (b.id === "btnJornada") return jornada();
  if (b.id === "btnRecurso") return procurar();
  if (b.id === "btnDardos") return dardos();
  if (b.id === "btnSoco") return soco();
  if (b.id === "btnFoto") return foto();
  if (b.id === "btnFoto6") { const x = findM(val("fMem")); const r = rollExpr("1d6"); announce(`${x ? mName(x.m) : "?"} olha a foto e recorda: +${r.total} num teste até o fim do dia.`); return; }
  if (d.additem) {
    const x = findM(val("iMem")); if (!x?.m.sheetId) return toast("Escolha um personagem com ficha.");
    if (!canEditSheet(x.m.sheetId)) return toast("Só o dono da ficha ou o mestre pode adicionar itens.");
    const it = ITENS[d.additem];
    applySheet(x.m.sheetId, (s) => { (s.gerais ||= []).push({ id: uid(), nome: it.nome, tipo: "Itens Operacionais", categoria: 1, espacos: it.esp, melhorias: [], img: "", desc: it.desc }); });
    toast(`${it.nome} adicionado à ficha de ${mName(x.m)}.`); return;
  }

  // --- ações do mestre ---
  if (!isGM()) return;
  if (b.id === "btnFase") return avancarFase();
  if (b.id === "btnEncerrar") return encerrarDiaDialog();
  if (b.id === "btnUnfail") { state.fracassou = false; save(); return; }
  if (b.id === "btnHeir") { const x = findM(val("heirSel")); if (!x) return; x.m.sac = state.herdeiro; const txt = `A Coroa escolhe ${mName(x.m)} como novo sacrifício (${state.herdeiro}).`; state.herdeiro = null; addEvent(txt); announce(txt); save(); return; }
  if (b.id === "btnFinal") return sacrificioFinal();
  if (b.id === "btnMorte") {
    const v = val("dVit"); if (!v) return toast("Escolha quem morreu.");
    const k = val("dKil") || null; if (k === v) return toast("A vítima não pode ser o algoz.");
    ui.dVit = ui.dKil = ""; registrarMorte(v, k, document.getElementById("dDia").checked); return;
  }
  if (b.id === "btnReset") {
    if (!b.classList.contains("confirm")) { b.classList.add("confirm"); b.textContent = "Tem certeza? Clique de novo para zerar"; return; }
    state = defaultState(); save(); toast("Novo Hexatombe iniciado."); return;
  }
  if (d.memtog) {
    const [ti, mi, k] = d.memtog.split("|"); const m = state.equipes[ti].membros[mi];
    m[k] = !m[k];
    if (k === "des" && m.sheetId) applySheet(m.sheetId, (s) => { s.hexa.desertor = m.des; });
    save(); return;
  }
  if (d.memdel) {
    if (!b.classList.contains("confirm")) { b.classList.add("confirm"); b.textContent = "?"; setTimeout(() => b.isConnected && (b.classList.remove("confirm"), b.textContent = "✕"), 2500); return; }
    const [ti, mi] = d.memdel.split("|"); state.equipes[ti].membros.splice(mi, 1); save(); return;
  }
  if (d.addnpc) {
    const inp = app.querySelector(`[data-npcname="${d.addnpc}"]`); const n = inp.value.trim(); if (!n) return;
    const c = novoNpc(n); state.equipes[d.addnpc].membros.push({ id: uid(), nome: n, npcId: c.id, sheetId: null, vivo: true, sac: null, des: false });
    save(); toast(`${n} criado. Detalhe os atributos dele na aba NPCs.`); return;
  }
  if (d.res) { const [ti, r, dv] = d.res.split("|"); const t = state.equipes[ti]; t[r] = Math.max(0, num(t[r]) + Number(dv)); save(); return; }
  if (d.intapply) return aplicarRecompensa(app.querySelector(`[data-intsel="${d.intapply}"]`).value, d.intapply);
  if (b.id === "btnConsumo") {
    const map = {}; app.querySelectorAll("[data-cons]").forEach((i) => { const [id, k] = i.dataset.cons.split("|"); (map[id] ||= { id, a: 0, c: 0 })[k] = Math.max(0, num(i.value)); });
    return consumir(selTeam, Object.values(map));
  }
  if (d.melsel) { ui.mel = ui.mel === d.melsel ? null : d.melsel; render(); return; }
  if (d.melrm) { const t = state.equipes[selTeam]; t.base = t.base.filter((k) => k !== d.melrm); save(); return; }
  if (b.id === "btnBuild" || b.id === "btnBuildAuto") return construir(b.id === "btnBuildAuto");
  if (b.id === "btnTroca") {
    const t = state.equipes[selTeam]; const n = Number(val("trTipo")); const r = val("trRec");
    if (t[r] < n) return toast("Recursos insuficientes."); t[r] -= n;
    addEvent(`${t.nome} pagou ${n} ${r} por ${n === 1 ? "uma informação" : "um segredo"}.`); save(); return;
  }
  if (b.id === "btnAchados") {
    const t = state.equipes[selTeam]; const cont = { "Água": "agua", Comida: "comida", Sucata: "sucata" }; const add = [];
    for (const a of ui.achados || []) if (cont[a]) { t[cont[a]]++; add.push(a); }
    ui.achados = (ui.achados || []).filter((a) => !cont[a]);
    if (add.length) addEvent(`${t.nome} guardou: ${add.join(", ")}.`); else toast("Nada de água, comida ou sucata para guardar.");
    save(); return;
  }
  if (b.id === "btnBat") {
    const a = val("bA"), c = val("bB"); if (!a || !c || a === c) return toast("Escolha duas pessoas diferentes.");
    state.batalha = [a, c]; const A = findM(a), B = findM(c);
    applySheet(A.m.sheetId, (s) => { s.hexa.batalha = mName(B.m); }); applySheet(B.m.sheetId, (s) => { s.hexa.batalha = mName(A.m); });
    const txt = `⚔ Batalha de intenções: ${mName(A.m)} contra ${mName(B.m)}.`; addEvent(txt); announce(txt); save(); return;
  }
  if (b.id === "btnBatEnd") {
    for (const id of state.batalha || []) { const x = findM(id); if (x) applySheet(x.m.sheetId, (s) => { delete s.hexa.batalha; }); }
    state.batalha = null; addEvent("A batalha de intenções terminou."); save(); return;
  }
  if (b.id === "btnDardosReset") { state.circo.dardos = []; save(); return; }
  if (b.id === "btnSocoReset") { state.circo.soco = []; save(); return; }
  if (b.id === "btnUndoH") return undoAction();
  if (d.npcclr) { const c = npcGet(d.npcclr); c.cond = []; ui.npcOpen = c.id; save(); return; }
  if (b.id === "btnEpiPub") {
    const incl = ui.epiDesejos !== false;
    state.epilogo = { at: Date.now(), desejos: incl ? readJSON(lsDesejos(), []).map((x) => ({ nome: x.nome, texto: x.texto })) : [] };
    save(); announce("📜 O epílogo do Hexatombe foi revelado na aba Ritual."); return;
  }
  if (b.id === "btnEpiOff") { state.epilogo = null; save(); return; }
  if (b.id === "btnEpiDown") { downloadFile(`hexatombe-epilogo.html`, epilogoArquivo(ui.epiDesejos !== false ? readJSON(lsDesejos(), []) : []), "text/html"); return; }
  if (b.id === "btnMelEdit") { ui.editMel = !ui.editMel; ui.mel = null; render(); return; }
  if (b.id === "btnMelAdd") { state.melhorias.push({ k: uid(), nome: "Nova melhoria", custo: 1, req: "", ef: "", agua: 0, comida: 0 }); save(); return; }
  if (d.meldel !== undefined) {
    if (!b.classList.contains("confirm")) { b.classList.add("confirm"); b.textContent = "?"; setTimeout(() => b.isConnected && (b.classList.remove("confirm"), b.textContent = "✕"), 2500); return; }
    const k = state.melhorias[d.meldel].k; state.melhorias.splice(Number(d.meldel), 1); for (const t of state.equipes) t.base = t.base.filter((x) => x !== k); save(); return;
  }
  if (b.id === "btnBestSave") {
    const c = bestFromForm(); if (!c) return;
    const i = state.bestiario.findIndex((x) => x.id === c.id);
    if (i >= 0) {
      const old = state.bestiario[i];
      const cheio = (at, mx) => at === "" || at === undefined || num(at) >= num(mx); // estava cheio: acompanha o novo máximo
      state.bestiario[i] = { ...old, ...c, pvAtual: cheio(old.pvAtual, old.pv) ? c.pv : Math.min(num(old.pvAtual), num(c.pv)), peAtual: cheio(old.peAtual, old.pe) ? c.pe : Math.min(num(old.peAtual), num(c.pe)) };
    }
    else state.bestiario.push({ ...c, pvAtual: c.pv, peAtual: c.pe });
    ui.bestEdit = null; save(); toast(`${c.nome} salva no bestiário.`); return;
  }
  if (b.id === "btnBestCancel") { ui.bestEdit = null; render(); return; }
  if (d.bestedit) { ui.bestEdit = d.bestedit; render(); window.scrollTo(0, 0); return; }
  if (d.bestdel) {
    if (!b.classList.contains("confirm")) { b.classList.add("confirm"); b.textContent = "Apagar mesmo?"; return; }
    for (const t of state.equipes) t.membros = t.membros.filter((m) => m.npcId !== d.bestdel || !m.vivo);
    state.bestiario = state.bestiario.filter((c) => c.id !== d.bestdel); save(); return;
  }
  if (d.newarea) { const n = val("arNome").trim(); if (!n) return toast("Dê um nome para a área."); criarArea(n, d.newarea); return; }
  if (d.areaexp) { const [i, ti] = d.areaexp.split("|").map(Number); const a = state.areas[i]; a.exp = a.exp.includes(ti) ? a.exp.filter((x) => x !== ti) : [...a.exp, ti]; save(); return; }
  if (d.delarea !== undefined) {
    if (!b.classList.contains("confirm")) { b.classList.add("confirm"); b.textContent = "?"; setTimeout(() => b.isConnected && (b.classList.remove("confirm"), b.textContent = "✕"), 2500); return; }
    state.areas.splice(Number(d.delarea), 1); save(); return;
  }
  if (d.areazera !== undefined) { state.areas[d.areazera].buscas = []; save(); return; }
  if (d.sortear !== undefined) {
    const ag = readJSON(lsAgenda(), {}); const txt = sortearEstrategia(Number(d.sortear));
    ag[d.sortear] = (ag[d.sortear] ? ag[d.sortear] + "\n" : "") + txt; lsSet(lsAgenda(), JSON.stringify(ag)); ui.agendaOpen = Number(d.sortear); render(); return;
  }
  if (b.id === "btnDesejosClr") { lsSet(lsDesejos(), "[]"); render(); return; }
  if (b.id === "btnSaveFile") { downloadFile(`hexatombe-dia${state.dia}.json`, JSON.stringify({ tipo: "hexatombe", at: Date.now(), state }), "application/json"); return; }
  if (b.id === "btnLoadFile") {
    const f = document.getElementById("hxFile");
    f.onchange = async () => {
      const file = f.files[0]; f.value = ""; if (!file) return;
      try { const o = JSON.parse(await file.text()); if (o.tipo !== "hexatombe") throw 0; beginAction("Carregar arquivo"); state = normalize(o.state); save(); endAction(); toast("Estado do ritual carregado."); }
      catch { toast("Esse arquivo não é um estado do Hexatombe."); }
    };
    f.click(); return;
  }
}
app.addEventListener("click", wrapGM(onClick));

function construir(semTeste) {
  const t = state.equipes[selTeam]; const m = melGet(ui.mel); if (!m) return;
  if (t.sucata < m.custo) return toast(`Precisa de ${m.custo} sucata (a equipe tem ${t.sucata}).`);
  if (semTeste) { t.sucata -= m.custo; t.base.push(m.k); ui.mel = null; addEvent(`${t.nome} construiu ${m.nome}.`); return save(); }
  const mid = val("bMem"); if (!mid) return toast("Escolha quem vai construir.");
  const r = memberTest(mid, val("bPer"), num(val("bBon")));
  let res;
  if (r.total >= 20) { t.sucata -= m.custo; t.base.push(m.k); res = `sucesso! ${m.nome} construída`; ui.mel = null; }
  else if (r.total <= 15) { t.sucata -= m.custo; res = `falhou por 5 ou mais: a sucata (${m.custo}) se perdeu`; }
  else res = "falhou: nada foi gasto";
  const txt = `${r.nome} tenta construir ${m.nome} (${val("bPer")}, DT 20): ${r.txt} — ${res}.`;
  addEvent(txt); announce(txt); save();
}
function jornada() {
  const mid = val("jMem"); if (!mid) return toast("Escolha quem faz o teste.");
  const per = val("jPer"); const dt = num(val("jDT")) || 20; const t = state.equipes[selTeam];
  if (per !== "Sobrevivência" && t.jornada.includes(per)) return toast(`${per} já foi usada por ${t.nome}.`);
  const r = memberTest(mid, per, num(val("jBon")));
  let txt = `Jornada de ${t.nome} — ${r.nome} (${per}, DT ${dt}): ${r.txt}`;
  if (r.total >= dt) txt += " — caminho tranquilo.";
  else if (state.dia === 6) txt += " — FALHOU: no dia final, isso traz um encontro com uma criatura infernal!";
  else {
    const c = die(6); const q = CONSEQ[c - 1]; txt += `\nFalhou. Consequência (1d6 = ${c}): ${q[0]} — ${q[1]}`;
    if (q[2] && q[2] !== "encontro") { const dm = rollExpr(q[2]); txt += `\nDano: ${dm.total} (${dm.txt})`; }
    if (q[2] === "encontro") { const k = state.fase === 2 ? "noturnoExpl" : "diurnoExpl"; const enc = ENCONTROS[k]; const rr = die(enc.dado); const o = enc.op.find((x) => rr <= x[0]); txt += `\nEncontro ${enc.nome.toLowerCase()} (${rr}): ${o[1]} — ${o[2]}`; }
  }
  const area = state.areas.find((a) => a.id === val("jArea"));
  if (area) txt = txt.replace(`Jornada de ${t.nome}`, `Jornada de ${t.nome} até ${area.nome}`);
  if (isGM()) {
    if (per !== "Sobrevivência") { t.jornada.push(per); ui.jPer = "Sobrevivência"; }
    if (area && !area.exp.includes(selTeam)) area.exp.push(selTeam);
    save();
  }
  announce(txt);
}
function procurar() {
  const mid = val("rMem"); if (!mid) return toast("Escolha quem procura.");
  const area = state.areas.find((a) => a.id === val("rArea"));
  if (area && area.buscas.includes(mid)) return toast(`${mName(findM(mid).m)} já vasculhou ${area.nome}: cada personagem faz um único teste por local.`);
  if (area && isGM()) { area.buscas.push(mid); save(true); }
  const r = memberTest(mid, val("rPer"), num(val("rBon")));
  const achados = [];
  for (const tier of [15, 20, 25]) if (r.total >= tier) { const k = die(12); achados.push(RECURSOS_TAB[tier][k - 1]); }
  ui.achados = achados;
  announce(`${r.nome} procura recursos (${val("rPer")}): ${r.txt} — ${achados.length ? "encontrou: " + achados.join(", ") : "não encontrou nada"}.`);
}
function dardos() {
  const x = findM(val("dMem")); if (!x) return toast("Escolha quem joga.");
  const pts = (v) => (v >= 30 ? 50 : v >= 25 ? 25 : v >= 20 ? 15 : v >= 15 ? 10 : v >= 10 ? 5 : 0);
  const tiros = [0, 1, 2].map(() => memberTest(x.m.id, "Pontaria", num(val("dBon"))));
  const total = tiros.reduce((s, t) => s + pts(t.total), 0);
  if (isGM()) { state.circo.dardos = state.circo.dardos.filter((r) => r.nome !== mName(x.m)); state.circo.dardos.push({ nome: mName(x.m), pts: total }); save(); }
  announce(`🎯 ${mName(x.m)} nos dardos: ${tiros.map((t) => `${t.total} (${pts(t.total)})`).join(" · ")} = ${total} pontos`);
}
function soco() {
  const x = findM(val("sMem")); if (!x) return toast("Escolha quem soca.");
  const tipo = val("sTipo"); let gasto = Math.max(0, Math.floor(num(val("sGasto")) / 2) * 2);
  const s = x.m.sheetId && getSheet(x.m.sheetId);
  const forca = s ? clamp(num(s.attrs?.FOR), 0, 5) : 0;
  if (s) {
    const lim = Math.round(num(s.nex) / 5) + num(s.pdBonus);
    if (gasto > lim) { gasto = Math.floor(lim / 2) * 2; toast(`Gasto limitado ao limite de PE por rodada (${lim}).`); }
    if (gasto && canEditSheet(s.id)) applySheet(s.id, (s) => { if (tipo === "pv") s.pv.atual = num(s.pv.atual) - gasto; else s.pd.atual = num(s.pd.atual) - gasto; });
  }
  const r = rollExpr("1d3"); const dano = Math.max(1, r.total + forca + gasto);
  const pts = dano * 100;
  if (isGM()) { state.circo.soco = state.circo.soco.filter((q) => q.nome !== mName(x.m)); state.circo.soco.push({ nome: mName(x.m), pts }); save(); }
  announce(`👊 ${mName(x.m)} soca a máquina: 1d3[${r.total}] ${fmt(forca)} (FOR)${gasto ? ` +${gasto} (${tipo === "pv" ? "PV" : "PE"} gastos)` : ""} = ${dano} de dano → ${pts} pontos${dano >= 18 ? " — A MÁQUINA QUEBROU!" : ""}`);
}
function foto() {
  const x = findM(val("fMem")); if (!x) return; const tipo = val("fTipo"); const r = rollExpr("1d4");
  if (x.m.sheetId && canEditSheet(x.m.sheetId)) applySheet(x.m.sheetId, (s) => { const b = tipo === "pv" ? s.pv : s.pd; b.atual = Math.min(num(b.max), num(b.atual) + r.total); });
  announce(`📷 ${mName(x.m)} guarda uma boa recordação: recupera ${r.total} ${tipo === "pv" ? "PV" : "PE"}.`);
}

let toastTimer;
function toast(text) {
  document.querySelector(".toast")?.remove();
  const t = document.createElement("div"); t.className = "toast"; t.textContent = text; document.body.appendChild(t);
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.remove(), 4500);
}

function loadLocal() { try { rollLog = JSON.parse(lsGet(NS + ":log:" + roomId) || "[]"); } catch { rollLog = []; } }
function normalize(s) {
  const d = defaultState();
  if (!s || typeof s !== "object") return d;
  const out = { ...d, ...s, circo: { ...d.circo, ...(s.circo || {}) } };
  out.melhorias = Array.isArray(s.melhorias) && s.melhorias.length ? s.melhorias : d.melhorias;
  out.bestiario = s.bestiario || []; out.conhece = s.conhece || {}; out.mortes = s.mortes || []; out.diarios = s.diarios || {};
  out.areas = (s.areas || []).map((a) => ({ exp: [], buscas: [], fecha: 0, notas: "", ...a })); out.rel = s.rel || {};
  out.equipes = (s.equipes || d.equipes).map((t, i) => ({ ...d.equipes[i % 6], ...t, membros: t.membros || [], base: t.base || [], jornada: t.jornada || [] }));
  return out;
}
window.addEventListener("storage", (e) => {
  if (e.key === fichaKey()) softRender();
  if (!isGM() && e.key === lsState()) { try { const x = JSON.parse(e.newValue || "null"); if (x && num(x.rev) > num(state.rev)) { state = normalize(x); softRender(); } } catch { /* */ } }
});

async function start() {
  if (OBR.isAvailable) {
    OBR.onReady(async () => {
      obrOk = true; roomId = OBR.room.id;
      [role, me.id, me.name] = await Promise.all([OBR.player.getRole(), OBR.player.getId(), OBR.player.getName()]);
      loadLocal();
      let local = null; try { local = JSON.parse(lsGet(lsState()) || "null"); } catch { /* */ }
      let sala = null; try { sala = (await OBR.room.getMetadata())[STATE_KEY]; } catch { /* */ }
      const best = [local, sala].filter((x) => x && x.equipes).sort((a, b) => num(b.rev) - num(a.rev))[0];
      state = normalize(best);
      render();
      OBR.broadcast.onMessage(SYNC, (ev) => onSyncChunk(ev.data));
      OBR.room.onMetadataChange((md) => { const x = md[STATE_KEY]; if (!isGM() && x?.equipes && num(x.rev) > num(state.rev)) { state = normalize(x); softRender(); } });
      OBR.broadcast.onMessage(CHANNEL, (ev) => {
        if (ev.data?.kind === "desejo") { if (isGM()) { guardarDesejo(ev.data.desejo); softRender(); } return; }
        const text = ev.data?.text; if (!text) return;
        OBR.notification.show(text.split("\n")[0]);
        rollLog.unshift({ at: Date.now(), text }); rollLog = rollLog.slice(0, 40); lsSet(NS + ":log:" + roomId, JSON.stringify(rollLog)); softRender();
      });
      OBR.player.onChange((p) => { if (p.role !== role) { role = p.role; render(); } });
      sceneOk = await OBR.scene.isReady(); OBR.scene.onReadyChange((r) => { sceneOk = r; });
      if (isGM()) { fillOwners(); broadcastState(); } else sendChunks({ kind: "hello" });
    });
  } else {
    if (new URLSearchParams(location.search).has("gm")) role = "GM";
    me = { id: "local", name: "Teste" }; loadLocal();
    try { state = normalize(JSON.parse(lsGet(lsState()) || "null")); } catch { /* */ }
    render();
  }
}
start();

// Mantém aberto o cartão do NPC que o mestre está usando
app.addEventListener("toggle", (e) => {
  const d = e.target; if (!d.dataset?.npcbox) return;
  if (d.open) ui.npcOpen = d.dataset.npcbox; else if (ui.npcOpen === d.dataset.npcbox) ui.npcOpen = null;
}, true);
