/* Lista de cutscenes. Para criar uma nova: copie abertura.js, mude o mundo e o roteiro,
   e acrescente uma entrada aqui. */
export const CENAS = {
  abertura: {
    nome: "Abertura: o despertar",
    resumo: "Os jogadores acordam no barro, diante do Hotel Bela Vista, e veem Bom Jesus do Açude pela primeira vez. Termina no título do Dia 1.",
    duracao: "cerca de 2 min",
    convite: "Clique para abrir os olhos",
    carregar: () => import("./abertura.js?v=1.0.0")
  }
};
