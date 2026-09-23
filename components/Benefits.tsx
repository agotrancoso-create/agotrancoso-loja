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
    title: 'SEM FRONTEIRAS',
    text: 'Uma lembrança para qualquer lugar.',
  },
] as const;

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference" aria-labelledby="benefits-title">
      <div className="ago-container ago-benefits-reference-inner">
        <h2 id="benefits-title" className="sr-only">Diferenciais da Agô Trancoso</h2>

        <div className="ago-benefits-reference-art" aria-hidden="true">
          <img
            src="/benefits/benefits-icons.webp"
            alt=""
            width={1180}
            height={250}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="ago-benefits-copy-grid">
          {benefits.map((item) => (
            <article className="ago-benefit-copy-item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
