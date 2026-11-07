import OBR, { buildLabel, buildShape } from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
import * as IMG from "./imagens.js?v=2.11.1";
import { npcsParaArquivo, modeloNpc, lerArquivoNpcs, nomeArquivo } from "./npc-arquivo.js?v=2.11.1";
import { IMPORT_KEY, lerPedido, apagarPedido, aplicarPedido } from "./importar.js?v=2.11.1";
import * as PM from "./prato-mestre.js?v=2.11.1";
import { NIVEIS, NIVEL_CURTO, CAMPOS, PESQ_MAX, migrarRevela, revelaDe as revelaSt, sabe, imgLiberada, aplicarPesquisa } from "./bestiario.js?v=2.11.1";

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
const dieRaw = (f) => 1 + Math.floor(Math.random() * f);
// Todo dado passa pelo prato do mestre (só aparece para o mestre, no navegador dele)
const die = (f) => PM.d(f, dieRaw(f));
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
  const k = n > 0 ? n : 2 - n; const dice = Array.from({ length: k }, () => dieRaw(20));
  const pick = n > 0 ? Math.max(...dice) : Math.min(...dice);
  PM.grupo(20, dice, pick, n <= 0);
  return { dice, pick, worst: n <= 0 };
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
    sacrificios: [], intencoes: {}, batalha: null, circo: { dardos: [], soco: [], hist: [] }, log: [], areas: [], rel: {}, conhece: {}, melhorias: MELHORIAS.map((m) => ({ ...m })), bestiario: [], rev: 0, mortes: [], diarios: {}, epilogo: null, revela: {}, pistas: [], oculto: {},
  };
}
let state = defaultState();
let obrOk = false, sceneOk = false, role = "PLAYER", me = { id: "local", name: "" }, roomId = "local";
let tab = "ritual";
let rollLog = [];
let selTeam = 0;
const ui = {}; // valores de formulários entre renders
const isGM = () => role === "GM";
PM.iniciar({ ativo: isGM, sala: () => roomId, origem: "Hexatombe" });

function addEvent(txt, gm = false) { state.log.unshift({ at: Date.now(), dia: state.dia, txt, ...(gm ? { gm: true } : {}) }); state.log = state.log.slice(0, 40); }
/* ---------- Mortes anônimas: o que os jogadores recebem ---------- */
// Cópia do estado sem os segredos do mestre: some o "oculto", os eventos só do mestre,
// e quem morreu anonimamente continua aparecendo vivo para os jogadores.
function estadoPublico() {
  const s = JSON.parse(JSON.stringify(state));
  delete s.oculto;
  s.log = (s.log || []).filter((l) => !l.gm);
  for (const t of s.equipes || []) for (const m of t.membros || []) if (m.mortoAnon) { m.vivo = true; delete m.mortoAnon; }
  return s;
}
function segredo(id) { return (id && state.oculto?.[id]) || null; }
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
    const pub = estadoPublico(); const json = JSON.stringify(pub);
    // cópia de segurança na sala (sem segredos do mestre), só se couber no limite de 16 KB
    try { await OBR.room.setMetadata({ [STATE_KEY]: json.length < 12000 ? pub : { rev: state.rev, grande: true } }); } catch { /* sem espaço: as mensagens e o navegador do mestre seguram o estado */ }
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
// pub: texto alternativo para os jogadores (ex.: morte anônima); o mestre vê o texto completo
function announce(text, local = false, sino = false, pub = null) {
  PM.texto(text);
  rollLog.unshift({ at: Date.now(), text }); rollLog = rollLog.slice(0, 40);
  lsSet(NS + ":log:" + roomId, JSON.stringify(rollLog));
  if (sino) { bell(); redFlash(); document.body.classList.add("sino"); setTimeout(() => document.body.classList.remove("sino"), 5000); }
  if (obrOk) { OBR.notification.show(text.split("\n")[0]); if (!local) OBR.broadcast.sendMessage(CHANNEL, { text: pub || text, sino }).catch(() => {}); }
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
function registrarMorte(vid, kid, diurna, anon = false) {
  const v = findM(vid); if (!v || !v.m.vivo) return;
  const k = kid ? findM(kid) : null;
  v.m.vivo = false;
  const sid = uid();
  const real = { nome: mName(v.m), equipe: v.t.nome, algoz: k ? mName(k.m) : "" };
  if (anon) { v.m.mortoAnon = true; (state.oculto ||= {})[sid] = { ...real, vid: v.m.id }; }
  (state.mortes ||= []).push(anon ? { id: sid, anon: true, dia: state.dia, nome: "", equipe: "", algoz: "", sac: v.m.sac || null } : { id: sid, dia: state.dia, ...real, sac: v.m.sac || null });
  const linhas = [`☠ ${real.nome} (${real.equipe}) morreu${k ? ` pelas mãos de ${real.algoz}` : ""}.${anon ? " [anônima]" : ""}`];
  const pub = []; // o que os jogadores veem quando a morte é anônima
  const segredoL = new Set(); // índices de linhas que revelam quem é sacrifício (só o mestre vê)
  if (!v.m.sac) {
    if (anon) { addEvent(linhas[0], true); addEvent("☠ Alguém morreu."); announce(linhas[0], false, false, "☠ Alguém morreu."); }
    else { addEvent(linhas[0]); announce(linhas[0]); }
    return save();
  }
  const est = v.m.sac;
  const valido = !diurna && sacrificiosHoje().length === 0;
  if (valido) {
    state.sacrificios.push(anon ? { id: sid, anon: true, dia: state.dia, estigma: est, vitima: "", equipe: "", algoz: "" } : { id: sid, dia: state.dia, estigma: est, vitima: real.nome, equipe: real.equipe, algoz: real.algoz });
    const sino = `🔔 O SINO TOCA. Sacrifício ${state.sacrificios.length}/6 realizado (${est}). Nenhum outro sacrifício deve morrer esta noite.`;
    const intencao = `Intenção liberada — ${est}: ${EST[est].missao} Recompensa: ${EST[est].rec}`;
    linhas.push(sino, intencao);
    pub.push(`☠ O sacrifício de ${est} morreu.`, sino, intencao);
    const castigo = badalarSino();
    if (castigo.length) linhas.push("Desertores castigados:\n" + castigo.join("\n"));
    for (const x of v.t.membros.map((m) => ({ m, t: v.t })).filter((x) => x.m.vivo && !x.m.sac)) { const i = tornarDesertor(x, "perdeu o sacrifício"); if (i) linhas.push(i); }
    if (state.dia === 6) { linhas.push("Lua de Sangue: veja a aba Ritual para o sacrifício final."); pub.push("Lua de Sangue: o sacrifício final se aproxima."); }
  } else {
    const passa = diurna ? "A morte aconteceu fora da noite: o sacrifício não conta e o estigma passa adiante." : "Já houve um sacrifício esta noite: este não conta e o estigma passa adiante.";
    linhas.push(passa); pub.push(`☠ O sacrifício de ${est} morreu.`, passa);
    if (k && k.m.vivo && !k.m.sac) { k.m.sac = est; segredoL.add(linhas.push(`${mName(k.m)} herda o estigma de ${est} e vira sacrifício.`) - 1); }
    else { state.herdeiro = est; segredoL.add(linhas.push(`Ninguém pode herdar: a Coroa escolhe um novo sacrifício digno (${est}). Mestre: escolha na aba Ritual.`) - 1); }
    pub.push(`O estigma de ${est} passou a outra pessoa — ninguém sabe a quem.`);
    for (const x of v.t.membros.map((m) => ({ m, t: v.t })).filter((x) => x.m.vivo && !x.m.sac)) { const i = tornarDesertor(x, "perdeu o sacrifício"); if (i) linhas.push(i); }
  }
  if (anon) {
    for (const l of linhas) addEvent(l.split("\n")[0], true);
    for (const l of pub) addEvent(l);
    announce(linhas.join("\n"), false, valido, pub.join("\n"));
  } else {
    linhas.forEach((l, i) => addEvent(l.split("\n")[0], segredoL.has(i)));
    if (segredoL.size) for (const l of pub.slice(-1)) addEvent(l);
    const pubTxt = segredoL.size ? linhas.filter((_, i) => !segredoL.has(i)).concat(pub.slice(-1)).join("\n") : null;
    announce(linhas.join("\n"), false, valido, pubTxt);
  }
  save();
}
// Revela uma morte que estava anônima (vai para os jogadores a partir daqui)
function revelarMorte(id) {
  const o = segredo(id); if (!o) return;
  const mo = (state.mortes || []).find((x) => x.id === id); const sa = state.sacrificios.find((x) => x.id === id);
  if (mo) { Object.assign(mo, { nome: o.nome, equipe: o.equipe, algoz: o.algoz }); delete mo.anon; }
  if (sa) { Object.assign(sa, { vitima: o.nome, equipe: o.equipe, algoz: o.algoz }); delete sa.anon; }
  const x = o.vid && findM(o.vid); if (x) delete x.m.mortoAnon;
  delete state.oculto[id];
  const txt = `☠ Revelado: ${sa ? `o sacrifício de ${sa.estigma} era ` : ""}${o.nome} (${o.equipe})${o.algoz ? `, morto por ${o.algoz}` : ""}.`;
  addEvent(txt); announce(txt); save();
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
  if (!dice?.length || quietDice || isGM()) return; // o mestre vê os dados no prato do mestre
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
async function sendChunks(payload, tam = SCH) {
  if (!obrOk) return false;
  const str = JSON.stringify(payload); const n = Math.max(1, Math.ceil(str.length / tam)); const m = uid();
  for (let i = 0; i < n; i++) {
    try { await OBR.broadcast.sendMessage(SYNC, { m, i, n, d: str.slice(i * tam, (i + 1) * tam) }); } catch { return false; }
    if (n > 1) await sleep(70);
  }
  return true;
}
function onSyncChunk(data) {
  if (!data?.m) return;
  const p = (syncParts[data.m] ||= { n: data.n, parts: [], got: 0, at: Date.now() });
  if (p.parts[data.i] === undefined) { p.parts[data.i] = data.d; p.got++; }
  if (p.got === p.n) { delete syncParts[data.m]; try { onSync(JSON.parse(p.parts.join(""))); } catch { /* */ } }
  for (const [k, v] of Object.entries(syncParts)) if (Date.now() - v.at > 60000) delete syncParts[k];
}
let bcastTimer;
function broadcastState() { clearTimeout(bcastTimer); bcastTimer = setTimeout(() => sendChunks({ kind: "state", state: estadoPublico() }), 150); }
function onSync(obj) {
  if (obj.kind === "hello") { if (isGM()) broadcastState(); return; }
  if (obj.kind === "img") { if (obj.id && /^data:image\//.test(obj.data || "")) IMG.guardar(obj.id, obj.data).then(() => imagensDaTela()); return; }
  if (obj.kind === "pedeImg") { if (isGM()) for (const id of (obj.ids || []).slice(0, 12)) enviarImagem(String(id)); return; }
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
// Linhas editáveis do formulário (sem "uma por linha")
const bfAtqRow = (a = ["", "", "", ""]) => `<div class="bf-row bf-atq">
  <input data-k="0" placeholder="Ataque (ex.: Mordida)" value="${esc(a[0] || "")}"><input data-k="1" placeholder="Teste 2d20+5" value="${esc(a[1] || "")}">
  <input data-k="2" placeholder="Dano 1d6+2" value="${esc(a[2] || "")}"><input data-k="3" placeholder="Tipo (corte)" value="${esc(a[3] || "")}">
  <button class="icon" data-bfroll="atq" title="Rolar este ataque">🎲</button><button class="icon danger" data-bfdel title="Remover">✕</button></div>`;
const bfExRow = (a = ["", ""]) => `<div class="bf-row bf-ex">
  <input data-k="0" placeholder="Nome (ex.: Chicotada)" value="${esc(a[0] || "")}"><input data-k="1" placeholder="Dados 4d8" value="${esc(a[1] || "")}">
  <button class="icon" data-bfroll="ex" title="Rolar">🎲</button><button class="icon danger" data-bfdel title="Remover">✕</button></div>`;
const bfPerRow = (a = ["", ""]) => `<div class="bf-row bf-per">
  <input data-k="0" placeholder="Perícia (ex.: Furtividade)" value="${esc(a[0] || "")}"><input data-k="1" placeholder="Teste 2d20+10" value="${esc(a[1] || "")}">
  <button class="icon" data-bfroll="per" title="Rolar">🎲</button><button class="icon danger" data-bfdel title="Remover">✕</button></div>`;
const bfHabRow = (h = { nome: "", desc: "" }) => `<div class="bf-hab">
  <div class="row"><input data-k="nome" placeholder="Nome da habilidade (opcional)" value="${esc(h.nome || "")}"><button class="icon danger" data-bfdel title="Remover">✕</button></div>
  <textarea data-k="desc" rows="3" placeholder="O que ela faz — pode ter quantas linhas quiser">${esc(h.desc || "")}</textarea></div>`;
function npcHabs(c) { return Array.isArray(c.habs) ? c.habs : (c.hab || []).map((h) => ({ nome: "", desc: h })); }
function bestForm(c) {
  c ||= { nome: "", tipo: "", vd: "", def: "", pv: "", maq: "", desl: "", attrs: "", per: "1d20", ini: "1d20", res: { Fortitude: "1d20", Reflexos: "1d20", Vontade: "1d20" }, pp: "", rd: "", vuln: "", hab: [], atq: [], extra: [], lore: "" };
  const f = (id, label, v, extra = "") => `<label>${label} <input id="bf-${id}" value="${esc(v ?? "")}" ${extra}></label>`;
  const lista = (id, titulo, rows, addTxt) => `<div class="bf-list"><div class="row"><b>${titulo}</b><span class="grow"></span><button class="ghost icon" data-bfadd="${id}">＋ ${addTxt}</button></div><div id="bf-${id}-list">${rows}</div></div>`;
  return `<div class="bestform">
    <div class="grid2">${f("nome", "Nome", c.nome)}${f("tipo", "Tipo e tamanho", c.tipo, 'placeholder="Criatura de Sangue Média"')}</div>
    <div class="grid3">${f("vd", "VD / NEX", c.vd)}${f("def", "Defesa", c.def)}${f("pv", "PV máximos", c.pv)}${f("pe", "PE máximos", c.pe)}${f("maq", "Machucado", c.maq)}${f("desl", "Deslocamento", c.desl)}</div>
    ${f("attrs", "Atributos", c.attrs, 'placeholder="AGI 2 · FOR 1 · INT 1 · PRE 3 · VIG 2"')}
    <div class="grid3">${f("per", "Percepção", c.per, 'placeholder="2d20+5"')}${f("ini", "Iniciativa", c.ini)}${f("fort", "Fortitude", c.res?.Fortitude)}${f("ref", "Reflexos", c.res?.Reflexos)}${f("von", "Vontade", c.res?.Vontade)}</div>
    <div class="grid3">${f("pp", "Presença perturbadora", c.pp, 'placeholder="DT 20 · 3d8 mental"')}${f("rd", "Resistências", c.rd)}${f("vuln", "Vulnerabilidades", c.vuln)}</div>
    ${lista("atq", "⚔ Ataques", (c.atq || []).map(bfAtqRow).join("") || bfAtqRow(), "ataque")}
    ${lista("ex", "🎲 Outras rolagens", (c.extra || []).map(bfExRow).join(""), "rolagem")}
    ${lista("per", "Perícias", (c.pericias || []).map(bfPerRow).join(""), "perícia")}
    ${lista("hab", "✦ Habilidades", npcHabs(c).map(bfHabRow).join(""), "habilidade")}
    <label>📜 Lore <span class="muted small">(aparece embaixo do NPC)</span><textarea id="bf-lore" rows="6" placeholder="Quem é, de onde veio, o que quer, o que esconde…">${esc(c.lore || "")}</textarea></label>
    <div class="row"><button class="primary" id="btnBestSave">${ui.bestEdit ? "Salvar alterações" : "Adicionar ao bestiário"}</button>${ui.bestEdit ? `<button class="ghost" id="btnBestCancel">Cancelar</button>` : ""}</div>
  </div>`;
}
function bfRows(id) {
  return [...document.querySelectorAll(`#bf-${id}-list > *`)].map((r) => Object.fromEntries([...r.querySelectorAll("[data-k]")].map((x) => [x.dataset.k, x.value.trim()])));
}
function bestFromForm() {
  const v = (id) => (document.getElementById("bf-" + id)?.value || "").trim();
  const nome = v("nome"); if (!nome) { toast("Dê um nome à criatura."); return null; }
  const habs = bfRows("hab").filter((h) => h.nome || h.desc).map((h) => ({ nome: h.nome, desc: h.desc }));
  return {
    id: ui.bestEdit || uid(), custom: true, nome, tipo: v("tipo"), vd: v("vd"), def: v("def"), pv: v("pv"), maq: v("maq"), desl: v("desl"), attrs: v("attrs"),
    per: v("per") || "1d20", ini: v("ini") || "1d20", res: { Fortitude: v("fort") || "1d20", Reflexos: v("ref") || "1d20", Vontade: v("von") || "1d20" },
    pp: v("pp"), rd: v("rd"), vuln: v("vuln"), pe: v("pe"), lore: (document.getElementById("bf-lore")?.value || "").trim(),
    habs, hab: habs.map((h) => (h.nome ? `${h.nome}. ${h.desc}` : h.desc).trim()), // "hab" em texto continua para as outras extensões
    pericias: bfRows("per").filter((p) => p[0] || p[1]).map((p) => [p[0] || "Perícia", p[1] || "1d20"]),
    atq: bfRows("atq").filter((a) => a[0] || a[1] || a[2]).map((a) => [a[0] || "Ataque", a[1] || "1d20", a[2] || "", a[3] || ""]),
    extra: bfRows("ex").filter((a) => a[0] || a[1]).map((a) => [a[0] || "Rolagem", a[1] || "1d6"]),
  };
}
// Junta NPCs lidos de um arquivo com os do ritual (mesmo ID = atualiza)
function importarNpcs(lista) {
  let novos = 0, atual = 0;
  for (const imp of lista) {
    const i = imp.id ? state.bestiario.findIndex((x) => x.id === imp.id) : -1;
    if (i >= 0) {
      const old = state.bestiario[i]; npcPv(old);
      const cheio = (at, mx) => at === "" || at === undefined || num(at) >= num(mx);
      const pvAtual = imp.pvAtual ?? (cheio(old.pvAtual, old.pv) ? imp.pv : Math.min(num(old.pvAtual), num(imp.pv)));
      const peAtual = imp.peAtual ?? (cheio(old.peAtual, old.pe) ? imp.pe : Math.min(num(old.peAtual), num(imp.pe)));
      state.bestiario[i] = { ...old, ...imp, id: old.id, pvAtual, peAtual };
      const mem = npcMember(old.id); if (mem) mem.m.nome = imp.nome;
      atual++;
    } else {
      state.bestiario.push({ ...imp, id: uid(), pvAtual: imp.pvAtual ?? imp.pv, peAtual: imp.peAtual ?? imp.pe }); novos++;
    }
  }
  save(); toast(`Fichas importadas: ${novos} novo(s), ${atual} atualizado(s).`);
}
function importarTextos(textos) {
  const lista = []; let ruins = 0;
  for (const t of textos) { try { lista.push(...lerArquivoNpcs(t)); } catch { ruins++; } }
  if (!lista.length) { toast("Não encontrei nenhum NPC. Cada ficha precisa de “=== NPC ===” e “Nome: …”."); return false; }
  importarNpcs(lista); if (ruins) toast(`${ruins} arquivo(s) não puderam ser lidos.`); return true;
}
// Rola uma linha do formulário sem precisar salvar
function bfRoll(btn, tipo) {
  const row = btn.closest(".bf-row"); const k = Object.fromEntries([...row.querySelectorAll("[data-k]")].map((x) => [x.dataset.k, x.value.trim()]));
  const quem = (document.getElementById("bf-nome")?.value || "").trim() || "NPC";
  if (tipo === "atq") {
    const t = rollMonster(k[1] || "1d20"); const dm = k[2] ? rollExpr(k[2]) : null;
    announce(`${quem} — ${k[0] || "Ataque"}: ${t.txt}${dm?.ok ? `\nDano: ${dm.total} ${k[3] || ""}  —  ${dm.txt}` : ""}`, true); return;
  }
  if (tipo === "per") { const t = rollMonster(k[1] || "1d20"); announce(`${quem} — ${k[0] || "Perícia"}: ${t.txt}`, true); return; }
  const r = rollExpr(k[1] || "1d6"); if (!r.ok) return toast("Escreva os dados, ex.: 2d6+3.");
  announce(`${quem} — ${k[0] || "Rolagem"}: ${r.total}  —  ${r.txt}`, true);
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
  const eq = tIdx >= 0 ? state.equipes[tIdx] : null; const morto = !!(mem && !mem.m.vivo);
  const conds = c.cond || []; const sub = ui.npcSub?.[c.id] || "combate";
  const pct = (a, m) => num(m) > 0 ? clamp(Math.round(100 * num(a) / num(m)), 0, 100) : 0;
  const mini = (k, a, m) => num(m) > 0 ? `<span class="npc-mini ${k}" title="${k.toUpperCase()} ${num(a)}/${num(m)}"><span class="mbar"><i style="width:${pct(a, m)}%"></i></span><em>${num(a)}</em></span>` : "";
  const flags = [morto ? `<span class="flag bad" title="Morto">✝</span>` : "", c.des ? `<span class="flag bad" title="Desertor">⚑</span>` : "",
    conds.length ? `<span class="flag warn" title="${esc(conds.join(", "))}">⚠${conds.length > 1 ? conds.length : ""}</span>` : ""].join("");
  const vital = (k, rot) => `<div class="vital ${k}"><div class="vital-h"><span>${rot}</span><span class="vital-n"><input type="number" data-npc="${c.id}|${k}Atual" value="${esc(c[k + "Atual"])}" aria-label="${rot} atual"><i>/</i><input type="number" data-npc="${c.id}|${k}" value="${esc(c[k])}" aria-label="${rot} máximo"></span></div><div class="vbar"><i style="width:${pct(c[k + "Atual"], c[k])}%"></i></div></div>`;
  const tiles = [["Defesa", c.def], ["Desloc.", c.desl], ["VD", c.vd], ["Machucado", c.maq]].filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `<div><span>${k}</span><b>${esc(v)}</b></div>`).join("");
  const attrs = String(c.attrs || "").split(/\s*[·,;]\s*/).filter(Boolean).map((x) => `<span>${esc(x)}</span>`).join("");
  const tags = [c.des ? `<span class="tag bad">desertor${num(c.pen) ? ` −${num(c.pen)}` : ""}</span>` : "",
    conds.length ? `<span class="tag bad">${esc(conds.join(", "))} <button class="icon" data-npcclr="${c.id}" title="Limpar condições">✕</button></span>` : "",
    num(c.semAgua) ? `<span class="tag">sem água ×${c.semAgua}</span>` : "", num(c.semComida) ? `<span class="tag">sem comida ×${c.semComida}</span>` : "",
    ...(c.rewards || []).map((r) => `<span class="tag good">✦ ${esc(r)}</span>`)].filter(Boolean).join("");
  const roll = (attr, rot, dado) => `<button class="nroll" ${attr}><span>${esc(rot)}</span><b>${esc(dado)}</b></button>`;
  const testes = [roll(`data-mon="${ci}|per"`, "Percepção", c.per), roll(`data-mon="${ci}|ini"`, "Iniciativa", c.ini),
    ...Object.entries(c.res || {}).map(([k, v]) => roll(`data-mon="${ci}|res|${k}"`, k, v)),
    ...(c.pericias || []).map((p, pi) => roll(`data-npcper="${c.id}|${pi}"`, p[0], p[1]))].join("");
  const ataques = [...(c.atq || []).map((a, ai) => `<button class="natk" data-monatk="${ci}|${ai}"><span class="natk-n">🎲 ${esc(a[0])}</span><span class="natk-d">${esc(a[1])}${a[2] ? ` · <b>${esc(a[2])}</b>` : ""}${a[3] ? ` ${esc(a[3])}` : ""}</span></button>`),
    ...(c.extra || []).map((e, ei) => `<button class="natk alt" data-monex="${ci}|${ei}"><span class="natk-n">🎲 ${esc(e[0])}</span><span class="natk-d">${esc(e[1])}</span></button>`)].join("");
  const defs = [["Presença perturbadora", c.pp], ["Resistências", c.rd], ["Vulnerável a", c.vuln]].filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("");
  const habs = npcHabs(c);
  const paneBtn = (k, rot) => `<button data-npcsub="${c.id}|${k}" class="${sub === k ? "on" : ""}">${rot}</button>`;
  return `<details class="card npc ${morto ? "dead" : ""}" style="--tc:${eq ? eq.cor : "#6b5a5e"}" data-npcbox="${c.id}" data-nome="${esc(String(c.nome || "").toLowerCase())}" ${ui.npcOpen === c.id ? "open" : ""}>
    <summary class="npc-sum"><span class="npc-id"><b>${esc(c.nome)}</b><small>${esc(c.tipo || "NPC")}</small></span>
      <span class="npc-vit">${mini("pv", c.pvAtual, c.pv)}${mini("pe", c.peAtual, c.pe)}</span>${flags ? `<span class="npc-flags">${flags}</span>` : ""}<span class="chev">›</span></summary>
    <div class="npc-body">
      <div class="npc-vitals">${vital("pv", "PV")}${num(c.pe) > 0 || num(c.peAtual) > 0 ? vital("pe", "PE") : ""}</div>
      ${tiles || attrs ? `<div class="npc-stats">${tiles ? `<div class="npc-tiles">${tiles}</div>` : ""}${attrs ? `<div class="npc-attrs">${attrs}</div>` : ""}</div>` : ""}
      ${tags ? `<div class="npc-tags">${tags}</div>` : ""}
      <div class="npc-subtabs" data-npcsubs="${c.id}">${paneBtn("combate", "Combate")}${paneBtn("hab", `Habilidades${habs.length ? ` <small>${habs.length}</small>` : ""}`)}${paneBtn("lore", "Lore e notas")}</div>
      <div class="npc-pane" data-pane="combate" ${sub === "combate" ? "" : "hidden"}>
        <div class="npc-lbl">Testes</div><div class="npc-rolls">${testes}</div>
        ${ataques ? `<div class="npc-lbl">Ataques</div><div class="npc-atks">${ataques}</div>` : ""}
        ${defs ? `<dl class="npc-defs">${defs}</dl>` : ""}
      </div>
      <div class="npc-pane" data-pane="hab" ${sub === "hab" ? "" : "hidden"}>
        ${habs.length ? `<div class="npc-habs">${habs.map((h) => `<div class="npc-hab">${h.nome ? `<b>${esc(h.nome)}</b>` : ""}<span>${esc(h.desc)}</span></div>`).join("")}</div>` : `<p class="muted">Nenhuma habilidade. Use ✎ para adicionar.</p>`}
      </div>
      <div class="npc-pane" data-pane="lore" ${sub === "lore" ? "" : "hidden"}>
        <label class="npc-lore">📜 Lore <textarea data-npc="${c.id}|lore" rows="${Math.min(14, Math.max(3, String(c.lore || "").split("\n").length + 1))}" placeholder="Escreva aqui a história deste NPC…">${esc(c.lore || "")}</textarea></label>
        <label>Notas do mestre <textarea data-npc="${c.id}|notas" rows="3" placeholder="Anotações rápidas sobre este NPC…">${esc(c.notas || "")}</textarea></label>
        ${(c.historia || []).length ? `<div class="npc-lbl">História</div><ul class="plain small npc-hist">${c.historia.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
      </div>
      <div class="npc-foot"><label class="inline">Equipe <select data-npcteam="${c.id}"><option value="-1">— nenhuma —</option>${opt(state.equipes.map((t, i) => [i, t.nome]), tIdx)}</select></label>
        <span class="grow"></span><button class="ghost icon" data-npcexp="${c.id}" title="Baixar a ficha deste NPC (.txt) para editar e importar de volta">⤓</button><button class="ghost icon" data-bestedit="${c.id}" title="Editar ficha">✎</button><button class="ghost icon danger" data-bestdel="${c.id}" title="Apagar NPC">🗑</button></div>
    </div>
  </details>`;
}

// Lista de NPCs agrupada por equipe, com busca e filtro
function npcLista(all) {
  let f = ui.npcFil ?? "all"; const q = String(ui.npcBusca || "").toLowerCase().trim();
  const grupos = state.equipes.map((t, ti) => ({ k: String(ti), nome: t.nome, cor: t.cor, lista: [] })); const sem = { k: "none", nome: "Sem equipe", cor: "#6b5a5e", lista: [] };
  for (const c of state.bestiario) { const m = npcMember(c.id); const ti = m ? state.equipes.indexOf(m.t) : -1; (ti >= 0 ? grupos[ti] : sem).lista.push(c); }
  const todos = [...grupos, sem].filter((g) => g.lista.length);
  if (!todos.some((g) => g.k === f)) f = "all";
  const chip = (k, rot, n, cor) => `<button class="chip ${f === k ? "on" : ""}" ${cor ? `style="--tc:${cor}"` : ""} data-npcfil="${k}">${esc(rot)} <small>${n}</small></button>`;
  const chips = `<div class="chips npc-filtros">${chip("all", "Todos", state.bestiario.length)}${todos.map((g) => chip(g.k, g.nome, g.lista.length, g.cor)).join("")}</div>`;
  const vis = f === "all" ? todos : todos.filter((g) => g.k === f);
  const corpo = vis.map((g) => `<div class="npc-grupo" ${q && !g.lista.some((c) => String(c.nome || "").toLowerCase().includes(q)) ? "hidden" : ""} style="--tc:${g.cor}"><div class="npc-ghead"><span>${esc(g.nome)}</span><small>${g.lista.length}</small></div>
    ${g.lista.map((c) => npcCard(c, all.indexOf(c)).replace("<details ", `<details ${q && !String(c.nome || "").toLowerCase().includes(q) ? "hidden " : ""}`)).join("")}</div>`).join("");
  return `<div class="npc-toolbar"><input id="npcBusca" type="search" placeholder="🔍 Buscar NPC…" value="${esc(ui.npcBusca || "")}"></div>${chips}${corpo}`;
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
  const outrosMortos = allMembers().filter((x) => !x.m.vivo && !x.m.mortoAnon && !nomesReg.has(mName(x.m)));
  const des = allMembers().filter((x) => x.m.des);
  const ints = ESTIGMAS.filter((e) => (state.intencoes[e.nome] || []).length);
  const desfecho = state.finalFeito ? "O sacrifício final foi realizado sob a Lua de Sangue." : state.fracassou ? "O Hexatombe fracassou." : `O ritual chegou ao dia ${state.dia} de 6.`;
  const log = state.log.filter((l) => !l.gm).reverse();
  return `<div class="epi">
    <p class="epi-lead">${desfecho} ${state.sacrificios.length} de 6 sacrifícios realizados.</p>
    <h4>Sobreviventes (${vivos.length})</h4>
    <ul>${state.equipes.map((t) => { const v = t.membros.filter((m) => m.vivo); return v.length ? `<li><b>${esc(t.nome)}:</b> ${v.map((m) => esc(mName(m)) + (m.sac ? ` ✠${esc(m.sac)}` : "")).join(", ")}</li>` : ""; }).join("") || "<li>Ninguém.</li>"}</ul>
    <h4>Sacrifícios</h4>
    <ol>${state.sacrificios.map((s) => s.anon ? `<li><b>${esc(s.estigma)}</b> — identidade oculta, dia ${s.dia}</li>` : `<li><b>${esc(s.estigma)}</b> — ${esc(s.vitima)} (${esc(s.equipe)}), dia ${s.dia}${s.algoz ? `, pelas mãos de ${esc(s.algoz)}` : ""}</li>`).join("") || "<li>Nenhum.</li>"}</ol>
    <h4>Mortos</h4>
    <ul>${mortesReg.map((m) => m.anon ? `<li>Alguém — dia ${m.dia}${m.sac ? ` · sacrifício de ${esc(m.sac)}` : ""}</li>` : `<li>${esc(m.nome)} (${esc(m.equipe)}) — dia ${m.dia}${m.algoz ? `, por ${esc(m.algoz)}` : ""}${m.sac ? ` · sacrifício de ${esc(m.sac)}` : ""}</li>`).join("")}${outrosMortos.map((x) => `<li>${esc(mName(x.m))} (${esc(x.t.nome)})</li>`).join("")}${!mortesReg.length && !outrosMortos.length ? "<li>Ninguém.</li>" : ""}</ul>
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

// Linhas antigas que revelavam quem é sacrifício (gravadas antes de virarem só do mestre)
const REVELA_SAC = /é o sacrifício \(|deixou de ser sacrifício|e vira sacrifício\.|como novo sacrifício \(|Ninguém pode herdar/;
function logVisivel() { return isGM() ? state.log : state.log.filter((l) => !l.gm && !REVELA_SAC.test(l.txt)); }
function sacItem(s) {
  if (s.anon) {
    const o = isGM() && segredo(s.id);
    return `<li><span class="est">${esc(s.estigma)}</span> Dia ${s.dia} — <i>identidade oculta</i>${o ? ` <span class="muted">🔒 ${esc(o.nome)} (${esc(o.equipe)}${o.algoz ? `, por ${esc(o.algoz)}` : ""})</span> <button class="ghost icon" data-revelar="${s.id}" title="Contar aos jogadores quem morreu e quem matou">Revelar</button>` : ""}</li>`;
  }
  return `<li><span class="est">${esc(s.estigma)}</span> Dia ${s.dia} — ${esc(s.vitima)} <span class="muted">(${esc(s.equipe)}${s.algoz ? `, por ${esc(s.algoz)}` : ""})</span></li>`;
}
// Mortes anônimas que não foram sacrifício (só o mestre vê)
function mortesAnonCard() {
  const sids = new Set(state.sacrificios.map((s) => s.id));
  const ms = (state.mortes || []).filter((m) => m.anon && !sids.has(m.id) && segredo(m.id));
  if (!ms.length) return "";
  return `<h4 class="muted small">🕶 Outras mortes anônimas</h4><ul class="plain small">${ms.map((m) => { const o = segredo(m.id); return `<li>Dia ${m.dia} — ${esc(o.nome)} (${esc(o.equipe)})${o.algoz ? `, por ${esc(o.algoz)}` : ""}${m.sac ? ` · ✠ ${esc(m.sac)}` : ""} <button class="ghost icon" data-revelar="${m.id}">Revelar</button></li>`; }).join("")}</ul>`;
}
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
    <label class="check"><input type="checkbox" id="dAnon" ${ui.dAnon ? "checked" : ""}> 🕶 Morte anônima — os jogadores não veem quem morreu nem quem matou (se for sacrifício, veem o sino e o estigma)</label>
    <button class="danger-btn" id="btnMorte">☠ Registrar morte</button>
    <p class="muted">Se for sacrifício, o sino toca sozinho: castiga os desertores, transforma a equipe da vítima em desertora e libera a intenção do estigma. Um segundo sacrifício na mesma noite passa o estigma para quem matou.</p>
  </section>` : ""}

  ${npcSimCard()}
  <section class="card"><h3>Sacrifícios</h3>
    ${state.sacrificios.length ? `<ol class="sacs">${state.sacrificios.map((s) => sacItem(s)).join("")}</ol>` : `<p class="muted">Nenhum ainda.</p>`}
    ${isGM() ? mortesAnonCard() : ""}
  </section>

  <section class="card"><h3>Acontecimentos</h3>
    ${logVisivel().length ? `<ul class="log">${logVisivel().map((l) => `<li class="${l.gm ? "gmonly" : ""}"><span class="t">D${l.dia}</span><pre>${l.gm ? "🔒 " : ""}${esc(l.txt)}</pre></li>`).join("")}</ul>` : `<p class="muted">Nada ainda.</p>`}
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
    ${(t.perfil || []).length ? `<details class="perfil"><summary class="muted">📜 Perfil da equipe (só o mestre vê)</summary><ul class="plain small">${t.perfil.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></details>` : ""}
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
  const livro = BESTIARIO.map((c) => { const ci = all.indexOf(c); return `<details class="card beast"><summary><b>${esc(c.nome)}</b> <span class="muted">${esc(c.tipo)} · VD ${c.vd}</span></summary>
    <div class="bstats"><div><span>Defesa</span><b>${c.def}</b></div><div><span>PV</span><b>${c.pv}</b><small>machucado ${c.maq}</small></div><div><span>Desloc.</span><b class="small">${esc(c.desl)}</b></div></div>
    <p class="muted small">${esc(c.attrs)}${c.pp ? `<br>Presença perturbadora: ${esc(c.pp)}` : ""}${c.rd ? `<br>Resistências: ${esc(c.rd)}` : ""}${c.vuln ? ` · Vulnerável: ${esc(c.vuln)}` : ""}</p>
    <div class="rolls"><button data-mon="${ci}|per">Percepção ${esc(c.per)}</button><button data-mon="${ci}|ini">Iniciativa ${esc(c.ini)}</button>${Object.entries(c.res || {}).map(([k, v]) => `<button data-mon="${ci}|res|${k}">${k} ${esc(v)}</button>`).join("")}</div>
    <div class="atks">${c.atq.map((a, ai) => `<button class="primary" data-monatk="${ci}|${ai}">🎲 ${esc(a[0])} <small>${esc(a[1])} · ${esc(a[2])} ${esc(a[3])}</small></button>`).join("")}${(c.extra || []).map((e, ei) => `<button data-monex="${ci}|${ei}">🎲 ${esc(e[0])} <small>${esc(e[1])}</small></button>`).join("")}</div>
    <ul class="plain small">${(c.hab || []).map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
    <div class="row"><button class="ghost icon" data-livroexp="${ci}" title="Baixa a ficha; edite e importe para virar um NPC seu">⤓ ficha para editar</button><button class="ghost icon" data-livrocopia="${ci}">＋ copiar para meus NPCs</button></div></details>`; }).join("");
  return `<details class="card npc-new" ${ui.bestEdit ? "open" : ""} id="bestNewBox"><summary><b>${edit ? `✎ Editando: ${esc(edit.nome)}` : "＋ Novo NPC"}</b></summary>${bestForm(edit)}</details>
  ${state.bestiario.length ? npcLista(all) : `<section class="card npc-vazio"><p class="muted">Nenhum NPC ainda. Crie um acima, importe fichas abaixo ou copie uma ameaça do livro.</p></section>`}
  <details class="card npc-io"><summary><b>⇅ Importar / exportar fichas</b></summary>
    <p class="muted small">Baixe as fichas (.txt), edite no Bloco de Notas e importe de volta: NPCs com o mesmo ID são atualizados (PV atuais, condições e equipe continuam), os outros entram como novos. Aceita também .json.</p>
    <div class="row wrap"><button class="primary" id="btnNpcImp">⤒ Importar fichas</button><button id="btnNpcExpAll" ${state.bestiario.length ? "" : "disabled"}>⤓ Exportar todos</button><button class="ghost" id="btnNpcModelo">Modelo em branco</button>
      <input type="file" id="npcArq" accept=".txt,.json,text/plain,application/json" multiple hidden></div>
    <details class="small"><summary class="muted">ou colar o texto da ficha</summary>
      <textarea id="npcCola" rows="6" placeholder="=== NPC ===&#10;Nome: …"></textarea><button id="btnNpcCola">Importar texto colado</button></details>
  </details>
  <details class="card"><summary><b>Ameaças do Hexatombe (livro)</b> <span class="muted">${BESTIARIO.length}</span></summary>
    <p class="muted">Também aparecem o Quibungo (SaH, p. 142) e zumbis de Sangue (OPRPG, p. 202–203).</p>${livro}</details>`;
}

const TABS = [["ritual", "Ritual"], ["arena", "Arena"], ["equipes", "Equipes"], ["intencoes", "Intenções"], ["base", "Recursos e base"], ["explorar", "Exploração"], ["extras", "Extras"], ["bestiario", "NPCs"], ["arquivo", "Arquivo"], ["epilogo", "Epílogo"]];
let renderPending = false;
function render() {
  renderPending = false; ui.bfDirty = false;
  selTeam = clamp(selTeam, 0, state.equipes.length - 1);
  const y = window.scrollY;
  const tabsOk = isGM() ? TABS : TABS.filter(([k]) => ["ritual", "arena", "equipes", "intencoes", "base", "arquivo"].includes(k));
  if (!tabsOk.some(([k]) => k === tab)) tab = "ritual";
  const body = { ritual: tabRitual, arena: tabArena, equipes: tabEquipes, intencoes: tabIntencoes, base: tabBase, explorar: tabExplorar, extras: tabExtras, bestiario: tabBestiario, arquivo: tabArquivo, epilogo: tabEpilogo }[tab]();
  app.innerHTML = `<header class="top"><span class="logo" data-text="HEXATOMBE">HEXATOMBE</span><span class="role ${isGM() ? "gm" : ""}">${isGM() ? "Mestre" : "Jogador"}</span>
    <span class="daypill">Dia ${state.dia} · ${FASES[state.fase]}</span>
    ${isGM() ? `<button class="icon" id="btnUndoH" ${hist.length ? `title="Desfazer: ${esc(hist[hist.length - 1].label)}"` : 'disabled title="Nada para desfazer"'}>↶</button>` : ""}
    <button class="icon" id="btnTam" title="Tamanho da janela">⤡</button><button class="icon" id="btnSom" title="Som do sino e dos dados">${somOn ? "🔔" : "🔕"}</button></header>
    <nav class="tabs">${tabsOk.map(([k, l]) => `<button data-tab="${k}" class="${k === tab ? "on" : ""}">${l}</button>`).join("")}</nav>
    <main>${body}</main>`;
  window.scrollTo(0, y);
  imagensDaTela();
  if (tab === "arquivo" && ui.arq === "bestiario") { clearTimeout(vistoTimer); vistoTimer = setTimeout(marcarVistos, 2500); }
}
function softRender() {
  const a = document.activeElement;
  if (a && app.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) { renderPending = true; return; }
  if (ui.bfDirty && document.querySelector(".bestform")) { renderPending = true; return; } // não apaga o NPC que está sendo criado
  render();
}
app.addEventListener("focusout", () => { if (renderPending) setTimeout(() => renderPending && softRender(), 60); });
app.addEventListener("input", (e) => { if (e.target.closest?.(".bestform")) ui.bfDirty = true; }, true);

/* ---------- Eventos ---------- */
const val = (id) => document.getElementById(id)?.value ?? "";
function onChange(e) {
  const el = e.target; const d = el.dataset;
  if (d.selteam) { selTeam = Number(el.value); ui.achados = null; render(); return; }
  if (!isGM()) return;
  if (d.team) { const [ti, k] = d.team.split("|"); state.equipes[ti][k] = el.value; save(k === "nome"); return; } // nome: sem redesenhar, para não engolir o próximo clique
  if (d.mem) {
    const [ti, mi, k] = d.mem.split("|"); const m = state.equipes[ti].membros[mi];
    m[k] = el.value || null; addEvent(`${mName(m)} ${m.sac ? `é o sacrifício (${m.sac})` : "deixou de ser sacrifício"}.`, true); save(); return;
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
  if (d.npc) { const [id, f] = d.npc.split("|"); const c = npcGet(id); if (!c) return; c[f] = (f === "notas" || f === "lore") ? el.value : (el.value === "" ? "" : num(el.value)); ui.npcOpen = id; save(true); return; }
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
  if (b.id === "btnNpcSim") return npcSimDialog();
  if (b.id === "btnUnfail") { state.fracassou = false; save(); return; }
  if (b.id === "btnHeir") { const x = findM(val("heirSel")); if (!x) return; x.m.sac = state.herdeiro; const txt = `A Coroa escolhe ${mName(x.m)} como novo sacrifício (${state.herdeiro}).`; const pubTxt = `👑 A Coroa escolheu, em segredo, quem carrega o estigma de ${state.herdeiro}.`; state.herdeiro = null; addEvent(txt, true); addEvent(pubTxt); announce(txt, false, false, pubTxt); save(); return; }
  if (b.id === "btnFinal") return sacrificioFinal();
  if (b.id === "btnMorte") {
    const v = val("dVit"); if (!v) return toast("Escolha quem morreu.");
    const k = val("dKil") || null; if (k === v) return toast("A vítima não pode ser o algoz.");
    ui.dVit = ui.dKil = ""; ui.dAnon = document.getElementById("dAnon").checked; registrarMorte(v, k, document.getElementById("dDia").checked, ui.dAnon); return;
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
  if (d.revelar) { revelarMorte(d.revelar); return; }
  if (d.npcexp) { const c = npcGet(d.npcexp); if (c) downloadFile(nomeArquivo(c.nome), npcsParaArquivo([c]), "text/plain;charset=utf-8"); return; }
  if (d.livroexp !== undefined) { const c = BESTIARIO[Number(d.livroexp)]; if (c) downloadFile(nomeArquivo(c.nome), npcsParaArquivo([{ ...c, id: "", custom: false }]), "text/plain;charset=utf-8"); return; }
  if (d.livrocopia !== undefined) {
    const c = BESTIARIO[Number(d.livrocopia)]; if (!c) return;
    const [imp] = lerArquivoNpcs(npcsParaArquivo([{ ...c, id: "", custom: false }])); importarNpcs([imp]); return;
  }
  if (b.id === "btnNpcExpAll") { downloadFile("npcs-hexatombe.txt", npcsParaArquivo(state.bestiario), "text/plain;charset=utf-8"); return; }
  if (b.id === "btnNpcModelo") { downloadFile("npc-modelo.txt", modeloNpc(), "text/plain;charset=utf-8"); return; }
  if (b.id === "btnNpcCola") { const t = document.getElementById("npcCola"); if (importarTextos([t.value])) t.value = ""; return; }
  if (b.id === "btnNpcImp") {
    const f = document.getElementById("npcArq");
    f.onchange = async () => { const files = [...f.files]; f.value = ""; if (!files.length) return; beginAction("Importar fichas"); importarTextos(await Promise.all(files.map((x) => x.text()))); endAction(); };
    f.click(); return;
  }
  if (d.bfadd) {
    const box = document.getElementById(`bf-${d.bfadd}-list`); if (!box) return;
    ui.bfDirty = true; box.insertAdjacentHTML("beforeend", { atq: bfAtqRow, ex: bfExRow, per: bfPerRow, hab: bfHabRow }[d.bfadd]());
    box.lastElementChild.querySelector("input,textarea")?.focus(); return;
  }
  if (d.bfdel !== undefined) { b.closest(".bf-row, .bf-hab")?.remove(); return; }
  if (d.bfroll) { bfRoll(b, d.bfroll); return; }
  if (b.id === "btnBestSave") {
    const c = bestFromForm(); if (!c) return;
    const i = state.bestiario.findIndex((x) => x.id === c.id);
    if (i >= 0) {
      const old = state.bestiario[i];
      const cheio = (at, mx) => at === "" || at === undefined || num(at) >= num(mx); // estava cheio: acompanha o novo máximo
      state.bestiario[i] = { ...old, ...c, pvAtual: cheio(old.pvAtual, old.pv) ? c.pv : Math.min(num(old.pvAtual), num(c.pv)), peAtual: cheio(old.peAtual, old.pe) ? c.pe : Math.min(num(old.peAtual), num(c.pe)) };
    }
    else state.bestiario.push({ ...c, pvAtual: c.pv, peAtual: c.pe });
    ui.bestEdit = null; ui.bfDirty = false; save(); toast(`${c.nome} salva no bestiário.`); return;
  }
  if (b.id === "btnBestCancel") { ui.bestEdit = null; ui.bfDirty = false; render(); return; }
  if (d.bestedit) { ui.bestEdit = d.bestedit; ui.bfDirty = false; render(); window.scrollTo(0, 0); return; }
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
  if (b.id === "btnSaveFile") {
    (async () => {
      const usadas = new Set((state.pistas || []).filter((p) => IMG.ehArq(p.img)).map((p) => IMG.arqId(p.img)));
      const todas = await IMG.todas(); const imagens = {}; for (const id of usadas) if (todas[id]) imagens[id] = todas[id];
      downloadFile(`hexatombe-dia${state.dia}.json`, JSON.stringify({ tipo: "hexatombe", at: Date.now(), state, imagens }), "application/json");
    })();
    return;
  }
  if (b.id === "btnLoadFile") {
    const f = document.getElementById("hxFile");
    f.onchange = async () => {
      const file = f.files[0]; f.value = ""; if (!file) return;
      try { const o = JSON.parse(await file.text()); if (o.tipo !== "hexatombe") throw 0;
        for (const [id, data] of Object.entries(o.imagens || {})) if (/^data:image\//.test(data)) await IMG.guardar(id, data);
        beginAction("Carregar arquivo"); state = normalize(o.state); save(); endAction(); toast("Estado do ritual carregado."); }
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
  if (isGM()) registrarCirco("dardos", mName(x.m), total, tiros.map((t) => t.total).join(" · "));
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
  if (isGM()) registrarCirco("soco", mName(x.m), pts, `${dano} de dano`);
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
  migrarRevela(s);
  out.bestiario = s.bestiario || []; out.revela = s.revela || {}; out.revelaV = s.revelaV || 2; out.pistas = s.pistas || []; out.conhece = s.conhece || {}; out.mortes = s.mortes || []; out.diarios = s.diarios || {}; out.oculto = s.oculto || {};
  out.areas = (s.areas || []).map((a) => ({ exp: [], buscas: [], fecha: 0, notas: "", ...a })); out.rel = s.rel || {};
  out.equipes = (s.equipes || d.equipes).map((t, i) => ({ ...d.equipes[i % 6], ...t, membros: t.membros || [], base: t.base || [], jornada: t.jornada || [] }));
  return out;
}
/* Equipe gerada no Escudo do Mestre */
function receberEquipe() {
  if (!isGM()) return;
  const p = lerPedido(); if (!p) return;
  apagarPedido();
  beginAction("Equipe do Escudo");
  const ti = aplicarPedido(state, p, lsAgenda());
  if (ti < 0) { endAction(); toast("Não há equipe livre para a equipe gerada."); return; }
  save(); endAction(); tab = "equipes"; render();
  toast(`${state.equipes[ti].nome} entrou como equipe ${ti + 1}. Os integrantes estão na aba NPCs.`);
}
window.addEventListener("storage", (e) => {
  if (e.key === IMPORT_KEY && e.newValue) receberEquipe();
  if (e.key === fichaKey()) softRender();
  if (!isGM() && e.key === lsState()) { try { const x = JSON.parse(e.newValue || "null"); if (x && num(x.rev) > num(state.rev)) { state = normalize(x); softRender(); } } catch { /* */ } }
});

/* =========================================================
   v2.5 — Arquivo: pistas e documentos, bestiário revelado
   aos poucos e placar do circo (todos veem; o mestre controla)
   ========================================================= */
const MEDALHAS = ["🥇", "🥈", "🥉"];
function bestEntradas() { return [...BESTIARIO.map((c) => ({ c, k: `l:${c.nome}`, livro: true })), ...state.bestiario.map((c) => ({ c, k: `c:${c.id}`, livro: false }))]; }
function revelaDe(k) { return revelaSt(state, k); }
function pistaVisivel(p) {
  if (isGM()) return true;
  if (!p.revelada) return false;
  if (!p.para || p.para === "todos" || !p.para.length) return true;
  const minhas = new Set(myTeams());
  return p.para.some((ti) => minhas.has(Number(ti)));
}
function paraTxt(p) {
  if (!p.para || p.para === "todos" || !p.para.length) return "todas as equipes";
  return p.para.map((ti) => state.equipes[ti]?.nome || "?").join(", ");
}
const ytOuImg = (u) => /^https?:\/\/\S+$/i.test(String(u || "").trim());

/* ---------- Pistas ---------- */
function abrirPista(p) {
  lsSet(NS + ":handout", JSON.stringify({ ...p, at: Date.now() }));
  if (obrOk) OBR.modal.open({ id: NS + "/handout", url: new URL("handout.html?v=2.11.1", location.href).href, width: 620, height: 760 });
  else window.open("handout.html", "_blank");
}
async function mostrarPistaParaTodos(p) {
  const msg = { kind: "handout", pista: { id: p.id, titulo: p.titulo, texto: p.texto, img: p.img, para: p.para } };
  abrirPista(p);
  if (!obrOk) return;
  if (IMG.ehArq(p.img)) { toast("Enviando a imagem para os jogadores…"); await enviarImagem(IMG.arqId(p.img)); }
  OBR.broadcast.sendMessage(CHANNEL, msg, { destination: "REMOTE" }).catch(() => toast("A pista é grande demais para enviar. Encurte o texto."));
}
/* ---------- Imagens enviadas do computador ---------- */
const enviando = new Map();
function enviarImagem(id) {
  if (!obrOk || !isGM()) return Promise.resolve(false);
  // só imagens de pistas reveladas saem do navegador do mestre
  if (!imgLiberada(state, id)) return Promise.resolve(false);
  if (enviando.has(id)) return enviando.get(id);
  const pr = (async () => { const data = await IMG.pegar(id); return data ? sendChunks({ kind: "img", id, data }, 12000) : false; })()
    .finally(() => setTimeout(() => enviando.delete(id), 4000));
  enviando.set(id, pr); return pr;
}
const pedidas = new Set();
async function imagensDaTela() {
  const falta = await IMG.preencher(app);
  if (isGM() || !obrOk) return;
  const novas = falta.filter((id) => !pedidas.has(id));
  if (!novas.length) return;
  novas.forEach((id) => pedidas.add(id));
  sendChunks({ kind: "pedeImg", ids: novas });
  setTimeout(() => novas.forEach((id) => pedidas.delete(id)), 30000); // pede de novo depois, se não chegar
}
async function arquivoParaPista(file) {
  const r = await IMG.lerArquivo(file);
  let id = null;
  if (r.data) { id = uid(); if (!(await IMG.guardar(id, r.data))) throw new Error("espaco"); }
  return { ...r, id };
}
function pistaForm(p) {
  p ||= { titulo: "", texto: "", img: "", para: "todos" };
  const todas = p.para === "todos" || !p.para?.length;
  return `<div class="pform">
    <label>Título <input id="pTit" value="${esc(p.titulo)}" placeholder="Carta encontrada no trailer"></label>
    <label>Texto <textarea id="pTxt" rows="5" placeholder="O que os jogadores leem…">${esc(p.texto)}</textarea></label>
    <div class="muted small">Imagem ou documento (opcional)</div>
    <div class="arqbox">
      <label class="btn">📁 Enviar do computador<input type="file" id="pArq" accept="${IMG.ACEITA}" hidden></label>
      <span class="muted small">imagem, PDF (até 4 páginas) ou .txt</span>
      <div id="pArqPrev">${arqPrevia(ui.pArq)}</div>
      <label class="small">ou um link <input id="pImg" value="${esc(IMG.ehArq(p.img) ? "" : p.img)}" placeholder="https://… .png ou .jpg"></label>
    </div>
    <div class="muted small">Quem pode ver:</div>
    <div class="pick"><label class="check"><input type="checkbox" id="pTodas" ${todas ? "checked" : ""}> Todas as equipes</label>
      ${state.equipes.map((t, i) => t.membros.length ? `<label class="check"><input type="checkbox" data-pteam="${i}" ${!todas && p.para.map(Number).includes(i) ? "checked" : ""}> ${esc(t.nome)}</label>` : "").join("")}</div>
    <div class="row"><button class="primary" data-ax="pSalvar">${ui.pEdit ? "Salvar pista" : "Criar pista"}</button>${ui.pEdit ? `<button class="ghost" data-ax="pCancelar">Cancelar</button>` : ""}</div>
  </div>`;
}
function arqPrevia(id) {
  return id ? `<div class="arqprev"><img data-arq="${esc(id)}" alt=""><button class="ghost small" data-ax="pArqTirar">✕ Tirar imagem</button></div>` : "";
}
function thumbPista(p) {
  if (IMG.ehArq(p.img)) return `<img class="pthumb" data-arq="${esc(IMG.arqId(p.img))}" alt="">`;
  return p.img && ytOuImg(p.img) ? `<img class="pthumb" src="${esc(p.img)}" alt="" loading="lazy">` : "";
}
function pistaCard(p) {
  const gm = isGM();
  return `<article class="card pista ${p.revelada ? "" : "escondida"}">
    <div class="ptop"><b>${esc(p.titulo || "Sem título")}</b>${gm ? `<span class="tag ${p.revelada ? "" : "muted"}">${p.revelada ? "revelada" : "escondida"}</span>` : ""}</div>
    ${thumbPista(p)}
    ${p.texto ? `<p class="ptxt">${esc(p.texto.length > 220 ? p.texto.slice(0, 220) + "…" : p.texto)}</p>` : ""}
    ${gm ? `<p class="muted small">Para: ${esc(paraTxt(p))}</p>` : ""}
    <div class="row">${`<button data-ax="pAbrir" data-id="${p.id}">🔍 Ler</button>`}
      ${gm ? `<button data-ax="pRevelar" data-id="${p.id}">${p.revelada ? "🙈 Esconder" : "👁 Revelar"}</button>
        <button class="primary" data-ax="pMostrar" data-id="${p.id}" title="Revela e abre a pista na tela de quem pode vê-la">📣 Mostrar na tela</button>
        <button class="ghost" data-ax="pEditar" data-id="${p.id}">Editar</button><button class="ghost danger" data-ax="pApagar" data-id="${p.id}">Apagar</button>` : ""}</div>
  </article>`;
}

/* ---------- Bestiário revelado (v2.8) ---------- */
const VISTO = () => NS + ":visto:" + roomId; // o que esta pessoa já viu, para animar o que é novo
function vistos() { try { return JSON.parse(lsGet(VISTO()) || "{}"); } catch { return {}; } }
function silhueta(r, c) {
  const tipo = String(c.tipo || "").toLowerCase();
  if (r.img) return IMG.ehArq(r.img) ? `<img class="bimg" data-arq="${esc(IMG.arqId(r.img))}" alt="">` : `<img class="bimg" src="${esc(r.img)}" alt="" loading="lazy">`;
  // sem imagem: um vulto genérico, com olhos
  const forma = /animal|arara|jaguatirica|cachorro|tigre|cavalo|macaco|corvo/.test(tipo)
    ? `<path d="M18 70c4-18 20-30 38-30 10 0 16-8 26-8 8 0 12 6 12 12 0 8-6 10-6 18 0 10 8 12 8 22H72c0-6-4-10-10-10s-8 4-8 10H30c0-8-8-8-12-14Z"/>`
    : `<path d="M50 14c-12 0-20 10-20 22 0 8 4 14 8 18-12 4-20 14-22 30h68c-2-16-10-26-22-30 4-4 8-10 8-18 0-12-8-22-20-22Z"/>`;
  return `<svg class="bimg vulto" viewBox="0 0 100 100" aria-hidden="true"><g fill="#050304">${forma}</g><circle cx="44" cy="33" r="2.6" fill="#ff2a48"/><circle cx="57" cy="33" r="2.6" fill="#ff2a48"/></svg>`;
}
function valorCampo(c, k) {
  if (k === "atq") return (c.atq || []).length ? `<ul class="plain small">${c.atq.map((a) => `<li><b>${esc(a[0])}</b> ${esc(a[1])} · ${esc(a[2])} ${esc(a[3] || "")}</li>`).join("")}</ul>` : "";
  if (k === "hab") return (c.hab || []).length ? `<ul class="plain small">${c.hab.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : "";
  return c[k] !== undefined && c[k] !== "" ? esc(c[k]) : "";
}
function bestRevelado(e, n, novo = false) {
  const c = e.c; const r = revelaDe(e.k);
  const visto = num(vistos()[e.k]);
  const anima = novo || n > visto;
  if (n === 1) {
    return `<article class="card beast revela n1 ${anima ? "novo" : ""}" data-bk="${esc(e.k)}">
      <div class="bfoto silh">${silhueta(r, c)}</div>
      <div class="bcab"><b class="bnome">???</b><span class="tag muted">pressentida</span></div>
      ${r.rumor ? `<p class="bnota">“${esc(r.rumor)}”</p>` : `<p class="muted">Algo está lá fora. Ninguém sabe o quê.</p>`}
      ${pesqHTML(e, r)}</article>`;
  }
  const campos = CAMPOS.filter(([k]) => valorCampo(c, k) || !sabe(r, k));
  const linhas = campos.map(([k, rot, nv]) => sabe(r, k)
    ? `<div class="bc ${k === "atq" || k === "hab" ? "largo" : ""}"><span>${rot}</span>${valorCampo(c, k) || "—"}</div>`
    : `<div class="bc tranca ${k === "atq" || k === "hab" ? "largo" : ""}" title="Descubra ${nv === 3 ? "estudando" : "dissecando"} a criatura"><span>${rot}</span><i aria-label="desconhecido">▒▒▒▒▒</i></div>`).join("");
  return `<details class="card beast revela n${n} ${anima ? "novo" : ""}" data-bk="${esc(e.k)}" ${ui.bAberta === e.k || anima ? "open" : ""}><summary><b>${esc(c.nome)}</b> <span class="muted">${esc(c.tipo || "")} · ${NIVEL_CURTO[n]}</span></summary>
    <div class="bfoto">${silhueta(r, c)}</div>
    ${r.nota ? `<p class="bnota">${esc(r.nota)}</p>` : ""}
    <div class="bcampos">${linhas}</div>
    ${n < 4 ? `<p class="muted small">${n === 2 ? "Ainda não sabem como enfrentá-la." : "Os números exatos ainda são um mistério."}</p>` : ""}
    ${pesqHTML(e, r)}
  </details>`;
}
function pesqHTML(e, r) {
  if (!r.pesq || r.n < 1 || r.n >= PESQ_MAX) return "";
  if (isGM()) return `<p class="muted small">🔍 Pesquisa aberta: Ocultismo DT ${r.dt}.</p>`;
  const meus = myMemberIds(); if (!meus.length) return "";
  const tentou = r.tent[`${me.id}:${r.n}`] !== undefined;
  return `<div class="row bpesq">${tentou ? `<span class="muted small">Você já pesquisou esta criatura neste nível (${num(r.tent[`${me.id}:${r.n}`])}).</span>`
    : `<button data-ax="bPesq" data-k="${esc(e.k)}" title="Rola Ocultismo pela sua ficha">🔍 Pesquisar (Ocultismo DT ${r.dt})</button>`}</div>`;
}
function bestControle(e) {
  const r = revelaDe(e.k); const c = e.c; const k = esc(e.k);
  const tent = Object.entries(r.tent);
  return `<div class="bctl" data-bk="${k}"><div class="row between"><b>${esc(c.nome)}</b><span class="muted small">${e.livro ? "livro" : "do mestre"} · ${NIVEL_CURTO[r.n]}</span></div>
    <div class="row"><select data-revela="${k}">${NIVEIS.map(([v, l]) => `<option value="${v}" ${String(r.n) === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>
    <input data-rrumor="${k}" value="${esc(r.rumor)}" placeholder="Rumor (o que aparece na silhueta: “algo arrasta correntes perto do lago”)">
    <input data-rnota="${k}" value="${esc(r.nota)}" placeholder="Descrição quando avistada (o que viram)">
    <div class="row bimgctl">${r.img ? `<span class="mini">${silhueta(r, c)}</span><button class="ghost small" data-ax="bImgTirar" data-k="${k}">✕ Tirar imagem</button>`
      : `<label class="btn small">🖼 Imagem do computador<input type="file" data-bimgarq="${k}" accept="image/*" hidden></label><input data-bimgurl="${k}" placeholder="ou link https://… .png" style="flex:1">`}</div>
    <details class="small" data-keep="bx_${k}" ${ui["bx_" + e.k] ? "open" : ""}><summary>Revelar só uma parte</summary><div class="bextra">${CAMPOS.filter(([f]) => valorCampo(c, f)).map(([f, rot, nv]) => `<label class="check"><input type="checkbox" data-bextra="${k}" data-f="${f}" ${r.extra.includes(f) ? "checked" : ""} ${r.n >= nv ? "disabled" : ""}> ${rot}${r.n >= nv ? " (já revelado)" : ""}</label>`).join("") || `<span class="muted">Sem dados para revelar.</span>`}</div></details>
    <div class="row"><label class="check"><input type="checkbox" data-bpesq="${k}" ${r.pesq ? "checked" : ""}> Jogadores podem pesquisar</label>
      <label class="inline small">DT <input type="number" data-bdt="${k}" value="${r.dt}" min="5" max="40" style="width:60px"></label></div>
    ${tent.length ? `<div class="muted small">Tentativas: ${tent.map(([q, v]) => `${esc(nomeJogador(q.split(":")[0]))} (${NIVEL_CURTO[num(q.split(":")[1])]}) ${num(v)}`).join(" · ")} <button class="ghost small" data-ax="bTentZerar" data-k="${k}">zerar</button></div>` : ""}
  </div>`;
}
function nomeJogador(pid) { const x = allMembers().find((y) => y.m.ownerId === pid); return x ? mName(x.m) : "jogador"; }
function marcarVistos() {
  const v = vistos(); let mudou = false;
  for (const e of bestEntradas()) { const n = revelaDe(e.k).n; if (num(v[e.k]) !== n) { v[e.k] = n; mudou = true; } }
  if (mudou) lsSet(VISTO(), JSON.stringify(v));
}
function pesquisar(k) {
  const mid = myMemberIds().find((id) => { const x = findM(id); return x?.m.vivo !== false && x?.m.sheetId && getSheet(x.m.sheetId); }) || myMemberIds()[0];
  const x = mid && findM(mid); if (!x) return toast("Você precisa estar numa equipe com a sua ficha para pesquisar.");
  const r = revelaDe(k); if (!r.pesq) return toast("O mestre fechou a pesquisa desta criatura.");
  const t = memberTest(mid, "Ocultismo"); if (!t) return;
  const nome = mName(x.m);
  if (obrOk) OBR.broadcast.sendMessage(CHANNEL, { kind: "pesquisa", k, pid: me.id, nome, total: t.total, txt: t.txt }).catch(() => {});
  toast(`🔍 Ocultismo: ${t.txt}. O mestre recebe o resultado.`);
  // marca a tentativa aqui também, para o botão sumir na hora
  ((state.revela[k] ||= { n: r.n }).tent ||= {})[`${me.id}:${r.n}`] = t.total; softRender();
}
function receberPesquisa(d) {
  if (!isGM()) return;
  beginAction("Pesquisa no bestiário");
  const res = aplicarPesquisa(state, d);
  if (!res) { endAction(); return; }
  save(true); endAction(); softRender();
  announce(res.texto);
  if (res.ok) somRevela();
}
/* ---------- Quadro de investigação (janela própria: quadro.html) ---------- */
function quadroResumo() {
  try { const q = JSON.parse(lsGet(`${NS}:quadro:${roomId}`) || "null"); return q ? [Object.values(q.cards || {}).filter((c) => !c.del).length, Object.values(q.fios || {}).filter((f) => !f.del).length] : [0, 0]; } catch { return [0, 0]; }
}
function quadroAba() {
  const [nc, nf] = quadroResumo();
  return `<section class="card quadro-chamada"><h3>🧷 Quadro de investigação</h3>
    <p>Um quadro de cortiça que a mesa toda vê e mexe ao mesmo tempo: prendam pistas do Arquivo, criaturas do Bestiário, suspeitos e anotações, e liguem tudo com barbante.</p>
    <p class="muted">${nc ? `${nc} cartão(ões) e ${nf} barbante(s) no quadro.` : "O quadro ainda está vazio."}</p>
    <div class="row"><button class="primary" data-ax="qAbrir">🧷 Abrir o quadro</button></div>
    <p class="muted small">Dicas: arraste os cartões; 🧶 liga dois cartões (clique num barbante para escrever o que liga os dois ou cortar); duas vezes numa nota para editar; Ctrl + roda do mouse para aproximar. Barbante preto é para suspeita.</p></section>`;
}
function abrirQuadro() {
  const url = new URL("quadro.html?v=2.11.1", location.href).href;
  if (obrOk) OBR.modal.open({ id: NS + "/quadro", url, fullScreen: true });
  else window.open(url + (isGM() ? "&gm" : ""), "_blank");
}
let vistoTimer;
function somRevela() { if (obrOk) OBR.broadcast.sendMessage("io.github.pebarrosdenashor.mestre-hx/msg", { kind: "som", k: "revela" }, { destination: "ALL" }).catch(() => {}); }

/* ---------- Placar do circo ---------- */
const JOGOS = { dardos: ["🎯", "Acerte os dardos", " pts"], soco: ["👊", "Máquina de soco", ""] };
function registrarCirco(jogo, nome, pts, det = "") {
  if (!isGM()) return false;
  state.circo[jogo] ||= []; state.circo.hist ||= [];
  const lista = state.circo[jogo]; const recordeAntes = Math.max(0, ...lista.map((r) => num(r.pts)));
  const meu = lista.find((r) => r.nome === nome);
  if (!meu) lista.push({ nome, pts }); else if (pts > num(meu.pts)) meu.pts = pts;
  state.circo.hist.unshift({ jogo, nome, pts, det, dia: state.dia, at: Date.now() }); state.circo.hist = state.circo.hist.slice(0, 40);
  save(true); softRender();
  return pts > recordeAntes && lista.length > 1;
}
function placar(jogo) {
  const [ic, nome, un] = JOGOS[jogo]; const arr = [...(state.circo[jogo] || [])].sort((a, b) => num(b.pts) - num(a.pts));
  return `<div class="placar"><div class="ph">${ic} ${nome}</div>${arr.length ? `<ol class="podio">${arr.map((r, i) => `<li class="${i < 3 ? "top" : ""}"><span class="med">${MEDALHAS[i] || `${i + 1}º`}</span> ${esc(r.nome)} <b>${num(r.pts)}${un}</b></li>`).join("")}</ol>` : `<p class="muted small">Ninguém jogou ainda.</p>`}</div>`;
}
function circoJogar() {
  const mine = isGM() ? (() => true) : ((m) => myMemberIds().includes(m.id));
  return `<div class="row"><select id="cxMem">${memberOptions((m) => m.vivo && mine(m))}</select><input type="number" id="cxBon" placeholder="bônus" style="max-width:80px"></div>
    <div class="row"><button class="primary" data-ax="cxDardos">🎯 Dardos</button><button class="primary" data-ax="cxSoco">👊 Soco</button>
    <select id="cxTipo" style="max-width:120px"><option value="pv">Soco descuidado (PV)</option><option value="pd">Soco intenso (PE)</option></select>
    <input type="number" id="cxGasto" min="0" step="2" value="0" title="PV ou PE gastos no soco" style="max-width:70px"></div>`;
}

/* ---------- Aba ---------- */
function tabArquivo() {
  const gm = isGM(); ui.arq ||= "pistas";
  const pistas = (state.pistas || []).filter(pistaVisivel);
  const ent = bestEntradas(); const vistas = ent.filter((e) => revelaDe(e.k).n > 0).sort((x, y) => revelaDe(y.k).n - revelaDe(x.k).n || x.c.nome.localeCompare(y.c.nome));
  const hist = state.circo.hist || [];
  const sub = [["pistas", `📜 Pistas${pistas.length ? ` (${pistas.length})` : ""}`], ["quadro", "🧷 Quadro"], ["bestiario", `🐾 Bestiário${vistas.length ? ` (${vistas.length})` : ""}`], ["circo", "🎪 Circo"]];
  let body = "";
  if (ui.arq === "pistas") {
    body = `${gm ? `<details class="card" data-keep="pNova" ${ui.pEdit || ui.pNova ? "open" : ""}><summary><b>${ui.pEdit ? "Editando pista" : "＋ Nova pista ou documento"}</b></summary>${pistaForm(ui.pEdit ? state.pistas.find((p) => p.id === ui.pEdit) : null)}</details>
      <div class="row wrap"><button data-ax="pVarias" title="Cada arquivo vira uma pista escondida, com o nome do arquivo como título">📂 Várias pistas de uma vez</button><input type="file" id="pVariasIn" accept="${IMG.ACEITA}" multiple hidden></div>
      <p class="muted">Pistas escondidas só você vê. “Mostrar na tela” revela e abre a pista na tela dos jogadores da equipe escolhida. Imagens do computador ficam guardadas neste navegador e só vão para os jogadores quando a pista é revelada.</p>` : `<p class="muted">Documentos, cartas e fotos que o grupo encontrou.</p>`}
      ${pistas.length ? pistas.map(pistaCard).join("") : `<section class="card"><p class="muted">${gm ? "Nenhuma pista criada." : "Nenhuma pista encontrada ainda."}</p></section>`}`;
  } else if (ui.arq === "bestiario") {
    body = `${gm ? `<details class="card" data-keep="bctlOpen" ${ui.bctlOpen ? "open" : ""}><summary><b>O que os jogadores sabem</b> <span class="muted">${vistas.length}/${ent.length}</span></summary>
        <p class="muted small">Avance o nível conforme o grupo descobre: pressentida mostra só a silhueta e o rumor; cada nível destrava mais campos. Dá para revelar uma parte antes (ex.: a fraqueza que um livro contou) e deixar os jogadores pesquisarem com Ocultismo (sobe até “estudada”; dissecar é com você).</p>
        <input id="bBusca" placeholder="🔍 Buscar criatura…" value="${esc(ui.bBusca || "")}">${ent.filter((e) => !ui.bBusca || e.c.nome.toLowerCase().includes(ui.bBusca.toLowerCase())).map(bestControle).join("")}</details>
      <div class="section-title">Como os jogadores veem</div>` : `<p class="muted">O que o grupo sabe sobre as ameaças do Hexatombe. Campos com ▒▒▒ ainda são um mistério.</p>`}
      ${vistas.length ? vistas.map((e) => bestRevelado(e, revelaDe(e.k).n)).join("") : `<section class="card"><p class="muted">Nenhuma criatura registrada ainda.</p></section>`}`;
  } else if (ui.arq === "quadro") {
    body = quadroAba();
  } else {
    body = `<section class="card"><h3>Placar</h3><div class="placares">${placar("dardos")}${placar("soco")}</div>
        ${gm ? `<div class="row"><button class="ghost" data-ax="cxZerar">Zerar placar</button></div>` : ""}</section>
      <section class="card"><h3>Jogar</h3>${circoJogar()}
        <p class="muted small">Dardos: três testes de Pontaria (DT 10 = 5 pts · 15 = 10 · 20 = 15 · 25 = 25 · 30 = 50). Soco: 1d3 + FOR, +2 a cada 2 PV/PE gastos; pontos = dano × 100.</p></section>
      <section class="card"><h3>Últimas jogadas</h3>${hist.length ? `<ol class="hist">${hist.slice(0, 15).map((h) => `<li><span class="muted small">Dia ${num(h.dia)}</span> ${JOGOS[h.jogo]?.[0] || ""} <b>${esc(h.nome)}</b> — ${num(h.pts)} pts${h.det ? ` <span class="muted small">(${esc(h.det)})</span>` : ""}</li>`).join("")}</ol>` : `<p class="muted small">Nenhuma jogada ainda.</p>`}</section>`;
  }
  return `<nav class="seg arq">${sub.map(([k, l]) => `<button data-ax="arq" data-k="${k}" class="${ui.arq === k ? "on" : ""}">${l}</button>`).join("")}</nav>${body}`;
}

/* ---------- Ações ---------- */
function pistaDoForm() {
  const titulo = val("pTit").trim(); const texto = val("pTxt").trim(); const img = ui.pArq ? `arq:${ui.pArq}` : val("pImg").trim();
  if (!titulo && !texto && !img) { toast("Escreva o título, o texto ou ponha uma imagem."); return null; }
  if (img && !IMG.ehArq(img) && !ytOuImg(img)) { toast("A imagem precisa ser um link começando com https://"); return null; }
  if (texto.length > 4000) { toast("Texto muito longo (máx. 4000 caracteres)."); return null; }
  const todas = document.getElementById("pTodas")?.checked;
  const para = todas ? "todos" : [...document.querySelectorAll("[data-pteam]:checked")].map((x) => Number(x.dataset.pteam));
  return { titulo, texto, img, para: Array.isArray(para) && !para.length ? "todos" : para };
}
function jogarCirco(jogo) {
  const x = findM(val("cxMem")); if (!x) return toast("Escolha quem joga.");
  if (!isGM() && !myMemberIds().includes(x.m.id)) return toast("Você só joga com o seu personagem.");
  let pts, det, texto;
  if (jogo === "dardos") {
    const p = (v) => (v >= 30 ? 50 : v >= 25 ? 25 : v >= 20 ? 15 : v >= 15 ? 10 : v >= 10 ? 5 : 0);
    const tiros = [0, 1, 2].map(() => memberTest(x.m.id, "Pontaria", num(val("cxBon"))));
    pts = tiros.reduce((s, t) => s + p(t.total), 0); det = tiros.map((t) => t.total).join(" · ");
    texto = `🎯 ${mName(x.m)} nos dardos: ${tiros.map((t) => `${t.total} (${p(t.total)})`).join(" · ")} = ${pts} pontos`;
  } else {
    const tipo = val("cxTipo"); let gasto = Math.max(0, Math.floor(num(val("cxGasto")) / 2) * 2);
    const s = x.m.sheetId && getSheet(x.m.sheetId); const forca = s ? clamp(num(s.attrs?.FOR), 0, 5) : 0;
    if (s) {
      const lim = Math.round(num(s.nex) / 5) + num(s.pdBonus);
      if (gasto > lim) { gasto = Math.floor(lim / 2) * 2; toast(`Gasto limitado ao limite de PE por rodada (${lim}).`); }
      if (gasto && canEditSheet(s.id)) applySheet(s.id, (s) => { if (tipo === "pv") s.pv.atual = num(s.pv.atual) - gasto; else s.pd.atual = num(s.pd.atual) - gasto; });
    }
    const r = rollExpr("1d3"); const dano = Math.max(1, r.total + forca + gasto); pts = dano * 100; det = `${dano} de dano`;
    texto = `👊 ${mName(x.m)} soca a máquina: 1d3[${r.total}] ${fmt(forca)}${gasto ? ` +${gasto}` : ""} = ${dano} de dano → ${pts} pontos${dano >= 18 ? " — A MÁQUINA QUEBROU!" : ""}`;
  }
  const nome = mName(x.m);
  if (isGM()) { if (registrarCirco(jogo, nome, pts, det)) texto += " 🏆 NOVO RECORDE!"; }
  else if (obrOk) OBR.broadcast.sendMessage(CHANNEL, { kind: "circo", jogo, nome, pts, det }).catch(() => {});
  announce(texto);
}
function onArquivoClick(e) {
  const b = e.target.closest("[data-ax]"); if (!b) return;
  const a = b.dataset.ax; const id = b.dataset.id;
  const p = id ? (state.pistas || []).find((x) => x.id === id) : null;
  switch (a) {
    case "arq": ui.arq = b.dataset.k; ui.pEdit = null; return render();
    case "pAbrir": if (p) abrirPista(p); return;
    case "cxDardos": return jogarCirco("dardos");
    case "cxSoco": return jogarCirco("soco");
    case "bPesq": return pesquisar(b.dataset.k);
    case "qAbrir": return abrirQuadro();
  }
  if (!isGM()) return;
  switch (a) {
    case "pSalvar": {
      const novo = pistaDoForm(); if (!novo) return;
      state.pistas ||= [];
      if (ui.pEdit) { const old = state.pistas.find((x) => x.id === ui.pEdit); Object.assign(old, novo); ui.pEdit = null; }
      else state.pistas.unshift({ id: uid(), ...novo, revelada: false, at: Date.now() });
      ui.pNova = false; ui.pArq = null; save(); toast("Pista salva (ainda escondida)."); return;
    }
    case "pCancelar": ui.pEdit = null; ui.pArq = null; return render();
    case "pEditar": ui.pEdit = id; ui.pArq = IMG.ehArq(p?.img) ? IMG.arqId(p.img) : null; return render();
    case "pArqTirar": ui.pArq = null; document.getElementById("pArqPrev").innerHTML = ""; return;
    case "pVarias": document.getElementById("pVariasIn")?.click(); return;
    case "pApagar": {
      if (!b.classList.contains("confirm")) { b.classList.add("confirm"); b.textContent = "Confirmar?"; return; }
      state.pistas = state.pistas.filter((x) => x.id !== id);
      if (p && IMG.ehArq(p.img) && !state.pistas.some((x) => x.img === p.img)) IMG.apagar(IMG.arqId(p.img));
      save(); return;
    }
    case "pRevelar": {
      p.revelada = !p.revelada; save();
      if (p.revelada) { announce(`📜 Nova pista no Arquivo: ${p.titulo || "documento"}`); if (IMG.ehArq(p.img)) enviarImagem(IMG.arqId(p.img)); }
      return;
    }
    case "pMostrar": {
      if (!p.revelada) { p.revelada = true; save(); }
      mostrarPistaParaTodos(p); toast("Pista aberta na tela dos jogadores."); return;
    }
    case "bImgTirar": { const k = b.dataset.k; const r = state.revela[k]; if (r) { if (IMG.ehArq(r.img) && !(state.pistas || []).some((p) => p.img === r.img)) IMG.apagar(IMG.arqId(r.img)); r.img = ""; save(); } return; }
    case "bTentZerar": { const r = state.revela[b.dataset.k]; if (r) { r.tent = {}; save(); } return; }
    case "cxZerar": {
      if (!b.classList.contains("confirm")) { b.classList.add("confirm"); b.textContent = "Confirmar: zerar?"; return; }
      state.circo.dardos = []; state.circo.soco = []; state.circo.hist = []; save(); return;
    }
  }
}
async function onArquivoChange(e) {
  const el = e.target; if (!isGM()) return;
  if (el.id === "pArq") {
    const file = el.files?.[0]; el.value = ""; if (!file) return;
    const prev = document.getElementById("pArqPrev"); if (prev) prev.innerHTML = `<p class="muted small">Preparando ${esc(file.name)}…</p>`;
    try {
      const r = await arquivoParaPista(file);
      const tit = document.getElementById("pTit"); if (tit && !tit.value.trim()) tit.value = r.titulo;
      const txt = document.getElementById("pTxt"); if (txt && r.texto && !txt.value.trim()) txt.value = r.texto;
      if (r.id) { ui.pArq = r.id; const link = document.getElementById("pImg"); if (link) link.value = ""; }
      if (prev) { prev.innerHTML = arqPrevia(ui.pArq); IMG.preencher(prev); }
      if (r.aviso) toast(r.aviso);
    } catch (err) {
      if (prev) prev.innerHTML = arqPrevia(ui.pArq);
      toast(err?.message === "tipo" ? "Use uma imagem, um PDF ou um .txt." : err?.message === "espaco" ? "Sem espaço no navegador para guardar a imagem." : "Não deu para ler esse arquivo.");
    }
    return;
  }
  if (el.id === "pVariasIn") {
    const files = [...(el.files || [])]; el.value = ""; if (!files.length) return;
    toast(`Lendo ${files.length} arquivo(s)…`);
    let ok = 0; const falhas = [];
    state.pistas ||= [];
    for (const f of files.slice(0, 30)) {
      try { const r = await arquivoParaPista(f); state.pistas.unshift({ id: uid(), titulo: r.titulo, texto: r.texto || "", img: r.id ? `arq:${r.id}` : "", para: "todos", revelada: false, at: Date.now() }); ok++; }
      catch { falhas.push(f.name); }
    }
    save(); toast(`${ok} pista(s) criada(s), escondidas${falhas.length ? `. Não deu para ler: ${falhas.slice(0, 3).join(", ")}` : ""}.`); return;
  }
  const R = (k) => ((state.revela ||= {})[k] ||= { n: 0 });
  if (el.dataset.revela) {
    const k = el.dataset.revela; const n = num(el.value);
    const antes = revelaDe(k).n;
    R(k).n = n; save(true);
    const e2 = bestEntradas().find((x) => x.k === k);
    if (n > antes && e2) { announce(n === 1 ? `🐾 Bestiário: algo foi pressentido${revelaDe(k).rumor ? ` — “${revelaDe(k).rumor}”` : ""}` : `🐾 Bestiário: ${e2.c.nome} — ${NIVEL_CURTO[n]}`); somRevela(); }
    if (n >= 1 && IMG.ehArq(revelaDe(k).img)) enviarImagem(IMG.arqId(revelaDe(k).img));
    softRender(); return;
  }
  if (el.dataset.rnota) { R(el.dataset.rnota).nota = el.value.slice(0, 600); save(true); return; }
  if (el.dataset.rrumor) { R(el.dataset.rrumor).rumor = el.value.slice(0, 300); save(true); return; }
  if (el.dataset.bpesq) { R(el.dataset.bpesq).pesq = el.checked; save(true); if (el.checked && revelaDe(el.dataset.bpesq).n >= 1) announce("🔍 Uma criatura do Bestiário pode ser pesquisada (aba Arquivo)."); softRender(); return; }
  if (el.dataset.bdt) { R(el.dataset.bdt).dt = Math.max(5, Math.min(40, num(el.value) || 20)); save(true); return; }
  if (el.dataset.bextra) {
    const r = R(el.dataset.bextra); const f = el.dataset.f; const set = new Set(r.extra || []);
    if (el.checked) set.add(f); else set.delete(f);
    r.extra = [...set]; save(true);
    const e2 = bestEntradas().find((x) => x.k === el.dataset.bextra);
    if (el.checked && r.n >= 2 && e2) { announce(`🐾 Bestiário: descobriram ${(CAMPOS.find(([x]) => x === f) || [, f])[1].toLowerCase()} de ${e2.c.nome}.`); somRevela(); }
    softRender(); return;
  }
  if (el.dataset.bimgurl) {
    const u = el.value.trim(); if (!u) return;
    if (!/^https:\/\/\S+$/i.test(u)) return toast("O link precisa começar com https://");
    R(el.dataset.bimgurl).img = u; save(); return;
  }
  if (el.dataset.bimgarq) {
    const k = el.dataset.bimgarq; const file = el.files?.[0]; el.value = ""; if (!file) return;
    try {
      const r = await IMG.lerArquivo(file); if (!r.data) return toast("Use uma imagem.");
      const id = uid(); if (!(await IMG.guardar(id, r.data))) return toast("Sem espaço no navegador para guardar a imagem.");
      R(k).img = `arq:${id}`; save();
      if (revelaDe(k).n >= 1) enviarImagem(id);
    } catch { toast("Não deu para ler essa imagem."); }
    return;
  }
}
app.addEventListener("click", wrapGM(onArquivoClick));
app.addEventListener("toggle", (e) => { const k = e.target.dataset?.keep; if (k) ui[k] = e.target.open; }, true);
app.addEventListener("change", onArquivoChange);
app.addEventListener("input", (e) => {
  if (e.target.id !== "bBusca") return;
  ui.bBusca = e.target.value; const pos = e.target.selectionStart;
  render(); const el = document.getElementById("bBusca"); if (el) { el.focus(); el.setSelectionRange(pos, pos); }
});
app.addEventListener("toggle", (e) => { const d = e.target; if (d.matches?.("details.beast[data-bk]")) ui.bAberta = d.open ? d.dataset.bk : (ui.bAberta === d.dataset.bk ? null : ui.bAberta); }, true);

async function start() {
  if (OBR.isAvailable) {
    OBR.onReady(async () => {
      obrOk = true; roomId = OBR.room.id;
      [role, me.id, me.name] = await Promise.all([OBR.player.getRole(), OBR.player.getId(), OBR.player.getName()]);
      PM.atualizar();
      loadLocal();
      let local = null; try { local = JSON.parse(lsGet(lsState()) || "null"); } catch { /* */ }
      let sala = null; try { sala = (await OBR.room.getMetadata())[STATE_KEY]; } catch { /* */ }
      const best = (role === "GM" && local?.equipes) ? local : [local, sala].filter((x) => x && x.equipes).sort((a, b) => num(b.rev) - num(a.rev))[0];
      state = normalize(best);
      render();
      OBR.broadcast.onMessage(SYNC, (ev) => onSyncChunk(ev.data));
      OBR.room.onMetadataChange((md) => { const x = md[STATE_KEY]; if (!isGM() && x?.equipes && num(x.rev) > num(state.rev)) { state = normalize(x); softRender(); } });
      OBR.broadcast.onMessage(CHANNEL, (ev) => {
        if (ev.data?.kind === "desejo") { if (isGM()) { guardarDesejo(ev.data.desejo); softRender(); } return; }
        if (ev.data?.kind === "circo") { const d = ev.data; if (isGM() && JOGOS[d.jogo]) { beginAction("Jogo do circo"); if (registrarCirco(d.jogo, String(d.nome || "?").slice(0, 60), Math.max(0, num(d.pts)), String(d.det || "").slice(0, 60))) announce(`🏆 ${d.nome} bateu o recorde de ${JOGOS[d.jogo][1].toLowerCase()}!`); endAction(); } return; }
        if (ev.data?.kind === "handout") return; // quem abre a pista é o background
        if (ev.data?.kind === "pesquisa") { receberPesquisa(ev.data); return; }
        const text = ev.data?.text; if (!text) return;
        OBR.notification.show(text.split("\n")[0]);
        rollLog.unshift({ at: Date.now(), text }); rollLog = rollLog.slice(0, 40); lsSet(NS + ":log:" + roomId, JSON.stringify(rollLog)); softRender();
      });
      OBR.player.onChange((p) => { if (p.role !== role) { role = p.role; PM.atualizar(); render(); } });
      sceneOk = await OBR.scene.isReady(); OBR.scene.onReadyChange((r) => { sceneOk = r; });
      if (isGM()) { fillOwners(); if (!lsGet(lsState())) lsSet(lsState(), JSON.stringify(state)); receberEquipe(); broadcastState(); } else sendChunks({ kind: "hello" });
    });
  } else {
    if (new URLSearchParams(location.search).has("gm")) role = "GM";
    PM.atualizar();
    me = { id: "local", name: "Teste" }; loadLocal();
    try { state = normalize(JSON.parse(lsGet(lsState()) || "null")); } catch { /* */ }
    render();
  }
}
start();

// NPCs: sub-abas, filtro por equipe e busca (sem passar pelo histórico de ações)
app.addEventListener("click", (e) => {
  const b = e.target.closest?.("button[data-npcsub], button[data-npcfil]"); if (!b) return;
  e.stopImmediatePropagation();
  if (b.dataset.npcfil) { ui.npcFil = b.dataset.npcfil; render(); return; }
  const [id, k] = b.dataset.npcsub.split("|"); (ui.npcSub ||= {})[id] = k; ui.npcOpen = id;
  const box = b.closest(".npc-body");
  box.querySelectorAll(".npc-subtabs button").forEach((x) => x.classList.toggle("on", x === b));
  box.querySelectorAll(".npc-pane").forEach((p) => { p.hidden = p.dataset.pane !== k; });
}, true);
app.addEventListener("input", (e) => {
  const el = e.target;
  if (el.id === "npcBusca") {
    ui.npcBusca = el.value; const q = el.value.toLowerCase().trim();
    app.querySelectorAll("details.npc[data-nome]").forEach((d) => { d.hidden = !!q && !d.dataset.nome.includes(q); });
    app.querySelectorAll(".npc-grupo").forEach((g) => { g.hidden = !g.querySelector("details.npc:not([hidden])"); });
    return;
  }
  const k = el.dataset?.npc; if (!k || !/\|(pv|pe)(Atual)?$/.test(k)) return; // barra de PV/PE acompanha a digitação
  const v = el.closest(".vital"); if (!v) return; const [a, m] = v.querySelectorAll("input");
  const p = num(m.value) > 0 ? clamp(Math.round(100 * num(a.value) / num(m.value)), 0, 100) : 0; v.querySelector(".vbar i").style.width = p + "%";
});

// Mantém aberto o cartão do NPC que o mestre está usando
app.addEventListener("toggle", (e) => {
  const d = e.target; if (!d.dataset?.npcbox) return;
  if (d.open) ui.npcOpen = d.dataset.npcbox; else if (ui.npcOpen === d.dataset.npcbox) ui.npcOpen = null;
}, true);

/* =========================================================
   v2.4 — Equipes NPC agindo sozinhas (com aprovação do mestre)
   ========================================================= */
const NPC_ACOES = [
  ["coleta", "Coleta"], ["construir", "Construir melhoria"], ["descanso", "Descanso na base"], ["ataque", "Ataque a outra equipe"],
  ["cacada", "Caçada a um sacrifício"], ["sabotagem", "Roubo de recursos"], ["alianca", "Diplomacia"], ["espreita", "Espionar os jogadores"],
];
let quietDice = false;
function qTest(mid, per, extra = 0) { quietDice = true; try { return memberTest(mid, per, extra); } finally { quietDice = false; } }
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
function npcVivos(ti) { return state.equipes[ti].membros.filter((m) => m.vivo); }
function npcInfo(m) { const n = m.npcId && npcGet(m.npcId); if (n) npcPv(n); return n; }
function temPv(n) { return n && num(n.pv) > 0; }
function feridos(ti) { return npcVivos(ti).filter((m) => { const n = npcInfo(m); return temPv(n) && num(n.pvAtual) < num(n.pv); }); }
function melhorParaConstruir(t) {
  if (!t.base.includes("limpeza") && melGet("limpeza")) return melGet("limpeza");
  return state.melhorias.filter((m) => !t.base.includes(m.k) && !m.req && num(m.custo) <= t.sucata && !melBloqueada(t, m)).sort((a, b) => num(b.agua || b.comida) - num(a.agua || a.comida))[0] || null;
}
function sacrificiosVivos(excluir) { return aliveMembers().filter((x) => x.m.sac && x.ti !== excluir); }
function escolherAcao(ti) {
  const t = state.equipes[ti]; const vivos = npcVivos(ti);
  const w = { coleta: 3, construir: 0, descanso: 1, ataque: 1, cacada: 0, sabotagem: 1, alianca: 1, espreita: 0.6 };
  if (t.agua + t.comida < vivos.length * 2) w.coleta += 4;
  if (melhorParaConstruir(t) && (melhorParaConstruir(t).k === "limpeza" || t.sucata >= 1)) w.construir = 3;
  if (feridos(ti).length) w.descanso += 2 * feridos(ti).length;
  const hostis = state.equipes.map((_, j) => j).filter((j) => j !== ti && npcVivos(j).length && ["Hostil", "Desconfiada"].includes(relDe(ti, j)));
  w.ataque += hostis.length * 1.5;
  if (state.fase === 2 && !sacrificiosHoje().length && sacrificiosVivos(ti).length) w.cacada = 6;
  const tot = Object.values(w).reduce((a, b) => a + b, 0); let r = Math.random() * tot;
  for (const [k, v] of Object.entries(w)) { r -= v; if (r <= 0) return k; }
  return "coleta";
}
function alvoEquipe(ti, preferirHostil = true, incluirJogadores = false) {
  const cands = state.equipes.map((_, j) => j).filter((j) => j !== ti && npcVivos(j).length && (incluirJogadores || j !== 0));
  if (!cands.length) return null;
  const hostis = cands.filter((j) => ["Hostil", "Desconfiada"].includes(relDe(ti, j)));
  return preferirHostil && hostis.length && Math.random() < 0.7 ? pick(hostis) : pick(cands);
}
function lutar(atkMid, defMid, efeitos, linhas, diurna, letalSac) {
  const a = qTest(atkMid, "Luta"), d = qTest(defMid, "Luta");
  const A = findM(atkMid), D = findM(defMid);
  linhas.push(`${a.nome} (Luta ${a.total}) × ${d.nome} (Luta ${d.total})`);
  const [ven, per] = a.total >= d.total ? [A, D] : [D, A];
  const n = npcInfo(per.m);
  if (temPv(n)) {
    const dano = rollExpr("2d8+4").total;
    const resta = num(n.pvAtual) - dano;
    efeitos.push({ k: "dano", mid: per.m.id, v: dano });
    linhas.push(`→ ${mName(ven.m)} vence e causa ${dano} de dano em ${mName(per.m)} (PV ${num(n.pvAtual)} → ${resta}).`);
    if (resta <= 0) { efeitos.push({ k: "morte", vid: per.m.id, kid: ven.m.id, diurna }); linhas.push(`☠ ${mName(per.m)} morre${per.m.sac ? ` — era o sacrifício (${per.m.sac})` : ""}.`); }
  } else {
    const r = die(6); const mata = r >= (letalSac && per.m.sac ? 4 : 6);
    linhas.push(`→ ${mName(ven.m)} vence${mata ? ` e mata ${mName(per.m)}` : `; ${mName(per.m)} sai ferido`} (d6 = ${r}, sem PV na ficha).`);
    if (mata) efeitos.push({ k: "morte", vid: per.m.id, kid: ven.m.id, diurna });
  }
}
function proporAcao(ti, tipo) {
  const t = state.equipes[ti]; const vivos = npcVivos(ti); if (!vivos.length) return null;
  tipo ||= escolherAcao(ti);
  const linhas = []; const efeitos = []; const diurna = state.fase !== 2;
  const membro = () => pick(vivos);
  let titulo = (NPC_ACOES.find((a) => a[0] === tipo) || [, tipo])[1];
  if (tipo === "coleta") {
    const areas = state.areas.filter((a) => !a.engolida);
    const area = areas.length ? pick(areas) : null;
    titulo = `Coleta${area ? ` em ${area.nome}` : " nos arredores"}`;
    const guia = membro(); const j = qTest(guia.id, "Sobrevivência");
    linhas.push(`Jornada: ${j.nome} (Sobrevivência ${j.total}, DT 20) ${j.total >= 20 ? "✓ caminho tranquilo" : "✗"}`);
    if (j.total < 20) {
      const c = die(6); const q = CONSEQ[c - 1]; linhas.push(`Consequência: ${q[0]}.`);
      if (q[2] && q[2] !== "encontro") { const alvo = membro(); const n = npcInfo(alvo); const dm = rollExpr(q[2]).total; if (temPv(n)) efeitos.push({ k: "dano", mid: alvo.id, v: dm }); linhas.push(`${mName(alvo)} sofre ${dm} de dano.`); }
      if (q[2] === "encontro") { const alvo = membro(); const n = npcInfo(alvo); const dm = rollExpr("2d8").total; if (temPv(n)) efeitos.push({ k: "dano", mid: alvo.id, v: dm }); linhas.push(`Algo os ataca no caminho: ${mName(alvo)} sofre ${dm} de dano.`); }
    }
    if (area) efeitos.push({ k: "area", id: area.id });
    const rec = { agua: 0, comida: 0, sucata: 0 }; const outros = [];
    for (const m of vivos.slice(0, 3)) {
      if (area && area.buscas.includes(m.id)) continue;
      const r = qTest(m.id, pick(["Percepção", "Investigação", "Sobrevivência"]));
      const ach = []; for (const tier of [15, 20, 25]) if (r.total >= tier) ach.push(RECURSOS_TAB[tier][die(12) - 1]);
      for (const a of ach) { if (a === "Água") rec.agua++; else if (a === "Comida") rec.comida++; else if (a === "Sucata") rec.sucata++; else outros.push(a); }
      if (area) efeitos.push({ k: "busca", area: area.id, mid: m.id });
      linhas.push(`${r.nome} procura (${r.total}): ${ach.length ? ach.join(", ") : "nada"}.`);
    }
    efeitos.push({ k: "rec", ...rec });
    if (outros.length) linhas.push(`Itens para o diário: ${outros.join(", ")}.`);
  } else if (tipo === "construir") {
    const mel = melhorParaConstruir(t);
    if (!mel) return proporAcao(ti, "coleta");
    titulo = `Construir: ${mel.nome}`;
    const quem = membro(); const r = qTest(quem.id, "Profissão");
    if (r.total >= 20) { efeitos.push({ k: "base", mel: mel.k, custo: num(mel.custo) }); linhas.push(`${r.nome} (Profissão ${r.total}, DT 20): ✓ ${mel.nome} construída${num(mel.custo) ? ` (−${mel.custo} sucata)` : ""}.`); }
    else if (r.total <= 15 && num(mel.custo)) { efeitos.push({ k: "rec", agua: 0, comida: 0, sucata: -num(mel.custo) }); linhas.push(`${r.nome} (Profissão ${r.total}): ✗ falhou por 5 ou mais, a sucata se perdeu.`); }
    else linhas.push(`${r.nome} (Profissão ${r.total}): ✗ não conseguiu, nada foi gasto.`);
  } else if (tipo === "descanso") {
    for (const m of vivos) { const n = npcInfo(m); if (temPv(n) && num(n.pvAtual) < num(n.pv)) { const c = rollExpr("1d8+2").total; efeitos.push({ k: "cura", mid: m.id, v: c }); linhas.push(`${mName(m)} recupera ${c} PV.`); } }
    if (!linhas.length) linhas.push("Ficam na base vigiando e reforçando as defesas.");
  } else if (tipo === "ataque" || tipo === "cacada") {
    let alvoTi, defensor;
    if (tipo === "cacada") {
      const sacs = sacrificiosVivos(ti).filter((x) => x.ti !== 0);
      if (!sacs.length) {
        const sj = sacrificiosVivos(ti).find((x) => x.ti === 0);
        if (sj) return { ti, tipo, titulo: `Caçada ao sacrifício dos jogadores`, linhas: [`${t.nome} decide caçar ${mName(sj.m)} (${sj.m.sac}) esta noite.`, "Nada é resolvido sozinho: prepare o encontro com os jogadores."], efeitos: [{ k: "gancho" }] };
        return proporAcao(ti, "ataque");
      }
      const s = pick(sacs); alvoTi = s.ti; defensor = s.m; titulo = `Caçada a ${mName(s.m)} (${s.m.sac})`;
    } else {
      alvoTi = alvoEquipe(ti, true, false);
      if (alvoTi == null) return proporAcao(ti, "descanso");
      defensor = pick(npcVivos(alvoTi)); titulo = `Ataque a ${state.equipes[alvoTi].nome}`;
    }
    linhas.push(`${t.nome} parte para cima de ${state.equipes[alvoTi].nome}${diurna ? " (de dia: uma morte de sacrifício não contaria)" : ""}.`);
    lutar(membro().id, defensor.id, efeitos, linhas, diurna, tipo === "cacada");
    efeitos.push({ k: "rel", a: ti, b: alvoTi, v: "Hostil" });
  } else if (tipo === "sabotagem") {
    const alvoTi = alvoEquipe(ti, true, false); if (alvoTi == null) return proporAcao(ti, "coleta");
    const T = state.equipes[alvoTi]; titulo = `Roubo de recursos de ${T.nome}`;
    const ladrao = membro(); const guarda = pick(npcVivos(alvoTi));
    const a = qTest(ladrao.id, "Crime"), d = qTest(guarda.id, "Percepção");
    linhas.push(`${a.nome} (Crime ${a.total}) × ${d.nome} (Percepção ${d.total})`);
    if (a.total > d.total) {
      const tipoR = pick(["agua", "comida", "sucata"]); const q = Math.min(T[tipoR], die(2)); const nome = { agua: "água", comida: "comida", sucata: "sucata" }[tipoR];
      if (q) { efeitos.push({ k: "roubo", de: alvoTi, r: tipoR, q }); linhas.push(`→ Leva ${q} ${nome} sem ser visto.`); } else linhas.push(`→ Entra, mas não encontra ${nome} para levar.`);
    } else { linhas.push("→ É flagrado e foge de mãos vazias."); efeitos.push({ k: "rel", a: ti, b: alvoTi, v: "Hostil" }); }
  } else if (tipo === "alianca") {
    const alvoTi = alvoEquipe(ti, false, true); if (alvoTi == null) return proporAcao(ti, "descanso");
    const T = state.equipes[alvoTi]; titulo = `Diplomacia com ${T.nome}`;
    const quem = membro(); const r = qTest(quem.id, "Diplomacia");
    if (alvoTi === 0) { linhas.push(`${r.nome} procura a equipe dos jogadores para propor uma parceria (Diplomacia ${r.total}).`); linhas.push("A conversa acontece em cena: decida com os jogadores."); efeitos.push({ k: "gancho" }); }
    else {
      const ordem = ATITUDES; const atual = ordem.indexOf(relDe(ti, alvoTi)); const nova = r.total >= 20 ? ordem[Math.max(0, atual - 1)] : r.total < 10 ? ordem[Math.min(ordem.length - 1, atual + 1)] : ordem[atual];
      linhas.push(`${r.nome} (Diplomacia ${r.total}): relação ${relDe(ti, alvoTi)} → ${nova}.`);
      efeitos.push({ k: "rel", a: ti, b: alvoTi, v: nova });
    }
  } else if (tipo === "espreita") {
    titulo = "Espionar os jogadores"; const quem = membro(); const r = qTest(quem.id, "Furtividade");
    linhas.push(`${r.nome} observa a base dos jogadores (Furtividade ${r.total}). Se alguém estiver de guarda, pode fazer Percepção contra esse valor.`);
    efeitos.push({ k: "gancho" });
  }
  return { ti, tipo, titulo, linhas, efeitos };
}
function aplicarProposta(p) {
  const t = state.equipes[p.ti]; const mortes = [];
  for (const e of p.efeitos) {
    if (e.k === "rec") { t.agua = Math.max(0, t.agua + num(e.agua)); t.comida = Math.max(0, t.comida + num(e.comida)); t.sucata = Math.max(0, t.sucata + num(e.sucata)); }
    if (e.k === "base" && !t.base.includes(e.mel)) { t.base.push(e.mel); t.sucata = Math.max(0, t.sucata - num(e.custo)); }
    if (e.k === "dano" || e.k === "cura") { const x = findM(e.mid); const n = x && npcInfo(x.m); if (temPv(n)) n.pvAtual = e.k === "dano" ? num(n.pvAtual) - e.v : Math.min(num(n.pv), num(n.pvAtual) + e.v); }
    if (e.k === "area") { const a = state.areas.find((a) => a.id === e.id); if (a && !a.exp.includes(p.ti)) a.exp.push(p.ti); }
    if (e.k === "busca") { const a = state.areas.find((a) => a.id === e.area); if (a && !a.buscas.includes(e.mid)) a.buscas.push(e.mid); }
    if (e.k === "roubo") { const T = state.equipes[e.de]; const q = Math.min(T[e.r], e.q); T[e.r] -= q; t[e.r] += q; }
    if (e.k === "rel") { state.rel ||= {}; state.rel[relKey(e.a, e.b)] = e.v; }
    if (e.k === "morte") mortes.push(e);
  }
  const texto = `Dia ${state.dia} (${FASES[state.fase]}) — ${t.nome}: ${p.titulo}\n${p.linhas.join("\n")}`;
  (state.npcLog ||= []).unshift({ at: Date.now(), dia: state.dia, txt: texto }); state.npcLog = state.npcLog.slice(0, 40);
  state.diarios ||= {}; const d = state.diarios[p.ti] || { text: "" };
  state.diarios[p.ti] = { text: `${d.text ? d.text + "\n\n" : ""}[Dia ${state.dia}] ${p.titulo}: ${p.linhas.join(" ")}`.slice(-6000), by: "Mestre (simulação)", at: Date.now() };
  return mortes;
}
function npcSimDialog() {
  const equipes = state.equipes.map((t, ti) => ti).filter((ti) => ti !== 0 && npcVivos(ti).length);
  if (!equipes.length) return toast("Nenhuma equipe NPC com membros vivos (as equipes 2 a 6 são as de NPC).");
  const props = {}; const escolha = {}; for (const ti of equipes) props[ti] = proporAcao(ti);
  const wrap = document.createElement("div"); wrap.className = "dialog";
  const draw = () => {
    wrap.innerHTML = `<div class="box wide-box">
      <h3>Ações das equipes NPC — dia ${state.dia}, ${FASES[state.fase].toLowerCase()}</h3>
      <p class="muted small">Cada equipe sorteou o que fez. Os dados já foram rolados, mas nada muda até você aprovar. Troque a ação, sorteie de novo ou desmarque o que não quiser.</p>
      ${equipes.map((ti) => { const p = props[ti]; const t = state.equipes[ti];
        return `<div class="ed-team npcsim" data-simteam="${ti}">
          <div class="row wrap"><label class="check"><input type="checkbox" class="sim-on" ${p ? "checked" : ""}> <b style="color:${t.cor}">${esc(t.nome)}</b></label>
          <span class="muted small">💧 ${t.agua} · 🍖 ${t.comida} · ⚙ ${t.sucata} · ${npcVivos(ti).length} vivos</span><span class="grow"></span>
          <select class="sim-tipo"><option value="">Sortear ação</option>${opt(NPC_ACOES, escolha[ti] || "")}</select><button class="ghost icon sim-re" title="Sortear de novo">🎲</button></div>
          ${p ? `<p><b>${esc(p.titulo)}</b>${p.efeitos.some((e) => e.k === "morte") ? ` <span class="tag bad">morte</span>` : ""}${p.efeitos.some((e) => e.k === "gancho") ? ` <span class="tag">gancho para a mesa</span>` : ""}</p><pre class="small">${esc(p.linhas.join("\n"))}</pre>` : `<p class="muted">Sem ação.</p>`}
        </div>`; }).join("")}
      <div class="row"><button class="primary" id="simGo">Aplicar as aprovadas</button><button id="simCancel">Cancelar</button></div></div>`;
  };
  draw(); document.body.appendChild(wrap);
  wrap.addEventListener("click", (e) => {
    if (e.target === wrap || e.target.id === "simCancel") return wrap.remove();
    const box = e.target.closest("[data-simteam]");
    if (box && e.target.classList.contains("sim-re")) { const ti = Number(box.dataset.simteam); props[ti] = proporAcao(ti, box.querySelector(".sim-tipo").value || null); draw(); return; }
    if (e.target.id === "simGo") {
      const ok = equipes.filter((ti) => props[ti] && wrap.querySelector(`[data-simteam="${ti}"] .sim-on`).checked);
      if (!ok.length) return wrap.remove();
      beginAction("Ações das equipes NPC");
      const mortes = []; for (const ti of ok) mortes.push(...aplicarProposta(props[ti]));
      wrap.remove();
      for (const m of mortes) { const v = findM(m.vid); if (v?.m.vivo) registrarMorte(m.vid, m.kid, m.diurna); }
      save(); endAction();
      announce(`Ações das equipes NPC aplicadas (${ok.length}): ${ok.map((ti) => `${state.equipes[ti].nome} — ${props[ti].titulo}`).join("; ")}`, true);
    }
  });
  wrap.addEventListener("change", (e) => {
    const box = e.target.closest("[data-simteam]");
    if (box && e.target.classList.contains("sim-tipo")) { const ti = Number(box.dataset.simteam); escolha[ti] = e.target.value; props[ti] = proporAcao(ti, e.target.value || null); draw(); }
  });
}
function npcSimCard() {
  if (!isGM()) return "";
  const log = (state.npcLog || []).slice(0, 6);
  return `<section class="card"><h3>Equipes NPC <span class="muted">só o mestre vê</span></h3>
    <p class="muted small">Sorteia o que cada equipe de NPC (2 a 6) fez nesta fase: coleta, construção, ataques, caçadas, roubos e diplomacia. Você revisa e aprova antes de qualquer mudança. Encontros com a equipe dos jogadores viram só um gancho para você narrar.</p>
    <button class="primary" id="btnNpcSim">🎲 Sortear ações das equipes NPC</button>
    ${log.length ? `<ul class="log">${log.map((l) => `<li><span class="t">D${l.dia}</span><pre>${esc(l.txt)}</pre></li>`).join("")}</ul>` : ""}
  </section>`;
}
