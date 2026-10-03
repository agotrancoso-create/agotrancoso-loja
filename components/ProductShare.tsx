'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function ProductShare({ name, url }: { name: string; url: string }) {
  const pathname = usePathname();
  const [english, setEnglish] = useState(false);
  const [message, setMessage] = useState('');
  const [showLink, setShowLink] = useState(false);
  useEffect(() => { setEnglish(pathname.startsWith('/en/') || document.documentElement.lang === 'en'); }, [pathname]);
  const shareUrl = english ? url.replace('/produtos/', '/en/produtos/') : url;

  async function share() {
    setMessage('');
    setShowLink(false);
    try {
      if (navigator.share) {
        await navigator.share({ title: name, text: `${name} · Agô Trancoso`, url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setMessage(english ? 'Link copied. Paste it into your conversation or post.' : 'Link copiado. Cole na conversa ou publicação que preferir.');
    } catch (error) {
      if ((error as Error)?.name === 'AbortError') return;
      setShowLink(true);
      setMessage(english ? 'Select and copy the link below.' : 'Selecione e copie o link abaixo.');
    }
  }

  return <div className="product-share" data-no-translate="true">
    <button type="button" onClick={share}>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8 11 7.8-4.6M8 13l7.8 4.6"/></svg>
      {english ? 'Share this piece' : 'Compartilhar esta peça'}
    </button>
    <a className="product-share-whatsapp" href={`https://wa.me/?text=${encodeURIComponent(`${name} · Agô Trancoso\n${shareUrl}`)}`} target="_blank" rel="noopener noreferrer">{english ? 'Send on WhatsApp' : 'Enviar pelo WhatsApp'}</a>
    <span role="status">{message}</span>
    {showLink && <input aria-label={english ? 'Link to this piece' : 'Link desta peça'} readOnly value={shareUrl} onFocus={event => event.currentTarget.select()} />}
  </div>;
}
