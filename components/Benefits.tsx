const benefits = [
  ['feito à mão', 'cuidado e tradição em cada detalhe.'],
  ['peças exclusivas', 'escolhas especiais para quem valoriza o feito à mão.'],
  ['inspiração brasileira', 'cores, formas e símbolos da nossa terra.'],
  ['SEM FRONTEIRAS', 'Uma lembrança para qualquer lugar.'],
] as const;

const backgroundPositions = ['0%', '33.3333%', '66.6667%', '100%'] as const;

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference" aria-labelledby="benefits-title">
      <div className="ago-container ago-benefits-reference-inner">
        <h2 id="benefits-title" className="sr-only">Diferenciais da Agô Trancoso</h2>

        <div className="ago-benefits-art-grid" aria-hidden="true">
          {backgroundPositions.map((position, index) => (
            <div
              key={position}
              className="ago-benefit-art-tile"
              style={{ backgroundPosition: `${position} center` }}
            />
          ))}
        </div>

        <div className="sr-only">
          {benefits.map(([title, text]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
