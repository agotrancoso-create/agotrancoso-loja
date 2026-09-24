'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FIRST_PURCHASE_COUPON } from '@/lib/coupons';

const STORAGE_SEEN = 'ago_primeira_compra_v2_vista';
const STORAGE_REGISTERED = 'ago_primeira_compra_v2_cadastro';
const STORAGE_COUPON = 'ago_primeira_compra_v2_cupom';

type FormState = { name: string; email: string; phone: string; consent: boolean };

export default function FirstPurchaseOffer() {
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', consent: false });

  useEffect(() => {
    if (!pathname || ['/checkout', '/confirmacao', '/termos', '/privacidade'].some((route) => pathname.startsWith(route))) return;
    try {
      if (window.localStorage.getItem(STORAGE_SEEN) || window.localStorage.getItem(STORAGE_REGISTERED)) return;
    } catch {}

    const timer = window.setTimeout(() => setOpen(true), 5200);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        try { window.localStorage.setItem(STORAGE_SEEN, '1'); } catch {}
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousActive?.focus();
    };
  }, [open]);

  function close() {
    setOpen(false);
    try { window.localStorage.setItem(STORAGE_SEEN, '1'); } catch {}
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.consent) return;

    try {
      window.localStorage.setItem(STORAGE_REGISTERED, '1');
      window.localStorage.setItem(STORAGE_COUPON, FIRST_PURCHASE_COUPON);
    } catch {}

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, source: 'primeira-compra' }),
        keepalive: true,
      });
    } catch {}

    setSubmitted(true);
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
      <section className="first-purchase-modal" role="dialog" aria-modal="true" aria-labelledby="first-purchase-title">
        <button ref={closeButtonRef} type="button" className="first-purchase-close" onClick={close} aria-label="Fechar oferta de primeira compra">×</button>

        {!submitted ? (
          <div className="first-purchase-layout">
            <div className="first-purchase-brand-panel">
              <div className="first-purchase-discount-badge" aria-label="3% de desconto na primeira compra">
                <strong>3%</strong>
                <span>OFF</span>
              </div>
              <p className="eyebrow">Primeira vez por aqui?</p>
              <h2 id="first-purchase-title">Seu primeiro pedido tem 3% OFF.</h2>
              <p>Cadastre seu contato e receba o cupom de boas-vindas da Agô.</p>
              <div className="first-purchase-promise">
                <span>3% de desconto</span>
                <span>Novidades da Agô</span>
                <span>Peças novas em primeira mão</span>
              </div>
            </div>

            <form className="first-purchase-form" onSubmit={submit}>
              <div className="first-purchase-field">
                <label htmlFor="first-purchase-name">Nome</label>
                <input id="first-purchase-name" required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} autoComplete="name" />
              </div>
              <div className="first-purchase-field">
                <label htmlFor="first-purchase-email">E-mail</label>
                <input id="first-purchase-email" required type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} autoComplete="email" />
              </div>
              <div className="first-purchase-field">
                <label htmlFor="first-purchase-phone">Celular</label>
                <input id="first-purchase-phone" required inputMode="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} autoComplete="tel" placeholder="(00) 00000-0000" />
              </div>
              <label className="first-purchase-consent">
                <input type="checkbox" required checked={form.consent} onChange={(event) => setForm((current) => ({ ...current, consent: event.target.checked }))} />
                <span>Declaro que li e aceito os <a href="/termos" target="_blank" rel="noreferrer">Termos de Uso</a> e a <a href="/privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a>.</span>
              </label>
              <button type="submit" className="first-purchase-submit">Receber desconto</button>
              <small>Usaremos seus dados para enviar novidades da Agô e disponibilizar o benefício.</small>
            </form>
          </div>
        ) : (
          <div className="first-purchase-success">
            <p className="eyebrow">Pronto</p>
            <h2 id="first-purchase-title">Seu cupom está aqui.</h2>
            <p>Use o código abaixo no checkout para receber 3% OFF na primeira compra.</p>
            <button type="button" className="first-purchase-coupon" onClick={copyCoupon} aria-label={`Copiar cupom ${FIRST_PURCHASE_COUPON}`}>
              <strong>{FIRST_PURCHASE_COUPON}</strong>
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
            <button type="button" className="first-purchase-continue" onClick={close}>Continuar no site</button>
          </div>
        )}
      </section>
    </div>
  );
}
