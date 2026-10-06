'use client';

import Link from 'next/link';
import { useSiteEnglish } from '@/lib/use-site-english';

export default function NotFound() {
  const english = useSiteEnglish();
  return (
    <section data-no-translate="true" className="site-container py-24 sm:py-32" aria-labelledby="not-found-title">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">{english ? 'Page not found' : 'Página não encontrada'}</p>
        <h1 id="not-found-title" className="mt-3 font-[var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--coffee)] sm:text-5xl">
          {english ? 'We couldn’t find this page.' : 'Essa página não está por aqui.'}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[var(--leather)]">
          {english ? 'Return to the collection to explore the pieces from Agô Trancoso.' : 'Você pode voltar para a coleção e continuar conhecendo as peças da Agô Trancoso.'}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={english ? '/en/produtos' : '/produtos'} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--terracotta)] px-6 text-sm font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terracotta)]">{english ? 'View collection' : 'Ver coleção'}</Link>
          <Link href={english ? '/en' : '/'} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[color:rgba(66,41,31,0.22)] px-6 text-sm font-bold text-[var(--coffee)] transition-colors hover:bg-[var(--sand)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terracotta)]">{english ? 'Back to home' : 'Voltar ao início'}</Link>
        </div>
      </div>
    </section>
  );
}
