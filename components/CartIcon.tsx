export default function CartIcon({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      shapeRendering="geometricPrecision"
    >
      <path
        d="M3.5 4.5h2l2.2 10.2a2 2 0 0 0 2 1.6h7.1a2 2 0 0 0 1.92-1.44L20.6 7H6.15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.2 10.1h10.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity=".7"
      />
      <circle cx="9.3" cy="19.2" r="1.05" fill="currentColor" />
      <circle cx="17.2" cy="19.2" r="1.05" fill="currentColor" />
    </svg>
  );
}
