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
        d="M3.5 5h2l1.6 10.4h10.6l2.15-7.5H6.1"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="9" cy="19" r="1.05" fill="currentColor" />
      <circle cx="17" cy="19" r="1.05" fill="currentColor" />
    </svg>
  );
}
