import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center space-x-3">
              <img src="/logo-transparent.png" alt="Premium Solution" className="h-12 w-auto object-contain" />
              <div>
                <div className="font-bold text-foreground">Premium Solution</div>
                <div className="text-xs text-muted-foreground">Depuis 2020</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Votre partenaire de confiance pour le nettoyage et les services de conciergerie en Suisse.</p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-muted-foreground transition-colors hover:text-primary">Accueil</Link></li>
              <li><Link href="/a-propos" className="text-muted-foreground transition-colors hover:text-primary">À propos</Link></li>
              <li><Link href="/services" className="text-muted-foreground transition-colors hover:text-primary">Services</Link></li>
              <li><Link href="/contact" className="text-muted-foreground transition-colors hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-muted-foreground">Route de la Combaz 11<br />3963 Crans-Montana<br />Suisse</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href="tel:+41766074682" className="text-muted-foreground transition-colors hover:text-primary">+41 76 607 46 82</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href="mailto:info@premium-solution.ch" className="text-muted-foreground transition-colors hover:text-primary">info@premium-solution.ch</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Horaires</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <div className="text-muted-foreground">
                  <div className="font-medium">Lundi - Vendredi</div>
                  <div>9h00 - 12h00</div>
                  <div>14h00 - 18h00</div>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <div className="text-muted-foreground">
                  <div className="font-medium">Samedi - Dimanche</div>
                  <div>9h00 - 12h00</div>
                  <div>14h00 - 16h00</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Premium Solution. Tous droits réservés. <Link href="/internal/chat" className="ml-4 hover:text-primary">Espace interne</Link></p>
        </div>
      </div>
    </footer>
  );
}


