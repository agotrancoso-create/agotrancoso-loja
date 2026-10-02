const benefits = [
  { title: 'Feito à mão', text: 'Cuidado em cada detalhe.', icon: 'craft' },
  { title: 'Peças exclusivas', text: 'Escolhas que valorizam o artesanal.', icon: 'vase' },
  { title: 'Inspiração brasileira', text: 'Cores e formas da nossa terra.', icon: 'brazil' },
  { title: 'Envio para todo o Brasil', text: 'Da nossa banca para sua casa.', icon: 'truck' },
] as const;

type IconName = (typeof benefits)[number]['icon'];

function BenefitIcon({ name }: { name: IconName }) {
  const drawings = {
    craft: <>
      <path d="M32 28C13 17 25 7 32 16c7-9 19 1 0 12Z" />
      <path d="M23 55v-9L12 34 8 17c-1-4-5-3-4 1l2 21 12 16M41 55v-9l11-12 4-17c1-4 5-3 4 1l-2 21-12 16" />
      <path d="m23 46-9-16c-2-4-6-2-4 2l5 9m26 5 9-16c2-4 6-2 4 2l-5 9M27 53h10" />
    </>,
    vase: <>
      <path d="M25 9h14m-12 1v8c0 6-11 10-11 21 0 9 6 16 16 16s16-7 16-16c0-11-11-15-11-21v-8" />
      <path d="M20 29c8 3 16 3 24 0M17 37l5-3 5 3 5-3 5 3 5-3 5 3M19 46h26M25 50h14" />
      <circle cx="25" cy="41" r=".8" fill="currentColor" /><circle cx="32" cy="41" r=".8" fill="currentColor" /><circle cx="39" cy="41" r=".8" fill="currentColor" />
    </>,
    brazil: <>
      <path d="M23.9 4.9 21.5 6.7 19 6.1 18.4 10.3 16.6 10.3 15.4 9.1 12.4 9.7 12.4 15.1 10.6 17.5 8.2 18.1 7 22.4 7.6 24.8 8.8 24.8 10.6 26.6 16.6 26 19 29 23.9 32 23.9 33.8 26.9 35.6 26.9 42.2 31.1 45.3 31.7 49.5 29.3 51.3 28.1 54.3 29.3 54.3 31.7 56.7 31.7 58.5 33.5 58.5 38.9 51.9 39.5 47.7 42.5 45.3 48.6 43.4 51.6 36.8 51.6 31.4 56.4 26 56.4 20.6 54 20 51 16.9 45 15.7 44.3 14.5 38.9 12.7 35.3 6.1 32.9 9.1 30.5 8.5 25.7 9.7Z" />
    </>,
    truck: <>
      <path d="M10 20h30v24H10V20Zm30 8h9l9 10v6H40M49 29v9h8M4 27h4M2 33h6M4 39h4" />
      <circle cx="20" cy="45" r="5" />
      <circle cx="50" cy="45" r="5" />
    </>,
  };
  return <svg className={`ago-benefit-svg ago-benefit-svg-${name}`} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{drawings[name]}</svg>;
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
