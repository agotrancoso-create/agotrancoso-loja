# Prompt mestre — Agô Trancoso: desenvolvimento, marketing e atenção

Assuma o projeto **Agô Trancoso** diretamente no repositório `agotrancoso-create/agotrancoso-loja` e trabalhe sempre a partir do `main` mais recente.

Site: `https://www.agotrancoso.com.br`

## Objetivo

Aprimore o site como se a mesma equipe reunisse:

1. um engenheiro principal de e-commerce;
2. um especialista em marketing, CRO, SEO e merchandising premium;
3. um especialista em percepção, atenção e tomada de decisão.

O objetivo é fazer o site ser mais fácil de encontrar, compreender, desejar e comprar **sem transformar a Agô em um e-commerce genérico, agressivo ou cheio de estímulos**.

## Regra central

A Agô vende cerâmica artesanal de Trancoso. A fotografia e a peça são protagonistas. O site deve reduzir esforço mental, aumentar confiança e deixar o próximo passo evidente.

Não use dark patterns, urgência falsa, estoque falso, avaliações inventadas, contadores, pop-ups insistentes, descontos artificiais ou promessas de ranking/vendas.

## Preserve obrigatoriamente

- preços e produtos atuais;
- fotografias originais e suas associações especiais;
- qualidade máxima e zoom atual;
- checkout e InfinitePay, salvo correção comprovadamente necessária;
- regra de frete atual, que está correta;
- identidade visual terrosa, sofisticada e ligada a Trancoso/Bahia;
- recursos já concluídos de SEO, analytics, acessibilidade e catálogo server-rendered.

## Implementação prioritária

### 1. Hierarquia e atenção

- Faça a peça aparecer antes da explicação longa.
- Cada seção deve ter uma única função mental: descobrir, confiar, escolher ou comprar.
- Reduza textos repetidos e blocos que comunicam a mesma coisa várias vezes.
- Mantenha CTA principal evidente e CTA secundário discreto.
- Não crie mais escolhas simultâneas do que o necessário.

### 2. Home orientada à compra

- Preserve hero, produtos em destaque, benefícios, história, categorias e visita ao Quadrado.
- Remova a seção redundante **“Da Bahia para sua casa”**. Não substitua por outro título equivalente.
- Use o espaço para uma FAQ curta de alta intenção que responda dúvidas reais de compra sem poluir a página.
- A FAQ deve ajudar tanto pessoas quanto mecanismos de busca e usar dados estruturados válidos quando apropriado.
- Mantenha apenas perguntas verdadeiras e respostas sustentadas pelo funcionamento real da loja.

### 3. A Agô e Contato

- As páginas **Contato** e **A Agô** precisam usar exatamente o mesmo fundo-base em desktop, tablet e celular.
- O tom não deve variar por breakpoint; só a geometria pode mudar.
- Ambas devem seguir o mesmo eixo horizontal, largura máxima, gutters e ritmo vertical.
- Inclua um caminho de compra natural: da história/contato para a coleção, sem transformar páginas institucionais em landing pages agressivas.
- Use dados estruturados `AboutPage` e `ContactPage` ligados à entidade principal da Agô.

### 4. Alinhamento global

- Consolide um único eixo visual para os principais containers da home e páginas institucionais.
- Corrija diferenças de margem, gutter e largura entre seções.
- Nenhuma seção deve parecer alguns pixels deslocada ao trocar de desktop para tablet ou celular.
- Elimine overflow horizontal.
- Preserve safe areas em aparelhos móveis.

### 5. SEO e descoberta orgânica

- Reforce a entidade Agô Trancoso, localização no Quadrado, atuação desde 2016 e contexto de cerâmica artesanal.
- Preserve canonical, sitemap, robots, image sitemap, Merchant feed, Product schema, Organization/Store e WebSite/SearchAction existentes.
- Use links internos naturais entre home, coleção, Igrejinha de Trancoso, artesanato em Trancoso, lembranças de Trancoso, A Agô e Contato.
- Não encha a interface com palavras-chave.
- Não prometa posição no Google: o objetivo é deixar o site tecnicamente mais compreensível, indexável e útil.

### 6. Conversão sem pressão

- Reduza objeções com informação objetiva sobre compra, envio, localização e atendimento.
- Mantenha recomendações complementares, carrinho retomável, busca, filtros e produtos relacionados já existentes.
- Não adicione elementos de venda se eles competirem visualmente com as peças.
- Priorize confiança, clareza e continuidade de navegação.

### 7. Performance e acessibilidade

- Não sacrifique Core Web Vitals por animações ou scripts de marketing.
- Preserve `prefers-reduced-motion`, foco visível, áreas de toque e navegação por teclado.
- Mobile deve ser uma composição própria, não desktop espremido.

## Contrato de QA

Validar no mínimo em:

- 320 px
- 360 px
- 390 px
- 430 px
- 768 px
- 820 px
- 1024 px
- 1440 px
- 1920 px

E garantir automaticamente:

- nenhum overflow horizontal;
- home sem a seção “Da Bahia para sua casa”;
- FAQ curta presente e legível;
- fundos de **Contato** e **A Agô** idênticos entre si e entre todos os breakpoints;
- shells de **Contato** e **A Agô** com o mesmo alinhamento horizontal;
- principais containers da home no mesmo eixo;
- zoom e cantos arredondados preservados;
- TypeScript, build, SEO QA, commerce QA, analytics QA, WCAG, smoke test e regra de frete já existente aprovados.

## Regra de publicação

Não diga que está publicado apenas porque o código foi alterado.

Só considere concluído quando:

1. mudanças estiverem em branch/PR;
2. Quality Gate estiver verde;
3. PR estiver incorporado ao `main`;
4. Quality Gate do `main` estiver verde;
5. Vercel estiver `READY/success` para o mesmo SHA;
6. `/api/health` público reportar esse SHA;
7. home, Contato, A Agô e uma página de produto forem verificadas publicamente.

## Saída final

Informe de forma objetiva:

- o que estava faltando sob os três olhares;
- o que foi implementado;
- o que foi removido por redundância;
- o que foi feito para SEO/descoberta;
- o que foi feito para conversão/atenção;
- o que foi feito para alinhamento e paridade de fundos;
- testes executados;
- SHA final publicado;
- qualquer bloqueio externo real (Search Console, Merchant Center, domínio, e-mail etc.) sem fingir que foi resolvido.
