const benefits = [
  ['feito à mão', 'cuidado e tradição em cada detalhe.'],
  ['peças exclusivas', 'escolhas especiais para quem valoriza o feito à mão.'],
  ['inspiração brasileira', 'cores, formas e símbolos da nossa terra.'],
  ['sem fronteiras', 'Uma lembrança para qualquer lugar.'],
] as const;

const backgroundPositions = ['0%', '33.3333%', '66.6667%', '100%'] as const;

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference" aria-labelledby="benefits-title">
      <div className="ago-container ago-benefits-reference-inner">
        <h2 id="benefits-title" className="sr-only">Diferenciais da Agô Trancoso</h2>

        <div className="ago-benefits-grid">
          {benefits.map(([title, text], index) => (
            <article className="ago-benefit-item" key={title}>
              <div
                className="ago-benefit-art"
                aria-hidden="true"
                style={{ backgroundPosition: `${backgroundPositions[index]} 30%` }}
              />
              <div className="ago-benefit-copy">
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
