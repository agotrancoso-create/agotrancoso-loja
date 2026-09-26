import type { Metadata } from 'next';
import { Suspense } from 'react';
import ConfirmacaoClient from './ConfirmacaoClient';

export const metadata: Metadata = {
  title: 'Retorno do pagamento',
  alternates: { canonical: '/confirmacao' },
  robots: { index: false, follow: false },
};

export default function ConfirmacaoPage() {
  return (
    <Suspense fallback={<div className="section-space"><div className="site-container"><p role="status">Carregando o retorno do pagamento…</p></div></div>}>
      <ConfirmacaoClient />
    </Suspense>
  );
}
