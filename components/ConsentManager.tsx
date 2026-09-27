'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readPrivacyConsent, writePrivacyConsent } from '@/lib/privacy-consent';

export default function ConsentManager() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readPrivacyConsent() === null);
  }, []);

  if (!visible) return null;

  return (
    <aside className="ago-consent" role="dialog" aria-modal="false" aria-labelledby="ago-consent-title">
      <div className="ago-consent-copy">
        <strong id="ago-consent-title">Sua privacidade, sem complicação.</strong>
        <p>Usamos dados essenciais para a loja funcionar. Com sua escolha, também podemos medir a experiência e melhorar anúncios e comunicações.</p>
        <Link href="/privacidade">Ver política de privacidade</Link>
      </div>
      <div className="ago-consent-actions">
        <button type="button" className="ago-consent-essential" onClick={() => { writePrivacyConsent('essential'); setVisible(false); }}>Somente essenciais</button>
        <button type="button" className="ago-consent-accept" onClick={() => { writePrivacyConsent('all'); setVisible(false); }}>Aceitar e continuar</button>
      </div>
    </aside>
  );
}
