# Agô Trancoso — Orquestração Completa de Plugins 2026

## Objetivo

Executar uma auditoria e um ciclo de melhoria do site atual da Agô Trancoso usando **todas as integrações conectadas que tenham função aplicável**, sem reconstruir o projeto e sem quebrar dados, preços, carrinho, checkout ou InfinitePay.

Repositório principal: `agotrancoso-create/agotrancoso-loja`
Branch: `main`
Projeto Vercel: `agotrancoso-loja-bmmo`
Domínio: `https://www.agotrancoso.com.br`

## Regra de ouro

Não criar um segundo site para substituir o atual.
Não migrar para Wix, Floot ou Hatchable apenas para contornar a Vercel.
Não alterar preços, produtos, imagens, disponibilidade, frete ou lógica de pagamento durante o trabalho visual.
Não inventar resultados de plugin quando a integração não tiver acesso aos dados.

## Matriz de plugins

### 1. GitHub — implementação

Usar como fonte única de código.

Verificar antes de cada ciclo:

- `main` é a fonte de verdade.
- `app/layout.tsx` permanece íntegro.
- A home continua com produtos antes da hero.
- Dados em `data/products.json` não são alterados sem solicitação explícita.
- Checkout e integração InfinitePay permanecem intactos.

Consolidar alterações em poucos commits para evitar excesso de deployments.

### 2. Canva — direção de arte

Usar os materiais já existentes da Agô como referência visual:

- `Agô Trancoso: Nova Direção Editorial`
- `Direção visual Agô Trancoso`
- `Agô Trancoso — referência visual atual`
- `Agô Trancoso — revisão visual sertão e conversão`

Extrair princípios de composição, ritmo, escala tipográfica, proporção imagem/texto, uso de espaço negativo e direção editorial.

Não copiar layout, assets ou identidade de terceiros.

### 3. Adobe Express — referências de design

Usar referências de look book, interiores, home decor editorial e composição neutra/terrosa.

Priorizar:

- fotografia grande;
- hierarquia editorial;
- fundo creme/neutro;
- terracota como acento;
- composição sofisticada;
- contraste entre blocos claros e escuros;
- merchandising visual.

Não transformar a identidade em template de Instagram ou peça promocional genérica.

### 4. Mobbin — UX/UI

Usar para estudar:

- navegação de ecommerce;
- descoberta de produtos;
- product cards;
- filtros;
- PDP;
- carrinho;
- checkout;
- mobile ecommerce.

Quando a conta/plano não permitir acesso, registrar o bloqueio e continuar usando os aprendizados que puderem ser verificados por outras fontes. Nunca inventar telas ou resultados.

### 5. Vercel — deployment e produção

A Vercel é o host oficial do site.

Fluxo obrigatório:

1. Verificar último deployment.
2. Verificar commit associado.
3. Verificar estado do build.
4. Verificar domínio de produção.
5. Somente após o desbloqueio de quota, fazer um deployment consolidado da `main`.
6. Confirmar que o deployment aponta para o commit mais recente.
7. Confirmar que a produção responde no domínio oficial.

**Importante:** se aparecer `Deployment rate limited` / `build-rate-limit`, não ficar disparando novas tentativas. O bloqueio é de plataforma/quota e não é resolvido por outro commit. A documentação/comunidade da Vercel registra limite de deployments no Hobby em janela móvel de 24 horas, incluindo deployments de preview. citehttps://community.vercel.com/t/vercel-deployment-limits-and-pr-merge-failures-with-v0-on-hobby-plan/33776

O objetivo passa a ser deixar a `main` completamente pronta e fazer **um único deployment** assim que a quota liberar.

### 6. TinyFish — inspeção do site real

Usar para comparar:

- código atual;
- HTML efetivamente publicado;
- title/meta/OG;
- conteúdo da home;
- páginas públicas;
- comportamento que possa ser observado sem autenticação.

Nunca afirmar que um commit está publicado apenas porque ele está no GitHub.

### 7. GSC Wizard — SEO técnico

Quando uma propriedade estiver conectada:

- auditar home;
- coleção;
- páginas de produto;
- contato;
- indexação;
- canonical;
- titles/meta;
- H1;
- alt das imagens;
- structured data;
- sitemap.

Se nenhuma propriedade estiver conectada, registrar `not configured` e não inventar métricas.

### 8. HYPD AI — aquisição e CRO

Quando Google Ads/Meta/Merchant Center estiverem conectados:

- executar auditoria ecommerce;
- verificar coerência entre anúncio, produto e landing page;
- observar conversão e jornada;
- verificar qualidade do catálogo/feed;
- analisar criativos quando houver dados;
- nunca alterar campanhas automaticamente sem autorização específica.

Sem conta conectada, não fabricar dados de Ads.

### 9. Floot — verificação de alternativa de infraestrutura

Não migrar o site para Floot.

Usar apenas como referência de arquitetura/possibilidades quando necessário.

Se não houver projeto Agô no Floot, registrar isso e manter o projeto atual no GitHub + Vercel.

### 10. Hatchable — infraestrutura alternativa

Não duplicar nem migrar a loja atual para Hatchable.

Pode ser usado apenas para validar ideias técnicas ou padrões de hosting, caso isso seja realmente necessário.

Se não houver projeto Agô no Hatchable, não criar um clone.

### 11. Wix — não substituir o projeto atual

Não migrar o site atual para Wix.

Usar apenas quando houver uma necessidade específica de pesquisa/integração relacionada ao ecossistema Wix. O site oficial continua sendo o projeto Next.js do GitHub.

## Direção visual obrigatória

A Agô deve parecer:

**marca brasileira premium + decoração + Bahia + Trancoso + barro + trabalho manual + editorial.**

Evitar:

- souvenir;
- rústico barato;
- excesso de mandacaru/cactus;
- chapéu de couro;
- cordel/xilogravura em excesso;
- textura envelhecida;
- estética de template SaaS;
- azul;
- verde/oliva/esmeralda/lima;
- amarelo forte;
- mostarda dominante;
- excesso de marrom/laranja;
- bordas e sombras pesadas.

Paleta principal:

- `#8d4327`
- `#ad5a32`
- `#9b4930`
- `#3f261c`
- `#211914`
- `#fbfaf7`
- `#f5efe7`

Tipografia:

- Cormorant Garamond para títulos;
- DM Sans para corpo/UI.

## Hierarquia da home

1. Header
2. Coleção/produtos
3. Categorias
4. Faixa de identidade
5. Hero
6. Benefícios
7. Mais da coleção
8. Da Bahia para sua casa
9. Como comprar
10. Visite a Agô
11. Footer

**Produtos continuam antes da hero.**

## Qualidade de ecommerce

Cada produto precisa ter:

- imagem protagonista;
- nome legível;
- preço evidente;
- CTA `Adicionar ao carrinho`;
- acesso claro à página do produto;
- feedback de hover/focus sem exagero.

No mobile:

- composição própria;
- sem desktop comprimido;
- toque confortável;
- sem overflow horizontal;
- imagens grandes;
- leitura rápida;
- CTA acessível.

## Critério técnico final

Antes de considerar a versão pronta:

- nenhum arquivo crítico truncado;
- `layout.tsx` válido;
- imports CSS válidos;
- nenhuma referência a arquivo inexistente;
- nenhum preço alterado;
- nenhum produto removido;
- checkout preservado;
- InfinitePay preservado;
- frete preservado;
- primeira compra preservada;
- acessibilidade básica preservada;
- performance não degradada desnecessariamente;
- um único commit consolidado para o próximo deployment.

## Estado de deployment conhecido em 17/09/2026

O projeto Vercel `agotrancoso-loja-bmmo` está conectado ao GitHub, mas a conta atingiu o bloqueio de deployments por quota. Houve deployments recentes `READY` e também tentativas `ERROR`/rate-limited.

O código deve continuar sendo preparado no GitHub, mas **não tentar burlar a quota da Vercel**. Assim que a janela de quota liberar, fazer um único deployment da `main`, verificar o commit e então validar o domínio.
