import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'A Agô',
  alternates: { canonical: '/nossa-essencia' },
};

export default function NossaEssenciaPage() {
  return (
    <div className="essencia-page">
      <div className="essencia-shell">
        <div className="essencia-grid">
          <section className="essencia-copy">
            <p className="eyebrow">A Agô</p>
            <h1>O que vemos por aqui ganha outra forma.</h1>
            <div className="essencia-text">
              <p>A Agô está em Trancoso desde 2016. Foi dali que vieram muitas das referências que aparecem nas nossas peças.</p>
              <p>A arquitetura, a fé, as cores, o barro e as lembranças desse lugar aparecem nas formas e nos detalhes.</p>
              <p>A cerâmica está no centro de tudo. É um trabalho feito à mão, peça por peça, com o tempo e o cuidado que esse tipo de trabalho pede.</p>
            </div>
          </section>
          <div className="essencia-image">
            <Image src="/nossa-essencia.jpg" alt="Peças de cerâmica da Agô Trancoso" fill className="essencia-image-img" sizes="(max-width: 900px) 100vw, 50vw" quality={82} />
          </div>
        </div>
      </div>
    </div>
  );
}
