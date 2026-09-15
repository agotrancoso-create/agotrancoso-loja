const benefits = [
  {
    title: 'feito à mão',
    text: 'cuidado e tradição em cada detalhe.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M12 31c1.5-5.7 4.2-13.9 8.1-13.9 2.1 0 3.1 2.1 2.2 4.5l-1 2.7c-.5 1.4.2 2.5 1.6 2.5h2.4c2.6 0 4.7 1.9 4.7 4.4 0 4-3.4 6.8-8 6.8h-3.1c-3.1 0-5.8-1.8-7.1-4.7l-1.1-2.4c-.6-1.5.3-3 1.8-3 .8 0 1.6.5 2 1.3l1.6 3.1" />
        <path d="M29.5 18.8c.8-2.1 2.1-3.6 3.9-4.7M34.4 21c2-.9 3.7-.9 5.3-.4" />
      </svg>
    ),
  },
  {
    title: 'peças exclusivas',
    text: 'escolhas especiais para quem valoriza o feito à mão.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M17 11h14l-1.5 7c-.2 1-.9 1.8-1.8 2.4v10.2c0 2.1 1.4 3.8 3.4 4.5v2.1H16.9v-2.1c2-.7 3.4-2.4 3.4-4.5V20.4c-.9-.6-1.6-1.4-1.8-2.4L17 11Z" />
        <path d="M15 11h18M20 18c2.2 1.2 5.8 1.2 8 0M19 32h10" />
      </svg>
    ),
  },
  {
    title: 'inspiração brasileira',
    text: 'cores, formas e símbolos da nossa terra.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="7" />
        <path d="M24 6v5M24 37v5M6 24h5M37 24h5M11.3 11.3l3.5 3.5M33.2 33.2l3.5 3.5M36.7 11.3l-3.5 3.5M14.8 33.2l-3.5 3.5" />
      </svg>
    ),
  },
  {
    title: 'envio para todo brasil',
    text: 'receba com segurança na sua casa.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M8 15.5 24 8l16 7.5v18L24 41l-16-7.5v-18Z" />
        <path d="M8 15.5 24 23l16-7.5M24 23v18" />
        <path d="M16.2 11.8 32 19.2" />
        <path d="M34.5 34.5c2.1-1.9 3.7-4.2 4.4-6.7" />
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
