// Stylised Lux pump bottle, drawn in SVG so the demo works without photography.
// Swap for a real pack shot by passing `src` to <ProductShot /> in Landing.jsx.
export default function LuxBottle({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 420" role="img" aria-label="Lux shower gel bottle">
      <defs>
        <linearGradient id="lb-body" x1="0" x2="1">
          <stop offset="0" stopColor="#5B1B63" />
          <stop offset="0.45" stopColor="#9B3E93" />
          <stop offset="0.7" stopColor="#7A2A7C" />
          <stop offset="1" stopColor="#3F1046" />
        </linearGradient>
        <linearGradient id="lb-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#9C7638" />
          <stop offset="0.5" stopColor="#F1DCA7" />
          <stop offset="1" stopColor="#9C7638" />
        </linearGradient>
        <linearGradient id="lb-shine" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* pump */}
      <path d="M93 18h40a6 6 0 0 1 6 6v8h-52v-8a6 6 0 0 1 6-6z" fill="url(#lb-gold)" />
      <rect x="104" y="32" width="18" height="34" fill="url(#lb-gold)" />
      <rect x="84" y="62" width="58" height="26" rx="6" fill="url(#lb-gold)" />
      {/* body */}
      <path
        d="M70 96c0-6 5-10 11-10h64c6 0 11 4 11 10l10 40c4 16 6 32 6 48v206c0 12-10 22-22 22H76c-12 0-22-10-22-22V184c0-16 2-32 6-48z"
        fill="url(#lb-body)"
      />
      <rect x="66" y="140" width="14" height="250" rx="7" fill="url(#lb-shine)" />
      {/* label */}
      <path d="M58 196h110v150H58z" fill="#FFF7F3" opacity="0.95" />
      <path d="M58 196h110" stroke="url(#lb-gold)" strokeWidth="3" />
      <path d="M58 346h110" stroke="url(#lb-gold)" strokeWidth="3" />
      <text x="113" y="262" textAnchor="middle" fontFamily="'Bodoni Moda', Georgia, serif" fontSize="52" fontStyle="italic" fill="#3A0F3F">
        Lux
      </text>
      <g transform="translate(113 290)" fill="#B14F8E">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} rx="5" ry="11" cy="-9" transform={`rotate(${r})`} opacity="0.85" />
        ))}
        <circle r="4" fill="#E4C88E" />
      </g>
      <text x="113" y="326" textAnchor="middle" fontFamily="Outfit, sans-serif" fontSize="11" letterSpacing="1.5" fill="#5B1B63">
        Magical Orchid
      </text>
    </svg>
  );
}
