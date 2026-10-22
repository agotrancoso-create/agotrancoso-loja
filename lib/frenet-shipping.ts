// Server only: never import this module into a client component.
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { getShippingPrice } from './shipping';
import type { CartItem } from './types';

type Package = { weight: number; width: number; height: number; length: number };
type Service = { ServiceCode?: string; ServiceDescription?: string; Carrier?: string; ShippingPrice?: number | string; DeliveryTime?: number | string; Error?: boolean | string };
export type SedexQuote = { price: number; surcharge: number; deadline: number; token: string };
const TTL = 15 * 60 * 1000;

function fingerprint(items: CartItem[], cep: string, subtotal: number) {
  return createHash('sha256').update(JSON.stringify({ cep, subtotal, items: [...items].sort((a,b) => a.productId.localeCompare(b.productId)) })).digest('hex');
}
function sign(value: string) { return createHmac('sha256', process.env.FRENET_TOKEN!.trim()).update(value).digest('base64url'); }

/** Each entry describes one packed unit, kg and cm; no guessed parcel defaults. */
function packages(items: CartItem[]) {
  try {
    const map = JSON.parse(process.env.FRENET_PACKAGES_JSON || '{}') as Record<string, Package>;
    return items.map(item => {
      const p = map[item.productId];
      if (!p || ![p.weight,p.width,p.height,p.length].every(v => typeof v === 'number' && Number.isFinite(v) && v > 0)) throw new Error('Missing package');
      return { SKU: item.productId, Quantity: item.quantity, Weight: p.weight, Width: p.width, Height: p.height, Length: p.length };
    });
  } catch { return null; }
}
export async function quoteSedex(items: CartItem[], cep: string, subtotal: number): Promise<SedexQuote | null> {
  const token = process.env.FRENET_TOKEN?.trim();
  const origin = (process.env.FRENET_SELLER_CEP || process.env.SHIP_FROM_CEP || '').replace(/\D/g, '');
  const parcels = packages(items);
  if (!token || origin.length !== 8 || !parcels?.length || !/^\d{8}$/.test(cep)) return null;
  try {
    const response = await fetch('https://api.frenet.com.br/shipping/quote', {
      method: 'POST', headers: { token, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ SellerCEP: origin, RecipientCEP: cep, RecipientCountry: 'BR', ShipmentInvoiceValue: subtotal, ShippingItemArray: parcels }),
      cache: 'no-store', signal: AbortSignal.timeout(4500),
    });
    if (!response.ok) return null;
    const data = await response.json();
    const services: Service[] = data.ShippingSevicesArray ?? data.ShippingServicesArray ?? [];
    if (!Array.isArray(services)) return null;
    const valid = services.filter(s => (s.Error === undefined || s.Error === false || s.Error === '' || s.Error === 'false') && /correios/i.test(s.Carrier || '') && Number.isFinite(Number(s.ShippingPrice)) && Number(s.ShippingPrice) > 0 && Number.isInteger(Number(s.DeliveryTime)) && Number(s.DeliveryTime) > 0);
    // Explicit codes avoid accidentally selecting SEDEX 10/12/Hoje or another contract.
    const pac = valid.find(s => s.ServiceCode === process.env.FRENET_PAC_SERVICE_CODE);
    const sedex = valid.find(s => s.ServiceCode === process.env.FRENET_SEDEX_SERVICE_CODE);
    if (!pac || !sedex || !/\bPAC\b/i.test(pac.ServiceDescription || '') || !/\bSEDEX\b/i.test(sedex.ServiceDescription || '') || pac.ServiceCode === sedex.ServiceCode) return null;
    const surchargeCents = Math.max(0, Math.round(Number(sedex.ShippingPrice)*100) - Math.round(Number(pac.ShippingPrice)*100));
    const priceCents = Math.round(getShippingPrice(subtotal)*100) + surchargeCents;
    const value = Buffer.from(JSON.stringify({ fingerprint: fingerprint(items,cep,subtotal), priceCents, expires: Date.now()+TTL, service: sedex.ServiceCode })).toString('base64url');
    return { price: priceCents/100, surcharge: surchargeCents/100, deadline: Number(sedex.DeliveryTime), token: `${value}.${sign(value)}` };
  } catch { return null; }
}

/** Honor the displayed quote for 15 minutes; bind it to cart, prices and destination. */
export function verifySedexQuote(token: unknown, items: CartItem[], cep: string, subtotal: number): number | null {
  if (!process.env.FRENET_TOKEN?.trim() || typeof token !== 'string' || token.length > 2048) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const expected = Buffer.from(sign(parts[0]));
    const actual = Buffer.from(parts[1]);
    if (expected.length !== actual.length || !timingSafeEqual(expected,actual)) return null;
    const data = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
    if (!Number.isFinite(data.expires) || data.expires <= Date.now() || data.expires > Date.now()+TTL || data.fingerprint !== fingerprint(items,cep,subtotal) || data.service !== process.env.FRENET_SEDEX_SERVICE_CODE || !Number.isSafeInteger(data.priceCents) || data.priceCents < Math.round(getShippingPrice(subtotal)*100)) return null;
    return data.priceCents/100;
  } catch { return null; }
}
