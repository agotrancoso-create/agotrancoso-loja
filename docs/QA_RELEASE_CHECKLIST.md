# Agô Trancoso — QA e Release Checklist

## Regra de release

Uma alteração só é considerada pronta quando passa pelo quality gate e pelo smoke test das rotas críticas. Mudança visual também exige revisão em mobile real.

## Catálogo

- 19 produtos carregam sem inconsistências.
- Nenhum produto disponível fica sem imagem.
- Nenhuma imagem removida permanece em catálogo, curadoria, home ou Merchant feed.
- Preço e preço promocional respeitam as regras do catálogo.
- Capa do produto é a mesma em vitrine, sacola, metadados e Merchant quando aplicável.
- Imagens de produto normalizadas em 960×960 sem esticar/cortar a peça.

## Produto

- Título e descrição oficial corretos.
- Galeria abre mostrando a peça inteira.
- Zoom, miniaturas, swipe e teclado funcionam.
- Material, disponibilidade e uso específico aparecem sem substituir a descrição.
- CTA de compra continua visível e prioritária.
- Recomendados não repetem o produto atual.

## Checkout

- carrinho vazio;
- produto único;
- múltiplas unidades;
- múltiplos produtos;
- frete pago;
- frete grátis;
- cupom válido;
- cupom inválido;
- erro de endereço;
- erro de contato;
- resposta lenta do gateway;
- falha do gateway;
- retorno confirmado;
- retorno pendente;
- retorno inconsistente;
- total recalculado no servidor, sem confiar em preço enviado pelo navegador.

Não executar cobrança real automaticamente em CI. Uma compra liquidada em produção exige instrumento de pagamento autorizado e deve ser tratada como teste operacional controlado.

## Analytics

- page_view em navegação inicial e SPA;
- view_item_list;
- select_item;
- view_item;
- add_to_cart;
- remove_from_cart;
- view_cart;
- begin_checkout;
- add_shipping_info;
- add_payment_info;
- purchase apenas após confirmação;
- transaction_id único;
- moeda BRL;
- valor de compra inclui regra real de desconto/frete;
- purchase não duplica ao re-renderizar.

## SEO / Merchant

- canonical correto;
- title e meta description por página;
- Open Graph com imagem válida;
- sitemap e robots respondem 200;
- Product JSON-LD válido;
- BreadcrumbList válido;
- Merchant feed responde XML 200;
- imagem do feed existe;
- preço, promoção, disponibilidade e frete conferem com o checkout;
- imagens aposentadas não aparecem no XML.

## Acessibilidade

- teclado percorre navegação, produto, galeria, sacola e checkout;
- foco sempre visível;
- contraste legível;
- labels de inputs;
- mensagens de erro associadas;
- `prefers-reduced-motion` respeitado;
- touch target mínimo de 44px;
- sem conteúdo essencial apenas em hover;
- sem zoom involuntário de inputs no iOS.

## Mobile

Revisar pelo menos Safari/iPhone e Chrome/Android:

- safe areas;
- menu;
- hero;
- cards;
- galeria/zoom;
- sacola;
- formulário de checkout;
- teclado virtual;
- retorno do pagamento;
- botões flutuantes não bloqueiam conteúdo ou CTA;
- nenhuma rolagem horizontal acidental.

## Performance

Revisar Lighthouse mobile e desktop nas rotas:

- `/`
- `/produtos`
- um produto com múltiplas imagens
- `/checkout`

Acompanhar LCP, INP/TBT, CLS e peso de imagens. Não sacrificar fidelidade das peças por compressão agressiva sem medir o impacto real.

## Produção

Depois do deploy:

1. Vercel `READY` e domínio de produção apontando para o commit esperado.
2. `/api/health` responde `status: ok`.
3. smoke test das rotas críticas retorna 2xx.
4. logs sem novo cluster de erro runtime.
5. compra real só é marcada como validada quando uma transação autorizada tiver sido concluída e confirmada pelo gateway.
