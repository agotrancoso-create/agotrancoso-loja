export default function CartIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5.2 8.2h13.6l-1.1 10.1H6.3L5.2 8.2Z" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" />
      <path d="M8.8 9V7.7a3.2 3.2 0 0 1 6.4 0V9" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}
