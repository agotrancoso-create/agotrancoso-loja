const benefits = [
  {
    title: 'feito à mão',
    text: 'cuidado e tradição em cada detalhe',
    icon: (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M17 51c.7-9.1 2.6-18.6 8-24.2 2.4-2.5 5.5-.8 4.6 2.6l-2 8" />
        <path d="M63 51c-.7-9.1-2.6-18.6-8-24.2-2.4-2.5-5.5-.8-4.6 2.6l2 8" />
        <path d="M18 51c1.5 8.2 6.8 15 14.8 15h2.1c3.4 0 5.8-2.3 5.8-5.4 0-3.1-2.4-5.4-5.8-5.4h-4.6" />
        <path d="M62 51c-1.5 8.2-6.8 15-14.8 15h-2.1c-3.4 0-5.8-2.3-5.8-5.4 0-3.1 2.4-5.4 5.8-5.4h4.6" />
        <path d="M40 53.2c-3.2-3-12.1-9.1-12.1-16.3 0-4.2 3-7.2 7-7.2 2.1 0 4 .9 5.1 2.8 1.2-1.9 3-2.8 5.1-2.8 4 0 7 3 7 7.2 0 7.2-8.9 13.3-12.1 16.3L40 54.5l-1-.9Z" />
      </svg>
    ),
  },
  {
    title: 'peças exclusivas',
    text: 'escolhas especiais para quem valoriza o feito à mão.',
    icon: (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M29 11h22" />
        <path d="M30 12c.2 5.1-.3 8.6-3.8 12.2-4 4.1-6.2 8.8-5.7 15.2.5 8.6 6.3 14.8 18.5 16.7 12.2-1.9 18-8.1 18.5-16.7.5-6.4-1.7-11.1-5.7-15.2-3.5-3.6-4-7.1-3.8-12.2" />
        <path d="M21.6 33.2c8.8 4 27.9 4 36.8 0" />
        <path d="M21.3 42c9 3 28.3 3 37.4 0" />
        <circle cx="29" cy="37.6" r="1" />
        <circle cx="36.5" cy="38.4" r="1" />
        <circle cx="44" cy="38.4" r="1" />
        <circle cx="51" cy="37.6" r="1" />
      </svg>
    ),
  },
  {
    title: 'inspiração brasileira',
    text: 'cores, formas e símbolos da nossa terra.',
    icon: (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        {/* Contorno simplificado, mas reconhecível, do território brasileiro. */}
        <path d="M22 10l7 2 4-3 7 5 7-1 4 5 7 1 3 7 6 5-3 7 3 6-5 5-1 9-7 2-3 7-7-2-7 4-7-4-7 1-3-7-6-3 1-8-4-5 4-6-1-8 5-4 1-7 7-1Z" />
        <path d="M23 12c-1 4 1 7 3 10 2 3 1 6-1 9-3 4-1 7 1 10 2 4 2 7 0 11" />
        <path d="M40 14c-3 5-2 9 1 12 3 3 2 6 0 9-3 4-2 7 1 10 3 4 3 7 1 11" />
        <path d="M53 17c-2 3-1 6 2 9 3 3 3 6 1 9-2 3-1 6 2 9" />
      </svg>
    ),
  },
  {
    title: 'envio para todo brasil',
    text: 'receba com segurança na sua casa.',
    icon: (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M9 23h40v33H9z" />
        <path d="M49 32h12l8 11v13H49z" />
        <path d="M21 61a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM58 61a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
        <path d="M49 44h20M4 32h10M2 40h9M6 48h8" />
      </svg>
    ),
  },
];

export default function Benefits() {
  return (
    <section className="benefits-strip" aria-label="Diferenciais da Agô Trancoso">
      <div className="max-w-content mx-auto">
        <div className="features-container">
          {benefits.map((item) => (
            <div className="feature-item" key={item.title}>
              <div className="feature-icon" aria-hidden="true">{item.icon}</div>
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-description">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
