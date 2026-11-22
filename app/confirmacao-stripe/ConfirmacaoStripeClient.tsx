'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useSiteEnglish } from '@/lib/use-site-english';
import { trackPurchase, type MarketingItem } from '@/lib/marketing-analytics';
import { readPrivacyConsent } from '@/lib/privacy-consent';

type Verification = {
  paid: boolean;
  status: string;
  paymentStatus: string;
  orderId: string;
  currency: string;
  value: number;
  shipping: number;
  items: MarketingItem[];
};

type Status = 'checking' | 'paid' | 'processing' | 'error';

export default function ConfirmacaoStripeClient() {
  const params = useSearchParams();
  const sessionId = String(params.get('session_id') || '').trim();
  const english = useSiteEnglish();
  const { clearCart } = useCart();
  const handled = useRef(false);
  const [status, setStatus] = useState<Status>('checking');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (!sessionId || handled.current) {
      if (!sessionId) setStatus('error');
      return;
    }

    let active = true;
    fetch('/api/stripe-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, analyticsConsent: readPrivacyConsent() === 'all' }),
      cache: 'no-store',
    })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Verification failed');
        return data as Verification;
      })
      .then(result => {
        if (!active) return;
        setOrderId(result.orderId || '');
        if (result.paid && result.orderId && result.value > 0) {
          handled.current = true;
          trackPurchase({
            transactionId: result.orderId,
            value: result.value,
            shipping: result.shipping,
            items: result.items,
            currency: result.currency,
          });
          clearCart();
          setStatus('paid');
          return;
        }
        setStatus(result.status === 'complete' ? 'processing' : 'error');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => { active = false; };
  }, [sessionId, clearCart]);

  const text = {
    checking: {
      title: english ? 'Confirming your payment…' : 'Confirmando seu pagamento…',
      body: english ? 'We are securely checking the payment with Stripe.' : 'Estamos conferindo o pagamento com segurança diretamente na Stripe.',
    },
    paid: {
      title: english ? 'Payment confirmed.' : 'Pagamento confirmado.',
      body: english ? 'Your international order has been paid successfully. Keep your order number for future reference.' : 'Seu pedido internacional foi pago com sucesso. Guarde o número do pedido para qualquer consulta.',
    },
    processing: {
      title: english ? 'Payment is processing.' : 'Pagamento em processamento.',
      body: english ? 'Stripe has received your checkout, but the payment is not confirmed yet. Do not pay again.' : 'A Stripe recebeu seu checkout, mas o pagamento ainda não foi confirmado. Não faça outro pagamento.',
    },
    error: {
      title: english ? 'We could not confirm the payment yet.' : 'Ainda não foi possível confirmar o pagamento.',
      body: english ? 'Your bag was not cleared. Check the payment status before trying again.' : 'Sua sacola não foi apagada. Confira o status do pagamento antes de tentar novamente.',
    },
  }[status];

  return (
    <div className="confirmation-experience">
      <section className="confirmation-hero" aria-labelledby="stripe-confirmation-title">
        <div className="confirmation-hero-glow" aria-hidden="true" />
        <div className="site-container confirmation-hero-grid">
          <div className="confirmation-copy">
            <p className="eyebrow">Agô Trancoso · Stripe</p>
            <h1 id="stripe-confirmation-title">{text.title}</h1>
            <p>{text.body}</p>
            {orderId && <p className="confirmation-order">{english ? 'Order' : 'Pedido'} <strong>{orderId}</strong></p>}
            <div className="confirmation-actions">
              <Link href={english ? '/en/produtos' : '/produtos'} className="button button-dark">
                {english ? 'Continue shopping' : 'Continuar pela coleção'}
              </Link>
              {status !== 'paid' && (
                <Link href={english ? '/en/envio-internacional' : '/envio-internacional'} className="text-link">
                  {english ? 'Back to international shipping' : 'Voltar ao envio internacional'}
                </Link>
              )}
            </div>
          </div>
          <aside className="confirmation-place" aria-label="Agô Trancoso, Bahia, Brazil">
            <span>Trancoso</span>
            <strong>Bahia</strong>
            <small>Brasil</small>
          </aside>
        </div>
      </section>
    </div>
  );
}
