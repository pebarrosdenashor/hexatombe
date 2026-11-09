# Cutscenes do Hexatombe

Extensão do Owlbear Rodeo para tocar cutscenes em tela cheia para todos os jogadores.

**Instalar:** no Owlbear, Extensões → Adicionar → `https://pebarrosdenashor.github.io/hexatombe/cutscene/manifest.json`

**Usar (mestre):** abra a extensão e clique em **Tocar para todos**. A cena abre na tela de todo mundo;
cada um clica em "Clique para abrir os olhos" para começar (o clique libera o som no navegador).
**Fechar para todos** encerra a cena em todas as telas. **Testar só pra mim** abre só para você.

**Cenas disponíveis:**
- **Abertura: o despertar** (cerca de 2 min), em duas versões com o mesmo roteiro: a **realista** (`abertura2.js`, pintada em canvas, com névoa, nuvens e água em movimento; baixa a própria resolução se o computador não der conta) e a **original** (`abertura.js`, em SVG)
- **Primeiro encontro** (cerca de 1 min e meio cada), para tocar quando os jogadores cruzam com cada equipe pela primeira vez:
  A Romaria (Morro do Calvário), Os da Floresta (Mata dos Afogados), Os Zahab (Cartório),
  Família Queiroz (Fazenda Alto do Cruzeiro) e Os Comensais (Matadouro Municipal).

**Testar fora do Owlbear:** abra `cena.html?c=abertura2` no navegador (ou `c=abertura`, `c=romaria`, `c=floresta`, `c=zahab`, `c=queiroz`, `c=comensais`).

**Criar outra cena:** copie `abertura.js` (o desenho do lugar em `mundo()` e o roteiro em `roteiro()`)
e acrescente uma entrada em `cenas.js`. As figuras e máscaras ficam em `kit.js` e os sons em `som.js`.
