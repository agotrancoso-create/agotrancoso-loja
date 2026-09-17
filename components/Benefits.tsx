const benefits = [
  {
    title: 'Feito à Mão',
    text: 'Afeto, calma e a riqueza do trabalho artesanal em cada detalhe.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
  {
    title: 'Design Único',
    text: 'Criações autênticas para quem valoriza a beleza da singularidade.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: 'Alma Brasileira',
    text: 'Cores, formas e símbolos inspirados na cultura e energia do nosso país.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: 'Entrega Segura',
    text: 'Embalagem reforçada para sua peça chegar impecável em todo o Brasil.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
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
