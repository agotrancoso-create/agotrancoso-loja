const benefits = [
  {
    title: 'Feito à mão',
    text: 'Cada peça passa pelas mãos de quem conhece o ofício e cuida dos detalhes.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 39.5 9.7 25.2C4.4 20 5.2 11.9 11.1 8.2c4.8-3 9.7-1.5 12.9 2.4 3.2-3.9 8.1-5.4 12.9-2.4 5.9 3.7 6.7 11.8 1.4 17L24 39.5Z"/><path d="M15.5 18.5c1.4-2.4 3.1-3.5 5.5-3.5"/></svg>
    ),
  },
  {
    title: 'Para guardar',
    text: 'Objetos feitos para continuar fazendo parte da casa ao longo do tempo.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M17 9h14"/><path d="M18 10v7c0 3-5 6-5 12 0 6 5 10 11 10s11-4 11-10c0-6-5-9-5-12v-7"/><path d="M14 24c6 3 14 3 20 0"/></svg>
    ),
  },
  {
    title: 'Brasilidade',
    text: 'Referências da Bahia aparecem nas formas, nas cores e nos pequenos detalhes.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 7v12M24 29v12M7 24h12M29 24h12"/><path d="M12 12l8 8M28 28l8 8M36 12l-8 8M20 28l-8 8"/></svg>
    ),
  },
  {
    title: 'Envio para todo o Brasil',
    text: 'Você escolhe a peça e recebe com segurança onde estiver.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 15h25v20H6z"/><path d="M31 21h8l5 7v7H31z"/><circle cx="14" cy="37" r="4"/><circle cx="38" cy="37" r="4"/><path d="M31 28h13"/></svg>
    ),
  },
];

export default function Benefits() {
  return (
    <section className="benefits-strip" aria-label="Diferenciais da Agô Trancoso">
      <div className="features-container">
        {benefits.map((item) => (
          <div className="feature-item" key={item.title}>
            <div className="feature-icon">{item.icon}</div>
            <h3 className="feature-title">{item.title}</h3>
            <p className="feature-description">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
