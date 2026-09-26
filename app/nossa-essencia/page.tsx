import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: { absolute: 'A Agô | Agô Trancoso' },
  description: 'Conheça a história da Agô Trancoso e as referências de Trancoso, Bahia e do trabalho em cerâmica feito à mão.',
  alternates: { canonical: '/nossa-essencia' },
  openGraph: { title: 'A Agô | Agô Trancoso', description: 'Conheça a história da Agô Trancoso e as referências de Trancoso, Bahia e do trabalho em cerâmica feito à mão.', url: '/nossa-essencia', siteName: 'Agô Trancoso', locale: 'pt_BR', type: 'website' },
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
              <p>A Agô está em Trancoso desde 2016. A igreja, as casas e as cores do Quadrado inspiram parte do nosso acervo.</p>
              <p>Há também objetos para casa, símbolos de fé e outras referências brasileiras.</p>
              <p>O trabalho em cerâmica é manual, com atenção às formas e à pintura.</p>
            </div>
          </section>
          <div className="essencia-image">
            <Image src="/nossa-essencia.jpg" alt="Peças de cerâmica da Agô Trancoso" fill priority className="essencia-image-img" sizes="(max-width: 900px) 100vw, 50vw" quality={92} />
          </div>
        </div>
      </div>
    </div>
  );
}
