const benefits = [
  { title: 'Feito à mão', text: 'Cuidado em cada detalhe.', icon: 'craft' },
  { title: 'Peças exclusivas', text: 'Escolhas que valorizam o artesanal.', icon: 'vase' },
  { title: 'Inspiração brasileira', text: 'Cores e formas da nossa terra.', icon: 'brazil' },
  { title: 'Envios para o Brasil e exterior', text: 'Receba sua escolha onde estiver.', icon: 'globe' },
] as const;

type IconName = (typeof benefits)[number]['icon'];

function BenefitIcon({ name }: { name: IconName }) {
  const drawings = {
    craft: <>
      <path d="M32 25.5c-6.9-4.4-10.7-7.8-10.7-12 0-3.5 2.6-6.2 6-6.2 2 0 3.8 1 4.7 2.8.9-1.8 2.7-2.8 4.7-2.8 3.4 0 6 2.7 6 6.2 0 4.2-3.8 7.6-10.7 12Z" />
      <path d="M7.8 34.2c5.4.3 10.2 3.1 13.7 8l4.4 6.1c1.5 2 3.8 3.2 6.3 3.2" />
      <path d="M56.2 34.2c-5.4.3-10.2 3.1-13.7 8l-4.4 6.1c-1.5 2-3.8 3.2-6.3 3.2" />
      <path d="M8.2 34.5 11 50c.6 3.4 3.6 5.8 7 5.8h8.4M55.8 34.5 53 50c-.6 3.4-3.6 5.8-7 5.8h-8.4" />
      <path d="M18 40.2c-2.8-3.9-5.5-5.4-7.5-4.3-1.9 1-2 3.5-.3 5.1l7.6 7M46 40.2c2.8-3.9 5.5-5.4 7.5-4.3 1.9 1 2 3.5.3 5.1l-7.6 7" />
    </>,
    vase: <>
      <path d="M24 9h16M26.5 9v7.8c0 5.3-8.5 8.7-9.4 18.7C16.1 46.9 22.2 55 32 55s15.9-8.1 14.9-19.5c-.9-10-9.4-13.4-9.4-18.7V9" />
      <path d="M26.5 17h11M20 29.5c7.1-3.1 16.9-3.1 24 0M18.5 38c8.5 3.6 18.5 3.6 27 0M21.5 46.5c6.6-2.5 14.4-2.5 21 0M24.5 51.2h15" />
      <path d="M27.5 33.4c1.2-1.7 2.7-2.5 4.5-2.5s3.3.8 4.5 2.5c-1.2 1.7-2.7 2.5-4.5 2.5s-3.3-.8-4.5-2.5Z" />
    </>,
    brazil: <>
      <path d="M23.9 4.9 21.5 6.7 19 6.1 18.4 10.3 16.6 10.3 15.4 9.1 12.4 9.7 12.4 15.1 10.6 17.5 8.2 18.1 7 22.4 7.6 24.8 8.8 24.8 10.6 26.6 16.6 26 19 29 23.9 32 23.9 33.8 26.9 35.6 26.9 42.2 31.1 45.3 31.7 49.5 29.3 51.3 28.1 54.3 29.3 54.3 31.7 56.7 31.7 58.5 33.5 58.5 38.9 51.9 39.5 47.7 42.5 45.3 48.6 43.4 51.6 36.8 51.6 31.4 56.4 26 56.4 20.6 54 20 51 16.9 45 15.7 44.3 14.5 38.9 12.7 35.3 6.1 32.9 9.1 30.5 8.5 25.7 9.7Z" />
      <path d="M24.5 24.5c4.2-2 9.3-1.9 13.4.4 3.4 1.9 5.9 5 7.1 8.8" />
      <path d="M28 35.7c2.8-1.1 5.9-1.1 8.8 0" />
      <circle cx="33.2" cy="30.2" r="1.2" fill="currentColor" stroke="none" />
    </>,
    globe: <>
      <circle cx="32" cy="32" r="21.5" />
      <path d="M10.5 32h43M32 10.5c6.4 6 9.7 13.2 9.7 21.5S38.4 47.5 32 53.5M32 10.5c-6.4 6-9.7 13.2-9.7 21.5S25.6 47.5 32 53.5" />
      <path d="M16.2 18.3c4.8 2.9 10.1 4.4 15.8 4.4s11-1.5 15.8-4.4M16.2 45.7c4.8-2.9 10.1-4.4 15.8-4.4s11 1.5 15.8 4.4" />
      <path d="M18.2 42.2c5.4-1.7 9.1-4.7 12.9-8.7 3.3-3.5 6.7-7 13.8-9.8" />
      <circle cx="18.2" cy="42.2" r="2" fill="currentColor" stroke="none" />
      <circle cx="45" cy="23.7" r="2" fill="currentColor" stroke="none" />
      <path d="m42.4 22.2 2.8 1.4-1.3 2.9" />
    </>,
  };

  return (
    <svg
      className={`ago-benefit-svg ago-benefit-svg-${name}`}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
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
