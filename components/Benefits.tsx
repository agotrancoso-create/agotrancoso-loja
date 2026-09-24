const benefits = [
  ['feito à mão', 'cuidado e tradição em cada detalhe.'],
  ['peças exclusivas', 'escolhas especiais para quem valoriza o feito à mão.'],
  ['inspiração brasileira', 'cores, formas e símbolos da nossa terra.'],
  ['sem fronteiras', 'Uma lembrança para qualquer lugar.'],
] as const;

// Pixel bounds in the original 2048 × 690 artwork. Each 280 × 240
// window contains only its symbol, leaving the printed copy and dividers out.
const artwork = { width: 2048, height: 690, cropWidth: 280, cropHeight: 240, top: 140 };
const iconLeft = [80, 580, 1108, 1618] as const;

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
                style={{
                  backgroundSize: `${artwork.width / artwork.cropWidth * 100}% ${artwork.height / artwork.cropHeight * 100}%`,
                  backgroundPosition: `${iconLeft[index] / (artwork.width - artwork.cropWidth) * 100}% ${artwork.top / (artwork.height - artwork.cropHeight) * 100}%`,
                }}
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
