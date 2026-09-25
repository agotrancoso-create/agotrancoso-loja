import { NextResponse } from 'next/server';

function clean(value: unknown, max = 180) {
  return String(value ?? '').trim().slice(0, max);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = clean(body.email, 160).toLowerCase();

    if (!email) return NextResponse.json({ error: 'Informe seu e-mail.' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });

    // Não registrar dados pessoais em logs de produção. O fluxo atual de primeira compra
    // guarda o código somente no navegador e valida a elegibilidade no checkout.
    return NextResponse.json({ ok: true }, { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch {
    return NextResponse.json({ error: 'Não foi possível validar o cadastro.' }, { status: 400 });
  }
}
