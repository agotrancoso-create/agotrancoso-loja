const benefits = [
  {
    title: 'feito à mão',
    text: 'cuidado e tradição em cada detalhe',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M10 43c1.2-7.1 3.5-14.2 8.7-19.4 2.7-2.7 6.2-1.7 5.4 2.1l-2.3 7.7" />
        <path d="M54 43c1.2-7.1-3.5-14.2-8.7-19.4-2.7-2.7-6.2-1.7-5.4 2.1l2.3 7.7" />
        <path d="M11 43c1.2 8.1 5.9 13.5 13 13.5h3.1c3.1 0 5.1-2 5.1-4.8 0-2.7-2-4.6-5.1-4.6h-4.5" />
        <path d="M53 43c-1.2 8.1-5.9 13.5-13 13.5h-3.1c-3.1 0-5.1-2-5.1-4.8 0-2.7 2-4.6 5.1-4.6h4.5" />
        <path d="M32 43.8c-2.4-2.3-9.3-7.8-9.3-13.1 0-3.5 2.5-5.8 5.7-5.8 1.7 0 3.2.8 4.2 2.2 1-1.4 2.5-2.2 4.2-2.2 3.2 0 5.7 2.3 5.7 5.8 0 5.3-6.9 10.8-9.3 13.1l-1.2 1.1-1.2-1.1Z" />
      </svg>
    ),
  },
  {
    title: 'peças exclusivas',
    text: 'escolhas especiais para quem valoriza o feito à mão.',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M24 9.5h16" />
        <path d="M25 10c.2 4.5-.2 7.7-3.1 10.8-3.2 3.4-5.2 7.5-4.8 14.1.4 7.1 4.8 12 14.9 13.7 10.1-1.7 14.5-6.6 14.9-13.7.4-6.6-1.6-10.7-4.8-14.1C39.2 17.2 38.8 14.5 39 10" />
        <path d="M18.3 27.5c7.2 3.6 20.2 3.6 27.4 0" />
        <path d="M17.8 35.5c7.5 2.7 21 2.7 28.4 0" />
        <circle cx="24" cy="31.5" r=".9" />
        <circle cx="30" cy="32.4" r=".9" />
        <circle cx="36" cy="32.4" r=".9" />
        <circle cx="42" cy="31.5" r=".9" />
      </svg>
    ),
  },
  {
    title: 'inspiração brasileira',
    text: 'cores, formas e símbolos da nossa terra.',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M24 5.5c3.2 1.1 5.8 2.2 8.1 1.7l5.4 3.1 5.8-.2 2.4 4.9 5.1 2.7-.2 5.5 3.2 4.5-1.9 5.4 1.1 5.2-4.2 4.2-1.2 5.7-5.7.5-4.2 4.2-5.8-1.4-4.9 2.7-4.8-3.2-5.8.1-2.6-5.1-4.7-2.8.6-5.6-2.9-4.6 2.1-5.2-1.1-5.3 4.5-3.6 1.6-5.4 5.8-.2Z" />
      </svg>
    ),
  },
  {
    title: 'envio para todo brasil',
    text: 'receba com segurança na sua casa.',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M7 17h32v27H7z" />
        <path d="M39 25h10l7 9v10H39z" />
        <path d="M17 50.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11ZM48 50.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z" />
        <path d="M39 35h17M2 25h10M1 32h7M4 39h6" />
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
