import Image from 'next/image';

export const metadata = { title: 'A Agô | Agô Trancoso' };

export default function NossaEssenciaPage() {
  return (
    <div className="info-page bg-areia">
      <div className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-[.9fr_1.1fr] gap-12 md:gap-20 items-center">
          <div className="max-w-xl">
            <p className="eyebrow mb-4">A Agô</p>
            <h1 className="text-5xl md:text-7xl leading-none mb-8">O encanto de Trancoso</h1>
            <div className="text-marrom/75 leading-8 space-y-5 text-[15px]">
              <p>Peças feitas à mão que traduzem referências de Trancoso em objetos para decorar, presentear e guardar.</p>
              <p>Cada peça nasce de formas, símbolos e detalhes que fazem parte desse universo e ganham nova presença dentro de casa.</p>
              <p>A cerâmica está no centro da nossa essência: uma matéria que transforma referências em objetos de presença e permanência.</p>
            </div>
          </div>
          <div className="editorial-image aspect-[4/3] bg-areia overflow-hidden">
            <Image src="/nossa-essencia.jpg" alt="Peças de cerâmica da Agô Trancoso" fill className="object-cover" quality={100} unoptimized />
          </div>
        </div>
      </div>
    </div>
  );
}
