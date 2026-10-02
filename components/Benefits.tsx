type BenefitIconName = 'hands-heart' | 'vase' | 'brazil' | 'truck';

const benefits: Array<{ icon: BenefitIconName; title: string; text: string }> = [
  { icon: 'hands-heart', title: 'feito à mão', text: 'cuidado artesanal em cada detalhe.' },
  { icon: 'vase', title: 'peças especiais', text: 'escolhas para quem valoriza o feito à mão.' },
  { icon: 'brazil', title: 'inspiração brasileira', text: 'cores, formas e símbolos da nossa terra.' },
  { icon: 'truck', title: 'envio para todo o Brasil', text: 'receba com segurança na sua casa.' },
];

function BenefitIcon({ name }: { name: BenefitIconName }) {
  if (name === 'hands-heart') {
    return (
      <span className="ago-benefit-line-icon" aria-hidden="true">
        <svg viewBox="0 0 80 80" fill="none" focusable="false">
          <path d="M40 34c-5.8-7.5-17-2.2-17 6.5 0 8.6 17 18.2 17 18.2s17-9.6 17-18.2C57 31.8 45.8 26.5 40 34Z" />
          <path d="M18 61c-6.8-5.8-10-12.4-10-20.4V28c0-3.4 5.2-3.6 5.8-.4l2.4 12.9" />
          <path d="M31.5 62.5c-8.1-2.8-14.7-6.9-18.8-12.7-1.8-2.6 2-5.7 4.4-3.6l8.7 7.4" />
          <path d="M62 61c6.8-5.8 10-12.4 10-20.4V28c0-3.4-5.2-3.6-5.8-.4l-2.4 12.9" />
          <path d="M48.5 62.5c8.1-2.8 14.7-6.9 18.8-12.7 1.8-2.6-2-5.7-4.4-3.6l-8.7 7.4" />
        </svg>
      </span>
    );
  }

  if (name === 'vase') {
    return (
      <span className="ago-benefit-line-icon" aria-hidden="true">
        <svg viewBox="0 0 80 80" fill="none" focusable="false">
          <path d="M28 11h24c1.6 0 2.8 1.3 2.5 2.8L53 20H27l-1.5-6.2C25.2 12.3 26.4 11 28 11Z" />
          <path d="M32 20c0 7-3.2 11.5-8 16.6-5.8 6.2-6.1 24.8 6.6 29.9 5.6 2.2 13.2 2.2 18.8 0C62.1 61.4 61.8 42.8 56 36.6 51.2 31.5 48 27 48 20" />
          <path d="M24.5 42.5c7.4-4.8 12.5-1 15.5 2.7 3-3.7 8.1-7.5 15.5-2.7" />
          <path d="M27 52h26" />
          <path d="M30 33h20" />
        </svg>
      </span>
    );
  }

  if (name === 'brazil') {
    return (
      <span className="ago-benefit-line-icon" aria-hidden="true">
        <svg viewBox="0 0 80 80" fill="none" focusable="false">
          <path d="M39 7.5 50 12l2.5 7.5 8 1.8-1 8.6 6.8 5.4-6 7.2 1 8-8.6 4.2-3.5 9.2-9.8 3.9-8.6-5.3-10.2 2.2-6.2-6.9 4.3-9.3-5.5-7.4 5.4-7.2-2-8.5 8.9-3 4.6-9.3Z" />
          <path d="M33 31c4.7 2.4 8.3 6.2 10.7 11.6M29 46c4.4-1.4 9.2-1.2 14.2.7" />
        </svg>
      </span>
    );
  }

  return (
    <span className="ago-benefit-line-icon" aria-hidden="true">
      <svg viewBox="0 0 80 80" fill="none" focusable="false">
        <path d="M10 43h32V24H10v19Z" />
        <path d="M42 43h9V30h9l9 9v4H59" />
        <path d="M22 55a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM59 55a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
        <path d="M29 48h23M8 31H2M8 37H4" />
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
          {benefits.map((benefit) => (
            <li className="ago-benefit-icon-item" key={benefit.title}>
              <BenefitIcon name={benefit.icon} />
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
