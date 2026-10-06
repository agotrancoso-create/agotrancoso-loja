'use client';
import { useSiteEnglish } from '@/lib/use-site-english';
import Link from 'next/link';

const benefits = [
  { enTitle: 'Handmade', enText: 'Care in every detail.', title: 'Feito à mão', text: 'Cuidado em cada detalhe.', icon: 'craft', href: '/nossa-essencia', action: 'Conhecer o trabalho artesanal da Agô' },
  { enTitle: 'Exclusive pieces', enText: 'Choices that celebrate craftsmanship.', title: 'Peças exclusivas', text: 'Escolhas que valorizam o artesanal.', icon: 'vase', href: '/produtos', action: 'Explorar as peças da coleção' },
  { enTitle: 'Brazilian inspiration', enText: 'Colors and shapes from our homeland.', title: 'Inspiração brasileira', text: 'Cores e formas da nossa terra.', icon: 'brazil', href: '/artesanato-em-trancoso', action: 'Conhecer o artesanato inspirado em Trancoso' },
  { enTitle: 'Shipping across Brazil and abroad', enText: 'Receive your chosen piece wherever you are.', title: 'Envios para o Brasil e exterior', text: 'Receba sua escolha onde estiver.', icon: 'world', href: '/contato', action: 'Consultar a Agô sobre envios para o Brasil e exterior' },
] as const;

type IconName = (typeof benefits)[number]['icon'];

function BenefitIcon({ name }: { name: IconName }) {
  const drawings = {
    craft: <>
      <path d="M18 35.5c4.5-1.2 8.8-4.6 11-9.5 1.2-2.8 2.1-6.3 4.8-6.3 2.1 0 2.8 2.2 2.2 4.2l-1.7 5.8" />
      <path d="M17.8 35.6 14 38.7c-2.9 2.4-2.7 6.9.5 9l7.3 4.8c3.1 2 7 2.3 10.4.8l10.5-4.6c2.6-1.1 4.3-3.7 4.3-6.5v-7.5c0-2.2-1.4-4.2-3.5-4.9-1.6-.5-3.3.1-4.3 1.5l-4 5.8" />
      <path d="m45.5 13 1.1 2.7 2.7 1.1-2.7 1.1-1.1 2.7-1.1-2.7-2.7-1.1 2.7-1.1 1.1-2.7Z" />
    </>,
    vase: <>
      <path d="M25 11h14M27.5 11v7c0 2.6-1.2 4.8-3.5 6.8-4.3 3.7-6.6 9.3-6.1 15 .6 7.1 6.6 12.2 13.7 12.2h.8c7.1 0 13.1-5.1 13.7-12.2.5-5.7-1.8-11.3-6.1-15-2.3-2-3.5-4.2-3.5-6.8v-7" />
      <path d="M21 31c7.3 2.2 14.7 2.2 22 0M20 42c8 2.2 16 2.2 24 0" />
    </>,
    brazil: <>
      <path d="M14 45h36M20 45a12 12 0 0 1 24 0" />
      <path d="M32 12v7M18.6 17.6l4.9 4.9M45.4 17.6l-4.9 4.9M12 31h7M45 31h7" />
      <path d="M25 51h14" />
    </>,
    world: <>
      <circle cx="32" cy="32" r="21" />
      <path d="M11 32h42M32 11c6.2 5.6 9.4 12.6 9.4 21S38.2 47.4 32 53M32 11c-6.2 5.6-9.4 12.6-9.4 21S25.8 47.4 32 53" />
      <path d="M17 21.5h30M17 42.5h30" />
    </>,
  };
  return <svg className={`ago-benefit-svg ago-benefit-svg-${name}`} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{drawings[name]}</svg>;
}

export default function Benefits() {
  const english = useSiteEnglish();
  return (
    <section className="benefits-strip ago-benefits-reference ago-benefits-icons-2026" data-no-translate="true" aria-label={english ? 'Why choose Agô Trancoso' : 'Por que escolher a Agô Trancoso'}>
      <div className="ago-container ago-benefits-reference-inner">
        <h2 id="benefits-title" className="sr-only">{english ? 'Why choose Agô Trancoso' : 'Por que escolher a Agô Trancoso'}</h2>
        <ul className="ago-benefits-grid ago-benefits-icon-grid">
          {benefits.map((benefit) => (
            <li className="ago-benefit-icon-item" key={benefit.title}>
              <Link href={english ? `/en${benefit.href}` : benefit.href} prefetch={false} className={`ago-benefit-line-icon ago-benefit-line-icon-${benefit.icon} ago-benefit-interactive`} aria-label={english ? benefit.enTitle : benefit.action} title={english ? benefit.enTitle : benefit.action}><BenefitIcon name={benefit.icon} /></Link>
              <span className="ago-benefit-icon-copy"><strong>{english ? benefit.enTitle : benefit.title}</strong><small>{english ? benefit.enText : benefit.text}</small></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
