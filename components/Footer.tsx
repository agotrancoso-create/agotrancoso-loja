'use client';

import Link from 'next/link';
import Image from 'next/image';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, INTERNATIONAL_SHIPPING_PATH, whatsappLink } from '@/lib/config';
import { useSiteEnglish } from '@/lib/use-site-english';

const TIKTOK_URL = 'https://www.tiktok.com/@agotrancoso';
const MAPS_URL = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93a:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu';

export default function Footer() {
  const english = useSiteEnglish();
  const href = (path: string) => english ? (path === '/' ? '/en' : `/en${path}`) : path;
  return (
    <footer className="site-footer ago-site-footer" aria-label={english ? 'Footer' : 'Rodapé'}>
      <div className="ago-footer-wrap">
        <div className="ago-footer-main">
          <div className="ago-footer-brand">
            <Link href={href('/')} className="ago-footer-logo" aria-label={english ? 'Agô Trancoso, home' : 'Agô Trancoso, início'}><Image src="/logo.png" alt="Agô Trancoso" width={88} height={88} sizes="88px" /></Link>
            <p className="ago-footer-place">{english ? 'Trancoso · Bahia · Brazil' : 'Trancoso · Bahia · Brasil'}</p>
            <h2>Agô Trancoso</h2>
            <p className="ago-footer-description">{english ? 'Since 2016 in the Quadrado.' : 'Desde 2016 no Quadrado.'}</p>
          </div>
          <div className="ago-footer-group"><h3>{english ? 'Explore' : 'Explorar'}</h3><nav aria-label={english ? 'Explore' : 'Explorar'}><Link href={href('/produtos')}>{english ? 'Collection' : 'Coleção'}</Link><Link href={href('/igrejinha-de-trancoso')}>{english ? 'Trancoso churches' : 'Igrejinhas de Trancoso'}</Link><Link href={href('/trancoso')}>Trancoso</Link><Link href={href('/decoracao-em-ceramica')}>{english ? 'Home & decor' : 'Casa & decoração'}</Link><Link href={href('/produtos?categoria=fe-devocao')}>{english ? 'Faith & devotion' : 'Fé & devoção'}</Link><Link href={href('/lembrancas-de-trancoso')}>{english ? 'Gifts & keepsakes' : 'Presentes e lembranças'}</Link></nav></div>
          <div className="ago-footer-group"><h3>{english ? 'Contact us' : 'Fale com a gente'}</h3><nav aria-label={english ? 'Contact and social media' : 'Contato e redes sociais'}><a href={whatsappLink('Olá! Vim pelo site da Agô Trancoso.')} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">@{INSTAGRAM_HANDLE}</a><a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">TikTok</a></nav></div>
          <div className="ago-footer-group ago-footer-visit-group"><h3>{english ? 'Visit' : 'Visite'}</h3><p>Quadrado de Trancoso<br />Porto Seguro · Bahia</p><a href={MAPS_URL} target="_blank" rel="noopener noreferrer" data-google-ads-route="true" className="ago-footer-map-link">{english ? 'Open in Google Maps' : 'Abrir no Google Maps'} <span aria-hidden="true">↗</span></a><p>{english ? 'We ship throughout Brazil. Free shipping in Brazil on R$ 500 or more in products.' : 'Enviamos para todo o Brasil. Frete grátis a partir de R$ 500 em produtos.'}</p><Link href={href(INTERNATIONAL_SHIPPING_PATH)}>{english ? 'International shipping to more than 200 countries' : 'Envio internacional para mais de 200 países'}</Link></div>
        </div>
        <div className="ago-footer-legal"><div><Link href={href('/termos')}>{english ? 'Terms of Use' : 'Termos de Uso'}</Link><Link href={href('/privacidade')}>{english ? 'Privacy Policy' : 'Política de Privacidade'}</Link></div><span>{english ? '© 2026 Agô Trancoso. All rights reserved.' : '© 2026 Agô Trancoso. Todos os direitos reservados.'}</span></div>
      </div>
    </footer>
  );
}
