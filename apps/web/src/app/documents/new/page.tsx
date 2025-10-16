"use client";
import { useState } from 'react';

export default function NewDocumentPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setResultUrl(null);
    try {
      const payload = {
        validated: true,
        data: {
          kind: 'devis',
          seller: {
            name: 'Premium Solution',
            address:
              'Route de la Combaz 11, Crans-Montana, 3963, Suisse\nTelephone : (41) 766074682',
            email: 'info@premium-solution.ch',
          },
          buyer: {
            name: 'Client SA',
            address: 'Rue des Fleurs 2, 1200 Genève',
            email: 'contact@client.ch',
          },
          items: [{ description: 'Audit', quantity: 2, unitPrice: 800, vatRate: 0.081 }],
          currency: 'CHF',
          notes: 'Valable 30 jours.',
          terms: 'Paiement à 30 jours. Intérêts de retard 5% p.a.',
          issueDate: new Date().toISOString(),
        },
      } as const;

      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const json = (await res.json()) as { url?: string; number?: string };
      if (json.url) {
        setResultUrl(json.url);
        window.open(json.url, '_blank');
      }
    } catch (e: any) {
      setError(e?.message ?? 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
      <h1 className="text-2xl font-semibold">Nouveau document</h1>
      <p className="mt-2 text-slate-200/90">
        Génère un devis de démonstration avec les coordonnées Premium Solution. Les données
        exactes seront personnalisables dans la prochaine étape du wizard.
      </p>
      <button
        className="mt-6 rounded-lg bg-emerald-600 text-white px-4 py-2 disabled:opacity-50 shadow hover:bg-emerald-500 transition"
        onClick={onGenerate}
        disabled={loading}
      >
        {loading ? 'Génération…' : 'Valider et générer le PDF'}
      </button>
      {resultUrl ? (
        <div className="mt-4 text-sm">PDF: <a className="text-emerald-300 underline" href={resultUrl} target="_blank">ouvrir</a></div>
      ) : null}
      {error ? <div className="mt-4 text-sm text-red-300 break-words">{error}</div> : null}
    </div>
  );
}


