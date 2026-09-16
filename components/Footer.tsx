import Link from 'next/link';
import Image from 'next/image';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, SITE_DOMAIN_LABEL, whatsappLink } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="bg-marrom text-areia">
      <div className="max-w-content mx-auto px-5 md:px-8 pt-14 pb-12">
        <div className="flex justify-center mb-10 md:mb-12"><Link href="/" aria-label="Agô Trancoso, início" className="inline-flex"><Image src="/logo.png" alt="Agô Trancoso" width={360} height={360} className="h-24 w-24 md:h-28 md:w-28 object-contain" quality={100} unoptimized /></Link></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div><h3 className="font-serif text-2xl mb-3">Agô Trancoso</h3><p className="text-sm text-areia/80 leading-relaxed font-sans max-w-sm">Cerâmicas, lembranças e detalhes especiais para decorar, presentear e guardar memórias.</p><p className="text-xs text-areia/60 leading-6 mt-4">Frete fixo de R$ 39,90. Compras acima de R$ 500 têm frete grátis.</p></div>
          <div className="font-sans text-sm"><h4 className="uppercase tracking-wide text-xs text-areia/60 mb-3">Navegação</h4><ul className="space-y-2"><li><Link href="/produtos" className="hover:text-areia/70 transition-colors">Coleção</Link></li><li><Link href="/nossa-essencia" className="hover:text-areia/70 transition-colors">Nossa essência</Link></li><li><Link href="/contato" className="hover:text-areia/70 transition-colors">Contato</Link></li></ul></div>
          <div className="font-sans text-sm"><h4 className="uppercase tracking-wide text-xs text-areia/60 mb-3">Fale com a gente</h4><ul className="space-y-2"><li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-areia/70 transition-colors">@{INSTAGRAM_HANDLE}</a></li><li><a href={whatsappLink('Olá! Vim pelo site da Agô Trancoso.')} target="_blank" rel="noopener noreferrer" className="hover:text-areia/70 transition-colors">WhatsApp</a></li><li className="text-areia/60">{SITE_DOMAIN_LABEL}</li></ul></div>
        </div>
      </div>
      <div className="border-t border-areia/10 text-center text-xs text-areia/50 py-5 font-sans">© 2026 Agô Trancoso. Todos os direitos reservados.</div>
    </footer>
  );
}
