// Temporary preview-only viewport harness; removed before production.
export const metadata = { robots: { index: false, follow: false } };

export default async function QaViewport({ searchParams }: { searchParams: Promise<{ width?: string; path?: string }> }) {
  const { width: requestedWidth, path: requestedPath } = await searchParams;
  const width = Math.max(320, Math.min(1920, Number(requestedWidth) || 390));
  const path = requestedPath?.startsWith('/') && !requestedPath.startsWith('//') ? requestedPath : '/';
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, padding: 8, background: '#ccc', overflow: 'auto' }}>
      <iframe title={`Agô em ${width} px`} src={path} style={{ display: 'block', width, height: 860, border: 0, background: 'white' }} />
    </div>
  );
}
