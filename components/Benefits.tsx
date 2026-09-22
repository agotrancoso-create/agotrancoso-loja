const benefits = [
  { title: 'Feito à mão', text: 'Peças feitas à mão, com cuidado em cada etapa.' },
  { title: 'Peças exclusivas', text: 'No trabalho manual, cada peça tem seus próprios detalhes.' },
  { title: 'Inspiração brasileira', text: 'Trancoso, Bahia e referências brasileiras presentes na coleção.' },
  { title: 'Envio para todo o Brasil', text: 'A gente embala tudo com cuidado para enviar sua peça para qualquer lugar do Brasil.' },
];

export default function Benefits() {
  return (
    <section className="benefits-strip ago-clean-benefits" aria-label="Diferenciais da Agô Trancoso">
      <div className="ago-clean-container ago-clean-benefits-grid">
        {benefits.map((item) => (
          <div className="ago-clean-benefit" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
