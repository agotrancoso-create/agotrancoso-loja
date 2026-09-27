'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Agô global rendering error:', error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, background: '#fbf5eb', color: '#3d2a22', fontFamily: 'Arial, sans-serif' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '32px 20px' }}>
          <section style={{ width: 'min(620px, 100%)', textAlign: 'center' }} aria-labelledby="global-error-title">
            <p style={{ margin: '0 0 12px', color: '#875038', fontSize: 12, fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase' }}>Agô Trancoso</p>
            <h1 id="global-error-title" style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 'clamp(34px, 7vw, 58px)', lineHeight: 1.04, fontWeight: 600 }}>
              Não foi possível carregar a loja agora.
            </h1>
            <p style={{ margin: '20px auto 0', maxWidth: 520, color: '#6c554a', fontSize: 16, lineHeight: 1.7 }}>
              Tente novamente. Se a conexão tiver oscilado, a página será reconstruída sem perder sua navegação.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{ marginTop: 28, minHeight: 48, border: 0, borderRadius: 999, padding: '0 24px', background: '#875038', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}
            >
              Tentar novamente
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
