import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({
  weight: "400",
  variable: "--font-mono",
  subsets: ["latin"],
});
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "AUF Deutsch — آموزش زبان آلمانی",
  description: "آموزش آنلاین زبان آلمانی با امین و فتانه",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${spaceMono.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}