'use client';

import { useSiteEnglish } from '@/lib/use-site-english';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readPrivacyConsent, writePrivacyConsent } from '@/lib/privacy-consent';

export default function ConsentManager() {
  const english = useSiteEnglish();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readPrivacyConsent() === null);
  }, []);

  if (!visible) return null;

  return (
    <aside data-no-translate="true" className="ago-consent" role="dialog" aria-modal="false" aria-labelledby="ago-consent-title">
      <div className="ago-consent-copy">
        <strong id="ago-consent-title">{english ? "Your privacy, made simple." : "Sua privacidade, sem complicação."}</strong>
        <p>{english ? "We use essential data to run the shop. With your permission, we can also measure your experience and improve advertising and communications." : "Usamos dados essenciais para a loja funcionar. Com sua escolha, também podemos medir a experiência e melhorar anúncios e comunicações."}</p>
        <Link href={english ? "/en/privacidade" : "/privacidade"}>{english ? "View privacy policy" : "Ver política de privacidade"}</Link>
      </div>
      <div className="ago-consent-actions">
        <button type="button" className="ago-consent-essential" onClick={() => { writePrivacyConsent('essential'); setVisible(false); }}>{english ? "Essential only" : "Somente essenciais"}</button>
        <button type="button" className="ago-consent-accept" onClick={() => { writePrivacyConsent('all'); setVisible(false); }}>{english ? "Accept and continue" : "Aceitar e continuar"}</button>
      </div>
    </aside>
  );
}
