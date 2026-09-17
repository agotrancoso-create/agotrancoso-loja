import Link from 'next/link';
import Image from 'next/image';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, SITE_DOMAIN_LABEL, whatsappLink } from '@/lib/config';

const TIKTOK_URL = 'https://www.tiktok.com/@agotrancoso';

export default function Footer() {
  return (
    <footer className="site-footer bg-marrom text-areia">
      <div className="footer-shell">
        <div className="footer-brand"><Link href="/" aria-label="Agô Trancoso, início" className="inline-flex"><Image src="/logo.png" alt="Agô Trancoso" width={360} height={360} className="object-contain" quality={100} unoptimized /></Link></div>
        <div className="footer-grid">
          <div><h3>Agô Trancoso</h3><p>Cerâmicas, lembranças e detalhes especiais para decorar, presentear e guardar memórias.</p><p>Frete fixo de R$ 39,90. Compras acima de R$ 500 têm frete grátis.</p></div>
          <div><h4>Navegação</h4><ul><li><Link href="/produtos">Coleção</Link></li><li><Link href="/nossa-essencia">A Agô</Link></li><li><Link href="/contato">Contato</Link></li></ul></div>
          <div><h4>Fale com a gente</h4><ul><li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">@{INSTAGRAM_HANDLE}</a></li><li><a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">TikTok</a></li><li><a href={whatsappLink('Olá! Vim pelo site da Agô Trancoso.')} target="_blank" rel="noopener noreferrer">WhatsApp</a></li><li>{SITE_DOMAIN_LABEL}</li></ul></div>
        </div>
        <p className="footer-copyright">© 2026 Agô Trancoso. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
