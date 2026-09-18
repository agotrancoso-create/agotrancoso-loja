import { whatsappLink } from '@/lib/config';

export default function SocialFloaters() {
  return (
    <div className="ago-social-floaters" aria-label="Falar com a Agô Trancoso">
      <a
        href={whatsappLink('Olá! Vim pelo site da Agô Trancoso e gostaria de consultar as peças.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a Agô Trancoso pelo WhatsApp"
        className="ago-social-button ago-social-whatsapp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.8a9.2 9.2 0 0 0-7.95 13.82L3.1 21l4.55-1.08A9.2 9.2 0 1 0 12 2.8Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M8.45 8.4c.18-.42.38-.43.7-.44.16 0 .34 0 .52.01.16.01.36.06.5.39l.67 1.56c.08.18.05.32-.03.46l-.46.62c-.1.12-.2.27-.09.47.11.21.5.83 1.08 1.35.75.67 1.38.89 1.59.99.2.1.32.08.44-.05l.6-.72c.13-.15.27-.16.45-.09l1.52.73c.18.08.3.12.34.2.04.08.04.47-.11.91-.15.44-.85.84-1.17.88-.31.04-.71.06-1.15-.08-.27-.08-.62-.2-1.07-.41-1.89-.83-3.13-2.76-3.23-2.88-.1-.13-.77-1.02-.77-1.95 0-.93.49-1.39.67-1.58Z" fill="currentColor" />
        </svg>
      </a>

      <a
        href="https://www.instagram.com/agotrancoso"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir o Instagram da Agô Trancoso"
        className="ago-social-button ago-social-instagram"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="17.3" cy="6.8" r="1" fill="currentColor" />
        </svg>
      </a>
    </div>
  );
}
