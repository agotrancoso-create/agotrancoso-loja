import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prova fotográfica | Agô Trancoso',
  robots: { index: false, follow: false },
};

const samples = [
  { name: 'Casinha Luminária', original: '/produtos/catalogo/casinha-luminaria-1.jpg', pilot: '/produtos/piloto-natural/casinha-luz-sombra-original.webp', note: 'Sombras no apoio e cor original da cerâmica preservadas.' },
  { name: 'Casal de Pretos-Velhos — foto 3', original: '/produtos/catalogo/casal-pretos-velhos-3.jpg', pilot: '/produtos/piloto-natural/pretos-velhos-luz-sombra-original.webp', note: 'Foto retangular centralizada sem cortar ou reiluminar a peça.' },
  { name: 'Colar da Igreja do Quadrado', original: '/produtos/catalogo/colar-igreja-quadrado-frente.jpg', pilot: '/produtos/piloto-natural/colar-luz-sombra-original.webp', note: 'Cordão e detalhes intactos, sem recorte por máscara.' },
  { name: 'Iemanjá — foto 4', original: '/produtos/catalogo/estatueta-iemanja-4.jpg', pilot: '/produtos/piloto-natural/iemanja-luz-sombra-original.webp', note: 'Sombra real e variações de luz mantidas; somente bordas muito claras suavizadas.' },
];

const photoStyle: React.CSSProperties = {
  display: 'block', width: '100%', height: '100%', maxHeight: 470,
  objectFit: 'contain', borderRadius: 18, background: '#FCFCFA',
};

export default function NaturalPhotoPreviewPage() {
  return (
    <main style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(24px,5vw,64px) 18px', color: '#403328' }}>
      <p style={{ letterSpacing: '.18em', textTransform: 'uppercase', fontSize: 12, color: '#756654' }}>
        Agô Trancoso · Prova fotográfica
      </p>
      <h1 style={{ marginTop: 12, marginBottom: 14, fontSize: 'clamp(28px,5vw,44px)', fontWeight: 450 }}>
        A luz e a sombra também fazem parte da peça.
      </h1>
      <p style={{ fontSize: 16, lineHeight: 1.7, maxWidth: 780, color: '#5e5144', marginBottom: 35 }}>
        Prova de tratamento conservador, sem reconstrução de cerâmica, sem iluminação artificial
        e sem apagar as sombras. As fotografias originais permanecem intactas. A comparação
        abaixo não altera a vitrine, os preços, o checkout nem as fotos da loja publicada.
      </p>
      {samples.map((sample) => (
        <section key={sample.name} style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 23, fontWeight: 450, marginBottom: 8 }}>{sample.name}</h2>
          <p style={{ fontSize: 14, color: '#6d6051', marginBottom: 19 }}>{sample.note}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 20 }}>
            <div>
              <p style={{ fontSize: 13, marginBottom: 8 }}>Antes · fotografia original</p>
              <div style={{ background: '#FCFCFA', borderRadius: 20, overflow: 'hidden', aspectRatio: '1 / 1' }}>
                <img src={sample.original} alt={sample.name + ', fotografia original'} style={photoStyle} loading="lazy" />
              </div>
            </div>
            <div>
              <p style={{ fontSize: 13, marginBottom: 8 }}>Depois · luz e sombra preservadas</p>
              <div style={{ background: '#FCFCFA', borderRadius: 20, overflow: 'hidden', aspectRatio: '1 / 1' }}>
                <img src={sample.pilot} alt={sample.name + ', tratamento conservador'} style={photoStyle} loading="lazy" />
              </div>
            </div>
          </div>
        </section>
      ))}
      <p style={{ marginTop: 10, color: '#756654', lineHeight: 1.6, fontSize: 14 }}>
        Esta página é uma prova visual fora do catálogo. Nenhum produto, preço, frete ou pedido é alterado.
      </p>
    </main>
  );
}
