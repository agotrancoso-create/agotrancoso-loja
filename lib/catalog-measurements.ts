// Measurements of the ceramic itself are deliberately separate from the closed parcel.
// Do not copy protected weights, empty boxes or suggested packages into either field.
export type PieceMeasurements = {
  lengthCm?: number; widthCm?: number; heightCm?: number; netWeightG?: number;
  heightLabel?: string;
};
export type ParcelMeasurements = {
  lengthCm: number; widthCm: number; heightCm: number; grossWeightG: number;
};

const family: PieceMeasurements = { lengthCm: 6, widthCm: 5, heightCm: 6 };
const pieces: Record<string, PieceMeasurements | undefined> = {
  'igreja-quadrado-p': { lengthCm: 3.5, widthCm: 4, heightCm: 5, netWeightG: 46 },
  'igreja-quadrado-m': { lengthCm: 5.5, widthCm: 6, heightCm: 6, netWeightG: 98 },
  'igreja-quadrado-gg': { widthCm: 23, heightCm: 16 },
  'igrejinha-luminaria-trancoso': { widthCm: 7.5, heightCm: 6.5 },
  'miniatura-quadrado-trancoso': { lengthCm: 19, heightCm: 6.5, heightLabel: 'Altura com a cruz da igrejinha do meio' },
  'rabo-de-baleia-p': { lengthCm: 5.5, widthCm: 5, heightCm: 10 },
  'rabo-de-baleia-m': { lengthCm: 7, widthCm: 6.5, heightCm: 12 },
  'rabo-de-baleia-g': { lengthCm: 8, widthCm: 8, heightCm: 16 },
  'sagrada-familia': family,
  'sagrada-familia-colorida': family,
  'sagrada-familia-dourada': family,
  'cachimbo': { lengthCm: 10, widthCm: 4, heightCm: 3.5, netWeightG: 36 },
};

// One unit. Confirmed by the seller for posting with the box, protection and tape
// for the five variants in the packing records of 17/11/2026 (Bahia).
// The 33 g of a protected Sagrada Família are neither net weight nor shipping weight.
const parcels: Record<string, ParcelMeasurements | undefined> = {
  'igreja-quadrado-p': { lengthCm: 24, widthCm: 16, heightCm: 8, grossWeightG: 147 },
  'igreja-quadrado-m': { lengthCm: 30, widthCm: 22, heightCm: 13, grossWeightG: 278 },
  'rabo-de-baleia-p': { lengthCm: 30, widthCm: 22, heightCm: 13, grossWeightG: 261 },
  'rabo-de-baleia-m': { lengthCm: 30, widthCm: 22, heightCm: 13, grossWeightG: 314 },
  'rabo-de-baleia-g': { lengthCm: 30, widthCm: 22, heightCm: 13, grossWeightG: 433 },
};

export function getPieceMeasurements(id: string) { return pieces[id]; }
export function getParcelMeasurements(id: string) { return parcels[id]; }

export function pieceDimensionsText(id: string): string | undefined {
  const m = getPieceMeasurements(id);
  if (!m) return undefined;
  return ([['Comprimento', m.lengthCm], ['Largura', m.widthCm], [m.heightLabel || 'Altura', m.heightCm]] as const)
    .filter(([, value]) => value != null)
    .map(([label, value]) => label + ': ' + value!.toLocaleString('pt-BR') + ' cm').join(' · ') || undefined;
}

export function pieceSchema(id: string) {
  const m = getPieceMeasurements(id);
  if (!m) return {};
  const value = (n: number, unitCode: 'CMT' | 'GRM') => ({ '@type': 'QuantitativeValue', value: n, unitCode });
  return {
    ...(m.lengthCm != null ? { depth: value(m.lengthCm, 'CMT') } : {}),
    ...(m.widthCm != null ? { width: value(m.widthCm, 'CMT') } : {}),
    ...(m.heightCm != null ? { height: value(m.heightCm, 'CMT') } : {}),
    ...(m.netWeightG != null ? { weight: value(m.netWeightG, 'GRM') } : {}),
  };
}
