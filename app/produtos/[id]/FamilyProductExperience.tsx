'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { getProductById } from '@/lib/products';
import ProductGallery from '@/components/ProductGallery';
import ProductShare from '@/components/ProductShare';
import AddToCart from './AddToCart';

function money(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function FamilyProductExperience({ product, images, productUrl }: { product: Product; images: string[]; productUrl: string }) {
  const options = product.finishes ?? [];
  const [selectedId, setSelectedId] = useState('colorida');
  const [photoIndex, setPhotoIndex] = useState(0);
  const current = options.find(option => option.id === selectedId) ?? options[0];
  const selectedProduct = current ? getProductById(`${product.id}-${current.id}`) : undefined;
  if (!current) return null;

  const labels = images.map(image => image.includes('dourada')
    ? 'Sagrada Família — versão dourada'
    : 'Sagrada Família — versão colorida');
  const badges = images.map(image => image.includes('dourada') ? 'Dourada' : 'Colorida');

  function chooseOption(id: string) {
    setSelectedId(id);
    const option = options.find(item => item.id === id);
    const index = option ? images.indexOf(option.image) : -1;
    if (index >= 0) setPhotoIndex(index);
  }

  function choosePhoto(index: number) {
    setPhotoIndex(index);
    setSelectedId(images[index]?.includes('dourada') ? 'dourada' : 'colorida');
  }

  return (
    <div className="product-page-grid" data-product-id="sagrada-familia">
      <div className="product-gallery-column">
        <ProductGallery
          productId={product.id}
          name={product.name}
          images={images}
          imageLabels={labels}
          imageBadges={badges}
          selectedIndex={photoIndex}
          onImageChange={choosePhoto}
        />
      </div>
      <div className="product-info-column">
        <div className="product-buybox">
          <p className="eyebrow">Cerâmica artesanal</p>
          <h1 className="product-detail-title">{product.name}</h1>
          <p className="product-current-price" aria-live="polite">
            {current.price != null ? money(current.price) : 'Preço a confirmar'}
          </p>
          <p className="product-description">{product.description}</p>
          <fieldset className="ago-family-finishes">
            <legend>Escolha o acabamento</legend>
            <div className="ago-family-finish-grid">
              {options.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => chooseOption(option.id)}
                  aria-pressed={selectedId === option.id}
                  disabled={option.stock === 0}
                  className={`ago-family-finish${selectedId === option.id ? ' is-selected' : ''}`}
                >
                  <strong>{option.name}</strong>
                  <span>{option.price != null ? money(option.price) : 'Valor a confirmar'}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <section className="product-decision-details" aria-labelledby="family-details">
            <h2 id="family-details" className="product-detail-facts-title">Detalhes da peça</h2>
            <dl className="product-premium-facts">
              <div><dt>Acabamento</dt><dd>{current.name}</dd></div>
              <div><dt>Medidas</dt><dd>{product.dimensions || 'Medidas em atualização'}</dd></div>
              <div><dt>Uso</dt><dd>{selectedId === 'colorida' ? 'Alça na parte de trás para pendurar; também pode ser apoiada.' : 'Modo de fixação da versão dourada a confirmar.'}</dd></div>
              <div><dt>Estoque</dt><dd>{current.stock ?? 0} {current.stock === 1 ? 'unidade disponível' : 'unidades disponíveis'}</dd></div>
            </dl>
          </section>
          <div className="product-purchase">
            {selectedProduct?.available ? <AddToCart key={selectedProduct.id} product={selectedProduct} /> : <div className="product-unavailable">Acabamento indisponível no momento.</div>}
            <ProductShare name={product.name} url={productUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
