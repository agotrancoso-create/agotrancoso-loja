const benefits = [
  {
    title: 'feito à mão',
    text: 'cuidado e tradição em cada detalhe',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M10 43c1.2-7.1 3.5-14.2 8.7-19.4 2.7-2.7 6.2-1.7 5.4 2.1l-2.3 7.7" />
        <path d="M54 43c-1.2-7.1-3.5-14.2-8.7-19.4-2.7-2.7-6.2-1.7-5.4 2.1l2.3 7.7" />
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
        <path d="M24 10h16" />
        <path d="M21 10c.7 5.2 2 9.2 5.1 11.9v16.8c0 3.5-1.7 6.5-5.4 8.7h18.6c-3.7-2.2-5.4-5.2-5.4-8.7V21.9C37 19.2 38.3 15.2 39 10" />
        <path d="M22 23.5c5.2 2.4 14.8 2.4 20 0" />
        <path d="M22.5 35.5h19" />
        <path d="M20 48.5h24" />
        <path d="M27 15.5h10" />
      </svg>
    ),
  },
  {
    title: 'inspiração brasileira',
    text: 'cores, formas e símbolos da nossa terra.',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M27.4 5.2 34 7.6l5.7-.5 3.8 4.3 6 1.5-.3 5.9 3.1 4.9-2.7 5.4.8 5.8-5.1 3.2-1.9 5.7-5.8-.1-4.6 4.2-5.3-2.4-5.8 1.2-2.7-5.2-5.2-2.7.5-5.8-3.6-4.7 2.4-5.5-1-5.7 5.4-2.5 2.8-5.1Z" />
        <path d="M31.2 11.7c2.1 4.4 4.4 8.5 3.8 13.4-.5 4.1-2.4 7.2-1.5 12.2.5 2.8 1.8 5.8 3.8 9.2" />
        <path d="M34.6 25.8c3.5-1.9 6.9-2.2 10.2-1.5" />
        <path d="M27.2 28.8c-2.6-1.3-5-1.4-7.4-.8" />
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
