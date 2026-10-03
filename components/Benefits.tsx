import { Globe2, HeartHandshake, Sparkles, Sun, type LucideIcon } from 'lucide-react';

const benefits: Array<{
  title: string;
  text: string;
  icon: LucideIcon;
  iconClass: string;
}> = [
  { title: 'Feito à mão', text: 'Cuidado em cada detalhe.', icon: HeartHandshake, iconClass: 'care' },
  { title: 'Peças exclusivas', text: 'Escolhas que valorizam o artesanal.', icon: Sparkles, iconClass: 'exclusive' },
  { title: 'Inspiração brasileira', text: 'Cores e formas da nossa terra.', icon: Sun, iconClass: 'brazil' },
  { title: 'Envios para o Brasil e exterior', text: 'Receba sua escolha onde estiver.', icon: Globe2, iconClass: 'world' },
];

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference ago-benefits-icons-2026" aria-label="Por que escolher a Agô Trancoso">
      <div className="ago-container ago-benefits-reference-inner">
        <h2 id="benefits-title" className="sr-only">Por que escolher a Agô Trancoso</h2>
        <ul className="ago-benefits-grid ago-benefits-icon-grid">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <li className="ago-benefit-icon-item" key={benefit.title}>
                <span className={`ago-benefit-line-icon ago-benefit-line-icon-${benefit.iconClass}`} aria-hidden="true">
                  <Icon
                    className="ago-benefit-svg"
                    size={56}
                    strokeWidth={1.5}
                    absoluteStrokeWidth
                    aria-hidden="true"
                  />
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
