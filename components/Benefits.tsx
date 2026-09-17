import React from 'react';

const benefits = [
  {
    title: 'Feito com tempo',
    text: 'O toque artesanal aparece na forma, na textura e no acabamento de cada peça.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 31c3.2-5.2 7.2-8.1 12-8.1S32.8 25.8 36 31" />
        <path d="M17 31c-2.2 2.4-3.5 4.7-4 7M31 31c2.2 2.4 3.5 4.7 4 7" />
        <path d="M18 21.5c1.5-2.7 3.5-4 6-4s4.5 1.3 6 4" />
        <path d="M21 11.5c0 2.3 1.1 4.1 3 5.5 1.9-1.4 3-3.2 3-5.5" />
      </svg>
    ),
  },
  {
    title: 'Presença na medida',
    text: 'Objetos que não somem na decoração — ocupam seu lugar e chamam o olhar.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="m24 8 2.7 8.2L35 19l-8.3 2.8L24 30l-2.7-8.2L13 19l8.3-2.8L24 8Z" />
        <path d="m35.5 8 .9 2.8 2.8.9-2.8.9-.9 2.8-.9-2.8-2.8-.9 2.8-.9.9-2.8Z" />
        <path d="m12 29 .8 2.4 2.4.8-2.4.8-.8 2.4-.8-2.4-2.4-.8 2.4-.8.8-2.4Z" />
      </svg>
    ),
  },
  {
    title: 'Brasil sem clichê',
    text: 'Arquitetura, fé, paisagem e cor aparecem de um jeito atual, sem excesso de tema.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="8.5" />
        <path d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M36.7 11.3l-4.2 4.2M15.5 32.5l-4.2 4.2" />
        <path d="m20.5 24 2.2 2.2 5-5" />
      </svg>
    ),
  },
  {
    title: 'Chega inteiro',
    text: 'Embalagem reforçada e envio para todo o Brasil, com cuidado do começo ao fim.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 15 15-7 15 7-15 7-15-7Z" />
        <path d="M9 15v17l15 7 15-7V15M24 22v17" />
        <path d="m16.5 11.5 15 7" />
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
