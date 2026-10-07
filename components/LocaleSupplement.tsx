'use client';

import { accessibilityEnglish } from '@/lib/accessibility-copy';

import { afterInitialRender } from '@/lib/after-initial-render';
import { useEffect } from 'react';

const exact: Record<string, string> = {
  ...accessibilityEnglish,
  'Faixa indicativa após a postagem, não consultada nos Correios. Confirme o prazo antes de comprar.': 'Indicative range after posting, not checked with Correios. Confirm the delivery time before ordering.',
  'Hand-shaped ceramic pieces, since 2016 in the Quadrado.': 'Churches, little houses and keepsakes from the Quadrado.',
  'A Agô reúne cerâmicas que carregam referências de Trancoso, para decorar, presentear e guardar uma lembrança especial.': 'Agô brings together ceramic pieces inspired by Trancoso, for decorating, gifting and keeping a special memory of the place.',

  'Sua seleção': 'Your selection',
  'Peças escolhidas por você.': 'Pieces you selected.',
  'Fechar sacola': 'Close bag',
  'Sua seleção está vazia.': 'Your bag is empty.',
  'Explore a coleção e encontre algo para levar ou presentear.': 'Explore the collection and find something to keep or give as a gift.',
  'Continuar comprando': 'Continue shopping',
  'Remover': 'Remove',
  'Para acompanhar': 'To complement your selection',
  'Destaques da coleção que combinam com sua seleção.': 'Collection highlights that pair well with your selection.',
  'Peças para acompanhar sua seleção': 'Pieces to complement your selection',
  'Navegar pelas sugestões': 'Browse suggestions',
  'Ver sugestões anteriores': 'View previous suggestions',
  'Ver próximas sugestões': 'View next suggestions',
  'Sugestões para acompanhar': 'Suggestions to complement your selection',
  'Com esta peça, seu pedido ganha frete grátis.': 'Add this piece and your order qualifies for free shipping.',
  'Você ganhou frete grátis neste pedido.': 'You have free shipping on this order.',
  'Frete fixo R$ 39,90': 'Fixed shipping R$ 39.90',
  'Grátis a partir de R$ 500 em produtos': 'Free on R$ 500 or more in products',
  'Grátis': 'Free',
  'Finalizar pedido': 'Checkout',
  'Sem criar conta · Pagamento pela InfinitePay': 'No account required · Payment via InfinitePay',
  'Continuar escolhendo': 'Keep browsing',

  'Preparando seu pedido…': 'Preparing your order…',
  'Carregando suas peças com segurança.': 'Loading your pieces securely.',
  'Sua sacola': 'Your bag',
  'Explorar coleção': 'Explore collection',
  'Seus dados': 'Your details',
  'Entrega': 'Delivery',
  'Benefício': 'Benefit',
  'Pagamento': 'Payment',
  'Seu pedido': 'Your order',
  'Finalizar compra': 'Complete purchase',
  'Compre sem criar uma conta. Confira seu pedido antes de seguir para o pagamento seguro.': 'Buy without creating an account. Review your order before continuing to secure payment.',
  'Etapas da compra': 'Checkout steps',
  'O cupom pode ser aplicado na etapa Benefício.': 'The coupon can be applied in the Benefit step.',
  'Editar': 'Edit',
  'Nome completo': 'Full name',
  'Seu nome': 'Your name',
  'E-mail': 'Email',
  'Telefone / WhatsApp': 'Phone / WhatsApp',
  'CPF ou CNPJ': 'CPF or CNPJ',
  '(para o envio)': '(required for shipping in Brazil)',
  '(entrega no Brasil)': '(Brazil delivery)',
  'Necessário para emissão e postagem do pedido.': 'Required for invoicing and shipping orders within Brazil.',
  'Obrigatório para pedidos com entrega no Brasil.': 'Required only for orders delivered within Brazil.',
  'Continuar para entrega': 'Continue to delivery',
  'CPF/CNPJ informado': 'CPF/CNPJ provided',
  'CEP': 'Brazilian ZIP code',
  'Número': 'Number',
  'Rua': 'Street',
  'Rua / avenida': 'Street / avenue',
  'Complemento': 'Additional address info',
  '(opcional)': '(optional)',
  'Apartamento, casa, referência': 'Apartment, house, landmark',
  'Bairro': 'Neighborhood',
  'Cidade': 'City',
  'Fora do Brasil? Consulte o envio internacional.': 'Outside Brazil? Continue to international shipping.',
  'Envio internacional': 'International shipping',
  'Para entregas fora do Brasil, não pedimos CPF/CNPJ. O frete é cotado antes do pagamento.': 'For deliveries outside Brazil, CPF/CNPJ is not required. Shipping is quoted before payment.',
  'Continuar para envio internacional': 'Continue to international shipping',
  'Frete grátis neste pedido.': 'Free shipping on this order.',
  'Frete grátis a partir de R$ 500 em produtos.': 'Free shipping on R$ 500 or more in products.',
  'Consultando prazo…': 'Checking delivery time…',
  'Continuar para benefício': 'Continue to benefit',
  'Conclua seus dados para liberar esta etapa.': 'Complete your details to unlock this step.',
  'Seu benefício': 'Your benefit',
  'O benefício está temporariamente indisponível. Você pode continuar sem cupom.': 'The benefit is temporarily unavailable. You can continue without a coupon.',
  'Cupom de desconto': 'Discount coupon',
  'Cupom': 'Coupon',
  'Validando…': 'Validating…',
  'Aplicar': 'Apply',
  'Continuar com benefício': 'Continue with benefit',
  'Continuar sem cupom': 'Continue without coupon',
  'Conclua a entrega para liberar esta etapa.': 'Complete delivery details to unlock this step.',
  'Revise seu pedido. Você será encaminhado ao ambiente seguro da InfinitePay para escolher a forma de pagamento e concluir a compra.': 'Review your order. You will be redirected to InfinitePay’s secure environment to choose a payment method and complete your purchase.',
  'Preparando pagamento…': 'Preparing payment…',
  'Pagar com InfinitePay': 'Pay with InfinitePay',
  'O pagamento será feito na próxima tela.': 'Payment will be completed on the next screen.',
  'Conclua a etapa de benefício para revisar e pagar.': 'Complete the benefit step to review and pay.',
  'Resumo do pedido': 'Order summary',
  'Resumo': 'Summary',
  'Suas peças': 'Your pieces',
  '1ª compra · 3% OFF': 'First purchase · 3% OFF',

  'Informe seu nome completo.': 'Enter your full name.',
  'Informe seu nome.': 'Enter your name.',
  'Informe um e-mail válido.': 'Enter a valid email address.',
  'Informe telefone com DDD, por exemplo (73) 99999-9999.': 'Enter a valid Brazilian phone number with area code, for example (73) 99999-9999.',
  'Informe um CPF ou CNPJ válido. CNPJ numérico e alfanumérico são aceitos.': 'Enter a valid CPF or CNPJ. Numeric and alphanumeric CNPJ formats are accepted.',
  'Informe a rua ou avenida.': 'Enter the street or avenue.',
  'Informe o número.': 'Enter the street number.',
  'Informe o bairro.': 'Enter the neighborhood.',
  'Informe a cidade.': 'Enter the city.',
  'Informe a UF com 2 letras.': 'Enter the 2-letter Brazilian state code.',
  'Informe seu telefone ou WhatsApp com código do país.': 'Enter your phone or WhatsApp number with country code.',
  'Informe o país ou território de destino.': 'Enter the destination country or territory.',
  'Informe a cidade de destino.': 'Enter the destination city.',
  'Informe o endereço de entrega.': 'Enter the delivery address.',

  'Frete e prazo estimado para seu CEP': 'Shipping and estimated delivery time for your ZIP code',
  'Estimativa baseada no CEP de destino, saindo de Trancoso. O prazo final é confirmado na postagem.': 'Estimate based on the destination ZIP code, shipping from Trancoso. The final delivery time is confirmed when the order is posted.',

  'Fale com a Agô': 'Talk to Agô',
  'Tem dúvida sobre uma peça, entrega ou pagamento? Fale com a gente. Para comprar, você também pode finalizar o pedido direto pelo site.': 'Questions about a piece, delivery or payment? Talk to us. You can also complete your purchase directly on the site.',
  'Falar no WhatsApp': 'Talk on WhatsApp',
  'Canais de contato': 'Contact channels',
  'Falar com a Agô Trancoso pelo WhatsApp': 'Talk to Agô Trancoso on WhatsApp',
  'Abrir Instagram da Agô Trancoso': 'Open Agô Trancoso on Instagram',
  'Abrir localização no Google Maps': 'Open location in Google Maps',
  'Onde encontrar': 'Where to find us',
  'Praça São João Batista, Trancoso': 'São João Batista Square, Trancoso',
  'Ver localização': 'View location',

  'O que vemos por aqui ganha outra forma.': 'What we see here takes on another form.',
  'A Agô reúne uma seleção de peças em cerâmica artesanal, com referências de Trancoso e de outras expressões brasileiras.': 'Agô brings together a selection of handmade ceramic pieces with references to Trancoso and other Brazilian expressions.',
  'A igreja, as casas e as cores do Quadrado inspiram parte do acervo. Há também objetos para casa, símbolos de fé e outras referências brasileiras.': 'The church, houses and colors of the Quadrado inspire part of the collection. You will also find home objects, symbols of faith and other Brazilian references.',
  'Na loja e no site, você encontra as peças para conhecer, escolher e comprar.': 'At the shop and on the site, you can discover, choose and buy the pieces.',
  'Visitar ou falar com a Agô': 'Visit or talk to Agô',
  'Seleção de peças em cerâmica disponível na Agô Trancoso': 'Selection of ceramic pieces available at Agô Trancoso',

  'Preencha nome, e-mail, WhatsApp e CPF/CNPJ para continuar.': 'Enter your name, email, WhatsApp and CPF/CNPJ to continue.',
  'Complete os dados de entrega para continuar.': 'Complete the delivery details to continue.',
  'Informe um CEP válido com 8 dígitos.': 'Enter a valid 8-digit Brazilian ZIP code.',
  'Complete seus dados antes de finalizar.': 'Complete your details before finishing.',
  'Complete a entrega antes de finalizar.': 'Complete delivery details before finishing.',
  'Confira o código do cupom antes de continuar.': 'Check the coupon code before continuing.',
  'Cupom não encontrado. Confira o código e tente novamente.': 'Coupon not found. Check the code and try again.',
  'Não foi possível validar o benefício agora. Tente novamente.': 'We could not validate the benefit right now. Please try again.',
  'Não foi possível iniciar o pagamento.': 'We could not start the payment.',
  'Não foi possível concluir esta etapa. Tente novamente.': 'We could not complete this step. Please try again.',
};

const patterns: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
  [/^Estimativa da loja: (.+) dias úteis\.?$/, (m) => `Store estimate: ${m[1]} business days`],
  [/^Faltam (.+) para o frete grátis\.$/, (m) => `${m[1]} more for free shipping.`],
  [/^Frete fixo de (.+)\.$/, (m) => `Fixed shipping: ${m[1]}.`],
  [/^Estimativa de entrega: (.+) dias úteis\.?$/, (m) => `Estimated delivery: ${m[1]} business days.`],
  [/^Prazo estimado: (.+) dias úteis\.?$/, (m) => `Estimated delivery: ${m[1]} business days.`],
  [/^Estimativa de entrega: 1 dia útil\.?$/, () => 'Estimated delivery: 1 business day.'],
  [/^Prazo estimado: 1 dia útil\.?$/, () => 'Estimated delivery: 1 business day.'],
  [/^Cupom (.+) aplicado\.$/, (m) => `Coupon ${m[1]} applied.`],
  [/^Cupom (.+) validado: 3% OFF\.$/, (m) => `Coupon ${m[1]} validated: 3% OFF.`],
  [/^(.+) \/ un\.$/, (m) => `${m[1]} / unit`],
  [/^Diminuir quantidade de (.+)$/, (m) => `Decrease quantity of ${m[1]}`],
  [/^Aumentar quantidade de (.+)$/, (m) => `Increase quantity of ${m[1]}`],
  [/^Remover (.+)$/, (m) => `Remove ${m[1]}`],
  [/^Ver (.+)$/, (m) => `View ${m[1]}`],
  [/^Levar (.+) para a sacola$/, (m) => `Add ${m[1]} to bag`],
];

function isEnglish() {
  return window.location.pathname === '/en' || window.location.pathname.startsWith('/en/');
}

function translate(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return value;
  const direct = exact[trimmed];
  if (direct) return value.replace(trimmed, direct);
  for (const [pattern, make] of patterns) {
    const match = trimmed.match(pattern);
    if (match) return value.replace(trimmed, make(match));
  }
  return value;
}

function apply(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    const parent = node.parentElement;
    if (!parent || parent.closest('script, style, noscript, code, pre, [data-no-translate="true"]')) continue;
    const next = translate(node.nodeValue ?? '');
    if (next !== node.nodeValue) node.nodeValue = next;
  }
  const elements = root instanceof Element ? [root, ...Array.from(root.querySelectorAll('*'))] : Array.from(root.querySelectorAll('*'));
  for (const element of elements) {
    if (element.closest('script, style, noscript, code, pre, [data-no-translate="true"]')) continue;
    for (const attr of ['aria-label', 'placeholder', 'title', 'alt']) {
      const current = element.getAttribute(attr);
      if (!current) continue;
      const next = translate(current);
      if (next !== current) element.setAttribute(attr, next);
    }
  }
}

export default function LocaleSupplement() {
  useEffect(() => {
    const routePath = window.location.pathname.replace(/^\/en(?=\/|$)/, '') || '/';
    if (!isEnglish() || routePath === '/checkout' || routePath === '/envio-internacional') return;
    const observer = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node as Text;
          const parent = text.parentElement;
          if (!parent || parent.closest('script, style, noscript, code, pre, [data-no-translate="true"]')) return;
          text.nodeValue = translate(text.nodeValue ?? '');
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          apply(node as Element);
        }
      }));
    });
    const cancelTranslation = afterInitialRender(() => {
      apply(document.body);
      observer.observe(document.body, { childList: true, subtree: true });
    });
    return () => { cancelTranslation(); observer.disconnect(); };
  }, []);
  return null;
}
