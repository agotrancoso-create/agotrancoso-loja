export const metadata = {
  title: 'Termos de Uso',
  description: 'Termos de uso do site Agô Trancoso.',
};

export default function TermsPage() {
  return (
    <div className="legal-page">
      <div className="legal-shell legal-content">
        <p className="eyebrow">Agô Trancoso</p>
        <h1>Termos de Uso</h1>
        <p className="legal-lead">Estes termos orientam o uso do site da Agô Trancoso e a realização de pedidos pela loja.</p>
        <section><h2>1. Uso do site</h2><p>Ao navegar pelo site, você se compromete a fornecer informações verdadeiras nos formulários de cadastro e compra e a utilizar a loja de forma compatível com a legislação aplicável.</p></section>
        <section><h2>2. Produtos, preços e disponibilidade</h2><p>Os produtos, preços, condições de promoção e disponibilidade são apresentados no próprio site e podem ser atualizados pela Agô Trancoso. O pedido só é confirmado após a conclusão do processo de pagamento.</p></section>
        <section><h2>3. Pagamento e entrega</h2><p>O pagamento é processado por parceiro de pagamento integrado ao site. As condições de entrega e frete são informadas durante a compra.</p></section>
        <section><h2>4. Cadastro e comunicações</h2><p>Ao realizar o cadastro para o benefício de primeira compra, você poderá receber comunicações da Agô Trancoso relacionadas a novidades, lançamentos e promoções. O benefício informado na oferta está sujeito às regras apresentadas no momento do cadastro.</p></section>
        <section><h2>5. Atendimento</h2><p>Para dúvidas sobre pedidos, produtos ou uso do site, utilize os canais de atendimento disponibilizados no próprio site.</p></section>
        <section><h2>6. Atualizações</h2><p>Estes termos podem ser atualizados para refletir mudanças no site, nos serviços ou na legislação. A versão publicada nesta página é a referência vigente.</p></section>
        <p className="legal-updated">Última atualização: 17 de setembro de 2026.</p>
      </div>
    </div>
  );
}
