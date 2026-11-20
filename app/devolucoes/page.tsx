import type { Metadata } from 'next';
import Link from 'next/link';
import LocalizedText from '@/components/LocalizedText';
import { whatsappLink } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Devoluções de compras online no Brasil',
  description: 'Saiba como devolver uma compra online da Agô Trancoso no Brasil, quem paga o frete e o que fazer se a cerâmica chegar danificada.',
  alternates: { canonical: '/devolucoes' },
};

export default function ReturnsPage() {
  return <div className="legal-page"><article className="legal-shell legal-content">
    <p className="eyebrow">Agô Trancoso</p>
    <h1><LocalizedText pt="Devoluções de compras online no Brasil" en="Returns for online orders delivered in Brazil" /></h1>
    <section><h2><LocalizedText pt="Se você mudar de ideia" en="If you change your mind" /></h2>
      <p><LocalizedText pt="Para compras online com entrega no Brasil, você pode pedir a devolução em até 7 dias corridos a contar do recebimento, sem precisar justificar. A devolução por arrependimento não tem custo. Na devolução integral da compra, você recebe de volta o valor pago, inclusive o frete da entrega." en="For online orders delivered in Brazil, you may request a return within 7 calendar days of receiving your order, without giving a reason. There is no return shipping charge. When returning an entire order, you receive a full refund, including the original delivery fee." /></p>
    </section>
    <section><h2><LocalizedText pt="Como pedir a devolução" en="How to request a return" /></h2>
      <p><LocalizedText pt="Fale com a Agô pelo WhatsApp e indique qual peça deseja devolver. Se tiver o número do pedido, envie também para facilitar a localização. Vamos orientar você sobre o envio da peça e a restituição do valor." en="Contact Agô on WhatsApp and tell us which piece you wish to return. If you have the order number, include it to help us find your purchase. We will explain how to send the piece back and how your refund will be handled." /></p>
      <a className="text-link" href={whatsappLink('Olá! Gostaria de solicitar a devolução de uma compra online.')}><LocalizedText pt="Solicitar devolução pelo WhatsApp" en="Request a return on WhatsApp" /></a>
    </section>
    <section><h2><LocalizedText pt="Se a peça chegou quebrada ou apresentou defeito" en="If the piece arrived broken or has a defect" /></h2>
      <p><LocalizedText pt="Conte o que aconteceu. Se puder, envie fotos da peça e da embalagem para ajudar no atendimento. O prazo de 7 dias por arrependimento não limita seus direitos em caso de defeito ou avaria." en="Tell us what happened. Photos of the piece and its packaging are helpful if you have them. The 7-day change-of-mind period does not limit your rights when goods are defective or arrive damaged." /></p>
      <Link href="/contato"><LocalizedText pt="Ver canais de atendimento" en="Contact Agô" /></Link>
    </section>
  </article></div>;
}
