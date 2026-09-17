# Agô Trancoso — loja virtual

Loja virtual da Agô Trancoso com catálogo, sacola, checkout e integração preparada para pagamento pela InfinitePay.

## Publicação no Vercel

1. Envie este projeto ao Vercel.
2. Use `ago-trancoso` como nome do projeto, se estiver disponível.
3. Configure `NEXT_PUBLIC_SITE_URL` com a URL pública do site.
4. Configure as variáveis de frete somente quando houver uma API real contratada.

## InfinitePay

A InfiniteTag usada pelo checkout é `ago-trancoso`.
O checkout é criado no servidor em `app/api/create-checkout/route.ts` usando a API de Checkout da InfinitePay. O webhook fica em `app/api/webhooks/infinitepay/route.ts`.

Antes de divulgar o site, faça um teste de ponta a ponta no ambiente real da conta, sem afirmar aprovação apenas pelo retorno ao site.

## Produtos

Os 19 produtos, preços, descrições e ordem do catálogo estão em `data/products.json`. Para trocar uma foto, substitua o arquivo correspondente em `public/produtos/` mantendo o mesmo nome.

## Frete

O projeto não inventa valores. Sem `FRETE_API_URL` e `FRETE_API_TOKEN`, o checkout informa que o cálculo automático ainda não está configurado.

## WhatsApp

Número: `557398558124`.

## Atualização visual final
Esta versão prioriza produtos na primeira seção da home, usa fundos claros em tons terrosos, fotos com cantos arredondados, hero com blur sutil e tratamento amigável para frete e checkout. O pagamento permanece em InfinitePay com handle `ago-trancoso`.

## Auditoria de 16/09/2026
A camada final de direção de arte foi revisada para remover o verde/oliva da interface, manter a grade da vitrine preenchida no desktop e aplicar cantos arredondados somente nas fotografias, sem molduras, halos ou sombras.

## Sincronização de deploy
Última verificação de sincronização GitHub/Vercel em 17/09/2026.

## Trigger de deploy
Push de verificação para confirmar o disparo automático GitHub → Vercel.
