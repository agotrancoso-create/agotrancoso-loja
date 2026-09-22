const benefits = [
  { title: 'Feito à mão', text: 'Peças feitas à mão, com cuidado em cada etapa.', icon: 'hands' },
  { title: 'Peças exclusivas', text: 'No trabalho manual, cada peça tem seus próprios detalhes.', icon: 'ceramic' },
  { title: 'Inspiração brasileira', text: 'Trancoso, Bahia e referências brasileiras presentes na coleção.', icon: 'brazil' },
  { title: 'Envio para todo o Brasil', text: 'A gente embala tudo com cuidado para enviar sua peça para qualquer lugar do Brasil.', icon: 'delivery' },
] as const;

function BenefitIcon({ type }: { type: (typeof benefits)[number]['icon'] }) {
  const common = {
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.25,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (type === 'hands') {
    return (
      <svg {...common}>
        <path d="M7.5 25.5 17.7 35c2 1.9 5.1 1.9 7 0l8.8-8.7a2.35 2.35 0 0 0-3.3-3.3l-5.8 5.7" />
        <path d="m10.2 23 5.2-5.2a2.45 2.45 0 0 1 3.5 0l8.2 8.2" />
        <path d="m14.4 19 4.7-4.7a2.45 2.45 0 0 1 3.5 0l6.3 6.3" />
        <path d="m19 15.1 3.2-3.2a2.45 2.45 0 0 1 3.5 0l4.5 4.5" />
        <path d="M38 21.5 33.7 17.2" />
      </svg>
    );
  }

  if (type === 'ceramic') {
    return (
      <svg {...common}>
        <path d="M17.5 10h13" />
        <path d="M20 10v5.1c0 2.2-1 3.9-2.8 5.4-1.7 1.4-2.7 3.2-2.7 5.8v7c0 2.8 2.2 5 5 5h9c2.8 0 5-2.2 5-5v-7c0-2.6-1-4.4-2.7-5.8-1.8-1.5-2.8-3.2-2.8-5.4V10" />
        <path d="M15.7 27.2h16.6" />
        <path d="M19.2 31.2h9.6" />
      </svg>
    );
  }

  if (type === 'brazil') {
    return (
      <svg {...common} viewBox="0 0 48 48">
        <path d="M24.2 5.7 29.1 8l2.8-.5 3.7 3.4-.7 3.4 3.2 3.1-.9 4.1 2.3 3.4-2.6 3.2-3.5 1.1-1.4 4-3.4 1.7-1.1 4.2-4.1-.7-2.8-3-3.8-.6-1.6-3.5-3.8-1.6.2-4-2.5-2.8 1.6-3.7-.9-3.8 2.8-2.8.3-3.9 4-1.1 2.4-3.4 3.4.8 2.9-2.2Z" />
        <path d="m14.7 19.3 7.1 3.3 7.2-2.1 5.1 3.1-2.7 5.5-6.7 2.1-5.5-3.1-4.9.8" />
        <path d="m21.8 22.6 1.2 7.1" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="7" y="15.5" width="21.5" height="16.5" rx="1.2" />
      <path d="M28.5 21h5.7l6.2 6v5H28.5" />
      <circle cx="13.5" cy="34" r="2.9" />
      <circle cx="34.4" cy="34" r="2.9" />
      <path d="M34 21h4.2" />
    </svg>
  );
}

export default function Benefits() {
  return (
    <section className="benefits-strip ago-clean-benefits" aria-label="Diferenciais da Agô Trancoso">
      <div className="ago-clean-container ago-clean-benefits-grid">
        {benefits.map((item) => (
          <div className="ago-clean-benefit" key={item.title}>
            <span className="ago-lineart-benefit-icon"><BenefitIcon type={item.icon} /></span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
