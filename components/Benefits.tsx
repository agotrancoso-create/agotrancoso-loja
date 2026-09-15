const benefits = [
  {
    title: 'feito à mão',
    text: 'cuidado e tradição em cada detalhe.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M12 31c1.5-5.7 4.2-13.9 8.1-13.9 2.1 0 3.1 2.1 2.2 4.5l-1 2.7c-.5 1.4.2 2.5 1.6 2.5h2.4c2.6 0 4.7 1.9 4.7 4.4 0 4-3.4 6.8-8 6.8h-3.1c-3.1 0-5.8-1.8-7.1-4.7l-1.1-2.4c-.6-1.5.3-3 1.8-3 .8 0 1.6.5 2 1.3l1.6 3.1" />
        <path d="M29.5 18.8c.8-2.1 2.1-3.6 3.9-4.7M34.4 21c2-.9 3.7-.9 5.3-.4" />
        <path d="M24 28c-2.5-3.2-7.3-1.8-7.3 1.8 0 2.9 3.5 4.7 7.3 7 3.8-2.3 7.3-4.1 7.3-7 0-3.6-4.8-5-7.3-1.8Z" />
      </svg>
    ),
  },
  {
    title: 'peças exclusivas',
    text: 'escolhas especiais para quem valoriza o feito à mão.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M16 13h16l-1.8 24H17.8L16 13Z" />
        <path d="M14 13h20M19 9h10" />
        <path d="M18.5 18c2.2 2 8.8 2 11 0M18.5 31h11" />
      </svg>
    ),
  },
  {
    title: 'inspiração brasileira',
    text: 'cores, formas e símbolos da nossa terra.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M21 7 29 11l5 7-2 7 3 7-5 7-7-2-6 3-5-6 1-7-4-5 4-6 6-2 2-7Z" />
        <path d="M20 18c2.5-2 6.2-1.5 8 .8 1.5 1.9 1.2 4.5-.5 6.2-1.9 1.9-4.5 3.1-6.8 4.9" />
      </svg>
    ),
  },
  {
    title: 'envio para todo brasil',
    text: 'receba com segurança na sua casa.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M7 14h25v21H7zM32 21h5l4 6v8h-9z" />
        <circle cx="15" cy="36" r="3" />
        <circle cx="36" cy="36" r="3" />
        <path d="M32 27h8" />
        <path d="M3 20h4M2 25h5" />
      </svg>
    ),
  },
];

export default function Benefits() {
  return (
    <section
      className="benefits-strip"
      aria-label="Diferenciais da Agô Trancoso"
    >
      <div className="max-w-content mx-auto">
        <div className="features-container">
          {benefits.map((item) => (
            <div className="feature-item" key={item.title}>
              <div className="feature-icon" aria-hidden="true">
                {item.icon}
              </div>
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-description">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
