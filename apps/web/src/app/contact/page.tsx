"use client";
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', service: '', date: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setFormData({ name: '', phone: '', email: '', address: '', service: '', date: '', message: '' });
  }

  return (
    <div className="flex-1">
      <section className="bg-gradient-to-br from-accent/20 via-background to-background py-16 md:py-24">
        <div className="container text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Contactez-nous</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Un besoin précis, une visite technique, une urgence ? Nous répondons rapidement et organisons selon vos contraintes.</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="border rounded-lg bg-card/90">
                <div className="p-6">
                  <h2 className="text-xl font-semibold">Demander un devis</h2>
                  <p className="text-sm text-muted-foreground">Remplissez le formulaire ci-dessous et nous vous répondrons rapidement</p>
                </div>
                <div className="px-6 pb-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Nom et prénom *</label>
                      <input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Votre nom complet" className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">Numéro de téléphone *</label>
                        <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="+41 XX XXX XX XX" className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">E-mail *</label>
                        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="votre@email.ch" className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="address" className="text-sm font-medium">Adresse</label>
                      <input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Votre adresse complète" className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="service" className="text-sm font-medium">Prestation demandée *</label>
                        <select id="service" name="service" value={formData.service} onChange={handleChange} required className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm">
                          <option value="">Sélectionnez un service</option>
                          <option value="maison">Nettoyage de maison</option>
                          <option value="entretien">Nettoyage d'entretien</option>
                          <option value="stores">Nettoyage stores</option>
                          <option value="fin-bail">Nettoyage fin de bail</option>
                          <option value="rideaux">Nettoyage de rideaux</option>
                          <option value="tapis">Tapis entretien</option>
                          <option value="conciergerie">Service de conciergerie</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="date" className="text-sm font-medium">Jour de service souhaité</label>
                        <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Ajouter plus de détails</label>
                      <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} placeholder="Décrivez vos besoins en détail..." className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
                    </div>

                    <button type="submit" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-primary-foreground shadow hover:opacity-90 w-full">Envoyer la demande</button>
                    {sent ? <div className="text-sm text-primary">Merci ! Nous vous répondrons dans les plus brefs délais.</div> : null}
                  </form>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="border rounded-lg bg-card/90">
                <div className="p-6">
                  <h3 className="text-lg font-semibold">Nos coordonnées</h3>
                  <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <div>
                      <div className="font-medium text-foreground">Adresse</div>
                      <div>Route de la Corniche 11<br />1066 Epalinges, Vaud<br />Suisse</div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Téléphone</div>
                      <a href="tel:+41766074692" className="hover:text-primary">+41 76 607 46 92</a>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">E-mail</div>
                      <a href="mailto:info@premium-solution.ch" className="hover:text-primary">info@premium-solution.ch</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg bg-primary text-primary-foreground">
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-semibold">Besoin d'un service urgent ?</h3>
                  <p className="mb-4 text-sm opacity-90">Appelez-nous directement pour un service express en 4 heures</p>
                  <a href="tel:+41766074682" className="inline-flex items-center justify-center rounded-md bg-white/10 px-5 py-3 shadow hover:bg-white/20 w-full">Appeler maintenant</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


