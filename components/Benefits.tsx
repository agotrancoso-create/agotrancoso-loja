const benefits = [
  ['feito à mão', 'Cuidado e tradição em cada detalhe.'],
  ['peças exclusivas', 'Escolhas especiais para quem valoriza o feito à mão.'],
  ['inspiração brasileira', 'Cores, formas e símbolos da nossa terra.'],
  ['Da Bahia para o mundo', 'Envio internacional sob consulta.'],
] as const;

const artwork = { width: 2048, height: 690, cropWidth: 280, cropHeight: 240, top: 140 };
const iconLeft = [80, 580, 1108, 1618] as const;

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference" aria-labelledby="benefits-title">
      <div className="ago-container ago-benefits-reference-inner">
        <h2 id="benefits-title" className="sr-only">Benefícios da Agô Trancoso</h2>

        <div className="ago-benefits-grid">
          {benefits.map(([title, text], index) => (
            <article className="ago-benefit-item" key={title} tabIndex={0}>
              <div className="ago-benefit-symbol" aria-hidden="true">
                <div
                  className="ago-benefit-art"
                  style={{
                    backgroundSize: `${artwork.width / artwork.cropWidth * 100}% ${artwork.height / artwork.cropHeight * 100}%`,
                    backgroundPosition: `${iconLeft[index] / (artwork.width - artwork.cropWidth) * 100}% ${artwork.top / (artwork.height - artwork.cropHeight) * 100}%`,
                  }}
                />
              </div>
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
