'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { getEffectivePrice, getProductById } from '@/lib/products';
import { whatsappLink } from '@/lib/config';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

type QuoteForm = {
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  region: string;
  postalCode: string;
  address: string;
  notes: string;
};

const initialForm: QuoteForm = {
  name: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  region: '',
  postalCode: '',
  address: '',
  notes: '',
};

export default function InternationalShippingPage() {
  const { items, hydrated } = useCart();
  const [form, setForm] = useState<QuoteForm>(initialForm);
  const [error, setError] = useState<string | null>(null);

  const lines = useMemo(() => items.flatMap((item) => {
    const product = getProductById(item.productId);
    return product ? [{ item, product }] : [];
  }), [items]);

  const subtotal = lines.reduce((sum, { item, product }) => sum + getEffectivePrice(product) * item.quantity, 0);

  function update(name: keyof QuoteForm, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
    setError(null);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.name.trim().length < 2) return setError('Informe seu nome.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Informe um e-mail válido.');
    if (form.phone.replace(/\D/g, '').length < 7) return setError('Informe seu telefone ou WhatsApp com código do país.');
    if (form.country.trim().length < 2) return setError('Informe o país ou território de destino.');
    if (form.city.trim().length < 2) return setError('Informe a cidade de destino.');
    if (form.address.trim().length < 4) return setError('Informe o endereço de entrega.');

    const products = lines.length
      ? lines.map(({ item, product }) => `• ${item.quantity}x ${product.name} — ${formatBRL(getEffectivePrice(product) * item.quantity)}`).join('\n')
      : '• Ainda não selecionei as peças';

    const message = [
      'Olá! Gostaria de cotar um envio internacional da Agô Trancoso.',
      '',
      `Nome: ${form.name.trim()}`,
      `E-mail: ${form.email.trim()}`,
      `WhatsApp: ${form.phone.trim()}`,
      `País/território: ${form.country.trim()}`,
      `Cidade: ${form.city.trim()}`,
      form.region.trim() ? `Estado/Província/Região: ${form.region.trim()}` : '',
      form.postalCode.trim() ? `Código postal: ${form.postalCode.trim()}` : '',
      `Endereço: ${form.address.trim()}`,
      '',
      'Peças:',
      products,
      lines.length ? `Subtotal dos produtos: ${formatBRL(subtotal)}` : '',
      '',
      form.notes.trim() ? `Observações: ${form.notes.trim()}` : '',
      'Quero confirmar valor, serviço disponível e prazo dos Correios antes do pagamento.',
    ].filter(Boolean).join('\n');

    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
  }

  return (
    <main className="checkout-page">
      <div className="checkout-shell">
        <header className="ago-clean-checkout-head">
          <p className="eyebrow">Do Quadrado para o mundo</p>
          <h1 className="checkout-title">Envio internacional</h1>
          <p>Enviamos peças da Agô para destinos internacionais atendidos pelos Correios. A rede do Exporta Fácil alcança mais de 200 países.</p>
        </header>

        <div className="checkout-layout">
          <form className="checkout-form-panel" onSubmit={submit} noValidate>
            <section className="checkout-stage is-active" aria-labelledby="international-title">
              <div className="checkout-stage-head">
                <div><span>01</span><h2 id="international-title">Destino da encomenda</h2></div>
              </div>
              <div className="checkout-stage-body">
                <div className="checkout-shipping-note">
                  <span><strong>O frete internacional é cotado antes do pagamento.</strong></span>
                  <span>Como as peças são artesanais e têm tamanhos diferentes, confirmamos peso, embalagem, serviço disponível, prazo e restrições do país antes de cobrar o frete.</span>
                </div>

                <div className="checkout-fields-two">
                  <div className="checkout-field">
                    <label htmlFor="intl-name">Nome completo</label>
                    <input id="intl-name" className="checkout-input" autoComplete="name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Seu nome" />
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="intl-email">E-mail</label>
                    <input id="intl-email" className="checkout-input" type="email" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@email.com" />
                  </div>
                </div>

                <div className="checkout-field">
                  <label htmlFor="intl-phone">Telefone / WhatsApp <span>(com código do país)</span></label>
                  <input id="intl-phone" className="checkout-input" autoComplete="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 305 000 0000" />
                </div>

                <div className="checkout-fields-two">
                  <div className="checkout-field">
                    <label htmlFor="intl-country">País ou território</label>
                    <input id="intl-country" className="checkout-input" autoComplete="country-name" value={form.country} onChange={(e) => update('country', e.target.value)} placeholder="Ex.: Portugal" />
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="intl-city">Cidade</label>
                    <input id="intl-city" className="checkout-input" autoComplete="address-level2" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Cidade" />
                  </div>
                </div>

                <div className="checkout-fields-two">
                  <div className="checkout-field">
                    <label htmlFor="intl-region">Estado / Província / Região <span>(se houver)</span></label>
                    <input id="intl-region" className="checkout-input" autoComplete="address-level1" value={form.region} onChange={(e) => update('region', e.target.value)} />
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="intl-postal">Código postal <span>(se houver)</span></label>
                    <input id="intl-postal" className="checkout-input" autoComplete="postal-code" value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} placeholder="Postal code" />
                  </div>
                </div>

                <div className="checkout-field">
                  <label htmlFor="intl-address">Endereço de entrega</label>
                  <input id="intl-address" className="checkout-input" autoComplete="street-address" value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Rua, número, complemento" />
                </div>

                <div className="checkout-field">
                  <label htmlFor="intl-notes">Observações <span>(opcional)</span></label>
                  <textarea id="intl-notes" className="checkout-input" value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Alguma informação importante para a entrega?" rows={4} style={{ minHeight: 112, resize: 'vertical' }} />
                </div>

                {error && <p className="checkout-error" role="alert">{error}</p>}
                <button type="submit" className="checkout-submit">Solicitar cotação internacional</button>
                <p className="checkout-note">Você não paga o frete nesta etapa. Primeiro confirmamos o valor real do envio pelos Correios.</p>
              </div>
            </section>
          </form>

          <aside className="checkout-summary" aria-label="Resumo da cotação internacional">
            <div className="ago-clean-summary-head"><p className="eyebrow">Sua seleção</p><h2>{lines.length ? 'Peças na sacola' : 'Escolha suas peças'}</h2></div>
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
                  <div className="checkout-summary-row"><span>Produtos</span><strong>{formatBRL(subtotal)}</strong></div>
                  <div className="checkout-summary-row"><span>Frete internacional</span><strong>A cotar</strong></div>
                  <p className="checkout-note">Impostos, taxas ou exigências da alfândega de destino podem variar conforme o país.</p>
                </div>
              </>
            ) : (
              <div className="ago-clean-summary-bottom">
                <p>Você pode consultar o destino agora ou adicionar suas peças antes.</p>
                <Link href="/produtos" className="checkout-next-step">Explorar coleção</Link>
              </div>
            )}
          </aside>
        </div>

        <section style={{ marginTop: 28 }} aria-label="Como funciona o envio internacional">
          <div className="checkout-shipping-note">
            <span><strong>Como funciona:</strong> escolha as peças → informe o destino → receba a cotação → confirme o pagamento → enviamos pelos Correios.</span>
            <span>O serviço internacional disponível depende do país, do peso, das dimensões, do conteúdo e das regras aduaneiras do destino.</span>
          </div>
        </section>
      </div>
    </main>
  );
}
