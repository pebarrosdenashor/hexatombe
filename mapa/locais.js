/* Dados padrão do mapa de Bom Jesus do Açude (o mestre pode editar tudo na extensão) */

export const EQUIPES = {
  "Os da Floresta": "#7f9b4f",
  "Os Zahab": "#d4a63c",
  "Família Queiroz": "#c97a3a",
  "Os Comensais": "#a3302b",
  "A Romaria": "#9a6fb0",
  "Jogadores": "#e8e2d0"
};

export const TIPOS = { base: "Base", enigma: "Enigma", explorar: "Exploração" };

// texto completo do dia (só o mestre vê)
export const DIAS_MESTRE = {
  1: ["A água recua", "A cidade inteira reaparece. A represa ainda tem a cor de sempre."],
  2: ["A represa escurece", "A água ainda não volta, mas a muralha começa a mudar de cor. Quem encosta nela sente que está morna."],
  3: ["A muralha treme", "A muralha range e escorre filetes vermelhos pelas ruas da borda. A cidade ainda está seca, mas não por muito tempo."],
  4: ["A água volta", "A margem afunda de uma vez: Mata dos Afogados, Feira, Santa Casa e Cemitério. Fazenda e Calvário viram ilhas e a usina fica isolada."],
  5: ["A água vira sangue", "Matadouro, Ponte Partida, Casarão e o Calvário afundam. A represa está vermelha."],
  6: ["Só a praça da Matriz", "O último anel da cidade afunda, a Fazenda junto. Resta a praça da igreja, no centro, cercada de sangue."]
};

// texto que os jogadores veem (sem entregar o que vai afundar)
export const DIAS_JOGADOR = {
  1: ["A água recua", "A cidade inteira reaparece, coberta de lama e limo."],
  2: ["A represa escurece", "A muralha d'água mudou de cor. Quem encosta nela sente que está morna."],
  3: ["A muralha treme", "A muralha range. Filetes vermelhos escorrem pelas ruas da borda."],
  4: ["A água volta", "A represa avançou sobre a margem da cidade."],
  5: ["A água vira sangue", "A água está vermelha e já chega aos bairros do meio."],
  6: ["Só a praça da Matriz", "Sobrou a praça da igreja, cercada de sangue."]
};

const L = (o) => o;
export const LOCAIS_PADRAO = [
  L({ id: "forca", nome: "Casa de Força", tipo: "base", eq: "Jogadores", x: 916, y: 330, alaga: 0,
    txt: "Usina na beira da muralha: turbinas paradas, painéis de controle e um gerador velho, numa plataforma de concreto acima da água.",
    din: ["Com o gerador consertado, é a única base com eletricidade: luz à noite e equipamentos funcionando.",
      "Uma vez por ritual, abrir uma comporta alaga um setor da cidade antes da hora.",
      "Nunca afunda, mas vira ilha no dia 4. Daí em diante, só se chega nadando.",
      "Colada na muralha. O som da água e o que se mexe do outro lado drenam sanidade."] }),
  L({ id: "fazenda", nome: "Fazenda Alto do Cruzeiro", tipo: "base", eq: "Família Queiroz", x: 780, y: 128, alaga: 6,
    txt: "Casarão, curral e caixa d'água de ferro no ponto mais alto da arena.",
    din: ["Da caixa d'água, Everaldo enxerga quase a cidade inteira.",
      "Único poço de água limpa. Beber da represa custa sanidade, e piora conforme ela avermelha.",
      "Vira ilha no dia 4 e só afunda no dia 6. É o refúgio mais cobiçado do fim do ritual."] }),
  L({ id: "calvario", nome: "Morro do Calvário", tipo: "base", eq: "A Romaria", x: 215, y: 140, alaga: 5,
    txt: "Escadaria de pedra com as 14 estações da Via-Sacra, subindo da cidade até uma capelinha no topo, onde o andor repousa.",
    din: ["Bônus cumulativo a cada estação rezada em procissão.",
      "Fora do Calvário, o andor perde o bônus, mas a santa chora sangue pelo caminho.",
      "No dia 4 a escadaria afunda e a capela vira ilha. O morro inteiro afunda no dia 5.",
      "A 14ª estação mostra um campanário de cabeça para baixo: pista do Sino."] }),
  L({ id: "mata", nome: "Mata dos Afogados", tipo: "base", eq: "Os da Floresta", x: 195, y: 480,
    txt: "Árvores mortas que passaram décadas debaixo d'água, presas numa névoa que nunca sai.",
    din: ["As trilhas mudam toda noite. Sem máscara da Floresta, teste de Percepção ou sai em outro ponto.",
      "Terreno de emboscada. O Morcego, cego, ignora a névoa.",
      "É a primeira base a afundar: a Floresta vai precisar tomar a casa de alguém."] }),
  L({ id: "matadouro", nome: "Matadouro Municipal", tipo: "base", eq: "Os Comensais", x: 480, y: 502,
    txt: "Ganchos enferrujados e uma câmara fria que ainda funciona sem explicação, na beira do rio.",
    din: ["Única fonte de comida da arena. Comer recupera vida, com possível custo de sanidade.",
      "A fome é moeda: tréguas e alianças passam por aqui.",
      "Base quase sempre desguarnecida, porque eles saem para caçar."] }),
  L({ id: "cartorio", nome: "Cartório e Biblioteca", tipo: "base", eq: "Os Zahab", x: 612, y: 298, ly: -20,
    txt: "Livros inchados de água. No livro de óbitos, páginas novas se escrevem sozinhas.",
    din: ["Toda manhã aparece o nome de quem morre no dia, com letras embaralhadas. Só a mente coletiva decifra.",
      "Guarda a certidão de óbito que o padre Anselmo nunca recebeu: pista do Sino.",
      "Colado à praça, é a base que mais resiste. Mas é papel, madeira podre e janelas demais."] }),
  L({ id: "igreja", nome: "Igreja Matriz", tipo: "enigma", eq: "", x: 500, y: 346, ly: 30,
    txt: "No centro da praça. A torre está sem o sino grande e o relógio parou nas 3h. Cinco cordas pendem dos sinos pequenos: Benedito, Rita, José, Luzia e Expedito.",
    din: ["Ordem dos sinos: datas de morte dos cinco túmulos do Cemitério.",
      "Tocar a sequência três vezes, como marca o relógio.",
      "Alguém deita no túmulo vazio do padre enquanto outro toca.",
      "Erro: um sino toca sozinho num ponto aleatório e todos ouvem.",
      "Acerto: o piso abre para o campanário invertido, onde está o Sino da Coroa de Espinhos."],
    alerta: "É o último chão seco da cidade. No dia 6, quem ainda estiver vivo vai estar em volta desta praça." }),
  L({ id: "cemiterio", nome: "Cemitério", tipo: "explorar", eq: "", x: 745, y: 470, ly: -34,
    txt: "Caixões desenterrados pela enchente, alguns abertos, alguns vazios.",
    din: ["Cinco túmulos com nomes de santos e datas: a ordem dos sinos.", "O sexto túmulo, do padre, está vazio e sem nome."],
    alerta: "Afunda no dia 4. Quem não anotou as datas perde a pista." }),
  L({ id: "correios", nome: "Correios", tipo: "explorar", eq: "", x: 390, y: 280, ly: -16,
    txt: "Sacos de cartas nunca entregues.", din: ["Carta do padre Anselmo.", "Segredos das equipes, se o mestre quiser plantar."] }),
  L({ id: "cine", nome: "Cine Teatro", tipo: "explorar", eq: "", x: 400, y: 420, ly: 24,
    txt: "O projetor liga sozinho à meia-noite e mostra a cidade antes da enchente.", din: ["Às vezes mostra o que ainda vai acontecer."] }),
  L({ id: "santa", nome: "Santa Casa", tipo: "explorar", eq: "", x: 310, y: 200, ly: -16,
    txt: "Hospital com remédios quase todos estragados.", din: ["Os poucos bons são os itens de cura mais disputados.", "Uma ala trancada."] }),
  L({ id: "delegacia", nome: "Delegacia", tipo: "explorar", eq: "", x: 600, y: 410, ly: 24,
    txt: "Armas enferrujadas e munição.", din: ["Numa das celas há alguém, ou algo, ainda preso."] }),
  L({ id: "casarao", nome: "Casarão do Coronel", tipo: "explorar", eq: "", x: 650, y: 220, ly: -16,
    txt: "O homem que vendeu as terras para a represa. Cofre e retratos com os rostos raspados.", din: ["O cofre guarda algo que o mestre decide."] }),
  L({ id: "ponte", nome: "Ponte Partida", tipo: "explorar", eq: "", x: 655, y: 466, anchor: "end", lx: -14, ly: 20,
    txt: "Liga as duas metades da cidade por cima do leito do rio, quebrada no meio. Só se atravessa pulando.", din: ["Gargalo de combate entre o centro e o cemitério."] }),
  L({ id: "feira", nome: "A Feira", tipo: "explorar", eq: "", x: 240, y: 450, anchor: "end", lx: -12, ly: -14,
    txt: "Barracas com mercadoria de 50 anos atrás, intacta.", din: ["Comprar ali tem um preço estranho."] })
];
