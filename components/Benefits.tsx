const benefits = [
  { title: 'feito à mão', text: 'cuidado e tradição em cada detalhe.', icon: <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M16 35c-2-6-2-12 0-17 1-3 3-5 5-5 2 0 3 2 2 5l-1 5m10 12c2-6 2-12 0-17-1-3-3-5-5-5-2 0-3 2-2 5l1 5"/><path d="M17 34c1 5 5 8 9 8s8-3 9-8M20 26c2-2 6-2 8 0"/></svg> },
  { title: 'peças exclusivas', text: 'escolhas especiais para quem valoriza o feito à mão.', icon: <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M17 9h14M18 10v7c0 3-5 6-5 12 0 6 5 10 11 10s11-4 11-10c0-6-5-9-5-12v-7"/><path d="M14 24c6 3 14 3 20 0"/></svg> },
  { title: 'inspiração brasileira', text: 'cores, formas e símbolos da nossa terra.', icon: <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 34c8-1 14-7 17-17 2-5 3-8 5-10 1 7 0 13-3 18-4 7-10 10-19 9Z"/><path d="M14 34c5-5 10-10 15-15"/></svg> },
  { title: 'envio para todo brasil', text: 'receba com segurança na sua casa.', icon: <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 15h25v20H6zM31 21h8l5 7v7H31z"/><circle cx="14" cy="37" r="4"/><circle cx="38" cy="37" r="4"/><path d="M31 28h13"/></svg> },
];

export default function Benefits() {
  return <section className="benefits-strip" aria-label="Diferenciais da Agô Trancoso"><div className="features-container">{benefits.map((item) => <div className="feature-item" key={item.title}><div className="feature-icon">{item.icon}</div><h3 className="feature-title">{item.title}</h3><p className="feature-description">{item.text}</p></div>)}</div></section>;
}
