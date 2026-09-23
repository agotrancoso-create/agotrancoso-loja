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
    title: 'SEM FRONTEIRAS',
    text: 'Uma lembrança para qualquer lugar.',
    icon: 'world',
  },
] as const;

type BenefitIconType = (typeof benefits)[number]['icon'];

const iconProps = {
  viewBox: '0 0 120 120',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.65,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function BenefitIcon({ type }: { type: BenefitIconType }) {
  if (type === 'handmade') {
    return (
      <svg {...iconProps}>
        <path d="M35 89c-8-12-11-26-8-39l4-17c1-4 7-5 9-1l6 19" />
        <path d="M46 52 41 28c-1-5 3-9 8-9 4 0 7 3 8 7l6 24" />
        <path d="m63 49-2-27c0-5 3-8 8-8 4 0 7 3 7 7l2 27" />
        <path d="m78 48 2-21c0-4 4-7 8-6 4 0 7 4 6 8l-1 25c-1 16-11 28-26 31l-7 1c-8 1-16-3-20-10" />
        <path d="M30 98h38" />
        <path d="M60 33c-8-13-27-8-27 5 0 11 16 19 27 29 11-10 27-18 27-29 0-13-19-18-27-5Z" />
      </svg>
    );
  }

  if (type === 'ceramic') {
    return (
      <svg {...iconProps}>
        <path d="M46 20h28" />
        <path d="M49 20v12c0 6-2 10-6 16-4 6-7 12-7 19 0 12 9 21 20 21h12c11 0 20-9 20-21 0-7-3-13-7-19-4-6-6-10-6-16V20" />
        <path d="M43 38h34" />
        <path d="M48 15h24" />
        <path d="M45 56c9 5 21 5 30 0" />
        <path d="M45 71c8 3 22 3 30 0" />
        <path d="M49 28c2 2 5 2 7 0m8 0c2 2 5 2 7 0" />
      </svg>
    );
  }

  if (type === 'brazil') {
    return (
      <svg {...iconProps}>
        <path d="M47 16 60 20l10-4 9 9 16 6 5 13-7 13 2 13-10 12-12 6-3 13-10 8-8 15-14-7-13 3-8-12-13-7-6-15 5-12-5-13 9-11-1-14 11-7 4-13 13-5Z" />
        <path d="m40 45 21 19 27-8" />
        <path d="m61 64 3 31" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <circle cx="60" cy="60" r="38" />
      <path d="M22 60h76" />
      <path d="M60 22c11 10 17 23 17 38s-6 28-17 38" />
      <path d="M60 22c-11 10-17 23-17 38s6 28 17 38" />
      <path d="M30 42c9 4 19 6 30 6s21-2 30-6" />
      <path d="M30 78c9-4 19-6 30-6s21 2 30 6" />
      <path d="M27 35c12-12 29-18 46-14 10 2 18 7 24 15" />
      <path d="M93 85c-12 12-29 18-46 14-10-2-18-7-24-15" />
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
