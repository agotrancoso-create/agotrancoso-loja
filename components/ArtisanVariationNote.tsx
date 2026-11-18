/** Aviso editorial aplicado a todas as peças do catálogo, sem atribuir fabricação à Agô. */
export const ARTISAN_VARIATION_NOTE =
  'A beleza do trabalho artesanal está nos detalhes: cada peça pode apresentar sutis variações de tamanho, tonalidade e acabamento — singularidades naturais que tornam cada exemplar especial.';

export default function ArtisanVariationNote() {
  return (
    <aside className="ago-artisan-note" aria-label="Singularidade artesanal">
      <span className="ago-artisan-note-label">A singularidade do artesanal</span>
      <p>{ARTISAN_VARIATION_NOTE}</p>
    </aside>
  );
}
