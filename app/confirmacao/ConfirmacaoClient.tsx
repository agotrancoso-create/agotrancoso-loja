'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { whatsappLink } from '@/lib/config';

export default function ConfirmacaoClient({ orderId }: { orderId?: string }) {
  const { clearCart } = useCart();
  useEffect(() => { clearCart(); }, [clearCart]);
  return <div className="max-w-content mx-auto px-5 md:px-8 py-24 text-center">
    <p className="eyebrow mb-4">Agô Trancoso</p>
    <h1 className="font-serif text-4xl text-marrom">Pedido encaminhado</h1>
    <p className="max-w-xl mx-auto mt-5 text-marrom/70 leading-7">Seu pedido foi encaminhado para a InfinitePay. A aprovação do pagamento é confirmada pela própria plataforma.</p>
    {orderId && <p className="mt-5 text-xs uppercase tracking-[.16em] text-oliva">Pedido {orderId}</p>}
    <div className="mt-9 flex flex-wrap justify-center gap-3">
      <Link href="/produtos" className="bg-marrom text-areia px-6 py-3 text-[11px] uppercase tracking-[.16em] hover:bg-terracota">Voltar à coleção</Link>
      <a href={whatsappLink('Olá, vim pelo site da Agô Trancoso e gostaria de consultar meu pedido.')} target="_blank" rel="noreferrer" className="border border-marrom/20 px-6 py-3 text-[11px] uppercase tracking-[.16em] hover:border-terracota hover:text-terracota">Falar no WhatsApp</a>
    </div>
  </div>;
}
