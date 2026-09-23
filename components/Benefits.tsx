const benefits = [
  { title: 'feito à mão', text: 'cada peça passa pelas nossas mãos.', icon: '🤲' },
  { title: 'peças exclusivas', text: 'para quem gosta de peças diferentes.', icon: '🏺' },
  { title: 'inspiração brasileira', text: 'formas que lembram a Bahia.', icon: '🇧🇷' },
  { title: 'envio para todo brasil', text: 'bem embalada para chegar inteira.', icon: '📦' },
] as const;

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference" aria-label="Diferenciais da Agô Trancoso">
      <div className="ago-benefits-reference-grid">
        {benefits.map((item) => (
          <article className="ago-benefit-reference-item" key={item.title}>
            <span className="ago-benefit-reference-icon" aria-hidden="true">
              {item.icon}
            </span>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
