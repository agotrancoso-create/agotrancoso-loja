'use client';

import { useState } from 'react';

export default function ProductShare({ name, url }: { name: string; url: string }) {
  const [message, setMessage] = useState('');
  const [showLink, setShowLink] = useState(false);

  async function share() {
    setMessage('');
    try {
      if (navigator.share) {
        await navigator.share({ title: name, text: `${name} · Agô Trancoso`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setMessage('Link copiado. Cole na conversa ou publicação que preferir.');
    } catch (error) {
      if ((error as Error)?.name === 'AbortError') return;
      setShowLink(true);
      setMessage('Selecione e copie o link abaixo.');
    }
  }

  return <div className="product-share">
    <button type="button" onClick={share}>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8 11 7.8-4.6M8 13l7.8 4.6"/></svg>
      Compartilhar esta peça
    </button>
    <span role="status">{message}</span>
    {showLink && <input aria-label="Link desta peça" readOnly value={url} onFocus={event => event.currentTarget.select()} />}
  </div>;
}
