import { NextResponse } from 'next/server';

function clean(value: unknown, max = 180) {
  return String(value ?? '').trim().slice(0, max);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = clean(body.name, 120);
    const email = clean(body.email, 160).toLowerCase();
    const phone = clean(body.phone, 40);
    const source = clean(body.source, 80) || 'site';

    if (!email) return NextResponse.json({ error: 'Informe seu e-mail.' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });

    console.info('AGO_LEAD', { name: name || undefined, email, phone: phone || undefined, source, createdAt: new Date().toISOString() });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Não foi possível registrar o cadastro.' }, { status: 400 });
  }
}
