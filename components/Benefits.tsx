const benefits = [
  { title: 'feito à mão', text: 'cada peça passa pelas nossas mãos.', icon: 'handmade' },
  { title: 'uma de cada vez', text: 'detalhes que fazem parte do trabalho manual.', icon: 'ceramic' },
  { title: 'um pouco da bahia', text: 'formas, cores e lembranças de Trancoso.', icon: 'brazil' },
  { title: 'para chegar bem', text: 'a gente embala com cuidado e envia.', icon: 'shipping' },
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
        <path d="M16.5 35.5c-1.6-5.5-1.1-12.6 2.5-17.9 1.6-2.4 4.7-2 5.6.7l2.1 6.2" />
        <path d="M21.9 28.6 20 18.4c-.4-2.2 1.2-4.3 3.4-4.7 2.1-.4 4.1 1 4.7 3l2.1 9.1" />
        <path d="m30.2 27.9-1.1-11.2c-.2-2.2 1.5-4.1 3.7-4.3 2.1-.2 3.9 1.3 4.2 3.4l1.2 10.2" />
        <path d="m38 26.4.2-6.6c.1-2.2 1.9-3.8 4-3.7 2.1.1 3.7 1.9 3.7 4l-.2 8.7c-.1 7.7-5.7 13.9-13.3 15L26 44.7c-4.1.7-8.2-1.2-10.3-4.8" />
        <path d="M21 48h20.5" />
        <path d="M43.5 9.8c1.7 0 3.1 1.4 3.1 3.1" />
      </svg>
    );
  }

  if (type === 'ceramic') {
    return (
      <svg {...iconProps}>
        <path d="M20 14h24" />
        <path d="M22.7 14v8.8c0 3.4-1.1 5.5-3 8.2-1.8 2.5-2.8 5-2.8 8.4A9.6 9.6 0 0 0 26.5 49h11A9.6 9.6 0 0 0 47 39.4c0-3.4-1-5.9-2.8-8.4-1.9-2.7-3-4.8-3-8.2V14" />
        <path d="M19.1 25.2h25.8" />
        <path d="M27 9.8h10" />
        <path d="M24.8 33.1c4.5 2.7 9.9 2.7 14.4 0" />
        <path d="M25.8 39.9c3.9 1.8 8.1 1.8 12 0" />
      </svg>
    );
  }

  if (type === 'brazil') {
    return (
      <svg {...iconProps}>
        <path d="M29.3 7.6 35 9l4.2-1.1 3.2 3.9 5.2 2.1 1.6 4.9-2.3 4.1 1.1 4.9-3.5 4.7-3.9 1.8-1.1 5.5-3.6 4-2.7 5.1-4.6-2.4-3.9.9-2.5-3.9-4.5-1.9-2-4.9 1.6-4.1-1.4-4 3-4-.5-4.8 3.8-2.6 1-4.4 4.1-1.5 2.2-4.1Z" />
        <path d="m26.1 20.2 4.7 5.4 3.6-.5 3 3.6" />
        <path d="M24 48.2c6.7-2.3 12.6-6.3 17.7-11.3" opacity=".55" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <path d="M8 22.5h24.5l8 7v12H8v-19Z" />
      <path d="M8 22.5 17.2 30H40.5" />
      <path d="M40.5 29.5h8.2c2.8 0 5 2.2 5 5v7h-5.4" />
      <circle cx="16.8" cy="42.7" r="3.2" />
      <circle cx="43.3" cy="42.7" r="3.2" />
      <path d="M48.8 22.8h6.2M52 19.8v6" />
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
