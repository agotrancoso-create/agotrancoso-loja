import type { Metadata } from 'next';
import Link from 'next/link';
import Image from '@/components/ProductImage';
import { SITE_DOMAIN } from '@/lib/config';

export const metadata: Metadata = {
  title: { absolute: 'A Agô | Agô Trancoso' },
  description: 'Conheça a Agô Trancoso, loja de cerâmica artesanal no Quadrado de Trancoso, e as referências de Trancoso, Bahia, presentes em parte do acervo.',
  alternates: { canonical: '/nossa-essencia' },
  openGraph: { title: 'A Agô | Agô Trancoso', description: 'Conheça a Agô Trancoso, loja de cerâmica artesanal no Quadrado de Trancoso, Bahia.', url: '/nossa-essencia', siteName: 'Agô Trancoso', locale: 'pt_BR', type: 'website', images: [{ url: '/nossa-essencia.jpg', width: 1800, height: 1800, alt: 'Peças de cerâmica da Agô Trancoso' }] },
  twitter: { card: 'summary_large_image', title: 'A Agô | Agô Trancoso', description: 'Seleção de cerâmica artesanal disponível na Agô, no Quadrado de Trancoso.', images: ['/nossa-essencia.jpg'] },
};

export default function NossaEssenciaPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE_DOMAIN}/nossa-essencia#page`,
    url: `${SITE_DOMAIN}/nossa-essencia`,
    name: 'A Agô — Agô Trancoso',
    about: { '@id': `${SITE_DOMAIN}#organization` },
    mainEntity: { '@id': `${SITE_DOMAIN}#organization` },
  };

  return (
    <div className="essencia-page ago-institutional-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <div className="essencia-shell">
        <div className="essencia-grid">
          <section className="essencia-copy">
            <p className="eyebrow">A Agô</p>
            <h1>O que vemos por aqui ganha outra forma.</h1>
            <div className="essencia-text">
              <p>A Agô reúne uma seleção de peças em cerâmica artesanal, com referências de Trancoso e de outras expressões brasileiras.</p>
              <p>A igreja, as casas e as cores do Quadrado inspiram parte do acervo. Há também objetos para casa, símbolos de fé e outras referências brasileiras.</p>
              <p>Na loja e no site, você encontra as peças para conhecer, escolher e comprar.</p>
            </div>
            <div className="institutional-actions">
              <Link href="/produtos" className="button">Ver coleção</Link>
              <Link href="/contato" className="ago-premium-text-link">Visitar ou falar com a Agô <span aria-hidden="true">↗</span></Link>
            </div>
          </section>
          <div className="essencia-image">
            <Image src="/nossa-essencia.jpg" alt="Seleção de peças em cerâmica disponível na Agô Trancoso" fill priority className="essencia-image-img" sizes="(max-width: 900px) 100vw, 50vw" quality={100} />
          </div>
        </div>
      </div>
    </div>
  );
}
