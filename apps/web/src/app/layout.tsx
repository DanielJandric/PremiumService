import './globals.css';
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import SiteFooter from '@/components/SiteFooter';
import BrandFromLogo from '@/components/BrandFromLogo';

export const metadata = {
  title: 'Premium Solution — Documents',
  description: 'Devis/Factures assistés par chatbot',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr-CH">
      <head>
        <link rel="stylesheet" href="/newsite.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-foreground min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <BrandFromLogo />
        <Header />
        <main className="container py-10">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

