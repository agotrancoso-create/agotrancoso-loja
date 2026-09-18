# Agô Trancoso — rastreamento comercial

O site já possui instrumentação do funil para Google Analytics 4, Meta Pixel e dataLayer.

Eventos implementados:
- page_view (via GA4)
- view_item
- add_to_cart
- remove_from_cart
- begin_checkout

Para ativar GA4 e Meta Pixel, configure na Vercel:
- NEXT_PUBLIC_GA4_MEASUREMENT_ID
- NEXT_PUBLIC_META_PIXEL_ID

As variáveis são públicas por definição (prefixo NEXT_PUBLIC_) e não devem receber segredos.

Importante: o evento purchase não é disparado automaticamente na página "Pedido encaminhado", porque essa página não comprova, por si só, que o pagamento foi aprovado. O próximo passo para medição completa de receita é ligar a confirmação real do pagamento/webhook a uma fonte de pedidos persistida e então disparar purchase uma única vez.
