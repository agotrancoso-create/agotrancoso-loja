const benefits = [
  { title: 'Feito à mão', text: 'Cuidado em cada etapa.', icon: 'handmade' },
  { title: 'Cada peça é única', text: 'Detalhes próprios do trabalho manual.', icon: 'ceramic' },
  { title: 'Inspirada em Trancoso', text: 'Bahia e referências brasileiras na coleção.', icon: 'sun' },
  { title: 'Envio para todo o Brasil', text: 'Embalada com cuidado para chegar bem.', icon: 'package' },
] as const;

type BenefitIconType = (typeof benefits)[number]['icon'];

function BenefitIcon({ type }: { type: BenefitIconType }) {
  const common = {
    viewBox: '0 0 32 32',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.25,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (type === 'handmade') {
    return (
      <svg {...common}>
        <path d="M16 27C16 27 4 20.3 4 11.2C4 7.45 6.75 5 10.2 5C12.7 5 14.75 6.4 16 8.55C17.25 6.4 19.3 5 21.8 5C25.25 5 28 7.45 28 11.2C28 20.3 16 27 16 27Z" />
      </svg>
    );
  }

  if (type === 'ceramic') {
    return (
      <svg {...common}>
        <path d="M11 7.4h10" />
        <path d="M12.7 7.4v4c0 1.7-.8 2.9-2 4.1-1.1 1.1-1.7 2.3-1.7 4v1.8A4.2 4.2 0 0 0 13.2 25.5h5.6A4.2 4.2 0 0 0 23 21.3v-1.8c0-1.7-.6-2.9-1.7-4.0-1.2-1.2-2-2.4-2-4.1v-4" />
        <path d="M10.7 17.6h10.6" />
      </svg>
    );
  }

  if (type === 'sun') {
    return (
      <svg {...common}>
        <circle cx="16" cy="16" r="4.7" />
        <path d="M16 4.9v2.2M16 24.9v2.2M27.1 16h-2.2M7.1 16H4.9M23.85 8.15l-1.55 1.55M9.7 22.3l-1.55 1.55M23.85 23.85l-1.55-1.55M9.7 9.7 8.15 8.15" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M4.9 10.8h14.2l7 5v6.1H4.9z" />
      <path d="M4.9 10.8 12.2 16h13.9" />
      <path d="M20.2 15.8h5.9" />
      <circle cx="10.1" cy="24.1" r="1.4" />
      <circle cx="23.4" cy="24.1" r="1.4" />
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
          {benefits.map((item) => (
            <article className="ago-clean-benefit ago-ideal-benefit" key={item.title}>
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
