import './globals.css';
import type { ReactNode } from 'react';

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
      <body className="bg-gradient-to-b from-[#0e3a32] to-[#145a4c] text-slate-50 min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        </div>
        <header className="sticky top-0 z-20">
          <nav className="mx-auto w-full max-w-6xl px-4 py-4">
            <div className="flex items-center">
              <a href="/" className="flex items-center gap-2 font-semibold tracking-wide">
                <img src="/template/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                Premium Solution
              </a>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-10">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-6xl px-4 py-8 text-xs text-slate-300/80">
          © {new Date().getFullYear()} Premium Solution
        </footer>
      </body>
    </html>
  );
}

