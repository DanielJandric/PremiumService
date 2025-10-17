import { Award, CheckCircle2, Droplets, Heart, Shield, Sparkles, Star, Users, Wrench } from 'lucide-react';

export default function AboutPage() {
  const values = [
    { icon: Heart, title: 'Passion du métier', description: 'Nos employés accomplissent un travail remarquable et prennent soin de vos biens dans des conditions de travail optimales, avec professionnalisme et dévouement.' },
    { icon: Shield, title: 'Qualité garantie', description: "Fondé sur une solide expérience de 5 ans, notre savoir-faire et notre engagement qualité font notre réussite et la satisfaction de nos clients." },
    { icon: Users, title: 'Équipe professionnelle', description: 'Plus de 30 employés formés et qualifiés, équipés du meilleur matériel professionnel pour des prestations irréprochables.' },
    { icon: Award, title: "Service d'excellence", description: '500+ clients satisfaits et 5000+ travaux complétés avec succès témoignent de notre engagement pour l\'excellence.' },
  ];

  const equipment = [
    { icon: Droplets, name: 'Laveur de vitre', description: 'Équipement professionnel pour un nettoyage impeccable' },
    { icon: Sparkles, name: 'Nettoyeur de tapis', description: 'Machines spécialisées pour tous types de tapis' },
    { icon: Wrench, name: 'Fourgons de travail', description: 'Flotte de véhicules pour nos interventions' },
    { icon: Sparkles, name: 'Cireuse', description: "Pour l'entretien soigné des sols" },
    { icon: Droplets, name: 'Microfibre', description: 'Matériaux de qualité professionnelle' },
    { icon: Shield, name: 'Désinfectant', description: 'Produits professionnels et écologiques' },
    { icon: Droplets, name: 'Haute pression', description: 'Nettoyage en profondeur' },
    { icon: Sparkles, name: 'Nettoyeur à vapeur', description: 'Technologie moderne et efficace' },
  ];

  const stats = [
    { value: '5+', label: "Ans d'expérience", icon: Award },
    { value: '500+', label: 'Clients satisfaits', icon: Users },
    { value: '30+', label: 'Employés qualifiés', icon: Users },
    { value: '5K+', label: 'Travaux complétés', icon: CheckCircle2 },
  ];

  return (
    <div className="flex-1">
      <section className="bg-gradient-to-br from-accent/20 via-background to-background py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">À propos de Premium Solution</h1>
              <p className="mb-6 text-lg text-muted-foreground">Nos employés font un travail remarquable et prennent soin de vos maisons avec professionnalisme et dévouement. Leur passion pour leur métier et leur engagement pour l&apos;excellence sont au cœur de notre philosophie.</p>
              <p className="text-lg text-muted-foreground">Être à la pointe de la technologie et à l&apos;écoute des besoins de notre clientèle nécessite un développement continu. La garantie de Premium Solution est d&apos;apporter le meilleur service de nettoyage et de conciergerie possible à ses clients, en conjuguant expertise, qualité et proximité.</p>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl flex items-center justify-center p-8 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm">
                <img src="/logo-transparent.png" alt="Premium Solution" className="h-full w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center border rounded-lg bg-card/90">
                <div className="pt-6 px-6 pb-8">
                  <div className="mb-4 flex justify-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="mb-2 text-4xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent/20 py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Nos valeurs</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Ce qui nous distingue et fait notre force au quotidien</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="text-center border rounded-lg bg-card/90">
                <div className="pt-6 px-6 pb-8">
                  <div className="mb-4 flex justify-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Le meilleur personnel & équipement</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Être à la pointe de la technologie et à l&apos;écoute des besoins de notre clientèle nécessite un développement continu. La garantie de Premium Solution est d&apos;apporter le meilleur service possible à ses clients, en combinant expertise humaine et équipements de haute performance.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {equipment.map((item) => (
              <div key={item.name} className="transition-all hover:shadow-lg hover:-translate-y-1 border rounded-lg bg-card/90">
                <div className="pt-6 px-6 pb-8">
                  <div className="mb-4 flex justify-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-center font-semibold text-foreground">{item.name}</h3>
                  <p className="text-center text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent/20 py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Ce que disent nos clients</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">5 étoiles sur 5 pour la qualité de notre service</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[0,1,2].map((i) => (
              <div key={i} className="border rounded-lg bg-card/90">
                <div className="pt-6 px-6 pb-8">
                  <div className="mb-4 flex">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mb-4 text-muted-foreground">{i === 0 ? '&quot;Travail bien fait et rapidement et le personnel toujours très aimable. Je recommande vivement Premium Solution !&quot;' : i === 1 ? '&quot;Travail rapide et soigné et les dames qui m\'ont servie sont très sympathiques. Service impeccable !&quot;' : '&quot;Service professionnel et de qualité. Je fais appel à Premium Solution régulièrement et je suis toujours satisfaite.&quot;'}</p>
                  <div className="text-sm font-medium text-foreground">{i === 2 ? 'Claire M.' : i === 1 ? 'Sophie D.' : 'Marie L.'}</div>
                  <div className="text-xs text-muted-foreground">Cliente depuis {i === 2 ? '2018' : i === 1 ? '2019' : '2020'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


