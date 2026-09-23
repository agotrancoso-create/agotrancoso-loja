const benefits = [
  {
    title: 'feito à mão',
    text: 'cuidado e tradição em cada detalhe.',
    icon: 'handmade',
  },
  {
    title: 'peças exclusivas',
    text: 'escolhas especiais para quem valoriza o feito à mão.',
    icon: 'ceramic',
  },
  {
    title: 'inspiração brasileira',
    text: 'cores, formas e símbolos da nossa terra.',
    icon: 'brazil',
  },
  {
    title: 'envio para todo brasil',
    text: 'receba com segurança na sua casa.',
    icon: 'shipping',
  },
] as const;

type BenefitIconType = (typeof benefits)[number]['icon'];

const iconProps = {
  viewBox: '0 0 64 64',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.45,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function BenefitIcon({ type }: { type: BenefitIconType }) {
  if (type === 'handmade') {
    return (
      <svg {...iconProps}>
        <path d="M18 45c-2.8-5.5-2.9-12.4 0-18.1l2.9-5.7c.8-1.6 3.1-1.3 3.5.4l2.4 8.9" />
        <path d="M23 31.5 21.2 20c-.3-2 1-3.8 3-4.2 2-.4 3.8.8 4.3 2.7l2.2 9.4" />
        <path d="m30.7 29.5-.8-11.3c-.1-2 1.4-3.7 3.4-3.9 2-.1 3.7 1.3 3.9 3.3l1 10.8" />
        <path d="m38.2 27.9.2-7.1c.1-2 1.7-3.5 3.7-3.4 2 .1 3.5 1.7 3.5 3.7v8.1c0 7.2-5 13.1-11.9 14.5l-5.7 1.1c-4 .8-8-1.1-10-4.7" />
        <path d="M21 49h21" />
        <path d="M32 23.8c-2.2-4.5-9.6-3.1-9.6 1.9 0 3.7 5.7 6.9 9.6 10.3 3.9-3.4 9.6-6.6 9.6-10.3 0-5-7.4-6.4-9.6-1.9Z" />
      </svg>
    );
  }

  if (type === 'ceramic') {
    return (
      <svg {...iconProps}>
        <path d="M22 14h20" />
        <path d="M24 14v8.6c0 3.2-1.1 5.6-2.7 8.1-1.7 2.5-2.7 5-2.7 8.2A9.4 9.4 0 0 0 28 48h8a9.4 9.4 0 0 0 9.4-9.1c0-3.2-1-5.7-2.7-8.2-1.6-2.5-2.7-4.9-2.7-8.1V14" />
        <path d="M21.5 24.2h21" />
        <path d="M26.5 10h11" />
        <path d="M24 32.8c4.5 2.6 11.5 2.6 16 0" />
        <path d="M25.5 39.2c3.9 1.7 7.9 1.7 11.8 0" />
        <path d="M27 18.4c1.1.8 2.2.8 3.3 0M34 18.4c1.1.8 2.2.8 3.3 0" />
      </svg>
    );
  }

  if (type === 'brazil') {
    return (
      <svg {...iconProps}>
        <path d="M27.6 8.5 33 10l4.3-1.2 3 3.4 5 1.9 1.6 4.6-2.1 4.1 1 4.5-3.2 4.2-4 2-1 5.4-3.3 4-2.7 4.9-4.6-2.2-4.2.8-2.4-3.8-4.3-1.9-1.9-4.7 1.5-4-1.3-4.1 2.9-4-.3-4.7 3.6-2.5 1.2-4.2 3.8-1.7Z" />
        <path d="m23 19.3 7.9 7.4 10.2-2" />
        <path d="M30.9 27.1 32 39.4" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <path d="M8 22h31l8.6 7.2v12.6H8V22Z" />
      <path d="M8 22 17.6 29h21.4" />
      <path d="M47.6 29.6h4.8c2.4 0 4.3 1.9 4.3 4.3v7.9h-9.1" />
      <circle cx="16.6" cy="42.3" r="3.4" />
      <circle cx="43.6" cy="42.3" r="3.4" />
      <path d="M48 16.8h7.6M51.8 13v7.6" />
      <path d="M2.2 28.8h4.3M1.7 34.2h5.1" />
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
