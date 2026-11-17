'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { getProductById } from '@/lib/products';
import { whatsappLink } from '@/lib/config';
import ProductGallery from '@/components/ProductGallery';
import ProductShare from '@/components/ProductShare';
import AddToCart from './AddToCart';

function money(price: number) {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function WhaleProductExperience({ product, images, productUrl }: { product: Product; images: string[]; productUrl: string }) {
  const variants = product.variants || [];
  const [size, setSize] = useState('G');
  const [activePhoto, setActivePhoto] = useState(0);
  const selected = variants.find(v => v.name === size);
  const variantProduct = getProductById(`${product.id}-${size.toLowerCase()}`);
  if (!selected || !variantProduct) return null;

  const imageLabels = images.map(src => src.includes('rabo-de-baleia-m')
    ? 'Rabo de Baleia M (12 cm)'
    : 'Rabo de Baleia G (16 cm)');
  const currentPhotoLabel = imageLabels[activePhoto];

  function selectSize(nextSize: string) {
    setSize(nextSize);
    const choice = variants.find(v => v.name === nextSize);
    if (choice?.image) {
      const index = images.indexOf(choice.image);
      if (index >= 0) setActivePhoto(index);
    }
  }

  function selectPhoto(index: number) {
    setActivePhoto(index);
    setSize(imageLabels[index]?.includes(' M ') ? 'M' : 'G');
  }

  return (
    <div className="product-page-grid" data-product-id="rabo-de-baleia">
      <div className="product-gallery-column">
        <ProductGallery productId={product.id} name={product.name} images={images}
          imageLabels={imageLabels} selectedIndex={activePhoto} onImageChange={selectPhoto} />
      </div>
      <div className="product-info-column">
        <div className="product-buybox">
          <p className="eyebrow">Cerâmica artesanal</p>
          <h1 className="product-detail-title">{product.name}</h1>
          <p className="product-current-price" aria-live="polite">{money(selected.price)}</p>
          <p className="product-description">{product.description}</p>
          <fieldset className="ago-whale-variants" aria-label="Escolha o tamanho do Rabo de Baleia">
            <legend>Escolha o tamanho</legend>
            <div className="ago-whale-variant-grid">
              {variants.map(variant => (
                <button type="button" key={variant.name}
                  className={`ago-whale-variant${variant.name === size ? ' is-selected' : ''}`}
                  aria-pressed={variant.name === size}
                  aria-label={`Tamanho ${variant.name}, ${variant.heightCm} centímetros, ${money(variant.price)}`}
                  disabled={variant.stock === 0}
                  onClick={() => selectSize(variant.name)}>
                  <strong>{variant.name} <span className="ago-whale-size">{variant.heightCm} cm</span></strong>
                  <span className="ago-whale-variant-price">{money(variant.price)}</span>
                </button>
              ))}
            </div>
            <p className="ago-whale-photo-note" aria-live="polite">
              {size === 'P'
                ? `Tamanho P selecionado. Ainda não temos foto dele. A foto exibida é do ${currentPhotoLabel}.`
                : `Tamanho selecionado: ${size} (${selected.heightCm} cm). Foto correspondente ao tamanho ${size}.`}
            </p>
          </fieldset>
          <section className="product-decision-details" aria-labelledby="product-details-title">
            <h2 id="product-details-title" className="product-detail-facts-title">Detalhes da peça</h2>
            <dl className="product-premium-facts" aria-label="Informações da peça">
              <div><dt>Medidas do tamanho {size}</dt><dd>{selected.dimensions}</dd></div>
              <div><dt>Estoque</dt><dd>{selected.stock} {selected.stock === 1 ? 'unidade' : 'unidades'}</dd></div>
            </dl>
          </section>
          <div className="product-purchase">
            <AddToCart key={variantProduct.id} product={variantProduct} />
            <ProductShare name={product.name} url={productUrl} />
          </div>
          <p className="ago-whale-contact"><a href={whatsappLink(`Olá! Gostaria de saber mais sobre o Rabo de Baleia ${size} (${selected.heightCm} cm), ${money(selected.price)}.`)} target="_blank" rel="noopener noreferrer">Dúvidas sobre a peça? Fale com a Agô</a></p>
        </div>
      </div>
    </div>
  );
}
