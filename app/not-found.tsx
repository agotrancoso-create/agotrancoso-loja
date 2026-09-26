import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="site-container py-24 sm:py-32" aria-labelledby="not-found-title">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Página não encontrada</p>
        <h1 id="not-found-title" className="mt-3 font-[var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--coffee)] sm:text-5xl">
          Essa página não está por aqui.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[var(--leather)]">
          Você pode voltar para a coleção e continuar conhecendo as peças da Agô Trancoso.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/produtos" className="btn-primary">Ver coleção</Link>
          <Link href="/" className="btn-secondary">Voltar ao início</Link>
        </div>
      </div>
    </section>
  );
}
