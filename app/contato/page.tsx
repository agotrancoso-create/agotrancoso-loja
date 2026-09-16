import { whatsappLink, INSTAGRAM_URL, INSTAGRAM_HANDLE } from '@/lib/config';

const mapsUrl = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D';

export const metadata = { title: 'Contato | Agô Trancoso' };

export default function ContatoPage() {
  return (
    <div className="contact-page bg-areia">
      <div className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-[.8fr_1.2fr] gap-12 md:gap-24 items-start">
          <div className="max-w-xl">
            <p className="eyebrow mb-4">Fale com a Agô</p>
            <h1 className="text-5xl md:text-7xl leading-none mb-7">Contato</h1>
            <p className="text-marrom/75 leading-8 text-[15px]">Dúvidas sobre uma peça, entrega ou pagamento? Fale com a gente. Para comprar, não é necessário enviar mensagem: você pode finalizar o pedido diretamente pelo site.</p>
          </div>
          <div>
            <div className="space-y-3">
              <a href={whatsappLink('Olá! Vim pelo site da Agô Trancoso.')} target="_blank" rel="noopener noreferrer" className="info-link" aria-label="Falar com a Agô Trancoso pelo WhatsApp"><span>Falar no WhatsApp</span><span aria-hidden="true">↗</span></a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="info-link" aria-label="Abrir Instagram da Agô Trancoso"><span>@{INSTAGRAM_HANDLE} no Instagram</span><span aria-hidden="true">↗</span></a>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="info-link" aria-label="Abrir localização no Google Maps"><span>Abrir no Google Maps</span><span aria-hidden="true">↗</span></a>
            </div>
            <div className="info-panel mt-12">
              <p className="eyebrow mb-3">Onde encontrar</p>
              <h2 className="font-serif text-3xl text-marrom mb-3">Quadrado de Trancoso</h2>
              <p className="text-sm text-marrom/70 leading-7">Praça São João Batista, Trancoso,<br />Porto Seguro, BA, 46098-000.</p>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex mt-6 bg-marrom text-areia px-6 py-4 text-[10px] font-bold uppercase tracking-[.16em] rounded-sm">Ver localização</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
