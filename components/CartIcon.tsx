export default function CartIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" shapeRendering="geometricPrecision">
      <path d="M6.1 8.6h11.8l.72 10.1a1.6 1.6 0 0 1-1.6 1.72H6.98a1.6 1.6 0 0 1-1.6-1.72L6.1 8.6Z" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M8.8 9V6.85a3.2 3.2 0 0 1 6.4 0V9" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
      <path d="M8.65 12.15c.75.55 1.9.9 3.35.9s2.6-.35 3.35-.9" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" opacity=".62" />
    </svg>
  );
}
