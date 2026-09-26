import Link from 'next/link';
const benefits = [
  ['feito à mão', 'Atenção às formas e à pintura.'],
  ['peças exclusivas', 'Igrejinhas, objetos para casa e presentes.'],
  ['inspiração brasileira', 'A igreja, as casas e outros símbolos do Brasil.'],
  ['envio internacional', 'Cotação conforme o destino e o pedido.'],
] as const;

const details = [
  ['Conheça a Agô e o que inspira nossa escolha de objetos.', '/nossa-essencia', 'Conhecer a Agô'],
  ['Veja o acervo completo, dos menores presentes às esculturas.', '/produtos', 'Explorar coleção'],
  ['Veja as formas e cores que lembram o Quadrado.', '/produtos?categoria=trancoso', 'Ver Trancoso'],
  ['Para entregas fora do Brasil, fale com a gente antes de comprar.', '/contato', 'Consultar envio'],
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
            <details className="ago-benefit-item" key={title}>
              <summary>
                <div className="ago-benefit-symbol" aria-hidden="true">
                  <div className="ago-benefit-art" style={{ backgroundSize: `${artwork.width / artwork.cropWidth * 100}% ${artwork.height / artwork.cropHeight * 100}%`, backgroundPosition: `${iconLeft[index] / (artwork.width - artwork.cropWidth) * 100}% ${artwork.top / (artwork.height - artwork.cropHeight) * 100}%` }} />
                </div>
                <div className="ago-benefit-copy"><h3>{title}</h3><p>{text}</p></div>
                <span className="ago-benefit-more">Saiba mais</span>
              </summary>
              <p className="ago-benefit-detail">{details[index][0]}<br /><Link href={details[index][1]}>{details[index][2]}</Link></p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
