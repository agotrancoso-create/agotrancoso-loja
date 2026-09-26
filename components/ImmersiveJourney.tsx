import Image from 'next/image';
import Link from 'next/link';

const steps = [
  {
    index: '01',
    eyebrow: 'O lugar',
    title: 'Trancoso é o começo.',
    text: 'O Quadrado aparece nas formas, nas cores e nas peças que fazem parte da seleção da Agô.',
    image: '/hero.jpg',
    href: '/igrejinha-de-trancoso',
    link: 'Ver peças de Trancoso',
  },
  {
    index: '02',
    eyebrow: 'A seleção',
    title: 'Escolha com calma.',
    text: 'Igrejinhas, objetos para casa, presentes e símbolos de fé reunidos em uma navegação simples e visual.',
    image: '/nossa-essencia.jpg',
    href: '/produtos',
    link: 'Explorar a coleção',
  },
  {
    index: '03',
    eyebrow: 'Sua escolha',
    title: 'Do Quadrado para sua casa.',
    text: 'Veja os detalhes, compare as peças, escolha a sua e finalize a compra sem sair da experiência.',
    image: '/complementar.jpg',
    href: '/produtos',
    link: 'Continuar escolhendo',
  },
];

export default function ImmersiveJourney() {
  return (
    <section className="ago-immersive-journey ago-reveal" aria-labelledby="journey-title">
      <div className="ago-container">
        <div className="ago-immersive-head">
          <div>
            <p className="eyebrow">Uma experiência de Trancoso</p>
            <h2 id="journey-title">Do lugar à peça.</h2>
          </div>
          <p>Role, toque e explore. A história continua sem tirar os produtos do centro da navegação.</p>
        </div>

        <div className="ago-immersive-track">
          {steps.map((step) => (
            <article key={step.index} className="ago-immersive-card">
              <Link href={step.href} className="ago-immersive-card-media" aria-label={`${step.title} ${step.link}`}>
                <Image src={step.image} alt="" fill quality={90} sizes="(max-width: 700px) 88vw, 33vw" />
                <span className="ago-immersive-number">{step.index}</span>
                <span className="ago-immersive-open">Explorar <span aria-hidden="true">↗</span></span>
              </Link>
              <div className="ago-immersive-card-copy">
                <p className="eyebrow">{step.eyebrow}</p>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <Link href={step.href} className="ago-premium-text-link">{step.link} <span aria-hidden="true">↗</span></Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
