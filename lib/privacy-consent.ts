'use client';

export const CONSENT_STORAGE_KEY = 'ago_privacy_consent_v1';
export const CONSENT_EVENT = 'ago:privacy-consent';
export type PrivacyConsent = 'all' | 'essential';

export function readPrivacyConsent(): PrivacyConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === 'all' || value === 'essential' ? value : null;
  } catch {
    return null;
  }
}

export function writePrivacyConsent(value: PrivacyConsent) {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(CONSENT_STORAGE_KEY, value); } catch {}
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
