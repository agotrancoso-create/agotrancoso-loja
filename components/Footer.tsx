import Link from 'next/link';
import Image from 'next/image';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, SITE_DOMAIN_LABEL, whatsappLink } from '@/lib/config';

const TIKTOK_URL = 'https://www.tiktok.com/@agotrancoso';

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

          <div className="ago-footer-purchase">
            <span className="ago-footer-mini-label">Envio</span>
            <strong>Frete fixo de R$ 39,90</strong>
            <p>Grátis acima de R$ 500.</p>
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
