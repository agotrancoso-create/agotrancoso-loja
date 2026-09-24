import Link from 'next/link';
import Image from 'next/image';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, whatsappLink } from '@/lib/config';

const TIKTOK_URL = 'https://www.tiktok.com/@agotrancoso';
const MAPS_URL = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93a:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu';

export default function Footer() {
  return (
    <footer className="site-footer" aria-label="Rodapé">
      <div className="site-container footer-top">
        <div className="footer-brand">
          <Link href="/" className="footer-logo" aria-label="Agô Trancoso — início">
            <Image src="/logo.png" alt="Agô Trancoso" width={92} height={92} sizes="84px" />
          </Link>
          <p className="eyebrow eyebrow-light">Trancoso · Bahia · Brasil</p>
          <h2>Feita daqui. Para ir com você.</h2>
          <p>Cerâmica brasileira para casa, fé e presente. Trancoso é o nosso principal ponto de partida — não o limite.</p>
        </div>

        <div className="footer-nav-grid">
          <div className="footer-group">
            <h3>Comprar</h3>
            <nav aria-label="Comprar">
              <Link href="/produtos">Coleção</Link>
              <Link href="/produtos?categoria=trancoso">Trancoso</Link>
              <Link href="/produtos?categoria=decoracao">Casa</Link>
              <Link href="/produtos?categoria=fe-devocao">Fé</Link>
              <Link href="/produtos?categoria=presentes">Presentes</Link>
            </nav>
          </div>

          <div className="footer-group">
            <h3>Agô</h3>
            <nav aria-label="Sobre a Agô">
              <Link href="/nossa-essencia">A marca</Link>
              <Link href="/contato">Contato</Link>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">@{INSTAGRAM_HANDLE} <span aria-hidden="true">↗</span></a>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">TikTok <span aria-hidden="true">↗</span></a>
            </nav>
          </div>

          <div className="footer-group">
            <h3>Quadrado</h3>
            <p>Porto Seguro · Bahia</p>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">Abrir no mapa <span aria-hidden="true">↗</span></a>
            <a href={whatsappLink('Olá! Vim pelo site da Agô Trancoso.')} target="_blank" rel="noopener noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
          </div>

          <div className="footer-group">
            <h3>Outros destinos</h3>
            <p>Envio internacional sob consulta, conforme destino e escolha.</p>
            <a href={whatsappLink('Olá! Gostaria de consultar um envio internacional da Agô Trancoso.')} target="_blank" rel="noopener noreferrer">Consultar envio <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>

      <div className="site-container footer-bottom">
        <div className="footer-legal-links">
          <Link href="/termos">Termos</Link>
          <Link href="/privacidade">Privacidade</Link>
        </div>
        <span>© 2026 Agô Trancoso.</span>
      </div>
    </footer>
  );
}
