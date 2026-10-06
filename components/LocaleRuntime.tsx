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

export default function LocaleRuntime() {
  const [locale, setLocale] = useState<Locale>('pt');
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  useEffect(() => {
    const resolved: Locale = window.location.pathname === '/en' || window.location.pathname.startsWith('/en/') ? 'en' : localeFromCookie();
    setLocale(resolved);
    document.documentElement.lang = resolved === 'en' ? 'en' : 'pt-BR';
    document.documentElement.dataset.locale = resolved;


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
    const cancelTranslation = afterInitialRender(() => {
      if (resolved === 'en') translateNode(document.body);
      observer.observe(document.body, { childList: true, subtree: true });
      rewriteLinks();
      linkObserver.observe(document.body, { childList: true, subtree: true });
    });

    setPortalTarget(document.querySelector('.header-actions'));
    return () => {
      cancelTranslation();
      observer.disconnect();
      linkObserver.disconnect();
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
