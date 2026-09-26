import { NextRequest, NextResponse } from 'next/server';

type Address = {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
};

async function fetchViaCep(cep: string): Promise<Address | null> {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) return null;
  const data = await response.json();
  if (data?.erro) return null;
  return {
    street: String(data?.logradouro || ''),
    neighborhood: String(data?.bairro || ''),
    city: String(data?.localidade || ''),
    state: String(data?.uf || ''),
  };
}

async function fetchBrasilApi(cep: string): Promise<Address | null> {
  const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) return null;
  const data = await response.json();
  return {
    street: String(data?.street || ''),
    neighborhood: String(data?.neighborhood || ''),
    city: String(data?.city || ''),
    state: String(data?.state || ''),
  };
}

export async function GET(request: NextRequest) {
  const cep = (request.nextUrl.searchParams.get('cep') || '').replace(/\D/g, '');
  if (cep.length !== 8) {
    return NextResponse.json({ found: false, error: 'Informe um CEP válido com 8 dígitos.' }, { status: 400 });
  }

  try {
    let address: Address | null = null;
    try {
      address = await fetchViaCep(cep);
    } catch {}

    if (!address) {
      try {
        address = await fetchBrasilApi(cep);
      } catch {}
    }

    if (!address) {
      return NextResponse.json({ found: false, error: 'CEP não encontrado. Preencha o endereço manualmente.' }, { status: 404 });
    }

    return NextResponse.json(
      { found: true, ...address },
      { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800' } },
    );
  } catch {
    return NextResponse.json({ found: false, error: 'Não foi possível consultar o CEP agora. Preencha o endereço manualmente.' }, { status: 502 });
  }
}
