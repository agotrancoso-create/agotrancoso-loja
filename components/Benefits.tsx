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
      <path d="m24 7 5 3 5-2 4 6 7 1 3 5 8 3-1 7-5 4-5 1-2 7-6 5-3 8-5 4-3-3 4-8-6-5-2-7-7-2-1-5-6-3 2-6 6-2 1-6 6 1Z" />
      <path d="M30 27v9m-5-5h10m-8 10c3 2 7 2 10 0" />
    </>,
    truck: <>
      <path d="M12 19h29v28H12V19Zm29 9h9l9 11v8H41M47 29v10h11M4 27h5M2 33h7M4 39h5" />
      <circle cx="21" cy="47" r="5" fill="var(--ago-brasil-palha, #f6eddc)" /><circle cx="50" cy="47" r="5" fill="var(--ago-brasil-palha, #f6eddc)" />
      <path d="m20 29 6-4 6 4v10H20V29Zm6-4v-4m-3 2h6m-5 16v-5h4v5" />
    </>,
  };
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{drawings[name]}</svg>;
}

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference ago-benefits-icons-2026" aria-label="Por que escolher a Agô Trancoso">
      <div className="ago-container ago-benefits-reference-inner">
        <h2 id="benefits-title" className="sr-only">Por que escolher a Agô Trancoso</h2>
        <ul className="ago-benefits-grid ago-benefits-icon-grid">
          {benefits.map((benefit) => (
            <li className="ago-benefit-icon-item" key={benefit.title}>
              <span className="ago-benefit-line-icon" aria-hidden="true">
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
