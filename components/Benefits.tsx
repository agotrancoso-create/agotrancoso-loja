const benefits = [
  { number: '01', title: 'Feito à mão', text: 'Peças feitas à mão, com cuidado em cada etapa.', icon: 'handmade' },
  { number: '02', title: 'Peças exclusivas', text: 'No trabalho manual, cada peça tem seus próprios detalhes.', icon: 'ceramic' },
  { number: '03', title: 'Inspiração brasileira', text: 'Trancoso, Bahia e referências brasileiras presentes na coleção.', icon: 'sun' },
  { number: '04', title: 'Envio para todo o Brasil', text: 'A gente embala tudo com cuidado para enviar sua peça para qualquer lugar do Brasil.', icon: 'package' },
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
        <path d="M7 20.5 12.3 15a2 2 0 0 1 2.8 0l3.3 3.3 2.8-2.8a2 2 0 0 1 2.8 2.8l-4.1 4.1a5 5 0 0 1-7.1 0L7 20.5Z" />
        <path d="M12.4 14.7 15 12.1a1.7 1.7 0 0 1 2.4 0l2.1 2.1" />
        <path d="M9.7 22.7c2.5 1.2 5.2 1.1 7.4-.1" />
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
        <circle cx="16" cy="16" r="5.2" />
        <path d="M16 4.8v2.5M16 24.7v2.5M27.2 16h-2.5M7.3 16H4.8M23.9 8.1l-1.8 1.8M9.9 22.1l-1.8 1.8M23.9 23.9l-1.8-1.8M9.9 9.9 8.1 8.1" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="5.5" y="9" width="15.5" height="12.5" rx="1.2" />
      <path d="m5.8 10 7.3 6h7.5l5.8-6" />
      <path d="M21 13.5h5v7.7h-5" />
      <circle cx="10.5" cy="23.8" r="1.6" />
      <circle cx="23.2" cy="23.8" r="1.6" />
    </svg>
  );
}

export default function Benefits() {
  return (
    <section className="benefits-strip ago-clean-benefits" aria-label="Diferenciais da Agô Trancoso">
      <div className="ago-clean-container ago-clean-benefits-grid">
        {benefits.map((item) => (
          <article className="ago-clean-benefit" key={item.title}>
            <div className="ago-benefit-mark">
              <span>{item.number}</span>
              <span className="ago-lineart-benefit-icon"><BenefitIcon type={item.icon} /></span>
            </div>
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
