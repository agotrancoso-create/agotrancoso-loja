import Image from 'next/image';

export const metadata = { title: 'A Agô | Agô Trancoso' };

export default function NossaEssenciaPage() {
  return (
    <div className="essencia-page">
      <div className="essencia-shell">
        <div className="essencia-grid">
          <section className="essencia-copy">
            <p className="eyebrow">A Agô</p>
            <h1>O que vemos por aqui ganha outra forma.</h1>
            <div className="essencia-text">
              <p>A Agô nasce da vivência em Trancoso e transforma referências da Bahia em peças para decorar, presentear e guardar.</p>
              <p>Arquitetura, fé, cor, barro e memória aparecem nas formas e nos detalhes que fazem cada peça ter seu lugar dentro de casa.</p>
              <p>A cerâmica está no centro desse trabalho: uma matéria simples, marcada pelas mãos e pelo tempo, que ganha presença em objetos feitos para durar.</p>
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
