import { whatsappLink, INSTAGRAM_URL, INSTAGRAM_HANDLE } from '@/lib/config';

export const metadata = {
  title: 'Contato | Agô Trancoso',
};

export default function ContatoPage() {
  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-16 max-w-xl">
      <h1 className="font-serif text-3xl text-marrom mb-6">Contato</h1>
      <p className="font-sans text-marrom/80 leading-relaxed mb-8">
        Dúvidas sobre uma peça, entrega ou pagamento? Fale com a gente. Para comprar, não é
        necessário enviar mensagem — você pode finalizar o pedido diretamente pelo site.
      </p>

      <div className="space-y-4 font-sans">
        <a
          href={whatsappLink('Olá! Vim pelo site da Agô Trancoso.')}
          target="_blank"
          rel="noopener noreferrer"
          className="block border border-oliva/30 hover:border-terracota px-5 py-4 text-marrom"
        >
          Falar no WhatsApp
        </a>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block border border-oliva/30 hover:border-terracota px-5 py-4 text-marrom"
        >
          @{INSTAGRAM_HANDLE} no Instagram
        </a>
      </div>
    </div>
  );
}
