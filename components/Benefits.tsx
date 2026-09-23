const benefits = [
  { title: 'Feito à mão', text: 'Cuidado em cada etapa.', icon: 'handmade' },
  { title: 'Cada peça é única', text: 'Detalhes próprios do trabalho manual.', icon: 'ceramic' },
  { title: 'Inspirada em Trancoso', text: 'Bahia e referências brasileiras na coleção.', icon: 'star' },
  { title: 'Envio para todo o Brasil', text: 'Embalada com cuidado para chegar bem.', icon: 'truck' },
] as const;

type BenefitIconType = (typeof benefits)[number]['icon'];

const iconProps = {
  viewBox: '0 0 40 40',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function BenefitIcon({ type }: { type: BenefitIconType }) {
  if (type === 'handmade') {
    return (
      <svg {...iconProps}>
        <path d="M12.5 24.2 10.2 17c-.35-1.1.22-2.25 1.28-2.6 1.02-.34 2.1.17 2.55 1.16l2.05 4.5" />
        <path d="M16.08 20.1 14.9 12.4c-.18-1.13.6-2.17 1.74-2.33 1.04-.15 2.01.52 2.23 1.55l1.33 6.15" />
        <path d="M20.2 17.65 20 12.6c-.05-1.12.8-2.07 1.92-2.12 1.08-.05 2 .78 2.06 1.86l.27 5.1" />
        <path d="M24.2 17.35 24.8 14c.18-1.02 1.15-1.7 2.17-1.52 1 .17 1.67 1.1 1.52 2.1l-1.15 7.45c-.5 3.22-3.28 5.57-6.54 5.57h-2.95a7.1 7.1 0 0 1-6.6-4.48" />
        <path d="M18.2 29.6h6.1" />
      </svg>
    );
  }

  if (type === 'ceramic') {
    return (
      <svg {...iconProps}>
        <path d="M13 9.5h14" />
        <path d="M14.8 9.5v7.2c0 1.8-.7 3.1-1.8 4.4-1.2 1.4-1.8 2.8-1.8 4.7a5 5 0 0 0 5 5h7.6a5 5 0 0 0 5-5c0-1.9-.6-3.3-1.8-4.7-1.1-1.3-1.8-2.6-1.8-4.4V9.5" />
        <path d="M11.8 18.9h16.4" />
        <path d="M16.2 7.3h7.6" />
      </svg>
    );
  }

  if (type === 'star') {
    return (
      <svg {...iconProps}>
        <path d="m20 8.2 2.9 7.1 7.6.6-5.8 4.9 1.8 7.4L20 24.2l-6.5 4 1.8-7.4-5.8-4.9 7.6-.6L20 8.2Z" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <path d="M6.8 14.2h17.1l4.8 4.8v7.2H6.8z" />
      <path d="M6.8 14.2 13 19h15.7" />
      <path d="M23.2 19h5.5" />
      <circle cx="12.8" cy="27.2" r="1.5" />
      <circle cx="24.8" cy="27.2" r="1.5" />
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
            <article className="ago-clean-benefit ago-ideal-benefit" key={item.title} data-benefit-index={String(index + 1).padStart(2, '0')}>
              <span className="ago-lineart-benefit-icon" aria-hidden="true">
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
