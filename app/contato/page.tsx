import type { Metadata } from 'next';
import Link from 'next/link';
import { whatsappLink, INSTAGRAM_URL, INSTAGRAM_HANDLE, SITE_DOMAIN } from '@/lib/config';

const mapsUrl = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93a:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D';

export const metadata: Metadata = {
  title: { absolute: 'Contato | Agô Trancoso' },
  description: 'Fale com a Agô Trancoso, conheça a localização da banca no Quadrado e encontre nossos canais oficiais.',
  alternates: { canonical: '/contato' },
  openGraph: {
    title: 'Contato | Agô Trancoso',
    description: 'Fale com a Agô Trancoso, conheça a localização da banca no Quadrado e encontre nossos canais oficiais.',
    url: '/contato',
    siteName: 'Agô Trancoso',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/nossa-essencia.jpg', width: 1800, height: 1800, alt: 'Cerâmica artesanal da Agô no Quadrado de Trancoso' }],
  },
  twitter: { card: 'summary_large_image', title: 'Contato | Agô Trancoso', description: 'Nossa banca no Quadrado e os canais oficiais da Agô.', images: ['/nossa-essencia.jpg'] },
};

export default function ContatoPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE_DOMAIN}/contato#page`,
    url: `${SITE_DOMAIN}/contato`,
    name: 'Contato — Agô Trancoso',
    about: { '@id': `${SITE_DOMAIN}#organization` },
    mainEntity: { '@id': `${SITE_DOMAIN}#organization` },
  };

  return (
    <div className="contact-page ago-institutional-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <div className="contact-shell">
        <div className="contact-grid">
          <section className="contact-copy">
            <p className="eyebrow">Fale com a Agô</p>
            <h1>Contato</h1>
            <p>Tem dúvida sobre uma peça, entrega ou pagamento? Fale com a gente. Para comprar, você também pode finalizar o pedido direto pelo site.</p>
            <div className="institutional-actions">
              <Link href="/produtos" className="button">Ver coleção</Link>
              <a href={whatsappLink('Olá! Vim pelo site da Agô Trancoso.')} target="_blank" rel="noopener noreferrer" className="ago-premium-text-link">Falar no WhatsApp <span aria-hidden="true">↗</span></a>
            </div>
          </section>

          <section className="contact-actions" aria-label="Canais de contato">
            <div className="contact-links">
              <a href={whatsappLink('Olá! Vim pelo site da Agô Trancoso.')} target="_blank" rel="noopener noreferrer" className="info-link" aria-label="Falar com a Agô Trancoso pelo WhatsApp"><span>Falar no WhatsApp</span><span aria-hidden="true">↗</span></a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="info-link" aria-label="Abrir Instagram da Agô Trancoso"><span>@{INSTAGRAM_HANDLE} no Instagram</span><span aria-hidden="true">↗</span></a>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="info-link" aria-label="Abrir localização no Google Maps"><span>Abrir no Google Maps</span><span aria-hidden="true">↗</span></a>
            </div>

            <div
              className="info-panel contact-location-panel"
              style={{
                borderRadius: '28px',
                overflow: 'hidden',
                clipPath: 'inset(0 round 28px)',
              }}
            >
              <p className="eyebrow">Onde encontrar</p>
              <h2>Quadrado de Trancoso</h2>
              <address className="contact-address">
                <span>Praça São João Batista, Trancoso</span>
                <span>Porto Seguro · Bahia</span>
              </address>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="contact-location-button">Ver localização</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
