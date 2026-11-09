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

## Novidades da versão 2.7
- Recebe as equipes criadas no gerador do Escudo do Mestre: a equipe ganha o nome, os integrantes viram NPCs (com história) e aparece um “Perfil da equipe” na aba Equipes, só para o mestre.

## Novidades da versão 2.8
Arquivos novos: `bestiario.js`, `quadro.html`, `quadro.js`, `quadro.css` e `quadro-dados.js`. Suba todos junto com os outros.

**🧷 Quadro de investigação (Arquivo → Quadro)**
- Um quadro de cortiça em tela cheia que todos veem e mexem ao mesmo tempo.
- Prenda 📝 notas (5 cores de papel), 📜 pistas reveladas do Arquivo (com “Ler”), 🐾 criaturas do Bestiário (do jeito que o grupo conhece), 👤 pessoas e 📷 fotos por link.
- 🧶 Ligar: clique em dois cartões. Clique no barbante para escrever o que liga os dois, trocar para preto (suspeita) ou cortar.
- Arraste os cartões e o fundo; Ctrl + roda do mouse aproxima. Duas vezes numa nota para editar.
- Fica guardado no navegador de cada um; quem abre depois recebe a versão de quem estiver na sala. O mestre tem 🗑 Limpar.

**🐾 Bestiário revelado aos poucos (Arquivo → Bestiário)**
- Nível novo **pressentida**: os jogadores veem só a silhueta (com olhos vermelhos) e o rumor que você escrever, sem o nome.
- Campos que o grupo ainda não sabe aparecem como ▒▒▒ com 🔒, para eles verem o que falta descobrir.
- **Revelar só uma parte:** destrave um campo antes do nível (ex.: a vulnerabilidade que um livro contou).
- **Imagem** por criatura (do computador ou link): preta como silhueta enquanto pressentida, revelada ao ser avistada.
- **Pesquisa dos jogadores:** marque “Jogadores podem pesquisar” e a DT. Cada jogador rola Ocultismo pela ficha, uma vez por nível; quem passa sobe a criatura um nível (até estudada; dissecar é com você). Funciona com a sua janela fechada.
- O que muda para o jogador brilha na hora, e a revelação toca um som pela caixa do Escudo do Mestre.
- Os níveis antigos foram ajustados sozinhos (avistada, estudada e dissecada continuam as mesmas).

## Versão 2.8.1
- Quadro: arrastar os cartões ficou mais firme dentro do Owlbear (o arraste não se perde nem é cancelado pelo navegador). Clicar em outro cartão ou no fundo termina a edição de uma nota que ficou aberta, em vez de travá-la. Setas do teclado movem o cartão selecionado (Shift = passo maior).

## Versão 2.9
- **Tokens no quadro:** botão **🎭 Token** no quadro lista os tokens da cena aberta (com busca); clique para prender. Ou, no mapa, clique com o botão direito num token (ou em vários selecionados) → **📌 Prender no quadro**.
- O cartão mostra a imagem do token numa moldura redonda e o nome dele. Duas vezes no cartão para escrever uma anotação embaixo.
- Jogadores só veem e prendem tokens visíveis; o mestre vê também os escondidos (marcados).
- A imagem é a mesma do token: se o token for apagado do mapa, o cartão continua no quadro.

## Versão 2.9.1
- Tokens no quadro aparecem do jeito que estão na sala: só a imagem, sem moldura, fundo, alfinete ou inclinação. O nome aparece ao passar o mouse; a anotação (se houver) fica numa etiqueta pequena embaixo.

## Versão 2.9.4
- **Tamanho dos itens do quadro:** cada cartão (nota, pista, criatura, pessoa, foto ou token) pode ficar maior ou menor, de 40% até 3×.
  - Puxe a alça que aparece no canto de baixo, à direita, ao passar o mouse; ou
  - use os botões − e ＋ no canto de cima; ou
  - clique no cartão e aperte − ou +.
- O cartão cresce a partir do alfinete, então os barbantes continuam presos no lugar. O tamanho vale para todos na mesa.

## Novidades da versão 2.10

- **Prato do mestre**: os dados que o mestre rola no Hexatombe e no Painel do Mestre caem num prato de dados só dele, com a mesma aparência escolhida na ficha (Dados › Aparência dos dados e do prato). Nada é enviado pela sala: os jogadores nunca veem esse prato.
- O botão 🎲 no canto de baixo reabre o prato; 🕘 mostra as últimas rolagens do mestre (das três extensões) e 📌 deixa o prato aberto.


## Extensão separada: Mapa do Hexatombe (pasta `mapa/`)

Mapa de Bom Jesus do Açude, a cidade afogada da arena. É uma extensão à parte, com manifesto próprio.

**Instalar:** no Owlbear, **Extensions → Add Extension** e cole `https://pebarrosdenashor.github.io/hexatombe/mapa/manifest.json`.

**Mestre**
- Cada local tem três estados: **Oculto** (os jogadores não sabem que existe), **Avistado** (aparece no mapa só com o nome) e **Explorado** (aparece com o tipo e o que estiver liberado). Ao marcar Explorado, tudo é liberado de uma vez; depois dá para esconder partes.
- Cada parte do local é liberada separada: de quem é a base, descrição, cada detalhe, alerta e o dia em que afunda. As **notas do mestre** nunca aparecem para os jogadores.
- Tudo é editável: nome, tipo, equipe, textos, detalhes (adicionar e remover). Dá para criar locais novos e mover locais clicando no mapa.
- "Liberado em cada dia" mostra o que foi revelado em cada dia do ritual.
- "Ver como jogador" mostra exatamente o que a mesa vê.
- O dia vem da extensão Hexatombe quando ela está na sala (pode desligar em Ajustes e escolher o dia à mão).
- "Pôr mapa do dia na cena" coloca a imagem do dia na camada de mapa, travada. Com a opção ligada em Ajustes, a imagem troca sozinha quando o dia muda.
- Os textos ficam guardados no navegador do mestre. Use **Baixar cópia** antes de trocar de computador.

**Jogadores** veem o mapa com a água do dia, os locais liberados e uma lista do que descobriram em cada dia. Recebem um aviso quando o mestre libera algo novo.

**Imagens estáticas** (2000 × 1400, para usar como mapa da cena ou imprimir):
- `mapa/imagens/dia-1.png` a `dia-6.png`: só a cidade, sem os locais (para os jogadores).
- `mapa/imagens/mestre-dia-1.png` a `mestre-dia-6.png`: com todos os locais marcados.
- `mapa/gerar.html?dia=3&mestre=1` desenha o mapa no navegador, caso queira gerar de novo.

## v2.11 — janela ajustável e NPCs reorganizados

- **Tamanho da janela:** botão ⤡ no topo (Compacta, Padrão, Larga, Máxima e ajuste fino de largura/altura) ou arraste a alça ◢ no canto inferior direito. Duplo clique na alça volta ao padrão. O tamanho fica salvo no seu navegador.
- **Aba NPCs:** busca por nome, filtro por equipe, NPCs agrupados por equipe com barras de PV/PE já na lista. Ao abrir um NPC: PV/PE editáveis com barra, estatísticas em blocos e três sub-abas (Combate, Habilidades, Lore e notas). Equipe, baixar ficha, editar e apagar ficam no rodapé do cartão. Importar/exportar fichas fica recolhido no fim da aba.

## Novidades da versão 2.12 — Fome e Fervor

- Na aba **Equipes** (mestre), cada equipe pode ter um contador especial: **🩸 Fome** (Os Comensais) ou **🕯 Fervor** (A Romaria). Equipes com "Comensais" ou "Romaria" no nome já vêm com o contador certo; para outras, escolha no menu do cartão da equipe.
- Botões −5, −, +, +5 ou digite o valor direto. O valor nunca fica abaixo de 0.
- O **Escudo do Mestre** também mostra e altera esses pontos (aba Mesa, resumo do Hexatombe), mesmo com a janela do Hexatombe fechada.
- Os jogadores não veem esses contadores.

## Novidades da versão 2.13

- **Fome agora é de cada comensal:** na aba Equipes, cada integrante de Os Comensais tem o seu contador (− valor +) na própria linha; o cartão mostra o total da equipe.
- **Fervor do andor** continua um só para toda A Romaria.
- O Escudo do Mestre mostra esses contadores também no combate.

## Habilidade do Estigma (versão 2.14)
- Na ficha de um NPC (aba NPCs → ✎), marque **✠ Estigma** na habilidade que é a do Estigma. Só uma por ficha.
- **✠ Estigma do sacrifício:** deixe em “Automático” para usar o estigma do integrante na equipe, ou escolha um.
- Na aba Habilidades do NPC, a do Estigma aparece em vermelho com **✠ Usar**: todos na sala veem a animação do estigma e ouvem o som (precisa do Escudo do Mestre instalado na sala). No Escudo do Mestre, usar essa habilidade no Combate faz o mesmo.
- No arquivo .txt das fichas: comece o nome da habilidade com ✠ (`## ✠ Fúria do Cervo`) e use a linha `Estigma: Rancor` no topo, se quiser fixar o estigma.

## Novidades da versão 2.15 — ritmo do ritual

- **Cartão de abertura:** ao amanhecer e ao anoitecer, um cartão em tela cheia aparece para toda a mesa (dia, frase da Coroa, sacrifícios e as velas), com som. Na noite do dia 6 vira **Lua de Sangue**. Fecha sozinho ou com um clique. O mestre pode repetir com "🎬 Mostrar o cartão de agora para todos".
- **Mapa escurecendo:** na fase de Conclusão (noite) o mapa escurece aos poucos, sem cobrir os tokens; na Lua de Sangue fica avermelhado. Some ao amanhecer.
- **Relógio do sacrifício:** o mestre liga uma contagem regressiva (minutos e "até a meia-noite", "até o sacrifício"…), com +5 min, pausar e parar. Quando chega a zero, o sino toca em todas as telas.
- **Seis velas:** uma por estigma; apaga (com fumaça) quando o sacrifício daquele estigma morre. Funciona com mortes anônimas, porque só mostra o estigma.
- **Relógio na tela:** dia, fase, velas e relógio num quadrinho sobre o mapa. Cada pessoa pode esconder (✕), trocar de lugar (⇄: topo, canto direito, embaixo) e ligar "reduzir efeitos" na aba Ritual → "Na minha tela".
- O mestre liga/desliga cada efeito para a mesa na aba Ritual → Ritmo do ritual → Controles do mestre.
