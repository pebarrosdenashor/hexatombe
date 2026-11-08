/* Gerado a partir dos battlemaps (versão 2 dos locais; mapas redesenhados em 08/11/2026). */
export const VERSAO = 2;
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
"b": "Um livro grosso de capa de couro aberto sobre o balcão da recepção.",
"a": "Saguão",
"x": 16.2,
"y": 10.4,
"t": [
[
"Percepção",
5,
"Quase todas as páginas estão em branco. Só há uma reserva escrita."
],
[
"Investigação",
15,
"A reserva diz: \"Família Tibúrcio, Suíte 1, entrada 2/5/1974\". Não há data de saída."
]
],
"d": "A família do coronel entrou no hotel na noite de 2 de maio, véspera da inundação, e nunca fez check-out. É o primeiro fio do mistério do hotel: leva à Suíte 1 e ao paradeiro de Celina e Clarinha.",
"i": [],
"k": "mistério"
},
{
"n": "Chaveiro de parede",
"b": "Um quadro de madeira com ganchos para as chaves dos quartos, atrás do balcão.",
"a": "Saguão",
"x": 21.6,
"y": 11.3,
"t": [
[
"Percepção",
10,
"São doze ganchos. Dois estão vazios."
],
[
"Investigação",
15,
"Pelas etiquetas, faltam a chave da Suíte 1 e a do depósito 2 do porão."
]
],
"d": "A chave da Suíte 1 está no colete do coronel, morto na cela da Delegacia. A do depósito 2 não existe mais: o depósito foi emparedado (ver a parede do porão, que aparece com o gerador ligado).",
"i": [],
"k": "mistério"
},
{
"n": "Placa de inauguração",
"b": "Uma placa de bronze na fachada, coberta por um pano amarrado.",
"a": "Fachada",
"x": 20.6,
"y": 18.8,
"t": [
[
"Percepção",
5,
"Sob o pano se lê: \"Inauguração: 4 de maio de 1974\"."
]
],
"d": "Basta tirar o pano. A inauguração estava marcada para o dia seguinte à inundação: o hotel de lago ficou pronto antes do lago existir. Serve para levantar a pergunta de quem sabia, com antecedência, que a cidade ia afundar.",
"i": [],
"k": "mistério"
},
{
"n": "Diário do zelador",
"b": "Um caderno de capa dura, gasto, escondido debaixo do colchão do quartinho de serviço.",
"a": "Quartinho",
"x": 18.4,
"y": 5,
"t": [
[
"Percepção",
10,
"A letra é miúda e caprichada. O caderno é do zelador, Adauto."
],
[
"Investigação",
20,
"Adauto ficou no hotel durante a inundação. A família esperou o coronel na suíte, e ele escreveu: \"o padre não parou de tocar. a água obedecia ao sino\"."
]
],
"d": "O diário diz que o coronel guardava os papéis na suíte, o que aponta para o cofre da Suíte 1. A letra é a mesma das etiquetas das latas de filme do Cine Teatro: foi Adauto quem filmou o padre na torre (lata \"2 de maio\").",
"i": [],
"k": "pista"
},
{
"n": "Palco e gramofone",
"b": "Um palco baixo no fundo do salão de festas, com um gramofone de manivela em cima.",
"a": "Salão de festas",
"x": 6.2,
"y": 5.2,
"t": [
[
"Percepção",
5,
"O gramofone funciona, mas não há nenhum disco no salão."
],
[
"Percepção",
15,
"As tábuas no centro do palco têm uma fresta reta, como uma tampa."
]
],
"d": "A fresta é um alçapão travado por dentro. Ele só abre depois que os jogadores montam a melhoria Salão de música (2 sucata + um instrumento da Romaria). Lá dentro há um disco sem rótulo: o ensaio do discurso de inauguração, na voz do coronel, que diz \"bem-vindos às margens do Lago Tibúrcio\".",
"i": [],
"k": "mistério"
},
{
"n": "Cozinha",
"b": "Uma cozinha industrial com fogão a lenha e pias de inox, fria e empoeirada.",
"a": "Cozinha",
"x": 24,
"y": 5,
"t": [
[
"Percepção",
10,
"A porta dos fundos dá para o pátio de serviço e não tem tranca boa."
]
],
"d": "A porta é uma das quatro entradas vulneráveis do hotel. Com a melhoria Cozinha acesa (2 sucata + lenha da Mata), 2 comida viram 3 refeições e um jantar quente dá +1d4 PV no descanso.",
"i": [],
"k": "item"
},
{
"n": "Despensa",
"b": "Prateleiras com caixas de louça e enlatados da festa de inauguração.",
"a": "Despensa",
"x": 23.6,
"y": 14.4,
"t": [
[
"Percepção",
5,
"Há enlatados do coquetel: o equivalente a 2 comida."
],
[
"Percepção",
15,
"Atrás das caixas de louça há galões de água mineral lacrados: 3 água limpa."
]
],
"d": "Estoque da festa que nunca aconteceu. Os enlatados estão à vista; os galões só aparecem para quem passa no teste.",
"i": [
"2 comida",
"3 água limpa"
],
"k": "item"
},
{
"n": "Piscina vazia",
"b": "Uma piscina azulejada, seca, com folhas e terra acumuladas no fundo.",
"a": "Pátio",
"x": 14,
"y": 23.5,
"t": [
[
"Percepção",
10,
"A terra do fundo é boa e funda o bastante para plantar."
]
],
"d": "Com a melhoria Horta da piscina (2 água por dia durante 2 dias + mudas da Família Queiroz), a horta dá 1 comida por dia a partir do 3º dia. Ao cavar o canteiro, aparece uma placa enterrada: \"Loteamento Praia do Lago, quadra A\".",
"i": [],
"k": "mistério"
},
{
"n": "Garagem e Kombi",
"b": "Uma garagem aberta para o pátio, com uma Kombi parada dentro.",
"a": "Pátio",
"x": 25.7,
"y": 22.2,
"t": [
[
"Percepção",
5,
"A Kombi está sem motor."
],
[
"Percepção",
10,
"O portão da garagem não fecha direito: é uma entrada fácil para o hotel."
]
],
"d": "A Kombi não anda, mas é um bom esconderijo. A garagem dá direto no pátio e é uma das quatro entradas vulneráveis.",
"i": [],
"k": ""
},
{
"n": "Passarela da barragem",
"b": "Uma passarela estreita de concreto que liga os fundos do hotel à barragem.",
"a": "Fundos",
"x": 19.9,
"y": 3.3,
"t": [
[
"Percepção",
10,
"Ela leva até a crista da barragem, a única ligação do hotel por terra além da rua."
]
],
"d": "No dia 6 o hotel vira ilha e esta passarela passa a ser o único caminho seco. Atravessá-la com vento e água batendo exige Atletismo DT 15; quem falha cai na água.",
"i": [],
"k": "perigo"
},
{
"n": "Rouparia",
"b": "Um quartinho no 1º andar com prateleiras de roupa de cama.",
"a": "1º andar",
"x": 41,
"y": 7.4,
"t": [
[
"Percepção",
5,
"Lençóis e cobertores limpos, suficientes para todos."
]
],
"d": "A roupa de cama é um dos requisitos da melhoria Enfermaria (Quarto 1).",
"i": [
"roupa de cama"
],
"k": "item"
},
{
"n": "Quarto 1",
"b": "Um quarto com dois leitos de ferro, perto da escada.",
"a": "1º andar",
"x": 33,
"y": 7.6,
"t": [
[
"Percepção",
5,
"É o quarto mais perto da escada e tem boa ventilação."
]
],
"d": "Vira a enfermaria da base com a melhoria Enfermaria: 1 kit de cura (Santa Casa) + roupa de cama (Rouparia) + 1 sucata. Dá +2 em Medicina e +1d6 PV no descanso.",
"i": [],
"k": ""
},
{
"n": "Porta da Suíte 1",
"b": "Uma porta reforçada com chapa de ferro, no fim do corredor do 3º andar.",
"a": "3º andar",
"x": 31.1,
"y": 14.4,
"t": [
[
"Percepção",
10,
"Não há poeira na maçaneta: é a única parte do hotel que parece usada."
],
[
"Crime",
15,
"A fechadura é boa demais para arrombar sem fazer barulho."
]
],
"d": "A porta abre com a chave que está no colete do coronel, na Delegacia. Sem a chave, arrombar exige Crime DT 25 e 2 sucata, e o barulho se ouve no hotel inteiro.",
"i": [],
"k": "mistério"
},
{
"n": "Malas e bilhete",
"b": "Duas malas abertas sobre a cama da suíte, com roupas de mulher e de criança.",
"a": "Suíte 1",
"x": 41.2,
"y": 12.3,
"t": [
[
"Percepção",
5,
"Sobre o travesseiro há um bilhete: \"desci com a Clarinha para te procurar\"."
]
],
"d": "As malas são de Celina e Clarinha, mulher e filha do coronel. As duas desceram pouco antes das 3h para procurá-lo e nunca voltaram. As gavetas reservadas no jazigo dos Tibúrcio, no Cemitério, estão vazias.",
"i": [],
"k": "mistério"
},
{
"n": "Cofre de parede",
"b": "Um cofre embutido na parede da suíte, atrás de um quadro.",
"a": "Suíte 1",
"x": 42.6,
"y": 16.8,
"t": [
[
"Percepção",
10,
"O cofre tem segredo de seis números, em três pares."
],
[
"Crime",
25,
"É possível abrir sem a combinação, com tempo e ferramentas."
]
],
"d": "A combinação é 14-08-62, a data de nascimento de Clarinha (a mesma do cofre do Casarão). Dentro: a carta do engenheiro dizendo que as comportas podiam fechar uma semana depois e o recibo do que o coronel pagou para adiantar a data.",
"i": [],
"k": "mistério"
},
{
"n": "Luneta fixa",
"b": "Uma luneta de latão presa ao parapeito do terraço.",
"a": "Terraço",
"x": 32.2,
"y": 21.2,
"t": [
[
"Percepção",
15,
"Ela não está virada para a vista do lago: aponta para a torre da Matriz."
]
],
"d": "Foi daqui que Adauto filmou o padre na torre (lata \"2 de maio\", no Cine Teatro). A melhoria Mirante no terraço revela este detalhe automaticamente.",
"i": [],
"k": "pista"
},
{
"n": "Caixa de ferramentas",
"b": "Uma caixa de ferramentas de metal num canto do porão.",
"a": "Porão",
"x": 34.6,
"y": 32,
"t": [
[
"Percepção",
5,
"Dentro: ferramentas soltas que rendem 2 sucata e um pé de cabra."
]
],
"d": "Basta abrir. O pé de cabra ajuda a forçar portas (como a banca de ferragens da Feira).",
"i": [
"2 sucata",
"pé de cabra"
],
"k": "item"
},
{
"n": "Gerador a diesel",
"b": "Um gerador a diesel antigo, ao lado das caldeiras do porão.",
"a": "Porão",
"x": 40.9,
"y": 25.8,
"t": [
[
"Percepção",
10,
"Está sem combustível, mas parece inteiro."
],
[
"Tecnologia",
15,
"Funciona com um galão de diesel e algumas peças de reposição."
]
],
"d": "Ligar o gerador é a melhoria Gerador do porão: 4 sucata + 1 galão de diesel (jipe da Delegacia ou carros da Ponte) + Tecnologia DT 20. Dá luz ao hotel (+2 em Percepção lá dentro). Com luz no porão, aparece a marca de uma porta emparedada atrás das caldeiras.",
"i": [],
"k": ""
},
{
"n": "Parede emparedada (depósito 2)",
"b": "Uma parede de tijolos mais nova que o resto do porão, atrás das caldeiras.",
"a": "Porão",
"x": 37.5,
"y": 31,
"t": [
[
"Percepção",
10,
"O reboco é diferente e há o contorno de uma porta: era o depósito 2."
]
],
"d": "Só é notada com o gerador ligado (ou com a planta da sala de leitura). Quebrar a parede gasta 2 sucata e uma hora de trabalho. Atrás dela está a maquete do loteamento, com a cidade inteira pintada de azul.",
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
240,
168,
1508,
1092
]
},
{
"k": "cozinha",
"nome": "Cozinha acesa",
"req": "2 sucata + lenha da Mata (Sobrevivência DT 15) · 2 comida viram 3 refeições; jantar quente dá +1d4 PV no descanso.",
"off": [
1055,
130,
1448,
598
]
},
{
"k": "enfermaria",
"nome": "Enfermaria no quarto 1",
"req": "1 kit de cura (Santa Casa) + roupa de cama + 1 sucata · +2 em Medicina; +1d6 PV no descanso.",
"off": [
1565,
343,
1770,
482
]
},
{
"k": "gerador",
"nome": "Gerador do porão",
"req": "4 sucata + 1 galão de diesel (jipe da Delegacia ou carros da Ponte) + Tecnologia DT 20 · luz: +2 em Percepção dentro do hotel. Revela a porta emparedada do porão.",
"off": [
1535,
1175,
2166,
1686
]
},
{
"k": "mirante",
"nome": "Mirante no terraço",
"req": "2 sucata + binóculo (Delegacia) ou luneta dos Queiroz · uma vez por dia, ver quem entra e sai de três locais. Revela que a luneta fixa apontava para a torre da Matriz.",
"off": [
1556,
985,
2080,
1166
]
},
{
"k": "filtro",
"nome": "Filtro de água",
"req": "3 sucata + areia do rio + carvão de Os da Floresta · 2 água da represa viram água limpa por dia (para no dia 5, quando a represa fica vermelha).",
"off": [
1140,
927,
1434,
1036
]
},
{
"k": "horta",
"nome": "Horta da piscina",
"req": "2 água por dia durante 2 dias + mudas da Família Queiroz · 1 comida por dia a partir do 3º dia. Revela a placa do loteamento enterrada.",
"off": [
465,
1061,
969,
1359
]
},
{
"k": "conserva",
"nome": "Despensa de conserva",
"req": "1 sucata + sal grosso dos Comensais · comida guardada não estraga.",
"off": [
1117,
619,
1282,
881
]
},
{
"k": "leitura",
"nome": "Sala de leitura",
"req": "1 sucata + três livros da biblioteca dos Zahab · +2 em Investigação e Ocultismo. Revela a planta com o depósito 2.",
"off": [
1757,
68,
1970,
232
]
},
{
"k": "musica",
"nome": "Salão de música",
"req": "2 sucata + um instrumento da Romaria · uma noite de música por dia: 1d6 de Sanidade para todos. Abre o alçapão do palco (o disco).",
"off": [
245,
174,
544,
848
]
},
{
"k": "suite",
"nome": "Suíte 1 aberta",
"req": "a chave (bolso do coronel, Delegacia) ou Crime DT 25 + 2 sucata · melhor quarto, banheira, cofre e acesso ao terraço.",
"off": [
1523,
535,
2166,
916
]
},
{
"k": "deposito2",
"nome": "Depósito 2 aberto",
"req": "Parede do porão quebrada: 2 sucata e uma hora de trabalho. Mostra a maquete do loteamento.",
"off": [
1768,
1433,
1984,
1688
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
"b": "Um poço de pedra no meio do terreiro, com corda e balde.",
"a": "Terreiro",
"x": 10,
"y": 13,
"t": [
[
"Percepção",
5,
"A água é limpa. Os Queiroz controlam a corda e o balde."
],
[
"Percepção",
15,
"A corda é longa demais para um poço de cinco metros."
]
],
"d": "O poço dá 3 água limpa por dia a quem os Queiroz deixarem tirar. Descer com corda e luz exige Atletismo DT 20 e leva a um túnel até a cripta da Matriz, que termina na grade de cinco fechaduras.",
"i": [
"3 água limpa/dia"
],
"k": "mistério"
},
{
"n": "Luneta de latão",
"b": "Uma luneta de latão, vista pela janela de um quarto trancado.",
"a": "Quarto do coronel",
"x": 16.8,
"y": 14,
"t": [
[
"Percepção",
10,
"O quarto era do coronel e está trancado à chave."
]
],
"d": "Abrir a fechadura exige Crime DT 20. Usada do alto da caixa d'água, a luneta revela o que uma equipe está fazendo naquele momento, uma vez por dia. Também serve para a melhoria Mirante do Hotel.",
"i": [
"luneta"
],
"k": "item"
},
{
"n": "Feijão e rapadura",
"b": "Sacos de feijão e blocos de rapadura empilhados no paiol.",
"a": "Paiol",
"x": 35.8,
"y": 16,
"t": [
[
"Percepção",
5,
"Boa parte está carunchada."
],
[
"Sobrevivência",
15,
"Separando o que presta, sobram 2 comida."
]
],
"d": "Sem o teste, os personagens não conseguem separar o que é comestível.",
"i": [
"2 comida"
],
"k": "item"
},
{
"n": "Mudas e sementes",
"b": "Latas de biscoito cheias de sementes, numa prateleira do paiol.",
"a": "Paiol",
"x": 37.5,
"y": 18.2,
"t": [
[
"Percepção",
5,
"São sementes de abóbora, feijão-de-corda e maxixe, e algumas mudas."
]
],
"d": "Moeda de troca: o Hotel precisa delas para a melhoria Horta da piscina.",
"i": [
"mudas e sementes"
],
"k": "item"
},
{
"n": "Nomes no cruzeiro",
"b": "Um cruzeiro de madeira no alto do terreno, com nomes entalhados na base.",
"a": "Cruzeiro",
"x": 20,
"y": 3.4,
"t": [
[
"Percepção",
5,
"Há vários nomes entalhados a faca."
],
[
"Investigação",
15,
"São moradores que se recusaram a sair. Cinco deles têm as mesmas datas dos túmulos do Cemitério."
]
],
"d": "Os mesmos nomes assinam a faixa \"NÃO SAIO\" do Bar do Mercado, na Feira. Liga a Fazenda ao Cemitério e ao comitê de resistência.",
"i": [],
"k": "pista"
},
{
"n": "Oratório (fundo falso)",
"b": "Um oratório de madeira pintada na parede da sala.",
"a": "Sala",
"x": 15.2,
"y": 8.8,
"t": [
[
"Percepção",
20,
"O fundo do oratório é falso e se solta."
]
],
"d": "Atrás do fundo falso está a escritura da fazenda: ela foi do coronel Tibúrcio, dono do Casarão.",
"i": [],
"k": "mistério"
},
{
"n": "Munição .38",
"b": "Uma gaveta emperrada na mesa da cozinha.",
"a": "Cozinha",
"x": 21.8,
"y": 8.9,
"t": [
[
"Percepção",
5,
"Dentro há uma caixa com 12 balas .38."
]
],
"d": "Everaldo (dos Queiroz) vai querer a munição de volta.",
"i": [
"12 balas .38"
],
"k": "item"
},
{
"n": "Caixa d'água",
"b": "Uma caixa d'água sobre torre de madeira, com escada.",
"a": "Vigia",
"x": 29,
"y": 9,
"t": [
[
"Percepção",
15,
"Do alto se vê quem sai de cada base."
]
],
"d": "Bom posto de vigia, mas quem está lá em cima também é visto de longe.",
"i": [],
"k": "perigo"
},
{
"n": "Casa de farinha",
"b": "Um galpão com forno de barro, roda e prensa de farinha.",
"a": "Casa de farinha",
"x": 4.6,
"y": 22,
"t": [
[
"Percepção",
5,
"Há lenha seca empilhada num canto."
]
],
"d": "Lenha para um dia. Serve à melhoria Cozinha acesa do Hotel.",
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
"b": "Um nicho de azulejo pintado com a cena da condenação de Cristo.",
"a": "Escadaria",
"x": 22,
"y": 28.8,
"t": [
[
"Percepção",
15,
"Um azulejo está solto. Atrás dele, um sino de mão."
]
],
"d": "Tocado, o sino avisa quem está no topo de que alguém começou a subir a escadaria.",
"i": [
"sino de mão"
],
"k": "perigo"
},
{
"n": "Estação 6 (Verônica)",
"b": "Um nicho de azulejo com Verônica segurando o pano.",
"a": "Escadaria",
"x": 18,
"y": 21.8,
"t": [
[
"Percepção",
15,
"Atrás do azulejo solto há um pano dobrado, marcado com sangue."
]
],
"d": "O sangue no pano forma o rosto de um dos personagens da mesa (à escolha do mestre): alguém já o escolheu como próximo alvo.",
"i": [],
"k": ""
},
{
"n": "Estação 9 (terceira queda)",
"b": "Um nicho de azulejo com a terceira queda de Cristo.",
"a": "Escadaria",
"x": 26,
"y": 18.9,
"t": [
[
"Percepção",
10,
"A base do nicho é oca."
],
[
"Investigação",
15,
"É um esconderijo de romeiro: rapadura e farinha em lata."
]
],
"d": "O esconderijo rende 2 comida.",
"i": [
"2 comida"
],
"k": "item"
},
{
"n": "Estação 12 (morte de Cristo)",
"b": "Um nicho de azulejo com a morte de Cristo, mais escuro que os outros.",
"a": "Escadaria",
"x": 13,
"y": 16.6,
"t": [
[
"Percepção",
10,
"Há velas recentes e marcas de joelhos no chão."
],
[
"Ocultismo",
20,
"O nicho é um selo de Sangue."
]
],
"d": "Quem reza ali recupera 1d6 PV, mas consome 1 água extra naquele dia.",
"i": [],
"k": ""
},
{
"n": "Estação 14",
"b": "O último nicho da escadaria, junto ao portão do topo.",
"a": "Junto ao portão",
"x": 21.2,
"y": 15,
"t": [
[
"Percepção",
10,
"Um azulejo está solto."
],
[
"Investigação",
15,
"Atrás dele, um desenho a carvão: um campanário de cabeça para baixo, com cinco cordas."
]
],
"d": "Pista do Sino: ele está enterrado sob a Matriz e é tocado por baixo, com cinco cordas.",
"i": [],
"k": "pista"
},
{
"n": "Portão e muro",
"b": "Um muro de pedra com portão de ferro no topo do morro.",
"a": "Topo",
"x": 20,
"y": 14,
"t": [
[
"Percepção",
5,
"É a única entrada para quem sobe a escadaria. O muro tem seteiras."
],
[
"Investigação",
10,
"Inscrição sobre o portão: \"Pouso dos Romeiros, 1921\"."
]
],
"d": "Defesa natural da Romaria: das seteiras se vigia toda a escadaria.",
"i": [],
"k": "perigo"
},
{
"n": "Baús do rancho",
"b": "Baús de madeira enfileirados no rancho dos romeiros.",
"a": "Rancho",
"x": 9,
"y": 5.8,
"t": [
[
"Percepção",
5,
"Dentro há uma zabumba, um pífano e uma matraca."
]
],
"d": "Moeda de troca: a melhoria Salão de música do Hotel precisa de um instrumento da Romaria.",
"i": [
"zabumba",
"pífano",
"matraca"
],
"k": "item"
},
{
"n": "Livro de cânticos",
"b": "Um livro de cânticos de capa de pano, sobre um banco do rancho.",
"a": "Rancho",
"x": 18.8,
"y": 5.8,
"t": [
[
"Religião",
15,
"O hino da Romaria fala do \"sino que toca para dentro\" e de \"a corda que a santa guarda\"."
]
],
"d": "Aponta para a corda de Luzia, escondida no andor da santa, na Gruta.",
"i": [],
"k": "pista"
},
{
"n": "Ex-voto do padre",
"b": "Uma sala cheia de ex-votos de cera, madeira e fotografias.",
"a": "Casa dos milagres",
"x": 30.9,
"y": 4.6,
"t": [
[
"Percepção",
10,
"Há centenas de peças: cabeças, pernas, mãos, fotos de doentes."
],
[
"Investigação",
20,
"Uma mão de cera usa um anel de padre. Junto dela, um bilhete: \"Rita abre, Expedito fecha\"."
]
],
"d": "O bilhete dá o primeiro e o último sino da ordem do toque (Rita de Cássia é o primeiro dos cinco mortos; Expedito, o último).",
"i": [],
"k": "pista"
},
{
"n": "Andor da santa",
"b": "Um andor de madeira com a imagem da santa, dentro da gruta.",
"a": "Gruta",
"x": 30.5,
"y": 10.9,
"t": [
[
"Percepção",
20,
"O fundo do andor soa oco."
]
],
"d": "Dentro do fundo falso está a corda de Luzia, a que falta no campanário da Matriz. A Romaria só a entrega em troca de uma parte do corpo de um sacrifício.",
"i": [
"corda de Luzia"
],
"k": "mistério"
},
{
"n": "Cisterna",
"b": "Uma cisterna de pedra no pátio do pouso.",
"a": "Pátio",
"x": 13,
"y": 10.3,
"t": [
[
"Percepção",
5,
"Ainda tem um pouco de água limpa no fundo."
]
],
"d": "Dá 1 água limpa por dia até o dia 4. Depois disso, só sai lodo vermelho.",
"i": [
"1 água/dia"
],
"k": "item"
},
{
"n": "Barracas de lembrança",
"b": "Barracas de lembranças de romaria, com as lonas rasgadas.",
"a": "Pátio",
"x": 8.3,
"y": 9,
"t": [
[
"Percepção",
5,
"Velas, fitas, terços e garrafas de água benta."
]
],
"d": "Velas para seis noites de luz. As caixas de lata rendem 1 sucata.",
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
"b": "Galhos altos cheios de objetos presos pela enchente.",
"a": "Por toda a mata",
"x": 13,
"y": 3.5,
"t": [
[
"Percepção",
15,
"Entre os trapos há coisas úteis: 1 sucata por busca."
]
],
"d": "Às vezes aparece algo pessoal: uma aliança com nome, uma carta, uma dentadura. São ganchos para o Correios e o Cartório.",
"i": [
"1 sucata por busca"
],
"k": "item"
},
{
"n": "Lenha seca",
"b": "Galhos secos caídos por toda a mata.",
"a": "Por toda a mata",
"x": 17,
"y": 25,
"t": [
[
"Sobrevivência",
15,
"Dá para juntar lenha seca para um dia."
]
],
"d": "A melhoria Cozinha acesa do Hotel precisa dessa lenha.",
"i": [
"lenha"
],
"k": "item"
},
{
"n": "Carvoaria",
"b": "Fornos de barro em forma de colmeia, numa clareira enfumaçada.",
"a": "Carvoaria",
"x": 30,
"y": 23,
"t": [
[
"Percepção",
5,
"Há carvão pronto dentro dos fornos."
]
],
"d": "Os da Floresta usam a carvoaria sem teste; estranhos precisam da permissão deles ou de roubar. O carvão é moeda de troca para a melhoria Filtro de água do Hotel.",
"i": [
"carvão"
],
"k": "item"
},
{
"n": "Máscara de anta",
"b": "Uma árvore enorme com uma corda velha pendurada num galho alto.",
"a": "Árvore da forca",
"x": 9.2,
"y": 17.2,
"t": [
[
"Percepção",
10,
"Lá no alto, presa no galho, há uma máscara de madeira em forma de anta."
]
],
"d": "Subir até a máscara exige Atletismo DT 20. Ela pertencia a um membro antigo de Os da Floresta, que pagariam caro para tê-la de volta.",
"i": [
"máscara de anta"
],
"k": "item"
},
{
"n": "Raízes comestíveis",
"b": "Moitas de folhas largas na beira do rio seco.",
"a": "Beira do rio",
"x": 35.2,
"y": 12,
"t": [
[
"Sobrevivência",
20,
"Há raízes comestíveis enterradas. Bem preparadas, rendem 2 comida."
]
],
"d": "São amargas, mas sustentam.",
"i": [
"2 comida"
],
"k": "item"
},
{
"n": "Cova rasa",
"b": "Uma clareira silenciosa onde um cervo costuma pastar.",
"a": "Clareira do Cervo",
"x": 23.2,
"y": 17.6,
"t": [
[
"Investigação",
20,
"A terra num canto foi mexida há pouco tempo: é uma cova rasa."
]
],
"d": "Na cova há um corpo recente vestido com roupas de outra época. Alguém já participou de um Hexatombe nesta arena.",
"i": [],
"k": "mistério"
},
{
"n": "Placa da cidade",
"b": "Uma placa de ferro torta, meio enterrada na beira do rio.",
"a": "Beira do rio",
"x": 36.7,
"y": 20.8,
"t": [
[
"Percepção",
5,
"Nela se lê: \"Bom Jesus do Açude, fundada em 1889\"."
]
],
"d": "O ano 1889 é a combinação do cofre do tabelião, no Cartório (1-8-8-9).",
"i": [],
"k": "pista"
},
{
"n": "Plaquinhas de latão",
"b": "Troncos grossos com pregos enferrujados quase engolidos pela casca.",
"a": "Troncos",
"x": 15,
"y": 12.5,
"t": [
[
"Investigação",
20,
"Nos pregos há plaquinhas de latão, cada uma com um nome e um ano."
]
],
"d": "Cada árvore foi plantada por uma família que deixou a cidade. Os registros de mudança, no porão do Cartório, dizem quem são e para onde foram.",
"i": [],
"k": "mistério"
},
{
"n": "Casa arrastada",
"b": "Uma casa de dois cômodos, inteira, encalhada entre as árvores.",
"a": "Casa arrastada",
"x": 6.8,
"y": 8.4,
"t": [
[
"Percepção",
5,
"Há redes e esteiras: alguém dorme aqui."
]
],
"d": "A enchente arrastou a casa da cidade até a mata. É o dormitório de Os da Floresta.",
"i": [],
"k": ""
},
{
"n": "Ônibus da linha",
"b": "Um ônibus tombado de lado, coberto de musgo.",
"a": "Ônibus",
"x": 27,
"y": 8,
"t": [
[
"Percepção",
5,
"O letreiro diz \"Bom Jesus – Sede\". Há caixas e lonas dentro."
]
],
"d": "Os da Floresta usam o ônibus como depósito e abrigo de chuva.",
"i": [],
"k": ""
},
{
"n": "Plataformas nas árvores",
"b": "Tablados de madeira presos nas copas, ligados por cordas.",
"a": "Copas",
"x": 12,
"y": 19,
"t": [
[
"Percepção",
10,
"São três plataformas, com vista para as trilhas."
]
],
"d": "Posto de vigia e emboscada de Os da Floresta. Quem é de fora precisa de Atletismo DT 15 para subir pelas cordas. Quem está lá em cima fica escondido pelas copas (+5 em Furtividade).",
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
"b": "Uma câmara fria escura, com carcaças penduradas em ganchos.",
"a": "Câmara fria",
"x": 22.2,
"y": 8.9,
"t": [
[
"Percepção",
5,
"Está gelada, mesmo sem energia. Há carne para 3 comida por dia."
],
[
"Medicina",
15,
"Parte da carne não é de boi."
]
],
"d": "Quem come recupera 1d6 PV a mais no descanso. Quem pensa no que comeu faz Vontade DT 15; quem falha perde 1d4 de Sanidade.",
"i": [
"3 comida/dia"
],
"k": "item"
},
{
"n": "Embrulho no gancho do fundo",
"b": "Um embrulho de pano no último gancho do fundo da câmara.",
"a": "Câmara fria",
"x": 24.6,
"y": 10.5,
"t": [
[
"Percepção",
20,
"Do embrulho vem uma batida ritmada."
],
[
"Tecnologia",
15,
"Não há nenhuma fonte de energia na câmara: o frio vem de outro lugar."
],
[
"Ocultismo",
20,
"O frio da câmara vem do que está no embrulho."
]
],
"d": "Dentro há um coração humano que ainda bate. É ele que mantém a câmara fria; se for retirado, a carne apodrece em um dia.",
"i": [],
"k": "mistério"
},
{
"n": "Livro do fiscal",
"b": "Um livro de registros grosso sobre a mesa do escritório.",
"a": "Escritório",
"x": 11.7,
"y": 20,
"t": [
[
"Percepção",
5,
"Anota cabeças de gado e pesos, dia a dia."
],
[
"Investigação",
20,
"Na semana da inundação, os registros são de nomes de pessoas, com peso. Um deles é o padre Anselmo, riscado."
]
],
"d": "Mostra a origem dos Comensais e que o padre escapou do matadouro.",
"i": [],
"k": "mistério"
},
{
"n": "Cofre do fiscal",
"b": "Um cofre pequeno embaixo da mesa do fiscal.",
"a": "Escritório",
"x": 10.8,
"y": 22,
"t": [
[
"Percepção",
10,
"O cofre é antigo e de fechadura simples."
]
],
"d": "Abrir exige Crime DT 20. Dentro: dinheiro sem valor e uma chave com etiqueta \"sacristia\", que abre o armário da Matriz onde está o caderno de toques do padre.",
"i": [
"chave da sacristia"
],
"k": "pista"
},
{
"n": "Facas de abate",
"b": "Facas de abate penduradas em fila na parede.",
"a": "Sala de abate",
"x": 13.5,
"y": 13.6,
"t": [
[
"Percepção",
5,
"Estão afiadas. Há duas para cada pessoa."
]
],
"d": "Arma leve, dano 1d6.",
"i": [
"facas (1d6)"
],
"k": "item"
},
{
"n": "Sal grosso",
"b": "Sacos de sal grosso empilhados na salgadeira.",
"a": "Salgadeira",
"x": 29.8,
"y": 8.6,
"t": [
[
"Percepção",
5,
"Sal em quantidade, seco e limpo."
]
],
"d": "Cada porção de sal faz 1 comida durar dois dias sem estragar. É moeda de troca para a melhoria Despensa de conserva do Hotel.",
"i": [
"sal grosso"
],
"k": "item"
},
{
"n": "Correntes e cadeados",
"b": "Correntes e cadeados presos às grades das pocilgas.",
"a": "Pocilgas",
"x": 22.2,
"y": 21,
"t": [
[
"Percepção",
5,
"Estão em bom estado e servem para prender alguém."
]
],
"d": "Úteis para manter um sacrifício capturado. Desmontadas, rendem 1 sucata.",
"i": [
"correntes",
"1 sucata"
],
"k": "item"
},
{
"n": "Curral armado",
"b": "Um curral de madeira com cordas esticadas entre as estacas.",
"a": "Curral",
"x": 5,
"y": 11,
"t": [
[
"Percepção",
15,
"Nas cordas há sinos de vaca, armados como alarme."
]
],
"d": "Quem entra sem notar as cordas acorda a base dos Comensais.",
"i": [],
"k": "perigo"
},
{
"n": "Caixa d'água",
"b": "Uma caixa d'água sobre torre de ferro.",
"a": "Torre",
"x": 34,
"y": 8.5,
"t": [
[
"Percepção",
10,
"Do alto se vê o rio e as duas margens."
]
],
"d": "Subir a escada de ferro exige Atletismo DT 15. Bom posto de vigia sobre o rio.",
"i": [],
"k": ""
},
{
"n": "Canaleta do rio",
"b": "Uma canaleta de pedra que sai dos fundos do matadouro em direção ao rio.",
"a": "Fundos",
"x": 19.5,
"y": 22,
"t": [
[
"Percepção",
10,
"Ela forma um túnel baixo que vai até o leito seco."
]
],
"d": "Saída de fuga: rastejar pelo túnel exige Furtividade DT 15 para não ser ouvido.",
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
"b": "Estantes de livros de registro civil no arquivo.",
"a": "Arquivo",
"x": 7.5,
"y": 4.8,
"t": [
[
"Investigação",
20,
"Os registros de óbito de 1974 confirmam as datas dos cinco túmulos do Cemitério."
]
],
"d": "Se o Cemitério já tiver afundado, esta é a outra fonte para as datas que dão a ordem do toque.",
"i": [],
"k": "pista"
},
{
"n": "Certidão em branco do padre",
"b": "A mesa do tabelião, coberta de papéis amarelados.",
"a": "Sala do tabelião",
"x": 5.5,
"y": 15.8,
"t": [
[
"Investigação",
15,
"Entre os papéis, uma certidão de óbito do padre Anselmo, preenchida e nunca assinada."
]
],
"d": "Explica o túmulo vazio do Cemitério: prepararam a morte do padre, mas o corpo nunca veio.",
"i": [],
"k": "pista"
},
{
"n": "Cofre de parede",
"b": "Um cofre de parede na sala do tabelião.",
"a": "Sala do tabelião",
"x": 3.6,
"y": 20.6,
"t": [
[
"Percepção",
10,
"O segredo tem quatro dígitos."
]
],
"d": "Abre com 1-8-8-9 (ano de fundação, na placa da Mata) ou com Crime DT 20. Dentro: a confissão do tabelião e um maço de dinheiro.",
"i": [],
"k": "mistério"
},
{
"n": "Papel, tinta e lacre",
"b": "Um estojo com papel timbrado, tinteiro e bastões de lacre.",
"a": "Sala do tabelião",
"x": 7.5,
"y": 18.5,
"t": [
[
"Percepção",
5,
"O material está seco, mas ainda serve."
]
],
"d": "Serve para falsificar documentos ou deixar recados entre equipes.",
"i": [
"papel, tinta e lacre"
],
"k": "item"
},
{
"n": "Ata da sessão de 1972",
"b": "Livros de atas da Câmara, numa estante do gabinete.",
"a": "Gabinete",
"x": 31.5,
"y": 19.6,
"t": [
[
"Investigação",
15,
"A ata de 1972 aprova a venda das terras por unanimidade, com nove assinaturas."
]
],
"d": "Contradiz o jornal da Biblioteca (rejeitada por 7 a 2): a ata foi falsificada.",
"i": [],
"k": "mistério"
},
{
"n": "Retrato do coronel",
"b": "Um retrato a óleo grande na parede do gabinete.",
"a": "Gabinete",
"x": 30.5,
"y": 22.6,
"t": [
[
"Percepção",
5,
"É o coronel Tibúrcio com a faixa de prefeito."
]
],
"d": "Liga o Casarão, o Hotel e a Delegacia à mesma pessoa.",
"i": [],
"k": ""
},
{
"n": "Porta interna",
"b": "Uma porta de madeira que liga o Cartório à Câmara por dentro.",
"a": "Entre os prédios",
"x": 18,
"y": 10.6,
"t": [
[
"Percepção",
5,
"Não tem tranca dos dois lados."
]
],
"d": "Ponto fraco da base: quem entra num prédio chega ao outro sem passar pela rua.",
"i": [],
"k": "perigo"
},
{
"n": "Torre do relógio",
"b": "A torre do relógio, sobre a Câmara.",
"a": "Torre",
"x": 20.2,
"y": 20.7,
"t": [
[
"Percepção",
5,
"O relógio está parado. Do alto se vê a praça da Matriz."
]
],
"d": "Bom posto para vigiar quem entra e sai da Matriz.",
"i": [],
"k": ""
},
{
"n": "Jornais \"O Açude\"",
"b": "Pilhas de jornais \"O Açude\" amarrados com barbante.",
"a": "Biblioteca",
"x": 39.9,
"y": 4,
"t": [
[
"Percepção",
5,
"Na última edição, uma foto da torre: o sino grande se chama \"Coroa\"."
],
[
"Investigação",
20,
"Na edição de 1972: \"Câmara rejeita venda das terras por 7 votos a 2\"."
]
],
"d": "A notícia contradiz a ata do gabinete, que diz unanimidade.",
"i": [],
"k": "mistério"
},
{
"n": "Livros para o Hotel",
"b": "Uma estante de livros encharcados e alguns secos.",
"a": "Biblioteca",
"x": 43.2,
"y": 5.5,
"t": [
[
"Percepção",
5,
"Três ainda estão bons: um almanaque, um código civil e o anuário da cidade."
]
],
"d": "Moeda de troca: a melhoria Sala de leitura do Hotel precisa de três livros.",
"i": [
"3 livros"
],
"k": "item"
},
{
"n": "Mapa da cidade de 1950",
"b": "Caixas de papelão da prefeitura empilhadas no sótão.",
"a": "Sótão",
"x": 39.5,
"y": 14.4,
"t": [
[
"Percepção",
20,
"Numa caixa há um mapa da cidade de 1950, com um túnel marcado."
]
],
"d": "O túnel liga a Matriz à fazenda no morro: é o poço da Fazenda Alto do Cruzeiro.",
"i": [],
"k": "pista"
},
{
"n": "Registros de mudança",
"b": "Fichários de mudança no porão do arquivo morto.",
"a": "Porão do arquivo morto",
"x": 40.5,
"y": 24.7,
"t": [
[
"Investigação",
15,
"Com os nomes das plaquinhas da Mata em mãos, dá para achar quem saiu antes de 1974 e para onde."
]
],
"d": "Sem os nomes da Mata, o teste não tem o que procurar.",
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
"b": "Um armário de madeira trancado, na sacristia.",
"a": "Sacristia",
"x": 24.7,
"y": 4.2,
"t": [
[
"Percepção",
10,
"A fechadura é forte e o armário é pesado."
]
],
"d": "Abre com a chave da sacristia (cofre do Matadouro) ou com Crime DT 25. Dentro, o caderno de toques do padre: cada toque da cidade como sequência de sinos. A última página diz \"o toque que ninguém deu por mim\", sem a sequência.",
"i": [],
"k": "pista"
},
{
"n": "Retrato do padre",
"b": "Um retrato do padre Anselmo, de batina, na parede da sacristia.",
"a": "Sacristia",
"x": 25.1,
"y": 5.9,
"t": [
[
"Percepção",
20,
"Atrás da moldura há uma anotação: \"3 de maio de 1974, 3h\"."
]
],
"d": "É a hora exata do toque.",
"i": [],
"k": "pista"
},
{
"n": "Livro de tombo",
"b": "Um livro de tombo aberto sobre a mesa da sacristia.",
"a": "Sacristia",
"x": 22.6,
"y": 3.7,
"t": [
[
"Investigação",
15,
"Notas do padre: as árvores da Mata (uma por família que partiu) e \"pedi ao Senhor que me perdoe pela ponte\"."
]
],
"d": "Liga o padre às plaquinhas da Mata e à explosão da Ponte.",
"i": [],
"k": "mistério"
},
{
"n": "Coroa no piso",
"b": "Um mosaico em forma de coroa no piso da nave.",
"a": "Nave",
"x": 14,
"y": 11.2,
"t": [
[
"Percepção",
10,
"As pedras da coroa estão soltas, como se o piso fosse abrir."
],
[
"Ocultismo",
20,
"É um selo: o piso abre para baixo quando o toque certo terminar. O Sino \"só aceita quem foi chamado\"."
]
],
"d": "Indica o fim do ritual e onde está o Sino.",
"i": [],
"k": "pista"
},
{
"n": "Hóstias",
"b": "Um sacrário dourado no altar, com hóstias.",
"a": "Sacrário",
"x": 16.5,
"y": 3.4,
"t": [
[
"Percepção",
5,
"As hóstias estão intactas, sem mofo."
]
],
"d": "Comer conta como 1 comida. Quem come tem a visão de uma pista ainda não achada (à escolha do mestre).",
"i": [
"1 comida"
],
"k": "item"
},
{
"n": "Grade da cripta",
"b": "Uma grade de ferro atrás do altar, sobre uma escada que desce.",
"a": "Atrás do altar",
"x": 11.5,
"y": 2.4,
"t": [
[
"Percepção",
5,
"A grade tem cinco fechaduras, cada uma com o nome de um santo."
]
],
"d": "As cinco chaves estão no cofre do Casarão. Do outro lado, o túnel até o poço da Fazenda.",
"i": [],
"k": "mistério"
},
{
"n": "Santos sem rosto",
"b": "Imagens de santos nos altares laterais.",
"a": "Altares laterais",
"x": 7.6,
"y": 8,
"t": [
[
"Percepção",
5,
"Os rostos foram lavados pela água."
],
[
"Religião",
10,
"São Rita, Benedito, Luzia, José e Expedito."
]
],
"d": "Os nomes dos santos são os nomes dos sinos.",
"i": [],
"k": ""
},
{
"n": "Escada da torre",
"b": "Uma escada em caracol que sobe para a torre.",
"a": "Torre",
"x": 14.6,
"y": 19.8,
"t": [
[
"Percepção",
5,
"O relógio da torre está parado nas 3h."
]
],
"d": "Leva ao campanário e às cordas dos sinos.",
"i": [],
"k": "pista"
},
{
"n": "Cordas dos sinos",
"b": "Cordas penduradas no campanário.",
"a": "Campanário",
"x": 29,
"y": 17.4,
"t": [
[
"Percepção",
5,
"São quatro cordas. Falta uma: a de Luzia."
]
],
"d": "A corda de Luzia está com a Romaria, no andor da santa. Uma corda trançada com cabelo de um sacrifício também serve.",
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
"b": "Cinco túmulos lado a lado, cobertos de lama.",
"a": "Os cinco",
"x": 20.95,
"y": 8.65,
"t": [
[
"Investigação",
15,
"Tirando a lama: Rita de Cássia Moura (2/3/1974), Benedito Alves (19/3), Luzia das Neves (7/4), José Ferreira Lima (22/4), Expedito Santana (30/4)."
]
],
"d": "A ordem das mortes é a ordem do toque dos sinos.",
"i": [],
"k": "pista"
},
{
"n": "Túmulo vazio (o sexto)",
"b": "Um sexto túmulo aberto, sem lápide.",
"a": "O sexto",
"x": 20.95,
"y": 13.5,
"t": [
[
"Percepção",
10,
"Está vazio e nunca foi usado."
],
[
"Ocultismo",
20,
"Foi preparado para alguém que deveria morrer depois dos cinco."
]
],
"d": "Era do padre, que nunca foi enterrado. Quem deita nele ouve sinos ao longe. É onde alguém precisa estar durante o toque.",
"i": [],
"k": "pista"
},
{
"n": "Livro de visitas",
"b": "Um livro de visitas na capela mortuária.",
"a": "Capela mortuária",
"x": 22.6,
"y": 3.6,
"t": [
[
"Investigação",
20,
"A última visita é de \"A.\", na noite de 2 de maio: \"amanhã eu toco por eles\"."
]
],
"d": "\"A.\" é o padre Anselmo.",
"i": [],
"k": "pista"
},
{
"n": "Jazigo dos Tibúrcio",
"b": "Um jazigo de mármore com o nome Tibúrcio.",
"a": "Quadra das famílias",
"x": 35.75,
"y": 10.45,
"t": [
[
"Percepção",
10,
"Ao lado do caixão do coronel há duas gavetas reservadas, vazias: Celina e Maria Clara."
]
],
"d": "Abrir o caixão exige Crime DT 20. Dentro há joias e um revólver, sem corpo: o coronel está na Delegacia.",
"i": [
"joias",
"revólver"
],
"k": "mistério"
},
{
"n": "Flores frescas",
"b": "Flores frescas sobre os cinco túmulos.",
"a": "Os cinco",
"x": 26.2,
"y": 12.2,
"t": [
[
"Percepção",
15,
"Há pegadas recentes saindo dos túmulos."
]
],
"d": "Alguém esteve aqui hoje. As pegadas levam a uma base (à escolha do mestre).",
"i": [],
"k": ""
},
{
"n": "Caixões espalhados",
"b": "Caixões desenterrados espalhados entre os túmulos.",
"a": "Entre os túmulos",
"x": 34.6,
"y": 21.6,
"t": [
[
"Percepção",
10,
"Alguns estão vazios. Outros não."
]
],
"d": "Quem mexe nos corpos faz Vontade DT 15; quem falha perde 1d4 de Sanidade.",
"i": [],
"k": "perigo"
},
{
"n": "Anjo sem cabeça",
"b": "A estátua de um anjo sem cabeça, no centro do cemitério.",
"a": "Centro",
"x": 21.9,
"y": 11.1,
"t": [
[
"Percepção",
5,
"O braço aponta para o centro da cidade."
]
],
"d": "Aponta para a Matriz.",
"i": [],
"k": ""
}
],
"gw": 42,
"gh": 31,
"img": [
2100,
1550
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
"b": "Montanhas de cartas no depósito.",
"a": "Depósito",
"x": 9,
"y": 6,
"t": [
[
"Investigação",
20,
"Entre milhares, uma carta do padre Anselmo ao bispo."
]
],
"d": "Na carta, o padre conta que o sino foi fundido com o ferro das correntes de uma antiga fazenda escravista e que vai tocá-lo \"até a água entender\".",
"i": [],
"k": "pista"
},
{
"n": "Escaninhos das ruas",
"b": "Escaninhos de madeira com os nomes das ruas.",
"a": "Triagem",
"x": 19.5,
"y": 12.4,
"t": [
[
"Investigação",
15,
"Cada escaninho tem cartas que nunca foram entregues."
]
],
"d": "Cada rua pesquisada rende um gancho para os personagens: uma promessa, uma dívida, um amor que ficou para trás.",
"i": [],
"k": ""
},
{
"n": "Encomendas retidas",
"b": "Pacotes de papel pardo amarrados, no depósito.",
"a": "Depósito",
"x": 21.5,
"y": 4.4,
"t": [
[
"Percepção",
15,
"Nos pacotes há ferramentas, peças de rádio, pilhas mortas e um rolo de corda nova."
]
],
"d": "Rende 1d4 sucata e uma corda de 20 m.",
"i": [
"1d4 sucata",
"corda (20 m)"
],
"k": "item"
},
{
"n": "Telegramas em branco",
"b": "Um bloco de formulários de telegrama sobre o balcão.",
"a": "Balcão",
"x": 7,
"y": 11.8,
"t": [
[
"Percepção",
15,
"O carimbo do balcão está com a data de hoje."
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
"b": "Uma caixa de lacres de chumbo no depósito.",
"a": "Depósito",
"x": 14,
"y": 8,
"t": [
[
"Percepção",
5,
"Lacres pesados de chumbo."
]
],
"d": "Rendem 1 sucata.",
"i": [
"1 sucata"
],
"k": "item"
},
{
"n": "Caixa de coleta",
"b": "Uma caixa de coleta vermelha na calçada.",
"a": "Calçada",
"x": 12,
"y": 17.5,
"t": [
[
"Percepção",
10,
"A caixa está sempre vazia."
]
],
"d": "Abrir exige Crime DT 20. O que se põe nela chega ao destino.",
"i": [],
"k": "mistério"
},
{
"n": "Sacos empilhados",
"b": "Sacos de lona empilhados até o teto no depósito.",
"a": "Depósito",
"x": 15.5,
"y": 4.5,
"t": [
[
"Percepção",
10,
"A pilha está instável."
]
],
"d": "Se a pilha cai, todos ao lado fazem Reflexos DT 15; quem falha toma 1d6 de dano.",
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
"b": "Um projetor de rolo na cabine, com uma lata montada.",
"a": "Cabine",
"x": 32.4,
"y": 4.8,
"t": [
[
"Percepção",
5,
"O projetor está montado para a sessão da meia-noite."
],
[
"Tecnologia",
20,
"Dá para trocar a lata, mas só depois da sessão da noite."
]
],
"d": "Assistir à sessão da noite mostra o filme do dia (ver Sessões).",
"i": [],
"k": "pista"
},
{
"n": "Lata \"2 de maio\"",
"b": "Uma lata de filme com etiqueta \"2 de maio\".",
"a": "Cabine",
"x": 31.8,
"y": 7.8,
"t": [
[
"Percepção",
5,
"A etiqueta é escrita à mão."
],
[
"Tecnologia",
20,
"É um filme amador. Dá para montar no projetor."
]
],
"d": "O filme mostra o padre na torre, ensaiando os sinos numa ordem que dá para contar. Foi filmado de longe, de um lugar alto (a luneta do Hotel).",
"i": [],
"k": "pista"
},
{
"n": "Quadro da programação",
"b": "Um quadro de programação pendurado na cabine.",
"a": "Cabine",
"x": 34.6,
"y": 3.6,
"t": [
[
"Percepção",
5,
"Lista os títulos das seis sessões."
]
],
"d": "Ver Sessões.",
"i": [],
"k": ""
},
{
"n": "Escala da cabine",
"b": "Uma folha de escala colada na porta da cabine.",
"a": "Porta da cabine",
"x": 29.8,
"y": 8.6,
"t": [
[
"Percepção",
15,
"Um só nome em todas as sessões: Adauto."
]
],
"d": "Adauto é o zelador do Hotel e o autor do filme \"2 de maio\".",
"i": [],
"k": "mistério"
},
{
"n": "Coroa de espinhos de arame",
"b": "Uma coroa de espinhos de arame, nas coxias.",
"a": "Coxias",
"x": 4,
"y": 4.6,
"t": [
[
"Percepção",
5,
"É uma peça de teatro, mas o arame espeta de verdade."
]
],
"d": "Quem usa durante o toque tem +5 no teste de Vontade do erro.",
"i": [
"coroa de arame"
],
"k": "item"
},
{
"n": "Doces de 1974",
"b": "Doces embrulhados na bombonière.",
"a": "Bombonière",
"x": 5,
"y": 19.8,
"t": [
[
"Percepção",
5,
"Os doces são de 1974 e parecem frescos."
]
],
"d": "Contam como 1 comida. Têm gosto de infância, mesmo para quem nunca comeu.",
"i": [
"1 comida"
],
"k": "item"
},
{
"n": "Caixa registradora",
"b": "Uma caixa registradora na bilheteria.",
"a": "Bilheteria",
"x": 24,
"y": 19.8,
"t": [
[
"Percepção",
10,
"A gaveta está trancada."
]
],
"d": "Abrir exige Crime DT 15. Dentro: moedas antigas e um ingresso com o nome de um personagem, para a sessão de hoje.",
"i": [
"ingresso"
],
"k": ""
},
{
"n": "Roupas vazias na plateia",
"b": "Fileiras de cadeiras com roupas vazias sentadas.",
"a": "Plateia",
"x": 9,
"y": 11,
"t": [
[
"Percepção",
5,
"As roupas estão na posição de quem assiste."
]
],
"d": "Se a sessão for interrompida, os presentes fazem Vontade DT 20.",
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
"b": "Prateleiras de remédios na farmácia.",
"a": "Farmácia",
"x": 4.4,
"y": 10.4,
"t": [
[
"Medicina",
15,
"Achando o que presta: 1 kit de cura."
],
[
"Medicina",
20,
"Separando com cuidado: 1d3 kits de cura."
]
],
"d": "Cada kit recupera 2d6 PV num teste de Medicina. A melhoria Enfermaria do Hotel precisa de um.",
"i": [
"1d3 kits de cura"
],
"k": "item"
},
{
"n": "Éter",
"b": "Frascos marrons de éter na farmácia.",
"a": "Farmácia",
"x": 8.4,
"y": 9.7,
"t": [
[
"Ciências",
15,
"É éter. Dá para preparar duas doses."
]
],
"d": "Derruba uma pessoa por 1d4 rodadas (Fortitude DT 15 resiste).",
"i": [
"éter (2 doses)"
],
"k": "item"
},
{
"n": "Instrumentos cirúrgicos",
"b": "Uma bandeja de instrumentos cirúrgicos.",
"a": "Centro cirúrgico",
"x": 8.6,
"y": 16.4,
"t": [
[
"Percepção",
5,
"Estão limpos e afiados."
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
"b": "Fichas de pacientes num arquivo da enfermaria.",
"a": "Enfermaria",
"x": 16.6,
"y": 5.1,
"t": [
[
"Investigação",
20,
"Os cinco mortos passaram aqui: afogamento, semanas antes da inundação, num lugar seco."
]
],
"d": "Os cinco morreram afogados antes da água chegar.",
"i": [],
"k": "mistério"
},
{
"n": "Leitos com a forma de alguém",
"b": "Três leitos com lençóis que guardam a forma de um corpo.",
"a": "Enfermaria",
"x": 9.4,
"y": 3.5,
"t": [
[
"Percepção",
5,
"Os lençóis estão afundados como se alguém deitasse ali."
]
],
"d": "Quem está ferido e passa uma hora aqui faz Vontade DT 15; quem falha perde 1d4 de Sanidade.",
"i": [],
"k": "perigo"
},
{
"n": "Porta da ala trancada",
"b": "Uma porta com cadeado no corredor.",
"a": "Corredor",
"x": 24,
"y": 12.5,
"t": [
[
"Percepção",
10,
"O cadeado é de outra época, mas novo."
]
],
"d": "Abrir exige Crime DT 20 ou quebrar com 2 sucata.",
"i": [],
"k": "mistério"
},
{
"n": "Paciente que não envelheceu",
"b": "Um rapaz sentado na cama da ala trancada.",
"a": "Ala trancada",
"x": 25.5,
"y": 10,
"t": [
[
"Percepção",
5,
"Ele não envelheceu: é o coroinha de 1974."
]
],
"d": "Diplomacia DT 15 faz ele contar a hora do toque. Ele quer sair.",
"i": [],
"k": "mistério"
},
{
"n": "Hábitos das freiras",
"b": "Hábitos de freira pendurados na capela.",
"a": "Capela",
"x": 31.2,
"y": 20.4,
"t": [
[
"Percepção",
5,
"Estão inteiros e limpos."
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
"b": "Uma imagem de Nossa Senhora das Dores na varanda.",
"a": "Varanda",
"x": 17,
"y": 22.9,
"t": [
[
"Percepção",
5,
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
"b": "Uma porta de ferro com fechadura de segredo, no depósito.",
"a": "Depósito",
"x": 7.6,
"y": 7.2,
"t": [
[
"Percepção",
20,
"Há um fio esticado na porta: armadilha (2d8)."
]
],
"d": "A combinação está na contracapa do livro de ocorrências. Sem ela, Crime DT 25. Dentro: duas espingardas (2d8), um revólver .38 (2d6) e munição.",
"i": [
"2 espingardas",
"revólver .38",
"munição"
],
"k": "item"
},
{
"n": "Livro de ocorrências",
"b": "Um livro de ocorrências sobre o balcão.",
"a": "Atendimento",
"x": 7.5,
"y": 12,
"t": [
[
"Investigação",
20,
"A última ocorrência: \"padre se recusa a descer da torre\". Na contracapa, uma combinação."
]
],
"d": "A combinação abre o depósito de armas.",
"i": [],
"k": "pista"
},
{
"n": "Gaveta da mesa",
"b": "Uma gaveta emperrada na mesa do delegado.",
"a": "Atendimento",
"x": 8.6,
"y": 12.6,
"t": [
[
"Percepção",
15,
"O fundo da gaveta é falso. Embaixo está a chave das celas."
]
],
"d": "A chave abre a cela onde está o corpo do coronel.",
"i": [
"chave das celas"
],
"k": "item"
},
{
"n": "Algemas e chaves",
"b": "Algemas e chaves penduradas num prego.",
"a": "Atendimento",
"x": 5.4,
"y": 15.6,
"t": [
[
"Percepção",
5,
"Dois pares de algemas."
]
],
"d": "Úteis para prender um sacrifício.",
"i": [
"2 algemas"
],
"k": "item"
},
{
"n": "Armário de equipamento",
"b": "Um armário de aço no atendimento.",
"a": "Atendimento",
"x": 13.1,
"y": 11.7,
"t": [
[
"Percepção",
5,
"Dentro há um binóculo militar e um uniforme com quepe."
]
],
"d": "O binóculo serve para o mirante do Hotel. Com o uniforme, uma vez, um NPC obedece uma ordem simples (Diplomacia DT 15).",
"i": [
"binóculo",
"uniforme"
],
"k": "item"
},
{
"n": "Corpo do coronel Tibúrcio",
"b": "Um corpo seco de terno, virado para a janela da cela trancada.",
"a": "Cela trancada",
"x": 22.5,
"y": 5.8,
"t": [
[
"Percepção",
5,
"Usa anel de prefeito. É o coronel Tibúrcio."
],
[
"Investigação",
15,
"No bolso, um caderninho de letra tremida."
]
],
"d": "A cela abre com a chave das celas. O caderninho fala do túnel, das cinco chaves no cofre do Casarão e diz \"o cofre abre com a minha Clarinha\". No colete, a chave da Suíte 1.",
"i": [
"caderninho",
"chave Suíte 1",
"anel de prefeito"
],
"k": "mistério"
},
{
"n": "Jipe",
"b": "Um jipe policial parado na rua.",
"a": "Rua",
"x": 9.5,
"y": 19.6,
"t": [
[
"Tecnologia",
15,
"Tem diesel no tanque."
]
],
"d": "Consertar exige Tecnologia DT 25 e 4 sucata (funciona um dia). Atravessa a cidade em minutos, mas todos ouvem. O galão de diesel serve ao gerador do Hotel.",
"i": [
"1 galão de diesel"
],
"k": "item"
},
{
"n": "Poste com algema",
"b": "Um poste com algema no pátio.",
"a": "Pátio",
"x": 14.2,
"y": 2.4,
"t": [
[
"Percepção",
5,
"O muro alto esconde o pátio da rua."
]
],
"d": "Boa saída escondida.",
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
"b": "Um cofre de chão no escritório, sob o tapete.",
"a": "Escritório",
"x": 20.3,
"y": 9.6,
"t": [
[
"Percepção",
10,
"Segredo de seis números."
]
],
"d": "Abre com 14-08-62 ou Crime DT 25. Dentro: cinco chaves de ferro, cada uma com o nome de um santo — as chaves da grade da cripta.",
"i": [
"5 chaves da cripta"
],
"k": "mistério"
},
{
"n": "Bilhete do coronel",
"b": "Gavetas da escrivaninha do coronel.",
"a": "Escritório",
"x": 18.6,
"y": 6.9,
"t": [
[
"Investigação",
15,
"Um bilhete: \"Três números. O dia, o mês e o ano em que ganhei o que mais amo.\""
]
],
"d": "Pista para a combinação 14-08-62.",
"i": [],
"k": "pista"
},
{
"n": "Contrato da represa",
"b": "Um contrato de várias páginas na escrivaninha.",
"a": "Escritório",
"x": 23.4,
"y": 5,
"t": [
[
"Investigação",
15,
"O coronel vendeu a cidade em 1972. Cláusula à mão: \"o sino fica com a água\"."
]
],
"d": "Mostra quem lucrou com a inundação.",
"i": [],
"k": "mistério"
},
{
"n": "Retrato inteiro",
"b": "Um retrato de família no salão, com rostos apagados.",
"a": "Salão",
"x": 2.6,
"y": 12.8,
"t": [
[
"Percepção",
15,
"Só um rosto está intacto: uma menina."
]
],
"d": "Atrás da moldura: \"Maria Clara, nossa Clarinha\".",
"i": [],
"k": "pista"
},
{
"n": "Piano",
"b": "Um piano de cauda no salão.",
"a": "Salão",
"x": 5.8,
"y": 15.4,
"t": [
[
"Artes",
20,
"As teclas pretas tocam sozinhas uma melodia que imita os cinco sinos."
]
],
"d": "Dá para perceber a ordem dos sinos.",
"i": [],
"k": "pista"
},
{
"n": "Lustre caído",
"b": "Um lustre caído no meio do salão.",
"a": "Salão",
"x": 11,
"y": 14,
"t": [
[
"Percepção",
10,
"O teto está rachado em volta."
]
],
"d": "Qualquer teste de Atletismo ou tiro na sala derruba o resto do teto.",
"i": [],
"k": "perigo"
},
{
"n": "Caderno de desenhos",
"b": "Um caderno de desenhos no quarto da criança.",
"a": "Quarto da criança",
"x": 32,
"y": 10.6,
"t": [
[
"Investigação",
15,
"\"Clarinha, 11 anos, 1973\". Um bolo com velas e \"14/8\"."
]
],
"d": "Nas últimas páginas, a torre e o sino caindo para dentro da terra.",
"i": [],
"k": "pista"
},
{
"n": "Vinhos",
"b": "Garrafas de vinho na adega.",
"a": "Adega",
"x": 28.5,
"y": 17.6,
"t": [
[
"Percepção",
5,
"Estão lacradas."
]
],
"d": "Conta como 2 água. Quem bebe demais tem –2 em Percepção no dia.",
"i": [
"2 água"
],
"k": "item"
},
{
"n": "Porta emparedada",
"b": "Uma parede de tijolos na adega.",
"a": "Adega",
"x": 33.9,
"y": 23,
"t": [
[
"Percepção",
10,
"Há o contorno de uma porta."
]
],
"d": "Quebrar: 2 sucata e uma hora de trabalho. Dentro: a prataria (3 sucata) e um castiçal que serve de arma (1d6).",
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
"b": "Um vão de dois metros no meio da ponte.",
"a": "Meio da ponte",
"x": 22.0,
"y": 14.9,
"t": [
[
"Percepção",
5,
"Seis metros de queda até a lama."
]
],
"d": "Pular exige Atletismo DT 15 (DT 20 com carga ou ferido); falha cai e toma 2d6.",
"i": [],
"k": "perigo"
},
{
"n": "Ferragens estouradas",
"b": "Ferragens retorcidas nas pontas do vão.",
"a": "Pontas do vão",
"x": 20.1,
"y": 12.3,
"t": [
[
"Percepção",
20,
"Estouraram para fora."
],
[
"Ciências",
15,
"Há marcas pretas de queimado."
]
],
"d": "Foi explosão, não enchente.",
"i": [],
"k": "mistério"
},
{
"n": "Tábuas da carroça",
"b": "Tábuas de uma carroça no leito do rio.",
"a": "Leito",
"x": 11.2,
"y": 19.7,
"t": [
[
"Percepção",
5,
"São tábuas compridas e firmes."
]
],
"d": "Atletismo DT 15 para descer e subir com elas. Montam uma passarela sobre o vão em 10 minutos; quem montou pode retirar.",
"i": [
"tábuas"
],
"k": "item"
},
{
"n": "Carros afundados",
"b": "Três carros afundados no leito.",
"a": "Leito",
"x": 26.4,
"y": 22.2,
"t": [
[
"Percepção",
15,
"Há peças úteis e um mapa rodoviário com a cidade circulada no porta-luvas."
],
[
"Tecnologia",
15,
"Um tanque ainda tem diesel."
]
],
"d": "2 sucata por carro (6 no total) e 1 galão de diesel.",
"i": [
"6 sucata",
"1 galão de diesel"
],
"k": "item"
},
{
"n": "Caixote de explosivos",
"b": "Restos de caixote meio enterrados na lama.",
"a": "Leito",
"x": 23.9,
"y": 20.4,
"t": [
[
"Investigação",
15,
"Restos de pavio e o carimbo \"Obras da Barragem — Explosivos\"."
]
],
"d": "A ponte foi explodida com material da obra da barragem.",
"i": [],
"k": "mistério"
},
{
"n": "Placa da ponte",
"b": "Uma placa de bronze no pilar central.",
"a": "Pilar central",
"x": 22.0,
"y": 13.0,
"t": [
[
"Investigação",
15,
"\"Ponte Padre Anselmo, inaugurada em 1968\"."
]
],
"d": "Liga a ponte ao padre e à nota \"pedi ao Senhor que me perdoe pela ponte\" (Matriz).",
"i": [],
"k": ""
},
{
"n": "Ninho de urubus",
"b": "Urubus pousados nas ferragens.",
"a": "Ferragens",
"x": 24.3,
"y": 16.0,
"t": [
[
"Percepção",
10,
"Eles voam em círculo sobre um ponto da cidade."
]
],
"d": "Revela onde alguém morreu hoje.",
"i": [],
"k": ""
},
{
"n": "Pichação \"NÃO SAIO\"",
"b": "Uma pichação na mureta da ponte.",
"a": "Mureta",
"x": 26.7,
"y": 12.3,
"t": [
[
"Percepção",
5,
"\"NÃO SAIO\", em tinta branca."
]
],
"d": "A mesma frase da faixa do Bar do Mercado, na Feira.",
"i": [],
"k": "pista"
}
],
"gw": 44,
"gh": 28,
"img": [
2200,
1400
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
"b": "Um coreto no centro da feira.",
"a": "Coreto",
"x": 18,
"y": 12,
"t": [
[
"Percepção",
20,
"Há tábuas soltas no assoalho, com um caderno embaixo."
]
],
"d": "Contas do \"Comitê do Não Saio\" e o mapa dos esconderijos: com ele, todos os outros esconderijos se acham sem teste.",
"i": [
"mapa dos esconderijos"
],
"k": "mistério"
},
{
"n": "Alçapão do armazém",
"b": "Sacas mofadas empilhadas no armazém.",
"a": "Armazém",
"x": 3.1,
"y": 14.4,
"t": [
[
"Investigação",
20,
"Embaixo das sacas há um alçapão."
]
],
"d": "O esconderijo principal: rapadura, farinha em lata e charque (6 comida, 2 água).",
"i": [
"6 comida",
"2 água"
],
"k": "item"
},
{
"n": "Potes enterrados",
"b": "Terra fofa no largo da feira.",
"a": "Largo",
"x": 13,
"y": 18.5,
"t": [
[
"Percepção",
20,
"Há potes enterrados. Cada busca leva uma hora."
]
],
"d": "Mel lacrado e feijão em lata: 1d3 comida por pote. São quatro potes no largo.",
"i": [
"1d3 comida por pote"
],
"k": "item"
},
{
"n": "Cisterna seca",
"b": "Uma cisterna seca com boca de pedra.",
"a": "Cisterna",
"x": 28,
"y": 17.2,
"t": [
[
"Percepção",
10,
"Há caixotes no fundo."
]
],
"d": "Descer com corda exige Atletismo DT 15. Dentro: caixotes de lata vedados (3 comida) e um lampião com querosene.",
"i": [
"3 comida",
"lampião"
],
"k": "item"
},
{
"n": "Banca de ferragens",
"b": "Uma banca de ferragens com a porta fechada.",
"a": "Ferragens",
"x": 26.5,
"y": 12.6,
"t": [
[
"Percepção",
5,
"Facões, pregos, corda e lampião, vistos pela fresta."
]
],
"d": "Forçar a porta exige Atletismo DT 20 (ou pé de cabra). Rende 2 sucata e equipamento comum.",
"i": [
"2 sucata",
"equipamento comum"
],
"k": "item"
},
{
"n": "Faixa \"NÃO SAIO\"",
"b": "Uma faixa enrolada atrás do balcão do bar.",
"a": "Bar do Mercado",
"x": 30.5,
"y": 4.1,
"t": [
[
"Percepção",
5,
"Diz \"NÃO SAIO\"."
]
],
"d": "No verso, as assinaturas dos que ficaram — os mesmos nomes do cruzeiro da Fazenda.",
"i": [],
"k": "mistério"
},
{
"n": "Largo das barracas",
"b": "Barracas com lonas caídas pelo largo.",
"a": "Largo",
"x": 22,
"y": 15,
"t": [
[
"Percepção",
10,
"Há pregos e lata cortada embaixo das lonas."
]
],
"d": "Correr pelo largo exige Acrobacia DT 15; falha toma 1d4.",
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
