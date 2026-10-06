'use client';

import { accessibilityEnglish } from '@/lib/accessibility-copy';

import { afterInitialRender } from '@/lib/after-initial-render';
import { createPortal } from 'react-dom';
import { useEffect, useMemo, useState } from 'react';

const COOKIE = 'ago_locale';

type Locale = 'pt' | 'en';

const exact: Record<string, string> = {
  ...accessibilityEnglish,
  'Coleção Agô': 'Agô collection',
  'Cerâmica para viver e guardar.': 'Ceramics to live with and treasure.',
  'Agô Trancoso, página inicial': 'Agô Trancoso, home',
  'Agô Trancoso, início': 'Agô Trancoso, home',
  'Escolher pela intenção': 'Shop by purpose',
  'Localização da Agô': 'Agô location',
  'Falar com a Agô Trancoso': 'Contact Agô Trancoso',
  'Ver Agô Trancoso no Instagram': 'View Agô Trancoso on Instagram',
  'Mapa da Agô Trancoso no Quadrado': 'Map of Agô Trancoso in the Quadrado',

  'Ver as peças da banca': 'View pieces from our stall',
  'Ver lembranças': 'View keepsakes',
  // Hero e home
  'Ir para o conteúdo': 'Skip to content',
  '© 2026 Agô Trancoso. Todos os direitos reservados.': '© 2026 Agô Trancoso. All rights reserved.',
  'Igrejinhas, casinhas e lembranças do Quadrado.': 'Churches, little houses and keepsakes from the Quadrado.',
  'Peças moldadas à mão, desde 2016 no Quadrado.': 'Hand-shaped ceramic pieces, since 2016 in the Quadrado.',
  'Trancoso em cerâmica.': 'Trancoso in ceramic.',
  'Quadrado de Trancoso · Bahia': 'Trancoso Quadrado · Bahia',
  'Ver peças': 'View pieces',
  'Ver coleção': 'View collection',
  'Igrejinhas de Trancoso': 'Trancoso churches',
  'Destaques da coleção.': 'Collection highlights.',
  'Ver coleção completa': 'View full collection',
  'A coleção': 'The collection',
  'Escolha por categoria.': 'Shop by category.',
  'Ver todas as peças': 'View all pieces',
  'Casa & decoração': 'Home & decor',
  'Fé & devoção': 'Faith & devotion',
  'Presentes': 'Gifts',
  'O encanto de Trancoso': 'The charm of Trancoso',
  'Feito à mão, para ficar na memória.': 'Made by hand, made to stay in your memory.',
  'Desde 2016, a Agô transforma formas, cores e símbolos de Trancoso em cerâmica para decorar, presentear e guardar uma lembrança do lugar.': 'Since 2016, Agô has turned the shapes, colors and symbols of Trancoso into ceramic pieces for decorating, gifting and keeping a memory of the place.',
  'Decorar': 'Decorate',
  'Presentear': 'Give as a gift',
  'Guardar Trancoso': 'Keep a piece of Trancoso',
  'Conhecer a Agô': 'Meet Agô',
  'Compra simples': 'Simple purchase',
  'Como levar uma peça da Agô para casa.': 'How to bring an Agô piece home.',
  'Escolha sua peça, confira a entrega e compre aqui no site.': 'Choose your piece, review delivery and complete your purchase on the site.',
  'Escolha a sua peça': 'Choose your piece',
  'Veja fotos, preço, medidas e detalhes antes de adicionar à sacola.': 'See photos, price, measurements and details before adding it to your bag.',
  'Finalize no site': 'Checkout on the site',
  'Revise sua sacola e pague com segurança pela InfinitePay.': 'Review your bag and pay securely with InfinitePay.',
  'Receba em casa': 'Receive it at home',
  'Enviamos para todo o Brasil. Frete fixo de R$ 39,90 e grátis a partir de R$ 500 em produtos.': 'We ship throughout Brazil. Fixed shipping is R$ 39.90 and free on R$ 500 or more in products.',
  'Se estiver por perto': 'If you are nearby',
  'A gente está no Quadrado.': 'Find us in the Quadrado.',
  'Veja as peças de perto na nossa banca, no Quadrado de Trancoso.': 'See the pieces in person at our stand in the Trancoso Quadrado.',
  'Quadrado de Trancoso': 'Trancoso Quadrado',
  'Porto Seguro · Bahia': 'Porto Seguro · Bahia',
  'Como chegar': 'Directions',
  'Na banca, no Quadrado': 'At our stand in the Quadrado',
  'Ver as igrejinhas': 'View the churches',
  'Agô no Quadrado de Trancoso.': 'Agô in the Trancoso Quadrado.',
  'Use o mapa para localizar a banca e abrir a rota.': 'Use the map to find our stand and open directions.',
  'Abrir no Google Maps': 'Open in Google Maps',
  'Da viagem para a casa': 'From your trip to your home',
  'Leve um pouco de Trancoso com você.': 'Take a little of Trancoso with you.',
  'Escolha uma peça para decorar, presentear ou guardar a memória do lugar.': 'Choose a piece to decorate, give as a gift or keep the memory of this place.',
  'Escolher minha peça': 'Choose my piece',

  // Header / busca / navegação
  'Início': 'Home',
  'Coleção': 'Collection',
  'A Agô': 'About Agô',
  'Contato': 'Contact',
  'Igrejinhas': 'Churches',
  'Decoração': 'Decor',
  'Ver tudo': 'View all',
  'Explorar coleção': 'Explore collection',
  'Buscar': 'Search',
  'Buscar uma peça': 'Search for a piece',
  'Buscar na coleção': 'Search the collection',
  'Sugestões de peças': 'Piece suggestions',
  'Navegação principal': 'Main navigation',
  'Navegação móvel': 'Mobile navigation',
  'Categorias': 'Categories',
  'Informações comerciais': 'Shopping information',
  'Frete grátis a partir de R$ 500 em produtos': 'Free shipping on R$ 500 or more in products',
  '3% OFF na 1ª compra': '3% OFF your first purchase',
  'Abrir sacola': 'Open bag',
  'Abrir menu': 'Open menu',
  'Fechar menu': 'Close menu',

  // Produto e compra
  'Cerâmica artesanal': 'Handmade ceramic',
  'Igrejinha de Trancoso · Cerâmica artesanal': 'Trancoso church · Handmade ceramic',
  'Material': 'Material',
  'Cerâmica': 'Ceramic',
  'Disponibilidade': 'Availability',
  'Disponível para compra': 'Available to purchase',
  'Indisponível': 'Unavailable',
  'Uso': 'Use',
  'Para pendurar ou apoiar na decoração': 'Hang on a wall or display on a shelf',
  'Medidas': 'Measurements',
  'Consultar medidas': 'Ask for measurements',
  'Adicionar à sacola': 'Add to bag',
  'Na sacola': 'In bag',
  'Quantidade': 'Quantity',
  'Diminuir quantidade': 'Decrease quantity',
  'Aumentar quantidade': 'Increase quantity',
  'Entrega no Brasil. O total da sacola é atualizado ao adicionar outras peças.': 'Delivery in Brazil. Your bag total updates as you add other pieces.',
  'Compra sem cadastro · Pagamento seguro pela InfinitePay': 'No account required · Secure payment via InfinitePay',
  'Consultar prazo para meu CEP': 'Check delivery time for my ZIP code',
  'Prefere comprar pelo WhatsApp?': 'Prefer to buy on WhatsApp?',
  'Dúvidas sobre a compra': 'Questions about your purchase',
  'Como comprar pelo site?': 'How do I buy on the site?',
  'Adicione a peça à sacola, informe a entrega e siga para o pagamento. Não é preciso criar uma conta.': 'Add the piece to your bag, enter delivery details and continue to payment. You do not need to create an account.',
  'Quanto custa o envio?': 'How much is shipping?',
  'Como confirmar o tamanho e a cor?': 'How do I confirm size and color?',
  'Confira as medidas e a galeria. O acabamento artesanal pode variar; para uma cor específica, confirme com a Agô antes de comprar.': 'Check the measurements and gallery. Handmade finishes may vary; for a specific color, confirm with Agô before purchasing.',
  'Posso encomendar várias peças?': 'Can I order several pieces?',
  'Para quantidades maiores ou personalização, fale com a Agô antes de pagar.': 'For larger quantities or customization, contact Agô before paying.',
  'International shipping': 'International shipping',
  'Fora do Brasil?': 'Outside Brazil?',
  'Cotação sob consulta, conforme o destino e as peças.': 'Shipping quote available upon request, depending on destination and the pieces selected.',
  'Consultar envio': 'Ask about shipping',
  'Outras peças': 'More pieces',
  'Para acompanhar sua escolha.': 'To complement your choice.',
  'Compartilhar': 'Share',
  'Peça indisponível no momento': 'This piece is currently unavailable',

  // Rodapé
  'Desde 2016 no Quadrado.': 'In the Quadrado since 2016.',
  'Explorar': 'Explore',
  'Presentes e lembranças': 'Gifts & keepsakes',
  'Fale com a gente': 'Talk to us',
  'Contato e redes sociais': 'Contact and social media',
  'Visite': 'Visit',
  'Enviamos para todo o Brasil. Frete grátis a partir de R$ 500 em produtos.': 'We ship throughout Brazil. Free shipping on R$ 500 or more in products.',
  'Envio internacional para mais de 200 países': 'International shipping to more than 200 countries',
  'Termos de Uso': 'Terms of Use',
  'Política de Privacidade': 'Privacy Policy',
  'Todos os direitos reservados.': 'All rights reserved.',
  'Rodapé': 'Footer',
  'Trancoso · Bahia · Brasil': 'Trancoso · Bahia · Brazil',

  // Páginas editoriais / SEO
  'Navegação estrutural': 'Breadcrumb navigation',
  'Cerâmica artesanal no coração de Trancoso.': 'Handmade ceramics in the heart of Trancoso.',
  'A Agô reúne no Quadrado uma seleção de cerâmica artesanal inspirada nas cores, na arquitetura, na fé e nos símbolos que fazem parte de Trancoso.': 'At the Quadrado, Agô brings together handmade ceramics inspired by the colors, architecture, faith and symbols of Trancoso.',
  'Artesanato em Trancoso': 'Crafts in Trancoso',
  'Peças que começam pelo lugar.': 'Pieces that begin with the place.',
  'Ver coleção completa': 'View full collection',
  'No coração da vila': 'In the heart of the village',
  'O Quadrado como inspiração.': 'The Quadrado as inspiration.',
  'Entre as referências da coleção estão o Quadrado de Trancoso e a Igreja de São João Batista, também conhecida como Igrejinha de Trancoso ou Igreja do Quadrado. Elas aparecem em miniaturas, luminárias, presentes e outras peças de cerâmica artesanal.': 'The collection draws from the Trancoso Quadrado and São João Batista Church, also known as the Trancoso Church or Quadrado Church. These references appear in miniatures, luminaries, gifts and other handmade ceramic pieces.',
  'Quem procura artesanato, decoração ou uma lembrança de Trancoso pode conhecer as peças presencialmente no Quadrado. Para outras cidades do Brasil, a coleção também está disponível para compra online.': 'If you are looking for crafts, decor or a keepsake from Trancoso, you can see the pieces in person at the Quadrado. The collection is also available online for delivery elsewhere in Brazil.',
  'Ver Igrejinhas de Trancoso': 'View Trancoso churches',
  'Presentes e lembranças': 'Gifts and keepsakes',
  'Visitar a Agô': 'Visit Agô',
  'Artesanato em Trancoso, feito de cerâmica e memória.': 'Crafts in Trancoso, shaped in ceramic and memory.',
  'As formas da igreja, as cores das casinhas e a vida no Quadrado inspiram peças para a casa. Conheça a seleção de cerâmica artesanal disponível na Agô.': 'The church silhouette, colorful houses and life in the Quadrado inspire pieces for the home. Discover Agô’s selection of handmade ceramics.',
  'Cerâmica artesanal e decoração de Trancoso': 'Handmade ceramics and decor from Trancoso',
  'Arquitetura em miniatura': 'Architecture in miniature',
  'Do Quadrado de Trancoso para a decoração.': 'From the Trancoso Quadrado to your decor.',
  'A Igreja de São João Batista, conhecida como Igreja do Quadrado ou Igrejinha de Trancoso, aparece em diferentes tamanhos de cerâmica. As miniaturas das casinhas trazem outra referência do centro histórico da vila.': 'São João Batista Church, known as the Quadrado Church or Trancoso Church, appears in different ceramic sizes. Miniatures of the colorful houses bring another reference from the village’s historic center.',
  'Para decorar, escolha pela proporção do espaço: uma pequena igrejinha sobre a estante, uma miniatura do Quadrado na parede ou uma casinha luminária em um canto da casa. Cada página apresenta as fotos, o valor e as informações disponíveis de cada peça.': 'For decor, choose according to the scale of your space: a small church on a shelf, a Quadrado miniature on the wall or a ceramic house luminary in a corner. Each product page shows photos, price and the available details.',
  'Ver tamanhos das igrejinhas ↗': 'Compare church sizes ↗',
  'Encontre a Agô': 'Find Agô',
  'Onde encontrar artesanato no Quadrado?': 'Where to find crafts in the Quadrado?',
  'Nossa banca fica no Quadrado de Trancoso, em Porto Seguro, no sul da Bahia. Passe para conhecer a cerâmica de perto. Se estiver longe, a coleção também está disponível para compra online, com envio para todo o Brasil.': 'Our stand is in the Trancoso Quadrado, in Porto Seguro, southern Bahia. Stop by to see the ceramics up close. If you are farther away, the collection is also available online with shipping throughout Brazil.',
  'Para escolher um souvenir da viagem ou um presente menor, veja nossa seleção de lembranças de Trancoso, com ímãs, colares e miniaturas.': 'For a travel souvenir or a smaller gift, explore our Trancoso keepsakes, including magnets, necklaces and miniatures.',
  'Ver localização e contato ↗': 'View location and contact ↗',
  'Escolher uma lembrança de Trancoso ↗': 'Choose a Trancoso keepsake ↗',
  'Trancoso para a sua casa': 'Trancoso for your home',
  'Decoração em cerâmica, com a memória da Bahia.': 'Ceramic decor with the memory of Bahia.',
  'Igrejinhas, casinhas luminárias e objetos para compor estantes, aparadores e paredes. Escolha uma peça pela forma, pela proporção e pela história que ela leva para o seu espaço.': 'Churches, ceramic house luminaries and objects for shelves, consoles and walls. Choose a piece for its shape, scale and the story it brings into your space.',
  'Peças para decorar a casa': 'Pieces for home decor',
  'Antes de escolher': 'Before you choose',
  'Encontre a proporção para o seu ambiente.': 'Find the right scale for your space.',
  'Antes de escolher, pense no espaço onde a peça vai ficar e no efeito que você quer criar. Algumas funcionam bem em estantes, aparadores e mesas, enquanto outras podem ser penduradas ou usadas como ponto de luz.': 'Before choosing, think about where the piece will live and the effect you want to create. Some work well on shelves, consoles and tables, while others can be hung or used as a point of light.',
  'A miniatura do Quadrado pode ser pendurada. Para um canto de leitura, uma estante ou um aparador, explore também as casinhas e igrejinhas luminárias. As informações disponíveis de cada modelo estão na página da peça. Se precisar de alguma medida que não estiver informada, fale com a gente.': 'The Quadrado miniature can be hung on the wall. For a reading corner, shelf or console, also explore the ceramic house and church luminaries. Each product page includes the available details; contact us if you need a measurement that is not listed.',
  'Ver peças e filtrar por preço ↗': 'View pieces and filter by price ↗',
  'Vai visitar Trancoso?': 'Visiting Trancoso?',
  'Veja as peças de perto no Quadrado.': 'See the pieces up close in the Quadrado.',
  'Passe na nossa banca no Quadrado de Trancoso para conhecer as cores e as proporções ao vivo. Consulte o contato para combinar sua visita.': 'Visit our stand in the Trancoso Quadrado to see the colors and proportions in person. Use the contact page to plan your visit.',
  'Depois da viagem, você também pode escolher pelo site e receber em casa. As páginas dos produtos mostram preços, fotos e condições de envio.': 'After your trip, you can also shop on the site and have your piece delivered. Product pages show prices, photos and shipping conditions.',
  'Localização e contato ↗': 'Location and contact ↗',
  'Lembranças da viagem ↗': 'Travel keepsakes ↗',
  'Igrejinha de Trancoso em cerâmica': 'Trancoso church in ceramic',
  'Escolha entre diferentes versões da Igrejinha do Quadrado, compre online e receba em qualquer lugar do Brasil.': 'Choose from different versions of the Quadrado Church, shop online and receive your order anywhere in Brazil.',
  'Igrejinhas de Trancoso e peças inspiradas na Igreja do Quadrado': 'Trancoso churches and pieces inspired by the Quadrado Church',
  'Compare sem sair da página': 'Compare without leaving the page',
  'Encontre o modelo certo.': 'Find the right model.',
  'Compare os tamanhos e valores. Abra cada modelo para ver as fotos e encontrar o que combina com seu espaço.': 'Compare sizes and prices. Open each model to see the photos and find the one that suits your space.',
  'Peça decorativa e luminária': 'Decorative piece and luminary',
  'Miniatura decorativa': 'Decorative miniature',
  'Compra online e no Quadrado': 'Shop online and in the Quadrado',
  'Onde comprar uma Igrejinha de Trancoso?': 'Where to buy a Trancoso ceramic church?',
  'A Agô Trancoso vende as igrejinhas em cerâmica online neste site e presencialmente na banca do Quadrado de Trancoso, em Porto Seguro, Bahia.': 'Agô Trancoso sells the ceramic churches online on this site and in person at our stand in the Trancoso Quadrado, Porto Seguro, Bahia.',
  'Ver toda a coleção': 'View the full collection',
  'Visitar a Agô no Quadrado': 'Visit Agô in the Quadrado',
  'Um símbolo do Quadrado': 'A symbol of the Quadrado',
  'A Igreja de São João Batista como inspiração.': 'São João Batista Church as inspiration.',
  'A Igreja de São João Batista, conhecida como Igreja do Quadrado ou Igrejinha de Trancoso, é um dos marcos mais reconhecidos do centro histórico de Trancoso. As peças reunidas aqui levam essa fachada para miniaturas, luminária, ímã e colar de cerâmica.': 'São João Batista Church, known as the Quadrado Church or Trancoso Church, is one of the best-known landmarks in Trancoso’s historic center. The pieces gathered here bring its façade to miniatures, a luminary, magnet and ceramic necklace.',
  'Para quem procura uma lembrança de Trancoso, um presente ou uma peça de decoração, a compra pode ser feita diretamente pelo site. Quem estiver na vila também pode ver as peças presencialmente na Agô, no Quadrado de Trancoso.': 'If you are looking for a Trancoso keepsake, gift or decor piece, you can buy directly on the site. Visitors in the village can also see the pieces in person at Agô in the Trancoso Quadrado.',
  'Como visitar a Agô': 'How to visit Agô',
  'Para presentear e guardar': 'To gift and keep',
  'Lembranças de Trancoso em cerâmica.': 'Trancoso keepsakes in ceramic.',
  'Presentes e souvenirs de Trancoso': 'Trancoso gifts and souvenirs',
  'Uma escolha com significado': 'A meaningful choice',
  'Qual lembrança de Trancoso escolher?': 'Which Trancoso keepsake should you choose?',
  'O ímã e o colar da igrejinha são opções pequenas para presentear. Para a decoração, as igrejinhas P e M levam a fachada da Igreja de São João Batista para prateleiras e aparadores.': 'The church magnet and necklace are small gift options. For decor, the small and medium churches bring the façade of São João Batista Church to shelves and consoles.',
  'A miniatura do Quadrado reúne as casinhas e a igreja em uma composição que pode ser pendurada ou apoiada. Quem prefere uma peça de luz pode conhecer a Igrejinha Luminária. Veja as fotos e as informações disponíveis na página de cada peça antes de escolher. Se precisar de alguma medida que não estiver informada, fale com a gente.': 'The Quadrado miniature brings the houses and church together in a composition that can be hung or displayed. If you prefer a piece with light, explore the Church Luminary. Review the photos and available details on each product page before choosing, and contact us if you need a measurement that is not listed.',
  'Comparar as igrejinhas de Trancoso ↗': 'Compare Trancoso churches ↗',
  'Compra online': 'Shop online',
  'Escolha, coloque na sacola e receba.': 'Choose, add to your bag and receive it at home.',
  'Abra a peça, escolha a quantidade e adicione à sacola. Na finalização, informe seus dados e endereço, confira o total e siga para o pagamento pela InfinitePay.': 'Open the product, choose the quantity and add it to your bag. At checkout, enter your details and address, review the total and continue to payment via InfinitePay.',
  'Quer uma encomenda personalizada ou várias lembranças para presentear?': 'Would you like a custom order or several keepsakes for gifting?',
  'Fale com a Agô para combinar os detalhes.': 'Talk to Agô to arrange the details.',
  'No Quadrado de Trancoso': 'In the Trancoso Quadrado',
  'Onde comprar lembranças em Trancoso?': 'Where to buy Trancoso keepsakes?',
  'Você encontra a Agô no Quadrado de Trancoso, em Porto Seguro, Bahia. Pode ver as peças na nossa banca durante a viagem ou comprar pelo site depois de voltar para casa.': 'You can find Agô in the Trancoso Quadrado, Porto Seguro, Bahia. See the pieces at our stand during your trip or shop online after you return home.',
  'Como chegar à Agô ↗': 'Directions to Agô ↗',
  'Conhecer o artesanato em cerâmica ↗': 'Discover our ceramic craft ↗',

  // Legal
  'Termos de Uso': 'Terms of Use',
  'Estes termos orientam o uso do site da Agô Trancoso e a realização de pedidos pela loja.': 'These terms govern the use of the Agô Trancoso website and orders placed through the store.',
  '1. Uso do site': '1. Use of the site',
  'Ao navegar pelo site, você se compromete a fornecer informações verdadeiras nos formulários de cadastro e compra e a utilizar a loja de forma compatível com a legislação aplicável.': 'By using the site, you agree to provide accurate information in registration and purchase forms and to use the store in accordance with applicable law.',
  '2. Produtos, preços e disponibilidade': '2. Products, prices and availability',
  'Os produtos, preços, condições de promoção e disponibilidade são apresentados no próprio site e podem ser atualizados pela Agô Trancoso. O pedido só é confirmado após a conclusão do processo de pagamento.': 'Products, prices, promotional conditions and availability are shown on the site and may be updated by Agô Trancoso. An order is confirmed only after the payment process is completed.',
  '3. Pagamento e entrega': '3. Payment and delivery',
  'O pagamento é processado por parceiro de pagamento integrado ao site. As condições de entrega e frete são informadas durante a compra.': 'Payment is processed by the payment provider integrated with the site. Delivery and shipping conditions are shown during purchase.',
  '4. Benefício de primeira compra': '4. First-purchase benefit',
  'O código da oferta fica salvo neste navegador. A elegibilidade é verificada no checkout com o e-mail e o telefone informados no pedido. O desconto só é aplicado após essa validação.': 'The offer code is stored in this browser. Eligibility is checked at checkout using the email and phone number provided with the order. The discount is applied only after this validation.',
  '5. Atendimento': '5. Customer service',
  'Para dúvidas sobre pedidos, produtos ou uso do site, utilize os canais de atendimento disponibilizados no próprio site.': 'For questions about orders, products or use of the site, use the support channels provided on the website.',
  '6. Atualizações': '6. Updates',
  'Estes termos podem ser atualizados para refletir mudanças no site, nos serviços ou na legislação. A versão publicada nesta página é a referência vigente.': 'These terms may be updated to reflect changes to the site, services or applicable law. The version published on this page is the current reference.',
  'Última atualização: 26 de setembro de 2026.': 'Last updated: September 26, 2026.',
  'Política de Privacidade': 'Privacy Policy',
  'Esta página explica, de forma simples, como os dados informados no site podem ser utilizados para atendimento, pedidos, medição da experiência e relacionamento com a Agô.': 'This page explains how information provided on the site may be used for customer service, orders, experience measurement and your relationship with Agô.',
  '1. Dados coletados': '1. Data collected',
  'Dependendo da ação realizada, o site pode solicitar nome, e-mail, telefone, CPF ou CNPJ e informações necessárias para entrega, como endereço e CEP. O CPF ou CNPJ é solicitado no checkout para identificação do pedido e necessidades de emissão e postagem. Dados técnicos de navegação e interação só são enviados às ferramentas de medição e marketing quando você escolhe aceitar esses recursos.': 'Depending on the action you take, the site may request your name, email, phone number, Brazilian CPF or CNPJ when applicable, and delivery information such as address and postal code. CPF or CNPJ is requested for Brazilian checkout identification and fulfillment needs. Technical browsing and interaction data is sent to measurement and marketing tools only when you choose to accept those features.',
  '2. Para que usamos os dados': '2. How we use data',
  'Os dados são utilizados para atender solicitações, processar pedidos e pagamentos, organizar a emissão e a entrega e cumprir obrigações aplicáveis à operação da compra. Comunicações promocionais dependem do consentimento aplicável e não são uma condição para concluir uma compra.': 'Data is used to respond to requests, process orders and payments, organize fulfillment and delivery, and comply with obligations applicable to the purchase. Promotional communications depend on the applicable consent and are not required to complete a purchase.',
  '3. Analytics, anúncios e CRM': '3. Analytics, advertising and CRM',
  'Quando você aceita, a Agô pode usar ferramentas de analytics, publicidade e CRM para medir páginas vistas, produtos consultados, adições à sacola e etapas de compra, além de entender o desempenho de campanhas. Ao escolher “Somente essenciais”, essas ferramentas de medição e marketing não são carregadas pelo site.': 'When you consent, Agô may use analytics, advertising and CRM tools to measure page views, products viewed, additions to bag and purchase steps, and to understand campaign performance. When you choose “Essential only”, these measurement and marketing tools are not loaded by the site.',
  '4. Pagamento': '4. Payment',
  'Os dados necessários ao pagamento são encaminhados ao provedor de pagamento integrado ao checkout. A Agô Trancoso não deve solicitar por este site senhas ou códigos de autenticação do seu banco.': 'Information required for payment is sent to the payment provider integrated with checkout. Agô Trancoso will not ask through this site for your bank password or authentication codes.',
  '5. Compartilhamento': '5. Sharing',
  'As informações podem ser compartilhadas apenas com prestadores necessários à operação da loja, inclusive serviços relacionados a pagamento, emissão e entrega, e, quando autorizado, com serviços de medição, publicidade e relacionamento, sempre de acordo com a finalidade informada.': 'Information may be shared only with providers needed to operate the store, including payment and delivery services, and, when authorized, with measurement, advertising and customer relationship services, always for the stated purpose.',
  '6. Segurança e retenção': '6. Security and retention',
  'São adotadas medidas técnicas e organizacionais compatíveis com a operação do site. Os dados são mantidos pelo período necessário às finalidades para as quais foram coletados e às obrigações legais aplicáveis.': 'Technical and organizational measures appropriate to the site’s operation are used. Data is retained for the period needed for the purposes for which it was collected and for applicable legal obligations.',
  '7. Seus direitos e preferências': '7. Your rights and preferences',
  'Você pode solicitar informações sobre o tratamento dos seus dados e, quando aplicável, exercer os direitos previstos na legislação de proteção de dados pelos canais de atendimento da Agô Trancoso. A escolha de privacidade feita no site fica armazenada no seu navegador.': 'You may request information about how your data is processed and, when applicable, exercise rights provided by data protection law through Agô Trancoso’s support channels. Your privacy choice on the site is stored in your browser.',
  'Última atualização: 29 de setembro de 2026.': 'Last updated: September 29, 2026.',

  // Produtos
  'Igreja do Quadrado (P)': 'Church of the Quadrado (Small)',
  'Igreja do Quadrado (M)': 'Church of the Quadrado (Medium)',
  'Igreja do Quadrado (GG) — Luminária': 'Church of the Quadrado (Large) — Luminary',
  'Igrejinha Luminária de Trancoso': 'Trancoso Church Luminary',
  'Casinha Luminária': 'Ceramic House Luminary',
  'Miniatura do Quadrado de Trancoso para Pendurar': 'Hanging Miniature of the Trancoso Quadrado',
  'Cruzeiro do Quadrado': 'Quadrado Cross',
  'Móbile Trancoso em Cerâmica': 'Trancoso Ceramic Mobile',
  'Estatueta Iemanjá em Cerâmica': 'Iemanjá Ceramic Figurine',
  'Nossa Senhora Grande': 'Large Our Lady Figurine',
  'Presépio em Cerâmica': 'Ceramic Nativity Set',
  'Casal de Pretos-Velhos em Cerâmica': 'Pretos-Velhos Couple in Ceramic',
  'Nossa Senhora Aparecida': 'Our Lady of Aparecida',
  'Divino Espírito Santo para Pendurar': 'Hanging Holy Spirit Plaque',
  'Terço em Cerâmica': 'Ceramic Rosary',
  'Rosário Trancoso em Cerâmica': 'Trancoso Ceramic Rosary',
  'Esfera Decorativa': 'Decorative Ceramic Sphere',
  'Colar da Igreja do Quadrado': 'Quadrado Church Necklace',
  'Ímã da Igrejinha de Trancoso': 'Trancoso Church Magnet',

  'A Igreja de São João Batista em miniatura, feita em cerâmica e pintada à mão. Uma lembrança do Quadrado para decorar ou presentear.': 'A miniature of São João Batista Church, made in ceramic and hand-painted. A keepsake from the Quadrado for decorating or gifting.',
  'Miniatura em cerâmica da Igreja de São João Batista, no Quadrado de Trancoso. A versão M traz as formas da igreja para sua decoração.': 'A ceramic miniature of São João Batista Church in the Trancoso Quadrado. The medium size brings the church silhouette into your decor.',
  'Escultura em cerâmica modelada à mão, inspirada na Igreja de São João Batista. A versão GG também funciona como luminária.': 'A hand-shaped ceramic sculpture inspired by São João Batista Church. The large version also works as a luminary.',
  'A Igrejinha do Quadrado em cerâmica, modelada à mão para iluminar a decoração. Pode receber vela LED ou vela pequena em seu interior.': 'The Quadrado church in hand-shaped ceramic, designed to bring a soft glow to your decor. It can hold an LED candle or a small candle.',
  'Casinha de cerâmica inspirada em Trancoso. Com vela rechaud ou LED, a luz passa pelas portas e janelas.': 'A ceramic house inspired by Trancoso. With a tealight or LED candle, light shines through its doors and windows.',
  'O Quadrado em miniatura, com casinhas coloridas e igrejinha em cerâmica. Para pendurar na parede ou apoiar em uma prateleira.': 'The Quadrado in miniature, with colorful houses and a ceramic church. Hang it on a wall or display it on a shelf.',
  'Miniatura em cerâmica do cruzeiro do Centro Histórico de Trancoso. Uma referência à história e à fé presentes no Quadrado.': 'A ceramic miniature of the cross in Trancoso’s Historic Center, referencing the history and faith present in the Quadrado.',
  'Casinhas de cerâmica feitas à mão e suspensas em fio. Um móbile inspirado em Trancoso, com movimento suave ao toque da brisa.': 'Handmade ceramic houses suspended on a line. A Trancoso-inspired mobile with gentle movement in the breeze.',
  'Escultura artesanal de Iemanjá em cerâmica. Para compor um altar ou um espaço de fé e devoção.': 'A handcrafted ceramic sculpture of Iemanjá, made for an altar or a space of faith and devotion.',
  'Imagem de Nossa Senhora em cerâmica, com detalhes nas vestes. Para capelas domésticas e espaços de devoção.': 'A ceramic figure of Our Lady with detailed robes, intended for home chapels and devotional spaces.',
  'Cinco peças em cerâmica: Jesus, Maria, José, anjo e Estrela de Belém. Modeladas e pintadas à mão para compor a decoração de Natal.': 'Five ceramic pieces: Jesus, Mary, Joseph, an angel and the Star of Bethlehem. Hand-shaped and painted for Christmas decor.',
  'Casal de Pretos-Velhos em cerâmica, com vestimentas, banco e cachimbo modelados à mão. Uma representação ligada à sabedoria e à proteção.': 'A ceramic Pretos-Velhos couple, with clothing, bench and pipe shaped by hand. A representation associated with wisdom and protection.',
  'Miniatura em cerâmica de Nossa Senhora Aparecida, feita e pintada à mão. O manto azul recebe detalhes dourados.': 'A handmade and hand-painted ceramic miniature of Our Lady of Aparecida, with golden details on the blue mantle.',
  'Placa circular de cerâmica com a pomba do Divino Espírito Santo em relevo. Para pendurar em paredes internas.': 'A round ceramic plaque with the Holy Spirit dove in relief, made to hang on interior walls.',
  'Terço artesanal com contas de cerâmica branca e cruz na ponta. Para devoção ou decoração de um espaço de fé.': 'A handmade rosary with white ceramic beads and a cross, for devotion or decor in a space of faith.',
  'Rosário feito à mão com contas de cerâmica e medalhão da Igreja do Quadrado. Para compor um altar ou presentear.': 'A handmade rosary with ceramic beads and a Quadrado Church medallion, for an altar or as a gift.',
  'Esfera de cerâmica para compor a decoração sobre mesas ou suportes. Uma forma simples para combinar com outros objetos.': 'A ceramic sphere for styling tables or stands, with a simple form that pairs easily with other objects.',
  'Colar em cerâmica modelado à mão, inspirado na Igreja do Quadrado. Uma lembrança de Trancoso para usar.': 'A hand-shaped ceramic necklace inspired by the Quadrado Church, a wearable memory of Trancoso.',
  'Ímã de cerâmica da Igreja de São João Batista, pintado à mão. Uma pequena lembrança de Trancoso para presentear ou colecionar.': 'A hand-painted ceramic magnet of São João Batista Church, a small Trancoso keepsake for gifting or collecting.',
};

const patternTranslations: Array<[RegExp, (match: RegExpMatchArray) => string]> = [
  [/^Ver resultados para “(.+)”$/, (m) => `View results for “${m[1]}”`],
  [/^Buscar “(.+)” na coleção$/, (m) => `Search the collection for “${m[1]}”`],
  [/^Abrir sacola com (\d+) item$/, (m) => `Open bag with ${m[1]} item`],
  [/^Abrir sacola com (\d+) itens$/, (m) => `Open bag with ${m[1]} items`],
  [/^(\d+) peça: (.+) · Frete: (.+)$/, (m) => `${m[1]} piece: ${m[2]} · Shipping: ${m[3]}`],
  [/^(\d+) peças: (.+) · Frete: (.+)$/, (m) => `${m[1]} pieces: ${m[2]} · Shipping: ${m[3]}`],
  [/^Esta seleção com frete: (.+)$/, (m) => `This selection with shipping: ${m[1]}`],
  [/^Subtotal (.+)$/, (m) => `Subtotal ${m[1]}`],
  [/^Frete (.+)$/, (m) => `Shipping ${m[1]}`],
  [/^Total (.+)$/, (m) => `Total ${m[1]}`],
  [/^Adicionar à sacola: (\d+) unidade de (.+)$/, (m) => `Add to bag: ${m[1]} unit of ${translateExact(m[2])}`],
  [/^Adicionar à sacola: (\d+) unidades de (.+)$/, (m) => `Add to bag: ${m[1]} units of ${translateExact(m[2])}`],
  [/^(.+) está na sacola$/, (m) => `${translateExact(m[1])} is in your bag`],
  [/^Altura: (.+) · Largura: (.+)$/, (m) => `Height: ${m[1]} · Width: ${m[2]}`],
  [/^Comprimento: (.+) · Altura com a cruz da igrejinha do meio: (.+)$/, (m) => `Length: ${m[1]} · Height including the center church cross: ${m[2]}`],
  [/^O Quadrado, a igrejinha, as casinhas coloridas\. Escolha um presente que leve um pouco de Trancoso para o dia a dia\. Peças nesta seleção a partir de (.+)\.$/, (m) => `The Quadrado, its church and colorful houses. Choose a gift that brings a little of Trancoso into everyday life. Pieces in this selection start at ${m[1]}.`],
  [/^Há versões P, M e GG, além da Igrejinha Luminária\. As igrejinhas em cerâmica disponíveis começam em (.+)\. Também enviamos para todo o Brasil e fazemos cotação internacional sob consulta\.$/, (m) => `There are small, medium and large versions, plus the Church Luminary. Available ceramic churches start at ${m[1]}. We ship throughout Brazil and provide international shipping quotes on request.`],
  [/^Enviamos para todo o Brasil\. O frete fixo é de (.+); quando houver frete grátis para o pedido, o desconto aparece na sacola\. Para confirmar o prazo de entrega no seu endereço, fale com a Agô antes de comprar\.$/, (m) => `We ship throughout Brazil. Fixed shipping is ${m[1]}; when free shipping applies, the discount appears in your bag. To confirm the delivery estimate for your address, contact Agô before purchasing.`],
];

function translateExact(value: string) {
  return exact[value] ?? value;
}

function translateValue(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return value;
  const direct = translateExact(trimmed);
  if (direct !== trimmed) return value.replace(trimmed, direct);
  for (const [pattern, make] of patternTranslations) {
    const match = trimmed.match(pattern);
    if (match) return value.replace(trimmed, make(match));
  }
  return value;
}

function shouldSkip(node: Node) {
  const parent = node.parentElement;
  if (!parent) return true;
  return Boolean(parent.closest('script, style, noscript, code, pre, [data-no-translate="true"]'));
}

function translateNode(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
  for (const node of textNodes) {
    if (shouldSkip(node)) continue;
    const next = translateValue(node.nodeValue ?? '');
    if (next !== node.nodeValue) node.nodeValue = next;
  }

  const elements = root instanceof Element ? [root, ...Array.from(root.querySelectorAll('*'))] : Array.from(root.querySelectorAll('*'));
  for (const element of elements) {
    if (element.closest('script, style, noscript, code, pre, [data-no-translate="true"]')) continue;
    for (const attr of ['aria-label', 'placeholder', 'title', 'alt']) {
      const current = element.getAttribute(attr);
      if (!current) continue;
      const next = translateValue(current);
      if (next !== current) element.setAttribute(attr, next);
    }
  }
}

function localeFromCookie(): Locale {
  const item = document.cookie.split('; ').find((entry) => entry.startsWith(`${COOKIE}=`));
  return item?.split('=')[1] === 'en' ? 'en' : 'pt';
}

function stripEnglishPrefix(pathname: string) {
  if (pathname === '/en') return '/';
  return pathname.startsWith('/en/') ? pathname.slice(3) || '/' : pathname;
}

function addEnglishPrefix(pathname: string) {
  if (pathname === '/en' || pathname.startsWith('/en/')) return pathname;
  return pathname === '/' ? '/en' : `/en${pathname}`;
}

function syncEnglishDocumentTitle() {
  const pathname = window.location.pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  const fixed: Record<string, string> = {
    '/': 'Ceramics in Trancoso | Agô Trancoso',
    '/produtos': 'Collection | Agô Trancoso',
    '/nossa-essencia': 'About Agô | Agô Trancoso',
    '/contato': 'Contact | Agô Trancoso',
    '/checkout': 'Complete purchase | Agô Trancoso',
    '/envio-internacional': 'International shipping | Agô Trancoso',
    '/trancoso': 'Ceramics in Trancoso | Agô Trancoso',
    '/artesanato-em-trancoso': 'Crafts in Trancoso | Agô Trancoso',
    '/decoracao-em-ceramica': 'Ceramic decor | Agô Trancoso',
    '/igrejinha-de-trancoso': 'Trancoso ceramic churches | Agô Trancoso',
    '/lembrancas-de-trancoso': 'Trancoso keepsakes | Agô Trancoso',
    '/termos': 'Terms of Use | Agô Trancoso',
    '/privacidade': 'Privacy Policy | Agô Trancoso',
  };
  let next = fixed[pathname];
  if (!next) {
    const heading = document.querySelector<HTMLElement>('main h1')?.textContent?.trim();
    next = heading ? `${heading} | Agô Trancoso` : 'Agô Trancoso';
  }
  if (document.title !== next) document.title = next;
}

export default function LocaleRuntime() {
  const [locale, setLocale] = useState<Locale>('pt');
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  useEffect(() => {
    const resolved: Locale = window.location.pathname === '/en' || window.location.pathname.startsWith('/en/') ? 'en' : localeFromCookie();
    setLocale(resolved);

    const observer = new MutationObserver((records) => {
      if (resolved !== 'en') return;
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && !shouldSkip(node)) {
            const text = node as Text;
            text.nodeValue = translateValue(text.nodeValue ?? '');
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            translateNode(node as Element);
          }
        });
      }
    });


    const rewriteLinks = () => {
      document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((anchor) => {
        if (anchor.dataset.noLocale === 'true') return;
        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('/api/') || href.startsWith('/_next/')) return;
        if (resolved === 'en') anchor.setAttribute('href', addEnglishPrefix(href));
        else anchor.setAttribute('href', stripEnglishPrefix(href));
      });
    };
    const linkObserver = new MutationObserver(rewriteLinks);
    const titleObserver = new MutationObserver(() => {
      if (resolved === 'en') syncEnglishDocumentTitle();
    });
    const cancelTranslation = afterInitialRender(() => {
      if (resolved === 'en') {
        if (document.documentElement.lang !== 'en') document.documentElement.lang = 'en';
        document.documentElement.dataset.locale = 'en';
        translateNode(document.body);
        syncEnglishDocumentTitle();
        observer.observe(document.body, { childList: true, subtree: true });
        rewriteLinks();
        linkObserver.observe(document.body, { childList: true, subtree: true });
        titleObserver.observe(document.head, { childList: true, subtree: true, characterData: true });
      }
      setPortalTarget(document.querySelector('.header-actions'));
    });
    return () => {
      cancelTranslation();
      observer.disconnect();
      linkObserver.disconnect();
      titleObserver.disconnect();
    };
  }, []);

  const switcher = useMemo(() => (
    <div className="ago-language-switcher" role="group" aria-label={locale === 'en' ? 'Language' : 'Idioma'} data-no-translate="true">
      <button
        type="button"
        className={locale === 'pt' ? 'is-active' : ''}
        aria-pressed={locale === 'pt'}
        onClick={() => {
          document.cookie = `${COOKIE}=pt; path=/; max-age=31536000; SameSite=Lax; Secure`;
          window.location.assign(stripEnglishPrefix(window.location.pathname) + window.location.search + window.location.hash);
        }}
      >PT</button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        className={locale === 'en' ? 'is-active' : ''}
        aria-pressed={locale === 'en'}
        onClick={() => {
          document.cookie = `${COOKIE}=en; path=/; max-age=31536000; SameSite=Lax; Secure`;
          window.location.assign(addEnglishPrefix(stripEnglishPrefix(window.location.pathname)) + window.location.search + window.location.hash);
        }}
      >EN</button>
    </div>
  ), [locale]);

  return portalTarget ? createPortal(switcher, portalTarget) : null;
}
