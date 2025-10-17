import Link from 'next/link';
import { CheckCircle2, Home, Sparkles, Wind } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    { 
      id: 'nettoyage-maison', 
      icon: Home, 
      category: 'Nettoyage', 
      title: 'Nettoyage de maison', 
      description: 'Nettoyage complet et minutieux de votre maison ou appartement avec notre équipe professionnelle qualifiée.', 
      price: 'Dès 49.- CHF', 
      includes: ["Jusqu'à 150 m²", '4 heures de nettoyage', 'Cuisine (plan de travail, évier)', 'Salle de bain'] 
    },
    { 
      id: 'nettoyage-entretien', 
      icon: Home, 
      category: 'Nettoyage', 
      title: "Nettoyage d'entretien", 
      description: 'Service professionnel de haute qualité pour l\'entretien régulier de votre entreprise ou de vos locaux.', 
      price: 'Dès 250.- CHF', 
      includes: ["Jusqu'à 150 m²", '7 heures de nettoyage', 'Dépoussiérage des meubles', '2 personnes pendant 5 heures'] 
    },
    { 
      id: 'nettoyage-stores', 
      icon: Wind, 
      category: 'Nettoyage', 
      title: 'Nettoyage stores', 
      description: 'Vous emménagez dans une nouvelle maison, vous déménagez dans un nouvel appartement? Laissez-nous nous occuper du nettoyage de vos stores avec expertise.', 
      price: 'Dès 240.- CHF', 
      includes: ['2 personnes pendant 2 heures', 'Cuisine (plan de travail, évier)', 'Salle de bain', 'Dépoussiérage des meubles'] 
    },
    { 
      id: 'nettoyage-fin-bail', 
      icon: Home, 
      category: 'Nettoyage', 
      title: 'Nettoyage fin de bail', 
      description: "Vous emménagez dans une nouvelle maison, vous déménagez dans un nouvel appartement? Laissez-nous nous occuper du nettoyage complet pour un rendu irréprochable.", 
      price: 'Dès 900.- CHF', 
      includes: ['Cuisine complète', 'Salle de bain', '4 pièces', 'Stores et fenêtres'] 
    },
    { 
      id: 'nettoyage-rideaux', 
      icon: Wind, 
      category: 'Nettoyage', 
      title: 'Nettoyage de rideaux', 
      description: "Premium Solution a développé un service expert pour l\'entretien de vos textiles d\'ameublement, avec un savoir-faire spécialisé.", 
      price: 'Dès 12.- CHF', 
      includes: ['Rideaux en soie', 'Rideaux en velours doublé', 'Rideaux molletonnés', 'Rideaux en velours doublé'] 
    },
    { 
      id: 'tapis-entretien', 
      icon: Sparkles, 
      category: 'Spécialisé', 
      title: 'Tapis entretien', 
      description: 'Nos spécialistes allient techniques traditionnelles et soins innovants pour un nettoyage en profondeur de vos tapis, avec respect de leurs spécificités.', 
      price: 'Dès 38.- CHF', 
      includes: ['Tapis mécanique fin', 'Tapis mécanique haute laine', 'Tapis de marque, de designer', 'Tapis en soie'] 
    },
    { 
      id: 'service-conciergerie', 
      icon: Sparkles, 
      category: 'Conciergerie', 
      title: 'Service de conciergerie', 
      description: 'Gestion complète et professionnelle de vos espaces communs, évacuation des déchets et services personnalisés.', 
      price: 'Sur devis', 
      includes: ['Gestion espaces communs', 'Évacuation déchets', 'Services personnalisés', 'Maintenance régulière'] 
    },
  ];

  return (
    <div className="flex-1">
      <section className="bg-gradient-to-br from-accent/20 via-background to-background py-16 md:py-24">
        <div className="container text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Nos services</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            À travers sa large gamme de services, Premium Solution vous propose une solution sur mesure pour tous vos besoins et pour tous types de textiles, avec une approche professionnelle et qualitative.
          </p>
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
                  <div className="mb-2">
                    <div className="text-xs text-muted-foreground mb-1">Service {index + 1}</div>
                    <div className="text-xl font-semibold">{service.title}</div>
                  </div>
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

      <section className="bg-accent/20 py-16 md:py-24">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Besoin d&apos;un service personnalisé ?</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
            Nous offrons également des prestations sur mesure pour les entreprises et les besoins spécifiques. Contactez-nous pour discuter de votre projet et bénéficier de notre expertise.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground shadow hover:opacity-90">
              Demander un devis gratuit
            </Link>
            <a href="tel:+41766074682" className="inline-flex items-center justify-center rounded-md border px-6 py-3 hover:bg-accent/40">
              Appelez-nous : +41 76 607 46 82
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

