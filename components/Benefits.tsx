import Link from 'next/link';
const benefits = [
  ['feito à mão', 'Cuidado e tradição em cada detalhe.'],
  ['peças exclusivas', 'Escolhas especiais para quem valoriza o feito à mão.'],
  ['inspiração brasileira', 'Cores, formas e símbolos da nossa terra.'],
  ['envio internacional', 'Enviamos para outros países sob consulta.'],
] as const;

const details = [
  ['Conheça o trabalho em cerâmica e as referências que fazem parte da Agô.', '/nossa-essencia', 'Conhecer a Agô'],
  ['Encontre peças para casa, fé e presentes na nossa coleção.', '/produtos', 'Explorar peças'],
  ['Trancoso é uma das principais inspirações de uma coleção que percorre outros símbolos brasileiros.', '/produtos?categoria=trancoso', 'Ver Trancoso'],
  ['Fazemos envios internacionais sob consulta, com cotação de acordo com o destino.', '/contato', 'Consultar envio'],
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
