# PROMPT MESTRE FINAL — AGÔ TRANCOSO 2026

Aprimorar o e-commerce Agô Trancoso existente sem reconstruir a arquitetura, sem trocar gateway, sem remover conteúdo ou produtos. Trabalhar sobre o projeto atual, preservando funcionalidades e fotos originais.

## Direção visual

Criar uma experiência de marca premium, artesanal, brasileira e contemporânea, inspirada em Trancoso. A página deve parecer uma loja de design/cerâmica de alto padrão, nunca um template genérico.

### Paleta obrigatória — referência terrosa

NÃO usar ocre, caqui, mostarda, verde, oliva, esmeralda, lima, menta ou qualquer tom visualmente amarelado/verdeado que destoe da referência terrosa aprovada.

Usar principalmente a família:
- Creme: `#F6F1EB`
- Papel rosado: `#EFE4DB`
- Areia rosada: `#D9C3B4`
- Caramelo terroso: `#AC7449`
- Terra: `#9C5D36`
- Barro queimado: `#874B31`
- Castanho terroso: `#775243`
- Vinho-terra: `#6A433C`
- Marrom: `#4A2C24`
- Marrom profundo: `#322018`
- Texto: `#38251F`
- Branco quente: `#FFFDF9`

A sensação visual desejada é barro, terracota, ferrugem suave, castanho, vinho-terra e creme. Evitar aparência cáqui/ocre.

Não usar bordas decorativas, filetes, divisores ou molduras nas seções. Cards e fotos podem usar cantos arredondados, mas sem outlines, sombras duras ou molduras.

## Desktop + celular

A composição deve ser responsiva de verdade, mantendo a mesma linguagem visual nos dois formatos. Desktop não pode parecer uma versão esticada do mobile; mobile não pode parecer uma versão esmagada do desktop.

No celular, todas as seções devem parecer completas e intencionais, evitando grandes áreas vazias. No desktop, usar largura de página proporcional e aproveitar a tela sem transformar tudo em conteúdo centralizado estreito.

Nenhuma página pode colapsar em uma coluna estreita por causa de regras globais herdadas.

## Estrutura das páginas

Auditar CSS histórico antes de criar novas regras. Priorizar classes específicas por página e remover/neutralizar regras globais conflitantes.

Criar wrappers explícitos quando necessário:
- `.catalog-shell`
- `.product-page-shell`
- `.checkout-shell`
- `.contact-shell`
- `.essencia-shell`

Usar aproximadamente 1180–1280px de largura útil no desktop e 16–20px de margem interna no celular.

## Categorias

A faixa de categorias deve ser visualmente uniforme e alinhada com a identidade da marca. Usar: Todos, Trancoso, Igrejinhas, Decoração, Fé e devoção, Presentes. Sem verde, sem ocre/caqui, sem bordas decorativas e sem aparência de controles antigos.

## Diferenciais

Os quatro diferenciais devem compartilhar exatamente a mesma linguagem cromática e tipográfica: feito à mão; peças exclusivas; inspiração brasileira; envio para todo Brasil. Nenhum deles pode ficar com cor destoante.

## Fotos

Todas as fotos das peças devem ter cantos arredondados no desktop e no celular, sem borda. Não alterar artificialmente o conteúdo das fotografias.

A foto da seção “Um pouco de Trancoso para dentro de casa” precisa mostrar as duas igrejas inteiras. Não usar `object-fit: cover` nessa imagem. Preservar a proporção original e evitar qualquer corte.

## Botão Adicionar ao carrinho

Criar um CTA visualmente elegante, confortável para toque e coerente com uma marca premium: marrom profundo, texto claro, formato arredondado, altura confortável, excelente contraste, sem excesso de efeitos. Preferir largura total do card em produtos e largura total do bloco de compra no detalhe do produto.

O botão deve chamar atenção de maneira natural por hierarquia visual, contraste, consistência e affordance clara, sem alegações de “truques de neurociência”.

## Checkout / Finalizar compra

Refazer a composição visual do checkout sem alterar o funcionamento do pagamento. Desktop deve ter duas colunas proporcionais: formulário e resumo. Títulos, labels, campos, textos e resumo devem ter hierarquia clara e tamanhos legíveis.

Os campos precisam parecer parte da mesma identidade do site. O botão principal deve ter forte hierarquia visual. O resumo deve ter boa leitura de produtos, quantidades, subtotal, frete e total.

No mobile, tudo deve ocupar a largura útil, sem fontes microscópicas, sem elementos espremidos e sem excesso de vazio.

Não exibir visualmente 01/02/03 como etapas numeradas.

## Rodapé

Manter TODAS as informações atuais. Melhorar somente composição, tipografia, espaçamento e hierarquia. Usar Cormorant Garamond para títulos/display e DM Sans para corpo e links. No mobile, organizar em blocos respirados e proporcionais, sem parecer um paredão de informação.

O item de navegação deve aparecer como “A Agô”, não “Nossa essência”, embora o link continue apontando para `/nossa-essencia`.

Não remover Instagram, WhatsApp, site, política de frete, descrição ou copyright.

## Tipografia

Títulos/display: `Cormorant Garamond`.
Corpo/interface: `DM Sans`.

NÃO criar regra global tardia que force uma única fonte para todos os elementos.

Os títulos precisam ter largura suficiente para não quebrar palavra por palavra.

## Catálogo

Desktop: 4 colunas proporcionais.
Tablet: 2–3 colunas.
Mobile: 2 colunas.

Título, filtros e grid devem pertencer ao mesmo fluxo de largura.

## Detalhe do produto

Desktop: galeria grande à esquerda e informações/compra à direita.
Mobile: galeria primeiro, informações depois.

A foto principal deve ser grande, preservada e arredondada.

## Contato

Desktop: texto à esquerda + canais/localização à direita.
Mobile: uma coluna.

Nunca permitir texto estreito que quebre palavra por palavra.

## A Agô

Desktop: composição aproximadamente 50/50 entre texto e imagem.
Mobile: uma coluna.

O título “O encanto de Trancoso” deve ter largura saudável.

## Bordas

Nenhuma seção deve possuir border-top/bottom/left/right, filete, divisor ou moldura.

Fotos: apenas cantos arredondados.

## Texto e marca

Preservar a linguagem: “Feitas à mão”, “Envio para todo o Brasil”, “A Agô”, “Trancoso em forma de cerâmica.” e “Um pouco de Trancoso para dentro de casa.”

Não usar “made in Trancoso” e não usar “autoral”.

## Regra de implementação

Antes de editar, auditar os estilos existentes porque existem várias camadas CSS históricas. Não continuar acumulando arquivos `final2`, `force2`, `ultimate`, `really-final` etc.

Quando possível, centralizar a correção em uma folha final organizada por:
- base/paleta
- header
- catálogo
- cards
- produto
- benefícios
- editoriais
- checkout
- contato
- A Agô
- footer
- responsive

Depois de implementar, verificar o diff e confirmar que os arquivos alterados estão no branch `main`. Não afirmar que está publicado em produção sem confirmar um novo deployment da Vercel.
