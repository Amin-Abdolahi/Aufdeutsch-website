// Button Component - دکمههای قابل استفاده مجدد

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  const variants = {
    primary: "bg-navy-900 hover:bg-navy-800 text-paper-100 shadow-lg hover:shadow-xl",
    secondary: "bg-red-600 hover:bg-red-700 text-paper-100",
    outline: "border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-paper-100",
    ghost: "text-navy-900 hover:bg-navy-900/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const baseStyles = "inline-flex items-center justify-center font-bold rounded-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-mono";

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}