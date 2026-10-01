const benefits = [
  { title: 'Feito à mão', text: 'Atenção às formas e à pintura.' },
  { title: 'Peças para guardar', text: 'Objetos para viver e presentear.' },
  { title: 'Inspiração brasileira', text: 'A igreja, as casas e outros símbolos do Brasil.' },
  { title: 'Envio internacional', text: 'Cotação conforme o destino e o pedido.' },
] as const;

const artwork = { width: 2048, height: 690, cropWidth: 280, cropHeight: 240, top: 140 };
const iconLeft = [80, 580, 1108, 1618] as const;

function BenefitIcon({ index }: { index: number }) {
  const left = iconLeft[index] ?? iconLeft[0];

  return (
    <span
      className="ago-benefit-line-icon"
      aria-hidden="true"
      style={{
        width: 'clamp(44px, 4vw, 56px)',
        height: 'clamp(38px, 3.5vw, 48px)',
        border: 0,
        borderRadius: 0,
        overflow: 'hidden',
        color: 'inherit',
      }}
    >
      <svg
        viewBox={`${left} ${artwork.top} ${artwork.cropWidth} ${artwork.cropHeight}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
        aria-hidden="true"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <image href="/benefits/benefits-icons.webp" width={artwork.width} height={artwork.height} />
      </svg>
    </span>
  );
}

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference ago-benefits-icons-2026" aria-label="Por que escolher a Agô Trancoso">
      <div className="ago-container ago-benefits-reference-inner">
        <h2 id="benefits-title" className="sr-only">Por que escolher a Agô Trancoso</h2>
        <ul className="ago-benefits-grid ago-benefits-icon-grid">
          {benefits.map((benefit, index) => (
            <li
              className="ago-benefit-icon-item"
              key={benefit.title}
              style={{ gridTemplateColumns: 'clamp(48px, 5vw, 62px) minmax(0,1fr)' }}
            >
              <BenefitIcon index={index} />
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
