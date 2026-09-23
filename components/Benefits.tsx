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
  strokeWidth: 1.35,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function BenefitIcon({ type }: { type: BenefitIconType }) {
  if (type === 'handmade') {
    return (
      <svg {...iconProps}>
        <path d="M17 36c-1.2-6.8-.4-13.1 3.1-18.1 1.5-2.1 4.5-1.6 5.2.9l1.8 6.3" />
        <path d="m22 29-1.8-10.2c-.4-2.2 1-4.2 3.1-4.6 2.1-.4 4.1.9 4.7 2.9l2.2 9.2" />
        <path d="m29.9 28.1-1-11.2c-.2-2.2 1.5-4.1 3.7-4.2 2.1-.1 3.8 1.4 4.1 3.5l1.1 10.1" />
        <path d="m37.7 26.4.2-6.1c.1-2.1 1.8-3.8 3.9-3.7 2.1.1 3.7 1.8 3.7 3.9l-.2 8.6c-.1 7.2-5.1 13.3-12.1 14.8L26 45.3c-4 .8-8.1-1.1-10.2-4.5" />
        <path d="M21 49h20" />
      </svg>
    );
  }

  if (type === 'ceramic') {
    return (
      <svg {...iconProps}>
        <path d="M20 14h24" />
        <path d="M22.5 14v9c0 3.1-1 5.3-2.7 7.8-1.9 2.7-3 5.2-3 8.6A9.6 9.6 0 0 0 26.4 49h11.2a9.6 9.6 0 0 0 9.6-9.6c0-3.4-1.1-5.9-3-8.6-1.7-2.5-2.7-4.7-2.7-7.8v-9" />
        <path d="M19 25h26" />
        <path d="M27 9.5h10" />
        <path d="M24.8 33c4.4 2.6 10 2.6 14.4 0" />
        <path d="M25.7 40c3.8 1.7 8.2 1.7 12 0" />
      </svg>
    );
  }

  if (type === 'trancoso') {
    return (
      <svg {...iconProps}>
        <path d="M32 51.5s-13.2-13.4-13.2-24.1A13.2 13.2 0 1 1 45.2 27.4C45.2 38.1 32 51.5 32 51.5Z" />
        <circle cx="32" cy="27" r="4.4" />
        <path d="M23.8 36.8h16.4" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <path d="M9 21.5h29l8.5 8v11H9v-19Z" />
      <path d="M9 21.5 18.5 29h28" />
      <path d="M46.5 29.5H51c2.8 0 5 2.2 5 5v6h-5.1" />
      <circle cx="17.6" cy="42.3" r="3.3" />
      <circle cx="45.2" cy="42.3" r="3.3" />
      <path d="M49.2 18.5h6M52.2 15.5v6" />
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
