export default function CartIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.5 5.5h2.2l1.55 9.1a1.6 1.6 0 0 0 1.58 1.33h7.55a1.6 1.6 0 0 0 1.55-1.22L19.7 8H6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9.1" cy="19" r="1.1" fill="currentColor"/>
      <circle cx="16.9" cy="19" r="1.1" fill="currentColor"/>
    </svg>
  );
}
