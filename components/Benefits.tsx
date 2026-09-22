const benefits = [
  { title: 'Feito à mão', text: 'Peças feitas à mão, com cuidado em cada etapa.', icon: 'hands' },
  { title: 'Peças exclusivas', text: 'No trabalho manual, cada peça tem seus próprios detalhes.', icon: 'vase' },
  { title: 'Inspiração brasileira', text: 'Trancoso, Bahia e referências brasileiras presentes na coleção.', icon: 'spark' },
  { title: 'Envio para todo o Brasil', text: 'A gente embala tudo com cuidado para enviar sua peça para qualquer lugar do Brasil.', icon: 'delivery' },
] as const;

function BenefitIcon({ type }: { type: (typeof benefits)[number]['icon'] }) {
  const common = {
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.35,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (type === 'hands') {
    return (
      <svg {...common}>
        <path d="M8.5 25.5 18 35c1.9 1.9 5 1.9 6.9 0l8.6-8.6a2.25 2.25 0 0 0-3.2-3.2l-5.6 5.6" />
        <path d="m10.8 23.2 5.1-5.1a2.4 2.4 0 0 1 3.4 0l8.2 8.2" />
        <path d="m14.8 19.2 4.7-4.7a2.4 2.4 0 0 1 3.4 0l6.2 6.2" />
        <path d="m19.4 15.2 3.2-3.2a2.4 2.4 0 0 1 3.4 0l4.6 4.6" />
        <path d="M37.8 21.1 33.5 16.8" />
      </svg>
    );
  }

  if (type === 'vase') {
    return (
      <svg {...common}>
        <path d="M18 10h12" />
        <path d="M20 10v5.2c0 2.1-1 3.8-2.8 5.3-1.7 1.5-2.7 3.1-2.7 5.8v7.1c0 2.7 2.2 4.9 4.9 4.9h9.2c2.7 0 4.9-2.2 4.9-4.9v-7.1c0-2.7-1-4.3-2.7-5.8-1.8-1.5-2.8-3.2-2.8-5.3V10" />
        <path d="M16.2 27.2h15.6" />
      </svg>
    );
  }

  if (type === 'spark') {
    return (
      <svg {...common}>
        <path d="M24 7.5v7" />
        <path d="M24 33.5v7" />
        <path d="M7.5 24h7" />
        <path d="M33.5 24h7" />
        <path d="m12.3 12.3 4.9 4.9" />
        <path d="m30.8 30.8 4.9 4.9" />
        <path d="m35.7 12.3-4.9 4.9" />
        <path d="m17.2 30.8-4.9 4.9" />
        <circle cx="24" cy="24" r="4.1" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="7.5" y="16" width="21.5" height="16" rx="1.2" />
      <path d="M29 22h5.5l6 6v4H29" />
      <circle cx="14.2" cy="34.1" r="3" />
      <circle cx="34.2" cy="34.1" r="3" />
      <path d="M34.5 22h4.6" />
    </svg>
  );
}

export default function Benefits() {
  return (
    <section className="benefits-strip ago-clean-benefits" aria-label="Diferenciais da Agô Trancoso">
      <div className="ago-clean-container ago-clean-benefits-grid">
        {benefits.map((item) => (
          <div className="ago-clean-benefit" key={item.title}>
            <span className="ago-lineart-benefit-icon">
              <BenefitIcon type={item.icon} />
            </span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
