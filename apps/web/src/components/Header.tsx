"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, Phone, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'À propos', href: '/a-propos' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-24 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 transition-opacity hover:opacity-80">
          <img src="/logo-transparent.png" alt="Premium Solution" className="h-20 w-auto object-contain" />
          <div className="hidden sm:block">
            <div className="text-xl font-bold text-foreground">Premium Solution</div>
            <div className="text-xs text-muted-foreground">Nettoyage & Conciergerie</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-8 md:flex">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className={`relative px-1 py-0.5 text-sm font-medium transition-colors hover:text-primary after:content-[''] after:absolute after:-bottom-3 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:opacity-0 after:transition after:duration-200 hover:after:opacity-100 hover:after:scale-x-100 ${
              isActive(item.href) ? 'text-primary after:opacity-100 after:scale-x-100' : 'text-muted-foreground'
            }`}>
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden items-center space-x-4 md:flex">
          <a href="tel:+41766074682" className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Phone className="mr-2 h-4 w-4" />
              +41 76 607 46 82
            </Button>
          </a>
          <Link href="/contact">
            <Button size="sm">Demander un devis</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <div className="container space-y-1 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent ${
                  isActive(item.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="space-y-2 pt-4">
              <a href="tel:+41766074682" className="flex w-full items-center justify-center space-x-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  +41 76 607 46 82
                </Button>
              </a>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full">
                  Demander un devis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


