import 'server-only';

import { getInternationalShippingQuote } from '@/lib/international-shipping';

/**
 * Países suportados pelo Google Shopping/Free Listings e pelo checkout
 * internacional atual da Agô. Coreia do Sul fica de fora porque o Google exige
 * BRN para segmentação nesse mercado; Rússia também fica de fora enquanto as
 * veiculações do Google permanecem suspensas.
 */
export const GOOGLE_SHOPPING_INTERNATIONAL_COUNTRIES = [
  'AR', 'AU', 'AT', 'BE', 'CA', 'CL', 'CO', 'CZ', 'DK', 'FI', 'FR', 'DE',
  'GR', 'HK', 'HU', 'IE', 'IT', 'JP', 'MX', 'NL', 'NZ', 'NO', 'PY', 'PE',
  'PL', 'PT', 'RO', 'SA', 'SG', 'SK', 'ZA', 'ES', 'SE', 'CH', 'TW', 'AE',
  'GB', 'US', 'UY',
] as const;

export type GoogleShoppingInternationalCountry = typeof GOOGLE_SHOPPING_INTERNATIONAL_COUNTRIES[number];

export type GoogleMerchantShipping = {
  country: GoogleShoppingInternationalCountry;
  price: number;
  service: string;
};

export async function getGoogleMerchantInternationalShipping(productId: string): Promise<GoogleMerchantShipping[]> {
  const results = await Promise.all(
    GOOGLE_SHOPPING_INTERNATIONAL_COUNTRIES.map(async (country) => {
      const quote = await getInternationalShippingQuote({
        countryCode: country,
        // O cálculo atual usa região + peso embalado estimado; o CEP não altera
        // a tarifa fixa e só precisa ser sintaticamente preenchido.
        postalCode: '00000',
        items: [{ productId, quantity: 1 }],
      });

      const option = quote.available ? quote.options[0] : undefined;
      if (!option) return null;

      return {
        country,
        price: Number(option.price.toFixed(2)),
        service: 'International shipping',
      } satisfies GoogleMerchantShipping;
    }),
  );

  return results.filter((result): result is GoogleMerchantShipping => Boolean(result));
}
