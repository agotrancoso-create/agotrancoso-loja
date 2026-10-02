const benefits = [
  { title: 'Feito à mão', text: 'Cerâmica artesanal', icon: 'craft' },
  { title: 'Envio para todo o Brasil', text: 'Frete fixo e grátis a partir de R$ 500', icon: 'brazil' },
  { title: 'Pagamento seguro', text: 'Compra online pela InfinitePay', icon: 'shield' },
  { title: 'Cotação internacional', text: 'Conforme destino e peças', icon: 'globe' },
] as const;

type IconName = (typeof benefits)[number]['icon'];

function BenefitIcon({ name }: { name: IconName }) {
  if (name === 'craft') {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
        <path d="M8 23.5c5-1.3 8.7-5 10-10l1.2-5.1 4.7-4.7 4.1 4.1-4.7 4.7-5.1 1.2C13.2 15 9.4 18.7 8 23.5Z" />
        <path d="M6.2 26.2c2.6.8 5.2.8 7.8 0" />
      </svg>
    );
  }

  if (name === 'brazil') {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
        <path d="M18.4 3.9 23 5.4l.4 3.2 3.3 2.1-1 3.4 2 3.2-2.8 2.4-.6 4.2-3.6.7-2.7 3.7-3.5-1.7-4.7.8-1.4-3.8-3.5-2.1 1.5-3.8-1.1-4.1 3.2-2.6.3-4.1 4.1.1 2.8-3.1Z" />
        <path d="M10.8 13.2c2.6-.5 5.4.3 7.2 2.1 1.2 1.2 2.6 1.8 4.3 1.8" />
      </svg>
    );
  }

  if (name === 'shield') {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
        <path d="M16 4 25 7.5v7.2c0 6-3.5 10.7-9 13.3-5.5-2.6-9-7.3-9-13.3V7.5L16 4Z" />
        <path d="m11.5 15.8 3 3 6-6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="11.2" />
      <path d="M4.8 16h22.4M16 4.8c3.3 3.1 5.1 6.8 5.1 11.2S19.3 24.1 16 27.2M16 4.8c-3.3 3.1-5.1 6.8-5.1 11.2S12.7 24.1 16 27.2" />
      <path d="M8.6 8.6c2 .9 4.5 1.4 7.4 1.4s5.4-.5 7.4-1.4M8.6 23.4c2-.9 4.5-1.4 7.4-1.4s5.4.5 7.4 1.4" />
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
