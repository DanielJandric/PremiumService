"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Menu, Phone, X } from 'lucide-react';

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'À propos', href: '/a-propos' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-24 items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 transition-opacity hover:opacity-80">
          <img src="/logo-transparent.png" alt="Premium Solution" className="h-20 w-auto object-contain" />
          <div className="hidden sm:block">
            <div className="text-xl font-bold text-foreground">Premium Solution</div>
            <div className="text-xs text-muted-foreground">Nettoyage & Conciergerie – Service Signature</div>
          </div>
        </Link>

        <div className="hidden items-center space-x-8 md:flex">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className="relative px-1 py-0.5 text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center space-x-4 md:flex">
          <a href="tel:+41766074692" className="inline-flex items-center">
            <span className="inline-flex items-center rounded-md border px-3 py-2 text-sm"><Phone className="mr-2 h-4 w-4" />+41 76 607 46 92</span>
          </a>
          <Link href="/contact" className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground shadow hover:opacity-90">
            Demander un devis
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <div className="container space-y-1 py-4">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent text-muted-foreground">
                {item.name}
              </Link>
            ))}
            <div className="space-y-2 pt-4">
              <a href="tel:+41766074682" className="flex w-full items-center justify-center">
                <span className="inline-flex w-full items-center justify-center rounded-md border px-3 py-2 text-sm"><Phone className="mr-2 h-4 w-4" />+41 76 607 46 82</span>
              </a>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground shadow w-full">
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


