const benefits = [
  {
    title: 'feito à mão',
    text: 'Cada peça é única e artesanal.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M17 37c-2.5-2.7-4-6.2-4-10V15.5c0-1.7 1.1-3 2.5-3s2.5 1.3 2.5 3V24" />
        <path d="M18 24V10.5c0-1.7 1.1-3 2.5-3s2.5 1.3 2.5 3V24" />
        <path d="M23 24V9.5c0-1.7 1.1-3 2.5-3S28 7.8 28 9.5V24" />
        <path d="M28 24V12c0-1.7 1.1-3 2.5-3S33 10.3 33 12v15c0 7-3.8 12-10.5 12H20c-4.2 0-7.5-2.1-9.1-5.8L9 28.8c-.6-1.5.1-3.1 1.5-3.7 1.4-.6 3 .1 3.7 1.5l1.5 3.2" />
      </svg>
    ),
  },
  {
    title: 'peças exclusivas',
    text: 'Design autoral inspirado na cultura brasileira.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 39S9 29.2 9 18.6C9 13.2 12.7 10 17.2 10c2.9 0 5.4 1.6 6.8 4 1.4-2.4 3.9-4 6.8-4C35.3 10 39 13.2 39 18.6 39 29.2 24 39 24 39Z" />
      </svg>
    ),
  },
  {
    title: 'inspiração brasileira',
    text: 'Cores, formas e símbolos da nossa terra.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M20 7 29 9l3 6 7 2-3 7 2 7-7 3-4 7-6-4-6-1 1-7-4-5 5-5-1-6 7-1Z" />
        <path d="M21 13c3 5 4 9 3 13-1 5-1 10 1 15" />
      </svg>
    ),
  },
  {
    title: 'envio para todo brasil',
    text: 'Receba com segurança na sua casa.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M6 13h24v21H6zM30 20h7l5 7v7H30z" />
        <path d="M13 38a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM36 38a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M30 27h12" />
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
