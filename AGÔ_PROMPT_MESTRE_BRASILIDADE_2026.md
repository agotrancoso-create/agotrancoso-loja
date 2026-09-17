# AGÔ TRANCOSO — PROMPT MESTRE DE DIREÇÃO BRASILEIRA 2026

## MISSÃO
Transformar o e-commerce da Agô Trancoso em uma experiência digital com o máximo de brasilidade possível, mantendo sofisticação, legibilidade, desejo de compra e identidade artesanal. A referência de linguagem comercial é a força visual de grandes marcas brasileiras, incluindo a simplicidade, cor, descoberta por categorias e fotografia protagonista observadas na Havaianas, mas SEM copiar layout, textos, elementos proprietários ou identidade visual.

## REGRA ABSOLUTA
Não alterar preços, nomes, IDs, produtos, fotos corretas, regras de frete, carrinho, checkout, InfinitePay, domínio ou arquitetura funcional sem necessidade explícita. O catálogo existente é a fonte da verdade. Nunca inventar ou substituir produto/foto/preço.

## BRASILIDADE
A direção deve lembrar Brasil de forma contemporânea e reconhecível: Bahia, Trancoso, litoral, barro, terra vermelha, tijolo, ferrugem, cacau, areia, creme, azul atlântico e amarelo-sol. A brasilidade deve vir da composição, cor, fotografia, ritmo, tipografia e narrativa — não de clichês visuais.

### PALETA
- Creme/papel: #FBF5EC / #FFFDF8
- Terra/barro: #A64024
- Tijolo: #C85D2C
- Cacau: #39221C / #5A3024
- Azul atlântico: #1E5068
- Azul claro: #DCEBF0
- Amarelo-sol: #E5A51D
- Areia quente: #F7E8BE

### PROIBIDO
Verde, oliva, esmeralda, limão, caqui, ocre dominante, paleta militar, excesso de rosa, gradientes artificiais, aparência de template antigo, excesso de bordas, caixas e sombras.

## DIREÇÃO DE DESIGN
O site precisa parecer feito por um único diretor de arte profissional. Nada de acumular correções CSS contraditórias. Priorizar hierarquia, ritmo, respiro, alinhamento e consistência.

- Desktop realmente amplo; jamais transformar desktop em coluna estreita centralizada.
- Mobile e desktop devem ser a mesma identidade, adaptada proporcionalmente.
- Conteúdo pode ser alinhado à esquerda mesmo quando a composição geral está centralizada.
- Seções devem compartilhar eixos e margens.
- Títulos editoriais fortes; corpo em DM Sans; títulos em Cormorant Garamond quando apropriado.
- Fotografia do produto é protagonista.
- Fotos com cantos arredondados, sem moldura lateral, sem outline, sem halo e sem sombra pesada.
- Botões confortáveis, claros e fáceis de localizar.
- “Adicionar ao carrinho” centralizado dentro do próprio botão/card quando essa for a composição do card.
- Acessibilidade real: contraste forte, texto legível, áreas de toque confortáveis, foco visível, respeito a reduced motion e navegação clara.

## HOME
Ordem comercial definida: produtos aparecem antes da hero quando essa estrutura já estiver presente. A home deve conduzir naturalmente por descoberta → produto → identidade → história → visita → compra.

Usar conceitos como “Brasil em forma de barro”, “Trancoso na memória. Brasil dentro de casa.” somente quando fizerem sentido no contexto existente; não transformar a página em excesso de slogans.

A hero deve ser forte e editorial, com fotografia grande, texto legível e CTA claro. “FEITO À MÃO. FEITO PARA DURAR.” permanece como linguagem possível da marca.

## CATEGORIAS
Categorias devem funcionar como navegação/discovery moderna, sem linha separadora acima. Usar:
Todos · Trancoso · Igrejinhas · Decoração · Fé e devoção · Presentes

Sem aparência de filtro antigo.

## PRODUTOS
Grid amplo de 4 colunas no desktop e 2 no celular quando o espaço comportar. Cards limpos, fotografia grande e consistente.

Nunca trocar automaticamente uma foto por outra apenas porque o nome parece semelhante. A imagem da Igreja do Quadrado não pode ser confundida com a Igrejinha Luminária; Iemanjá não pode receber foto de igreja; Nossa Senhora Grande não pode ser substituída silenciosamente por Nossa Senhora Aparecida.

Os valores existentes no catálogo devem permanecer exatamente iguais. Promoções devem respeitar a fonte de dados existente.

## PREÇO / PAGAMENTO
Quando o componente de preço mostrar pagamento, preservar o preço canônico. Não hardcode valores de exemplo. Se houver Pix e parcelas, calcular a partir do valor efetivo do produto, sem alterar o preço-base.

## COMO COMPRAR
Não mostrar “01 / 02 / 03”. Não usar linhas ou separadores decorativos. Estrutura simples e legível.

## BENEFÍCIOS
Quatro benefícios devem ter exatamente a mesma lógica estrutural, proporção e tratamento visual. Nenhum card pode parecer de outro componente.

## VISITE A AGÔ
Seção ampla e editorial, preferencialmente em duas colunas no desktop. Não centralizar tudo. Texto e imagem devem respirar e compartilhar o eixo visual do restante do site.

## A AGÔ / NOSSA ESSÊNCIA / CONTATO
Manter proporções profissionais, grids claros e leitura natural. Não criar blocos estreitos artificialmente centralizados.

## FOOTER
Footer visualmente diferenciado, elegante e proporcional. Preservar informações existentes. Tipografia coerente com o restante. O copyright deve ser apenas texto, sem caixa, sem fundo próprio, sem borda e centralizado.

## REDES SOCIAIS
WhatsApp e Instagram flutuantes maiores, porém proporcionais. TikTok existente deve ser preservado quando já integrado.

## FRETE
Informação de frete grátis deve ser extremamente legível. Não alterar a regra existente sem solicitação.

## CHECKOUT
Checkout deve ser simples para pessoas de diferentes idades e níveis de familiaridade digital. Desktop em duas colunas quando adequado; mobile em uma coluna. Não remover nem contornar mecanismos de segurança do InfinitePay. Não alterar o gateway por causa de ajustes visuais.

## VERCEL / GITHUB
- Repositório: agotrancoso-create/agotrancoso-loja
- Branch: main
- Vercel: agotrancoso-loja-bmmo
- Team: Ago Trancoos
- Produção: https://www.agotrancoso.com.br
- Após qualquer alteração, verificar build real na Vercel.
- Nunca afirmar “publicado” enquanto a deployment correspondente ao commit atual não estiver READY.
- Se houver erro, ler os build logs, corrigir a causa e disparar novo build.
- Não empilhar CSS indefinidamente: quando houver conflito, consolidar ou tornar a camada final inequívoca.

## CANVA
Canva pode ser usado como referência visual/editorial para explorar composição, cor, ritmo e direção de arte. Não substituir o código funcional do e-commerce por um mockup. A implementação final continua no repositório.

## CRITÉRIO FINAL
O resultado precisa transmitir: BRASIL + BAHIA + TRANCOSO + ARTESANATO + DESIGN + DESEJO DE COMPRA.

Deve parecer uma marca brasileira contemporânea e forte, não um site genérico de artesanato.

Antes de considerar concluído: revisar desktop, tablet e mobile; conferir todas as páginas; conferir preços; conferir fotos; conferir carrinho; conferir checkout; conferir domínio; conferir build da Vercel; e somente então declarar a etapa concluída.
