'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/types';
import { trackAddToCart } from '@/lib/marketing-analytics';
import CartIcon from '@/components/CartIcon';
import { getEffectivePrice } from '@/lib/products';
import { getShippingPrice } from '@/lib/shipping';
import { whatsappLink } from '@/lib/config';

type ShippingOption = {
  name: string;
  price: number;
  deadline: number | string | null;
  serviceId: string;
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
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [cep, setCep] = useState('');
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [quoteError, setQuoteError] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1800);
    return () => window.clearTimeout(timer);
  }, [added]);

  useEffect(() => {
    setQuote(null);
    setQuoteError('');
  }, [quantity]);

  if (!product.available) {
    return <div className="product-unavailable">Peça indisponível no momento</div>;
  }

  const selectionSubtotal = getEffectivePrice(product) * quantity;
  const shipping = getShippingPrice(selectionSubtotal);
  const formatBRL = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  async function consultShipping(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCep = cep.replace(/\D/g, '').slice(0, 8);
    if (normalizedCep.length !== 8) {
      setQuote(null);
      setQuoteError('Informe um CEP válido com 8 dígitos.');
      return;
    }

    setQuoteLoading(true);
    setQuoteError('');
    setQuote(null);

    try {
      const response = await fetch('/api/frete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: normalizedCep, items: [{ productId: product.id, quantity }] }),
      });
      const data = (await response.json()) as ShippingQuote;
      if (!response.ok || !data.available) {
        throw new Error(data.error || 'Não foi possível consultar o envio agora.');
      }
      setQuote(data);
    } catch (error) {
      setQuoteError(error instanceof Error ? error.message : 'Não foi possível consultar o envio agora.');
    } finally {
      setQuoteLoading(false);
    }
  }

  const quotedOption = quote?.options?.[0];
  const hasOnlineDeadline = quotedOption?.deadline !== null && quotedOption?.deadline !== undefined && quotedOption?.deadline !== '';

  return (
    <div className="purchase-selection">
      <div className="add-to-cart-control">
        <div className="quantity-control" aria-label="Quantidade">
          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade">−</button>
          <span aria-live="polite">{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => Math.min(99, q + 1))} disabled={quantity >= 99} aria-label="Aumentar quantidade">+</button>
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
          aria-label={added ? `${product.name} está na sacola` : `Adicionar à sacola: ${quantity} ${quantity === 1 ? 'unidade' : 'unidades'} de ${product.name}`}
        >
          <span className="ago-bag-primary-icon"><CartIcon size={21} withPlus={!added} /></span>
          <span>{added ? 'Na sacola' : 'Adicionar à sacola'}</span>
        </button>
      </div>

      <div className="purchase-selection-summary" aria-live="polite" aria-atomic="true">
        <span>{quantity} {quantity === 1 ? 'peça' : 'peças'}: {formatBRL(selectionSubtotal)} · {shipping === 0 ? 'Frete grátis' : `Frete: ${formatBRL(shipping)}`}</span>
        <strong>Esta seleção com frete: {formatBRL(selectionSubtotal + shipping)}</strong>
        <small>Entrega no Brasil. O total da sacola é atualizado ao adicionar outras peças.</small>
      </div>

      <p className="purchase-selection-help">Compra sem cadastro · Pagamento seguro pela InfinitePay</p>

      <form className="product-delivery-estimator" onSubmit={consultShipping} aria-label="Consultar envio pelo CEP">
        <label htmlFor={`shipping-cep-${product.id}`}>Frete e prazo para seu CEP</label>
        <div className="product-delivery-estimator-row">
          <input
            id={`shipping-cep-${product.id}`}
            name="cep"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="00000-000"
            maxLength={9}
            value={cep}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, '').slice(0, 8);
              setCep(digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits);
              setQuote(null);
              setQuoteError('');
            }}
          />
          <button type="submit" disabled={quoteLoading}>{quoteLoading ? 'Consultando…' : 'Consultar'}</button>
        </div>

        <div className="product-delivery-result" aria-live="polite">
          {quoteError && <p className="product-delivery-error">{quoteError}</p>}
          {quotedOption && (
            <div>
              <strong>{quotedOption.price === 0 ? 'Frete grátis' : `Frete ${formatBRL(quotedOption.price)}`}</strong>
              {hasOnlineDeadline ? (
                <span>Prazo estimado: {quotedOption.deadline} {typeof quotedOption.deadline === 'number' ? 'dias úteis' : ''}</span>
              ) : (
                <>
                  <span>Prazo online ainda não disponível para este CEP.</span>
                  <a href={whatsappLink(`Olá! Gostaria de confirmar o prazo de postagem e entrega de ${product.name}. Meu CEP é ${quote?.destinationCep || cep}.`)} target="_blank" rel="noopener noreferrer">Confirmar prazo com a Agô</a>
                </>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
