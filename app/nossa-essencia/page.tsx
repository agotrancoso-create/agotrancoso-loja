import Image from 'next/image';

export const metadata = { title: 'A Agô | Agô Trancoso' };

export default function NossaEssenciaPage() {
  return (
    <div className="essencia-page">
      <div className="essencia-shell">
        <div className="essencia-grid">
          <section className="essencia-copy">
            <p className="eyebrow">A Agô</p>
            <h1>O encanto de Trancoso</h1>
            <div className="essencia-text">
              <p>Peças feitas à mão que traduzem referências de Trancoso em objetos para decorar, presentear e guardar.</p>
              <p>Cada peça nasce de formas, símbolos e detalhes que fazem parte desse universo e ganham nova presença dentro de casa.</p>
              <p>A cerâmica está no centro da nossa essência: uma matéria que transforma referências em objetos de presença e permanência.</p>
            </div>
          </section>
          <div className="essencia-image">
            <Image src="/nossa-essencia.jpg" alt="Peças de cerâmica da Agô Trancoso" fill className="essencia-image-img" quality={100} unoptimized />
          </div>
        </div>
      </div>
    </div>
  );
}
