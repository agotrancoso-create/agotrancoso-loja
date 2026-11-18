/** Aviso editorial aplicado a todas as peças do catálogo, sem atribuir fabricação à Agô. */
export const ARTISAN_VARIATION_NOTE =
  'Por serem artesanais, as peças podem apresentar pequenas variações de cor, tamanho e acabamento — características naturais do trabalho feito à mão.';

export default function ArtisanVariationNote() {
  return (
    <aside className="ago-artisan-note" aria-label="Singularidade artesanal">
      <span className="ago-artisan-note-label">Sobre o trabalho artesanal</span>
      <p>{ARTISAN_VARIATION_NOTE}</p>
    </aside>
  );
}
