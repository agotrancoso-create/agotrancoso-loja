const benefits = [
  { title: 'Feito à mão', text: 'Cuidado em cada detalhe.', icon: 'care' },
  { title: 'Peças exclusivas', text: 'Escolhas que valorizam o artesanal.', icon: 'ceramic' },
  { title: 'Inspiração brasileira', text: 'Cores e formas da nossa terra.', icon: 'sun' },
  { title: 'Envios para o Brasil e exterior', text: 'Receba sua escolha onde estiver.', icon: 'world' },
] as const;

type IconName = (typeof benefits)[number]['icon'];

function BenefitIcon({ name }: { name: IconName }) {
  const drawings = {
    care: <>
      <path d="M12 8.1c-1.3-2-4.65-1.45-4.65 1.3 0 2.05 1.9 3.45 4.65 5.35 2.75-1.9 4.65-3.3 4.65-5.35 0-2.75-3.35-3.3-4.65-1.3Z" />
      <path d="M4.2 15.7c1.8 0 3.15.55 4.55 1.8l1.2 1.05h4.1l1.2-1.05c1.4-1.25 2.75-1.8 4.55-1.8" />
      <path d="M6.25 18.3 8.8 20.5h6.4l2.55-2.2" />
    </>,
    ceramic: <>
      <path d="M8.7 4.5h6.6" />
      <path d="M9.8 4.5v3c0 1.3-1 2.15-2.05 3.2-1.25 1.25-2 2.85-2 4.7 0 3.25 2.55 5.6 6.25 5.6s6.25-2.35 6.25-5.6c0-1.85-.75-3.45-2-4.7-1.05-1.05-2.05-1.9-2.05-3.2v-3" />
      <path d="M7 13.2h10M7 17.1c3.15 1.15 6.85 1.15 10 0" />
    </>,
    sun: <>
      <circle cx="12" cy="10.1" r="3.05" />
      <path d="M12 3.3v2M12 14.2v2M5.2 10.1h2M16.8 10.1h2M7.2 5.3l1.4 1.4M15.4 13.5l1.4 1.4M16.8 5.3l-1.4 1.4M8.6 13.5l-1.4 1.4" />
      <path d="M4.1 20.2c2.3-1.65 4.9-2.45 7.9-2.45s5.6.8 7.9 2.45" />
    </>,
    world: <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M3.8 12h16.4M12 3.8c2.2 2.2 3.4 5.05 3.4 8.2s-1.2 6-3.4 8.2M12 3.8C9.8 6 8.6 8.85 8.6 12s1.2 6 3.4 8.2" />
    </>,
  };

  return (
    <svg
      className={`ago-benefit-svg ago-benefit-svg-${name}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.45"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {drawings[name]}
    </svg>
  );
}

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference ago-benefits-icons-2026" aria-label="Por que escolher a Agô Trancoso">
      <div className="ago-container ago-benefits-reference-inner">
        <h2 id="benefits-title" className="sr-only">Por que escolher a Agô Trancoso</h2>
        <ul className="ago-benefits-grid ago-benefits-icon-grid">
          {benefits.map((benefit) => (
            <li className="ago-benefit-icon-item" key={benefit.title}>
              <span className={`ago-benefit-line-icon ago-benefit-line-icon-${benefit.icon}`} aria-hidden="true">
                <BenefitIcon name={benefit.icon} />
              </span>
              <span className="ago-benefit-icon-copy">
                <strong>{benefit.title}</strong>
                <small>{benefit.text}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
