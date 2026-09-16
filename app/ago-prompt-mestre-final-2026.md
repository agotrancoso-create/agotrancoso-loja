# PROMPT MESTRE FINAL — AGÔ TRANCOSO 2026

Aprimorar o e-commerce Agô Trancoso existente sem reconstruir a arquitetura, sem trocar gateway, sem remover conteúdo ou produtos. Trabalhar sobre o projeto atual, preservando funcionalidades e fotos originais.

## Direção visual

Criar uma experiência de marca premium, artesanal, brasileira e contemporânea, inspirada em Trancoso. A página deve parecer uma loja de design/cerâmica de alto padrão, nunca um template genérico.

Paleta obrigatória: creme, areia, barro, terracota e marrom. NÃO usar verde, oliva, esmeralda, lima, menta ou qualquer variação esverdeada.

Não usar bordas decorativas, filetes, divisores ou molduras nas seções. Cards e fotos podem usar cantos arredondados, mas sem outlines, sombras duras ou molduras.

## Desktop + celular

A composição deve ser responsiva de verdade, mantendo a mesma linguagem visual nos dois formatos. Desktop não pode parecer uma versão esticada do mobile; mobile não pode parecer uma versão esmagada do desktop.

No celular, todas as seções devem parecer completas e intencionais, evitando grandes áreas vazias. No desktop, usar largura de página proporcional e aproveitar a tela sem transformar tudo em conteúdo centralizado estreito.

## Categorias

A faixa de categorias deve ser visualmente uniforme e alinhada com a identidade da marca. Usar: Todos, Trancoso, Igrejinhas, Decoração, Fé e devoção, Presentes. Sem verde, sem bordas decorativas e sem aparência de controles antigos.

## Diferenciais

Os quatro diferenciais devem compartilhar exatamente a mesma linguagem cromática e tipográfica: feito à mão; peças exclusivas; inspiração brasileira; envio para todo Brasil. Nenhum deles pode ficar com cor destoante.

## Fotos

Todas as fotos das peças devem ter cantos arredondados no desktop e no celular, sem borda. Não alterar artificialmente o conteúdo das fotografias.

A foto da seção “Um pouco de Trancoso para dentro de casa” precisa mostrar as duas igrejas inteiras. Não usar object-fit: cover nessa imagem. Preservar a proporção original e evitar qualquer corte.

## Botão Adicionar ao carrinho

Criar um CTA visualmente elegante, confortável para toque e coerente com uma marca premium: marrom profundo, texto claro, formato arredondado, altura confortável, excelente contraste, sem excesso de efeitos. O botão deve chamar atenção de maneira natural por hierarquia visual, contraste e consistência, sem alegações ou “truques” pseudocientíficos.

## Checkout / Finalizar compra

Refazer a composição visual do checkout sem alterar o funcionamento do pagamento. Desktop deve ter duas colunas proporcionais: formulário e resumo. Títulos, labels, campos, textos e resumo devem ter hierarquia clara e tamanhos legíveis.

Os campos precisam parecer parte da mesma identidade do site. O botão principal deve ter forte hierarquia visual. O resumo deve ter boa leitura de produtos, quantidades, subtotal, frete e total.

No mobile, tudo deve ocupar a largura útil, sem fontes microscópicas, sem elementos espremidos e sem excesso de vazio.

## Rodapé

Manter TODAS as informações atuais. Melhorar somente composição, tipografia, espaçamento e hierarquia. Usar Cormorant Garamond para títulos/display e DM Sans para corpo e links. No mobile, organizar em blocos respirados e proporcionais, sem parecer um paredão de informação.

O item de navegação deve aparecer como “A Agô”, não “Nossa essência”, embora o link continue apontando para /nossa-essencia.

## Texto e marca

Preservar a linguagem: “Feitas à mão”, “Envio para todo o Brasil”, “Nossa essência” somente quando for o nome correto da página/conteúdo, e posicionamento de cerâmica e artesanato inspirado em Trancoso. Não usar “made in Trancoso” e não usar “autoral”.

## Regra de implementação

Antes de editar, auditar os estilos existentes porque existem várias camadas CSS históricas. A nova camada final deve ser carregada por último para prevalecer, mas não deve criar conflitos ou remover funcionalidades.

Depois de implementar, verificar o diff e confirmar que os arquivos alterados estão no branch main. Não afirmar que está publicado em produção sem confirmar um novo deployment da Vercel.
