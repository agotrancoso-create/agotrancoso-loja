const benefits = [
  ['feito à mão', 'cuidado e tradição em cada detalhe.'],
  ['peças exclusivas', 'escolhas especiais para quem valoriza o feito à mão.'],
  ['inspiração brasileira', 'cores, formas e símbolos da nossa terra.'],
  ['sem fronteiras', 'Uma lembrança para qualquer lugar.'],
] as const;

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference" aria-labelledby="benefits-title">
      <div className="ago-container ago-benefits-reference-inner">
        <h2 id="benefits-title" className="sr-only">Diferenciais da Agô Trancoso</h2>

        <div className="ago-benefits-visual" aria-hidden="true">
          <img
            src="/benefits/benefits-icons.webp"
            alt=""
            width={2048}
            height={690}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="ago-benefits-copy-grid">
          {benefits.map(([title, text]) => (
            <article className="ago-benefit-copy-item" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
