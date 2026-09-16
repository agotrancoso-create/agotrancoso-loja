import {
  whatsappLink,
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
} from '@/lib/config';

const mapsUrl =
  'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D';

export const metadata = {
  title: 'Contato | Agô Trancoso',
};

export default function ContatoPage() {
  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-16">
      <div className="max-w-2xl">
        <p className="eyebrow mb-4">Fale com a Agô</p>

        <h1 className="font-serif text-4xl md:text-5xl text-marrom mb-6">
          Contato
        </h1>

        <p className="font-sans text-marrom/80 leading-relaxed mb-10">
          Dúvidas sobre uma peça, entrega ou pagamento? Fale com a gente.
          Para comprar, não é necessário enviar mensagem, você pode finalizar
          o pedido diretamente pelo site.
        </p>

        <div className="space-y-4 font-sans">
          <a
            href={whatsappLink(
              'Olá! Vim pelo site da Agô Trancoso.',
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-oliva/30 hover:border-terracota px-5 py-4 text-marrom transition-colors"
          >
            Falar no WhatsApp
          </a>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-oliva/30 hover:border-terracota px-5 py-4 text-marrom transition-colors"
          >
            @{INSTAGRAM_HANDLE} no Instagram
          </a>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-oliva/30 hover:border-terracota px-5 py-4 text-marrom transition-colors"
          >
            Abrir no Google Maps
          </a>
        </div>

        <div className="mt-12 pt-8 border-t border-oliva/20">
          <p className="eyebrow mb-3">
            Onde encontrar
          </p>

          <h2 className="font-serif text-2xl text-marrom mb-3">
            Quadrado de Trancoso
          </h2>

          <p className="font-sans text-sm text-marrom/70 leading-relaxed">
            Praça São João Batista, Trancoso,
            <br />
            Porto Seguro, BA, 46098-000.
          </p>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex mt-5 bg-marrom text-areia px-6 py-4 text-[10px] font-bold uppercase tracking-[.16em]"
          >
            Ver localização
          </a>
        </div>
      </div>
    </div>
  );
}
