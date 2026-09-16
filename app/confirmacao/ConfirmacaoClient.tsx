'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { whatsappLink } from '@/lib/config';

export default function ConfirmacaoClient({ orderId }: { orderId?: string }) {
  const { clearCart } = useCart();
  useEffect(() => { clearCart(); }, [clearCart]);
  return (
    <div className="confirmation-page bg-areia">
      <div className="max-w-content mx-auto px-5 md:px-8 py-24 md:py-32 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="eyebrow mb-5">Agô Trancoso · pagamento</p>
          <h1 className="text-5xl md:text-7xl leading-none">Pedido encaminhado</h1>
          <p className="max-w-xl mx-auto mt-6 text-marrom/70 leading-7">Seu pedido foi encaminhado para a InfinitePay. A aprovação do pagamento é confirmada pela própria plataforma.</p>
          {orderId && <p className="mt-6 text-xs uppercase tracking-[.16em] text-oliva">Pedido {orderId}</p>}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/produtos" className="bg-marrom text-areia px-7 py-4 text-[10px] uppercase tracking-[.16em] font-bold rounded-sm hover:bg-terracota">Voltar à coleção</Link>
            <a href={whatsappLink('Olá, vim pelo site da Agô Trancoso e gostaria de consultar meu pedido.')} target="_blank" rel="noreferrer" className="border border-marrom/20 px-7 py-4 text-[10px] uppercase tracking-[.16em] rounded-sm hover:border-terracota hover:text-terracota">Falar no WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}
