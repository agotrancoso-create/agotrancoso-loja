'use client';

import { OPEN_CONSENT_EVENT } from '@/lib/privacy-consent';
import { useSiteEnglish } from '@/lib/use-site-english';

/** A visible way to review or change an earlier cookie choice without deleting site data. */
export default function PrivacyPreferencesButton() {
  const english = useSiteEnglish();
  return (
    <button
      type="button"
      className="ago-footer-privacy-preferences"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      style={{ padding: 0, border: 0, background: 'transparent', color: 'inherit', font: 'inherit', textDecoration: 'underline', textUnderlineOffset: '3px', cursor: 'pointer' }}
    >
      {english ? 'Cookie preferences' : 'Preferências de cookies'}
    </button>
  );
}
