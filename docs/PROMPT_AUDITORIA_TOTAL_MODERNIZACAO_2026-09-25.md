# Prompt mestre de auditoria e modernização total da Agô Trancoso

Atue como principal engenheiro full stack, arquiteto de software, especialista em Next.js, React, TypeScript, e-commerce premium, UX responsiva, acessibilidade, performance web e segurança de checkout.

Você está trabalhando no site real da Agô Trancoso. Não crie um site novo do zero e não faça mudanças por gosto pessoal. Primeiro leia o repositório, entenda a arquitetura, os componentes, os dados, os assets, o checkout e as regras comerciais. Só depois altere o código.

## Objetivo

Transformar a navegação em uma experiência atual, sofisticada, fluida e humana, sem qualquer aparência de site antigo. O site deve ter a mesma identidade, os mesmos conteúdos, os mesmos produtos, os mesmos preços, as mesmas regras e os mesmos recursos em celular, tablet e computador. A composição deve se adaptar ao tamanho da tela sem criar uma versão inferior para mobile nem remover recursos importantes.

## Regras que não podem ser quebradas

- Preserve os 19 produtos reais, preços, promoções e disponibilidade.
- Preserve as fotos reais. Não gere fotos, não substitua peças e não invente assets.
- Não recorte nenhuma peça. Não deforme imagens.
- Fotos de produto devem aparecer em molduras quadradas equivalentes a 960 x 960, com a peça inteira visível, cantos arredondados e sem bordas artificiais.
- Não use travessão em textos visíveis ao cliente.
- Preserve Cormorant Garamond e Manrope e a identidade terrosa da Agô.
- Preserve InfinitePay, frete, benefício de primeira compra, webhooks e regras transacionais existentes.
- O servidor continua sendo a fonte da verdade para preço, desconto, frete e disponibilidade.
- Não introduza lógica diferente por sistema operacional ou dispositivo para regras de negócio.
- Não invente dados, avaliações, estoque, prazo, depoimentos ou selos.

## 1. Remover aparência de site antigo

Elimine barras de rolagem nativas visíveis em superfícies internas, incluindo busca, sacola, galerias, menus e modais. A rolagem deve continuar funcionando por roda do mouse, trackpad, toque e teclado.

A página principal também não deve depender de uma barra lateral grossa para indicar posição. Use um indicador de progresso extremamente discreto no topo, sem ocupar espaço e sem competir com o conteúdo.

Não use caixas pesadas, laterais antiquadas, carrosséis com trilhos aparentes, bordas desnecessárias, setas enormes ou barras cinzas do navegador dentro da interface.

## 2. Busca

A busca deve parecer uma camada flutuante premium.

- Sem scrollbar nativa aparente.
- Sem borda pesada.
- Sombra suave e raio coerente com o design system.
- Mostrar até seis sugestões com foto, nome e preço.
- Sempre que houver espaço vertical, exibir as seis sem exigir rolagem.
- Se a tela for baixa, manter rolagem invisível e funcional.
- Preservar Arrow Up, Arrow Down, Enter, Escape, foco por teclado e leitores de tela.
- O comportamento deve ser equivalente na busca do cabeçalho, catálogo e menu móvel.

## 3. Sacola

A sacola deve parecer um drawer contemporâneo de e-commerce premium.

- Nenhuma scrollbar nativa visível.
- Cabeçalho e resumo de valores estáveis.
- Conteúdo central rolável sem deslocar o CTA de finalizar pedido.
- Recomendações “Para acompanhar” disponíveis em computador e celular.
- Recomendações em trilho horizontal por swipe/trackpad, sem barra aparente.
- No computador, fornecer controles discretos de anterior e próximo para quem usa mouse.
- Cards de recomendação compactos, quadrados, arredondados e sem borda.
- Somente sugerir produtos reais e disponíveis.
- Nunca sugerir a própria peça já presente na sacola.
- Manter foco preso no drawer quando aberto e permitir fechar por Escape.

## 4. Paridade entre dispositivos

Não interprete “igual” como copiar as mesmas dimensões de desktop no celular. Interprete como paridade real de experiência:

- mesmos produtos;
- mesmos preços;
- mesmos filtros;
- mesma busca;
- mesma sacola;
- mesmas recomendações;
- mesmos benefícios;
- mesmas ações de compra;
- mesmas regras de checkout;
- mesma linguagem visual;
- mesma hierarquia de informação.

Apenas a composição, a quantidade de colunas e os controles de navegação podem se adaptar para caber corretamente em cada tela.

## 5. Fotos e catálogo

Audite todas as associações de imagens antes de publicar.

- Igreja do Quadrado P deve usar somente fotos da Igreja P.
- Igrejinha Luminária de Trancoso deve usar somente fotos da luminária.
- Não trocar fotos entre produtos por meio de mapas de override.
- O Ímã da Igrejinha deve manter a segunda foto recuperada na galeria.
- Nossa Senhora Grande deve manter as duas fotos reais de fundo claro.
- Casal de Pretos-Velhos deve usar as melhores versões reais disponíveis. Não aplicar sharpening artificial nem fingir resolução inexistente.
- Miniatura do Quadrado, Móbile, ímã e todas as demais peças devem seguir o mesmo raio de cantos.
- A foto principal não pode trocar no hover.

## 6. Home

Preserve a identidade atual e refine apenas o que melhora a experiência.

- Hero com escurecimento leve, apenas o suficiente para legibilidade.
- “Trancoso / Bahia / Brasil” na seção “Se estiver por perto” deve manter o desenho original já aprovado.
- “Fé & devoção” deve usar uma foto real da Nossa Senhora com enquadramento adequado.
- Benefícios devem continuar interativos.
- Botões flutuantes de WhatsApp e Instagram devem ser discretos e não cobrir CTA, formulário ou checkout.
- Rodapé mobile deve ser compacto.

## 7. Microinterações

A experiência deve parecer viva sem parecer um template cheio de efeitos.

Use somente microinterações discretas:

- elevação mínima de cards no hover;
- feedback de toque;
- transições curtas;
- progressão suave de carrosséis;
- estados de foco claros;
- loading e disabled coerentes quando existirem.

Respeite prefers-reduced-motion.

## 8. Backend e checkout

Audite todas as rotas e preserve o que estiver correto.

Confirme que:

- preços nunca vêm confiáveis do navegador;
- o servidor recalcula o carrinho;
- quantidades inválidas são rejeitadas;
- produto inexistente ou indisponível não segue para pagamento;
- cupom é validado no servidor;
- elegibilidade de primeira compra é atômica;
- reservas são liberadas quando a criação do pagamento falha;
- webhook de primeira compra verifica o pagamento no provedor antes de confirmar o benefício;
- valor verificado precisa coincidir com o valor esperado;
- CEP, e-mail, telefone e endereço são validados;
- timeouts externos têm tratamento;
- dados pessoais não são registrados desnecessariamente em logs;
- nenhuma regra transacional muda de acordo com viewport, user-agent ou dispositivo.

Não reescreva o fluxo de pagamento apenas para “modernizar” se ele já estiver seguro e consistente.

## 9. Performance

- Evite JavaScript desnecessário.
- Não introduza bibliotecas para algo que CSS e React existentes resolvem.
- Preserve next/image.
- Use sizes corretos.
- Evite layout shift.
- Não carregue imagens gigantes onde uma versão menor basta.
- Não transforme imagens pequenas em falsas imagens HD.
- Não bloqueie interação com animações.

## 10. Acessibilidade

- Todos os controles precisam funcionar por teclado.
- Foco visível.
- Escape fecha overlays quando esperado.
- Botões iconográficos precisam de nome acessível.
- Modais e drawers devem gerenciar foco.
- Elementos escondidos não podem permanecer navegáveis.
- Alvos de toque adequados.
- Contraste preservado.

## 11. QA obrigatório

Verifique pelo menos as larguras:

320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1440, 1600 e 1920 px.

Teste:

- home;
- catálogo;
- busca aberta;
- filtros;
- ordenação;
- página de produto;
- galeria;
- sacola vazia;
- sacola com vários itens;
- recomendações;
- checkout;
- contato;
- A Agô;
- rodapé;
- menus;
- botões flutuantes.

Critérios de aceite:

- zero overflow horizontal inesperado;
- zero scrollbar interna visível com aparência antiga;
- nenhuma foto ligada ao produto errado;
- nenhuma peça cortada;
- nenhuma borda artificial nas fotos;
- nenhuma funcionalidade importante ausente no mobile;
- mesma regra de negócio em todos os dispositivos;
- build de produção aprovado;
- TypeScript aprovado;
- nenhuma regressão de checkout.

## Método de trabalho

1. Inspecione o código e assets reais.
2. Liste problemas reproduzíveis.
3. Diferencie bug real de preferência estética.
4. Corrija primeiro problemas estruturais.
5. Faça mudanças pequenas e rastreáveis.
6. Não acumule folhas de override sem necessidade.
7. Rode build e QA.
8. Revise visualmente desktop e mobile.
9. Só publique quando a versão final estiver coerente como um único produto.

Resultado esperado: um e-commerce premium, leve, contemporâneo, responsivo e confiável, em que a tecnologia desaparece e as peças da Agô são protagonistas.
