'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FIRST_PURCHASE_COUPON } from '@/lib/coupons';

const STORAGE_SEEN = 'ago_primeira_compra_v3_vista';
const STORAGE_REGISTERED = 'ago_primeira_compra_v3_cadastro';
const STORAGE_COUPON = 'ago_primeira_compra_v3_cupom';
const STORAGE_EMAIL = 'ago_primeira_compra_v3_email';

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function FirstPurchaseOffer() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    if (!pathname || ['/checkout', '/confirmacao', '/termos', '/privacidade'].some((route) => pathname.startsWith(route))) return;

    let active = true;
    let timer: number | undefined;
    let triggered = false;

    const closeListeners = () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
    const showOffer = () => {
      if (!active || triggered) return;
      triggered = true;
      setOpen(true);
      closeListeners();
    };
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && (window.scrollY || 0) / scrollable >= 0.45) showOffer();
    };

    async function prepareOffer() {
      try {
        if (window.localStorage.getItem(STORAGE_SEEN) || window.localStorage.getItem(STORAGE_REGISTERED)) return;
      } catch {}

      try {
        const response = await fetch('/api/first-purchase/eligibility', { method: 'GET', cache: 'no-store' });
        const data = await response.json().catch(() => ({}));
        if (!active || !response.ok || data.available !== true) return;
      } catch {
        return;
      }

      timer = window.setTimeout(showOffer, 12000);
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    void prepareOffer();
    return () => {
      active = false;
      closeListeners();
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key === 'Tab') {
        const controls = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]') ?? [],
        ).filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActive?.isConnected) previousActive.focus({ preventScroll: true });
    };
  }, [open]);

  function close() {
    setOpen(false);
    try { window.localStorage.setItem(STORAGE_SEEN, '1'); } catch {}
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!consent || submitting) return;
    setError(null);

    if (!validEmail(email)) {
      setError('Informe um e-mail válido.');
      return;
    }

    setSubmitting(true);
    try {
      window.localStorage.setItem(STORAGE_REGISTERED, '1');
      window.localStorage.setItem(STORAGE_COUPON, FIRST_PURCHASE_COUPON);
      window.localStorage.setItem(STORAGE_EMAIL, email.trim().toLowerCase());
      setSubmitted(true);
    } catch {
      setError('Não foi possível salvar o benefício neste navegador. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  async function copyCoupon() {
    try {
      await navigator.clipboard.writeText(FIRST_PURCHASE_COUPON);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  if (!open) return null;

  return (
    <div className="first-purchase-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section ref={dialogRef} className="first-purchase-modal" role="dialog" aria-modal="true" aria-labelledby="first-purchase-title">
        <button ref={closeButtonRef} type="button" className="first-purchase-close" onClick={close} aria-label="Fechar oferta de primeira compra">×</button>
        {!submitted ? (
          <div className="first-purchase-layout">
            <div className="first-purchase-brand-panel">
              <p className="eyebrow">Primeira compra</p>
              <h2 id="first-purchase-title">Um pequeno presente para começar.</h2>
              <p className="first-purchase-lead">3% OFF na sua primeira compra.</p>
              <div className="first-purchase-discount-badge" aria-label="3% de desconto na primeira compra"><strong>3%</strong><span>OFF</span></div>
              <p className="first-purchase-soft-note">A elegibilidade é confirmada no checkout pelo e-mail e telefone.</p>
            </div>
            <form className="first-purchase-form" onSubmit={submit}>
              <div className="first-purchase-field">
                <label htmlFor="first-purchase-email">Seu e-mail</label>
                <input id="first-purchase-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="voce@email.com" />
              </div>
              <label className="first-purchase-consent">
                <input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} />
                <span>Li e aceito os <a href="/termos" target="_blank" rel="noreferrer">Termos de Uso</a> e a <a href="/privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a>.</span>
              </label>
              {error && <p className="first-purchase-error" role="alert">{error}</p>}
              <button type="submit" disabled={submitting} className="first-purchase-submit">{submitting ? 'Salvando…' : 'Quero meu desconto'}</button>
              <small>O código fica salvo neste navegador. A validação final acontece antes do pagamento.</small>
            </form>
          </div>
        ) : (
          <div className="first-purchase-success">
            <p className="eyebrow">Pronto</p>
            <h2 id="first-purchase-title">Seu código ficou salvo neste navegador.</h2>
            <p>No checkout, informe o mesmo e-mail e seu telefone para confirmar se o benefício está disponível.</p>
            <button type="button" className="first-purchase-coupon" onClick={copyCoupon} aria-label={`Copiar cupom ${FIRST_PURCHASE_COUPON}`}><strong>{FIRST_PURCHASE_COUPON}</strong><span>{copied ? 'Copiado' : 'Copiar'}</span></button>
            <button type="button" className="first-purchase-continue" onClick={close}>Continuar vendo</button>
          </div>
        )}
      </section>
    </div>
  );
}
