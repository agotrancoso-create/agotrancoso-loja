const benefits = [
  { title: 'Feito à mão', text: 'Peças feitas à mão, com cuidado em cada etapa.', icon: 'hands' },
  { title: 'Peças exclusivas', text: 'No trabalho manual, cada peça tem seus próprios detalhes.', icon: 'vase' },
  { title: 'Inspiração brasileira', text: 'Trancoso, Bahia e referências brasileiras presentes na coleção.', icon: 'star' },
  { title: 'Envio para todo o Brasil', text: 'A gente embala tudo com cuidado para enviar sua peça para qualquer lugar do Brasil.', icon: 'truck' },
] as const;

function BenefitIcon({ type }: { type: (typeof benefits)[number]['icon'] }) {
  if (type === 'hands') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M10 31.5 21.5 43c2.2 2.2 5.7 2.2 7.9 0l11.8-11.8a2.9 2.9 0 0 0-4.1-4.1l-8.3 8.3" />
        <path d="m13.2 28.3 4.6-4.6a3 3 0 0 1 4.3 0l10.7 10.7" />
        <path d="m17.1 24.4 4.8-4.8a3 3 0 0 1 4.3 0l7.6 7.6" />
        <path d="m22 20.7 3.5-3.5a3 3 0 0 1 4.3 0l5.4 5.4" />
        <path d="M50 32.5 42.5 25" />
      </svg>
    );
  }

  if (type === 'vase') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M22 13h20" />
        <path d="M25 13v7c0 3-1.5 5.4-4 7.2-2.5 1.9-3.9 4.4-3.9 7.9v10.3c0 3.7 3 6.7 6.7 6.7h10.4c3.7 0 6.7-3 6.7-6.7V35.1c0-3.5-1.4-6-3.9-7.9-2.5-1.8-4-4.2-4-7.2v-7" />
        <path d="M20.5 39h23" />
      </svg>
    );
  }

  if (type === 'star') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="m32 9 6.8 15.2 16.6 1.7-12.4 10.9 3.5 16.2L32 44.7 17.5 53l3.5-16.2L8.6 25.9l16.6-1.7L32 9Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M8 20h30v25H8z" />
      <path d="M38 28h10l8 8v9H38z" />
      <path d="M14 45a5 5 0 1 0 10 0M43 45a5 5 0 1 0 10 0" />
      <path d="M43 32h8l5 5H43z" />
    </svg>
  );
}

export default function Benefits() {
  return (
    <section className="benefits-strip ago-clean-benefits" aria-label="Diferenciais da Agô Trancoso">
      <div className="ago-clean-container ago-clean-benefits-grid">
        {benefits.map((item) => (
          <div className="ago-clean-benefit" key={item.title}>
            <span className="ago-benefit-icon"><BenefitIcon type={item.icon} /></span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
