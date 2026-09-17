'use client';

import { FormEvent, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FIRST_PURCHASE_COUPON } from '@/lib/coupons';

const STORAGE_SEEN = 'ago_primeira_compra_v2_vista';
const STORAGE_REGISTERED = 'ago_primeira_compra_v2_cadastro';
const STORAGE_COUPON = 'ago_primeira_compra_v2_cupom';

type FormState = { name: string; email: string; phone: string; consent: boolean };

export default function FirstPurchaseOffer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', consent: false });

  useEffect(() => {
    if (!pathname || ['/checkout', '/confirmacao', '/termos', '/privacidade'].some((route) => pathname.startsWith(route))) return;
    try {
      if (window.localStorage.getItem(STORAGE_SEEN) || window.localStorage.getItem(STORAGE_REGISTERED)) return;
    } catch {
      // continua sem persistência quando o navegador bloqueia localStorage
    }

    const timer = window.setTimeout(() => setOpen(true), 5200);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  function close() {
    setOpen(false);
    try { window.localStorage.setItem(STORAGE_SEEN, '1'); } catch {}
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
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
    } catch {
      // O cupom continua disponível mesmo sem resposta da captura do lead.
    }

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
    <div className="first-purchase-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <section className="first-purchase-modal" role="dialog" aria-modal="true" aria-labelledby="first-purchase-title">
        <button type="button" className="first-purchase-close" onClick={close} aria-label="Fechar oferta de primeira compra">×</button>

        {!submitted ? (
          <div className="first-purchase-layout">
            <div className="first-purchase-brand-panel">
              <p className="eyebrow">Primeira vez por aqui?</p>
              <h2 id="first-purchase-title">Ganhe 3% OFF na 1ª compra.</h2>
              <p>Cadastre-se para receber novidades da Agô e usar seu cupom de boas-vindas na primeira compra.</p>
              <div className="first-purchase-promise">
                <span>3% de desconto</span>
                <span>Novidades e lançamentos</span>
                <span>Promoções da Agô</span>
              </div>
            </div>

            <form className="first-purchase-form" onSubmit={submit}>
              <div className="first-purchase-field">
                <label htmlFor="first-purchase-name">Nome</label>
                <input id="first-purchase-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} autoComplete="name" />
              </div>
              <div className="first-purchase-field">
                <label htmlFor="first-purchase-email">E-mail</label>
                <input id="first-purchase-email" required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} autoComplete="email" />
              </div>
              <div className="first-purchase-field">
                <label htmlFor="first-purchase-phone">Celular</label>
                <input id="first-purchase-phone" required inputMode="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} autoComplete="tel" placeholder="(00) 00000-0000" />
              </div>
              <label className="first-purchase-consent">
                <input type="checkbox" required checked={form.consent} onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))} />
                <span>Declaro que li e aceito os <a href="/termos" target="_blank" rel="noreferrer">Termos de Uso</a> e a <a href="/privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a>.</span>
              </label>
              <button type="submit" className="first-purchase-submit">cadastrar</button>
              <small>O cadastro é usado para comunicar novidades da Agô e disponibilizar o benefício da primeira compra.</small>
            </form>
          </div>
        ) : (
          <div className="first-purchase-success">
            <p className="eyebrow">Pronto</p>
            <h2>Seu desconto está reservado.</h2>
            <p>Use o cupom abaixo no checkout para receber 3% OFF na primeira compra.</p>
            <button type="button" className="first-purchase-coupon" onClick={copyCoupon} aria-label="Copiar cupom AGO3">
              <strong>{FIRST_PURCHASE_COUPON}</strong>
              <span>{copied ? 'Copiado' : 'copiar'}</span>
            </button>
            <button type="button" className="first-purchase-continue" onClick={close}>continuar no site</button>
          </div>
        )}
      </section>
    </div>
  );
}
