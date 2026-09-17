import type { Metadata } from 'next';
import { Suspense } from 'react';
import ConfirmacaoClient from './ConfirmacaoClient';

export const metadata: Metadata = {
  title: 'Pedido confirmado',
  robots: { index: false, follow: false },
};

export default function ConfirmacaoPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmacaoClient />
    </Suspense>
  );
}
