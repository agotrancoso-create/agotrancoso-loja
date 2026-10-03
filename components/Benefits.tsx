import Link from 'next/link';

const benefits = [
  { title: 'Feito à mão', text: 'Cuidado em cada detalhe.', icon: 'craft', href: '/nossa-essencia', action: 'Conhecer o trabalho artesanal da Agô' },
  { title: 'Peças exclusivas', text: 'Escolhas que valorizam o artesanal.', icon: 'vase', href: '/produtos', action: 'Explorar as peças da coleção' },
  { title: 'Inspiração brasileira', text: 'Cores e formas da nossa terra.', icon: 'brazil', href: '/artesanato-em-trancoso', action: 'Conhecer o artesanato inspirado em Trancoso' },
  { title: 'Envios para o Brasil e exterior', text: 'Receba sua escolha onde estiver.', icon: 'world', href: '/contato', action: 'Consultar a Agô sobre envios para o Brasil e exterior' },
] as const;

type IconName = (typeof benefits)[number]['icon'];

function BenefitIcon({ name }: { name: IconName }) {
  const drawings = {
    craft: <>
      <path d="M32 28c-3.4-2.3-10-6.9-10-11.2 0-5.7 7.1-7.5 10-2.6 2.9-4.9 10-3.1 10 2.6 0 4.3-6.6 8.9-10 11.2Z" />
      <path d="M24 54c0-4.1-.4-7.2-3.1-10.6l-6.8-8.5c-1.8-2.3-4.7-.6-3.5 2l4.3 7.3M40 54c0-4.1.4-7.2 3.1-10.6l6.8-8.5c1.8-2.3 4.7-.6 3.5 2l-4.3 7.3" />
      <path d="M10.3 37.4 8.1 24.8c-.6-3.5-4-3.2-3.6.5l1.8 15.1c.4 3.4 2.2 5.6 4.7 8L17 54m36.7-16.6 2.2-12.6c.6-3.5 4-3.2 3.6.5l-1.8 15.1c-.4 3.4-2.2 5.6-4.7 8L47 54M16 55h9m14 0h9" />
    </>,
    vase: <>
      <path d="M16 25c1-5 5-6 7-8 .9-.8.5-2.5 1.4-3.1 1-.7 2.6-.1 3.1-1.1.5-.9-.1-3 1.3-3.5 1.5-.5 5.1-.5 6.5 0 1.4.5.8 2.6 1.3 3.5.5 1 2.1.4 3.1 1.1.9.6.5 2.3 1.4 3.1 2 2 6 3 7 8" />
      <path d="M9 25c.3-2.7 1.7-3.3 2-5 .3-1.6.1-4.1 2-4.1s2.3 2.4 2.5 4.1c.2 1.7 1.4 2.3 1.6 5m30.8 0c.2-2.7 1.4-3.3 1.6-5 .2-1.7.6-4.1 2.5-4.1s1.7 2.5 2 4.1c.3 1.7 1.7 2.3 2 5" />
      <path d="M7 25.8c3.1-.7 7.5-.7 11 0v2.4c-3.5.7-7.9.7-11 0Zm39 0c3.5-.7 7.9-.7 11 0v2.4c-3.1.7-7.5.7-11 0ZM9 29v24m8-24v24m30-24v24m8-24v24M9 53c-2 0-2.7 3.5-.7 4 9 .8 38.4.8 47.4 0 2-.5 1.3-4-.7-4" />
      <path d="M27 57V43c2.7-.8 7.3-.8 10 0v14M26.5 42h11M27 26.8c2.7-.7 7.3-.7 10 0v9.1c-2.7.7-7.3.7-10 0ZM30.4 28.7v5.1m3.2-5.1v5.1M30.4 45v9.4m3.2-9.4v9.4" />
    </>,
    brazil: <>
      <path d="M24.32 6.02Q23.90 4.90 23.20 5.42L22.20 6.18Q21.50 6.70 20.77 6.53L19.73 6.27Q19.00 6.10 18.83 7.29L18.57 9.11Q18.40 10.30 17.88 10.30L17.12 10.30Q16.60 10.30 16.25 9.95L15.75 9.45Q15.40 9.10 14.53 9.27L13.27 9.53Q12.40 9.70 12.40 10.90L12.40 13.90Q12.40 15.10 11.88 15.80L11.12 16.80Q10.60 17.50 9.90 17.67L8.90 17.93Q8.20 18.10 7.88 19.26L7.32 21.24Q7.00 22.40 7.17 23.10L7.43 24.10Q7.60 24.80 7.95 24.80L8.45 24.80Q8.80 24.80 9.32 25.32L10.08 26.08Q10.60 26.60 11.79 26.48L15.41 26.12Q16.60 26.00 17.30 26.87L18.30 28.13Q19.00 29.00 20.02 29.63L22.88 31.37Q23.90 32.00 23.90 32.52L23.90 33.28Q23.90 33.80 24.77 34.32L26.03 35.08Q26.90 35.60 26.90 36.80L26.90 41.00Q26.90 42.20 27.87 42.91L30.13 44.59Q31.10 45.30 31.27 46.49L31.53 48.31Q31.70 49.50 31.00 50.02L30.00 50.78Q29.30 51.30 28.95 52.17L28.45 53.43Q28.10 54.30 28.45 54.30L28.95 54.30Q29.30 54.30 30.00 55.00L31.00 56.00Q31.70 56.70 31.70 57.22L31.70 57.98Q31.70 58.50 32.22 58.50L32.98 58.50Q33.50 58.50 34.26 57.57L38.14 52.83Q38.90 51.90 39.07 50.71L39.33 48.89Q39.50 47.70 40.37 47.00L41.63 46.00Q42.50 45.30 43.65 44.94L47.45 43.76Q48.60 43.40 49.10 42.31L51.10 37.89Q51.60 36.80 51.60 35.60L51.60 32.60Q51.60 31.40 52.40 30.50L55.60 26.90Q56.40 26.00 56.40 24.80L56.40 21.80Q56.40 20.60 55.70 20.43L54.70 20.17Q54.00 20.00 53.17 19.14L51.83 17.76Q51.00 16.90 49.82 16.66L46.18 15.94Q45.00 15.70 44.80 15.35L44.50 14.85Q44.30 14.50 43.16 14.12L40.04 13.08Q38.90 12.70 38.33 11.65L35.87 7.15Q35.30 6.10 34.60 6.97L33.60 8.23Q32.90 9.10 32.20 8.93L31.20 8.67Q30.50 8.50 29.34 8.79L26.86 9.41Q25.70 9.70 25.28 8.58Z" />
    </>,
    world: <>
      <circle cx="32" cy="32" r="23" />
      <path d="M13.1 18.9c3.6.7 5.2 3.6 8 4 2.5.4 3.4-1.7 5.2-.4 1.6 1.2.3 3.4 2.5 4.6l4 2.1c2 1.1 1.5 3.4.2 5.1l-2.4 3.2c-1.5 2 .2 4.5-1.1 6.4l-3.5 4.8c-1.4-2.9-.7-6.1-2.7-8.1l-3.2-3.2c-2-2.1-1.1-4.8.9-6.7l1.1-1.1-2.8-3c-1.1-1.1-3.1-1-4.5-2.2l-3.2-2.7M39.9 10.4l-3.6 5.1c-1.3 1.9-.4 4 1.8 4.6l4.6 1.3c2.1.6 2.8 2.3 2.2 4.3l-1.2 3.9c-.6 1.9.2 3.4 2.2 4l7.2 2.2" />
    </>,
  };
  return <svg className={`ago-benefit-svg ago-benefit-svg-${name}`} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{drawings[name]}</svg>;
}

export default function Benefits() {
  return (
    <section className="benefits-strip ago-benefits-reference ago-benefits-icons-2026" aria-label="Por que escolher a Agô Trancoso">
      <div className="ago-container ago-benefits-reference-inner">
        <h2 id="benefits-title" className="sr-only">Por que escolher a Agô Trancoso</h2>
        <ul className="ago-benefits-grid ago-benefits-icon-grid">
          {benefits.map((benefit) => (
            <li className="ago-benefit-icon-item" key={benefit.title}>
              <Link href={benefit.href} prefetch={false} className={`ago-benefit-line-icon ago-benefit-line-icon-${benefit.icon} ago-benefit-interactive`} aria-label={benefit.action} title={benefit.action}><BenefitIcon name={benefit.icon} /></Link>
              <span className="ago-benefit-icon-copy"><strong>{benefit.title}</strong><small>{benefit.text}</small></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
