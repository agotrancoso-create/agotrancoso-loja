const benefits = [
  {
    title: 'Feitas à mão',
    text: 'Cada peça passa pelas nossas mãos, do começo ao fim.',
    icon: 'handmade',
    tone: 'benefit-icon-handmade',
  },
  {
    title: 'Uma de cada vez',
    text: 'Pequenas diferenças que fazem cada peça ser única.',
    icon: 'ceramic',
    tone: 'benefit-icon-ceramic',
  },
  {
    title: 'Um pouco de Trancoso',
    text: 'Formas, cores e referências de um lugar especial.',
    icon: 'trancoso',
    tone: 'benefit-icon-trancoso',
  },
  {
    title: 'Para chegar bem',
    text: 'Tudo é embalado com cuidado antes de seguir até você.',
    icon: 'shipping',
    tone: 'benefit-icon-shipping',
  },
] as const;

type BenefitIconType = (typeof benefits)[number]['icon'];

const iconProps = {
  viewBox: '0 0 64 64',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.1,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function BenefitIcon({ type }: { type: BenefitIconType }) {
  if (type === 'handmade') {
    return (
      <svg {...iconProps}>
        <path d="M18.5 38.8c-1.2-5.8-.1-11.7 3.2-16.5l2.1-3c1.1-1.6 3.5-1.1 4.1.8l1.7 5.6" />
        <path d="m23.2 29.1-1.5-7.6c-.4-2.1 1-4.1 3-4.5 2-.4 4 .9 4.6 2.8l2.1 7.4" />
        <path d="m30.9 27.7-.8-9.2c-.2-2.1 1.4-3.9 3.5-4.1 2-.1 3.7 1.3 4 3.3l1 8.4" />
        <path d="m38.2 27 .1-5.2c0-2 1.6-3.6 3.6-3.6 2 0 3.6 1.6 3.6 3.6v7.9c0 7-4.9 12.9-11.7 14.2l-5.1 1c-4.4.8-8.6-1.3-10.5-5.2" />
        <path d="M20.8 49.2h21.4" />
      </svg>
    );
  }

  if (type === 'ceramic') {
    return (
      <svg {...iconProps}>
        <path d="M22 14.5h20" />
        <path d="M24 14.5v7.8c0 3.2-1.1 5.6-2.9 8.1-1.7 2.4-2.8 4.9-2.8 8a9.7 9.7 0 0 0 9.7 9.7h8a9.7 9.7 0 0 0 9.7-9.7c0-3.1-1.1-5.6-2.8-8-1.8-2.5-2.9-4.9-2.9-8.1v-7.8" />
        <path d="M21.3 24.6h21.4" />
        <path d="M27.3 10.7h9.4" />
        <path d="M24.8 34.3c4.6 2.3 9.8 2.3 14.4 0" />
      </svg>
    );
  }

  if (type === 'trancoso') {
    return (
      <svg {...iconProps}>
        <path d="M17.5 48.8V27.3L32 17.7l14.5 9.6v21.5" />
        <path d="M23.7 48.8V31.2h16.6v17.6" />
        <path d="M29.3 48.8V38.2h5.4v10.6" />
        <path d="M21.8 27.1h3.9" />
        <path d="M38.3 27.1h3.9" />
        <path d="M15 49h34" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <path d="M9.5 23h26.8l8 7.1v12.2H9.5V23Z" />
      <path d="M9.5 23 18.3 30h26" />
      <path d="M44.3 30.1h6.1c2.3 0 4.1 1.8 4.1 4.1v8.1h-10.2" />
      <path d="M18 42.3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm26.8 0a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
      <path d="M50.2 17.2v8.1M46.2 21.2h8.1" />
    </svg>
  );
}

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference" aria-label="Diferenciais da Agô Trancoso">
      <div className="ago-ideal-benefits-grid">
        {benefits.map((item, index) => (
          <article
            className="ago-clean-benefit"
            key={item.title}
            data-benefit-index={String(index + 1).padStart(2, '0')}
          >
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
