import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Home as HomeIcon, Sparkles, Star, Users } from 'lucide-react';

export default function HomePage() {
  const services = [
    {
      icon: HomeIcon,
      title: 'Nettoyage de maison',
      description: 'Nettoyage complet et minutieux de votre maison ou appartement avec notre équipe professionnelle qualifiée.',
      price: 'Dès 49.- CHF',
    },
    {
      icon: Sparkles,
      title: "Nettoyage d'entretien",
      description: "Service professionnel de haute qualité pour l'entretien régulier de votre entreprise ou de vos locaux.",
      price: 'Dès 250.- CHF',
    },
    {
      icon: Sparkles,
      title: 'Service de conciergerie',
      description: 'Gestion complète et professionnelle de vos espaces communs, évacuation des déchets et services personnalisés.',
      price: 'Sur devis',
    },
  ];

  const stats = [
    { label: "Ans d'expérience", value: '5+', icon: CheckCircle2 },
    { label: 'Clients satisfaits', value: '500+', icon: Users },
    { label: 'Travaux complétés', value: '5K+', icon: Star },
  ];

  const features = [
    {
      title: 'Personnel formé et expérimenté',
      description: "Notre équipe de professionnels qualifiés bénéficie d'une formation continue pour garantir un service d'excellence.",
    },
    {
      title: 'Équipement professionnel moderne',
      description: 'Nous utilisons du matériel de dernière génération pour des résultats impeccables et durables.',
    },
    {
      title: 'Service rapide et soigné',
      description: 'Intervention efficace avec une attention particulière portée aux finitions et aux détails.',
    },
    {
      title: 'Devis gratuit et transparent',
      description: 'Tarification claire et détaillée sans frais cachés, établie selon vos besoins spécifiques.',
    },
    {
      title: 'Intervention dans toute la région',
      description: "Service disponible dans l'ensemble de la région pour votre confort.",
    },
    {
      title: "Respect de l'environnement",
      description: "Utilisation de produits professionnels respectueux de l'environnement et de votre santé.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="relative isolate overflow-hidden rounded-[28px] border bg-gradient-to-br from-[oklch(0.96_0.04_150)] via-[oklch(0.97_0.01_95)] to-[oklch(0.97_0.01_95)] p-6 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,.06),0_2px_10px_rgba(0,0,0,.04)]">
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
              <div className="absolute left-1/2 top-[-15%] h-[560px] w-[1200px] -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-r from-[oklch(0.78_0.14_150)] to-[oklch(0.85_0.10_150)]" />
            </div>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  ✨ Votre partenaire de confiance depuis 2020
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                  Nettoyage & Service de Conciergerie d&apos;Excellence
                </h1>
                <p className="text-lg text-muted-foreground">
                  Premium Solution vous offre des services professionnels haut de gamme de nettoyage pour votre maison, votre entreprise et des prestations de conciergerie personnalisées, adaptées à tous vos besoins avec un souci du détail irréprochable.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/contact">
                    <Button size="lg" className="w-full sm:w-auto">
                      Demander un devis gratuit
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Découvrir nos services
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <stat.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl flex items-center justify-center p-8 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm">
                  <img src="/logo-transparent.png" alt="Premium Solution" className="h-full w-full object-contain" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-2xl -z-10 opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Nos services spécialisés
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              À travers sa large gamme de services, Premium Solution vous propose une solution sur mesure pour tous vos besoins et pour tous types de textiles, avec une approche professionnelle et qualitative.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Card
                key={service.title}
                className="group bg-white/90 backdrop-blur-sm border-2 hover:border-primary/50 transition-all"
              >
                <div className="p-6 space-y-4">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-bold text-primary">{service.price}</span>
                    <Link href="/services">
                      <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                        En savoir plus →
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/services">
              <Button size="lg" variant="outline">
                Voir tous nos services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[oklch(0.95_0.06_150)]/25 py-20 md:py-32">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Pourquoi choisir Premium Solution ?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">Ce qui fait notre différence</p>
              <div className="grid gap-6">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/a-propos">
                  <Button size="lg">En savoir plus sur nous</Button>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <CardTitle className="mb-4">Témoignage client</CardTitle>
                  <div className="mb-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mb-4 text-muted-foreground">
                    &quot;Travail bien fait et rapidement et le personnel toujours très aimable. Je recommande vivement Premium Solution !&quot;
                  </p>
                  <div className="text-sm font-medium text-foreground">Marie L.</div>
                  <div className="text-xs text-muted-foreground">Cliente depuis 2020</div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <CardTitle className="mb-4">Témoignage client</CardTitle>
                  <div className="mb-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mb-4 text-muted-foreground">
                    &quot;Travail rapide et soigné et les dames qui m&apos;ont servie sont très sympathiques. Service impeccable !&quot;
                  </p>
                  <div className="text-sm font-medium text-foreground">Sophie D.</div>
                  <div className="text-xs text-muted-foreground">Cliente depuis 2019</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <Card className="bg-[oklch(0.64_0.21_265)] text-primary-foreground">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Demandez un devis gratuit dès aujourd&apos;hui
              </h2>
              <p className="mb-8 text-lg opacity-90">
                Des conseils personnalisés et la transparence des prix. Devis rapide et simple, réservation immédiate.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/contact">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Demander un devis
                  </Button>
                </Link>
                <a href="tel:+41766074682">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Appelez-nous : +41 76 607 46 82
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

