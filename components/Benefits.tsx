const benefits = [
  { title: 'Feito à mão', text: 'Cerâmica artesanal', icon: 'craft' },
  { title: 'Desde 2016', text: 'No Quadrado de Trancoso', icon: 'place' },
  { title: 'Pagamento seguro', text: 'Compra online pela InfinitePay', icon: 'shield' },
  { title: 'Envio internacional', text: 'Cotação conforme o destino e o pedido', icon: 'box' },
] as const;

type IconName = (typeof benefits)[number]['icon'];

function BenefitIcon({ name }: { name: IconName }) {
  if (name === 'craft') {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
        <path d="M7 24.5c5.4-1 9.3-4.9 10.4-10.4l1.1-5.4 4.8-4.8 4.8 4.8-4.8 4.8-5.4 1.1C12.4 15.7 8.5 19.6 7 24.5Z" />
        <path d="M6 26c2.4.8 4.8.8 7.1 0" />
      </svg>
    );
  }

  if (name === 'place') {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
        <path d="M16 28s8-7.1 8-15a8 8 0 1 0-16 0c0 7.9 8 15 8 15Z" />
        <path d="M12.5 13h7M16 9.5v7" />
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
      <path d="m5 10 11-5 11 5-11 5L5 10Z" />
      <path d="M5 10v12l11 5 11-5V10M16 15v12" />
      <path d="m11 8 11 5" />
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
