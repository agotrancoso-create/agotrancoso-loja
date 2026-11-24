# Recuperar catálogo Meta / WhatsApp — Agô Trancoso

## Situação conhecida em 24/11/2026
- Loja: https://www.agotrancoso.com.br
- Nome da marca de revenda: **Agô Trancoso**
- Meta / Facebook: existem um perfil pessoal e 3 Páginas historicamente identificadas: **Agô Trancoso Artesanatos** e duas denominadas **Agô Trancoso**. Além disso, há vários portfólios empresariais e contas de anúncios; a proprietária informa que não usa parte deles.
- **Página conectada ao Metricool (ativa):** identificador de página **1240894442449375**, conta no Metricool marca **5980613**. Verificar no Meta o nome e a propriedade dessa página, não assumir que qualquer página homônima é a correta.
- WhatsApp Business da Agô: o app já esteve conectado ao catálogo do Meta. Posteriormente foi desinstalado/reinstalado e surgiu o erro **“catálogo não foi encontrado”**.
- **Não excluir perfis, Páginas, portfólios empresariais, WhatsApp Business Accounts (WABAs), contas de anúncios ou catálogos antes de fazer inventário completo e checar propriedade, acessos e vínculos de cada ativo.** Contas de anúncios inativas não são, por si só, o problema do catálogo.
- A proprietária quer que a vitrine de WhatsApp/Facebook tenha produtos verdadeiros do site com dados e fotos reais, **sem texto “pronta-entrega”**.
- Não publicar no Instagram. O cadastro do catálogo pode existir sem programar conteúdo no Instagram.
- Não afirmar que a Agô fabrica as peças ou que são feitas na Bahia. A Agô **revende**.
- A proprietária não possui CNPJ; não inventar dados empresariais nem criar contas falsas.

## Feed de produtos preparado

**URL de alimentação (CSV para Meta Commerce Manager):**
https://www.agotrancoso.com.br/meta/catalogo-ago.csv

**Arquivo fonte:**
https://github.com/agotrancoso-create/agotrancoso-loja/blob/main/public/meta/catalogo-ago.csv

O feed tem **25 ofertas derivadas das 22 peças do site**, incluindo 3 tamanhos de Rabo de Baleia e 2 acabamentos de Sagrada Família. As 25 ofertas estão disponíveis segundo o catálogo atual. As imagens são fotografias da loja, sem IA; duas principais usam recorte real em JPG por compatibilidade. Os preços de cada variação são próprios. A coluna `brand=Sem marca` representa peças sem fabricante/marca comercial fornecidos; não usar o nome Agô como fabricante. Verificar se a Meta aceita `identifier_exists=no` para esses itens.

O feed está versionado; como arquivo estático, **não é sincronização automática de estoque em tempo real**. No Commerce Manager, preferir importação agendada por URL; toda alteração de preços/estoque no site requer geração/atualização do arquivo ou evolução para feed dinâmico.

## Tarefas que o Work deverá executar na interface Meta

1. Entrar em https://business.facebook.com/settings/ e INVENTARIAR: perfis com acesso administrativo, portfólios, páginas (nome e ID), contas de anúncios, contas WhatsApp Business (WABA e número; não expor dados pessoais no relatório), catálogos (nome, ID, dono e ativos atribuídos), Business Integrations, status do comércio.
2. Identificar qual portfólio é dono da página ativa **1240894442449375** e qual WABA/número está em uso no **WhatsApp Business da Agô**.
3. Em https://business.facebook.com/commerce/ identificar catálogo existente apropriado (ou criar um novo somente se não houver um que possa ser usado), verificar a categoria “E-commerce” e o portfólio proprietário, e se existe conflito de catálogo duplicado.
4. Garantir que **catálogo, página e conta WhatsApp Business** pertençam ao mesmo portfólio ou estejam vinculados com permissões suficientes. Resolver erro “catálogo não encontrado”. Consultar permissões administrativas antes de assumir que há acesso.
5. Importar `catalogo-ago.csv` como **feed de dados por URL**, preferencialmente programar verificação periódica (sem duplicar ofertas/catálogos). Validar aprovação, imagens, preços, políticas e diagnósticos.
6. Atenção a **Cachimbo Decorativo em Cerâmica**: mesmo sendo peça de decoração, pode ser enquadrado pela Meta como acessório ligado ao tabaco. Se rejeitado, sinalizar e solicitar revisão apropriada; não insistir em burlar políticas.
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
