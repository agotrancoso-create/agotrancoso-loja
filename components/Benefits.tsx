const benefits = [
  {
    title: 'feito à mão',
    text: 'cuidado e tradição em cada detalhe.',
  },
  {
    title: 'peças exclusivas',
    text: 'escolhas especiais para quem valoriza o feito à mão.',
  },
  {
    title: 'inspiração brasileira',
    text: 'cores, formas e símbolos da nossa terra.',
  },
  {
    title: 'sem fronteiras',
    text: 'uma lembrança para qualquer lugar.',
  },
] as const;

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference" aria-label="Diferenciais da Agô Trancoso">
      <div className="ago-benefits-image">
        <img src="/benefits/benefits-icons.webp" alt="" aria-hidden="true" />
      </div>

      <div className="ago-benefits-copy-grid">
        {benefits.map((item) => (
          <article className="ago-benefit-copy-item" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
