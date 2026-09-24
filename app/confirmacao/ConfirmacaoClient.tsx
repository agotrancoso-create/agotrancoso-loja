'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { whatsappLink } from '@/lib/config';

export default function ConfirmacaoClient({ orderId }: { orderId?: string }) {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="section-space">
      <div className="site-container">
        <div className="legal-content">
          <p className="eyebrow">Agô Trancoso · pagamento</p>
          <h1 className="display-title">Pedido encaminhado.</h1>
          <p className="legal-lead">Seu pedido foi encaminhado para a InfinitePay. A aprovação do pagamento é confirmada pela própria plataforma.</p>
          {orderId && <p className="legal-updated">Pedido {orderId}</p>}
          <div className="home-hero-actions">
            <Link href="/produtos" className="button button-dark">Voltar à coleção</Link>
            <a href={whatsappLink('Olá, vim pelo site da Agô Trancoso e gostaria de consultar meu pedido.')} target="_blank" rel="noreferrer" className="text-link">Falar no WhatsApp <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>
    </div>
  );
}
