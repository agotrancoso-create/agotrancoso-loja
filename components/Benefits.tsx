const benefits = [
  {
    title: 'feito à mão',
    text: 'cuidado e tradição em cada detalhe',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M7.5 30.5c2.2-5.2 5.1-9.8 8.4-12.1 1.8-1.2 3.6-.2 3.1 1.8l-1.2 4.2" />
        <path d="M40.5 30.5c-2.2-5.2-5.1-9.8-8.4-12.1-1.8-1.2-3.6-.2-3.1 1.8l1.2 4.2" />
        <path d="M8 30.5c.9 5.1 4.5 9.1 9.7 9.1h2.8c2.2 0 3.8-1.4 3.8-3.4 0-2-1.6-3.3-3.8-3.3h-3.2" />
        <path d="M40 30.5c-.9 5.1-4.5 9.1-9.7 9.1h-2.8c-2.2 0-3.8-1.4-3.8-3.4 0-2 1.6-3.3 3.8-3.3h3.2" />
        <path d="M24 33.2c-1.2-1.2-6.2-5.3-6.2-9.1 0-2.5 1.7-4.1 4-4.1 1.3 0 2.5.7 3.2 1.8.7-1.1 1.9-1.8 3.2-1.8 2.3 0 4 1.6 4 4.1 0 3.8-5 7.9-6.2 9.1L24 35l-.1-1.8Z" />
      </svg>
    ),
  },
  {
    title: 'peças exclusivas',
    text: 'escolhas especiais para quem valoriza o feito à mão.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M17 10h14l-1.8 7.6c-.3 1.3-1.1 2.2-2.2 2.8v10.2c0 2.6 1.4 4.6 3.8 5.4v2.2H17.2V36c2.4-.8 3.8-2.8 3.8-5.4V20.4c-1.1-.6-1.9-1.5-2.2-2.8L17 10Z" />
        <path d="M14.5 10h19M19 17.2c2.7 1.5 7.3 1.5 10 0M18 31.5h12" />
        <path d="M21 13.5h6" />
      </svg>
    ),
  },
  {
    title: 'inspiração brasileira',
    text: 'cores, formas e símbolos da nossa terra.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M21.2 5.8 28.4 8l4.4 4.2 6.5 1.3-.8 5.8 3 5.2-3.8 4.5.2 6.2-5.8 1.3-3.6 5.1-5.5-3.1-5.9.8-1.2-5.7-4.5-4.1 2.1-5.5-1.8-5.6 5.1-2.8 2.4-5.6Z" />
        <path d="M21.3 13.5c2.7 3.9 3.8 7.2 3.2 10.5-.8 4.4-1.1 8.7.8 14.2" />
        <path d="M24.2 24.1c2.4-1.7 4.6-2.1 6.8-1.9" />
      </svg>
    ),
  },
  {
    title: 'envio para todo brasil',
    text: 'receba com segurança na sua casa.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M5.5 14h25v20h-25zM30.5 20h7.2l5 6.7V34h-12.2z" />
        <path d="M12.5 39a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4ZM35.8 39a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z" />
        <path d="M30.5 27h11.8M2.5 21h7M1 26h5M3.5 31h4" />
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
