// Stamp Component - مهر پاسپورت/دفترچه

interface StampProps {
  size?: number;
  className?: string;
}

export function Stamp({ size = 160, className = "" }: StampProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{ transform: "rotate(-30deg)" }}
      >
        {/* Outer circle */}
        <circle
          cx="100"
          cy="100"
          r="78"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-gold-500"
        />
        {/* Inner circle */}
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gold-500"
        />
        {/* Top text curve */}
        <path id="stampTopCurve" d="M 30,100 A 70,70 0 0,1 170,100" fill="none" />
        <text
          fill="currentColor"
          fontSize="14"
          fontWeight="bold"
          letterSpacing="3"
          className="text-gold-500"
        >
          <textPath href="#stampTopCurve" startOffset="50%" textAnchor="middle">
            A-U-F DEUTSCH
          </textPath>
        </text>
        {/* Bottom text curve */}
        <path id="stampBottomCurve" d="M 40,115 A 60,60 0 0,0 160,115" fill="none" />
        <text
          fill="currentColor"
          fontSize="10"
          letterSpacing="2"
          className="text-gold-500"
        >
          <textPath href="#stampBottomCurve" startOffset="50%" textAnchor="middle">
            ★ SPRACHSCHULE ★
          </textPath>
        </text>
        {/* Center text */}
        <text
          x="100"
          y="98"
          fill="currentColor"
          fontSize="32"
          fontWeight="bold"
          textAnchor="middle"
          className="text-gold-500"
        >
          A♦F
        </text>
        <text
          x="100"
          y="118"
          fill="currentColor"
          fontSize="10"
          textAnchor="middle"
          letterSpacing="2"
          className="text-gold-500"
        >
          EST. 2026
        </text>
      </svg>
    </div>
  );
}