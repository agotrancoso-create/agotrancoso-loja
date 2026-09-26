'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Storefront rendering error:', error);
  }, [error]);

  return (
    <section className="site-container py-24 sm:py-32" aria-labelledby="error-title">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Não foi possível carregar</p>
        <h1 id="error-title" className="mt-3 font-[var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--coffee)] sm:text-5xl">
          Tivemos um imprevisto nesta página.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[var(--leather)]">
          Tente carregar novamente. Se preferir, você também pode voltar para a coleção.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--terracotta)] px-6 text-sm font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terracotta)]">
            Tentar novamente
          </button>
          <Link href="/produtos" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[color:rgba(66,41,31,0.22)] px-6 text-sm font-bold text-[var(--coffee)] transition-colors hover:bg-[var(--sand)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terracotta)]">
            Ver coleção
          </Link>
        </div>
      </div>
    </section>
  );
}
