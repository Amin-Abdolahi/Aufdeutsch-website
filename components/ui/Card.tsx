// Card Component - کارتهای محتوا

interface CardProps {
  children: React.ReactNode;
  className?: string;
  rotate?: "none" | "left" | "right";
}

export function Card({ children, className = "", rotate = "none" }: CardProps) {
  const rotations = {
    none: "",
    left: "-rotate-1",
    right: "rotate-1",
  };

  return (
    <div className={`bg-white p-8 shadow-md relative ${rotations[rotate]} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`mb-6 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4";
}

export function CardTitle({ children, className = "", as: Component = "h3" }: CardTitleProps) {
  return (
    <Component className={`text-xl font-bold text-navy-900 ${className}`}>
      {children}
    </Component>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className = "" }: CardDescriptionProps) {
  return <p className={`text-navy-900/60 text-sm leading-relaxed ${className}`}>{children}</p>;
}