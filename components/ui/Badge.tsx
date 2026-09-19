// Badge Component - نشانگر برای تگها و برچسبها

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "red";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants = {
    default: "bg-navy-900 text-paper-100",
    gold: "bg-gold-300 text-navy-900 border border-gold-500/40",
    red: "bg-red-600/10 text-red-700",
  };

  return (
    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-sm ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}