/* Gerado a partir dos battlemaps (versão 2 dos locais). */
export const VERSAO = 1;
export const LOCAIS = [
{
"id": "hotel",
"nome": "Hotel Bela Vista",
"tipo": "base",
"eq": "Jogadores",
"agua": "Nunca afunda. No dia 6 vira ilha: só se chega nadando (Atletismo DT 15, DT 20 com equipamento) ou pela passarela da barragem (Atletismo DT 15; quem falha cai na água).",
"resumo": "Hotel de beira de lago construído antes do lago existir. Base mais espaçosa da arena: começa quase vazia e cresce conforme os jogadores consertam suas alas.",
"perigos": "Grande demais para vigiar com poucos: quatro entradas (porta principal, cozinha, garagem e passarela) e janelas de vidro no térreo. Com luz acesa, quem está lá dentro é visto da cidade. Uma escada só entre os andares: quem perde o térreo fica preso em cima.",
"segredo": "O coronel Tibúrcio construiu o hotel sabendo que a cidade ia ser alagada (o Lago Tibúrcio, com as margens vendidas em lotes). A família foi instalada na suíte na noite de 2 de maio para ver o lago nascer; o coronel nunca chegou, trancado pelo padre na Delegacia. Celina desceu com Clarinha para procurá-lo pouco antes das 3h e as duas nunca voltaram. No cofre da suíte: a carta do engenheiro dizendo que as comportas podiam fechar uma semana depois e o recibo do que o coronel pagou para adiantar a data.",
"como": [
"Placa de inauguração e livro de hóspedes levantam a pergunta: hotel de lago antes do lago, e uma família que entrou e nunca saiu.",
"O diário do zelador conta a noite de 2 de maio e diz que o coronel guardava os papéis na suíte.",
"O disco do salão de música é o ensaio do discurso de inauguração, na voz do coronel.",
"A planta da sala de leitura e a luz do gerador levam à parede do porão: atrás dela, a maquete do loteamento.",
"A chave da Suíte 1 está com o corpo do coronel, na Delegacia. Na suíte, as malas abertas e o bilhete de Celina.",
"O cofre da suíte abre com 14-08-62 (mesma combinação do Casarão): carta do engenheiro e recibo."
],
"extras": [
{
"titulo": "Melhorias",
"linhas": [
"Barricadas · 3 sucata · arrombar qualquer entrada vira Atletismo DT 20 e acorda a base.",
"Cozinha acesa · 2 sucata + lenha da Mata (Sobrevivência DT 15) · 2 comida viram 3 refeições; jantar quente dá +1d4 PV no descanso.",
"Enfermaria no quarto 1 · 1 kit de cura (Santa Casa) + roupa de cama + 1 sucata · +2 em Medicina; +1d6 PV no descanso.",
"Gerador do porão · 4 sucata + 1 galão de diesel (jipe da Delegacia ou carros da Ponte) + Tecnologia DT 20 · luz: +2 em Percepção dentro do hotel. Revela a porta emparedada do porão.",
"Mirante no terraço · 2 sucata + binóculo (Delegacia) ou luneta dos Queiroz · uma vez por dia, ver quem entra e sai de três locais. Revela que a luneta fixa apontava para a torre da Matriz.",
"Filtro de água · 3 sucata + areia do rio + carvão de Os da Floresta · 2 água da represa viram água limpa por dia (para no dia 5, quando a represa fica vermelha).",
"Horta da piscina · 2 água por dia durante 2 dias + mudas da Família Queiroz · 1 comida por dia a partir do 3º dia. Revela a placa do loteamento enterrada.",
"Despensa de conserva · 1 sucata + sal grosso dos Comensais · comida guardada não estraga.",
"Sala de leitura · 1 sucata + três livros da biblioteca dos Zahab · +2 em Investigação e Ocultismo. Revela a planta com o depósito 2.",
"Salão de música · 2 sucata + um instrumento da Romaria · uma noite de música por dia: 1d6 de Sanidade para todos. Abre o alçapão do palco (o disco).",
"Suíte 1 · a chave (bolso do coronel, Delegacia) ou Crime DT 25 + 2 sucata · melhor quarto, banheira, cofre e acesso ao terraço."
]
}
],
"pois": [
{
"n": "Livro de hóspedes",
"a": "Saguão",
"x": 16.2,
"y": 10.4,
"t": [
[
"Investigação",
15,
"Só uma reserva: \"Família Tibúrcio, Suíte 1, entrada 2/5/1974\". Sem data de saída."
]
],
"d": "A família do coronel entrou e nunca fez check-out.",
"i": [],
"k": "mistério"
},
{
"n": "Chaveiro de parede",
"a": "Saguão",
"x": 21.6,
"y": 11.3,
"t": [
[
"Investigação",
15,
"Faltam duas chaves: a da Suíte 1 e a do depósito 2 do porão."
]
],
"d": "Doze ganchos, dois vazios.",
"i": [],
"k": "mistério"
},
{
"n": "Placa de inauguração",
"a": "Fachada",
"x": 20.6,
"y": 18.8,
"t": [
[
"—",
null,
"Tirar o pano: \"Inauguração: 4 de maio de 1974\"."
]
],
"d": "Inauguração marcada para o dia seguinte à inundação. Um hotel de lago pronto antes do lago.",
"i": [],
"k": "mistério"
},
{
"n": "Diário do zelador",
"a": "Quartinho",
"x": 18.4,
"y": 5,
"t": [
[
"Investigação",
20,
"O zelador Adauto ficou no hotel durante a inundação. A família esperou o coronel na suíte; \"o padre não parou de tocar. a água obedecia ao sino\"."
]
],
"d": "Diz que o coronel guardava os papéis na suíte. A letra é a mesma das latas do Cine Teatro.",
"i": [],
"k": "pista"
},
{
"n": "Palco e gramofone",
"a": "Salão de festas",
"x": 6.2,
"y": 5.2,
"t": [
[
"—",
null,
"Gramofone de manivela, sem discos."
],
[
"Melhoria",
null,
"Com o Salão de música pronto, o alçapão embaixo do palco abre: um disco sem rótulo."
]
],
"d": "O disco é o ensaio do discurso de inauguração: \"bem-vindos às margens do Lago Tibúrcio\".",
"i": [],
"k": "mistério"
},
{
"n": "Cozinha",
"a": "Cozinha",
"x": 24,
"y": 5,
"t": [
[
"Melhoria",
null,
"Cozinha acesa: 2 sucata + lenha."
]
],
"d": "Fogão a lenha industrial e pias de inox. Porta para o pátio de serviço (entrada vulnerável).",
"i": [],
"k": "item"
},
{
"n": "Despensa",
"a": "Despensa",
"x": 23.6,
"y": 14.4,
"t": [
[
"—",
null,
"Enlatados do coquetel: 2 comida."
],
[
"Percepção",
15,
"Galões de água mineral atrás das caixas de louça: 3 água limpa."
]
],
"d": "Estoque da festa de inauguração.",
"i": [
"2 comida",
"3 água limpa"
],
"k": "item"
},
{
"n": "Piscina vazia",
"a": "Pátio",
"x": 14,
"y": 23.5,
"t": [
[
"Melhoria",
null,
"Horta da piscina (mudas dos Queiroz)."
]
],
"d": "Ao cavar o canteiro: placa \"Loteamento Praia do Lago, quadra A\".",
"i": [],
"k": "mistério"
},
{
"n": "Garagem e Kombi",
"a": "Pátio",
"x": 25.7,
"y": 22.2,
"t": [
[
"—",
null,
"Kombi sem motor. Entrada vulnerável."
]
],
"d": "Bom esconderijo; a garagem dá direto no pátio.",
"i": [],
"k": ""
},
{
"n": "Passarela da barragem",
"a": "Fundos",
"x": 19.9,
"y": 3.3,
"t": [
[
"Atletismo",
15,
"Depois do dia 6, atravessar com vento e água batendo; quem falha cai."
]
],
"d": "Liga o hotel à crista da barragem. É por onde se chega quando o hotel vira ilha.",
"i": [],
"k": "perigo"
},
{
"n": "Rouparia",
"a": "1º andar",
"x": 41,
"y": 7.4,
"t": [
[
"—",
null,
"Lençóis e cobertores para todos."
]
],
"d": "Também é requisito da Enfermaria.",
"i": [
"roupa de cama"
],
"k": "item"
},
{
"n": "Quarto 1",
"a": "1º andar",
"x": 33,
"y": 7.6,
"t": [
[
"Melhoria",
null,
"Enfermaria: kit de cura + roupa de cama + 1 sucata."
]
],
"d": "Dois leitos; vira a enfermaria da base.",
"i": [],
"k": ""
},
{
"n": "Porta da Suíte 1",
"a": "3º andar",
"x": 31.1,
"y": 14.4,
"t": [
[
"Crime",
25,
"Arrombar a fechadura (com 2 sucata, muito barulho)."
],
[
"—",
null,
"Ou usar a chave do bolso do coronel (Delegacia)."
]
],
"d": "Porta reforçada com chapa de ferro. A única parte do hotel que parece usada.",
"i": [],
"k": "mistério"
},
{
"n": "Malas e bilhete",
"a": "Suíte 1",
"x": 41.2,
"y": 12.3,
"t": [
[
"—",
null,
"Malas de Celina e Clarinha ainda abertas."
]
],
"d": "Bilhete: \"desci com a Clarinha para te procurar\".",
"i": [],
"k": "mistério"
},
{
"n": "Cofre de parede",
"a": "Suíte 1",
"x": 42.6,
"y": 16.8,
"t": [
[
"—",
null,
"Combinação 14-08-62 (data de nascimento de Clarinha)."
],
[
"Crime",
25,
"Abrir sem a combinação."
]
],
"d": "Carta do engenheiro (comportas podiam fechar uma semana depois) e o recibo do que o coronel pagou para adiantar.",
"i": [],
"k": "mistério"
},
{
"n": "Luneta fixa",
"a": "Terraço",
"x": 32.2,
"y": 21.2,
"t": [
[
"Percepção",
15,
"Ela está apontada para a torre da Matriz, não para a vista."
]
],
"d": "Foi daqui que Adauto filmou o padre na torre (filme de 2 de maio).",
"i": [],
"k": "pista"
},
{
"n": "Caixa de ferramentas",
"a": "Porão",
"x": 34.6,
"y": 32,
"t": [
[
"—",
null,
"Abrir."
]
],
"d": "2 sucata e um pé de cabra.",
"i": [
"2 sucata",
"pé de cabra"
],
"k": "item"
},
{
"n": "Gerador a diesel",
"a": "Porão",
"x": 40.9,
"y": 25.8,
"t": [
[
"Tecnologia",
20,
"Ligar (melhoria: 4 sucata + 1 galão de diesel)."
]
],
"d": "Com luz no porão aparece a marca de uma porta emparedada atrás das caldeiras.",
"i": [],
"k": ""
},
{
"n": "Parede emparedada (depósito 2)",
"a": "Porão",
"x": 37.5,
"y": 31,
"t": [
[
"—",
null,
"Quebrar: 2 sucata e uma hora de trabalho."
]
],
"d": "A maquete do loteamento, com a cidade pintada de azul.",
"i": [],
"k": "mistério"
}
],
"gw": 44,
"gh": 34,
"img": [
2200,
1700
],
"camadas": [
{
"k": "barricadas",
"nome": "Barricadas",
"req": "3 sucata · arrombar qualquer entrada vira Atletismo DT 20 e acorda a base.",
"off": [
239,
167,
1499,
1076
]
},
{
"k": "cozinha",
"nome": "Cozinha acesa",
"req": "2 sucata + lenha da Mata (Sobrevivência DT 15) · 2 comida viram 3 refeições; jantar quente dá +1d4 PV no descanso.",
"off": [
1054,
129,
1449,
599
]
},
{
"k": "enfermaria",
"nome": "Enfermaria no quarto 1",
"req": "1 kit de cura (Santa Casa) + roupa de cama + 1 sucata · +2 em Medicina; +1d6 PV no descanso.",
"off": [
1564,
343,
1748,
477
]
},
{
"k": "gerador",
"nome": "Gerador do porão",
"req": "4 sucata + 1 galão de diesel (jipe da Delegacia ou carros da Ponte) + Tecnologia DT 20 · luz: +2 em Percepção dentro do hotel. Revela a porta emparedada do porão.",
"off": [
1534,
1174,
2164,
1684
]
},
{
"k": "mirante",
"nome": "Mirante no terraço",
"req": "2 sucata + binóculo (Delegacia) ou luneta dos Queiroz · uma vez por dia, ver quem entra e sai de três locais. Revela que a luneta fixa apontava para a torre da Matriz.",
"off": [
1556,
984,
2072,
1152
]
},
{
"k": "filtro",
"nome": "Filtro de água",
"req": "3 sucata + areia do rio + carvão de Os da Floresta · 2 água da represa viram água limpa por dia (para no dia 5, quando a represa fica vermelha).",
"off": [
1140,
928,
1421,
1022
]
},
{
"k": "horta",
"nome": "Horta da piscina",
"req": "2 água por dia durante 2 dias + mudas da Família Queiroz · 1 comida por dia a partir do 3º dia. Revela a placa do loteamento enterrada.",
"off": [
458,
1063,
954,
1360
]
},
{
"k": "conserva",
"nome": "Despensa de conserva",
"req": "1 sucata + sal grosso dos Comensais · comida guardada não estraga.",
"off": [
1120,
622,
1281,
878
]
},
{
"k": "leitura",
"nome": "Sala de leitura",
"req": "1 sucata + três livros da biblioteca dos Zahab · +2 em Investigação e Ocultismo. Revela a planta com o depósito 2.",
"off": [
1757,
68,
1948,
223
]
},
{
"k": "musica",
"nome": "Salão de música",
"req": "2 sucata + um instrumento da Romaria · uma noite de música por dia: 1d6 de Sanidade para todos. Abre o alçapão do palco (o disco).",
"off": [
244,
186,
545,
849
]
},
{
"k": "suite",
"nome": "Suíte 1 aberta",
"req": "a chave (bolso do coronel, Delegacia) ou Crime DT 25 + 2 sucata · melhor quarto, banheira, cofre e acesso ao terraço.",
"off": [
1522,
534,
2167,
917
]
},
{
"k": "deposito2",
"nome": "Depósito 2 aberto",
"req": "Parede do porão quebrada: 2 sucata e uma hora de trabalho. Mostra a maquete do loteamento.",
"off": [
1765,
1434,
1972,
1684
]
}
]
},
{
"id": "fazenda",
"nome": "Fazenda Alto do Cruzeiro",
"tipo": "base",
"eq": "Família Queiroz",
"agua": "Afunda no dia 6.",
"resumo": "A única água limpa da arena e a melhor vista. Quem negocia com os Queiroz negocia sede.",
"perigos": "Everaldo atira em quem sobe o morro sem bandeira branca. A caixa d'água vê toda a cidade, mas é vista de toda a cidade. À noite o oratório acende uma vela sozinho.",
"segredo": "O poço não acaba em água: a dez metros, a corda bate em pedra lavrada. É o topo de um túnel que desce até a cripta da Matriz, bloqueado por uma grade com cinco fechaduras, uma para cada santo.",
"como": [
"Quem puxa o balde até o fim nota que a corda é longa demais para cinco metros de poço (Percepção DT 15).",
"O mapa de 1950, no sótão do Cartório, mostra um túnel ligando a Matriz à fazenda.",
"Descer o poço com corda e luz (Atletismo DT 20) leva à grade. As chaves estão no cofre do Casarão."
],
"extras": [],
"pois": [
{
"n": "Poço",
"a": "Terreiro",
"x": 10,
"y": 13,
"t": [
[
"—",
null,
"3 água limpa por dia (os Queiroz controlam a corda e o balde)."
],
[
"Percepção",
15,
"A corda é longa demais para cinco metros de poço."
],
[
"Atletismo",
20,
"Descer com corda e luz até o túnel."
]
],
"d": "Túnel até a cripta da Matriz, com a grade de cinco fechaduras.",
"i": [
"3 água limpa/dia"
],
"k": "mistério"
},
{
"n": "Luneta de latão",
"a": "Quarto do coronel",
"x": 16.8,
"y": 14,
"t": [
[
"Crime",
20,
"Abrir a fechadura do quarto."
]
],
"d": "Do alto da caixa d'água, revela o que uma equipe está fazendo agora, uma vez por dia. Serve para o mirante do Hotel.",
"i": [
"luneta"
],
"k": "item"
},
{
"n": "Feijão e rapadura",
"a": "Paiol",
"x": 35.8,
"y": 16,
"t": [
[
"Sobrevivência",
15,
"Separar o que presta."
]
],
"d": "O resto está carunchado.",
"i": [
"2 comida"
],
"k": "item"
},
{
"n": "Mudas e sementes",
"a": "Paiol",
"x": 37.5,
"y": 18.2,
"t": [
[
"—",
null,
"Latas com abóbora, feijão-de-corda e maxixe."
]
],
"d": "Moeda de troca: o Hotel precisa delas para a horta.",
"i": [
"mudas e sementes"
],
"k": "item"
},
{
"n": "Nomes no cruzeiro",
"a": "Cruzeiro",
"x": 20,
"y": 3.4,
"t": [
[
"Investigação",
15,
"Ler os nomes entalhados."
]
],
"d": "Moradores que se recusaram a sair. Cinco são os nomes dos túmulos do Cemitério, com as mesmas datas. Os mesmos nomes assinam a faixa \"NÃO SAIO\" da Feira.",
"i": [],
"k": "pista"
},
{
"n": "Oratório (fundo falso)",
"a": "Sala",
"x": 15.2,
"y": 8.8,
"t": [
[
"Percepção",
20,
"Achar o fundo falso."
]
],
"d": "Escritura: a fazenda foi do coronel Tibúrcio, dono do Casarão.",
"i": [],
"k": "mistério"
},
{
"n": "Munição .38",
"a": "Cozinha",
"x": 21.8,
"y": 8.9,
"t": [
[
"—",
null,
"Gaveta da cozinha."
]
],
"d": "12 balas. Everaldo vai querer.",
"i": [
"12 balas .38"
],
"k": "item"
},
{
"n": "Caixa d'água",
"a": "Vigia",
"x": 29,
"y": 9,
"t": [
[
"Percepção",
15,
"Do alto, ver quem sai de cada base."
]
],
"d": "Posto de vigia; quem está lá também é visto.",
"i": [],
"k": "perigo"
},
{
"n": "Casa de farinha",
"a": "Casa de farinha",
"x": 4.6,
"y": 22,
"t": [
[
"—",
null,
"Lenha seca empilhada."
]
],
"d": "Lenha para um dia (serve à cozinha do Hotel).",
"i": [
"lenha"
],
"k": "item"
}
],
"gw": 40,
"gh": 30,
"img": [
2000,
1500
]
},
{
"id": "calvario",
"nome": "Morro do Calvário",
"tipo": "base",
"eq": "A Romaria",
"agua": "Afunda no dia 6. A Romaria vai querer carregar o andor para um lugar seco: uma procissão pela cidade inteira.",
"resumo": "Santuário de romeiros: a escadaria das 14 estações sobe até um pátio murado com rancho, cozinha e cisterna, onde a Romaria vive como os peregrinos viviam nas festas do Bom Jesus.",
"perigos": "A escadaria é o único caminho fácil: quem sobe é visto desde a Estação 1 e alvejado do muro. Os fundos são pedra pura (Atletismo DT 20; queda 2d6). À noite, as velas deixam o topo visível de toda a cidade. A santa chora sangue quando um sacrifício morre.",
"segredo": "O andor tem fundo oco com a corda de Luzia, uma das cinco cordas originais dos sinos. Sem ela o enigma só se resolve com uma corda trançada com cabelo de um sacrifício. A Romaria só a entrega em troca de uma parte do corpo de um sacrifício de outra equipe.",
"como": [
"Na torre da Matriz, a corda de Luzia está faltando.",
"O cântico da Romaria fala de \"a corda que a santa guarda\" (Religião DT 15).",
"A sessão da Festa do Bom Jesus, no Cine Teatro, mostra o andor com uma corda de sino amarrada na base.",
"Perto do andor, o fundo soa oco (Percepção DT 20). Tirar à força é enfrentar a Romaria inteira."
],
"extras": [],
"pois": [
{
"n": "Estação 1 (condenação)",
"a": "Escadaria",
"x": 22,
"y": 28.8,
"t": [
[
"Percepção",
15,
"Atrás do azulejo, um sino de mão."
]
],
"d": "Tocado, avisa o topo de que alguém começou a subir.",
"i": [
"sino de mão"
],
"k": "perigo"
},
{
"n": "Estação 6 (Verônica)",
"a": "Escadaria",
"x": 18,
"y": 21.8,
"t": [
[
"Percepção",
15,
"Atrás do azulejo, um pano marcado a sangue."
]
],
"d": "O rosto de alguém da mesa: o próximo alvo de alguém.",
"i": [],
"k": ""
},
{
"n": "Estação 9 (terceira queda)",
"a": "Escadaria",
"x": 26,
"y": 18.9,
"t": [
[
"Investigação",
15,
"Esconderijo de romeiro."
]
],
"d": "Rapadura e farinha em lata.",
"i": [
"2 comida"
],
"k": "item"
},
{
"n": "Estação 12 (morte de Cristo)",
"a": "Escadaria",
"x": 13,
"y": 16.6,
"t": [
[
"Ocultismo",
20,
"O nicho é um selo de Sangue."
]
],
"d": "Quem reza ali recupera 1d6 PV, mas consome 1 água extra no dia.",
"i": [],
"k": ""
},
{
"n": "Estação 14",
"a": "Junto ao portão",
"x": 21.2,
"y": 15,
"t": [
[
"Investigação",
15,
"Desenho atrás do azulejo."
]
],
"d": "Um campanário de cabeça para baixo, com cinco cordas.",
"i": [],
"k": "pista"
},
{
"n": "Portão e muro",
"a": "Topo",
"x": 20,
"y": 14,
"t": [
[
"—",
null,
"Única entrada para quem sobe a escadaria. Seteiras para vigiar."
]
],
"d": "Inscrição: \"Pouso dos Romeiros, 1921\".",
"i": [],
"k": "perigo"
},
{
"n": "Baús do rancho",
"a": "Rancho",
"x": 9,
"y": 5.8,
"t": [
[
"—",
null,
"Abrir os baús."
]
],
"d": "Zabumba, pífano e matraca. Moeda de troca para o salão de música do Hotel.",
"i": [
"zabumba",
"pífano",
"matraca"
],
"k": "item"
},
{
"n": "Livro de cânticos",
"a": "Rancho",
"x": 18.8,
"y": 5.8,
"t": [
[
"Religião",
15,
"Ler o hino da Romaria."
]
],
"d": "Fala do \"sino que toca para dentro\" e de \"a corda que a santa guarda\".",
"i": [],
"k": "pista"
},
{
"n": "Ex-voto do padre",
"a": "Casa dos milagres",
"x": 30.9,
"y": 4.6,
"t": [
[
"Investigação",
20,
"Procurar entre os ex-votos."
]
],
"d": "Mão de cera com anel de padre. Bilhete: \"Rita abre, Expedito fecha\".",
"i": [],
"k": "pista"
},
{
"n": "Andor da santa",
"a": "Gruta",
"x": 30.5,
"y": 10.9,
"t": [
[
"Percepção",
20,
"O fundo soa oco."
]
],
"d": "Dentro, a corda de Luzia. Só sai em troca de uma parte do corpo de um sacrifício.",
"i": [
"corda de Luzia"
],
"k": "mistério"
},
{
"n": "Cisterna",
"a": "Pátio",
"x": 13,
"y": 10.3,
"t": [
[
"—",
null,
"1 água limpa por dia, até o dia 4."
]
],
"d": "Depois, só lodo vermelho.",
"i": [
"1 água/dia"
],
"k": "item"
},
{
"n": "Barracas de lembrança",
"a": "Pátio",
"x": 8.3,
"y": 9,
"t": [
[
"—",
null,
"Velas, fitas, terços e garrafas."
]
],
"d": "Luz para seis noites e 1 sucata (as caixas de lata).",
"i": [
"velas",
"1 sucata"
],
"k": "item"
}
],
"gw": 40,
"gh": 30,
"img": [
2000,
1500
]
},
{
"id": "mata",
"nome": "Mata dos Afogados",
"tipo": "base",
"eq": "Os da Floresta",
"agua": "Afunda no dia 6. Sem a mata, a Floresta vai tomar a casa de outra equipe e continuar caçando à noite.",
"resumo": "Mata fechada demais para quem não a conhece: a Floresta anda nela como em casa, e todo o resto se arrasta, se perde e é visto antes de ver.",
"perigos": "Quem não é da Floresta anda pela metade da velocidade e faz Sobrevivência DT 20 a cada hora ou se perde (sai num ponto da borda à escolha do mestre). Andar em silêncio: Furtividade DT 20 para os de fora. Emboscadas da Floresta ganham +5, e as plataformas deixam atacar de cima.",
"segredo": "A mata não é nativa: o padre Anselmo plantou uma árvore para cada família que saiu antes da inundação. As plaquinhas de latão nos troncos têm os nomes. Quem ficou não tem árvore: está no cruzeiro da Fazenda.",
"como": [
"As plaquinhas aparecem a quem procura com cuidado (Investigação DT 20).",
"Os nomes batem com os registros de mudança no porão do Cartório (Investigação DT 15).",
"No livro de tombo da Matriz: \"plantei hoje mais doze, uma por família que partiu\"."
],
"extras": [],
"pois": [
{
"n": "Objetos nos galhos",
"a": "Por toda a mata",
"x": 13,
"y": 3.5,
"t": [
[
"Percepção",
15,
"1 sucata por busca."
]
],
"d": "Às vezes algo pessoal: uma aliança com nome, uma carta, uma dentadura (ganchos para o Correios e o Cartório).",
"i": [
"1 sucata por busca"
],
"k": "item"
},
{
"n": "Lenha seca",
"a": "Por toda a mata",
"x": 17,
"y": 25,
"t": [
[
"Sobrevivência",
15,
"Juntar lenha para um dia."
]
],
"d": "O Hotel precisa dela para a cozinha.",
"i": [
"lenha"
],
"k": "item"
},
{
"n": "Carvoaria",
"a": "Carvoaria",
"x": 30,
"y": 23,
"t": [
[
"—",
null,
"Só a Floresta usa sem teste."
]
],
"d": "Carvão: moeda de troca para o filtro de água do Hotel.",
"i": [
"carvão"
],
"k": "item"
},
{
"n": "Máscara de anta",
"a": "Árvore da forca",
"x": 9.2,
"y": 17.2,
"t": [
[
"Atletismo",
20,
"Subir até o alto da árvore."
]
],
"d": "Máscara de um membro antigo da Floresta. Eles pagariam caro para tê-la de volta.",
"i": [
"máscara de anta"
],
"k": "item"
},
{
"n": "Raízes comestíveis",
"a": "Beira do rio",
"x": 35.2,
"y": 12,
"t": [
[
"Sobrevivência",
20,
"Achar e preparar."
]
],
"d": "Amargas, mas sustentam.",
"i": [
"2 comida"
],
"k": "item"
},
{
"n": "Cova rasa",
"a": "Clareira do Cervo",
"x": 23.2,
"y": 17.6,
"t": [
[
"Investigação",
20,
"Notar a terra mexida."
]
],
"d": "Corpo recente com roupas de outra época: alguém já participou de um Hexatombe aqui.",
"i": [],
"k": "mistério"
},
{
"n": "Placa da cidade",
"a": "Beira do rio",
"x": 36.7,
"y": 20.8,
"t": [
[
"—",
null,
"\"Bom Jesus do Açude, fundada em 1889\"."
]
],
"d": "O ano abre o cofre do tabelião, no Cartório.",
"i": [],
"k": "pista"
},
{
"n": "Plaquinhas de latão",
"a": "Troncos",
"x": 15,
"y": 12.5,
"t": [
[
"Investigação",
20,
"Achar os pregos engolidos pela casca."
]
],
"d": "Cada uma com um nome e um ano.",
"i": [],
"k": "mistério"
},
{
"n": "Casa arrastada",
"a": "Casa arrastada",
"x": 6.8,
"y": 8.4,
"t": [
[
"—",
null,
"Dormitório da Floresta."
]
],
"d": "Casa de dois cômodos que a enchente trouxe da cidade.",
"i": [],
"k": ""
},
{
"n": "Ônibus da linha",
"a": "Ônibus",
"x": 27,
"y": 8,
"t": [
[
"—",
null,
"Depósito e abrigo de chuva."
]
],
"d": "\"Bom Jesus – Sede\", tombado de lado.",
"i": [],
"k": ""
},
{
"n": "Plataformas nas árvores",
"a": "Copas",
"x": 12,
"y": 19,
"t": [
[
"Atletismo",
15,
"Subir pelas cordas (os de fora)."
]
],
"d": "Três tablados ligados por cordas: vigia e emboscada.",
"i": [],
"k": "perigo"
}
],
"gw": 40,
"gh": 30,
"img": [
2000,
1500
]
},
{
"id": "matadouro",
"nome": "Matadouro Municipal",
"tipo": "base",
"eq": "Os Comensais",
"agua": "Afunda no dia 6. A câmara fria fica selada debaixo d'água, e a carne continua fresca para quem mergulhar (Atletismo DT 20, segurando o fôlego).",
"resumo": "A única comida que não apodrece na arena, e o preço dela é a pergunta que ninguém quer fazer.",
"perigos": "A câmara fria tranca por fora: preso lá, Fortitude DT 15 por hora ou 1d6 PV de frio. Os Comensais caçam à noite, mas armam o curral com cordas e sinos de vaca. Combate na sala de abate pede Acrobacia DT 15 por rodada para não cair.",
"segredo": "A câmara fria é alimentada por Sangue: uma das carnes penduradas é um coração humano que ainda bate. Destruído, a comida apodrece na hora e os Comensais perdem a moeda deles.",
"como": [
"Não há fio, motor ou gerador ligado à câmara (Tecnologia DT 15).",
"No silêncio da câmara, uma batida fraca e ritmada (Percepção DT 20).",
"Seguindo o som, um embrulho de lona no gancho do fundo: o coração (Ocultismo DT 20 para entender o que ele faz).",
"O livro do fiscal mostra quem foi \"guardado\" ali na semana da inundação."
],
"extras": [],
"pois": [
{
"n": "Carne da câmara fria",
"a": "Câmara fria",
"x": 22.2,
"y": 8.9,
"t": [
[
"—",
null,
"3 comida por dia."
],
[
"Vontade",
15,
"Ao pensar no que comeu: falha perde 1d4 de Sanidade."
]
],
"d": "Quem come recupera 1d6 PV a mais no descanso.",
"i": [
"3 comida/dia"
],
"k": "item"
},
{
"n": "Embrulho no gancho do fundo",
"a": "Câmara fria",
"x": 24.6,
"y": 10.5,
"t": [
[
"Tecnologia",
15,
"Não há fonte de energia."
],
[
"Percepção",
20,
"Uma batida ritmada."
],
[
"Ocultismo",
20,
"Entender o que o coração faz."
]
],
"d": "Um coração humano que ainda bate: mantém a câmara fria.",
"i": [],
"k": "mistério"
},
{
"n": "Livro do fiscal",
"a": "Escritório",
"x": 11.7,
"y": 20,
"t": [
[
"Investigação",
20,
"Ler o último registro."
]
],
"d": "Semana da inundação: nomes de pessoas com peso. Um deles é o padre Anselmo, riscado.",
"i": [],
"k": "mistério"
},
{
"n": "Cofre do fiscal",
"a": "Escritório",
"x": 10.8,
"y": 22,
"t": [
[
"Crime",
20,
"Abrir o cofre pequeno."
]
],
"d": "Dinheiro sem valor e uma chave com etiqueta \"sacristia\": abre o armário da Matriz.",
"i": [
"chave da sacristia"
],
"k": "pista"
},
{
"n": "Facas de abate",
"a": "Sala de abate",
"x": 13.5,
"y": 13.6,
"t": [
[
"—",
null,
"Pegar."
]
],
"d": "Arma leve, dano 1d6. Duas por pessoa.",
"i": [
"facas (1d6)"
],
"k": "item"
},
{
"n": "Sal grosso",
"a": "Salgadeira",
"x": 29.8,
"y": 8.6,
"t": [
[
"—",
null,
"Sacos empilhados."
]
],
"d": "1 comida não estraga por dois dias. Moeda de troca para a despensa do Hotel.",
"i": [
"sal grosso"
],
"k": "item"
},
{
"n": "Correntes e cadeados",
"a": "Pocilgas",
"x": 22.2,
"y": 21,
"t": [
[
"—",
null,
"Para prender um sacrifício capturado."
]
],
"d": "1 sucata se desmontar.",
"i": [
"correntes",
"1 sucata"
],
"k": "item"
},
{
"n": "Curral armado",
"a": "Curral",
"x": 5,
"y": 11,
"t": [
[
"Percepção",
15,
"Notar as cordas com sinos de vaca."
]
],
"d": "Quem entra sem notar acorda a base.",
"i": [],
"k": "perigo"
},
{
"n": "Caixa d'água",
"a": "Torre",
"x": 34,
"y": 8.5,
"t": [
[
"Atletismo",
15,
"Subir a escada de ferro."
]
],
"d": "Vigia sobre o rio.",
"i": [],
"k": ""
},
{
"n": "Canaleta do rio",
"a": "Fundos",
"x": 19.5,
"y": 22,
"t": [
[
"Furtividade",
15,
"Rastejar pelo túnel baixo."
]
],
"d": "Saída de fuga até o leito seco.",
"i": [],
"k": ""
}
],
"gw": 40,
"gh": 30,
"img": [
2000,
1500
]
},
{
"id": "cartorio",
"nome": "Cartório, Biblioteca e Câmara",
"tipo": "base",
"eq": "Os Zahab",
"agua": "Afunda no dia 6. Os livros que não forem levados para o andar de cima viram papa.",
"resumo": "A memória da cidade: quem lê os livros certos sabe quem eram os mortos, onde o padre escondeu o que importa e como a cidade foi vendida às escondidas.",
"perigos": "Prédio sem defesa: muitas janelas, escada de madeira podre (Acrobacia DT 15 ou cai do 2º andar). Fogo destrói os livros e as pistas para sempre. As corujas do sótão gritam à noite. A porta interna liga Cartório e Câmara sem passar pela rua.",
"segredo": "A Câmara votou contra a venda das terras (7 a 2). O tabelião Oswaldo Brandão, pago pelo coronel, redigiu uma ata falsa com unanimidade e falsificou sete assinaturas. Arrependido, guardou uma confissão no cofre, com o dinheiro que nunca gastou.",
"como": [
"O jornal de 1972 diz que a Câmara rejeitou a venda; a ata diz que aprovou.",
"Comparando com certidões de casamento, sete assinaturas são falsas e da mesma letra (Investigação DT 20).",
"A mesma letra está nos carimbos do tabelião.",
"O cofre abre com Crime DT 20 ou 1-8-8-9 (ano do brasão e da placa na Mata).",
"A sessão da Câmara no Cine Teatro mostra sete mãos contra."
],
"extras": [],
"pois": [
{
"n": "Datas de óbito dos cinco",
"a": "Arquivo",
"x": 7.5,
"y": 4.8,
"t": [
[
"Investigação",
20,
"Achar os registros de 1974."
]
],
"d": "Confirma as datas dos túmulos. Se o Cemitério já sumiu, é a outra fonte.",
"i": [],
"k": "pista"
},
{
"n": "Certidão em branco do padre",
"a": "Sala do tabelião",
"x": 5.5,
"y": 15.8,
"t": [
[
"Investigação",
15,
"Revirar a mesa."
]
],
"d": "Certidão de óbito de Anselmo, nunca assinada: o túmulo vazio.",
"i": [],
"k": "pista"
},
{
"n": "Cofre de parede",
"a": "Sala do tabelião",
"x": 3.6,
"y": 20.6,
"t": [
[
"Crime",
20,
"Abrir."
],
[
"—",
null,
"Ou a combinação 1-8-8-9."
]
],
"d": "A confissão do tabelião e o maço de dinheiro.",
"i": [],
"k": "mistério"
},
{
"n": "Papel, tinta e lacre",
"a": "Sala do tabelião",
"x": 7.5,
"y": 18.5,
"t": [
[
"—",
null,
"Pegar."
]
],
"d": "Material para falsificar documentos ou deixar recados entre equipes.",
"i": [
"papel, tinta e lacre"
],
"k": "item"
},
{
"n": "Ata da sessão de 1972",
"a": "Gabinete",
"x": 31.5,
"y": 19.6,
"t": [
[
"Investigação",
15,
"Ler as atas."
]
],
"d": "Aprovação por unanimidade, com nove assinaturas.",
"i": [],
"k": "mistério"
},
{
"n": "Retrato do coronel",
"a": "Gabinete",
"x": 30.5,
"y": 22.6,
"t": [
[
"—",
null,
"Coronel Tibúrcio com a faixa de prefeito."
]
],
"d": "Liga o Casarão, o Hotel e a Delegacia.",
"i": [],
"k": ""
},
{
"n": "Porta interna",
"a": "Entre os prédios",
"x": 18,
"y": 10.6,
"t": [
[
"—",
null,
"Liga Cartório e Câmara."
]
],
"d": "Ponto fraco: quem entra num prédio chega ao outro sem passar pela rua.",
"i": [],
"k": "perigo"
},
{
"n": "Torre do relógio",
"a": "Torre",
"x": 20.2,
"y": 20.7,
"t": [
[
"—",
null,
"Relógio parado."
]
],
"d": "Vista para a praça da Matriz.",
"i": [],
"k": ""
},
{
"n": "Jornais \"O Açude\"",
"a": "Biblioteca",
"x": 39.9,
"y": 4,
"t": [
[
"—",
null,
"Última edição: foto da torre; o sino grande se chama \"Coroa\"."
],
[
"Investigação",
20,
"Edição de 1972: \"Câmara rejeita venda das terras por 7 votos a 2\"."
]
],
"d": "A contradição com a ata do gabinete.",
"i": [],
"k": "mistério"
},
{
"n": "Livros para o Hotel",
"a": "Biblioteca",
"x": 43.2,
"y": 5.5,
"t": [
[
"—",
null,
"Almanaque, código civil e anuário da cidade."
]
],
"d": "Moeda de troca: sala de leitura do Hotel.",
"i": [
"3 livros"
],
"k": "item"
},
{
"n": "Mapa da cidade de 1950",
"a": "Sótão",
"x": 39.5,
"y": 14.4,
"t": [
[
"Percepção",
20,
"Revirar as caixas da prefeitura."
]
],
"d": "Um túnel ligando a Matriz à fazenda no morro: o poço da Fazenda.",
"i": [],
"k": "pista"
},
{
"n": "Registros de mudança",
"a": "Porão do arquivo morto",
"x": 40.5,
"y": 24.7,
"t": [
[
"Investigação",
15,
"Com os nomes da Mata em mãos."
]
],
"d": "Quem saiu antes de 1974 e para onde: os nomes das plaquinhas.",
"i": [],
"k": "mistério"
}
],
"gw": 46,
"gh": 32,
"img": [
2300,
1600
]
},
{
"id": "matriz",
"nome": "Igreja Matriz",
"tipo": "enigma",
"eq": null,
"agua": "Nunca afunda. No dia 6 é o último chão seco, e todas as equipes vivas acabam na praça.",
"resumo": "O enigma do Sino da Coroa de Espinhos: tocar os cinco sinos na ordem Rita, Benedito, Luzia, José, Expedito, três vezes, às 3h, enquanto alguém está deitado no túmulo vazio do padre.",
"perigos": "Cada sequência errada faz um sino tocar sozinho num ponto aleatório da arena: todas as equipes ouvem, e quem está na torre faz Vontade DT 20 ou perde 1d6 de Sanidade.",
"segredo": "O padre Anselmo está dentro do sino. Quem toca ganha o poder, mas passa a ouvir a voz dele pedindo que alguém toque por ele também.",
"como": [
"O túmulo do padre está vazio e a certidão nunca foi assinada.",
"Livro de visitas do Cemitério: \"amanhã eu toco por eles\".",
"Carta do padre ao bispo, nos Correios: tocar \"até a água entender\".",
"O caderno de toques termina com \"o toque que ninguém deu por mim\".",
"No campanário invertido, ouve-se alguém respirando dentro do bronze."
],
"extras": [
{
"titulo": "A solução",
"linhas": [
"Ordem: Rita (2/3), Benedito (19/3), Luzia (7/4), José (22/4), Expedito (30/4): datas do Cemitério, do Cartório ou do filme de 2 de maio. O ex-voto do Calvário confirma o primeiro e o último.",
"Três vezes, porque o relógio parou nas 3h.",
"Às 3h da madrugada (o retrato da sacristia). Fora dessa hora os sinos não soam.",
"Alguém deitado no túmulo vazio do padre, no Cemitério, durante o toque.",
"A corda de Luzia no lugar (ou uma trançada com cabelo de um sacrifício).",
"Acertar: a coroa do piso afunda numa escada em espiral até o campanário invertido. Quem estava no túmulo sai com a marca de espinhos: só ele pode tocar o Sino sem morrer."
]
}
],
"pois": [
{
"n": "Caderno de toques do padre",
"a": "Sacristia",
"x": 24.7,
"y": 4.2,
"t": [
[
"—",
null,
"Chave do cofre do Matadouro."
],
[
"Crime",
25,
"Forçar o armário."
]
],
"d": "Cada toque da cidade como sequência de sinos. Última página: \"o toque que ninguém deu por mim\", sem a sequência.",
"i": [],
"k": "pista"
},
{
"n": "Retrato do padre",
"a": "Sacristia",
"x": 25.1,
"y": 5.9,
"t": [
[
"Percepção",
20,
"Olhar atrás da moldura."
]
],
"d": "3 de maio de 1974, 3h: a hora do toque.",
"i": [],
"k": "pista"
},
{
"n": "Livro de tombo",
"a": "Sacristia",
"x": 22.6,
"y": 3.7,
"t": [
[
"Investigação",
15,
"Ler as notas do padre."
]
],
"d": "As árvores da Mata (uma por família que partiu) e \"pedi ao Senhor que me perdoe pela ponte\".",
"i": [],
"k": "mistério"
},
{
"n": "Coroa no piso",
"a": "Nave",
"x": 14,
"y": 11.2,
"t": [
[
"Ocultismo",
20,
"Ler o selo."
]
],
"d": "O piso abre para baixo quando o toque certo terminar. O Sino \"só aceita quem foi chamado\".",
"i": [],
"k": "pista"
},
{
"n": "Hóstias",
"a": "Sacrário",
"x": 16.5,
"y": 3.4,
"t": [
[
"—",
null,
"Comer."
]
],
"d": "1 comida. Quem come tem visão de uma pista ainda não achada (à escolha do mestre).",
"i": [
"1 comida"
],
"k": "item"
},
{
"n": "Grade da cripta",
"a": "Atrás do altar",
"x": 11.5,
"y": 2.4,
"t": [
[
"—",
null,
"Cinco fechaduras, uma por santo."
]
],
"d": "As chaves estão no cofre do Casarão. Do outro lado, o túnel até o poço da Fazenda.",
"i": [],
"k": "mistério"
},
{
"n": "Santos sem rosto",
"a": "Altares laterais",
"x": 7.6,
"y": 8,
"t": [
[
"—",
null,
"Imagens de Rita, Benedito, Luzia, José e Expedito, com os rostos lavados pela água."
]
],
"d": "Os nomes dos sinos.",
"i": [],
"k": ""
},
{
"n": "Escada da torre",
"a": "Torre",
"x": 14.6,
"y": 19.8,
"t": [
[
"—",
null,
"Escada em caracol até o campanário."
]
],
"d": "Relógio parado nas 3h.",
"i": [],
"k": "pista"
},
{
"n": "Cordas dos sinos",
"a": "Campanário",
"x": 29,
"y": 17.4,
"t": [
[
"—",
null,
"Quatro cordas. Falta a de Luzia (com a Romaria)."
]
],
"d": "Serve também uma corda trançada com cabelo de um sacrifício.",
"i": [],
"k": "pista"
}
],
"gw": 32,
"gh": 24,
"img": [
1600,
1200
]
},
{
"id": "cemiterio",
"nome": "Cemitério",
"tipo": "explorar",
"eq": null,
"agua": "Afunda no dia 6. Depois, as datas só estão no Cartório ou no filme de 2 de maio, e deitar no túmulo do padre exige mergulhar e segurar a respiração durante o toque (Fortitude DT 20).",
"resumo": "Guarda a ordem dos sinos e o túmulo vazio do padre.",
"perigos": "Os caixões abertos às vezes não estão vazios: mexer nos corpos pede Vontade DT 15 ou 1d4 de Sanidade. À noite, quem está sozinho ouve alguém chamando o próprio nome de dentro de uma gaveta.",
"segredo": "O coronel nunca foi enterrado aqui: o corpo dele está na cela trancada da Delegacia. O caixão do jazigo é um enterro simbólico, sem corpo.",
"como": [
"Abrir o caixão do coronel (Crime DT 20): vazio, só joias e revólver.",
"A última ocorrência da Delegacia e a cela trancada levam ao corpo.",
"As gavetas vazias de Celina e Maria Clara ligam o jazigo ao mistério do Hotel."
],
"extras": [],
"pois": [
{
"n": "Os cinco túmulos",
"a": "Os cinco",
"x": 12.5,
"y": 5.4,
"t": [
[
"Investigação",
15,
"Tirar a lama das lápides."
]
],
"d": "Rita de Cássia Moura (2/3/1974), Benedito Alves (19/3), Luzia das Neves (7/4), José Ferreira Lima (22/4), Expedito Santana (30/4).",
"i": [],
"k": "pista"
},
{
"n": "Túmulo vazio (o sexto)",
"a": "O sexto",
"x": 13.5,
"y": 9.7,
"t": [
[
"Ocultismo",
20,
"Entender para quem era."
]
],
"d": "Preparado para o padre, nunca enterrado. Quem deita nele ouve sinos ao longe. É onde alguém precisa estar durante o toque.",
"i": [],
"k": "pista"
},
{
"n": "Livro de visitas",
"a": "Capela mortuária",
"x": 4.3,
"y": 18,
"t": [
[
"Investigação",
20,
"Achar a última visita."
]
],
"d": "\"A.\", na noite de 2 de maio: \"amanhã eu toco por eles\".",
"i": [],
"k": "pista"
},
{
"n": "Jazigo dos Tibúrcio",
"a": "Quadra das famílias",
"x": 23.5,
"y": 4.5,
"t": [
[
"Crime",
20,
"Abrir o caixão do coronel."
]
],
"d": "Joias e um revólver, sem corpo. Ao lado, duas gavetas reservadas e vazias: Celina e Maria Clara.",
"i": [
"joias",
"revólver"
],
"k": "mistério"
},
{
"n": "Flores frescas",
"a": "Os cinco",
"x": 15.4,
"y": 6.7,
"t": [
[
"Percepção",
15,
"Seguir as pegadas."
]
],
"d": "Alguém já esteve aqui hoje: as pegadas levam a uma base (à escolha do mestre).",
"i": [],
"k": ""
},
{
"n": "Caixões espalhados",
"a": "Entre os túmulos",
"x": 7,
"y": 8,
"t": [
[
"Vontade",
15,
"Mexer nos corpos: falha perde 1d4 de Sanidade."
]
],
"d": "Alguns estão vazios. Outros não.",
"i": [],
"k": "perigo"
},
{
"n": "Anjo sem cabeça",
"a": "Centro",
"x": 14.2,
"y": 15,
"t": [
[
"—",
null,
"Aponta para o centro da cidade."
]
],
"d": "Aponta para a Matriz.",
"i": [],
"k": ""
}
],
"gw": 30,
"gh": 22,
"img": [
1500,
1100
]
},
{
"id": "correios",
"nome": "Correios",
"tipo": "explorar",
"eq": null,
"agua": "Afunda no dia 6. No dia 5 a umidade sobe pelo chão e os sacos de baixo começam a mofar.",
"resumo": "A caixa de segredos da arena: milhares de cartas de 1974 que nunca saíram e uma caixa de coleta que ainda entrega o que se põe nela.",
"perigos": "Ler a correspondência de um morto pede Vontade DT 15 ou a noite é passada sonhando a vida dele, sem descanso. Os sacos do topo caem em quem puxa os de baixo (Reflexos DT 15 ou 1d6).",
"segredo": "A caixa de coleta funciona para o ritual: tudo que é posto ali chega ao destino, inclusive bilhetes para equipes NPC. Canal para negociar sem se encontrar e para as equipes mandarem ameaças.",
"como": [
"Os formulários de telegrama têm um carimbo novo, com a data de hoje (Percepção DT 15).",
"Uma carta posta na caixa some; quem a abre (Crime DT 20) a acha vazia.",
"Na manhã seguinte a carta aparece no destino."
],
"extras": [],
"pois": [
{
"n": "Carta do padre Anselmo",
"a": "Depósito",
"x": 9,
"y": 6,
"t": [
[
"Investigação",
20,
"Achar entre milhares de cartas."
]
],
"d": "Ao bispo: o sino foi fundido com o ferro das correntes de uma antiga fazenda escravista, e ele vai tocá-lo \"até a água entender\".",
"i": [],
"k": "pista"
},
{
"n": "Escaninhos das ruas",
"a": "Triagem",
"x": 19.5,
"y": 12.4,
"t": [
[
"Investigação",
15,
"Pesquisar uma rua."
]
],
"d": "Cada rua rende um gancho: uma promessa, uma dívida, um amor que ficou para trás.",
"i": [],
"k": ""
},
{
"n": "Encomendas retidas",
"a": "Depósito",
"x": 21.5,
"y": 4.4,
"t": [
[
"Percepção",
15,
"Abrir os pacotes."
]
],
"d": "Ferramentas, peças de rádio, pilhas mortas e um rolo de corda nova de 20 m.",
"i": [
"1d4 sucata",
"corda (20 m)"
],
"k": "item"
},
{
"n": "Telegramas em branco",
"a": "Balcão",
"x": 7,
"y": 11.8,
"t": [
[
"—",
null,
"Pegar."
],
[
"Percepção",
15,
"Notar o carimbo com a data de hoje."
]
],
"d": "Uma mensagem posta na caixa chega ao escaninho de outra base na manhã seguinte.",
"i": [
"telegramas"
],
"k": "mistério"
},
{
"n": "Lacres de chumbo",
"a": "Depósito",
"x": 14,
"y": 8,
"t": [
[
"—",
null,
"Pegar."
]
],
"d": "",
"i": [
"1 sucata"
],
"k": "item"
},
{
"n": "Caixa de coleta",
"a": "Calçada",
"x": 12,
"y": 17.5,
"t": [
[
"Crime",
20,
"Abrir a caixa (está sempre vazia)."
]
],
"d": "O que se põe nela chega ao destino.",
"i": [],
"k": "mistério"
},
{
"n": "Sacos empilhados",
"a": "Depósito",
"x": 15.5,
"y": 4.5,
"t": [
[
"Reflexos",
15,
"Quando caem: falha toma 1d6."
]
],
"d": "",
"i": [],
"k": "perigo"
}
],
"gw": 30,
"gh": 22,
"img": [
1500,
1100
]
},
{
"id": "cine",
"nome": "Cine Teatro",
"tipo": "explorar",
"eq": null,
"agua": "Afunda no dia 6. Na noite do dia 5 a muralha borbulha tão perto que o som do filme se mistura com o da água.",
"resumo": "Mostra o passado: cada noite passa um filme da cidade antes da enchente, e quase todos escondem uma pista de outro local.",
"perigos": "As roupas vazias na plateia viram a cabeça para quem anda no corredor. Interromper a sessão da meia-noite (acender luz, falar alto): Vontade DT 20 ou fica preso na cadeira até o fim. Teto podre: em combate, 1 em 6 por rodada de cair uma viga (2d6 numa área).",
"segredo": "O operador do projetor era Adauto, o zelador do Hotel. O filme de 2 de maio foi feito por ele do terraço do hotel, com a luneta adaptada à câmera, apontada para a torre a pedido do coronel.",
"como": [
"A escala colada na porta da cabine tem um só nome: Adauto.",
"O diário do zelador (Hotel) tem a mesma letra das etiquetas das latas (Investigação DT 15).",
"No filme de 2 de maio aparece a grade de ferro de uma varanda: o terraço do Hotel."
],
"extras": [
{
"titulo": "Sessões da meia-noite",
"linhas": [
"Noite 1 · Cinejornal \"As obras da barragem\" (1973) · o coronel na barragem; atrás, o Hotel em obras: \"futuras margens do Lago Tibúrcio\". → Hotel",
"Noite 2 · \"Inauguração da Ponte Padre Anselmo\" (1968) · o padre e os cinco com fitas de sineiro: a Irmandade dos Sinos. → enigma e Ponte",
"Noite 3 · \"Festa do Bom Jesus\" (1973) · o andor subindo o Calvário com uma corda de sino na base. → corda de Luzia",
"Noite 4 · \"Sessão da Câmara\" (1972) · sete mãos contra a venda, duas a favor. → Cartório",
"Noite 5 · \"Os 11 anos de Clarinha\" (ago. 1973) · festa no Casarão; o bolo diz 14 de agosto. → cofres",
"Noite 6 · \"Feira de sábado\" (abr. 1974) · gente com faixas de NÃO SAIO descendo potes para o porão do armazém. → Feira"
]
}
],
"pois": [
{
"n": "Projetor e sessão da meia-noite",
"a": "Cabine",
"x": 32.4,
"y": 4.8,
"t": [
[
"—",
null,
"Assistir à sessão da noite."
],
[
"Tecnologia",
20,
"Montar outra lata, só depois da sessão da noite."
]
],
"d": "O filme da noite (ver Sessões).",
"i": [],
"k": "pista"
},
{
"n": "Lata \"2 de maio\"",
"a": "Cabine",
"x": 31.8,
"y": 7.8,
"t": [
[
"Tecnologia",
20,
"Montar no projetor."
]
],
"d": "O padre na torre, ensaiando os sinos numa ordem que dá para contar. Filmado de longe, de um lugar alto.",
"i": [],
"k": "pista"
},
{
"n": "Quadro da programação",
"a": "Cabine",
"x": 34.6,
"y": 3.6,
"t": [
[
"—",
null,
"Ler."
]
],
"d": "Os títulos das seis sessões.",
"i": [],
"k": ""
},
{
"n": "Escala da cabine",
"a": "Porta da cabine",
"x": 29.8,
"y": 8.6,
"t": [
[
"Percepção",
15,
"Ler a folha colada na porta."
]
],
"d": "Um só nome em todas as sessões: Adauto.",
"i": [],
"k": "mistério"
},
{
"n": "Coroa de espinhos de arame",
"a": "Coxias",
"x": 4,
"y": 4.6,
"t": [
[
"—",
null,
"Peça de teatro."
]
],
"d": "Quem a usa durante o toque tem +5 no teste de Vontade do erro.",
"i": [
"coroa de arame"
],
"k": "item"
},
{
"n": "Doces de 1974",
"a": "Bombonière",
"x": 5,
"y": 19.8,
"t": [
[
"—",
null,
"Pegar."
]
],
"d": "Gosto de infância, mesmo para quem nunca comeu.",
"i": [
"1 comida"
],
"k": "item"
},
{
"n": "Caixa registradora",
"a": "Bilheteria",
"x": 24,
"y": 19.8,
"t": [
[
"Crime",
15,
"Abrir."
]
],
"d": "Moedas antigas e um ingresso com o nome de um personagem, para a sessão de hoje.",
"i": [
"ingresso"
],
"k": ""
},
{
"n": "Roupas vazias na plateia",
"a": "Plateia",
"x": 9,
"y": 11,
"t": [
[
"Vontade",
20,
"Se a sessão for interrompida."
]
],
"d": "Roupas sentadas na posição de quem assiste.",
"i": [],
"k": "perigo"
}
],
"gw": 36,
"gh": 26,
"img": [
1800,
1300
]
},
{
"id": "santacasa",
"nome": "Santa Casa",
"tipo": "explorar",
"eq": null,
"agua": "Afunda no dia 6. A farmácia fica nos fundos: quem chegar cedo no dia 6 ainda tem uma hora.",
"resumo": "A farmácia da arena: pouca coisa presta, mas o que presta pode decidir quem chega vivo ao dia 6.",
"perigos": "Os leitos com a forma de alguém afundam quando um ferido passa por perto. Ficar ferido na enfermaria: Vontade DT 15 por hora ou 1d4 de Sanidade. O paciente da ala trancada, se solto, segue quem o libertou e não para de falar.",
"segredo": "Os cinco mortos não morreram de doença: o padre os afogou num ritual para preparar o sino, um por santo. O paciente da ala trancada era o coroinha e viu tudo.",
"como": [
"Os prontuários dizem afogamento, num lugar seco, em datas espaçadas.",
"Os cinco aparecem como a Irmandade dos Sinos no filme da Ponte (Cine Teatro).",
"O paciente conta a história se for solto e tratado bem (Diplomacia DT 15)."
],
"extras": [],
"pois": [
{
"n": "Remédios que prestam",
"a": "Farmácia",
"x": 4.4,
"y": 10.4,
"t": [
[
"Medicina",
20,
"1d3 kits de cura."
],
[
"Medicina",
15,
"Só 1 kit."
]
],
"d": "Cada kit recupera 2d6 PV num teste de Medicina. O Hotel precisa de um para a enfermaria.",
"i": [
"1d3 kits de cura"
],
"k": "item"
},
{
"n": "Éter",
"a": "Farmácia",
"x": 8.4,
"y": 9.7,
"t": [
[
"Ciências",
15,
"Reconhecer e preparar."
]
],
"d": "Derruba uma pessoa por 1d4 rodadas (Fortitude DT 15 resiste). Duas doses.",
"i": [
"éter (2 doses)"
],
"k": "item"
},
{
"n": "Instrumentos cirúrgicos",
"a": "Centro cirúrgico",
"x": 8.6,
"y": 16.4,
"t": [
[
"—",
null,
"Bandeja."
]
],
"d": "+2 em Medicina. Um bisturi serve de arma leve (1d4).",
"i": [
"instrumentos",
"bisturi (1d4)"
],
"k": "item"
},
{
"n": "Prontuários",
"a": "Enfermaria",
"x": 16.6,
"y": 5.1,
"t": [
[
"Investigação",
20,
"Ler as fichas."
]
],
"d": "Os cinco mortos passaram aqui: afogamento, semanas antes da inundação, num lugar seco.",
"i": [],
"k": "mistério"
},
{
"n": "Leitos com a forma de alguém",
"a": "Enfermaria",
"x": 9.4,
"y": 3.5,
"t": [
[
"Vontade",
15,
"Por hora, se ferido: falha perde 1d4 de Sanidade."
]
],
"d": "Três lençóis com a forma de quem deitou.",
"i": [],
"k": "perigo"
},
{
"n": "Porta da ala trancada",
"a": "Corredor",
"x": 24,
"y": 12.5,
"t": [
[
"Crime",
20,
"Abrir o cadeado novo."
],
[
"—",
null,
"Ou quebrar com 2 sucata."
]
],
"d": "Cadeado de outra época.",
"i": [],
"k": "mistério"
},
{
"n": "Paciente que não envelheceu",
"a": "Ala trancada",
"x": 25.5,
"y": 10,
"t": [
[
"Diplomacia",
15,
"Fazer ele contar."
]
],
"d": "O coroinha de 1974. Sabe a hora do toque e quer sair.",
"i": [],
"k": "mistério"
},
{
"n": "Hábitos das freiras",
"a": "Capela",
"x": 31.2,
"y": 20.4,
"t": [
[
"—",
null,
"Vestir."
]
],
"d": "Disfarce: a Romaria ignora quem usa até que fale ou ataque.",
"i": [
"hábitos"
],
"k": "item"
},
{
"n": "Nossa Senhora das Dores",
"a": "Varanda",
"x": 17,
"y": 22.9,
"t": [
[
"—",
null,
"Sete espadas no peito."
]
],
"d": "",
"i": [],
"k": ""
}
],
"gw": 34,
"gh": 26,
"img": [
1700,
1300
]
},
{
"id": "delegacia",
"nome": "Delegacia",
"tipo": "explorar",
"eq": null,
"agua": "Afunda no dia 6. Quem não levou o caderninho e a chave perde os dois para a água.",
"resumo": "As armas da arena e um preso que nunca saiu: o corpo do coronel que vendeu a cidade, com tudo o que ele sabia num caderninho.",
"perigos": "O depósito tem uma espingarda presa à porta (Percepção DT 20 para notar; 2d8 em quem abrir sem desarmar). De esquina e gradeada: boa para se entrincheirar, péssima para fugir. Tiros ecoam pela praça.",
"segredo": "O coronel foi trancado pelo próprio padre na noite de 2 de maio, como castigo por ter vendido a cidade. Morreu de sede na cela, olhando a torre pela janelinha, enquanto a família o esperava no hotel. O caderninho é a confissão dele.",
"como": [
"A última ocorrência foi registrada pelo coronel, que assinava como prefeito.",
"A cela trancada abre com a chave da gaveta; anel e iniciais identificam o corpo.",
"O caderninho aponta para o Casarão (cofre e chaves) e para o Hotel (suíte).",
"O jazigo vazio no Cemitério confirma."
],
"extras": [],
"pois": [
{
"n": "Depósito de armas",
"a": "Depósito",
"x": 7.6,
"y": 7.2,
"t": [
[
"Crime",
25,
"Abrir sem a combinação."
],
[
"—",
null,
"Combinação na contracapa do livro."
],
[
"Percepção",
20,
"Notar a armadilha (2d8)."
]
],
"d": "Duas espingardas (2d8), um revólver .38 (2d6) e munição.",
"i": [
"2 espingardas",
"revólver .38",
"munição"
],
"k": "item"
},
{
"n": "Livro de ocorrências",
"a": "Atendimento",
"x": 7.5,
"y": 12,
"t": [
[
"Investigação",
20,
"Ler."
]
],
"d": "A combinação do depósito e a última ocorrência: \"padre se recusa a descer da torre\".",
"i": [],
"k": "pista"
},
{
"n": "Gaveta da mesa",
"a": "Atendimento",
"x": 8.6,
"y": 12.6,
"t": [
[
"Percepção",
15,
"Achar o fundo da gaveta."
]
],
"d": "A chave das celas.",
"i": [
"chave das celas"
],
"k": "item"
},
{
"n": "Algemas e chaves",
"a": "Atendimento",
"x": 5.4,
"y": 15.6,
"t": [
[
"—",
null,
"Pegar."
]
],
"d": "Dois pares. Úteis para prender um sacrifício.",
"i": [
"2 algemas"
],
"k": "item"
},
{
"n": "Armário de equipamento",
"a": "Atendimento",
"x": 13.1,
"y": 11.7,
"t": [
[
"—",
null,
"Abrir."
]
],
"d": "Binóculo militar (o Hotel precisa para o mirante) e uniforme com quepe (uma vez, um NPC obedece uma ordem simples, Diplomacia DT 15).",
"i": [
"binóculo",
"uniforme"
],
"k": "item"
},
{
"n": "Corpo do coronel Tibúrcio",
"a": "Cela trancada",
"x": 22.5,
"y": 5.8,
"t": [
[
"—",
null,
"Chave das celas."
],
[
"Investigação",
15,
"Ler o caderninho (letra tremida)."
]
],
"d": "Seco, de terno e anel de prefeito, virado para a torre. No bolso, o caderninho: o túnel, as cinco chaves no cofre do Casarão e \"o cofre abre com a minha Clarinha\". No colete, a chave da Suíte 1.",
"i": [
"caderninho",
"chave Suíte 1",
"anel de prefeito"
],
"k": "mistério"
},
{
"n": "Jipe",
"a": "Rua",
"x": 9.5,
"y": 19.6,
"t": [
[
"Tecnologia",
25,
"Consertar com 4 sucata (funciona um dia)."
],
[
"Tecnologia",
15,
"Tirar o diesel do tanque."
]
],
"d": "Atravessa a cidade em minutos, mas todo mundo ouve. O galão de diesel serve ao gerador do Hotel.",
"i": [
"1 galão de diesel"
],
"k": "item"
},
{
"n": "Poste com algema",
"a": "Pátio",
"x": 14.2,
"y": 2.4,
"t": [
[
"—",
null,
""
]
],
"d": "Muro alto; boa saída escondida.",
"i": [],
"k": ""
}
],
"gw": 30,
"gh": 22,
"img": [
1500,
1100
]
},
{
"id": "casarao",
"nome": "Casarão do Coronel",
"tipo": "explorar",
"eq": null,
"agua": "Afunda no dia 6. O cofre fica debaixo d'água, mas abre do mesmo jeito para quem mergulhar.",
"resumo": "Guarda as cinco chaves da grade da cripta, o atalho para o Sino. O cofre abre com a data de nascimento da filha do coronel, espalhada pela casa.",
"perigos": "Os retratos raspados acompanham quem passa. Quem dorme aqui sonha que é o coronel assinando o contrato e acorda com –1d4 de Sanidade e a mão suja de tinta. O lustre ainda pende por um fio: um teste de Atletismo na sala ou um tiro derruba o resto do teto.",
"segredo": "As chaves levam ao Sino sem o enigma, mas sem a marca de espinhos, e quem toca sem a marca morre na hora. A marca também vem para quem deita no túmulo do padre na mesma hora em que alguém abre a grade.",
"como": [
"Cada chave tem o nome de um santo, igual às fechaduras da grade.",
"O selo da coroa na Matriz (Ocultismo DT 20) avisa que o Sino só aceita quem foi chamado.",
"Ocultismo DT 25 para entender, antes, que túmulo e grade precisam acontecer juntos."
],
"extras": [
{
"titulo": "O cofre, passo a passo",
"linhas": [
"Bilhete: três números, o dia, o mês e o ano do que o coronel mais amava.",
"Retrato inteiro: a filha, Clarinha.",
"Caderno de desenhos: 14/8 e 11 anos em 1973 → 1962.",
"Combinação 14-08-62. Fontes alternativas: certidão no Cartório (Investigação DT 20), sessão \"Os 11 anos de Clarinha\" no Cine Teatro, caderninho do coronel na Delegacia.",
"A mesma combinação abre o cofre da Suíte 1 do Hotel."
]
}
],
"pois": [
{
"n": "Cofre de chão",
"a": "Escritório",
"x": 20.3,
"y": 9.6,
"t": [
[
"—",
null,
"Combinação 14-08-62."
],
[
"Crime",
25,
"Abrir sem a combinação."
]
],
"d": "Cinco chaves de ferro, cada uma com o nome de um santo: a grade da cripta.",
"i": [
"5 chaves da cripta"
],
"k": "mistério"
},
{
"n": "Bilhete do coronel",
"a": "Escritório",
"x": 18.6,
"y": 6.9,
"t": [
[
"Investigação",
15,
"Revirar as gavetas."
]
],
"d": "\"Três números. O dia, o mês e o ano em que ganhei o que mais amo.\"",
"i": [],
"k": "pista"
},
{
"n": "Contrato da represa",
"a": "Escritório",
"x": 23.4,
"y": 5,
"t": [
[
"Investigação",
15,
"Ler até o fim."
]
],
"d": "O coronel vendeu a cidade em 1972. Cláusula à mão: \"o sino fica com a água\".",
"i": [],
"k": "mistério"
},
{
"n": "Retrato inteiro",
"a": "Salão",
"x": 2.6,
"y": 12.8,
"t": [
[
"Percepção",
15,
"Notar o único rosto intacto."
]
],
"d": "Uma menina. Atrás da moldura: \"Maria Clara, nossa Clarinha\".",
"i": [],
"k": "pista"
},
{
"n": "Piano",
"a": "Salão",
"x": 5.8,
"y": 15.4,
"t": [
[
"Artes",
20,
"Tocar e prestar atenção."
]
],
"d": "As teclas pretas tocam sozinhas uma melodia que imita os cinco sinos: dá para perceber a ordem.",
"i": [],
"k": "pista"
},
{
"n": "Lustre caído",
"a": "Salão",
"x": 11,
"y": 14,
"t": [
[
"Atletismo",
null,
"Qualquer teste de Atletismo ou tiro na sala derruba o resto do teto."
]
],
"d": "",
"i": [],
"k": "perigo"
},
{
"n": "Caderno de desenhos",
"a": "Quarto da criança",
"x": 32,
"y": 10.6,
"t": [
[
"Investigação",
15,
"Folhear."
]
],
"d": "\"Clarinha, 11 anos, 1973\". Um bolo com velas e \"14/8\". Nas últimas páginas, a torre e o sino caindo para dentro da terra.",
"i": [],
"k": "pista"
},
{
"n": "Vinhos",
"a": "Adega",
"x": 28.5,
"y": 17.6,
"t": [
[
"—",
null,
"Pegar."
]
],
"d": "O vinho conta como bebida. Quem bebe demais tem –2 em Percepção no dia.",
"i": [
"2 água"
],
"k": "item"
},
{
"n": "Porta emparedada",
"a": "Adega",
"x": 33.9,
"y": 23,
"t": [
[
"—",
null,
"Quebrar: 2 sucata e uma hora de trabalho."
]
],
"d": "A prataria da família e um castiçal que serve de arma (1d6).",
"i": [
"3 sucata",
"castiçal (1d6)"
],
"k": "item"
}
],
"gw": 36,
"gh": 26,
"img": [
1800,
1300
]
},
{
"id": "ponte",
"nome": "Ponte Partida",
"tipo": "explorar",
"eq": null,
"agua": "Afunda no dia 6. No dia 5 a muralha está perto o bastante para escorrer pelo leito: quem cai é arrastado (sai num ponto da margem, +1d6 de dano).",
"resumo": "O gargalo entre o centro e o Cemitério: quem controla a ponte controla quem chega às datas dos túmulos.",
"perigos": "Quem cai do vão toma 2d6 e afunda na lama até a cintura (Atletismo DT 20 para sair, ou uma corda). Combate em cima da ponte: 1 em 6 por rodada de cair um pedaço do tabuleiro norte. Os dois lados se veem perfeitamente.",
"segredo": "O vão não é dano de enchente: o padre explodiu a ponte com dinamite roubada das obras da barragem, para ninguém levar os corpos dos cinco antes do ritual.",
"como": [
"As ferragens estão estouradas para fora, com marcas de queimado (Percepção DT 20 ou Ciências DT 15).",
"No leito, pavio e um caixote \"Obras da Barragem — Explosivos\" (Investigação DT 15).",
"Livro de tombo da Matriz: \"pedi ao Senhor que me perdoe pela ponte\".",
"A sessão da inauguração da ponte mostra os cinco ao lado do padre."
],
"extras": [],
"pois": [
{
"n": "O vão",
"a": "Meio da ponte",
"x": 17.3,
"y": 11.4,
"t": [
[
"Atletismo",
15,
"Pular (DT 20 com carga ou ferido); falha cai 6 m: 2d6."
]
],
"d": "Dois metros de nada sobre a lama.",
"i": [],
"k": "perigo"
},
{
"n": "Ferragens estouradas",
"a": "Pontas do vão",
"x": 15.8,
"y": 12.4,
"t": [
[
"Percepção",
20,
"Ver que estouraram para fora."
],
[
"Ciências",
15,
"Examinar de perto."
]
],
"d": "Marcas pretas de queimado: explosão, não enchente.",
"i": [],
"k": "mistério"
},
{
"n": "Tábuas da carroça",
"a": "Leito",
"x": 10,
"y": 13.3,
"t": [
[
"Atletismo",
15,
"Descer e subir com as tábuas."
]
],
"d": "Passarela sobre o vão em 10 minutos; quem montou pode retirar depois.",
"i": [
"tábuas"
],
"k": "item"
},
{
"n": "Carros afundados",
"a": "Leito",
"x": 24.6,
"y": 10.6,
"t": [
[
"Percepção",
15,
"Revirar os carros."
],
[
"Tecnologia",
15,
"Tirar diesel de um tanque."
]
],
"d": "2 sucata por carro (três carros). No porta-luvas, um mapa rodoviário com a cidade circulada.",
"i": [
"6 sucata",
"1 galão de diesel"
],
"k": "item"
},
{
"n": "Caixote de explosivos",
"a": "Leito",
"x": 21,
"y": 13.9,
"t": [
[
"Investigação",
15,
"Revirar a lama."
]
],
"d": "Restos de pavio e o carimbo \"Obras da Barragem — Explosivos\".",
"i": [],
"k": "mistério"
},
{
"n": "Placa da ponte",
"a": "Pilar central",
"x": 17.3,
"y": 12.4,
"t": [
[
"Investigação",
15,
"Ler a placa no pilar."
]
],
"d": "\"Ponte Padre Anselmo, inaugurada em 1968\".",
"i": [],
"k": ""
},
{
"n": "Ninho de urubus",
"a": "Ferragens",
"x": 18.9,
"y": 10.5,
"t": [
[
"—",
null,
"Observar."
]
],
"d": "Os urubus voam em círculo sobre onde há um corpo: sabe-se onde alguém morreu hoje.",
"i": [],
"k": ""
},
{
"n": "Pichação \"NÃO SAIO\"",
"a": "Mureta",
"x": 17.3,
"y": 5.7,
"t": [
[
"—",
null,
""
]
],
"d": "A mesma frase da faixa do Bar do Mercado, na Feira.",
"i": [],
"k": "pista"
}
],
"gw": 34,
"gh": 22,
"img": [
1700,
1100
]
},
{
"id": "feira",
"nome": "A Feira",
"tipo": "explorar",
"eq": null,
"agua": "Afunda no dia 6. Quem não esvaziou os esconderijos perde a maior reserva de comida da arena; o porão do armazém ainda dá para alcançar mergulhando (Atletismo DT 20, 1 comida por mergulho).",
"resumo": "Parece saqueada e vazia, mas embaixo dela está a maior reserva de comida da cidade: o estoque escondido pelos moradores que se recusaram a sair.",
"perigos": "Tudo fica embaixo de alguma coisa: cavar e carregar leva tempo, e o largo é visível de várias bases (o mestre pode rolar se uma equipe NPC aparece). Pregos e lata cortada: correr pelo largo pede Acrobacia DT 15 ou 1d4. A tampa da cisterna faz barulho de sino ao bater.",
"segredo": "Em 1973 os moradores que não queriam sair formaram o Comitê do Não Saio e esconderam comida para meses de resistência. Os nomes são os do cruzeiro da Fazenda, e o padre era o tesoureiro. A comida nunca foi usada, porque a água chegou uma semana antes.",
"como": [
"A pichação da Ponte e a faixa do Bar mostram um movimento organizado.",
"As assinaturas da faixa batem com o cruzeiro da Fazenda (Investigação DT 15).",
"A sessão \"Feira de sábado\" mostra gente descendo potes para o armazém.",
"O caderno do coreto confirma tudo, assinado \"Pe. Anselmo\".",
"Quem conhece o segredo do Hotel entende: a semana a menos foi a que o coronel comprou."
],
"extras": [],
"pois": [
{
"n": "Caderno do comitê",
"a": "Coreto",
"x": 18,
"y": 12,
"t": [
[
"Percepção",
20,
"Achar as tábuas soltas do assoalho."
]
],
"d": "Contas do \"Comitê do Não Saio\" e o mapa dos esconderijos: com ele, todos os outros se acham sem teste.",
"i": [
"mapa dos esconderijos"
],
"k": "mistério"
},
{
"n": "Alçapão do armazém",
"a": "Armazém",
"x": 3.1,
"y": 14.4,
"t": [
[
"Investigação",
20,
"Achar o alçapão sob as sacas mofadas."
]
],
"d": "O esconderijo principal: rapadura, farinha em lata, charque.",
"i": [
"6 comida",
"2 água"
],
"k": "item"
},
{
"n": "Potes enterrados",
"a": "Largo",
"x": 13,
"y": 18.5,
"t": [
[
"Percepção",
20,
"Terra fofa; uma hora por busca."
]
],
"d": "Mel lacrado e feijão em lata. Quatro potes no largo.",
"i": [
"1d3 comida por pote"
],
"k": "item"
},
{
"n": "Cisterna seca",
"a": "Cisterna",
"x": 28,
"y": 17.2,
"t": [
[
"Atletismo",
15,
"Descer com corda."
]
],
"d": "Caixotes de lata vedados e um lampião com querosene.",
"i": [
"3 comida",
"lampião"
],
"k": "item"
},
{
"n": "Banca de ferragens",
"a": "Ferragens",
"x": 26.5,
"y": 12.6,
"t": [
[
"Atletismo",
20,
"Forçar a porta (ou pé de cabra)."
]
],
"d": "Facões, pregos, corda e lampião em bom estado.",
"i": [
"2 sucata",
"equipamento comum"
],
"k": "item"
},
{
"n": "Faixa \"NÃO SAIO\"",
"a": "Bar do Mercado",
"x": 30.5,
"y": 4.1,
"t": [
[
"—",
null,
"Enrolada atrás do balcão."
]
],
"d": "No verso, as assinaturas dos que ficaram.",
"i": [],
"k": "mistério"
},
{
"n": "Largo das barracas",
"a": "Largo",
"x": 22,
"y": 15,
"t": [
[
"Acrobacia",
15,
"Correr pelo largo: falha toma 1d4."
]
],
"d": "Pregos e lata cortada embaixo das lonas.",
"i": [],
"k": "perigo"
}
],
"gw": 34,
"gh": 26,
"img": [
1700,
1300
]
}
];
