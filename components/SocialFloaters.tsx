import { whatsappLink } from '@/lib/config';

export default function SocialFloaters() {
  return (
    <nav className="ago-social-floaters" aria-label="Falar com a Agô Trancoso">
      <a
        href={whatsappLink('Olá! Vim pelo site da Agô Trancoso e gostaria de consultar as peças.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a Agô Trancoso pelo WhatsApp"
        className="ago-social-button ago-social-whatsapp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" shapeRendering="geometricPrecision">
          <path d="M12 3.2a8.55 8.55 0 0 0-7.3 12.95L3.6 20.4l4.38-1.04A8.55 8.55 0 1 0 12 3.2Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M8.65 8.8c.18-.38.37-.4.67-.4.16 0 .32.01.49.02.17.02.34.07.47.37l.62 1.43c.08.18.05.32-.03.45l-.42.57c-.1.13-.19.26-.09.45.11.2.48.77 1.02 1.3.64.62 1.24.84 1.45.95.19.1.3.08.42-.05l.55-.66c.12-.14.25-.16.42-.09l1.41.67c.17.08.28.12.32.2.04.08.04.43-.1.83-.14.4-.78.77-1.08.81-.3.04-.67.06-1.08-.07-.26-.08-.58-.19-1.0-.38-1.73-.76-2.92-2.53-3.01-2.65-.09-.12-.71-.94-.71-1.82 0-.86.46-1.3.63-1.48Z" fill="currentColor" />
        </svg>
      </a>

      <a
        href="https://www.instagram.com/agotrancoso"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir o Instagram da Agô Trancoso"
        className="ago-social-button ago-social-instagram"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" shapeRendering="geometricPrecision">
          <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.4" fill="none" stroke="currentColor" strokeWidth="1.85" />
          <circle cx="12" cy="12" r="3.45" fill="none" stroke="currentColor" strokeWidth="1.85" />
          <circle cx="17.15" cy="6.85" r="1.05" fill="currentColor" />
        </svg>
      </a>
    </nav>
  );
}
