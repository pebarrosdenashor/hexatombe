/* Lista de cutscenes. Para criar uma nova: copie uma cena (o desenho do lugar em mundo()
   e o roteiro em roteiro()) e acrescente uma entrada aqui. "grupo" separa as seções do painel. */
export const CENAS = {
  abertura: {
    grupo: "Abertura",
    nome: "Abertura: o despertar",
    resumo: "Os jogadores acordam no barro, diante do Hotel Bela Vista, e veem Bom Jesus do Açude pela primeira vez. Termina no título do Dia 1.",
    duracao: "cerca de 2 min",
    convite: "Clique para abrir os olhos",
    carregar: () => import("./abertura.js?v=1.2.0")
  },
  romaria: {
    grupo: "Primeiro encontro",
    nome: "A Romaria",
    resumo: "Ao pé do Morro do Calvário, à noite. As velas das 14 estações acendem sozinhas e os cinco romeiros saem do pátio com o andor da santa.",
    duracao: "cerca de 1 min e meio",
    convite: "Clique para olhar o morro",
    carregar: () => import("./romaria.js?v=1.2.0")
  },
  floresta: {
    grupo: "Primeiro encontro",
    nome: "Os da Floresta",
    resumo: "Na Mata dos Afogados, à noite. Um cervo pasta na clareira, olha demais e, num piscar, vira o Cervo. Depois aparecem o Leopardo, o Morcego, o Urso e o Cachorro.",
    duracao: "cerca de 1 min e meio",
    convite: "Clique para entrar na mata",
    carregar: () => import("./floresta.js?v=1.2.0")
  },
  zahab: {
    grupo: "Primeiro encontro",
    nome: "Os Zahab",
    resumo: "No Cartório, à noite. Cinco pessoas em cinco cantos da biblioteca viram a página juntas, respiram juntas e levantam a cabeça juntas. Uma voz, cinco bocas.",
    duracao: "cerca de 1 min e meio",
    convite: "Clique para empurrar a porta",
    carregar: () => import("./zahab.js?v=1.2.0")
  },
  queiroz: {
    grupo: "Primeiro encontro",
    nome: "Família Queiroz",
    resumo: "Subindo o Alto do Cruzeiro no fim da tarde, sem bandeira branca. Um brilho na caixa d'água, um tiro aos pés e a família inteira olhando lá de cima.",
    duracao: "cerca de 1 min e meio",
    convite: "Clique para subir o morro",
    carregar: () => import("./queiroz.js?v=1.2.0")
  },
  comensais: {
    grupo: "Primeiro encontro",
    nome: "Os Comensais",
    resumo: "No Matadouro Municipal, à noite. As cordas do curral acordam os sinos de vaca. Lá dentro, ganchos, a câmara fria e uma mesa comprida onde todos param de mastigar.",
    duracao: "cerca de 1 min e meio",
    convite: "Clique para atravessar o curral",
    carregar: () => import("./comensais.js?v=1.2.0")
  }
};
