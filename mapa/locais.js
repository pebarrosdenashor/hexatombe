/* Dados padrão do mapa de Bom Jesus do Açude (o mestre pode editar tudo na extensão).
   Versão 2 dos locais: segue o "guia dos locais (versão 2)".
   txt = o que se vê ao chegar · din = detalhes que o mestre libera um a um
   alerta = aviso em destaque · notas = segredo e como descobrir (só o mestre vê) */

export const VERSAO_LOCAIS = 3;

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
  1: ["A água recua", "A cidade inteira reaparece. A represa ainda tem a cor de sempre. A água só volta no dia 6."],
  2: ["A represa escurece", "A água ainda não volta, mas a muralha começa a mudar de cor. Quem encosta nela sente que está morna."],
  3: ["A muralha treme", "A muralha range e escorre filetes vermelhos pelas ruas da borda. A cidade ainda está seca, mas não por muito tempo."],
  4: ["A represa ferve", "A cidade continua seca, mas a muralha está vermelho-escura e borbulha na base. À noite se ouve a água batendo como um sino."],
  5: ["A água vira sangue", "A represa está vermelha como sangue. A cidade ainda está seca: é o último dia com todos os locais de pé."],
  6: ["A água volta", "A represa desaba sobre a cidade de uma vez. Tudo afunda menos a praça da Matriz, no centro, e o Hotel Bela Vista, ilhado na rocha."]
};

// texto que os jogadores veem (sem entregar o que vai afundar)
export const DIAS_JOGADOR = {
  1: ["A água recua", "A cidade inteira reaparece, coberta de lama e limo."],
  2: ["A represa escurece", "A muralha d'água mudou de cor. Quem encosta nela sente que está morna."],
  3: ["A muralha treme", "A muralha range. Filetes vermelhos escorrem pelas ruas da borda."],
  4: ["A represa ferve", "A muralha está vermelho-escura e borbulha na base. À noite, a água bate como um sino."],
  5: ["A água vira sangue", "A represa está vermelha como sangue. A muralha se curva sobre a cidade."],
  6: ["A água volta", "A represa desabou. Sobrou a praça da igreja, cercada de sangue."]
};

const L = (o) => o;
export const LOCAIS_PADRAO = [
  /* ---------------- bases ---------------- */
  L({ id: "hotel", nome: "Hotel Bela Vista", tipo: "base", eq: "Jogadores", x: 916, y: 330, alaga: 0,
    txt: "Na Pedra do Mirante, colado à barragem. Um hotel rosa-claro de três andares, com varandas viradas para a cidade e o letreiro apagado. Tudo novo e intocado: ninguém nunca se hospedou aqui. É o único prédio da cidade sem marca de lama.",
    din: [
      "Áreas: recepção, salão de festas com palco e gramofone, cozinha e despensa, dez quartos, Suíte 1 trancada no 3º andar, terraço, porão de serviço, pátio com piscina vazia e a passarela da barragem.",
      "Começa usável só na recepção, no salão e nos quartos. O resto se conserta com melhorias (um período de trabalho cada).",
      "Achados iniciais: 3 água mineral (despensa, Percepção DT 15), 2 comida do coquetel, 2 sucata e um pé de cabra (porão), roupa de cama para todos.",
      "Livro de hóspedes: uma só reserva, \"Família Tibúrcio, Suíte 1, entrada 2/5/1974\", sem saída. A placa da fachada marca a inauguração para 4 de maio de 1974.",
      "Chaveiro da recepção: faltam a chave da Suíte 1 e a do depósito 2 do porão.",
      "Diário do zelador Adauto (atrás da recepção, Investigação DT 20): \"o padre não parou de tocar. a água obedecia ao sino\".",
      "Melhoria · Barricadas: 3 sucata. Arrombar qualquer entrada exige Atletismo DT 20 e acorda a base.",
      "Melhoria · Cozinha acesa: 2 sucata + lenha da Mata. Com 2 comida se faz 3 refeições; cozinhar à noite dá +1d4 PV no descanso.",
      "Melhoria · Enfermaria: 1 kit de cura (Santa Casa) + roupa de cama + 1 sucata. +2 em Medicina e +1d6 PV no descanso lá dentro.",
      "Melhoria · Gerador: 4 sucata + 1 galão de diesel (jipe da Delegacia ou carros da Ponte) + Tecnologia DT 20. Luz à noite (+2 Percepção); o letreiro acende se quiserem.",
      "Melhoria · Mirante no terraço: 2 sucata + binóculo da Delegacia (ou a luneta dos Queiroz). Uma vez por dia, ver quem entra e sai de três locais.",
      "Melhoria · Filtro de água: 3 sucata + areia do rio + carvão de Os da Floresta. Até 2 água limpa por dia, até o dia 4 (depois a represa fica vermelha demais).",
      "Melhoria · Horta da piscina: 2 água por dia durante 2 dias + mudas da Família Queiroz. Depois, 1 comida por dia.",
      "Melhoria · Despensa de conserva: 1 sucata + sal grosso dos Comensais. Comida guardada no hotel não estraga.",
      "Melhoria · Sala de leitura: 1 sucata + três livros da biblioteca dos Zahab. +2 em Investigação e Ocultismo no hotel.",
      "Melhoria · Salão de música: 2 sucata + um instrumento da Romaria (zabumba ou pífano). Uma noite de música por dia: todos recuperam 1d6 de Sanidade.",
      "Melhoria · Suíte 1: a chave (com o coronel, na Delegacia) ou Crime DT 25 + 2 sucata. Melhor quarto, com cofre e acesso ao terraço."
    ],
    alerta: "Nunca afunda, mas vira ilha no dia 6: daí em diante só se chega nadando (Atletismo DT 15) ou pela passarela da barragem.",
    notas: "SEGREDO: o coronel construiu o hotel sabendo da inundação (\"Lago Tibúrcio\", margens loteadas). A família esperou por ele na suíte na noite de 2 de maio; ele estava preso na Delegacia. Pouco antes das 3h do dia 3, Celina desceu com Clarinha para procurá-lo e as duas nunca voltaram. No cofre da suíte: carta do engenheiro (as comportas podiam fechar uma semana depois) e o recibo do que o coronel pagou para adiantar.\n\nCOMO DESCOBRIR: 1) placa + livro de hóspedes levantam a pergunta. 2) diário do zelador. 3) salão de música abre o alçapão do palco: disco com o ensaio do discurso (\"bem-vindos às margens do Lago Tibúrcio\"). 4) sala de leitura (planta) + gerador (luz no porão) levam à parede do depósito 2: maquete do loteamento (2 sucata, 1 hora). 5) chave da suíte com o corpo do coronel; na suíte, malas e bilhete \"desci com a Clarinha para te procurar\". 6) cofre da suíte: 14-08-62 (mesma combinação do Casarão). Mirante revela a luneta apontada para a torre; horta revela a placa \"Loteamento Praia do Lago\"." }),

  L({ id: "fazenda", nome: "Fazenda Alto do Cruzeiro", tipo: "base", eq: "Família Queiroz", x: 780, y: 128, alaga: 6,
    txt: "Estrada de terra até um casarão caiado com alpendre, curral de aroeira, casa de farinha e uma caixa d'água de ferro no ponto mais alto da arena. Único lugar onde o chão está seco e o ar não cheira a lodo.",
    din: [
      "Áreas: casarão com oratório e quarto do coronel trancado, casa dos vaqueiros (segundo dormitório), casa de farinha, curral e paiol, caixa d'água, poço e cruzeiro.",
      "Único poço de água limpa: 3 água por dia. Os Queiroz controlam a corda e o balde.",
      "Da caixa d'água, Everaldo enxerga quase a cidade inteira e quem sai de cada base.",
      "Paiol: 2 comida (Sobrevivência DT 15) e mudas e sementes, que o Hotel precisa para a horta.",
      "Nomes no cruzeiro (Investigação DT 15): moradores que se recusaram a sair. Cinco deles são os dos túmulos do Cemitério, com as mesmas datas.",
      "Escritura no fundo falso do oratório (Percepção DT 20): a fazenda foi do coronel Tibúrcio.",
      "Luneta de latão no quarto do coronel (Crime DT 20): uma vez por dia, ver o que uma equipe está fazendo."
    ],
    alerta: "Único poço de água limpa até o fim. Afunda no dia 6, com o resto da cidade.",
    notas: "SEGREDO: o poço não acaba em água. A dez metros há um túnel antigo até a cripta da Matriz (Atletismo DT 20 com corda e luz). Chega por baixo ao campanário invertido, mas a passagem tem uma grade com cinco fechaduras.\n\nCOMO DESCOBRIR: 1) a corda é longa demais para cinco metros de poço (Percepção DT 15). 2) mapa de 1950 no sótão do Cartório mostra o túnel. 3) descer leva à grade; as chaves estão no cofre do Casarão.\n\nNo dia 5 a água do poço já sai rosada; no dia 6 a fazenda afunda." }),

  L({ id: "calvario", nome: "Morro do Calvário", tipo: "base", eq: "A Romaria", x: 215, y: 140, alaga: 6,
    txt: "Uma escadaria de pedra com as 14 estações da Via-Sacra sobe até um topo murado: o Pouso dos Romeiros, de 1921, com rancho, cozinha, cisterna e a gruta onde o andor da santa descansa.",
    din: [
      "Áreas: escadaria (uma pessoa por vez), portão e muro com seteiras, rancho dos romeiros com redes para quarenta, cozinha comunitária, Casa dos Milagres (ex-votos), Gruta da Santa, cisterna, barracas de lembrança e cruzeiro.",
      "Cisterna: 1 água limpa por dia, até o dia 4. Barracas: velas para seis noites e 1 sucata.",
      "Baús do rancho: zabumba, pífano e matraca. O Hotel precisa de um deles para o salão de música.",
      "Estação 1: um sino de mão que avisa o topo quando alguém começa a subir.",
      "Estação 6 (Percepção DT 15): um pano com o rosto de alguém da mesa, marcado a sangue.",
      "Estação 9 (Investigação DT 15): esconderijo de romeiro com 2 comida.",
      "Estação 12 (Ocultismo DT 20): selo de Sangue. Rezar cura 1d6 PV, mas consome 1 água extra no dia.",
      "Estação 14 (Investigação DT 15): um campanário de cabeça para baixo, com cinco cordas. Pista do Sino.",
      "Ex-voto do padre na Casa dos Milagres (Investigação DT 20): \"Rita abre, Expedito fecha\".",
      "Cântico da Romaria (Religião DT 15): \"o sino que toca para dentro\" e \"a corda que a santa guarda\".",
      "A santa chora sangue quando um sacrifício morre, e a Romaria sabe antes de todos."
    ],
    alerta: "Afunda no dia 6. Antes disso, a Romaria vai querer levar o andor para a praça da Matriz em procissão.",
    notas: "SEGREDO: o andor tem fundo oco com a corda original do sino de Luzia. Sem ela (ou outra trançada com cabelo de um sacrifício) o enigma não se resolve. A Romaria só a entrega em troca de uma relíquia: uma parte do corpo de um sacrifício de outra equipe.\n\nCOMO DESCOBRIR: 1) a corda de Luzia falta na torre da Matriz. 2) o cântico fala da corda que a santa guarda. 3) sessão \"Festa do Bom Jesus\" no Cine Teatro mostra a corda amarrada no andor. 4) o fundo do andor soa oco (Percepção DT 20).\n\nPerigos: fundos do morro só por escalada (Atletismo DT 20); velas acesas deixam o topo visível à noite." }),

  L({ id: "mata", nome: "Mata dos Afogados", tipo: "base", eq: "Os da Floresta", x: 195, y: 480,
    txt: "Troncos cinzentos sem folha, retorcidos para o mesmo lado e tão juntos que a luz chega verde e fraca. A enchente deixou a cidade espalhada pela mata: sapatos e terços nos galhos, uma bicicleta no alto, uma casa de madeira inteira presa entre as árvores, um ônibus tombado.",
    din: [
      "Áreas: borda, casa arrastada (dormitório da Floresta), ônibus da linha, Clareira do Cervo, plataformas nas árvores, carvoaria, Árvore da Forca e beira do rio.",
      "Mata fechada: quem não é da Floresta anda pela metade e faz Sobrevivência DT 20 por hora ou sai perdido na borda.",
      "Andar em silêncio pede Furtividade DT 20 para os de fora. Emboscadas da Floresta ganham +5.",
      "Objetos nos galhos (Percepção DT 15): 1 sucata por busca, às vezes algo pessoal.",
      "Lenha seca e carvão da carvoaria: o Hotel precisa dos dois.",
      "Raízes comestíveis na beira do rio (Sobrevivência DT 20): 2 comida.",
      "Máscara de anta no alto da Árvore da Forca (Atletismo DT 20): a Floresta pagaria caro por ela.",
      "Cova rasa na clareira (Investigação DT 20): um corpo com roupas de outra época.",
      "Placa caída: \"Bom Jesus do Açude, fundada em 1889\"."
    ],
    alerta: "Afunda no dia 6. Até lá, é o melhor terreno de emboscada da arena.",
    notas: "SEGREDO: a mata foi plantada pelo padre Anselmo, uma árvore para cada morador que saiu antes da inundação, com plaquinhas de latão nos troncos. Os que ficaram estão no cruzeiro da Fazenda.\n\nCOMO DESCOBRIR: 1) plaquinhas meio engolidas pela casca (Investigação DT 20). 2) nomes batem com os registros de mudança no porão do Cartório. 3) livro de tombo da Matriz: \"plantei hoje mais doze, uma por família que partiu\".\n\nO ano 1889 da placa abre o cofre do Cartório." }),

  L({ id: "matadouro", nome: "Matadouro Municipal", tipo: "base", eq: "Os Comensais", x: 480, y: 502,
    txt: "Prédios de tijolo na beira do rio, cercados por um muro baixo. Galpão com curral e rampa, ganchos no teto e, ao fundo, a porta grossa de uma câmara fria com a luz verde acesa. Atrás, a casa do fiscal, a salgadeira e a chaminé da graxaria.",
    din: [
      "Áreas: rampa e curral, sala de abate, câmara fria, salgadeira, graxaria (onde cozinham), casa do fiscal (dormitório), pocilgas usadas como cela, caixa d'água de vigia e a canaleta de fuga até o rio.",
      "Câmara fria: 3 comida por dia. Quem come recupera 1d6 PV a mais, mas faz Vontade DT 15 ou perde 1d4 de Sanidade.",
      "Facas de abate: arma leve (1d6), à vontade.",
      "Sal grosso: conserva comida por dois dias. O Hotel precisa dele para a despensa.",
      "Livro do fiscal (Investigação DT 20): na semana da inundação, nomes de pessoas com peso. O padre Anselmo está riscado.",
      "Cofre do fiscal (Crime DT 20): uma chave com etiqueta \"sacristia\". Abre o armário da sacristia da Matriz.",
      "A câmara fria tranca por fora: Fortitude DT 15 por hora ou 1d6 PV de frio. Chão da sala de abate escorregadio em combate."
    ],
    alerta: "Base quase sempre desguarnecida à noite, porque os Comensais saem para caçar. Afunda no dia 6.",
    notas: "SEGREDO: a câmara funciona com Sangue. Um coração humano pendurado ainda bate; destruí-lo faz a comida apodrecer na hora.\n\nCOMO DESCOBRIR: 1) não há fio, motor nem gerador (Tecnologia DT 15). 2) batida fraca dentro da câmara (Percepção DT 20). 3) embrulho de lona no gancho do fundo; Ocultismo DT 20 para entender. 4) o livro do fiscal completa a história.\n\nNo dia 6, a carne continua fresca para quem mergulhar (Atletismo DT 20)." }),

  L({ id: "cartorio", nome: "Cartório, Biblioteca e Câmara", tipo: "base", eq: "Os Zahab", x: 612, y: 298, ly: -20,
    txt: "Sobrado de esquina com azulejo português, CARTÓRIO em letras de ferro e o brasão da cidade. Livros de registro inchados de água no térreo, biblioteca em cima e uma porta interna para a Câmara Municipal, ao lado.",
    din: [
      "Áreas: balcão e arquivo (1889 a 1974), sala do tabelião com cofre de parede, biblioteca, sótão, plenário da Câmara (onde os Zahab dormem), gabinete do presidente, porão do arquivo morto e a torre do relógio.",
      "Arquivo (Investigação DT 20): confirma as datas de óbito dos cinco túmulos. Pista do Sino.",
      "Sala do tabelião (Investigação DT 15): certidão de óbito do padre, nunca assinada.",
      "Jornal \"O Açude\", última edição: foto da torre com o sino grande, chamado \"Coroa\".",
      "Sótão (Percepção DT 20): mapa de 1950 com um túnel da Matriz até a fazenda do morro.",
      "Porão: registros de quem se mudou da cidade antes de 1974.",
      "Biblioteca: almanaque, código civil e anuário. O Hotel precisa deles para a sala de leitura.",
      "Papel, tinta e lacre: para falsificar documentos ou mandar recados."
    ],
    alerta: "Muitas janelas, escada podre e livros que pegam fogo. Afunda no dia 6.",
    notas: "SEGREDO: a Câmara votou 7 a 2 contra a venda. O tabelião Oswaldo Brandão, pago pelo coronel, fez uma ata falsa com unanimidade e falsificou sete assinaturas. Confissão e o dinheiro intocado estão no cofre de parede.\n\nCOMO DESCOBRIR: 1) jornal de 1972 (Investigação DT 20) diz rejeitada; ata do gabinete diz aprovada. 2) comparar assinaturas com certidões de casamento (Investigação DT 20): sete na mesma letra. 3) a letra é a do tabelião. 4) cofre: Crime DT 20 ou 1-8-8-9 (brasão da fachada, placa da Mata). 5) sessão \"Sessão da Câmara\" no Cine Teatro mostra sete mãos contra." }),

  /* ---------------- enigma ---------------- */
  L({ id: "igreja", nome: "Igreja Matriz", tipo: "enigma", eq: "", x: 500, y: 346, ly: 30,
    txt: "No centro da praça, cercada de oitis mortos. A torre está sem o sino grande e o relógio parou nas 3h. Cinco cordas pendem dos sinos pequenos: Benedito, Rita, José, Luzia e Expedito. A de Luzia está faltando.",
    din: [
      "Áreas: nave com uma coroa de espinhos desenhada no piso, sacristia com armário trancado e livro de tombo, coro e torre, cripta com uma grade de cinco fechaduras.",
      "Armário da sacristia (chave do Matadouro ou Crime DT 25): caderno de toques do padre, terminando em \"o toque que ninguém deu por mim\".",
      "Atrás do retrato do padre (Percepção DT 20): 3 de maio de 1974, 3h.",
      "Coroa no piso (Ocultismo DT 20): um selo que abre para baixo quando o toque certo terminar.",
      "Hóstias do sacrário: 1 comida e uma visão de uma pista ainda não achada.",
      "Errar a sequência faz um sino tocar sozinho em algum ponto da arena. Todas as equipes ouvem.",
      "Acertar abre o piso para o campanário invertido, onde está o Sino da Coroa de Espinhos."
    ],
    alerta: "É o último chão seco da cidade. No dia 6, quem ainda estiver vivo vai estar em volta desta praça.",
    notas: "SOLUÇÃO: Rita, Benedito, Luzia, José, Expedito; três vezes; às 3h; alguém deitado no túmulo vazio do padre; corda de Luzia no lugar. Quem estava no túmulo sai com a marca de espinhos: só ele toca o Sino sem morrer.\n\nSEGREDO: o padre Anselmo está dentro do sino. Quem toca passa a ouvir a voz dele pedindo que toquem por ele.\n\nCOMO DESCOBRIR: túmulo vazio + certidão não assinada; livro de visitas (\"amanhã eu toco por eles\"); carta ao bispo nos Correios; última página do caderno de toques; de perto, alguém respira dentro do bronze." }),

  /* ---------------- exploração ---------------- */
  L({ id: "cemiterio", nome: "Cemitério", tipo: "explorar", eq: "", x: 745, y: 470, ly: -34,
    txt: "Muro baixo de cal e portão torto. Cruzes caídas, gavetas abertas pela correnteza e caixões espalhados, alguns vazios. Um anjo de pedra sem cabeça aponta para o centro da cidade.",
    din: [
      "Os cinco (Investigação DT 15): Rita de Cássia Moura (2/3/1974), Benedito Alves (19/3), Luzia das Neves (7/4), José Ferreira Lima (22/4), Expedito Santana (30/4).",
      "O sexto túmulo, de pedra nova, está aberto, sem nome e sem ninguém. Quem deita nele ouve sinos ao longe.",
      "Livro de visitas da capela (Investigação DT 20): \"A.\", 2 de maio: \"amanhã eu toco por eles\".",
      "Jazigo dos Tibúrcio (Crime DT 20): joias e um revólver no caixão do coronel, mas nenhum corpo. Ao lado, gavetas vazias reservadas para Celina e Maria Clara.",
      "Flores frescas nos cinco (Percepção DT 15): alguém da arena esteve aqui hoje."
    ],
    alerta: "Afunda no dia 6. Quem não anotou as datas até lá perde a pista mais fácil.",
    notas: "SEGREDO: o coronel nunca foi enterrado; o corpo está na cela trancada da Delegacia. O caixão é um enterro simbólico.\n\nCOMO DESCOBRIR: 1) caixão vazio. 2) livro de ocorrências e cela trancada da Delegacia. 3) gavetas de Celina e Maria Clara ligam ao mistério do Hotel.\n\nNo dia 6: datas no arquivo do Cartório ou no filme de 2 de maio do Cine Teatro; deitar no túmulo exige mergulhar (Fortitude DT 20)." }),

  L({ id: "correios", nome: "Correios", tipo: "explorar", eq: "", x: 390, y: 280, ly: -16,
    txt: "Agência pequena de placa amarela e azul desbotada, com uma caixa de coleta trancada na calçada. Escaninhos de madeira e sacos de lona até o teto. O último carimbo marca 02 MAI 1974.",
    din: [
      "Carta do padre ao bispo, no depósito (Investigação DT 20): o sino foi fundido com o ferro de correntes de uma fazenda escravista; ele vai tocá-lo \"até a água entender\".",
      "Escaninho de cada rua (Investigação DT 15): cartas dos moradores, cada rua um gancho.",
      "Encomendas retidas (Percepção DT 15): 1d4 sucata e um rolo de corda nova de 20 metros.",
      "Telegrama posto na caixa de coleta chega ao escaninho de outra base na manhã seguinte.",
      "Ler carta de morto: Vontade DT 15 ou passa a noite sem descanso."
    ],
    alerta: "Afunda no dia 6, com as cartas que ninguém leu.",
    notas: "SEGREDO: a caixa de coleta ainda entrega tudo, inclusive para as equipes NPC. Canal para negociar sem se encontrar e para ameaças.\n\nCOMO DESCOBRIR: 1) formulários com carimbo da data de hoje (Percepção DT 15). 2) carta posta some; a caixa aberta (Crime DT 20) está vazia. 3) na manhã seguinte, a carta chega ao destino." }),

  L({ id: "cine", nome: "Cine Teatro", tipo: "explorar", eq: "", x: 400, y: 420, ly: 24,
    txt: "Fachada art déco: CINE TEATRO BOM JESUS. Cartazes de 1974 intactos, 200 cadeiras de madeira, palco de veludo mofado e a cabine de projeção no alto. Algumas cadeiras têm roupas vazias sentadas como quem assiste.",
    din: [
      "Sessão da meia-noite: o projetor liga sozinho toda noite e passa um filme da cidade antes da enchente. O quadro da cabine mostra a programação.",
      "Noite 1 · \"As obras da barragem\" (1973): o coronel na barragem e o hotel em obras ao fundo.",
      "Noite 2 · \"Inauguração da Ponte Padre Anselmo\" (1968): o padre e cinco sineiros, a Irmandade dos Sinos.",
      "Noite 3 · \"Festa do Bom Jesus\" (1973): o andor subindo o Calvário, com uma corda de sino na base.",
      "Noite 4 · \"Sessão da Câmara\" (1972): sete mãos contra a venda das terras, duas a favor.",
      "Noite 5 · \"Os 11 anos de Clarinha\" (1973): festa no Casarão, bolo com \"14 de agosto\".",
      "Noite 6 · \"Feira de sábado\" (1974): gente do \"NÃO SAIO\" descendo potes para o porão do armazém.",
      "Lata \"2 de maio\" (Tecnologia DT 20): o padre ensaiando os sinos numa ordem que dá para contar. Pista do Sino.",
      "Coroa de espinhos de arame nas coxias: +5 na Vontade do erro durante o toque. Doces da bombonière: 1 comida.",
      "Interromper a sessão: Vontade DT 20 ou fica preso na cadeira. Teto podre em combate."
    ],
    alerta: "Afunda no dia 6, com a plateia de roupas vazias ainda sentada.",
    notas: "SEGREDO: o operador era Adauto, zelador do Hotel. O filme de 2 de maio foi feito do terraço do hotel, com a luneta, a pedido do coronel.\n\nCOMO DESCOBRIR: 1) escala na porta da cabine: só \"Adauto\". 2) a letra das etiquetas é a do diário do zelador (Investigação DT 15). 3) a grade de varanda no canto da imagem é a do terraço do Hotel." }),

  L({ id: "santa", nome: "Santa Casa", tipo: "explorar", eq: "", x: 310, y: 200, ly: -16,
    txt: "Prédio térreo comprido, varanda de colunas e jardim tomado de mato seco. Na entrada, Nossa Senhora das Dores com sete espadas no peito. Macas enferrujadas e um cheiro de éter que não vai embora.",
    din: [
      "Áreas: enfermaria de vinte leitos, farmácia, centro cirúrgico, ala trancada e capela das freiras.",
      "Farmácia (Medicina DT 20): 1d3 kits de cura, 2d6 PV cada. DT 15 acha só 1.",
      "Instrumentos cirúrgicos: +2 em Medicina; o bisturi é arma leve (1d4). Éter: derruba por 1d4 rodadas, duas doses.",
      "Prontuários (Investigação DT 20): os cinco dos túmulos morreram afogados, semanas antes da inundação, num lugar seco.",
      "Ala trancada (Crime DT 20 ou 2 sucata): um paciente vivo que não envelheceu desde 1974.",
      "Hábitos das freiras: a Romaria ignora quem os usa até falar ou atacar.",
      "Ficar ferido na enfermaria: Vontade DT 15 por hora ou 1d4 de Sanidade."
    ],
    alerta: "Afunda no dia 6. Os remédios que sobrarem vão junto.",
    notas: "SEGREDO: o padre afogou os cinco num ritual para preparar o sino, um por santo. O paciente da ala trancada era o coroinha e viu tudo.\n\nCOMO DESCOBRIR: 1) prontuários. 2) filme da Ponte no Cine Teatro (Irmandade dos Sinos). 3) o paciente conta, se solto e bem tratado (Diplomacia DT 15)." }),

  L({ id: "delegacia", nome: "Delegacia", tipo: "explorar", eq: "", x: 600, y: 410, ly: 24,
    txt: "Prédio baixo de esquina, brasão do estado e grades em todas as janelas. Um jipe sem rodas na frente. Dentro, máquina de escrever, três celas (uma trancada, com um cheiro seco de coisa velha) e um depósito de armas com porta de aço.",
    din: [
      "Livro de ocorrências (Investigação DT 20): a combinação do depósito na contracapa. Última ocorrência: \"padre se recusa a descer da torre\".",
      "Depósito de armas: duas espingardas (2d8), um revólver .38 (2d6) e munição. Armadilha na porta (Percepção DT 20, 2d8).",
      "Cela trancada (chave na gaveta, Percepção DT 15): o corpo seco do coronel Tibúrcio, virado para a janelinha da torre.",
      "No bolso do coronel: um caderninho de letra tremida e uma chave \"Suíte 1\" do Hotel Bela Vista.",
      "Armário: binóculo (o Hotel precisa para o mirante), uniforme e quepe, dois pares de algemas.",
      "Jipe (Tecnologia DT 25 + 4 sucata): funciona por um dia. O tanque ainda tem 1 galão de diesel."
    ],
    alerta: "Afunda no dia 6. Quem não levou o caderninho e a chave perde os dois para a água.",
    notas: "SEGREDO: o padre trancou o coronel na noite de 2 de maio. Ninguém voltou; ele morreu de sede olhando a torre, enquanto a família o esperava no Hotel. O caderninho é a confissão: o túnel, as cinco chaves no cofre do Casarão, \"o cofre abre com a minha Clarinha\", e que pagou para adiantar a inundação.\n\nCOMO DESCOBRIR: 1) a última ocorrência foi assinada pelo coronel, como prefeito. 2) anel e iniciais identificam o corpo. 3) o caderninho aponta para o Casarão e o Hotel. 4) o jazigo vazio confirma." }),

  L({ id: "casarao", nome: "Casarão do Coronel", tipo: "explorar", eq: "", x: 650, y: 220, ly: -16,
    txt: "O maior sobrado da cidade, portão de ferro com o monograma \"T\". Escadaria de mármore, piano aberto, lustre caído. Em todas as paredes, retratos com os rostos raspados a faca. Só um retrato está inteiro.",
    din: [
      "Áreas: salão, escritório com cofre de chão e o contrato da represa, cinco quartos (um de criança, intacto) e adega.",
      "Bilhete na gaveta do escritório (Investigação DT 15): \"Três números. O dia, o mês e o ano em que ganhei o que mais amo.\"",
      "Retrato inteiro no salão (Percepção DT 15): uma menina. Atrás: \"Maria Clara, nossa Clarinha\".",
      "Caderno de desenhos no quarto da criança (Investigação DT 15): \"Clarinha, 11 anos, 1973\", um bolo com \"14/8\" e a torre com o sino caindo.",
      "Contrato da represa (Investigação DT 15): \"o sino fica com a água\".",
      "Piano (Artes DT 20): as teclas pretas imitam os cinco sinos, na ordem.",
      "Cofre de chão: cinco chaves de ferro com nomes de santos.",
      "Adega: 2 água (vinho). Porta emparedada (2 sucata, 1 hora): 3 sucata e um castiçal (1d6).",
      "Dormir aqui: sonha que é o coronel e acorda com –1d4 de Sanidade."
    ],
    alerta: "Afunda no dia 6. O cofre abre do mesmo jeito para quem mergulhar.",
    notas: "COFRE: 14-08-62 (bilhete + retrato + caderno; ano = 1973 - 11). Outras fontes: certidão no Cartório, sessão \"Os 11 anos de Clarinha\", caderninho do coronel. A mesma combinação abre o cofre da Suíte 1.\n\nSEGREDO: as chaves abrem a grade da cripta e chegam ao Sino sem o enigma, mas sem a marca de espinhos: tocar sem a marca mata. Para ter a marca, alguém deita no túmulo do padre enquanto outro abre a grade.\n\nCOMO DESCOBRIR: nomes das chaves = fechaduras da grade; selo da coroa (\"só aceita quem foi chamado\"); Ocultismo DT 25 para entender que as duas coisas precisam ser juntas." }),

  L({ id: "ponte", nome: "Ponte Partida", tipo: "explorar", eq: "", x: 655, y: 466, anchor: "end", lx: -14, ly: 20,
    txt: "Ponte de concreto sobre o leito seco, partida no meio: dois metros de vão e seis de queda até a lama. Carros velhos e uma carroça presos no lodo embaixo. Pichado na mureta: \"NÃO SAIO\".",
    din: [
      "Pular o vão: Atletismo DT 15 (DT 20 com carga ou ferido). Cair: 2d6 e afundar na lama.",
      "Tábuas da carroça: uma passarela em 10 minutos, que pode ser retirada depois.",
      "Carros afundados (Percepção DT 15): 2 sucata por carro e 1 galão de diesel num dos tanques.",
      "Placa do pilar: \"Ponte Padre Anselmo, inaugurada em 1968\".",
      "Urubus voam em círculo sobre onde alguém morreu hoje.",
      "Combate na ponte: 1 em 6 por rodada de cair um pedaço do tabuleiro norte."
    ],
    alerta: "Gargalo entre o centro e o Cemitério. Afunda no dia 6.",
    notas: "SEGREDO: o padre explodiu a ponte com dinamite das obras da barragem, para ninguém levar os corpos dos cinco antes do ritual.\n\nCOMO DESCOBRIR: 1) ferragens estouradas para fora, com queimado (Percepção DT 20 ou Ciências DT 15). 2) pavio e caixote \"Obras da Barragem — Explosivos\" no leito (Investigação DT 15). 3) livro de tombo: \"pedi ao Senhor que me perdoe pela ponte\". 4) filme da inauguração no Cine Teatro." }),

  L({ id: "feira", nome: "A Feira", tipo: "explorar", eq: "", x: 240, y: 450, anchor: "end", lx: -12, ly: -14,
    txt: "Um largo de chão batido coberto de barracas desabadas e lama seca. Não sobrou nada à vista. No meio, um coreto de ferro; de um lado, o armazém Ananias & Filhos sem portas; do outro, o Bar do Mercado.",
    din: [
      "Áreas: largo das barracas, armazém, coreto, Bar do Mercado, cisterna seca e banca de ferragens.",
      "Em vários pontos do largo a terra embaixo das barracas está mais fofa.",
      "Porão do armazém, sob sacas mofadas (Investigação DT 20): 6 comida e 2 água lacrada.",
      "Potes enterrados no largo (Percepção DT 20, 1 hora por busca): 1d3 comida por pote, quatro potes.",
      "Cisterna seca (Atletismo DT 15 com corda): 3 comida e um lampião com querosene.",
      "Banca de ferragens (Atletismo DT 20 ou pé de cabra): 2 sucata, facões, pregos, corda.",
      "Faixa \"NÃO SAIO\" atrás do balcão do bar, com assinaturas no verso.",
      "Correr pelo largo: Acrobacia DT 15 ou 1d4 de pregos e lata."
    ],
    alerta: "A maior reserva de comida da arena, mas tudo está escondido e o largo é visível de várias bases. Afunda no dia 6.",
    notas: "SEGREDO: o Comitê do Não Saio (os nomes do cruzeiro da Fazenda) escondeu comida para resistir à desapropriação. O padre era o tesoureiro. Nunca usaram: a água chegou uma semana antes, a semana que o coronel comprou.\n\nCOMO DESCOBRIR: 1) pichação da Ponte e faixa do bar. 2) assinaturas = nomes do cruzeiro (Investigação DT 15). 3) sessão \"Feira de sábado\" no Cine Teatro. 4) caderno do comitê sob o assoalho do coreto (Percepção DT 20): mapa de todos os esconderijos (com ele, sem teste) e assinatura \"Pe. Anselmo\".\n\nNo dia 6, o porão ainda dá 1 comida por mergulho (Atletismo DT 20)." })
];
