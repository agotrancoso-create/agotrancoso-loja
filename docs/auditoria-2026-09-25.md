# Agô Trancoso: auditoria e refatoração

Auditoria iniciada sobre `2f6144e9016a352a4dd36a77f889061f0ba4ced2`. Atualizações concorrentes até `942099afada3fc26e776807c4c3c3aba53d31f48` integradas antes da publicação. Foram preservados fonte Cormorant Garamond, correções mais recentes de associação de fotos, elegibilidade remota do benefício, reserva atômica e liberação após falha de pagamento, webhook e metadados de checkout/confirmacão.

## Problemas encontrados e corrigidos

- O layout importava 22 folhas de estilo: 17.089 linhas e 7.315 declarações `!important`. Havia 120 arquivos CSS no diretório do aplicativo e 114 ocorrências do seletor de imagem principal entre as camadas ativas.
- Havia regras concorrentes para proporção, bordas, preenchimento, cores e controles. A segunda imagem dos cartões continuava sendo montada para troca no hover.
- O arquivo da terceira foto dos Pretos-Velhos estava corrompido, apesar da extensão JPEG. A mesma foto foi recuperada do histórico, sem retirar nenhuma das três imagens.
- Busca móvel sem miniaturas, fechamento por temporizador ao perder foco na busca do catálogo, ordenação sem navegação completa por teclado.
- Checkout com três etapas, desconto alterando o total enquanto era digitado, UF aceita apenas pela quantidade de letras e informações editadas permitindo atalhos inconsistentes.
- Marcação ARIA incompatível em buscas e sacola, hierarquia de títulos incompleta e ciclo de atualização desnecessário na confirmação.

## Implementação

Dois arquivos mantêm a apresentação: `app/globals.css` (tokens, base, navegação, páginas institucionais e rodapé) e `app/commerce.css` (catálogo, galeria, sacola e checkout). Os arquivos históricos e módulos de sobreposição foram removidos; continuam recuperáveis pelo Git. O CSS fonte ativo caiu de 533.867 para aproximadamente 46.800 bytes, redução de 91,2%. Restam três `!important`, exclusivamente para respeitar a preferência de movimento reduzido.

A paleta usa marfim, areia, argila, terracota e cacau. Cabeçalho móvel com controles de 48 px; contagem externa à alça da sacola. Fotos quadradas no catálogo, sem molduras ou padding, com cantos arredondados e proporção original preservada. A imagem principal não troca no hover. Galerias preservam setas, contador, miniaturas, gesto horizontal, teclado e ampliação em diálogo nativo.

Os quatro benefícios usam os símbolos originais. Cada um expande um detalhe com link útil. “Da Bahia para o mundo” explica envio internacional por consulta. No celular, redes sociais ficam no fim da página para não cobrir compras ou campos. O rodapé usa cor própria e colunas compactas.

A sacola reserva a base para valores e conclusão; complementos ficam na área rolável e são ocultados no celular. O checkout tem Dados, Entrega, Benefício e Pagamento. Há validação por campo, foco no erro, revisão das etapas anteriores, cupom aplicado explicitamente e alternativa clara sem cupom. Cliente e servidor compartilham a validação. O cupom consulta a elegibilidade remota antes de entrar no total e é invalidado ao trocar e-mail ou telefone. A oferta é ocultada quando o armazenamento do benefício está indisponível. O convite de primeira compra aguarda 30 segundos e envolvimento com a página, evita outras sobreposições e informa falhas ao salvar o código no navegador.

## Dados e regras preservados

Os 19 produtos, preços, promoções e disponibilidade foram preservados. As associações de fotos corrigidas na atualização concorrente foram incorporadas em `data/products.json`, com 36 referências de fotos. As imagens também passam a usar esse arquivo como fonte única, eliminando o mapa duplicado em `lib/products.ts`.

Frete nacional de R$ 39,90; grátis somente acima de R$ 500; benefício de primeira compra de 3%; verificação de elegibilidade no servidor; envio internacional por consulta; integração InfinitePay, URLs de retorno/webhook, rastreamento e canais sociais preservados.

## Verificações

- Build otimizado: 37 páginas geradas; TypeScript e checagem de build aprovados.
- 108 verificações de layout nas larguras 320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1440, 1600 e 1920 px. Início, coleção, produto, contato, essência, checkout vazio/preenchido e páginas legais. Sem overflow horizontal.
- Contadores 1, 4, 9, 10, 12, 99, 100 e 120. CTA da sacola permanece na tela. Preços de R$ 50, R$ 250 e R$ 8.500; quantidades 1, 4 e 12, com e sem cupom, em 18 combinações no servidor.
- 19 páginas de produto e decodificação das 36 fotos. Colar quadrado, sem distorção. Pretos-Velhos com três fotos.
- Busca por inicial, ordenação de relevância das sugestões, fotos/preços, estado vazio, todas as categorias e ordenação por nome/preço. Teclas direcionais, Enter e Escape.
- Galeria com teclado, gesto, zoom e Escape; benefícios por teclado; busca móvel com fotos.
- Checkout completo com validação de UF, foco dos erros, bloqueio de avanço após edição inválida, aplicação/remoção de desconto, erro de pagamento e nova tentativa. Total de R$ 500 gera R$ 539,90 sem cupom e R$ 524,90 com AGO3.
- A rota real de checkout foi testada com provedor e elegibilidade simulados, incluindo centavos distribuídos pelos itens, recusa do benefício, dados inválidos e falha da InfinitePay. Nenhuma cobrança real foi criada.
- Auditoria axe-core em desktop e celular, incluindo estados de busca, ordenação, sacola, galeria, etapas do checkout e oferta. Os resultados automatizados complementam a revisão manual, sem equivaler a certificação WCAG.

### Contraste medido dos pares utilizados

| Texto / fundo | Razão |
|---|---:|
| Café / marfim | 14,29:1 |
| Café / areia | 11,74:1 |
| Café / argila | 8,37:1 |
| Cacau / argila | 7,11:1 |
| Texto secundário / marfim | 6,76:1 |
| Texto secundário / areia | 5,56:1 |
| Terracota / marfim | 6,37:1 |
| Terracota / areia | 5,24:1 |
| Marfim / botão terracota | 6,37:1 |
| Marfim / cacau | 12,14:1 |

Os textos sobre argila usam café/cacau, não o tom secundário de menor contraste. O hero tem sobreposição escura para legibilidade sobre a foto. Estados de foco permanecem visíveis e o movimento reduzido desativa transições.

### Limites e observações

A terceira foto dos Pretos-Velhos foi recuperada em sua resolução original de 360 × 360. Não foi encontrado no acervo o mesmo enquadramento em alta resolução. Ela foi preservada, sem ampliar artificialmente nem substituir por outra composição. As outras duas têm 1024 × 1024.

O build informa aproximadamente 106 kB de JavaScript inicial na home e 110 kB no checkout. São medidas de laboratório/build; não foram inventadas pontuações de Lighthouse nem valores de Core Web Vitals de usuários reais. O teste da InfinitePay usa resposta simulada: liquidação de pagamento e entrega de webhook real não foram executadas.

## Reproduzir testes

- `node scripts/qa-commerce.cjs`
- `npm run build`
- `PLAYWRIGHT_MODULE=/caminho/playwright CHROMIUM_PATH=/caminho/chromium node scripts/qa-ui.cjs`
- `PLAYWRIGHT_MODULE=/caminho/playwright CHROMIUM_PATH=/caminho/chromium AXE_PATH=/caminho/axe.min.js node scripts/qa-accessibility.cjs`

Os testes de UI iniciam e encerram o servidor local na porta 3100. `QA_ARTIFACTS` define o diretório de resultados e capturas. `QA_WIDTHS=390,1440` permite a checagem focalizada das interações após ajustes sem impacto nos demais breakpoints.
