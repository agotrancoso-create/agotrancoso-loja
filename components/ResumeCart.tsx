'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function ResumeCart() {
  const { hydrated, totalItems, openDrawer } = useCart();
  if (!hydrated || !totalItems) return null;
  return <aside className="resume-cart site-container" aria-label="Continuar sua compra">
    <div><strong>Sua seleção continua aqui.</strong><p>{totalItems} {totalItems === 1 ? 'peça na sacola' : 'peças na sacola'}. Revise os valores e continue quando quiser.</p></div>
    <div className="resume-cart-actions"><button type="button" onClick={openDrawer}>Rever sacola</button><Link href="/checkout">Continuar compra ↗</Link></div>
  </aside>;
}
