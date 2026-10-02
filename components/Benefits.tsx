const benefits = [
  { title: 'Feito à mão', text: 'Cerâmica artesanal' },
  { title: 'Envio para todo o Brasil', text: 'Frete fixo e grátis a partir de R$ 500' },
  { title: 'Pagamento seguro', text: 'Compra online pela InfinitePay' },
  { title: 'Cotação internacional', text: 'Conforme destino e peças' },
] as const;

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference ago-benefits-icons-2026" aria-label="Por que escolher a Agô Trancoso">
      <div className="ago-container ago-benefits-reference-inner">
        <h2 id="benefits-title" className="sr-only">Por que escolher a Agô Trancoso</h2>
        <ul className="ago-benefits-grid ago-benefits-icon-grid" style={{ gap: 'clamp(18px, 3vw, 34px)' }}>
          {benefits.map((benefit) => (
            <li
              className="ago-benefit-icon-item ago-benefit-text-only"
              key={benefit.title}
              style={{
                gridTemplateColumns: '1fr',
                padding: '6px clamp(14px, 2vw, 26px)',
                alignItems: 'start',
              }}
            >
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
