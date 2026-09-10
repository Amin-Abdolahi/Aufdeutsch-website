// Section Component - بخشبندی محتوا

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "navy" | "paper";
  id?: string;
}

export function Section({ children, className = "", variant = "default", id }: SectionProps) {
  const variants = {
    default: "bg-paper-100",
    navy: "bg-navy-900",
    paper: "bg-paper-100",
  };

  const paddings = {
    default: "py-20 px-6",
    navy: "py-24 px-6",
    paper: "py-24 px-6",
  };

  return (
    <section id={id} className={`${variants[variant]} ${paddings[variant]} ${className}`}>
      {children}
    </section>
  );
}