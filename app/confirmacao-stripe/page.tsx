import { Suspense } from 'react';
import ConfirmacaoStripeClient from './ConfirmacaoStripeClient';

export default function StripeConfirmationPage() {
  return (
    <Suspense fallback={<div className="checkout-page checkout-loading"><div className="checkout-shell"><p>Confirmando pagamento…</p></div></div>}>
      <ConfirmacaoStripeClient />
    </Suspense>
  );
}
