'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { INSTAGRAM_URL, whatsappLink } from '@/lib/config';
import { trackPurchase, type MarketingItem } from '@/lib/marketing-analytics';

type PaymentStatus = 'checking' | 'confirmed' | 'unconfirmed' | 'unavailable' | 'missing';

function StatusMark({ status }: { status: PaymentStatus }) {
  const confirmed = status === 'confirmed';
  const checking = status === 'checking';
  return (
    <div className={`confirmation-status-mark${confirmed ? ' is-confirmed' : checking ? ' is-checking' : ''}`} aria-hidden="true">
      {confirmed ? (
        <svg viewBox="0 0 24 24"><path d="m6.5 12.2 3.4 3.4 7.7-8" /></svg>
      ) : checking ? (
        <span />
      ) : (
        <svg viewBox="0 0 24 24"><path d="M12 7.5v5.2M12 16.2h.01" /></svg>
      )}
    </div>
  );
}

export default function ConfirmacaoClient() {
  const params = useSearchParams();
  const orderId = params.get('order_nsu') || params.get('pedido') || '';
  const expectedOrderId = params.get('pedido') || '';
  const returnedOrderId = params.get('order_nsu') || '';
  const transactionNsu = params.get('transaction_nsu') || '';
  const slug = params.get('slug') || '';
  const [status, setStatus] = useState<PaymentStatus>('checking');
  const { clearCart, hydrated } = useCart();
  const processedOrderRef = useRef('');

  useEffect(() => {
    if (!hydrated) return;
    if (!orderId || !transactionNsu || !slug || (expectedOrderId && returnedOrderId && expectedOrderId !== returnedOrderId)) {
      setStatus('missing');
      return;
    }
    if (processedOrderRef.current === orderId) return;

    let active = true;
    fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNsu: orderId, transactionNsu, slug }),
      cache: 'no-store',
    }).then(async response => {
      if (!response.ok) throw new Error('Verification unavailable');
      return response.json();
    }).then(result => {
      if (!active) return;
      if (result.confirmed === true) {
        processedOrderRef.current = orderId;

        const purchase = result.purchase ?? {};
        const verifiedTransactionId = String(purchase.transactionId || '').trim();
        const verifiedValue = Number(purchase.value);
        const verifiedCurrency = String(purchase.currency || '');

        if (
          verifiedTransactionId === orderId &&
          verifiedCurrency === 'BRL' &&
          Number.isFinite(verifiedValue) &&
          verifiedValue > 0
        ) {
          const serverItems: MarketingItem[] = Array.isArray(purchase.items)
            ? purchase.items.flatMap((item: Partial<MarketingItem>) => {
              const itemId = String(item?.item_id || '').trim();
              const itemName = String(item?.item_name || '').trim();
              const price = Number(item?.price);
              const quantity = Number(item?.quantity);
              if (!itemId || !itemName || !Number.isFinite(price) || price <= 0 || !Number.isInteger(quantity) || quantity < 1) return [];
              return [{
                item_id: itemId,
                item_name: itemName,
                price,
                quantity,
                ...(item.item_category ? { item_category: String(item.item_category) } : {}),
              }];
            })
            : [];

          const shipping = typeof purchase.shipping === 'number' && Number.isFinite(purchase.shipping) && purchase.shipping >= 0 ? purchase.shipping : undefined;
          const coupon = String(purchase.coupon || '').trim();

          trackPurchase({
            transactionId: verifiedTransactionId,
            value: verifiedValue,
            ...(serverItems.length ? { items: serverItems } : {}),
            ...(shipping != null ? { shipping } : {}),
            ...(coupon ? { coupon } : {}),
          });
        }

        clearCart();
        setStatus('confirmed');
      } else setStatus('unconfirmed');
    }).catch(() => { if (active) setStatus('unavailable'); });

    return () => { active = false; };
  }, [orderId, expectedOrderId, returnedOrderId, transactionNsu, slug, clearCart, hydrated]);

  const confirmed = status === 'confirmed';
  const checking = status === 'checking';

  const title = confirmed
    ? 'Pagamento confirmado.'
    : checking
      ? 'Confirmando seu pagamento…'
      : 'Vamos conferir seu pagamento.';

  const body = confirmed
    ? 'A InfinitePay confirmou o pagamento. Guarde o número do pedido e, se precisar falar com a Agô, ele ajuda a localizar sua compra.'
    : checking
      ? 'Estamos consultando a InfinitePay. Esta página será atualizada assim que a confirmação chegar.'
      : status === 'unconfirmed'
        ? 'Ainda não recebemos a confirmação. Sua seleção continua na sacola. Consulte o status antes de tentar pagar novamente.'
        : 'Não foi possível confirmar o pagamento por aqui. Sua seleção continua na sacola; consulte a InfinitePay ou fale com a Agô antes de tentar pagar de novo.';

  return (
    <div className="confirmation-experience">
      <section className="confirmation-hero" aria-labelledby="confirmation-title">
        <div className="confirmation-hero-glow" aria-hidden="true" />
        <div className="site-container confirmation-hero-grid">
          <div className="confirmation-copy">
            <p className="eyebrow">Agô Trancoso · pagamento</p>
            <StatusMark status={status} />
            <h1 id="confirmation-title">{title}</h1>
            <p>{body}</p>
            {orderId && <p className="confirmation-order">Pedido <strong>{orderId}</strong></p>}
            <div className="confirmation-actions">
              <Link href={confirmed ? '/produtos' : '/checkout'} className="button button-dark">{confirmed ? 'Continuar pela coleção' : 'Voltar ao pedido'}</Link>
              <a href={whatsappLink(`Olá! Vim pelo site da Agô Trancoso e gostaria de consultar meu pedido${orderId ? ` ${orderId}` : ''}.`)} target="_blank" rel="noreferrer" className="text-link">Falar no WhatsApp <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <aside className="confirmation-place" aria-label="Agô Trancoso, Bahia, Brasil">
            <span>Trancoso</span>
            <strong>Bahia</strong>
            <small>Brasil</small>
          </aside>
        </div>
      </section>

      {confirmed && (
        <section className="confirmation-next" aria-labelledby="confirmation-next-title">
          <div className="site-container">
            <div className="confirmation-next-head">
              <div><p className="eyebrow">Depois da compra</p><h2 id="confirmation-next-title">Sua experiência com a Agô continua.</h2></div>
              <p>O pagamento já foi confirmado. Para qualquer dúvida sobre este pedido, use o número acima ao falar com a gente.</p>
            </div>
            <div className="confirmation-next-grid">
              <div><span>01</span><strong>Guarde o pedido</strong><p>O número identifica esta compra quando você entrar em contato com a Agô.</p></div>
              <div><span>02</span><strong>Fale com a gente</strong><p>Se precisar tirar alguma dúvida, o WhatsApp continua disponível.</p></div>
              <div><span>03</span><strong>Continue por Trancoso</strong><p>Você pode voltar à coleção ou acompanhar a Agô pelo Instagram.</p></div>
            </div>
            <div className="confirmation-secondary-actions">
              <Link href="/produtos" className="ago-premium-text-link">Explorar outras peças <span aria-hidden="true">↗</span></Link>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="ago-premium-text-link">Abrir Instagram <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
