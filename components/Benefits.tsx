const benefits = [
  {
    title: 'Feito à mão',
    text: 'Cerâmica artesanal, moldada e pintada à mão.',
    icon: 'hand',
  },
  {
    title: 'Desde 2016 no Quadrado',
    text: 'Uma história construída em Trancoso.',
    icon: 'church',
  },
  {
    title: 'Pagamento seguro',
    text: 'Compra online com pagamento pela InfinitePay.',
    icon: 'lock',
  },
  {
    title: 'Envio para todo o Brasil',
    text: 'Frete grátis a partir de R$ 500 em produtos.',
    icon: 'box',
  },
] as const;

function BenefitIcon({ name }: { name: (typeof benefits)[number]['icon'] }) {
  if (name === 'church') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path d="M24 5v8M20 9h8M12 40V23l12-8 12 8v17M8 40h32M19 40V29h10v11M14 23h20" />
      </svg>
    );
  }

  if (name === 'lock') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <rect x="11" y="20" width="26" height="20" rx="5" />
        <path d="M17 20v-5a7 7 0 0 1 14 0v5M24 28v5" />
      </svg>
    );
  }

  if (name === 'box') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path d="m9 15 15-7 15 7-15 8-15-8Z" />
        <path d="M9 15v18l15 7 15-7V15M24 23v17M16 12l15 7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path d="M14 25V13a3 3 0 0 1 6 0v9-12a3 3 0 0 1 6 0v12-9a3 3 0 0 1 6 0v11-7a3 3 0 0 1 6 0v11c0 8-5 14-14 14h-1c-6 0-10-3-13-8l-4-7a3.5 3.5 0 0 1 6-3l2 3Z" />
    </svg>
  );
}

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-icons" aria-labelledby="benefits-title">
      <div className="ago-container">
        <h2 id="benefits-title" className="sr-only">Por que escolher a Agô Trancoso</h2>
        <div className="ago-benefits-icon-grid">
          {benefits.map((item) => (
            <div className="ago-benefit-icon-item" key={item.title}>
              <span className="ago-benefit-icon" aria-hidden="true"><BenefitIcon name={item.icon} /></span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
