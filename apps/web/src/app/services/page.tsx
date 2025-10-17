import Link from 'next/link';
import { CheckCircle2, Home, Sparkles, Wind } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    { id: 'nettoyage-maison', icon: Home, category: 'Nettoyage', title: 'Nettoyage de maison', description: 'Soin intégral des espaces de vie, avec une constance de rendu et une attention aux détails.', price: 'Dès CHF 49.–', includes: ["Jusqu'à 150 m²", '4 heures de nettoyage', 'Cuisine (plan de travail, évier)', 'Salle de bain'] },
    { id: 'nettoyage-entretien', icon: Home, category: 'Nettoyage', title: "Nettoyage d’entretien (bureaux & locaux)", description: 'Standards élevés pour vos bureaux, zones communes et espaces clients. Interventions tôt le matin, tard le soir ou le week-end.', price: 'Dès CHF 250.–', includes: ["Jusqu'à 150 m²", '7 heures de nettoyage', 'Dépoussiérer des meubles', '2 personnes pendant 5 heures'] },
    { id: 'nettoyage-stores', icon: Wind, category: 'Nettoyage', title: 'Nettoyage des stores', description: 'Remise à neuf des stores (emménagement, déménagement, entretien annuel), respect des matériaux.', price: 'Dès CHF 240.–', includes: ['2 personnes pendant 2 heures', 'Cuisine (plan de travail, évier)', 'Salle de bain', 'Dépoussiérer des meubles'] },
    { id: 'nettoyage-fin-bail', icon: Home, category: 'Nettoyage', title: 'Nettoyage de fin de bail (avec garantie 72 h)', description: "Préparation complète pour l’état des lieux. Reprise offerte si une retouche est demandée sous 72 h.", price: 'Dès CHF 900.–', includes: ['Cuisine', 'Salle de bain', '4 pièces', 'Stores et fenêtres'] },
    { id: 'nettoyage-rideaux', icon: Wind, category: 'Nettoyage', title: 'Nettoyage de rideaux', description: 'Nettoyage professionnel adapté aux tissus, tenue et tombé conservés.', price: 'Dès CHF 35.–', includes: ['Rideaux en soie', 'Rideaux en velours doublé', 'Rideaux molletonné', 'Rideaux en velours doublé'] },
    { id: 'tapis-entretien', icon: Sparkles, category: 'Spécialisé', title: 'Entretien de tapis', description: 'Nettoyage en profondeur, hygiène maîtrisée, longévité préservée.', price: 'Dès CHF 39.–', includes: ['Tapis mécanique fin', 'Tapis mécanique haute laine', 'Tapis de marque, de designer', 'Tapis en soie'] },
  ];

  return (
    <div className="flex-1">
      <section className="bg-gradient-to-br from-accent/20 via-background to-background py-16 md:py-24">
        <div className="container text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Nos Services</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Prestations de nettoyage et de conciergerie conçues pour durer : protocoles clairs, finitions nettes, suivi à la demande.
          </p>
          <div className="mt-2 text-sm text-muted-foreground">Des solutions sur mesure</div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div key={service.id} className="group bg-white/90 backdrop-blur-sm border-2 rounded-lg hover:border-primary/50 transition" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20">{service.category}</span>
                  </div>
                  <div className="text-xl font-semibold">{service.title}</div>
                  <div className="text-sm text-muted-foreground">{service.description}</div>
                  <div className="my-4 text-2xl font-bold text-primary">{service.price}</div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Ce qui est inclus :</div>
                    <ul className="space-y-1">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-start space-x-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6">
                    <Link href="/contact" className="inline-flex items-center justify-center rounded-md border px-4 py-2 w-full hover:bg-accent/40">Demander un devis →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


