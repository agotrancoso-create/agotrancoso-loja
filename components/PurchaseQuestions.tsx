import Link from 'next/link';
import { FIXED_SHIPPING_PRICE, FREE_SHIPPING_SUBTOTAL_MINIMUM } from '@/lib/shipping';

const brl = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export default function PurchaseQuestions() {
  return <section className="purchase-questions" aria-labelledby="purchase-questions-title">
    <h2 id="purchase-questions-title">Dúvidas sobre a compra</h2>
    <details><summary>Como comprar pelo site?</summary><p>Adicione a peça à sacola, informe a entrega e siga para o pagamento. Não é preciso criar uma conta.</p></details>
    <details><summary>Quanto custa o envio?</summary><p>O frete nacional é de {brl(FIXED_SHIPPING_PRICE)}. A partir de {brl(FREE_SHIPPING_SUBTOTAL_MINIMUM)} em produtos, o frete fica grátis. Na página da peça, informe seu CEP para ver uma estimativa de prazo.</p></details>
    <details><summary>Como confirmar o tamanho e a cor?</summary><p>Veja as fotos e as informações disponíveis na página da peça. Quando uma medida não estiver informada, <Link href="/contato">fale com a Agô para confirmar antes da compra</Link>. O acabamento artesanal pode variar.</p></details>
    <details><summary>Posso encomendar várias peças?</summary><p>Para quantidades maiores ou personalização, <Link href="/contato">fale com a Agô</Link> antes de pagar.</p></details>
  </section>;
}
