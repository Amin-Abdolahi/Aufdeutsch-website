// Section Component - بخش‌بندی محتوا

import { GoldenParticles } from "@/components/GoldenParticles";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "navy" | "paper";
  id?: string;
  withParticles?: boolean;   // ← جدید
}

export function Section({
  children,
  className = "",
  variant = "default",
  id,
  withParticles,
}: SectionProps) {
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

  // اگه variant = navy باشه، خودکار ذرات رو نشون بده
  const showParticles =
    withParticles !== undefined ? withParticles : variant === "navy";

  return (
    <section
      id={id}
      className={`relative ${variants[variant]} ${paddings[variant]} ${className}`}
    >
      {/* ✨ ذرات طلایی — فقط توی Section های تیره */}
      {showParticles && (
        <GoldenParticles count={25} className="absolute inset-0 z-[1]" />
      )}

      {/* محتوا بالاتر از ذرات */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}