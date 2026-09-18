const benefits = [
  { title: 'Feito à mão', text: 'Afeto, calma e a riqueza do trabalho artesanal em cada detalhe.', icon: '✳' },
  { title: 'Peças exclusivas', text: 'Cerâmicas com formas marcantes e presença própria.', icon: '◌' },
  { title: 'Inspiração brasileira', text: 'Cores, formas e símbolos inspirados na cultura e energia do nosso país.', icon: '◇' },
  { title: 'Envio para todo o Brasil', text: 'Embalagem reforçada para sua peça chegar impecável em todo o Brasil.', icon: '↗' },
];

export default function Benefits() {
  return (
    <section className="benefits-strip ago-clean-benefits" aria-label="Diferenciais da Agô Trancoso">
      <div className="ago-clean-container ago-clean-benefits-grid">
        {benefits.map((item) => (
          <div className="ago-clean-benefit" key={item.title}>
            <span className="ago-clean-benefit-mark" aria-hidden="true">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
