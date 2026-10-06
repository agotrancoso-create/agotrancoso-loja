'use client';

import Link from 'next/link';
import { useSiteEnglish } from '@/lib/use-site-english';
import { useCart } from '@/context/CartContext';

export default function ResumeCart() {
  const english = useSiteEnglish();
  const { hydrated, totalItems, openDrawer, international } = useCart();
  if (!hydrated || !totalItems) return null;
  return <aside className="resume-cart site-container" data-no-translate="true" aria-label={english ? 'Continue your purchase' : 'Continuar sua compra'}>
    <div><strong>{english ? 'Your selection is still here.' : 'Sua seleção continua aqui.'}</strong><p>{english ? `${totalItems} ${totalItems === 1 ? 'piece' : 'pieces'} in your bag. Review the totals and continue whenever you like.` : `${totalItems} ${totalItems === 1 ? 'peça na sacola' : 'peças na sacola'}. Revise os valores e continue quando quiser.`}</p></div>
    <div className="resume-cart-actions"><button type="button" onClick={openDrawer}>{english ? 'Review bag' : 'Rever sacola'}</button><Link href={`${english ? '/en' : ''}${international ? '/envio-internacional' : '/checkout'}`}>{english ? 'Continue to checkout ↗' : 'Continuar compra ↗'}</Link></div>
  </aside>;
}
