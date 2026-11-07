# Battlemaps do Hexatombe

Extensão do Owlbear Rodeo com os 15 battlemaps de Bom Jesus do Açude (versão 2 dos locais).

Instalar: **Extensions → Add Extension** e colar
`https://pebarrosdenashor.github.io/hexatombe/battlemaps/manifest.json`

## O que faz (só para o mestre)
- **Colocar nesta cena:** põe o mapa do local escolhido na cena, travado na camada de mapa, com 1 quadrado da grade = 1,5 m.
- **Vincular à imagem selecionada:** troca uma imagem que já está na cena pelo mapa escolhido, no mesmo lugar.
- **Pontos de interesse:** cada ponto tem testes, DTs, o que se descobre e itens. Em "Editar pontos" dá para mover, criar, apagar e reescrever pontos.
- **Mostrar os pontos na mesa:** coloca etiquetas ocultas (só o mestre vê) sobre o mapa. Mover ou editar um ponto na janela muda a etiqueta na mesa.
- **Melhorias do Hotel:** cada melhoria marcada põe uma camada por cima do mapa do Hotel na cena; desmarcar tira a camada.

O estado (melhorias, pontos explorados, edições) fica no navegador do mestre, por sala.
Quem atualiza a cena é o fundo da extensão (`background.js`), então a mesa muda mesmo com a janela fechada.

## Arquivos
- `dados.js`: locais e pontos (gerado dos battlemaps).
- `imagens/`: mapas sem grade, 50 px por quadrado; `imagens/hotel/`: camadas das melhorias, recortadas (a posição está em `camadas[].off`).
- `previas/`: versões menores para a janela.
- Para trocar uma imagem na mesa de quem já usa a extensão, suba a imagem nova e aumente `VERSAO` em `dados.js`.
