'use client';

import Link from 'next/link';
import { useSiteEnglish } from '@/lib/use-site-english';
import { whatsappLink } from '@/lib/config';
import { FIXED_SHIPPING_PRICE, FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';
import styles from './TrancosoJourney.module.css';

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function TrancosoJourney({ variant = 'home' }: { variant?: 'home' | 'homes' | 'memories' }) {
  const en = useSiteEnglish();
  const href = (path: string) => `${en ? '/en' : ''}${path}`;
  const contact = whatsappLink(en
    ? 'Hello! I found Agô online. I would like help choosing ceramics for a home or hospitality project in Trancoso. Can we discuss pieces, quantities and lead times?'
    : 'Olá! Vim pelo site da Agô. Gostaria de ajuda para escolher cerâmicas para uma casa ou projeto de hospedagem em Trancoso. Podemos conversar sobre peças, quantidades e prazos?');

  if (variant === 'homes') return <section data-no-translate="true" id="casas-e-projetos" className={styles.panel} aria-labelledby="homes-title">
    <p className="eyebrow">{en ? 'Homes · Holiday rentals · Guesthouses' : 'Casas · Casas de temporada · Pousadas'}</p>
    <h2 id="homes-title">{en ? 'Choosing pieces for a home in Trancoso?' : 'Escolhendo peças para uma casa em Trancoso?'}</h2>
    <p>{en ? 'For a shelf, a bedside table or a welcome gift: tell us about the space and the pieces you liked. We can help you check dimensions, availability and quantities before you buy.' : 'Para uma estante, uma mesa de cabeceira ou um presente de boas-vindas: conte como é o espaço e quais peças você gostou. Ajudamos a conferir medidas, disponibilidade e quantidades antes da compra.'}</p>
    <div className={styles.actions}><a href={contact} target="_blank" rel="noopener noreferrer" className={styles.button}>{en ? 'Discuss my space on WhatsApp' : 'Conversar sobre meu espaço'}</a><Link href={href('/decoracao-em-ceramica#pecas-decoracao')} className={styles.link}>{en ? 'Choose pieces online' : 'Escolher peças pelo site'} ↗</Link></div>
    <small>{en ? 'For owners, architects and property managers. Quantities, shipping and lead times are confirmed individually.' : 'Para proprietários, arquitetos e administradores. Quantidades, envio e prazos são confirmados em cada atendimento.'}</small>
  </section>;

  if (variant === 'memories') return <section data-no-translate="true" className={styles.panel} aria-labelledby="memories-title">
    <p className="eyebrow">{en ? 'From the trip to your home' : 'Da viagem para a sua casa'}</p>
    <h2 id="memories-title">{en ? 'Back home, still thinking of Trancoso?' : 'A viagem acabou. A lembrança fica.'}</h2>
    <p>{en ? 'Saw a piece at our stall and kept thinking about it? You can order online after your trip. Choose your favourite below and check the photos, dimensions and delivery information on its page.' : 'Viu uma peça na banca e ficou pensando nela? Você pode comprar pelo site mesmo depois da viagem. Escolha sua favorita abaixo e confira fotos, medidas e informações de envio na página da peça.'}</p>
    <p>{en ? `Shipping within Brazil: ${money(FIXED_SHIPPING_PRICE)} via PAC, free from ${money(FREE_SHIPPING_THRESHOLD)} in products, before coupons.` : `Envio para todo o Brasil por PAC: ${money(FIXED_SHIPPING_PRICE)}. Frete grátis a partir de ${money(FREE_SHIPPING_THRESHOLD)} em produtos, antes dos cupons.`}</p>
    <div className={styles.actions}><Link href={href('/lembrancas-de-trancoso#pecas-lembrancas')} className={styles.button}>{en ? 'Find my keepsake' : 'Escolher minha lembrança'}</Link><Link href={href('/envio-internacional')} className={styles.link}>{en ? 'International shipping' : 'Envio internacional'} ↗</Link></div>
  </section>;

  const cards = [
    { label: en ? 'For your home' : 'Para a sua casa', title: en ? 'A place for Trancoso.' : 'Um lugar para Trancoso.', text: en ? 'Ceramic houses, churches and luminaries for shelves, tables and favourite corners.' : 'Casinhas, igrejinhas e luminárias para estantes, mesas e seus cantinhos preferidos.', url: '/decoracao-em-ceramica', action: en ? 'Explore décor' : 'Escolher decoração' },
    { label: en ? 'For the memories' : 'Para matar a saudade', title: en ? 'Keep the Quadrado close.' : 'O Quadrado, pertinho.', text: en ? 'Been here or still dreaming of visiting? Choose a keepsake and order from home.' : 'Já veio ou ainda sonha em conhecer? Escolha uma lembrança e compre de onde estiver.', url: '/lembrancas-de-trancoso', action: en ? 'Explore keepsakes' : 'Escolher uma lembrança' },
    { label: en ? 'While you are here' : 'Para quem está por aqui', title: en ? 'Meet us at the Quadrado.' : 'Encontre a Agô no Quadrado.', text: en ? 'See the pieces at our stall. You can also find your favourites online after your trip.' : 'Veja as peças de perto na banca. Depois da viagem, suas favoritas também estão no site.', url: '/#banca', action: en ? 'Plan your visit' : 'Ver onde estamos' },
  ];
  return <section data-no-translate="true" className={styles.section} aria-labelledby="journey-title"><div className="ago-container">
    <p className="eyebrow">{en ? 'At home, on holiday, in your memories' : 'Em casa, na viagem, na memória'}</p>
    <h2 id="journey-title" className={styles.title}>{en ? 'Trancoso in your home.' : 'Trancoso na sua casa.'}</h2>
    <div className={styles.grid}>{cards.map(card => <Link key={card.url} href={href(card.url)} className={styles.card}><span className={styles.label}>{card.label}</span><h3>{card.title}</h3><p>{card.text}</p><span className={styles.link}>{card.action} <span aria-hidden="true">↗</span></span></Link>)}</div>
    <Link className={styles.projectLink} href={href('/decoracao-em-ceramica#casas-e-projetos')}>{en ? 'Choosing for a home, holiday rental or guesthouse? Talk to Agô.' : 'Escolhendo para uma casa, casa de temporada ou pousada? Fale com a Agô.'} <span aria-hidden="true">↗</span></Link>
  </div></section>;
}
