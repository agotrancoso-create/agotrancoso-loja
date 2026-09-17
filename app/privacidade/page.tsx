export const metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade do site Agô Trancoso.',
  alternates: { canonical: '/privacidade' },
};

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="legal-shell legal-content">
        <p className="eyebrow">Agô Trancoso</p>
        <h1>Política de Privacidade</h1>
        <p className="legal-lead">Esta página explica, de forma simples, como os dados informados no site podem ser utilizados para atendimento, cadastro e processamento de pedidos.</p>
        <section><h2>1. Dados coletados</h2><p>Dependendo da ação realizada, o site pode solicitar nome, e-mail, telefone e informações necessárias para entrega, como endereço e CEP.</p></section>
        <section><h2>2. Para que usamos os dados</h2><p>Os dados são utilizados para atender solicitações, processar pedidos e pagamentos, organizar a entrega e, quando houver consentimento, enviar comunicações sobre novidades, lançamentos e promoções.</p></section>
        <section><h2>3. Pagamento</h2><p>Os dados necessários ao pagamento são encaminhados ao provedor de pagamento integrado ao checkout. A Agô Trancoso não deve solicitar por este site senhas ou códigos de autenticação do seu banco.</p></section>
        <section><h2>4. Compartilhamento</h2><p>As informações podem ser compartilhadas apenas com prestadores necessários à operação da loja, como serviços de pagamento e entrega, observadas as finalidades informadas.</p></section>
        <section><h2>5. Segurança e retenção</h2><p>São adotadas medidas técnicas e organizacionais compatíveis com a operação do site. Os dados são mantidos pelo período necessário às finalidades para as quais foram coletados e às obrigações legais aplicáveis.</p></section>
        <section><h2>6. Seus direitos</h2><p>Você pode solicitar informações sobre o tratamento dos seus dados e, quando aplicável, exercer os direitos previstos na legislação de proteção de dados pelos canais de atendimento da Agô Trancoso.</p></section>
        <p className="legal-updated">Última atualização: 17 de setembro de 2026.</p>
      </div>
    </div>
  );
}
