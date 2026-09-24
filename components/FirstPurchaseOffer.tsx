'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FIRST_PURCHASE_COUPON } from '@/lib/coupons';

const STORAGE_SEEN = 'ago_primeira_compra_v3_vista';
const STORAGE_REGISTERED = 'ago_primeira_compra_v3_cadastro';
const STORAGE_COUPON = 'ago_primeira_compra_v3_cupom';

export default function FirstPurchaseOffer() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    if (!pathname || ['/checkout', '/confirmacao', '/termos', '/privacidade'].some((route) => pathname.startsWith(route))) return;
    try { if (window.localStorage.getItem(STORAGE_SEEN) || window.localStorage.getItem(STORAGE_REGISTERED)) return; } catch {}

    let triggered = false;
    const showOffer = () => {
      if (triggered) return;
      triggered = true;
      setOpen(true);
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(timer);
    };
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && (window.scrollY || 0) / scrollable >= 0.45) showOffer();
    };
    const timer = window.setTimeout(showOffer, 12000);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { window.clearTimeout(timer); window.removeEventListener('scroll', handleScroll); };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { close(); return; }
      if (event.key === 'Tab') {
        const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]') ?? []).filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
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
    if (!consent) return;
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'primeira-compra' }),
        keepalive: true,
      });
      if (!response.ok) return;
    } catch { return; }

    try {
      window.localStorage.setItem(STORAGE_REGISTERED, '1');
      window.localStorage.setItem(STORAGE_COUPON, FIRST_PURCHASE_COUPON);
    } catch {}
    setSubmitted(true);
  }

  async function copyCoupon() {
    try {
      await navigator.clipboard.writeText(FIRST_PURCHASE_COUPON);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch { setCopied(false); }
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
              <p className="first-purchase-soft-note">Escolha sua peça com calma. O benefício fica com você.</p>
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
              <button type="submit" className="first-purchase-submit">Quero meu desconto</button>
              <small>Sem excesso de mensagens. Você pode sair da lista quando quiser.</small>
            </form>
          </div>
        ) : (
          <div className="first-purchase-success">
            <p className="eyebrow">Pronto</p>
            <h2 id="first-purchase-title">Seu benefício está guardado.</h2>
            <p>Use o código abaixo no checkout para receber 3% OFF na primeira compra.</p>
            <button type="button" className="first-purchase-coupon" onClick={copyCoupon} aria-label={`Copiar cupom ${FIRST_PURCHASE_COUPON}`}><strong>{FIRST_PURCHASE_COUPON}</strong><span>{copied ? 'Copiado' : 'Copiar'}</span></button>
            <button type="button" className="first-purchase-continue" onClick={close}>Continuar vendo</button>
          </div>
        )}
      </section>
    </div>
  );
}
