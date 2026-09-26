import { NextRequest, NextResponse } from 'next/server';

type Address = {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
};

function normalizeAddress(address: Partial<Address> | null | undefined): Address | null {
  if (!address) return null;
  const normalized: Address = {
    street: String(address.street || '').trim(),
    neighborhood: String(address.neighborhood || '').trim(),
    city: String(address.city || '').trim(),
    state: String(address.state || '').trim().toUpperCase().slice(0, 2),
  };
  return Object.values(normalized).some(Boolean) ? normalized : null;
}

function mergeAddresses(addresses: Array<Address | null>): Address | null {
  const valid = addresses.filter((address): address is Address => Boolean(address));
  if (!valid.length) return null;

  return {
    street: valid.find((address) => address.street)?.street || '',
    neighborhood: valid.find((address) => address.neighborhood)?.neighborhood || '',
    city: valid.find((address) => address.city)?.city || '',
    state: valid.find((address) => address.state)?.state || '',
  };
}

async function fetchViaCep(cep: string): Promise<Address | null> {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(4500),
  });
  if (!response.ok) return null;
  const data = await response.json();
  if (data?.erro) return null;
  return normalizeAddress({
    street: data?.logradouro,
    neighborhood: data?.bairro,
    city: data?.localidade,
    state: data?.uf,
  });
}

async function fetchBrasilApi(cep: string): Promise<Address | null> {
  const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(4500),
  });
  if (!response.ok) return null;
  const data = await response.json();
  return normalizeAddress({
    street: data?.street,
    neighborhood: data?.neighborhood,
    city: data?.city,
    state: data?.state,
  });
}

async function fetchOpenCep(cep: string): Promise<Address | null> {
  const response = await fetch(`https://opencep.com/v1/${cep}.json`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(4500),
  });
  if (!response.ok) return null;
  const data = await response.json();
  return normalizeAddress({
    street: data?.logradouro || data?.street,
    neighborhood: data?.bairro || data?.neighborhood,
    city: data?.localidade || data?.city,
    state: data?.uf || data?.state,
  });
}

export async function GET(request: NextRequest) {
  const cep = (request.nextUrl.searchParams.get('cep') || '').replace(/\D/g, '');
  if (cep.length !== 8) {
    return NextResponse.json({ found: false, error: 'Informe um CEP válido com 8 dígitos.' }, { status: 400 });
  }

  try {
    const results = await Promise.allSettled([
      fetchViaCep(cep),
      fetchBrasilApi(cep),
      fetchOpenCep(cep),
    ]);

    const address = mergeAddresses(
      results.map((result) => result.status === 'fulfilled' ? result.value : null),
    );

    if (!address) {
      return NextResponse.json(
        { found: false, error: 'CEP não encontrado nas bases disponíveis. Confira o número ou preencha o endereço manualmente.' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        found: true,
        ...address,
        complete: Boolean(address.street && address.neighborhood && address.city && address.state),
      },
      { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800' } },
    );
  } catch {
    return NextResponse.json(
      { found: false, error: 'Não foi possível consultar o CEP agora. Preencha o endereço manualmente.' },
      { status: 502 },
    );
  }
}
