# Agô Trancoso — Design System Signature

## Princípio

A Agô deve parecer Trancoso sem recorrer a clichês tropicais. A referência vem da matéria e da luz: cal branca, areia quente, argila, madeira, cacau e a fotografia real das peças. A interface deve transmitir autoria, silêncio visual, confiança e acabamento artesanal premium.

## Paleta

- Cal: `#fcf9f4` — fundo principal.
- Cal quente: `#f8f1e8` — superfícies secundárias.
- Areia: `#efe0ca` — capítulos editoriais pontuais.
- Areia profunda: `#dfc29f` — contraste quente controlado.
- Argila: `#974a31` — eyebrow e acentos.
- Terracota: `#82402d` — links e ações secundárias.
- Madeira: `#68483a` — cabeçalho e identidade estrutural.
- Cacau: `#35241d` — títulos e CTAs principais.
- Texto: `#362820` — corpo.
- Texto secundário: `#715d51`.

Não usar verde-oliva como cor estrutural. Não usar preto puro. Não usar gradientes decorativos fora de áreas em que exista função de legibilidade ou transição editorial.

## Tipografia

- Display: Cormorant Garamond 500/600/700.
- Interface e corpo: Manrope.
- Títulos: serifados, contraste alto, poucas palavras e respiro amplo.
- Corpo: Manrope, line-height entre 1.6 e 1.85 conforme o contexto.
- Eyebrows: caixa alta, 0.68–0.75rem, peso 800, tracking 0.12–0.16em.

Não criar uma terceira família tipográfica. Não transformar símbolos de seta em emoji; setas editoriais devem ser renderizadas como texto.

## Espaçamento e geometria

- Gutter desktop: fluido até 56px.
- Gutter mobile padrão: 18px.
- Raio principal de cards/imagens: 20px.
- Raio editorial grande: 24–26px.
- Touch targets: mínimo 44px; ações principais 48–52px.
- Divisórias: `rgba(104,72,58,.10–.17)`.
- Sombras: apenas quando ajudam a separar superfície; opacidade baixa.

## Fotografia

A fotografia é o principal elemento de luxo. Regras obrigatórias:

1. Nunca esticar, deformar ou cortar a peça para preencher um quadrado.
2. Imagens de produto são normalizadas para 960×960 no prebuild, usando `contain`, interpolação Lanczos e JPEG quality 100 / 4:4:4.
3. A capa é escolhida editorialmente por produto em `lib/merchandising.ts`, e não pela ordem acidental do cadastro.
4. Ordem recomendada: leitura mais clara/impactante → frente → ângulo → detalhe → contexto.
5. Fundo e enquadramento devem manter a peça inteira legível.
6. A imagem principal da galeria deve abrir mostrando a peça inteira antes de qualquer zoom.
7. Fotos fornecidas pela marca não recebem filtros artificiais, saturação inventada ou alteração da peça.
8. Fotos institucionais usam qualidade 100 e `cover` apenas quando a composição editorial permite.

## Home

A primeira dobra deve responder em poucos segundos:

- onde a marca está: Quadrado de Trancoso, Bahia;
- o que vende: cerâmica;
- qual ação tomar: ver peças.

A hero pode usar overlay somente para legibilidade. O overlay deve ser localizado e não deve apagar a fotografia.

## Cards

- Foto primeiro; nome e preço depois.
- Não adicionar selos sem função comercial real.
- Não criar sombras fortes ou molduras espessas.
- Capas seguem `getAttentionCoverImage`.
- Hover de desktop limitado a deslocamento sutil; mobile não depende de hover.

## Página de produto

Preservar a descrição oficial da marca. Informações complementares entram em uma ficha separada, nunca reescrevendo o texto original:

- material;
- origem/seleção;
- disponibilidade;
- uso específico quando aplicável;
- dimensões quando fornecidas.

A compra deve permanecer mais importante que informações secundárias.

## Mobile

Mobile é tratado como interface própria:

- gutter fixo visual de 18px;
- header com targets mínimos de 48px;
- inputs com 16px para evitar zoom automático no iOS;
- títulos com line-height mais compacto;
- cards em duas colunas apenas quando a leitura da peça continuar boa;
- checkout sem sidebar sticky;
- safe-area respeitada para botões flutuantes;
- nenhum controle essencial pode depender de hover;
- menu deve ter contraste AA ou superior.

## Páginas institucionais

`A Agô` e `Contato` permanecem neutras, claras e sem fundo colorido envolvendo o conteúdo. Bahia aparece em fotografia, tipografia, texto e pequenos acentos, não em grandes caixas bege.

## Acessibilidade

- foco visível obrigatório;
- navegação completa por teclado;
- skip link;
- alt text descritivo em fotografia de produto;
- labels reais em formulários;
- erros associados por `aria-describedby`;
- contraste suficiente;
- suporte a `prefers-reduced-motion`;
- targets de toque mínimos;
- headings em ordem lógica.

## Regra de mudança

Toda nova alteração visual deve responder a uma destas perguntas: melhora compreensão, confiança, inspeção da peça, acessibilidade ou conversão? Se não melhorar nenhuma delas, não deve ser adicionada.
