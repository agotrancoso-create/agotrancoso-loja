# Agô Trancoso — Commerce, Analytics, CRM e CRO

## Objetivo

Medir o funil real da loja antes de criar hipóteses de conversão. CRO da Agô deve ser orientado por comportamento observado, não por truques genéricos.

## Funil GA4 implementado

Eventos no site:

1. `view_item_list` — visualização de lista/vitrine.
2. `select_item` — seleção de produto em lista.
3. `view_item` — página de produto.
4. `add_to_cart` — adição à sacola.
5. `remove_from_cart` — remoção.
6. `view_cart` — visualização da sacola.
7. `begin_checkout` — início do checkout.
8. `add_shipping_info` — entrega.
9. `add_payment_info` — etapa de pagamento.
10. `purchase` — somente após confirmação do gateway.
11. `contact` — intenção de contato.

O GA4 usa page view manual para navegação SPA. O evento de compra usa `transaction_id` e deduplicação no navegador.

## Meta Pixel

Mapeamentos principais:

- `view_item` → `ViewContent`
- `add_to_cart` → `AddToCart`
- `begin_checkout` → `InitiateCheckout`
- `purchase` → `Purchase`
- `contact` → `Contact`

A compra só deve ser marcada depois de resposta positiva da verificação InfinitePay.

## Métricas mínimas de CRO

Medir por dispositivo e fonte de tráfego:

- taxa produto → add_to_cart;
- taxa sacola → checkout;
- taxa checkout → pagamento iniciado;
- taxa pagamento iniciado → compra confirmada;
- receita por sessão;
- ticket médio;
- produtos com maior taxa de seleção e compra;
- abandono por etapa do checkout;
- CTR de WhatsApp;
- conversão mobile versus desktop.

## Janela de decisão

Não alterar interface por causa de poucas sessões. Para mudanças de alto impacto, exigir volume suficiente para distinguir padrão de ruído. Mudanças urgentes de acessibilidade, erro, conteúdo incorreto ou falha de checkout não precisam esperar experimento.

## Backlog de experimentos

Somente iniciar depois de dados reais indicarem oportunidade. Exemplos:

- ordem dos produtos da home;
- capa A/B de uma peça com múltiplas fotos fortes;
- posição de prova de confiança na página de produto;
- texto da CTA de checkout;
- ordem de benefícios de frete/pagamento;
- recomendação de complementares.

Não testar várias mudanças ao mesmo tempo quando isso impedir atribuição do resultado.

## Merchant Center

Feed oficial: `/google-merchant.xml`.

Regras:

- título comercial sem keyword stuffing;
- descrição fiel ao produto;
- imagem principal usa a curadoria real da vitrine;
- preço e promoção derivados do catálogo;
- disponibilidade sincronizada com `available`;
- frete calculado pela mesma regra do checkout;
- produtos sem GTIN/MPN próprios usam `identifier_exists=no`;
- variantes da Igreja do Quadrado compartilham `item_group_id` e usam tamanho P/M/GG.

O feed é testado no quality gate para impedir o retorno de imagens aposentadas.

## CRM e recuperação de checkout

A recuperação de carrinho/checkout só deve usar e-mail, SMS ou WhatsApp promocional quando houver base legal/consentimento aplicável. Não adicionar automaticamente todo comprador a marketing.

Estado desejado do fluxo:

1. cliente aceita receber novidades/ofertas;
2. checkout iniciado gera evento CRM com produtos, valor e URL;
3. compra confirmada gera evento de pedido;
4. automação de abandono é cancelada quando existe compra correspondente;
5. pós-compra pode pedir avaliação ou sugerir complementares em janela adequada;
6. opt-out é respeitado em todos os canais.

A integração deve usar credencial privada somente no servidor. Nunca expor private API key no bundle do navegador.

## Critério de validação externa

Instrumentação no código não equivale a dados recebidos. Antes de considerar Analytics/CRM “validado em produção”, confirmar:

- eventos no GA4 DebugView/Realtime;
- propriedade correta e domínio correto;
- deduplicação de compra;
- valores e moeda BRL;
- Merchant Center processando o feed sem erros impeditivos;
- eventos do CRM recebidos na conta correta;
- fluxo de abandono/pós-compra ativo e com consentimento.
