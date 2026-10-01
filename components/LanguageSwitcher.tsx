'use client';

import { useLocale } from './LocaleProvider';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const target = locale === 'pt' ? 'en' : 'pt';

  return (
    <button
      type="button"
      className="header-icon ago-language-toggle"
      onClick={() => setLocale(target)}
      aria-label={target === 'en' ? 'Switch site language to English' : 'Mudar idioma do site para português'}
      title={target === 'en' ? 'English' : 'Português'}
      lang={target === 'en' ? 'en' : 'pt-BR'}
    >
      <span aria-hidden="true" style={{ fontSize: '.72rem', fontWeight: 800, letterSpacing: '.04em' }}>{target.toUpperCase()}</span>
    </button>
  );
}
