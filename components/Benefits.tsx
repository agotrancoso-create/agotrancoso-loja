const benefits = [
  { title: 'feito à mão', text: 'feito por mãos que conhecem o trabalho.', icon: 'handmade' },
  { title: 'peças exclusivas', text: 'peças para quem gosta de coisa com história.', icon: 'ceramic' },
  { title: 'inspiração brasileira', text: 'Trancoso, Bahia e Brasil nas formas.', icon: 'brazil' },
  { title: 'envio para todo brasil', text: 'a gente embala bem e manda para você.', icon: 'shipping' },
] as const;

type BenefitIconType = (typeof benefits)[number]['icon'];

const iconProps = {
  viewBox: '0 0 64 64',
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
        <path d="M32 50.5c-2.6-2.9-15.5-10.3-18.9-18-2.8-6.2-.4-12.9 5.5-15.1 5.3-2 10.5.2 13.4 4.6 2.9-4.4 8.1-6.6 13.4-4.6 5.9 2.2 8.3 8.9 5.5 15.1-3.4 7.7-16.3 15.1-18.9 18Z" />
        <path d="M23.6 34.5 18 26.9c-.9-1.2-.7-2.9.5-3.8 1.2-.9 2.8-.7 3.7.5l4.1 5.4" />
        <path d="M26.3 30.2 22.7 22c-.6-1.4 0-3 1.4-3.6 1.4-.6 3 0 3.6 1.4l3 7" />
        <path d="M32.1 28.4 29.5 20c-.4-1.4.4-2.8 1.8-3.2 1.4-.4 2.8.4 3.2 1.8l2.3 7.5" />
        <path d="M37.6 27.1 36.8 22c-.2-1.5.8-2.8 2.3-3 1.5-.2 2.8.8 3 2.3l.8 5.4" />
      </svg>
    );
  }

  if (type === 'ceramic') {
    return (
      <svg {...iconProps}>
        <path d="M22 15h20" />
        <path d="M24.3 15v9.6c0 3-1 5.1-3 7.7-1.9 2.5-2.8 4.9-2.8 8A10.5 10.5 0 0 0 29 50.8h6A10.5 10.5 0 0 0 45.5 40c0-3.1-.9-5.5-2.8-8-2-2.6-3-4.7-3-7.7V15" />
        <path d="M20 27.2h24" />
        <path d="M28 10.8h8" />
        <path d="M27 36.7c3.3 2 6.7 2 10 0" />
        <path d="M28.7 43.2c2.3 1 4.4 1 6.7 0" />
      </svg>
    );
  }

  if (type === 'brazil') {
    return (
      <svg {...iconProps}>
        <path d="M27.3 7.2 34 8.8l4.6-1.1 3.2 4.2 5.7 2.1 1.9 5.3-2.5 4.3 1.4 5.5-3.9 5.1-4.1 1.8-1.4 6.1-3.9 4.1-3.2 5.5-5.2-2.9-3.9 1-2.9-4.3-5.1-1.9-2.1-5.5 1.8-4.4-1.6-4.2 3.2-4.2-.8-5.4 4.1-2.7 1.1-4.7 4.4-1.7 2.5-4.5Z" />
        <path d="m25 19 4.4 5.3 3.8-.3 2.6 4.2" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <path d="M8 23h23l8 8v11H8V23Z" />
      <path d="M8 23 17 31h22" />
      <path d="M39 31h8v11H39" />
      <circle cx="17" cy="44" r="3" />
      <circle cx="41" cy="44" r="3" />
      <path d="M48 25h5" />
      <path d="M55 21v8M51 25h8" />
    </svg>
  );
}

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference" aria-label="Diferenciais da Agô Trancoso">
      <div className="ago-benefits-reference-grid">
        {benefits.map((item) => (
          <article className="ago-benefit-reference-item" key={item.title}>
            <span className="ago-benefit-reference-icon">
              <BenefitIcon type={item.icon} />
            </span>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
