import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllProducts, getEffectivePrice, getProductById } from '@/lib/products';
import { whatsappLink } from '@/lib/config';
import { FIXED_SHIPPING_PRICE, shouldOfferFreeShipping } from '@/lib/shipping';
import AddToCart from './AddToCart';
import ProductGallery from '@/components/ProductGallery';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) return {};
  return { title: `${product.name} | Agô Trancoso`, description: product.description };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) notFound();

  const images = product.images?.length ? product.images : ['/images/placeholder.svg'];
  const hasPromo = product.promotionalPrice != null && product.promotionalPrice < product.price;
  const price = getEffectivePrice(product);
  const waMessage = `Olá! Vim pelo site da Agô Trancoso e tenho interesse em ${product.name}.`;
  const freeShippingAtProductQuantity = shouldOfferFreeShipping(price);

  return (
    <div className="bg-areia min-h-[70vh]">
      <div className="max-w-content mx-auto px-5 md:px-8 py-10 md:py-16">
        <Link href="/produtos" className="inline-flex mb-8 text-[10px] uppercase tracking-[.18em] text-[#817963] hover:text-[#7A321C]">← Voltar à coleção</Link>
        <div className="grid md:grid-cols-[1.08fr_.92fr] gap-10 md:gap-16 items-start">
          <ProductGallery name={product.name} images={images} />

          <div className="md:sticky md:top-28">
            <p className="eyebrow mb-3">Agô Trancoso</p>
            <h1 className="product-detail-title text-4xl md:text-5xl leading-[1.02] text-[#4B2B1E]">{product.name}</h1>

            {hasPromo ? (
              <div className="price-detail-row mt-5"><span className="text-[#817963] line-through text-sm">{formatBRL(product.price)}</span><span className="text-[#7A321C] text-xl font-medium">{formatBRL(price)}</span></div>
            ) : (<p className="text-[#7A321C] text-xl mt-5">{formatBRL(price)}</p>)}

            <p className="text-[#4B2B1E]/80 leading-8 text-[15px] mt-7">{product.description}</p>
            {product.dimensions && <p className="text-sm text-[#817963] mt-5">Dimensões: {product.dimensions}</p>}

            <div className="mt-7 rounded-[12px] bg-areia2 px-4 py-3 text-sm text-marrom">
              {freeShippingAtProductQuantity ? 'Frete grátis nesta peça.' : <>Frete fixo de <strong>{formatBRL(FIXED_SHIPPING_PRICE)}</strong>.</>}
              <span className="block text-xs text-oliva mt-1">Compras acima de R$ 500 têm frete grátis.</span>
            </div>

            <div className="mt-8 pt-7 border-t border-[#817963]/20"><AddToCart product={product} /></div>

            <a href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer" className="mt-4 w-full inline-flex justify-center border border-[#4B2B1E]/20 hover:border-[#7A321C] hover:text-[#7A321C] transition-colors text-[#4B2B1E] font-sans text-sm px-6 py-3.5 rounded-sm">Comprar pelo WhatsApp</a>

            <div className="mt-8 grid grid-cols-3 gap-3 text-center border-t border-[#817963]/20 pt-6">
              <div><span className="block text-[9px] uppercase tracking-[.16em] text-[#6B5434]">Feito à mão</span></div>
              <div><span className="block text-[9px] uppercase tracking-[.16em] text-[#6B5434]">Peça especial</span></div>
              <div><span className="block text-[9px] uppercase tracking-[.16em] text-[#6B5434]">Envio nacional</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
