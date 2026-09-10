import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "AUF Deutsch — آموزش زبان آلمانی",
  description: "آموزش آنلاین زبان آلمانی با مدرسین مجرب امین و فتانه. دوره های A1 تا C1، آمادگی آزمونهای بین المللی",
  keywords: ["آموزش آلمانی", "زبان آلمانی", "آموزش آنلاین", "A1", "B1", "C1", "آمادگی آزمون", "امین فتانه"],
  openGraph: {
    type: "website",
    title: "AUF Deutsch — آموزش زبان آلمانی",
    description: "آموزش آنلاین زبان آلمانی با مدرسین مجرب امین و فتانه",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} antialiased`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}