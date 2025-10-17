import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Premium Solution - Nettoyage & Conciergerie en Suisse",
  description: "Services professionnels de nettoyage et conciergerie en Suisse. Depuis 2020, plus de 500 clients satisfaits.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CH">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

