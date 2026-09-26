import Link from 'next/link';
import Image from 'next/image';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, SITE_DOMAIN_LABEL, whatsappLink } from '@/lib/config';

const TIKTOK_URL = 'https://www.tiktok.com/@agotrancoso';
const MAPS_URL = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93a:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu';

export default function Footer() {
  return (
    <footer className="site-footer ago-site-footer" aria-label="Rodapé">
      <div className="ago-footer-wrap">
        <div className="ago-footer-main">
          <div className="ago-footer-brand">
            <Link href="/" className="ago-footer-logo" aria-label="Agô Trancoso, início"><Image src="/logo.png" alt="Agô Trancoso" width={88} height={88} sizes="88px" /></Link>
            <p className="ago-footer-place">Trancoso · Bahia · Brasil</p>
            <h2>Agô Trancoso</h2>
            <p className="ago-footer-description">Em Trancoso desde 2016. Cerâmica para a casa, a fé e as lembranças de quem passa por aqui.</p>
          </div>
          <div className="ago-footer-group"><h3>Explorar</h3><nav aria-label="Explorar"><Link href="/produtos">Coleção</Link><Link href="/igrejinha-de-trancoso">Igrejinhas de Trancoso</Link><Link href="/produtos?categoria=trancoso">Trancoso</Link><Link href="/produtos?categoria=decoracao">Casa & decoração</Link><Link href="/produtos?categoria=fe-devocao">Fé & devoção</Link><Link href="/produtos?categoria=presentes">Presentes</Link></nav></div>
          <div className="ago-footer-group"><h3>Fale com a gente</h3><nav aria-label="Contato e redes sociais"><a href={whatsappLink('Olá! Vim pelo site da Agô Trancoso.')} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">@{INSTAGRAM_HANDLE}</a><a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">TikTok</a><span>{SITE_DOMAIN_LABEL}</span></nav></div>
          <div className="ago-footer-group ago-footer-visit-group"><h3>Visite</h3><p>Quadrado de Trancoso<br />Porto Seguro · Bahia</p><a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="ago-footer-map-link">Abrir no Google Maps <span aria-hidden="true">↗</span></a><p>Enviamos para todo o Brasil. Frete grátis acima de R$ 500.</p><a href={whatsappLink('Olá! Gostaria de consultar um envio internacional da Agô Trancoso.')} target="_blank" rel="noopener noreferrer">Envio internacional sob consulta</a></div>
        </div>
        <div className="ago-footer-legal"><div><Link href="/termos">Termos de Uso</Link><Link href="/privacidade">Política de Privacidade</Link></div><span>© 2026 Agô Trancoso. Todos os direitos reservados.</span></div>
      </div>
    </footer>
  );
}
