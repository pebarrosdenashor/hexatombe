# Hexatombe — extensão para Owlbear Rodeo

Regras do Hexatombe (Arquivos Secretos #2 e #3 de Ordem Paranormal RPG), ligadas à extensão "Ficha Ordem Paranormal".

## Como instalar

1. No GitHub, crie um repositório **público** chamado `hexatombe` na conta `pebarrosdenashor`.
2. Envie os arquivos **soltos, na raiz** (não dentro de uma pasta): `manifest.json`, `index.html`, `app.js`, `style.css`, `icon.svg`, `background.html`, `background.js`.
3. Em **Settings → Pages**: *Deploy from a branch* → `main` → `/ (root)` → Save.
4. Espere 1–2 minutos e abra no navegador: `https://pebarrosdenashor.github.io/hexatombe/manifest.json`
5. No Owlbear: **Extensions → Add Extension**, cole o link e ative na sala.

> A ligação com a ficha só funciona se as duas extensões estiverem no mesmo site (`pebarrosdenashor.github.io`), como acima.

## Antes da primeira sessão (mestre)

1. Abra a extensão da **ficha** na sala com os jogadores conectados, para receber as fichas deles.
2. No Hexatombe, aba **Equipes**: dê nome às equipes, adicione os membros (fichas ou NPCs) e marque o estigma de cada sacrifício.
3. Coloque os recursos iniciais (água, comida, sucata).

## Durante o jogo

- **Ritual:** avance as fases e os dias; registre mortes. O sino toca sozinho, castiga os desertores (com teste de Fortitude), transforma a equipe da vítima em desertora e libera a intenção.
- **Intenções:** marque quem cumpriu; a recompensa vai direto para a ficha.
- **Recursos e base:** consumo do dia (fome e sede mexem nos PV/PD máximos da ficha), melhorias com teste DT 20, troca de informações.
- **Exploração:** teste de jornada, procurar recursos, encontros, aliados em perigo.
- **Extras:** batalha de intenções, jogos do circo, novos itens (vão para a ficha).
- **Bestiário:** fichas das ameaças com rolagens.

Só o mestre altera o estado; todos veem tudo e podem fazer as rolagens.

## Novidades da versão 1.1

- ↶ Desfazer (mestre), backup do ritual em arquivo
- Sino com som para todos quando um sacrifício acontece (🔔/🔕 no topo)
- Aba Arena: áreas do point crawl ligadas ao mapa, quais equipes exploraram cada uma, áreas engolidas pelos espinhos a cada dia
- Teste de jornada com destino (caminho já conhecido dispensa teste) e busca de recursos controlada por local
- Plano secreto de cada equipe com sorteio de estratégia (só o mestre vê)
- Relações entre equipes, usadas nos encontros de negociação
- Desejos para a Coroa: cada jogador envia o seu, só o mestre vê

## Novidades da versão 2

- Visual novo inspirado nos Arquivos Secretos
- O mapa fica vermelho enquanto o sino toca
- Sincronia nova: tudo o que o mestre muda chega na hora para os jogadores (mesmo com a janela fechada)
- Visões separadas: jogadores veem só as áreas que descobriram, as equipes e integrantes que conheceram (marcados pelo mestre), as intenções já reveladas (recompensa só para quem cumpriu) e os recursos e a base da própria equipe; podem anotar em áreas, equipes e integrantes
- Exploração, Extras e Bestiário só para o mestre
- Melhorias da base editáveis (nome, custo, requisito, recompensa, produção); jogadores só veem a recompensa depois de construir
- Criaturas novas no bestiário

## Novidades da versão 2.2

- Aba "NPCs" (antes Bestiário): NPCs com PV, PE, perícias, ataques e habilidades, ligados às equipes; as mecânicas do ritual usam esses dados
- Equipe 1 recebe fichas de jogadores; equipes 2 a 6 recebem NPCs
- Diário da equipe: compartilhado entre os membros da equipe e o mestre
- Aba Epílogo (mestre): resumo do Hexatombe para publicar aos jogadores ou baixar

## Leituras que eu fiz das regras (ajuste se a sua mesa preferir outra)

- Onde o livro fala em PE, a extensão usa a **Determinação** da ficha.
- O teste de jornada não tem DT no livro: a extensão começa com DT 20 (editável).
- Procurar recursos: 15+ sorteia 1 item, 20+ sorteia 2 (um de cada tabela) e 25+ sorteia 3.
- Quando um segundo sacrifício morre na mesma noite, a equipe dele também vira desertora.
- Máquina de soco: dano desarmado = 1d3 + Força.


## Novidades da versão 2.4

- Equipes NPC agindo sozinhas: na aba Ritual (mestre), "Sortear ações das equipes NPC" sorteia o que cada equipe de NPC fez na fase (coleta em uma área, construção de melhoria, descanso, ataque, caçada a sacrifício, roubo, diplomacia). Os testes já vêm rolados com as perícias dos NPCs. Nada muda até o mestre aprovar; dá para trocar a ação, sortear de novo ou desmarcar.
- Mortes aprovadas passam pelo "Registrar morte" normal (sino, estigma, desertores). Ações que envolvem a equipe dos jogadores viram apenas um gancho para o mestre narrar.
- O resultado vai para o diário de cada equipe e para um histórico que só o mestre vê.


## Novidades da versão 2.5 — aba Arquivo (todos veem)

- **Pistas e documentos:** o mestre cria cartas, bilhetes e fotos (texto e um link de imagem) e escolhe quem pode ver: todas as equipes ou só algumas. A pista nasce escondida. "Revelar" põe no Arquivo dos jogadores; "Mostrar na tela" revela e abre a pista na tela de quem pode vê-la, como um papel envelhecido.
- **Bestiário revelado aos poucos:** para cada criatura (do livro ou do mestre), escolha o que o grupo sabe: oculta, avistada (nome, tipo e uma descrição sua), estudada (+ deslocamento, atributos, resistências, vulnerabilidade e presença perturbadora) ou dissecada (+ Defesa, PV, ataques e habilidades). Cada avanço avisa a mesa.
- **Circo:** placar com medalhas dos dardos e da máquina de soco (vale o melhor resultado de cada um) e as últimas 15 jogadas. Agora os jogadores jogam com o próprio personagem e o resultado vai para o placar, mesmo com a janela do mestre fechada. Recorde batido avisa a mesa.

Arquivos novos: `handout.html` e `handout.js` (a janela da pista). Suba os dois junto com os outros.

As pistas escondidas e o bestiário viajam com o estado do ritual até o navegador dos jogadores. A tela não mostra nada, mas quem souber abrir as ferramentas do navegador conseguiria ler. Não guarde nelas segredos que quebrariam o jogo.

## Novidades da versão 2.6 — pistas enviadas do computador
- Na nova pista, **📁 Enviar do computador** aceita imagem (png, jpg, webp…), **PDF** (até 4 páginas, viram uma imagem só) ou **.txt** (vira o texto da pista). O nome do arquivo vira o título, se ele estiver vazio.
- **📂 Várias pistas de uma vez**: escolha vários arquivos; cada um vira uma pista escondida.
- As imagens são reduzidas (~250 KB) e ficam guardadas no navegador do mestre. Só vão para os jogadores quando a pista é revelada ou mostrada na tela; quem entrar depois pede a imagem sozinho.
- O **backup em arquivo** agora leva as imagens junto. Se for trocar de computador, salve o backup e carregue no outro.
- Ainda dá para usar um link de imagem, como antes.
