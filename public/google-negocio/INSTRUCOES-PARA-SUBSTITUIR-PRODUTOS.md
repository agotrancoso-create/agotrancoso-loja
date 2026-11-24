# Agô Trancoso — substituição da vitrine Produtos do Google Negócio

Fonte: [Catálogo completo de 22 itens](./catalogo-completo-ago-22.csv), extraído de `data/products.json` e atualizado com a confirmação de pronta-entrega em 24/11/2026.

## Objetivo

Substituir os itens anteriores da seção **Produtos** do Perfil da Empresa no Google pela seleção atual do site `https://www.agotrancoso.com.br`.

**Esta pasta é material de preparação. Os produtos do Google ainda não foram alterados.**

## Controle de qualidade e segurança

1. Abrir o Perfil da Empresa correto da Agô Trancoso, logado como administrador.
2. Abrir `Editar produtos` e identificar se os itens são cadastrados manualmente ou vieram do Merchant Center. Se forem importados do Merchant Center, administrar pela fonte correta; não desconectar Merchant Center sem revisão.
3. Registrar nome, foto e preço de todos os itens antigos antes de excluir.
4. Excluir SOMENTE os produtos da vitrine manual antiga e somente depois de confirmar o inventário que será usado na substituição.
5. Incluir os 21 itens atualmente marcados `available=true`, usando nome, descrição, preço, categoria, imagem original e link direto da linha correspondente do CSV. A confirmação de pronta-entrega foi expressa para Rabo de Baleia, Nossa Senhora Grande e Nossa Senhora Aparecida. Checar a disponibilidade física na banca; marcar como pendente ou não publicar se não puder verificar.
6. **Rabo de Baleia em Cerâmica**, **Nossa Senhora Grande** e **Nossa Senhora Aparecida** têm pronta-entrega confirmada pela loja. O Rabo de Baleia possui opções P, M e G com preços próprios; mantenha as variantes e não venda a versão P como se tivesse o preço das outras. **Sagrada Família em Cerâmica** continua com `available=false` no catálogo do site, embora haja quantidades internas; não apresentá-la como pronta-entrega até confirmação da loja.
7. Não gerar imagens por IA nem alterar pintura, textura, cor, forma ou proporções. Usar apenas arquivos na coluna `Imagem original principal`, com imagens adicionais originais somente quando apropriado.
8. Não inventar medidas, peso, promoção, estoque, fabricação própria ou origem baiana das peças. Campos não preenchidos no catálogo permanecem sem informação.
9. A seção de Produtos do Google é separada das publicações/atualizações do Google Negócio feitas no Metricool. Agendar publicações no Metricool não adiciona itens à vitrine.
10. Ao concluir, abrir o Perfil da Empresa como visitante, verificar cada item, preço, foto, descrição e botão de compra. Entregar relatório com número de itens publicados e eventuais pendências. Não afirmar sucesso antes de verificar as alterações no Google.

## Grupos sugeridos

- Igrejinhas e luminárias
- Lembranças de Trancoso
- Decoração em cerâmica
- Fé e devoção
- Presentes e acessórios

## Como executar

No **ChatGPT Work**, abrir o catálogo CSV acima, acessar o site do Google Business Profile, navegar ao editor `Produtos`, comparar os itens antigos com o CSV, remover os cadastros manuais antigos conforme o pedido da proprietária e cadastrar os novos itens individualmente.

Segundo a Ajuda do Google, o Editor de Produtos gerencia produtos manualmente um de cada vez; o upload em massa de perfis empresariais não equivale ao upload de produtos.

Referências:
- https://support.google.com/business/answer/9124203
- https://support.google.com/business/answer/9934993

**Importante:** esta instrução não executa a edição. É preciso acesso autorizado à interface do Google Business Profile.
