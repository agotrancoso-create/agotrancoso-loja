import React from 'react';

const benefits = [
  { title: 'Feito à mão', text: 'Cuidado em cada etapa.', icon: 'handmade' },
  { title: 'Cada peça é única', text: 'Detalhes próprios do trabalho manual.', icon: 'ceramic' },
  { title: 'Inspirada em Trancoso', text: 'Bahia e referências brasileiras na coleção.', icon: 'trancoso' },
  { title: 'Envio para todo o Brasil', text: 'Embalada com cuidado para chegar bem.', icon: 'shipping' },
] as const;

type BenefitIconType = (typeof benefits)[number]['icon'];

const iconProps = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.35,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function BenefitIcon({ type }: { type: BenefitIconType }) {
  if (type === 'handmade') {
    return (
      <svg {...iconProps}>
        <path d="M14.5 25.2 11.7 18c-.48-1.25.18-2.62 1.43-3.1 1.16-.44 2.43.1 2.96 1.2l2.38 4.92" />
        <path d="m18.47 21.04-1.15-8.44c-.17-1.3.73-2.49 2.02-2.67 1.24-.16 2.4.68 2.61 1.91l1.2 7.1" />
        <path d="m23.18 19.03.08-6.9c.01-1.31 1.08-2.36 2.39-2.34 1.27.02 2.3 1.05 2.32 2.32l.1 6.65" />
        <path d="m27.95 18.95.53-4.63c.15-1.25 1.28-2.14 2.53-1.99 1.22.15 2.1 1.26 1.97 2.48l-.8 7.78c-.42 4.14-3.91 7.3-8.08 7.3h-3.22a8.7 8.7 0 0 1-7.98-5.23" />
        <path d="M18.6 31.9h7.1" />
        <path d="M34.4 10.1v4.2M32.3 12.2h4.2" />
      </svg>
    );
  }

  if (type === 'ceramic') {
    return (
      <svg {...iconProps}>
        <path d="M15 12h18" />
        <path d="M17 12v9.2c0 2.1-.84 3.86-2.15 5.55-1.22 1.57-1.85 3.12-1.85 5.05A6.2 6.2 0 0 0 19.2 38h9.6a6.2 6.2 0 0 0 6.2-6.2c0-1.93-.63-3.48-1.85-5.05C31.84 25.06 31 23.3 31 21.2V12" />
        <path d="M14.2 22.3h19.6" />
        <path d="M19.6 8.6h8.8" />
        <path d="m24 26.1 1.15 2.3 2.54.37-1.84 1.8.44 2.53L24 31.9l-2.29 1.2.44-2.53-1.84-1.8 2.54-.37L24 26.1Z" />
      </svg>
    );
  }

  if (type === 'trancoso') {
    return (
      <svg {...iconProps}>
        <path d="M10 36V21.6L24 11l14 10.6V36" />
        <path d="M16 36V24h16v12" />
        <path d="M20 36V29.2c0-2.21 1.79-4 4-4s4 1.79 4 4V36" />
        <path d="M8.5 36h31" />
        <path d="M24 7.5v2.2M20.9 8.6h6.2" />
        <path d="M15 21.4h18" opacity=".5" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <path d="M7.5 18.5h18.1l6.9 5.6V35H7.5V18.5Z" />
      <path d="M7.5 18.5 14.5 24h18" />
      <path d="M27.2 24h8.1" />
      <circle cx="14.3" cy="35.5" r="2.1" />
      <circle cx="30.4" cy="35.5" r="2.1" />
      <path d="M35.7 12.6h4.8M38.1 10.2V15" />
    </svg>
  );
}

export default function Benefits() {
  return (
    <section className="benefits-strip ago-clean-benefits ago-ideal-benefits" aria-label="Diferenciais da Agô Trancoso">
      <div className="ago-clean-container ago-clean-benefits-grid">
        <div className="ago-benefits-heading">
          <p className="eyebrow">Por que Agô</p>
          <span>O cuidado aparece em cada detalhe.</span>
        </div>

        <div className="ago-ideal-benefits-grid">
          {benefits.map((item, index) => (
            <article
              className="ago-clean-benefit ago-ideal-benefit"
              key={item.title}
              data-benefit-index={String(index + 1).padStart(2, '0')}
            >
              <span className={'ago-lineart-benefit-icon benefit-icon-' + item.icon} aria-hidden="true">
                <BenefitIcon type={item.icon} />
              </span>
              <div className="ago-benefit-copy">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
