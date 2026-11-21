'use client';

import { useSiteEnglish } from '@/lib/use-site-english';
import { cartEnglish } from '@/lib/cart-copy';
import { internationalEnglish } from '@/lib/international-copy';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { getEffectivePrice, getProductById } from '@/lib/products';
import { whatsappLink } from '@/lib/config';
import { getParcelMeasurements } from '@/lib/catalog-measurements';
import { INTERNATIONAL_COUNTRIES, getInternationalCountry } from '@/lib/international-countries';
import { trackAddPaymentInfo, trackContact, type MarketingItem } from '@/lib/marketing-analytics';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

type QuoteForm = {
  name: string;
  email: string;
  countryCode: string;
  city: string;
  region: string;
  postalCode: string;
  notes: string;
};

type ShippingOption = {
  serviceCode: string;
  name: string;
  carrier: string;
  price: number;
  deadlineDays: number | null;
};

type QuoteResponse = {
  configured?: boolean;
  available?: boolean;
  stripeConfigured?: boolean;
  options?: ShippingOption[];
  missingMeasurementProducts?: string[];
  reason?: 'invalid_destination' | 'invalid_cart' | 'manual_quote_required';
};

const initialForm: QuoteForm = {
  name: '',
  email: '',
  countryCode: '',
  city: '',
  region: '',
  postalCode: '',
  notes: '',
};

export default function InternationalShippingPage() {
  const english = useSiteEnglish();
  const t = (text: string) => english ? (internationalEnglish[text] ?? cartEnglish[text] ?? text) : text;
  const { items, hydrated, setInternational } = useCart();
  useEffect(() => { setInternational(true); }, [setInternational]);

  const [form, setForm] = useState<QuoteForm>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [selectedServiceCode, setSelectedServiceCode] = useState('');
  const [quoting, setQuoting] = useState(false);
  const [paying, setPaying] = useState(false);

  const lines = useMemo(() => items.flatMap((item) => {
    const product = getProductById(item.productId);
    return product ? [{ item, product }] : [];
  }), [items]);

  const marketingItems = useMemo<MarketingItem[]>(() => lines.map(({ item, product }) => ({
    item_id: product.id,
    item_name: product.name,
    price: getEffectivePrice(product),
    quantity: item.quantity,
    item_category: product.category,
  })), [lines]);

  const subtotal = lines.reduce((sum, { item, product }) => sum + getEffectivePrice(product) * item.quantity, 0);
  const selectedOption = quote?.options?.find(option => option.serviceCode === selectedServiceCode) ?? quote?.options?.[0];
  const grandTotal = subtotal + (selectedOption?.price || 0);
  const country = getInternationalCountry(form.countryCode);

  function update(name: keyof QuoteForm, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
    setError(null);
    setQuote(null);
    setSelectedServiceCode('');
  }

  function manualQuoteUrl() {
    const txt = (pt: string, en: string) => english ? en : pt;
    const products = lines.length
      ? lines.map(({ item, product }) => `• ${item.quantity} × ${product.name} — ${formatBRL(getEffectivePrice(product) * item.quantity)}`).join('\n')
      : txt('Ainda não selecionei as peças.', 'I have not selected any pieces yet.');
    const singleBox = lines.length === 1 && lines[0].item.quantity === 1 ? getParcelMeasurements(lines[0].product.id) : undefined;
    const destination = [
      form.city.trim(),
      form.region.trim(),
      form.postalCode.trim(),
      country ? (english ? country.en : country.pt) : '',
    ].filter(Boolean).join(', ');
    const message = [
      txt('Olá! Gostaria de cotar o envio internacional da Agô Trancoso.', 'Hello! I would like an international shipping quote from Agô Trancoso.'),
      form.name.trim() ? `${txt('Nome', 'Name')}: ${form.name.trim()}` : '',
      form.email.trim() ? `E-mail: ${form.email.trim()}` : '',
      destination,
      products,
      lines.length ? `${txt('Subtotal das peças', 'Product subtotal')}: ${formatBRL(subtotal)}` : '',
      singleBox ? `${txt('Embalagem de uma unidade', 'Single-item parcel')}: ${singleBox.lengthCm} × ${singleBox.widthCm} × ${singleBox.heightCm} cm · ${singleBox.grossWeightG} g` : '',
      form.notes.trim(),
      txt('Qual é o valor do frete e o prazo para esse destino?', 'What are the shipping cost and estimated delivery time for this destination?'),
    ].filter(Boolean).join('\n');
    return whatsappLink(message);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setQuote(null);

    if (!lines.length) return setError(english ? 'Add at least one piece to your bag before calculating shipping.' : 'Adicione pelo menos uma peça à sacola antes de calcular o frete.');
    if (!country) return setError(english ? 'Choose the destination country.' : 'Escolha o país de destino.');
    if (form.city.trim().length < 2) return setError(english ? 'Enter the destination city.' : 'Informe a cidade de destino.');
    if (form.postalCode.trim().length < 2) return setError(english ? 'Enter the destination postal code to calculate shipping automatically.' : 'Informe o código postal do destino para calcular o frete automaticamente.');

    setQuoting(true);
    try {
      const response = await fetch('/api/frete-internacional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          countryCode: form.countryCode,
          postalCode: form.postalCode,
        }),
      });
      const data = (await response.json()) as QuoteResponse;
      setQuote(data);
      if (data.available && data.options?.length) {
        setSelectedServiceCode(data.options[0].serviceCode);
        trackContact('international_shipping_quote_auto');
      } else {
        trackContact('international_shipping_quote_manual_needed');
      }
    } catch {
      setQuote({ available: false, reason: 'manual_correios_quote' });
    } finally {
      setQuoting(false);
    }
  }

  async function startPayment() {
    if (!selectedOption || !quote?.stripeConfigured) return;
    setPaying(true);
    setError(null);
    trackAddPaymentInfo(marketingItems, grandTotal, 'Stripe');

    try {
      const response = await fetch('/api/create-stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          countryCode: form.countryCode,
          postalCode: form.postalCode,
          serviceCode: selectedOption.serviceCode,
          email: form.email,
          english,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.checkoutUrl) throw new Error(data.error || (english ? 'Could not start payment.' : 'Não foi possível iniciar o pagamento.'));
      window.location.assign(data.checkoutUrl);
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : (english ? 'Could not start payment.' : 'Não foi possível iniciar o pagamento.'));
      setPaying(false);
    }
  }

  const quoteFailureMessage = quote && !quote.available
    ? quote.reason === 'manual_quote_required'
      ? (english ? 'This order includes a large item or exceeds the safe automatic-shipping range. We confirm the real Correios price before payment so you are not overcharged.' : 'Este pedido inclui uma peça grande ou ultrapassa a faixa segura do frete automático. Confirmamos o valor real dos Correios antes do pagamento para não cobrar a mais.')
      : (english ? 'This destination or cart could not be validated for international shipping.' : 'Não foi possível validar este destino ou pedido para envio internacional.')
    : null;

  return (
    <section data-no-translate="true" className="checkout-page" aria-labelledby="international-page-title">
      <div className="checkout-shell">
        <header className="ago-clean-checkout-head">
          <p className="eyebrow">{t('Do Quadrado para o mundo · From Trancoso to the world')}</p>
          <h1 id="international-page-title" className="checkout-title">{t('Envio internacional · International shipping')}</h1>
          <p>{english ? 'Choose your pieces and destination. Your fixed international shipping rate appears before payment, so you can complete the order online.' : 'Escolha suas peças e o destino. O frete internacional fixo aparece antes do pagamento para você concluir a compra online.'}</p>
        </header>

        <div className="checkout-layout">
          <form className="checkout-form-panel" onSubmit={submit} noValidate>
            <section className="checkout-stage is-active" aria-labelledby="international-title">
              <div className="checkout-stage-head">
                <div><span>01</span><h2 id="international-title">{t('Destino · Destination')}</h2></div>
              </div>
              <div className="checkout-stage-body">
                <div className="checkout-shipping-note">
                  <span><strong>{english ? 'International shipping from Trancoso with a fixed rate by destination region and estimated packed-weight band.' : 'Envio internacional a partir de Trancoso com tarifa fixa por região e faixa estimada de peso embalado.'}</strong></span>
                  <span>{english ? 'The rate is shown before payment and is designed for orders up to 2 kg. Large or bulky orders are quoted manually. Customs duties or destination taxes are not included.' : 'O valor aparece antes do pagamento e foi desenhado para pedidos de até 2 kg. Pedidos grandes ou volumosos passam por cotação manual. Tributos e taxas de importação do destino não estão incluídos.'}</span>
                  <span>{english ? 'No Brazilian CPF/CNPJ is required from the buyer for this quote request.' : 'O comprador não precisa ter CPF/CNPJ brasileiro para solicitar a cotação.'}</span>
                </div>

                <div className="checkout-fields-two">
                  <div className="checkout-field">
                    <label htmlFor="intl-name">{english ? 'Name (optional)' : 'Nome (opcional)'}</label>
                    <input id="intl-name" className="checkout-input" autoComplete="name" value={form.name} onChange={(e) => update('name', e.target.value)} />
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="intl-email">E-mail <span>{english ? '(optional, to prefill Stripe)' : '(opcional, para preencher a Stripe)'}</span></label>
                    <input id="intl-email" className="checkout-input" type="email" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
                  </div>
                </div>

                <div className="checkout-fields-two">
                  <div className="checkout-field">
                    <label htmlFor="intl-country">{t('País ou território · Country or territory')}</label>
                    <select id="intl-country" required className="checkout-input" autoComplete="country" value={form.countryCode} onChange={(e) => update('countryCode', e.target.value)}>
                      <option value="">{english ? 'Select a country' : 'Selecione um país'}</option>
                      {INTERNATIONAL_COUNTRIES.map((item) => <option key={item.code} value={item.code}>{english ? item.en : item.pt}</option>)}
                    </select>
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="intl-city">{t('Cidade · City')}</label>
                    <input id="intl-city" required className="checkout-input" autoComplete="address-level2" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder={t('Cidade / City')} />
                  </div>
                </div>

                <div className="checkout-fields-two">
                  <div className="checkout-field">
                    <label htmlFor="intl-region">{english ? 'State / Province / Region' : 'Estado / Província / Região'} <span>{english ? '(if applicable)' : '(se houver)'}</span></label>
                    <input id="intl-region" className="checkout-input" autoComplete="address-level1" value={form.region} onChange={(e) => update('region', e.target.value)} />
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="intl-postal">{english ? 'Postal code' : 'Código postal'}</label>
                    <input id="intl-postal" required className="checkout-input" autoComplete="postal-code" value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} placeholder="Postal code" />
                  </div>
                </div>

                <div className="checkout-field">
                  <label htmlFor="intl-notes">{english ? 'Delivery notes' : 'Observações de entrega'} <span>{english ? '(optional)' : '(opcional)'}</span></label>
                  <textarea id="intl-notes" className="checkout-input" value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={3} style={{ minHeight: 96, resize: 'vertical' }} />
                </div>

                {error && <p className="checkout-error" role="alert">{error}</p>}
                <button type="submit" className="checkout-submit" disabled={quoting}>{quoting ? (english ? 'Preparing quote…' : 'Preparando cotação…') : (english ? 'Calculate international shipping' : 'Calcular frete internacional')}</button>

                {quote?.available && quote.options?.length ? (
                  <div className="checkout-shipping-note" style={{ marginTop: 18 }}>
                    <span><strong>{english ? 'Available shipping options' : 'Opções de frete disponíveis'}</strong></span>
                    {quote.options.map(option => (
                      <label key={option.serviceCode} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                        <input type="radio" name="international-shipping-option" checked={selectedServiceCode === option.serviceCode} onChange={() => setSelectedServiceCode(option.serviceCode)} />
                        <span>
                          <strong>{option.carrier} · {option.name}</strong><br />
                          {formatBRL(option.price)}{option.deadlineDays ? ` · ${option.deadlineDays} ${english ? 'business days' : 'dias úteis'}` : ''}
                        </span>
                      </label>
                    ))}

                    {quote.stripeConfigured ? (
                      <button type="button" className="checkout-submit" onClick={startPayment} disabled={paying || !selectedOption}>
                        {paying ? (english ? 'Opening secure checkout…' : 'Abrindo checkout seguro…') : (english ? 'Pay securely with Stripe' : 'Pagar com segurança pela Stripe')}
                      </button>
                    ) : (
                      <p className="checkout-note">{english ? 'Secure international payment is being activated. Your shipping rate is ready; payment will open here as soon as the live Stripe account is connected.' : 'O pagamento internacional está em ativação. Seu frete já está calculado; o pagamento será liberado aqui assim que a conta Stripe de produção estiver conectada.'}</p>
                    )}
                  </div>
                ) : quoteFailureMessage ? (
                  <div className="checkout-shipping-note" style={{ marginTop: 18 }}>
                    <span><strong>{quoteFailureMessage}</strong></span>
                    
                  </div>
                ) : null}

                <a className="checkout-next-step" target="_blank" rel="noopener noreferrer" href={manualQuoteUrl()} onClick={() => trackContact('international_shipping_quote_whatsapp')}>
                  {english ? 'Need help with this international order?' : 'Precisa de ajuda com este pedido internacional?'}
                </a>
                <p className="checkout-note">{english ? 'The international shipping amount shown is the store’s fixed regional rate. Import duties, taxes or customs requirements may still be charged by destination authorities.' : 'O valor exibido é a tarifa fixa de envio internacional da loja para a região. Tributos, impostos ou exigências aduaneiras ainda podem ser cobrados pelas autoridades do país de destino.'}</p>
              </div>
            </section>
          </form>

          <aside className="checkout-summary" aria-label={english ? 'International order summary' : 'Resumo do pedido internacional'}>
            <div className="ago-clean-summary-head"><p className="eyebrow">{english ? 'Your selection' : 'Sua seleção'}</p><h2>{lines.length ? (english ? 'Pieces in your bag' : 'Peças na sacola') : (english ? 'Choose your pieces' : 'Escolha suas peças')}</h2></div>
            {hydrated && lines.length ? (
              <>
                <div className="checkout-summary-items">
                  {lines.map(({ item, product }) => (
                    <div key={item.productId} className="checkout-summary-item">
                      <div className="checkout-product-main"><div><span className="checkout-product-name">{product.name}</span><span className="checkout-product-price">{item.quantity} × {formatBRL(getEffectivePrice(product))}</span></div></div>
                      <span className="checkout-line-total">{formatBRL(getEffectivePrice(product) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="ago-clean-summary-bottom">
                  <div className="checkout-summary-row"><span>{english ? 'Products' : 'Produtos'}</span><strong>{formatBRL(subtotal)}</strong></div>
                  <div className="checkout-summary-row"><span>{english ? 'International shipping' : 'Frete internacional'}</span><strong>{selectedOption ? formatBRL(selectedOption.price) : (english ? 'To calculate' : 'A calcular')}</strong></div>
                  {selectedOption && <div className="checkout-summary-row checkout-summary-total"><span>Total</span><strong>{formatBRL(grandTotal)}</strong></div>}
                  <p className="checkout-note">{english ? 'Stripe can show eligible buyers a localized currency at checkout through Adaptive Pricing. The catalog price remains based in BRL.' : 'A Stripe pode mostrar a compradores elegíveis a moeda local no checkout por meio do Adaptive Pricing. O preço-base do catálogo continua em BRL.'}</p>
                </div>
              </>
            ) : (
              <div className="ago-clean-summary-bottom">
                <p>{english ? 'Add your pieces before calculating shipping.' : 'Adicione suas peças antes de calcular o frete.'}</p>
                <Link href={english ? '/en/produtos' : '/produtos'} className="checkout-next-step">{english ? 'Shop the collection' : 'Explorar coleção'}</Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
