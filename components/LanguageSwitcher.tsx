'use client';

import { useLocale } from './LocaleProvider';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="ago-language-switcher" role="group" aria-label="Idioma do site">
      <button type="button" onClick={() => setLocale('pt')} aria-pressed={locale === 'pt'} lang="pt-BR">PT</button>
      <span aria-hidden="true">/</span>
      <button type="button" onClick={() => setLocale('en')} aria-pressed={locale === 'en'} lang="en">EN</button>
    </div>
  );
}
