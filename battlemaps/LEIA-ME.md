# Battlemaps do Hexatombe

Extensão do Owlbear Rodeo com os 15 battlemaps de Bom Jesus do Açude (versão 2 dos locais).

Instalar: **Extensions → Add Extension** e colar
`https://pebarrosdenashor.github.io/hexatombe/battlemaps/manifest.json`

## O que faz (só para o mestre)
- **Colocar nesta cena:** põe o mapa do local escolhido na cena, travado na camada de mapa, com 1 quadrado da grade = 1,5 m.
- **Vincular à imagem selecionada:** troca uma imagem que já está na cena pelo mapa escolhido, no mesmo lugar.
- **Pontos de interesse:** cada ponto segue o modelo do livro: cabeçalho (nome e descrição básica, narrada a quem investiga), quadro de perícias (perícia, DT e informação) e descrição contextual, só para o mestre. Em "Editar pontos" dá para mover, criar, apagar e reescrever pontos.
- **Mostrar os pontos na mesa:** coloca etiquetas ocultas (só o mestre vê) sobre o mapa. Mover ou editar um ponto na janela muda a etiqueta na mesa.
- **Melhorias do Hotel:** cada melhoria marcada põe uma camada por cima do mapa do Hotel na cena; desmarcar tira a camada.

O estado (melhorias, pontos explorados, edições) fica no navegador do mestre, por sala.
Quem atualiza a cena é o fundo da extensão (`background.js`), então a mesa muda mesmo com a janela fechada.

## Arquivos
- `dados.js`: locais e pontos (gerado dos battlemaps).
- `imagens/`: mapas sem grade, 50 px por quadrado; `imagens/hotel/`: camadas das melhorias, recortadas (a posição está em `camadas[].off`).
- `previas/`: versões menores para a janela.
- Para trocar uma imagem na mesa de quem já usa a extensão, suba a imagem nova e aumente `VERSAO` em `dados.js`.

## Versão 1.1.0 — interface nova
- Troca de local por uma galeria com miniaturas e busca (`miniaturas/`, 240 px, webp).
- Abas: **Mapa**, **Local** e **Melhorias** (só no Hotel).
- Filtros por tipo de ponto, barra de explorados, lista de todos os pontos.
- Mapa: zoom com botões ou Ctrl + roda, arrastar para mover quando aproximado; setas ← → passam de ponto.
- Edição: testes em campos separados (perícia, DT, resultado), tipo em botões.
- Avisos em balão; só uma fonte externa (Alegreya SC 700), o resto usa a fonte do sistema.

## Versão 1.3.0 — mapas redesenhados
- Todos os mapas com sombras, relevo, texturas de chão e móveis mais detalhados.
- **Cemitério** refeito (42×31): muro de pedra, capela, caminhos em cruz, quadras de covas, jazigos e o canto alagado com os caixões.
- **Ponte Partida** refeita (44×28): estrada cortando o leito seco, vão com o pilar central, pedaço do tabuleiro caído e barricadas nas cabeceiras.
- **Mata dos Afogados**: copas densas por cima de tudo, moitas, troncos caídos e quatro plataformas nas árvores.
- **Hotel**: a base e as 12 camadas de melhoria foram geradas no estilo novo, em tamanho cheio (50 px por quadrado). Base + todas as camadas fica igual ao mapa desenhado com tudo pronto.
- Os pontos de interesse foram mantidos; no Cemitério e na Ponte só mudaram de lugar para acompanhar o desenho novo.
- `VERSAO` subiu para 2: cenas que já têm os mapas trocam a imagem sozinhas (pontos editados por você continuam com a posição antiga).
