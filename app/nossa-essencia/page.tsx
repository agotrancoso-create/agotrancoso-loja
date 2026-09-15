import Image from 'next/image';

export const metadata = {
  title: 'Nossa Essência | Agô Trancoso',
};

export default function NossaEssenciaPage() {
  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-16">
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl text-marrom mb-6">Nossa Essência</h1>
        <div className="font-sans text-marrom/80 leading-relaxed space-y-4">
          <p>A cerâmica está no centro da nossa essência.</p>
          <p>
            Cada peça é feita à mão, inspirada nas formas, histórias e elementos que fazem parte
            de Trancoso.
          </p>
          <p>
            Entre igrejas, casinhas, símbolos de fé e pequenas lembranças, transformamos
            referências da Bahia em objetos para a casa, para presentear e para guardar.
          </p>
        </div>
      </div>
      <div className="relative aspect-video max-w-2xl mt-10 bg-areia border border-oliva/20 overflow-hidden">
        <Image src="/nossa-essencia.jpg" alt="Nossa Essência — Agô Trancoso" fill className="object-contain" quality={100} unoptimized />
      </div>
    </div>
  );
}
