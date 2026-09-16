const benefits = [
  {
    title: 'feito à mão',
    text: 'cuidado e tradição em cada detalhe',
    icon: (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M21 56c-2-9-3-18-1-25 1-4 4-8 6-9 2-1 4 1 4 4l-2 10" />
        <path d="M59 56c2-9 3-18 1-25-1-4-4-8-6-9-2-1-4 1-4 4l2 10" />
        <path d="M22 55c1 9 7 15 15 15h2c4 0 7-3 7-7s-3-6-7-6h-6" />
        <path d="M58 55c-1 9-7 15-15 15h-2c-4 0-7-3-7-7s3-6 7-6h6" />
        <path d="M40 53c-4-4-13-10-13-18 0-5 3-8 8-8 2 0 4 1 5 3 1-2 3-3 5-3 5 0 8 3 8 8 0 8-9 14-13 18Z" />
      </svg>
    ),
  },
  {
    title: 'peças exclusivas',
    text: 'escolhas especiais para quem valoriza o feito à mão.',
    icon: (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M29 12h22" />
        <path d="M30 13c0 7 0 10-4 14-4 4-6 9-6 15 0 11 8 18 20 20 12-2 20-9 20-20 0-6-2-11-6-15-4-4-4-7-4-14" />
        <path d="M22 35c9 4 27 4 36 0" />
        <path d="M21 44c10 3 28 3 38 0" />
        <circle cx="29" cy="39" r="1.2" />
        <circle cx="37" cy="40" r="1.2" />
        <circle cx="45" cy="40" r="1.2" />
        <circle cx="53" cy="39" r="1.2" />
      </svg>
    ),
  },
  {
    title: 'inspiração brasileira',
    text: 'cores, formas e símbolos da nossa terra.',
    icon: (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M20 17l9-3 5-5 8 3 7-1 4 5 8 2 1 8 6 5-3 8 2 7-6 5-2 9-8 1-5 7-8-3-8 4-6-5-8 1-3-8-6-4 2-8-4-7 5-6-1-8Z" />
      </svg>
    ),
  },
  {
    title: 'envio para todo brasil',
    text: 'receba com segurança na sua casa.',
    icon: (
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <path d="M10 25h39v31H10z" />
        <path d="M49 34h12l8 10v12H49z" />
        <circle cx="22" cy="59" r="7" />
        <circle cx="59" cy="59" r="7" />
        <path d="M49 45h20M5 34h11M3 42h10M7 50h9" />
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
