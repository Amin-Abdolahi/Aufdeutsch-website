// Stamp Component - مهر پاسپورت/دفترچه

interface StampProps {
  size?: number;
  className?: string;
}

export function Stamp({ size = 160, className = "" }: StampProps) {
  return (
    <div className={`relative passport-stamp ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="stamp-svg" aria-label="AUF Deutsch passport stamp">
            <circle className="circle-outer" cx="100" cy="100" r="78" fill="none" stroke="currentColor" />
            <circle className="circle-inner" cx="100" cy="100" r="92" fill="none" stroke="currentColor" />
            <path id="stampTopCurve3" d="M 30,81 A 70,70 0 0,1 170,100" fill="none" />
            <text className="text-curve" fill="currentColor" fontWeight="bold"><textPath href="#stampTopCurve3" startOffset="50%" textAnchor="middle">A-U-F DEUTSCH</textPath></text>
            <path id="stampBottomCurve3" d="M 40,115 A 60,60 0 0,0 160,115" fill="none" />
            <text className="text-curve" fill="currentColor"><textPath href="#stampBottomCurve3" startOffset="50%" textAnchor="middle">★ SPRACHSCHULE ★</textPath></text>
            <text className="mark" x="100" y="98" fill="currentColor" textAnchor="middle">A♦F</text>
            <text className="est" x="100" y="118" fill="currentColor" textAnchor="middle">EST. 2026</text>
            <path id="visaCurve3" d="M 25,140 A 75,75 0 0,1 175,140" fill="none" />
            <text className="visa-curve" fill="currentColor"><textPath href="#visaCurve3" startOffset="50%" textAnchor="middle">ENTRY GRANTED</textPath></text>
            <text className="date-red" x="100" y="132" textAnchor="middle">2026.09.14</text>
      </svg>
    </div>
  );
}