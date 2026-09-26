import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: { absolute: 'A Agô | Agô Trancoso' },
  description: 'Conheça a Agô Trancoso, loja de cerâmica artesanal no Quadrado de Trancoso, e as referências de Trancoso, Bahia, presentes em parte do acervo.',
  alternates: { canonical: '/nossa-essencia' },
  openGraph: { title: 'A Agô | Agô Trancoso', description: 'Conheça a Agô Trancoso, loja de cerâmica artesanal no Quadrado de Trancoso, Bahia.', url: '/nossa-essencia', siteName: 'Agô Trancoso', locale: 'pt_BR', type: 'website' },
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
              <p>A Agô está em Trancoso desde 2016 e reúne uma seleção de peças em cerâmica artesanal.</p>
              <p>A igreja, as casas e as cores do Quadrado inspiram parte do acervo. Há também objetos para casa, símbolos de fé e outras referências brasileiras.</p>
              <p>Na loja e no site, você encontra as peças para conhecer, escolher e comprar.</p>
            </div>
          </section>
          <div className="essencia-image">
            <Image src="/nossa-essencia.jpg" alt="Seleção de peças em cerâmica disponível na Agô Trancoso" fill priority className="essencia-image-img" sizes="(max-width: 900px) 100vw, 50vw" quality={92} />
          </div>
        </div>
      </div>
    </div>
  );
}
