'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { whatsappLink } from '@/lib/config';

type PaymentStatus = 'checking' | 'confirmed' | 'unconfirmed' | 'unavailable' | 'missing';

export default function ConfirmacaoClient() {
  const params = useSearchParams();
  const orderId = params.get('order_nsu') || params.get('pedido') || '';
  const expectedOrderId = params.get('pedido') || '';
  const returnedOrderId = params.get('order_nsu') || '';
  const transactionNsu = params.get('transaction_nsu') || '';
  const slug = params.get('slug') || '';
  const [status, setStatus] = useState<PaymentStatus>('checking');
  const { clearCart, hydrated } = useCart();

  useEffect(() => {
    if (!hydrated) return;
    if (!orderId || !transactionNsu || !slug || (expectedOrderId && returnedOrderId && expectedOrderId !== returnedOrderId)) {
      setStatus('missing');
      return;
    }

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
        clearCart();
        setStatus('confirmed');
      } else setStatus('unconfirmed');
    }).catch(() => { if (active) setStatus('unavailable'); });

    return () => { active = false; };
  }, [orderId, expectedOrderId, returnedOrderId, transactionNsu, slug, clearCart, hydrated]);

  const confirmed = status === 'confirmed';

  return (
    <div className="section-space">
      <div className="site-container">
        <div className="legal-content">
          <p className="eyebrow">Agô Trancoso · pagamento</p>
          <h1 className="display-title">{confirmed ? 'Pagamento confirmado.' : status === 'checking' ? 'Confirmando seu pagamento…' : 'Vamos conferir seu pagamento.'}</h1>
          <p className="legal-lead">{confirmed
            ? 'A InfinitePay confirmou o pagamento. Obrigada pela compra!'
            : status === 'checking'
              ? 'Estamos consultando a InfinitePay. Aguarde um instante.'
              : status === 'unconfirmed'
                ? 'Ainda não recebemos a confirmação. Sua seleção continua na sacola. Consulte o status antes de tentar pagar novamente.'
                : 'Não foi possível confirmar o pagamento por aqui. Sua seleção continua na sacola; consulte a InfinitePay ou fale com a Agô antes de tentar pagar de novo.'}</p>
          {orderId && <p className="legal-updated">Pedido {orderId}</p>}
          <div className="home-hero-actions">
            <Link href={confirmed ? '/produtos' : '/checkout'} className="button button-dark">{confirmed ? 'Voltar à coleção' : 'Voltar ao pedido'}</Link>
            <a href={whatsappLink(`Olá! Vim pelo site da Agô Trancoso e gostaria de consultar meu pedido${orderId ? ` ${orderId}` : ''}.`)} target="_blank" rel="noreferrer" className="text-link">Falar no WhatsApp <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>
    </div>
  );
}
