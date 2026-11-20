'use client';

import Link from 'next/link';
import { useSiteEnglish } from '@/lib/use-site-english';
import { whatsappLink } from '@/lib/config';
import { FIXED_SHIPPING_PRICE, FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';

export default function ShoppingHelp() {
  const english = useSiteEnglish();
  const t = (pt: string, en: string) => english ? en : pt;
  const href = (path: string) => `${english ? '/en' : ''}${path}`;
  const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return <div className="legal-page shopping-help" data-no-translate="true"><div className="legal-shell legal-content">
    <p className="eyebrow">Agô Trancoso</p>
    <h1>{t('Ajuda com sua compra', 'Help with your purchase')}</h1>
    <p className="legal-lead">{t('Informações para escolher sua peça e falar com a gente antes ou depois da compra.', 'Information to help you choose your piece and contact us before or after your purchase.')}</p>
    <nav className="help-topics" aria-label={t('Nesta página', 'On this page')}>
      <a href="#entrega">{t('Entrega', 'Delivery')}</a><a href="#pagamento">{t('Pagamento', 'Payment')}</a><a href="#pecas">{t('Sobre as peças', 'About the pieces')}</a><a href="#trocas">{t('Trocas e avarias', 'Returns and damage')}</a>
    </nav>
    <section id="entrega"><h2>{t('Entrega e prazo de postagem', 'Delivery and dispatch time')}</h2>
      <p>{t(`No Brasil, o frete PAC é fixo em ${money(FIXED_SHIPPING_PRICE)}. A partir de ${money(FREE_SHIPPING_THRESHOLD)} em produtos, antes de cupons, o frete é grátis.`, `Within Brazil, PAC shipping is fixed at ${money(FIXED_SHIPPING_PRICE)}. Shipping is free on products totalling ${money(FREE_SHIPPING_THRESHOLD)} or more, before coupons.`)}</p>
      <p>{t('Consulte a estimativa de transporte pelo CEP na página da peça. Esse período é contado após a postagem. Para confirmar quando sua peça poderá ser enviada, fale com a Agô antes de comprar.', 'Check the estimated transit time using your Brazilian postal code on the product page. Transit time starts after dispatch. Contact Agô before purchasing to confirm when your piece can be shipped.')}</p>
      <a className="text-link" href={whatsappLink(t('Olá! Gostaria de confirmar o prazo de postagem de uma peça.', 'Hello! I would like to confirm the dispatch time for a piece.'))} target="_blank" rel="noopener noreferrer">{t('Consultar prazo de postagem', 'Ask about dispatch time')}</a>
      <p><Link href={href('/envio-internacional')}>{t('Para entregas no exterior, consulte o envio internacional.', 'For deliveries abroad, request an international shipping quote.')}</Link></p>
    </section>
    <section id="pagamento"><h2>{t('Pagamento e primeira compra', 'Payment and first purchase')}</h2>
      <p>{t('Você compra sem criar uma conta. Depois de revisar os dados, a entrega e o total, segue para a InfinitePay para escolher entre as formas de pagamento disponíveis e concluir a compra.', 'No account is required. After reviewing your details, delivery and total, continue to InfinitePay to choose an available payment method and complete your purchase.')}</p>
      <p>{t('Quando disponível, o benefício de 3% na primeira compra pode ser aplicado na etapa Pagamento. A elegibilidade é verificada com o e-mail e o telefone informados. Confira o desconto no total antes de pagar.', 'When available, the 3% first-purchase benefit can be applied at the Payment step. Eligibility is checked using the email and phone number provided. Check the discount in your total before paying.')}</p>
    </section>
    <section id="pecas"><h2>{t('Peças escolhidas pela Agô', 'Pieces selected by Agô')}</h2>
      <p>{t('A Agô é uma loja de artesanato e decoração no Quadrado de Trancoso. Reunimos e selecionamos peças; a localização da loja não indica o local de fabricação de cada produto.', 'Agô is an arts and decor shop in the Quadrado of Trancoso. We curate and select pieces; our shop location does not indicate where each product was made.')}</p>
      <p>{t('Confira as fotos, medidas e indicação de uso na página do produto. Para detalhes de autoria, procedência, acabamento ou cuidados de uma peça específica, consulte a gente.', 'Check the photos, dimensions and intended use on the product page. Contact us for details about a particular piece’s maker, origin, finish or care.')}</p>
      <a className="text-link" href={whatsappLink(t('Olá! Gostaria de saber mais sobre a procedência e os cuidados de uma peça.', 'Hello! I would like to know more about the origin and care of a piece.'))} target="_blank" rel="noopener noreferrer">{t('Tirar dúvidas sobre uma peça', 'Ask about a piece')}</a>
    </section>
    <section id="trocas"><h2>{t('Atendimento sobre trocas, devoluções e avarias', 'Help with returns, exchanges and damage')}</h2>
      <p><Link href={href('/devolucoes')}>{t('Política de devolução: prazo, custos e como solicitar', 'Return policy: deadline, costs and how to request a return')}</Link></p>
      <p>{t('Para solicitar uma troca, devolução ou informar um problema com o pedido, entre em contato com a Agô pelo WhatsApp. Informe o número do pedido e descreva o que aconteceu.', 'To request an exchange or return, or report a problem with your order, contact Agô on WhatsApp. Include your order number and describe what happened.')}</p>
      <p>{t('Se a peça chegou danificada, fotos da peça e da embalagem ajudam a entender o ocorrido. Guarde a embalagem enquanto conversa com o atendimento.', 'If your piece arrived damaged, photos of the piece and packaging help us understand what happened. Keep the packaging while you contact support.')}</p>
      <a className="text-link" href={whatsappLink(t('Olá! Preciso de atendimento sobre troca, devolução ou avaria em um pedido.', 'Hello! I need help with an exchange, return or damaged order.'))} target="_blank" rel="noopener noreferrer">{t('Falar sobre meu pedido', 'Get help with my order')}</a>
    </section>
    <p><Link href={href('/contato')}>{t('Todos os canais de atendimento', 'All contact options')}</Link> · <Link href={href('/termos')}>{t('Termos de uso', 'Terms of use')}</Link></p>
  </div></div>;
}
