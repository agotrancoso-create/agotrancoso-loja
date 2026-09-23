const benefits = [
  {
    title: 'Feito à mão',
    text: 'O toque humano aparece em cada detalhe.',
    icon: 'handmade',
    tone: 'benefit-icon-handmade',
  },
  {
    title: 'Cada um, um',
    text: 'Pequenas diferenças fazem parte da beleza.',
    icon: 'ceramic',
    tone: 'benefit-icon-ceramic',
  },
  {
    title: 'Bahia por perto',
    text: 'Cores, formas e referências de um lugar cheio de personalidade.',
    icon: 'trancoso',
    tone: 'benefit-icon-trancoso',
  },
  {
    title: 'Vai bem cuidado',
    text: 'Embalamos tudo para chegar inteiro até você.',
    icon: 'shipping',
    tone: 'benefit-icon-shipping',
  },
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
        <path d="M16.7 39.2c-2.4-5.3-2.2-11.7.6-16.7 1.1-2 3.9-1.6 4.7.6l2.6 7.1" />
        <path d="M21.9 30.7 20.3 20c-.3-2.3 1.4-4.2 3.6-4.4 2-.1 3.7 1.2 4.2 3.1l2.1 8.4" />
        <path d="m29.8 28.1-.9-11.2c-.2-2.1 1.4-4 3.5-4.2 2.1-.2 3.9 1.3 4.2 3.4l1 10.7" />
        <path d="m37.5 26.8.2-6.9c.1-2.1 1.8-3.7 3.9-3.6 2 .1 3.6 1.7 3.6 3.8v8.1c0 7.4-5.3 13.3-12.4 14.6l-5.7 1c-4.1.7-8.2-1.3-10.1-5" />
        <path d="M21.5 48.5h20.8" />
        <path d="M32 28.8c-2.7-4.6-10.3-3.1-10.3 2.3 0 4.1 6.1 7.7 10.3 11.1 4.2-3.4 10.3-7 10.3-11.1 0-5.4-7.6-6.9-10.3-2.3Z" />
      </svg>
    );
  }

  if (type === 'ceramic') {
    return (
      <svg {...iconProps}>
        <path d="M21.5 14.5h21" />
        <path d="M24 14.5v7.8c0 3.3-1.1 5.7-2.8 8.2-1.7 2.5-2.8 5-2.8 8.2A9.3 9.3 0 0 0 27.7 48h8.6a9.3 9.3 0 0 0 9.3-9.3c0-3.2-1.1-5.7-2.8-8.2-1.7-2.5-2.8-4.9-2.8-8.2v-7.8" />
        <path d="M21.4 24.8h21.2" />
        <path d="M26.7 10.8h10.6" />
        <path d="M24.2 33.3c4.8 2.6 10.8 2.6 15.6 0" />
        <path d="M25.8 39.8c3.9 1.8 8.1 1.8 12 0" />
        <path d="M26.3 19.5h2.2M35.4 19.5h2.2" />
      </svg>
    );
  }

  if (type === 'trancoso') {
    return (
      <svg {...iconProps}>
        <path d="M27.8 8.4 33.1 10l4.5-1.4 2.9 3.5 5.1 1.9 1.6 4.7-2.1 4 1 4.6-3.2 4.2-4 2.1-.8 5.5-3.3 3.8-2.8 5-4.7-2.3-4.4.8-2.3-3.8-4.4-2-1.8-4.7 1.4-4-1.3-4.1 2.8-4-.3-4.6 3.6-2.5 1.2-4.3 3.8-1.5Z" />
        <path d="m22.7 19.2 8.6 8.1 10.8-2.2" />
        <path d="M30.6 27.3 31.8 39.7" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <path d="M8.2 21.8h31.1l8.4 7.2v12.5H8.2V21.8Z" />
      <path d="M8.2 21.8 17.8 29h21.5" />
      <path d="M47.7 29.6h5.2c2.2 0 4 1.8 4 4v7.9H48" />
      <circle cx="16.8" cy="42.9" r="3.4" />
      <circle cx="44.2" cy="42.9" r="3.4" />
      <path d="M47.4 16.7h8M51.4 12.7v8" />
      <path d="M2.5 28.3h4.5M1.5 34h5.5" />
    </svg>
  );
}

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference" aria-label="Diferenciais da Agô Trancoso">
      <div className="ago-ideal-benefits-grid">
        {benefits.map((item) => (
          <article className="ago-clean-benefit" key={item.title}>
            <span className={`ago-lineart-benefit-icon ${item.tone}`}>
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
