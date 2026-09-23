import Link from 'next/link';
import Image from 'next/image';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, SITE_DOMAIN_LABEL, whatsappLink } from '@/lib/config';

const TIKTOK_URL = 'https://www.tiktok.com/@agotrancoso';
const MAPS_URL = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93a:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu';

export default function Footer() {
  return (
    <footer className="site-footer ago-ideal-footer">
      <div className="footer-shell">
        <div className="ago-footer-top">
          <div className="ago-footer-brand">
            <Link href="/" aria-label="Agô Trancoso, início" className="ago-footer-logo">
              <Image
                src="/logo.png"
                alt="Agô Trancoso"
                width={360}
                height={360}
                sizes="96px"
                quality={82}
              />
            </Link>
            <p className="ago-footer-kicker">Trancoso · Bahia · Brasil</p>
            <h3>Agô Trancoso</h3>
            <p className="ago-footer-description">
              Peças feitas à mão, inspiradas na Bahia e pensadas para decorar, presentear e guardar.
            </p>
          </div>

          <div className="ago-footer-column">
            <h4>Explorar</h4>
            <nav aria-label="Links do rodapé">
              <Link href="/produtos">Coleção</Link>
              <Link href="/nossa-essencia">A Agô</Link>
              <Link href="/contato">Contato</Link>
            </nav>
          </div>

          <div className="ago-footer-column">
            <h4>Fale com a gente</h4>
            <nav aria-label="Redes sociais e contato">
              <a href={whatsappLink('Olá! Vim pelo site da Agô Trancoso.')} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">@{INSTAGRAM_HANDLE}</a>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">TikTok</a>
              <span>{SITE_DOMAIN_LABEL}</span>
            </nav>
          </div>

          <div className="ago-footer-column ago-footer-visit">
            <h4>Visite</h4>
            <p>Você encontra a Agô no Quadrado de Trancoso.</p>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">Abrir no Google Maps</a>
          </div>
        </div>

        <div className="ago-footer-bottom">
          <span>Feitas à mão na Bahia, Brasil.</span>
          <span>© 2026 Agô Trancoso. Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
}
