import type { ReactNode } from "react";

export const metadata = {
  title: "مدیریت نظرات | AUF Deutsch",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-paper-100">{children}</div>;
}