const benefits = [
  { title: 'Feito à mão', text: 'Peças feitas à mão, com cuidado em cada etapa.', icon: 'handmade' },
  { title: 'Peças exclusivas', text: 'No trabalho manual, cada peça tem seus próprios detalhes.', icon: 'ceramic' },
  { title: 'Inspiração brasileira', text: 'Trancoso, Bahia e referências brasileiras presentes na coleção.', icon: 'sun' },
  { title: 'Envio para todo o Brasil', text: 'A gente embala tudo com cuidado para enviar sua peça para qualquer lugar do Brasil.', icon: 'package' },
] as const;

type BenefitIconType = (typeof benefits)[number]['icon'];

function BenefitIcon({ type }: { type: BenefitIconType }) {
  const common = {
    viewBox: '0 0 32 32',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.35,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (type === 'handmade') {
    return (
      <svg {...common}>
        <path d="M16 26C15.35 25.42 7.1 19.65 5.3 13.75 4.05 9.55 6.12 6.2 9.55 6.2c2.1 0 3.72 1.2 4.45 2.78.73-1.58 2.35-2.78 4.45-2.78 3.43 0 5.5 3.35 4.25 7.55C20.9 19.65 12.65 25.42 12 26L16 26Z" />
      </svg>
    );
  }

  if (type === 'ceramic') {
    return (
      <svg {...common}>
        <path d="M11.5 7.5h9" />
        <path d="M13 7.5v4.1c0 1.7-.8 2.9-2 4.1-1.1 1.1-1.7 2.3-1.7 4.1v1.7a4.2 4.2 0 0 0 4.2 4.2h3a4.2 4.2 0 0 0 4.2-4.2v-1.7c0-1.8-.6-3-1.7-4.1-1.2-1.2-2-2.4-2-4.1V7.5" />
        <path d="M11 18h10" />
      </svg>
    );
  }

  if (type === 'sun') {
    return (
      <svg {...common}>
        <circle cx="16" cy="16" r="4.8" />
        <path d="M16 5.2v2.1M16 24.7v2.1M26.8 16h-2.1M7.3 16H5.2M23.6 8.4l-1.5 1.5M9.9 22.1l-1.5 1.5M23.6 23.6l-1.5-1.5M9.9 9.9 8.4 8.4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M5.8 10.2h14.5l5.9 5v6.8H5.8z" />
      <path d="M5.8 10.2 13 16h13.2" />
      <path d="M21 15.8h5.2" />
      <circle cx="10.2" cy="24.1" r="1.5" />
      <circle cx="23" cy="24.1" r="1.5" />
    </svg>
  );
}

export default function Benefits() {
  return (
    <section className="benefits-strip ago-clean-benefits" aria-label="Diferenciais da Agô Trancoso">
      <div className="ago-clean-container ago-clean-benefits-grid">
        {benefits.map((item) => (
          <article className="ago-clean-benefit" key={item.title} tabIndex={0}>
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
    </section>
  );
}
