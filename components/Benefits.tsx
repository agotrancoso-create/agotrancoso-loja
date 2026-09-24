const benefits = [
  ['feito à mão', 'cuidado e tradição em cada detalhe.'],
  ['peças exclusivas', 'escolhas especiais para quem valoriza o feito à mão.'],
  ['inspiração brasileira', 'cores, formas e símbolos da nossa terra.'],
  ['sem fronteiras', 'uma lembrança para qualquer lugar.'],
] as const;

// Recortes da arte original aprovada (2048 × 690). Os símbolos não são redesenhados.
const artwork = { width: 2048, height: 690, cropWidth: 280, cropHeight: 240, top: 140 };
const iconLeft = [80, 580, 1108, 1618] as const;

export default function Benefits() {
  return (
    <section className="benefits-section" aria-labelledby="benefits-title">
      <div className="site-container">
        <div className="benefits-heading">
          <p className="eyebrow">Por que Agô</p>
          <h2 id="benefits-title">Feito para ter história, não pressa.</h2>
        </div>

        <div className="benefits-grid">
          {benefits.map(([title, text], index) => (
            <article className="benefit-item" key={title}>
              <div
                className="benefit-art"
                aria-hidden="true"
                style={{
                  backgroundSize: `${artwork.width / artwork.cropWidth * 100}% ${artwork.height / artwork.cropHeight * 100}%`,
                  backgroundPosition: `${iconLeft[index] / (artwork.width - artwork.cropWidth) * 100}% ${artwork.top / (artwork.height - artwork.cropHeight) * 100}%`,
                }}
              />
              <div className="benefit-copy">
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
