export default function CartIcon({ size = 30, withPlus = false }: { size?: number; withPlus?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      focusable="false"
      shapeRendering="geometricPrecision"
    >
      <path
        d="M6.4 9.65h15.2l-.84 11.72a2.05 2.05 0 0 1-2.04 1.9H9.28a2.05 2.05 0 0 1-2.04-1.9L6.4 9.65Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <path
        d="M10.15 10V7.75a3.85 3.85 0 0 1 7.7 0V10"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
      <path
        d="M9.45 13.35c1.04.62 2.56.98 4.55.98s3.51-.36 4.55-.98"
        stroke="currentColor"
        strokeWidth="1.05"
        strokeLinecap="round"
        opacity=".52"
      />
      {withPlus && (
        <g>
          <circle cx="21.15" cy="20.9" r="4.05" fill="currentColor" />
          <path d="M21.15 18.95v3.9M19.2 20.9h3.9" stroke="white" strokeWidth="1.25" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
