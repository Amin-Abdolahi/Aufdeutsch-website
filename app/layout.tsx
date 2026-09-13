import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AUF Deutsch",
  description: "Redirecting...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}