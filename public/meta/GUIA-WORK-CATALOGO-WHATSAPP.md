# Recuperar catálogo Meta / WhatsApp — Agô Trancoso

## Situação conhecida em 24/11/2026
- Loja: https://www.agotrancoso.com.br
- Nome da marca de revenda: **Agô Trancoso**
- Meta / Facebook: existem um perfil pessoal e 3 Páginas historicamente identificadas: **Agô Trancoso Artesanatos** e duas denominadas **Agô Trancoso**. Além disso, há vários portfólios empresariais e contas de anúncios; a proprietária informa que não usa parte deles.
- **Página conectada ao Metricool (ativa; NÃO prova ser dona do catálogo):** identificador de página **1240894442449375**, conta no Metricool marca **5980613**. Verificar no Meta o nome e a propriedade dessa página, não assumir que qualquer página homônima é a correta.
- WhatsApp Business da Agô: o app já esteve conectado ao catálogo do Meta. Posteriormente foi desinstalado/reinstalado e surgiu o erro **“catálogo não foi encontrado”**.
- **Não excluir perfis, Páginas, portfólios empresariais, WhatsApp Business Accounts (WABAs), contas de anúncios ou catálogos antes de fazer inventário completo e checar propriedade, acessos e vínculos de cada ativo.** Contas de anúncios inativas não são, por si só, o problema do catálogo.
- A proprietária quer que a vitrine de WhatsApp/Facebook tenha produtos verdadeiros do site com dados e fotos reais, **sem texto “pronta-entrega”**.
- Não publicar no Instagram. O cadastro do catálogo pode existir sem programar conteúdo no Instagram.
- Não afirmar que a Agô fabrica as peças ou que são feitas na Bahia. A Agô **revende**.
- A proprietária não possui CNPJ; não inventar dados empresariais nem criar contas falsas.

## Feed de produtos preparado

**URL de alimentação (CSV para Meta Commerce Manager):**
https://www.agotrancoso.com.br/catalogo-meta.csv

**Arquivo fonte:**
https://github.com/agotrancoso-create/agotrancoso-loja/blob/main/app/catalogo-meta.csv/route.ts

O feed público gera **24 ofertas de 21 peças permitidas/recomendadas da seleção do site**, incluindo os 3 tamanhos de Rabo de Baleia e os 2 acabamentos de Sagrada Família. Há 22 produtos no site, mas **Cachimbo Decorativo em Cerâmica** foi intencionalmente retirado da alimentação Meta para evitar riscos de política contra acessórios de tabaco. A loja continua com o produto no site; isso NÃO autoriza mascarar sua natureza nem tentar contornar uma rejeição. As imagens são fotografias da loja, sem IA; duas principais usam recorte real em JPG por compatibilidade. Os preços de cada variação são próprios. A coluna `brand=Sem marca` representa peças sem fabricante/marca comercial fornecidos; não usar o nome Agô como fabricante. Verificar se a Meta aceita `identifier_exists=no` para esses itens.

O endereço /catalogo-meta.csv é **gerado automaticamente pelo servidor Next.js a partir do catálogo e das variantes usadas no checkout**. Quando houver novo deploy do site, os novos preços e disponibilidade serão refletidos no feed (até 1h de cache), e a Meta precisa BUSCAR o link em agendamento diário. Não é estoque em tempo real nem cria catálogo por si só. **Fallback estático:** https://www.agotrancoso.com.br/meta/catalogo-ago.csv, com as mesmas 24 ofertas verificadas hoje.

## Auditoria técnica feita pelo ChatGPT (24/11/2026)

- Verificada conexão Metricool: página FB **1240894442449375** vinculada à marca Agô, mas a posse no Business Manager não pode ser confirmada sem login Meta.
- Histórico informado: três páginas homônimas e um perfil; **“Catálogo não encontrado” após tentativa de reconectar o WhatsApp Business**. Não há ID de catálogo nem de WABA confirmado.
- Verificadas 24 imagens reais de produtos/variantes por consulta aos arquivos existentes no GitHub: todas presentes. Nenhuma imagem gerada por IA para o feed.
- Corrigido o problema de atualização do CSV estático: criado novo endpoint dinâmico em **/catalogo-meta.csv**, gerado do mesmo cadastro usado no checkout. Feed legado estático preservado como reserva, excluindo cachimbo.
- As permissões reais do portfólio, titularidade do catálogo, status de elegibilidade dos produtos e vínculo WhatsApp **continuam não verificados**. Não afirmar que o erro foi resolvido nem que houve importação ao Commerce Manager.

### Sequência mínima para economizar tempo de navegação

1. **Primeiro:** Business Settings → Portfólios → Páginas: pesquisar a página **1240894442449375**, anotar a empresa proprietária. Repetir em Contas WhatsApp → número da Agô e em Fontes de dados → Catálogos. Identificar a relação entre os três ativos e a pessoa com acesso.
2. **Segundo:** Commerce Manager → selecionar o catálogo **já existente**, verificar diagnósticos, número de itens aprovados e se ele pertence ao mesmo portfólio da conta WhatsApp. Criar outro catálogo SOMENTE se não houver catálogo adequado para reutilizar.
3. **Terceiro:** Importar o feed URL novo, sem duplicar fonte, e aguardar/inspecionar relatório de importação e revisões.
4. **Quarto:** WhatsApp Manager → Conta WhatsApp correta → Ferramentas da conta → Catálogo: vincular ou reparar o acesso ao catálogo. Se houver fluxo do app WhatsApp Business distinto do WABA, investigar antes de migrar qualquer número.
5. **Quinto:** confirmar no WhatsApp Business com a conta real e entregar relatório de exatamente quais ativos e números foram vinculados, com a situação de cada produto. Não deletar ou desvincular página, número, anúncios ou catálogo sem nova aprovação explícita.

## Tarefas que o Work deverá executar na interface Meta

1. Entrar em https://business.facebook.com/settings/ e INVENTARIAR: perfis com acesso administrativo, portfólios, páginas (nome e ID), contas de anúncios, contas WhatsApp Business (WABA e número; não expor dados pessoais no relatório), catálogos (nome, ID, dono e ativos atribuídos), Business Integrations, status do comércio.
2. Identificar qual portfólio é dono da página ativa **1240894442449375** e qual WABA/número está em uso no **WhatsApp Business da Agô**.
3. Em https://business.facebook.com/commerce/ identificar catálogo existente apropriado (ou criar um novo somente se não houver um que possa ser usado), verificar a categoria “E-commerce” e o portfólio proprietário, e se existe conflito de catálogo duplicado.
4. Garantir que **catálogo, página e conta WhatsApp Business** pertençam ao mesmo portfólio ou estejam vinculados com permissões suficientes. Resolver erro “catálogo não encontrado”. Consultar permissões administrativas antes de assumir que há acesso.
5. Importar `https://www.agotrancoso.com.br/catalogo-meta.csv` como **feed de dados por URL**, preferencialmente programar atualização diária (sem duplicar ofertas/catálogos). Validar aprovação, imagens, preços, políticas e diagnósticos.
6. O **Cachimbo Decorativo em Cerâmica foi excluído do feed Meta** por risco de enquadramento nas políticas de comércio sobre acessórios de tabaco. Não adicioná-lo manualmente ao catálogo nem tentar mascarar sua natureza. As demais peças continuam disponíveis no site.
7. Em WhatsApp Manager, selecionar o WABA e **conectar** o catálogo ao número atual; confirmar o funcionamento no próprio WhatsApp Business e verificar a exibição pública. Não desvincular, migrar ou apagar o número sem consulta explícita.
8. Depois da conexão funcionar, classificar ativos duplicados/inativos, sugerir quais deixar de usar. Antes de excluir qualquer coisa, confirmar que não contém o catálogo, WABA, histórico, cobranças, página principal ou outras permissões relevantes; **não apagar ativos cegamente**.
9. Não promover publicações, não abrir campanhas pagas nem adicionar cartão; não alterar Instagram. O objetivo é catálogo e estrutura de contas.
10. Relatório final: página principal, portfólio proprietário, catálogo final/ID, contagem de produtos aprovados, vínculo WhatsApp confirmado, ativos duplicados que ainda precisam ser revistos e erros pendentes. **Só declarar concluído com confirmação real da Meta e do WhatsApp**.

## Se o catálogo ainda não aparecer

- Verificar se a conta WhatsApp Business associada ao número está no mesmo portfólio/Business Manager que o catálogo e a Página.
- Verificar a permissão de “controle total” e se o portfólio é proprietário ou recebeu apenas acesso.
- Verificar produtos aprovados e status da conta no Commerce Manager; corrigir eventuais campos rejeitados.
- Considerar que o catálogo criado exclusivamente dentro do aplicativo WhatsApp pode ser diferente do catálogo Meta Commerce Manager.
- Pedir autenticação ou aprovação do usuário somente quando necessária; nunca pedir senha ou código de verificação dentro do chat.

Referências:
- WhatsApp Help Center: https://faq.whatsapp.com/2094131298110780
- Meta Commerce Manager: https://business.facebook.com/commerce/
- Meta Business Settings: https://business.facebook.com/settings/
