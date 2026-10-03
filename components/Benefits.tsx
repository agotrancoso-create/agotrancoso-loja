const benefits = [
  { title: 'Feito à mão', text: 'Cuidado em cada detalhe.', icon: 'craft' },
  { title: 'Peças exclusivas', text: 'Escolhas que valorizam o artesanal.', icon: 'vase' },
  { title: 'Inspiração brasileira', text: 'Cores e formas da nossa terra.', icon: 'brazil' },
  { title: 'Envios para o Brasil e exterior', text: 'Receba sua escolha onde estiver.', icon: 'truck' },
] as const;

type IconName = (typeof benefits)[number]['icon'];

function BenefitIcon({ name }: { name: IconName }) {
  const drawings = {
    craft: <>
      <path d="M32 26.5c-7.8-4.8-11-8.2-11-12.3C21 10.7 23.6 8 27 8c2.1 0 3.9 1.1 5 3 1.1-1.9 2.9-3 5-3 3.4 0 6 2.7 6 6.2 0 4.1-3.2 7.5-11 12.3Z" />
      <path d="M8 31.5c5.6 1.4 9.8 4.8 13.2 10l4.1 6.4M56 31.5c-5.6 1.4-9.8 4.8-13.2 10l-4.1 6.4" />
      <path d="M8 31.5 10.8 49c.6 3.8 3.9 6.6 7.8 6.6H27M56 31.5 53.2 49c-.6 3.8-3.9 6.6-7.8 6.6H37" />
      <path d="M17.4 38.5c-3.2-4.6-6.2-6.4-8.5-5.2-2 1-2.3 3.7-.7 5.3l8.8 9.1M46.6 38.5c3.2-4.6 6.2-6.4 8.5-5.2 2 1 2.3 3.7.7 5.3L47 47.7" />
    </>,
    vase: <>
      <path d="M24 9h16M26.5 9v8.2c0 4.8-8.7 8.6-9.7 18.7C15.7 47 21.9 55 32 55s16.3-8 15.2-19.1c-1-10.1-9.7-13.9-9.7-18.7V9" />
      <path d="M20.8 29.5c6.8-3.4 15.6-3.4 22.4 0M18.2 38.2c8.7 3.7 18.9 3.7 27.6 0M21.4 46.2c6.7-2.7 14.5-2.7 21.2 0" />
      <path d="M27 19.2h10M24.5 50.6h15" />
    </>,
    brazil: <>
      <path d="M23.9 4.9 21.5 6.7 19 6.1 18.4 10.3 16.6 10.3 15.4 9.1 12.4 9.7 12.4 15.1 10.6 17.5 8.2 18.1 7 22.4 7.6 24.8 8.8 24.8 10.6 26.6 16.6 26 19 29 23.9 32 23.9 33.8 26.9 35.6 26.9 42.2 31.1 45.3 31.7 49.5 29.3 51.3 28.1 54.3 29.3 54.3 31.7 56.7 31.7 58.5 33.5 58.5 38.9 51.9 39.5 47.7 42.5 45.3 48.6 43.4 51.6 36.8 51.6 31.4 56.4 26 56.4 20.6 54 20 51 16.9 45 15.7 44.3 14.5 38.9 12.7 35.3 6.1 32.9 9.1 30.5 8.5 25.7 9.7Z" />
      <path d="M20.5 24.5c4.5-2.7 10.8-2.7 15.3.1 4.1 2.5 6.9 6.6 8 11.3" />
      <path d="M26.3 36.6c3.5-1.8 7.8-1.8 11.2 0" />
    </>,
    truck: <>
      <circle cx="32" cy="32" r="22" />
      <path d="M10 32h44M32 10c6.8 6.3 10.2 13.6 10.2 22S38.8 47.7 32 54M32 10c-6.8 6.3-10.2 13.6-10.2 22S25.2 47.7 32 54" />
      <path d="M15.8 18.2c4.9 3.1 10.4 4.6 16.2 4.6s11.3-1.5 16.2-4.6M15.8 45.8c4.9-3.1 10.4-4.6 16.2-4.6s11.3 1.5 16.2 4.6" />
      <circle cx="46.5" cy="20.5" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="18" cy="42.5" r="1.8" fill="currentColor" stroke="none" />
      <path d="M45 22.5c-4.7 2.5-8.2 5.8-11.4 9.3-3.6 3.9-7 7.2-13.8 9.2" />
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
