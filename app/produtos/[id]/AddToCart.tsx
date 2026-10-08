'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/types';
import { trackAddToCart } from '@/lib/marketing-analytics';
import { useSiteEnglish } from '@/lib/use-site-english';
import { cartEnglish } from '@/lib/cart-copy';
import CartIcon from '@/components/CartIcon';
import { getEffectivePrice } from '@/lib/products';
import { getShippingPrice } from '@/lib/shipping';
import { whatsappLink } from '@/lib/config';

type ShippingOption = {
  name: string;
  price: number;
  deadline: number | string | null;
  serviceId: string;
  serviceName?: string | null;
  estimated?: boolean;
};

type ShippingQuote = {
  available: boolean;
  freeShipping?: boolean;
  options?: ShippingOption[];
  provider?: string;
  destinationCep?: string;
  error?: string;
};

export default function AddToCart({ product }: { product: Product }) {
  const english = useSiteEnglish();
  const name = english ? (cartEnglish[product.name] || product.name) : product.name;
  const t = (pt: string, en: string) => english ? en : pt;
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [cep, setCep] = useState('');
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [quoteError, setQuoteError] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [cepInvalid, setCepInvalid] = useState(false);
  const activeRequest = useRef<AbortController | null>(null);
  const { addItem, international } = useCart();

  const clearQuote = useCallback(() => {
    activeRequest.current?.abort();
    activeRequest.current = null;
    setQuoteLoading(false);
    setQuote(null);
    setQuoteError('');
    setCepInvalid(false);
  }, []);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1800);
    return () => window.clearTimeout(timer);
  }, [added]);

  useEffect(() => {
    clearQuote();
    return () => {
      activeRequest.current?.abort();
      activeRequest.current = null;
    };
  }, [product.id, clearQuote]);

  if (!product.available) {
    return <div className="product-unavailable">{t('Peça indisponível no momento', 'This piece is currently unavailable')}</div>;
  }

  const selectionSubtotal = getEffectivePrice(product) * quantity;
  const shipping = getShippingPrice(selectionSubtotal);
  const formatBRL = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  async function consultShipping(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearQuote();
    const normalizedCep = cep.replace(/\D/g, '');
    if (normalizedCep.length !== 8 || /^(\d)\1{7}$/.test(normalizedCep)) {
      setCepInvalid(true);
      setQuote(null);
      setQuoteError('Informe um CEP válido com 8 dígitos.');
      return;
    }

    const controller = new AbortController();
    activeRequest.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    setQuoteLoading(true);
    setQuoteError('');
    setQuote(null);

    try {
      const response = await fetch('/api/frete', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: normalizedCep, items: [{ productId: product.id, quantity }] }),
      });
      const data = (await response.json()) as ShippingQuote;
      if (activeRequest.current !== controller) return;
      if (!response.ok || !data.available || !data.options?.length) {
        throw new Error(data.error || 'Não foi possível consultar o envio agora.');
      }
      setQuote(data);
    } catch (error) {
      if (activeRequest.current !== controller) return;
      setQuoteError(controller.signal.aborted
        ? 'A consulta demorou mais que o esperado. Tente novamente.'
        : error instanceof Error ? error.message : 'Não foi possível consultar o envio agora.');
    } finally {
      window.clearTimeout(timeout);
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setQuoteLoading(false);
      }
    }
  }

  const quotedOption = quote?.options?.[0];
  const hasDeadline = quotedOption?.deadline !== null && quotedOption?.deadline !== undefined && quotedOption?.deadline !== '';
  const deadlineText = hasDeadline ? String(quotedOption?.deadline) : '';
  const deadlineUnit = /^1$/.test(deadlineText) ? t('dia útil', 'business day') : t('dias úteis', 'business days');

  return (
    <div className="purchase-selection" data-no-translate="true">
      <div className="add-to-cart-control">
        <div className="quantity-control" aria-label={t('Quantidade', 'Quantity')}>
          <button type="button" onClick={() => { clearQuote(); setQuantity((q) => Math.max(1, q - 1)); }} disabled={quantity <= 1} aria-label={t('Diminuir quantidade', 'Decrease quantity')}>−</button>
          <span aria-live="polite">{quantity}</span>
          <button type="button" onClick={() => { clearQuote(); setQuantity((q) => Math.min(99, q + 1)); }} disabled={quantity >= 99} aria-label={t('Aumentar quantidade', 'Increase quantity')}>+</button>
        </div>
        <button
          type="button"
          onClick={() => {
            addItem(product.id, quantity);
            trackAddToCart({ item_id: product.id, item_name: product.name, price: product.promotionalPrice ?? product.price, quantity, item_category: product.category });
            setAdded(true);
          }}
          className={`product-primary-cta ago-bag-primary${added ? ' is-added' : ''}`}
          aria-live="polite"
          aria-label={english ? (added ? `${name} is in your bag` : `Add to bag: ${quantity} ${quantity === 1 ? 'unit' : 'units'} of ${name}`) : added ? `${product.name} está na sacola` : `Adicionar à sacola: ${quantity} ${quantity === 1 ? 'unidade' : 'unidades'} de ${product.name}`}
        >
          <span className="ago-bag-primary-icon"><CartIcon size={21} withPlus={!added} /></span>
          <span>{added ? t('Na sacola', 'In your bag') : t('Adicionar à sacola', 'Add to bag')}</span>
        </button>
      </div>

      {international ? <div className="purchase-selection-summary" aria-live="polite" aria-atomic="true">
        <strong>{t('Total das peças', 'Products total')}: {formatBRL(selectionSubtotal)}</strong>
        <span>{t('Frete internacional sob consulta', 'International shipping quoted separately')}</span>
        <small>{t('Frete e total final confirmados antes do pagamento.', 'Shipping and final total confirmed before payment.')}</small>
      </div> : <div className="purchase-selection-summary" aria-live="polite" aria-atomic="true">
        <span>{quantity} {english ? (quantity === 1 ? 'piece' : 'pieces') : (quantity === 1 ? 'peça' : 'peças')}: {formatBRL(selectionSubtotal)} · {shipping === 0 ? t('Frete grátis', 'Free shipping in Brazil') : `${t('Frete PAC', 'PAC shipping in Brazil')}: ${formatBRL(shipping)}`}</span>
        <strong>{t('Esta seleção com frete', 'This selection with shipping')}: {formatBRL(selectionSubtotal + shipping)}</strong>
        <small>{t('Entrega no Brasil. O total da sacola é atualizado ao adicionar outras peças.', 'Delivery in Brazil. Your bag total updates as you add other pieces.')}</small>
      </div>}

      <p className="purchase-selection-help">{t('Compra sem cadastro · Pagamento seguro pela InfinitePay', 'No account required · Secure payment via InfinitePay')}</p>

      {international ? <a className="text-link" href={english ? '/en/envio-internacional' : '/envio-internacional'}>{t('Consultar frete internacional', 'Request international shipping quote')}</a> : <form className="product-delivery-estimator" onSubmit={consultShipping} aria-label={t('Consultar envio pelo CEP', 'Check delivery to a Brazilian postal code')}>
        <label htmlFor={`shipping-cep-${product.id}`}>{t('Frete e prazo estimado para seu CEP', 'Shipping and estimated delivery time for your Brazilian postal code')}</label>
        <div className="product-delivery-estimator-row">
          <input
            id={`shipping-cep-${product.id}`}
            name="cep"
            aria-invalid={cepInvalid || undefined}
            aria-describedby={quoteError ? `shipping-error-${product.id}` : undefined}
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="00000-000"
            maxLength={9}
            value={cep}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, '').slice(0, 8);
              setCep(digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits);
              clearQuote();
            }}
          />
          <button type="submit" disabled={quoteLoading}>{quoteLoading ? t('Consultando…', 'Checking…') : t('Consultar', 'Check shipping')}</button>
        </div>

        <div className="product-delivery-result" aria-live="polite">
          {quoteError && (
            <div>
              <p id={`shipping-error-${product.id}`} className="product-delivery-error">{english ? (cepInvalid ? 'Enter a valid 8-digit Brazilian postal code.' : 'Shipping could not be checked right now. Please try again or contact Agô.') : quoteError}</p>
              {!cepInvalid && <a href={whatsappLink(english ? `Hello! I would like to confirm shipping for ${name} to Brazilian postal code ${cep}.` : `Olá! Gostaria de confirmar o envio de ${product.name} para o CEP ${cep}.`)} target="_blank" rel="noopener noreferrer">{t('Consultar envio com a Agô', 'Ask Agô about shipping')}</a>}
            </div>
          )}
          {quotedOption && (
            <div>
              <strong>{quotedOption.price === 0 ? t('Frete grátis', 'Free shipping') : `${t('Frete PAC', 'PAC shipping')} ${formatBRL(quotedOption.price)}`}</strong>
              {hasDeadline && <span>{`${quotedOption.estimated ? t('Estimativa da loja', 'Store estimate') : t('Prazo estimado', 'Estimated delivery')}: ${deadlineText} ${deadlineUnit}`}</span>}
              {hasDeadline && quotedOption.estimated && <small>{t('Faixa indicativa após a postagem, não consultada nos Correios. Confirme o prazo antes de comprar.', 'Indicative range after dispatch, not confirmed by Correios. Confirm delivery time before purchasing.')}</small>}
              {!hasDeadline && <small>{t('O prazo dos Correios está indisponível agora. ', 'Correios delivery times are currently unavailable. ')}<a href={whatsappLink(english ? `Hello! I would like to confirm Correios delivery times for ${name}, Brazilian postal code ${cep}.` : `Olá! Gostaria de confirmar o prazo dos Correios para ${product.name}, CEP ${cep}.`)} target="_blank" rel="noopener noreferrer">{t('Confirmar prazo com a Agô', 'Confirm delivery time with Agô')}</a></small>}
            </div>
          )}
        </div>
      </form>}
    </div>
  );
}
