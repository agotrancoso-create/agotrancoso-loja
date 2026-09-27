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
        <p className="legal-lead">Esta página explica, de forma simples, como os dados informados no site podem ser utilizados para atendimento, pedidos, medição da experiência e relacionamento com a Agô.</p>
        <section><h2>1. Dados coletados</h2><p>Dependendo da ação realizada, o site pode solicitar nome, e-mail, telefone e informações necessárias para entrega, como endereço e CEP. Dados técnicos de navegação e interação só são enviados às ferramentas de medição e marketing quando você escolhe aceitar esses recursos.</p></section>
        <section><h2>2. Para que usamos os dados</h2><p>Os dados são utilizados para atender solicitações, processar pedidos e pagamentos, organizar a entrega e melhorar a experiência da loja. Comunicações promocionais dependem do consentimento aplicável e não são uma condição para concluir uma compra.</p></section>
        <section><h2>3. Analytics, anúncios e CRM</h2><p>Quando você aceita, a Agô pode usar ferramentas de analytics, publicidade e CRM para medir páginas vistas, produtos consultados, adições à sacola e etapas de compra, além de entender o desempenho de campanhas. Ao escolher “Somente essenciais”, essas ferramentas de medição e marketing não são carregadas pelo site.</p></section>
        <section><h2>4. Pagamento</h2><p>Os dados necessários ao pagamento são encaminhados ao provedor de pagamento integrado ao checkout. A Agô Trancoso não deve solicitar por este site senhas ou códigos de autenticação do seu banco.</p></section>
        <section><h2>5. Compartilhamento</h2><p>As informações podem ser compartilhadas apenas com prestadores necessários à operação da loja e, quando autorizado, com serviços de medição, publicidade e relacionamento, sempre de acordo com a finalidade informada.</p></section>
        <section><h2>6. Segurança e retenção</h2><p>São adotadas medidas técnicas e organizacionais compatíveis com a operação do site. Os dados são mantidos pelo período necessário às finalidades para as quais foram coletados e às obrigações legais aplicáveis.</p></section>
        <section><h2>7. Seus direitos e preferências</h2><p>Você pode solicitar informações sobre o tratamento dos seus dados e, quando aplicável, exercer os direitos previstos na legislação de proteção de dados pelos canais de atendimento da Agô Trancoso. A escolha de privacidade feita no site fica armazenada no seu navegador.</p></section>
        <p className="legal-updated">Última atualização: 27 de setembro de 2026.</p>
      </div>
    </div>
  );
}
