# PROMPT MESTRE — AGÔ TRANCOSO
## Direção definitiva de UX, neurodesign, marketing e identidade visual

Você é responsável por transformar o site da **Agô Trancoso** em uma loja de cerâmica artesanal premium, bonita, coerente, memorável e fácil de comprar.

Não trate este pedido como uma simples troca de cores. Faça uma **auditoria visual e de experiência completa** do projeto existente antes de editar qualquer arquivo.

---

## 1. OBJETIVO CENTRAL

Criar uma experiência digital que transmita, nos primeiros segundos:

- artesanato verdadeiro;
- calor brasileiro;
- sofisticação sem ostentação;
- memória e lugar;
- confiança para comprar;
- qualidade percebida;
- organização e calma visual.

A referência cultural deve combinar **características nordestinas e mineiras** de maneira sutil e contemporânea:

- calor do barro, terracota, madeira, cerâmica, luz quente e arquitetura brasileira;
- sobriedade, simplicidade elegante, materiais naturais, equilíbrio, tradição e acabamento artesanal;
- nada caricatural, folclórico ou turístico demais;
- não usar bandeiras, cactos, ícones óbvios ou decoração temática apenas para sinalizar região.

**Importante:** essas referências são para a direção visual. Não inserir "Minas Gerais", "mineiro", "Jequitinhonha" ou equivalentes na copy pública do site.

---

# 2. PRINCÍPIOS DE NEURODESIGN E COMPORTAMENTO

Aplicar princípios conhecidos de percepção e comportamento, sem transformar o site em uma experiência experimental.

### Hierarquia visual
O olho deve saber imediatamente:
1. onde está;
2. qual é a mensagem principal;
3. qual produto merece atenção;
4. qual ação pode realizar.

### Fluidez de processamento
Evitar excesso de elementos, cores concorrentes, textos pequenos, linhas decorativas e componentes visualmente pesados.

### Gestalt
Usar proximidade, alinhamento, continuidade, contraste e agrupamento para fazer cada seção parecer uma unidade.

### Carga cognitiva
Não apresentar muitos CTAs competindo ao mesmo tempo. Cada bloco deve possuir uma ação principal clara.

### Hick's Law
Reduzir decisões desnecessárias. A navegação deve ser curta e previsível.

### Von Restorff / destaque
Usar terracota e contraste apenas onde for necessário para destacar ações e elementos importantes. Não transformar a página inteira em destaque.

### Familiaridade e confiança
Checkout, carrinho, preços, busca, navegação e botões devem funcionar como o usuário espera de uma loja moderna.

### Ritmo
As seções precisam ter alturas proporcionais. Uma seção não pode parecer gigantesca apenas porque recebeu muito padding, enquanto outra fica comprimida.

---

# 3. PALETA DEFINITIVA

Não criar uma coleção de beges quase iguais.

Usar **uma família cromática curta e harmônica**:

- **Marfim principal:** `#F6F0E6`
- **Marfim quente / papel:** `#FBF7F0`
- **Areia:** `#E6D4BC`
- **Terracota:** `#B65A35`
- **Terracota escuro:** `#8F4328`
- **Café Agô:** `#4A2A1F`
- **Café profundo:** `#2F1C16`
- **Texto escuro:** `#3A2921`
- **Linha:** `rgba(74,42,31,.14)`

### Regra mais importante da paleta
Os fundos precisam **conversar entre si**.

Não usar verde-oliva, cinza-esverdeado, taupe frio ou bege acinzentado como fundos principais.

Não alternar cinco tons quase idênticos de bege.

A sensação deve ser:

**marfim → areia → terracota → café**

com transições naturais e previsíveis.

### Distribuição
- Marfim: maior parte das áreas de catálogo e conteúdo.
- Papel marfim: áreas de fotografia/produto.
- Areia: poucas seções editoriais.
- Terracota: somente destaque/CTA/acento.
- Café: hero e blocos de fechamento.
- Café profundo: rodapé.

**Nenhum fundo deve competir com a fotografia das peças.**

---

# 4. FOTOGRAFIAS

As fotos dos produtos são prioridade.

### Fundo
Toda fotografia de produto deve parecer fotografada/apresentada sobre **fundo marfim quente**, aproximadamente `#FBF7F0`, quando o asset permitir.

### Nunca fazer
- não trocar artificialmente a peça;
- não mudar a cor da cerâmica;
- não gerar produto falso;
- não remover detalhes reais;
- não inventar correspondência entre foto e produto;
- não aplicar filtros fortes nas fotos dos produtos.

### Preenchimento
As fotos devem preencher corretamente seus quadros, sem grandes áreas vazias internas causadas por `padding` exagerado.

Usar `object-fit: cover` apenas quando isso não cortar a peça de forma prejudicial. Quando a peça inteira precisar aparecer, usar `contain` com fundo marfim consistente.

### Bordas
**Somente fotografias podem ter cantos arredondados.**

Produtos, botões, filtros, campos e demais componentes permanecem retos, salvo se houver uma necessidade funcional específica.

### Fotos erradas
Se uma fotografia não puder ser relacionada com segurança ao produto correto, **não adivinhar**. Manter o asset conhecido ou marcar o problema para correção posterior.

---

# 5. TIPOGRAFIA DEFINITIVA

Trocar a combinação atual por:

### Títulos — Newsreader
Usar **Newsreader** para:
- H1;
- H2;
- títulos de seção;
- nomes de produtos;
- frases editoriais.

Pesos principais: 400 e 500.

### Interface — Manrope
Usar **Manrope** para:
- menu;
- navegação;
- preços;
- descrições;
- botões;
- categorias;
- informações de frete;
- textos funcionais.

Pesos principais: 400, 500 e 600.

### Regra de proporção tipográfica
Nunca compensar uma fonte pequena com muito espaçamento.

O site atual possui textos pequenos demais em algumas áreas. Aumentar a legibilidade geral.

Referência desktop:
- corpo principal: 15–17px;
- descrição de produto: 14–15px;
- preço: 14–15px;
- botões: mínimo 11px;
- categorias: mínimo 10px;
- microcopy/eyebrow: mínimo 10px, somente quando realmente secundário;
- títulos de produto: 20–24px;
- H2: aproximadamente 48–68px, dependendo da seção;
- H1: aproximadamente 64–92px, dependendo da viewport.

Não usar tamanhos enormes só para parecer sofisticado.

A escala deve seguir uma relação consistente, por exemplo:

**11 → 14 → 16 → 22 → 32 → 48 → 68 → 84px**

com ajustes responsivos via `clamp()`.

No mobile, nunca deixar corpo funcional abaixo de aproximadamente 15px.

---

# 6. SISTEMA DE ESPAÇAMENTO

Criar uma escala consistente.

Usar aproximadamente:

`8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96px`

Evitar valores arbitrários diferentes em cada seção.

### Alturas de seção
Cada seção deve ter um propósito e uma altura coerente.

Não deixar:
- contato com centenas de pixels vazios;
- benefícios maiores que uma seção editorial;
- uma seção curta seguida por outra excessivamente alta;
- rodapé desproporcional.

### Regra
**A fotografia, o conteúdo e a hierarquia determinam a altura — não o padding.**

---

# 7. LARGURA E GRID

Container máximo aproximado: `1180–1240px`.

Desktop:
- margens laterais generosas;
- grid de produtos em 4 colunas;
- gutters consistentes;
- alinhamento vertical rigoroso.

Tablet:
- 2–3 colunas conforme largura real.

Mobile:
- 2 colunas para catálogo quando houver espaço suficiente;
- textos sempre legíveis;
- sem esmagar nomes ou preços.

As fotos dos produtos precisam ter proporções idênticas dentro da mesma grade.

---

# 8. HEADER

Manter exatamente estas ações:

- **Início**
- **Coleção**
- **Nossa essência**
- **Contato**
- busca: **Buscar peça...**
- carrinho com contador dinâmico.

Faixa superior:

**Frete grátis em compras acima de R$ 500**

Header deve ser limpo, baixo e sofisticado.

Não transformar o header em um painel cheio de elementos.

---

# 9. ORDEM DA HOME

Os **produtos devem aparecer antes do hero**, conforme definido anteriormente.

Ordem:

1. Header
2. Coleção / produtos em destaque
3. Categorias
4. Hero
5. Benefícios
6. Mais da coleção
7. Nossa essência
8. Para a casa
9. Como comprar
10. Como chegar até a Agô
11. Footer

Não alterar essa ordem sem uma razão UX muito forte.

---

# 10. COLEÇÃO

Copy:

**Agô Trancoso**

**Trancoso em forma de cerâmica.**

**Peças artesanais para decorar, presentear e guardar memórias.**

Ação principal:

**Ver coleção**

Ação secundária:

**Conheça todas as peças**

Categorias:
- Todos
- Trancoso
- Igrejinhas
- Decoração
- Fé e devoção
- Presentes

Não usar categoria "Velas".

Produtos em destaque:
- Igreja do Quadrado (P)
- Igreja do Quadrado (M)
- Igreja do Quadrado (GG)
- Igrejinha Luminária de Trancoso
- Casinha Luminária
- Miniatura do Quadrado de Trancoso
- Cruzeiro do Quadrado
- Móbile Trancoso em Cerâmica

Não inventar produtos, preços ou fotografias.

---

# 11. HERO

Usar a fotografia real `/hero.jpg` sem destruir sua identidade.

Copy:

**Agô Trancoso · cerâmica e memória**

**FEITO À MÃO.**

**FEITO PARA DURAR.**

**Cerâmicas, decoração e peças artesanais inspiradas no charme de Trancoso.**

Ações:
- **Ver produtos**
- **Conheça a Agô**

Hero deve ser a maior imagem da experiência, mas não pode ocupar a página inteira de maneira desproporcional.

Overlay escuro apenas o suficiente para garantir leitura.

---

# 12. BENEFÍCIOS

Usar exatamente:

**feito à mão**

cuidado e tradição em cada detalhe.

**peças exclusivas**

escolhas especiais para quem valoriza o feito à mão.

**inspiração brasileira**

cores, formas e símbolos da nossa terra.

**envio para todo brasil**

receba com segurança na sua casa.

Não transformar os benefícios em quatro cards pesados.

---

# 13. NOSSA ESSÊNCIA

Imagem: `/nossa-essencia.jpg`

Copy:

**Nossa essência**

**O encanto de Trancoso**

**Cerâmicas, lembranças e detalhes especiais para decorar, presentear e guardar memórias.**

**Cada peça é feita à mão, inspirada nas formas, histórias e elementos que fazem parte de Trancoso.**

Ação:

**Conheça nossa história →**

A imagem deve ter presença semelhante ao texto. Não deixar um lado gigantesco e o outro visualmente insignificante.

---

# 14. PARA A CASA

Copy:

**Para a casa**

**Um pouco de Trancoso para dentro de casa.**

**Detalhes para decorar, presentear e guardar memórias.**

Ação:

**Escolher uma peça**

Imagem: `/complementar.jpg`

A seção deve ter equilíbrio entre texto e fotografia.

---

# 15. COMO COMPRAR

Copy:

**Como comprar**

**Escolha sua peça, com calma.**

01 — **Escolha**

Conheça a coleção e escolha a peça que deseja.

02 — **Carrinho**

Adicione ao carrinho e informe seus dados de entrega.

03 — **Pagamento**

Confira o pedido e siga para o pagamento seguro.

Essa seção deve ser **mais compacta** que o hero e as seções editoriais.

---

# 16. COMO CHEGAR

Copy:

**Visite a Agô**

**Como chegar até a Agô**

Nossa banca fica no Quadrado de Trancoso. Para localização e atendimento, fale conosco pelo WhatsApp.

Ações:
- **Abrir no Google Maps**
- **Falar no WhatsApp**

Informações úteis:

**Banca**

Quadrado de Trancoso

**Atendimento**

WhatsApp e presencialmente no Quadrado

**Envios**

Frete fixo de R$ 39,90; grátis acima de R$ 500.

---

# 17. FRETE

Regra funcional:

- pedidos até R$ 500 → **R$ 39,90**;
- pedidos acima de R$ 500 → **grátis**.

Não alterar essa regra.

Comunicar de forma clara, sem criar sensação de urgência falsa.

---

# 18. CARRINHO E CHECKOUT

Preservar a funcionalidade existente.

Ações devem continuar claras:

- adicionar ao carrinho;
- aumentar quantidade;
- diminuir quantidade;
- remover;
- finalizar compra;
- continuar comprando.

O checkout deve continuar funcionando.

Não remover lógica existente só por causa do redesign visual.

---

# 19. WHATSAPP

**Não usar botão verde flutuante.**

Os links de WhatsApp existentes em conteúdo/contato podem permanecer.

O botão flutuante verde deve permanecer removido.

---

# 20. FOOTER

Copy:

**Agô Trancoso**

Cerâmicas, lembranças e detalhes especiais para decorar, presentear e guardar memórias.

Frete fixo de R$ 39,90. Compras acima de R$ 500 têm frete grátis.

**Navegação**

Coleção

Nossa essência

Contato

**Fale com a gente**

@agotrancoso

WhatsApp

www.agotrancoso.com.br

© 2026 Agô Trancoso. Todos os direitos reservados.

Footer em café profundo, com contraste suficiente.

---

# 21. BOTÕES E AÇÕES

Não criar CTAs novos sem necessidade.

Usar as ações já definidas:

- Ver coleção
- Conheça todas as peças
- Ver produtos
- Conheça a Agô
- Conheça nossa história
- Escolher uma peça
- Abrir no Google Maps
- Falar no WhatsApp
- Adicionar ao carrinho
- Finalizar compra
- Continuar comprando

Cada seção deve ter no máximo uma ação visualmente dominante.

Terracota deve indicar ação/destaque, não decorar tudo.

---

# 22. ACESSIBILIDADE E LEGIBILIDADE

Corrigir textos pequenos demais.

Garantir:
- contraste adequado;
- áreas clicáveis confortáveis;
- foco visível;
- preços facilmente identificáveis;
- títulos não comprimidos;
- corpo de texto confortável para leitura;
- navegação funcional em mobile.

Não usar texto minúsculo só para conseguir aparência editorial.

---

# 23. RESPONSIVIDADE

Desktop não pode ser simplesmente reduzido no mobile.

Criar uma hierarquia própria para cada viewport.

Mobile:
- títulos continuam expressivos;
- corpo permanece legível;
- fotos continuam protagonistas;
- espaçamentos diminuem proporcionalmente;
- CTAs continuam fáceis de tocar;
- grid não fica apertado.

---

# 24. O QUE NÃO FAZER

Não:

- usar cores aleatórias;
- misturar bege frio com areia quente;
- usar verde acinzentado como fundo;
- criar muitas faixas de fundo;
- usar gradientes decorativos sem função;
- usar sombras pesadas;
- usar glassmorphism;
- criar cards excessivos;
- arredondar todo o site;
- diminuir fonte para caber conteúdo;
- usar fonte diferente em cada seção;
- inventar avaliações;
- inventar escassez;
- inventar depoimentos;
- inventar preços;
- inventar produtos;
- inventar fotografias;
- alterar a identidade das peças;
- colocar fotografia errada em produto sem confirmação;
- mencionar Minas Gerais na copy pública;
- usar estética de souvenir barato;
- usar estética de template genérico de e-commerce.

---

# 25. CRITÉRIO DE PERFEIÇÃO

Antes de concluir, revisar visualmente a home inteira e verificar:

### Cor
A paleta parece pertencer à mesma família?

### Tipografia
Os tamanhos têm relação proporcional entre si?

### Espaçamento
Existe algum vazio exagerado?

### Seções
Alguma seção está desproporcionalmente maior que outra?

### Produto
A peça é a protagonista da fotografia?

### Conversão
É óbvio o que clicar para comprar?

### Legibilidade
Algum texto está pequeno demais?

### Identidade
O site parece Agô Trancoso ou poderia ser qualquer loja?

### Sofisticação
A estética é premium sem parecer fria?

### Brasilidade
A influência nordestina e mineira está presente nos materiais, calor e composição sem virar caricatura?

### Coerência
Ao rolar a página, cada seção parece pertencer ao mesmo site?

---

# 26. PROCEDIMENTO TÉCNICO

1. Ler o projeto existente antes de modificar.
2. Identificar todas as folhas de estilo que atualmente sobrescrevem outras.
3. Evitar criar cascatas conflitantes desnecessárias.
4. Consolidar a direção visual sempre que possível.
5. Preservar funcionalidades existentes.
6. Não remover componentes funcionais sem motivo.
7. Verificar imagens reais e seus caminhos.
8. Não adivinhar correspondência de fotografias.
9. Implementar tipografia com carregamento consistente.
10. Implementar uma escala tipográfica responsiva.
11. Implementar uma escala de espaçamento consistente.
12. Revisar desktop, tablet e mobile.
13. Fazer uma revisão final de contraste, alinhamento e proporção.
14. Só depois considerar o trabalho concluído.

---

# RESULTADO ESPERADO

O resultado final deve parecer uma **marca brasileira de cerâmica artesanal premium**, com direção editorial, calor humano, fotografia valorizada e experiência de compra extremamente clara.

A sensação deve ser:

**barro + marfim + café + luz quente + cerâmica + memória + sofisticação silenciosa.**

Não é para parecer uma loja genérica.
Não é para parecer um site de artesanato barato.
Não é para parecer um catálogo excessivamente minimalista e frio.

É para parecer **Agô Trancoso**.
