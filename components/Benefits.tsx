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
    strokeWidth: 1.35,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (type === 'hands') {
    return (
      <svg {...common}>
        <path d="M10 25.5 18.3 33c2.2 2 5.5 2 7.7 0l9.2-8.7a2.7 2.7 0 0 0-3.8-3.8l-5.7 5.3" />
        <path d="m13.3 22.2 5.4-5.4a2.7 2.7 0 0 1 3.8 0l7.7 7.7" />
        <path d="m18 18.2 4.4-4.4a2.7 2.7 0 0 1 3.8 0l5.1 5.1" />
        <path d="M35.5 18.8 39 22.3" />
        <path d="M15.5 34.5c3.6 1.5 7.4 1.3 10.3-.4" />
        <path d="M10.8 17.8 8.5 20" />
      </svg>
    );
  }

  if (type === 'ceramic') {
    return (
      <svg {...common}>
        <path d="M17 10.5h14" />
        <path d="M19.5 10.5v4.7c0 2.1-1 3.8-2.7 5.3-1.8 1.6-2.8 3.5-2.8 6.2v5.7a5.6 5.6 0 0 0 5.6 5.6h9.8a5.6 5.6 0 0 0 5.6-5.6v-5.7c0-2.7-1-4.6-2.8-6.2-1.7-1.5-2.7-3.2-2.7-5.3v-4.7" />
        <path d="M15 27.5h18" />
        <path d="M19.5 32.2h9" />
        <path d="M22.5 14.5h3" />
      </svg>
    );
  }

  if (type === 'brazil') {
    return (
      <svg {...common}>
        <path d="M24 8.5 27 11l4-.3 2.4 3.2 3.8 1.6-.4 4.1 2.2 3.1-2.2 3.4.4 4-3.8 1.8-1.7 3.8-4.1-.1-3.6 2.5-3.4-2.5-4 .1-1.7-3.8-3.8-1.8.4-4-2.2-3.4 2.2-3.1-.4-4.1 3.8-1.6 2.4-3.2 4 .3Z" />
        <path d="m17 19 6.8 2.4 7.1-2.3 2.1 4.2-3.5 4.1-6.4 1.4-5.5-2.7-3.6.2" />
        <path d="m23.8 21.4 1 7.4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M8.5 15.5h20.8v17H8.5z" />
      <path d="M29.3 21h5.4l5 5.1v6.4H29.3z" />
      <path d="M8.5 15.5 13 20h16.3" />
      <circle cx="15" cy="35.2" r="2.6" />
      <circle cx="34.3" cy="35.2" r="2.6" />
      <path d="M35 21v5h4.7" />
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
