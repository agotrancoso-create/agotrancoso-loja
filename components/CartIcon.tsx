export default function CartIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 4.5h2.15l1.42 9.17a2 2 0 0 0 1.98 1.7h7.75a2 2 0 0 0 1.94-1.52L20.2 7H6"
        stroke="#8E4B32"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.2" cy="19" r="1.35" fill="#8E4B32" />
      <circle cx="17.1" cy="19" r="1.35" fill="#8E4B32" />
    </svg>
  );
}
