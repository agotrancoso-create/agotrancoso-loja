const benefits = [
  { title: 'Feito à mão', text: 'Atenção às formas e à pintura.' },
  { title: 'Peças para guardar', text: 'Objetos para viver e presentear.' },
  { title: 'Inspiração brasileira', text: 'A igreja, as casas e outros símbolos do Brasil.' },
  { title: 'Envio internacional', text: 'Cotação conforme o destino e o pedido.' },
] as const;

const tones = [
  { background: '#f3e3d9', color: '#8a4633' },
  { background: '#efe8c9', color: '#7a5a2d' },
  { background: '#dfe9d8', color: '#476b4c' },
  { background: '#dce8e8', color: '#416773' },
] as const;

function BenefitGlyph({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" focusable="false">
        <path d="M17 35c5-1 7-6 9-11l2-5c.8-2 3.8-1.6 3.6.8l-.6 6.4 3.5-8.5c.8-1.9 3.7-1 3.2 1l-2.2 8 3.8-6.2c1-1.7 3.5-.4 2.7 1.5l-3.2 7.3 2.7-3.6c1.2-1.6 3.6 0 2.5 1.8l-5.4 8.6c-3.2 5-7.9 7.9-13.8 7.9h-4.6c-3.9 0-6.8-3.6-5.9-7.4l.7-2.6Z" />
        <path d="M17 35c-2.3-.3-4.7.1-6.7 1.4M21 43l-1.2 5M34 42l1.5 5" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" focusable="false">
        <path d="M13 44V24.5L28 14l15 10.5V44H13Z" />
        <path d="M22 44V32h12v12M19 28h4M33 28h4" />
        <path d="M28 8.5v5M24.5 11h7" />
        <path d="M9.5 46.5h37" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" focusable="false">
        <path d="M18 13c4.2 3.2 15.8 3.2 20 0" />
        <path d="M21 15v23c0 2.8-1.6 5.4-4 6.7M28 16v26M35 15v23c0 2.8 1.6 5.4 4 6.7" />
        <path d="M17 10.5c3.4 2.3 6.9 3.4 11 3.4s7.6-1.1 11-3.4" />
        <path d="M20.8 27.5c2.6 1.5 4.8 2.2 7.2 2.2s4.6-.7 7.2-2.2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" focusable="false">
      <path d="M13 21.5 28 14l15 7.5-15 7.4-15-7.4Z" />
      <path d="M13 21.5V38l15 8 15-8V21.5M28 29v17" />
      <path d="M37.5 13.5c3.9.7 7.1 3.8 8 7.6M46 12l-.5 9.1-8-3.6" />
      <path d="M18.5 45c-4-.8-7.1-3.9-8-7.6M10 46.5l.5-9.1 8 3.6" />
    </svg>
  );
}

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference ago-benefits-icons-2026" aria-label="Por que escolher a Agô Trancoso">
      <div className="ago-container ago-benefits-reference-inner">
        <h2 id="benefits-title" className="sr-only">Por que escolher a Agô Trancoso</h2>
        <ul className="ago-benefits-grid ago-benefits-icon-grid">
          {benefits.map((benefit, index) => {
            const tone = tones[index] ?? tones[0];
            return (
              <li
                className="ago-benefit-icon-item"
                key={benefit.title}
                style={{ gridTemplateColumns: 'clamp(50px, 5vw, 60px) minmax(0,1fr)' }}
              >
                <span
                  className="ago-benefit-line-icon"
                  aria-hidden="true"
                  style={{
                    width: 'clamp(44px, 4vw, 52px)',
                    height: 'clamp(44px, 4vw, 52px)',
                    border: 0,
                    borderRadius: '15px',
                    background: tone.background,
                    color: tone.color,
                    boxShadow: 'inset 0 0 0 1px rgba(53,36,29,.06)',
                    transform: index % 2 === 0 ? 'rotate(-1.2deg)' : 'rotate(1.2deg)',
                  }}
                >
                  <span style={{ width: '72%', height: '72%', display: 'grid', placeItems: 'center' }}>
                    <BenefitGlyph index={index} />
                  </span>
                </span>
                <span className="ago-benefit-icon-copy">
                  <strong>{benefit.title}</strong>
                  <small>{benefit.text}</small>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
