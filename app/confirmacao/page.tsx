import { Suspense } from 'react';
import ConfirmacaoClient from './ConfirmacaoClient';

export const metadata = {
  title: 'Pedido confirmado | Agô Trancoso',
};

export default function ConfirmacaoPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmacaoClient />
    </Suspense>
  );
}
