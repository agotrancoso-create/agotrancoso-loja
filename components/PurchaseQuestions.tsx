import Link from 'next/link';
import { FIXED_SHIPPING_PRICE, FREE_SHIPPING_SUBTOTAL_MINIMUM } from '@/lib/shipping';

const brl = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export default function PurchaseQuestions() {
  return <section className="purchase-questions" aria-labelledby="purchase-questions-title">
    <h2 id="purchase-questions-title">Antes de escolher</h2>
    <details><summary>Como comprar pelo site?</summary><p>Escolha a quantidade e leve a peça para a sacola. Confira o total, preencha seus dados de entrega e siga para o pagamento pela InfinitePay. Você não precisa criar uma conta.</p></details>
    <details><summary>Quanto custa o envio?</summary><p>O frete nacional é de {brl(FIXED_SHIPPING_PRICE)}. A partir de {brl(FREE_SHIPPING_SUBTOTAL_MINIMUM)} em produtos, o frete fica grátis. A sacola mostra o valor atualizado para seu pedido.</p></details>
    <details><summary>Como confirmar o tamanho e a cor?</summary><p>Confira as dimensões informadas e as fotos da galeria. Como são peças artesanais, detalhes do acabamento podem variar. Se uma cor específica for essencial, <Link href="/contato">confirme com a Agô antes de comprar</Link>.</p></details>
    <details><summary>Posso encomendar várias peças?</summary><p>Para encomendas personalizadas, quantidades maiores e prazos específicos, <Link href="/contato">fale com a Agô</Link> para combinar os detalhes antes do pagamento.</p></details>
  </section>;
}
