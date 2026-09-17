const benefits = [
  {
    title: 'Feito à mão',
    text: 'Afeto, calma e a riqueza do trabalho artesanal em cada detalhe.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 37.5C18.2 32.7 10.2 27.8 10.2 20.1c0-4.5 3.2-7.7 7.3-7.7 2.9 0 5.3 1.7 6.5 4.2 1.2-2.5 3.6-4.2 6.5-4.2 4.1 0 7.3 3.2 7.3 7.7 0 7.7-8 12.6-13.8 17.4Z" />
        <path d="M24 16.7c-1.7-5.2-5.3-8.1-9.1-8.5M24 16.7c1.7-5.2 5.3-8.1 9.1-8.5" />
        <path d="M14.9 8.2c-2.1-.5-4.1.2-5.4 1.8M33.1 8.2c2.1-.5 4.1.2 5.4 1.8" />
      </svg>
    ),
  },
  {
    title: 'Peças exclusivas',
    text: 'Cerâmicas e objetos com formas marcantes e presença própria.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 11h14l-2.2 5.2c-.8 1.8-1.2 3.8-1.2 5.8v2.4c0 2.4 1.1 4.4 3.1 6.1 2.2 1.8 3.3 4.2 3.3 7.1H13c0-2.9 1.1-5.3 3.3-7.1 2-1.7 3.1-3.7 3.1-6.1V22c0-2-.4-4-1.2-5.8L17 11Z" />
        <path d="M16 11h-3.5c-2.5 0-4.5 2-4.5 4.5S10 20 12.5 20H16M32 11h3.5c2.5 0 4.5 2 4.5 4.5S38 20 35.5 20H32" />
        <path d="M15 37.5h18M18 27h12" />
      </svg>
    ),
  },
  {
    title: 'Inspiração brasileira',
    text: 'Cores, formas e símbolos inspirados na cultura e energia do nosso país.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M25.8 6.8 29 11l5.3.2 1.7 4.5 4.1 2.8-2 4.9 1.5 4.9-4.3 2.5-2 4.9-5.2-.2-3.7 3.8-4.2-2.7-5.2.7-1.7-4.5-4.3-2.8 1.5-4.9-2-4.7 4.1-2.8 1.7-4.6 5.3-.1 3.7-4.2Z" />
        <path d="M21 30c-1.5-3.2-1.2-7 1-9.8 2.1-2.7 5.3-4.1 8.5-3.7-1 3.1-2.9 5.9-5.4 8.2-2.1 1.9-4.4 3.3-7 4.2" />
        <path d="M18.3 31.5c3.1-1.1 5.9-2.9 8.3-5.3" />
      </svg>
    ),
  },
  {
    title: 'Envio para todo o Brasil',
    text: 'Embalagem reforçada para sua peça chegar impecável em todo o Brasil.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 12.5h23v18H6z" />
        <path d="M29 19h6.2l6.8 6.4v5.1H29z" />
        <path d="M35.2 19v6.4H42" />
        <circle cx="13" cy="34.5" r="3.5" />
        <circle cx="35.5" cy="34.5" r="3.5" />
        <path d="M6 30.5h3M29 30.5h-3M39 15.5c-2.1-2.1-4.5-3.4-7.3-4.1M39 15.5l-.7-4.2M39 15.5l-4.2-.7" />
      </svg>
    ),
  },
];

export default function Benefits() {
  return (
    <section className="benefits-strip benefits-reference" aria-label="Diferenciais da Agô Trancoso">
      <div className="benefits-container">
        {benefits.map((item) => (
          <div className="benefit-card" key={item.title}>
            <div className="benefit-icon">{item.icon}</div>
            <h3 className="benefit-title">{item.title}</h3>
            <p className="benefit-desc">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
