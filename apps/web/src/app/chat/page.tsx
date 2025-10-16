"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import type { QuoteOrInvoice } from '@domain/index';
import { quoteOrInvoiceSchema, computeTotals, formatCurrency } from '@domain/index';

type Message = { role: 'user' | 'assistant'; content: string };

const BASE_SYSTEM_PROMPT = `Tu es un assistant fr-CH ultra bref pour créer un devis ou une facture.
Objectif: poser le MINIMUM de questions. Ne demande que:
- le nom du client,
- l'adresse du client,
- la désignation (une ligne) du service/produit.
Tout le reste est par défaut et ne doit PAS être demandé:
- vendeur: déjà connu; ne pas reposer la question;
- devise: CHF par défaut;
- TVA: 8.1% (0.081) par défaut; ne jamais demander;
- quantité: 1 par défaut;
- prix unitaire: 0 par défaut si non fourni;
- date d'émission: aujourd'hui (format ISO) si non fournie;
- numéro: généré côté serveur; ne jamais demander.

Règles:
- Réponds soit par UNE seule question, soit par un JSON STRICT quand les 3 infos (nom, adresse, désignation) sont disponibles.
- JSON STRICT, sans texte autour, conforme au schéma:
{
  "kind": "devis"|"facture",
  "seller": {"name": string, "address": string, "email"?: string, "vatNumber"?: string},
  "buyer": {"name": string, "address": string, "email"?: string, "vatNumber"?: string},
  "items": [{"description": string, "quantity"?: number, "unitPrice"?: number, "vatRate"?: number}],
  "currency"?: "CHF"|"EUR",
  "notes"?: string,
  "terms"?: string,
  "issueDate"?: string (ISO),
  "dueDate"?: string (ISO)
}
Contraintes: ne jamais parler de PDF; ne pas demander TVA/devise/vendeur/numéro/date si l'utilisateur ne le fait pas.
`;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<QuoteOrInvoice | null>(null);
  const [defaultSeller, setDefaultSeller] = useState<{ name: string; address: string; email?: string; vatNumber?: string } | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Charge le vendeur par défaut depuis le dernier template (brand.company)
    (async () => {
      try {
        const res = await fetch('/api/templates');
        if (!res.ok) return;
        const arr = await res.json();
        if (Array.isArray(arr) && arr.length > 0) {
          const brand = arr[0]?.brand;
          const company = brand?.company;
          if (company?.name && company?.address) {
            setDefaultSeller({
              name: String(company.name),
              address: String(company.address),
              email: company.email ? String(company.email) : undefined,
              vatNumber: company.vatNumber ? String(company.vatNumber) : undefined,
            });
          }
        }
      } catch {}
    })();
  }, []);

  const SYSTEM_PROMPT = useMemo(() => {
    if (!defaultSeller) return BASE_SYSTEM_PROMPT;
    return (
      BASE_SYSTEM_PROMPT +
      `\nContrainte supplémentaire: n'exige pas les coordonnées du vendeur si l'utilisateur ne demande pas de changement. Utilise par défaut ce vendeur (ne pas reposer la question):\n` +
      JSON.stringify(defaultSeller)
    );
  }, [defaultSeller]);

  const isValid = useMemo(() => !!draft && quoteOrInvoiceSchema.safeParse(draft).success, [draft]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pending]);

  async function send() {
    if (!input.trim()) return;
    setPending(true);
    setError(null);
    const nextMessages: Message[] = [...messages, { role: 'user', content: input.trim() }];
    setMessages(nextMessages);
    setInput('');
    try {
      const payload = {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...nextMessages,
        ],
        mode: 'text',
      };
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 30000);
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(t);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const content: string = data.choices?.[0]?.message?.content ?? '';
      const assistantMsg: Message = { role: 'assistant', content };
      setMessages((prev) => [...prev, assistantMsg]);

      // Tente d'extraire un JSON du message
      const maybeJson = extractJson(content);
      if (maybeJson) {
        // Applique les valeurs par défaut minimales
        const completeSeller = defaultSeller ?? maybeJson.seller;
        const oneItem = Array.isArray(maybeJson.items) && maybeJson.items.length > 0
          ? maybeJson.items[0]
          : { description: String(maybeJson.description || 'Service'), quantity: 1, unitPrice: 0 };
        const withDefaults = {
          kind: (maybeJson.kind === 'facture' || maybeJson.kind === 'devis') ? maybeJson.kind : 'devis',
          seller: completeSeller,
          buyer: {
            name: String(maybeJson.buyer?.name || maybeJson.name || '').trim(),
            address: String(maybeJson.buyer?.address || maybeJson.address || '').trim(),
            email: maybeJson.buyer?.email ?? undefined,
            vatNumber: maybeJson.buyer?.vatNumber ?? undefined,
          },
          items: [{
            description: String(oneItem.description || 'Service').trim(),
            quantity: Number(oneItem.quantity || 1),
            unitPrice: Number(oneItem.unitPrice || 0),
            vatRate: oneItem.vatRate ?? 0.081,
          }],
          currency: maybeJson.currency || 'CHF',
          issueDate: maybeJson.issueDate || new Date().toISOString().split('T')[0],
          notes: maybeJson.notes || undefined,
          terms: maybeJson.terms || undefined,
          dueDate: maybeJson.dueDate || undefined,
        } as const;
        const parsed = quoteOrInvoiceSchema.safeParse(withDefaults);
        if (parsed.success) setDraft(parsed.data);
      }
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        setError('Le service est temporairement lent (timeout). Réessaie.');
      } else {
        setError(e?.message ?? 'Erreur');
      }
    } finally {
      setPending(false);
    }
  }

  async function validateAndGenerate() {
    if (!draft) return;
    setPending(true);
    setError(null);
    try {
      // iOS/Safari: pre-open window in user gesture to avoid popup blocker
      const win = typeof window !== 'undefined' ? window.open('', '_blank') : null;
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ validated: true, data: draft }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      if (json?.url) {
        if (win) {
          win.location.href = json.url;
        } else {
          window.open(json.url, '_blank');
        }
      } else if (win) {
        win.close();
      }
    } catch (e: any) {
      setError(e?.message ?? 'Erreur');
    } finally {
      setPending(false);
    }
  }

  function resetChat() {
    setMessages([]);
    setDraft(null);
    setError(null);
  }

  const totals = useMemo(() => (draft ? computeTotals(draft.items) : null), [draft]);

  const chips = ['Créer un devis', 'Créer une facture'];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
        <h1 className="text-2xl font-semibold">Chat</h1>
        <div ref={listRef} className="mt-4 rounded p-3 h-[60vh] overflow-auto bg-white/5 border border-white/20">
          {messages.length === 0 ? (
            <div className="text-slate-200/80 text-sm">
              Démarre la conversation: indique si tu veux un devis ou une facture, le client, les
              lignes, la devise, et la date. Le bot posera les questions manquantes et renverra un
              JSON quand tout sera complet.
            </div>
          ) : null}
          {messages.map((m, i) => {
            const isUser = m.role === 'user';
            return (
              <div key={i} className={`mb-3 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 shadow ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-br-sm'
                    : 'bg-white/10 text-slate-100 border border-white/20 rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
        <div className="mt-3 flex gap-2 flex-wrap">
          {chips.map((c, i) => (
            <button
              key={i}
              onClick={() => setInput(c)}
              className="text-xs rounded-full border border-white/20 bg-white/10 px-3 py-1"
            >{c}</button>
          ))}
          <input
            className="flex-1 border border-white/20 bg-white/10 rounded px-3 py-2 text-white placeholder:text-slate-300"
            placeholder="Votre message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button disabled={pending} className="rounded bg-emerald-600 text-white px-3 py-2 disabled:opacity-50 shadow hover:bg-emerald-500 transition" onClick={send}>
            {pending ? 'Envoi…' : 'Envoyer'}
          </button>
          <button className="rounded border border-white/20 bg-white/10 px-3 py-2" onClick={resetChat}>Réinitialiser</button>
        </div>
        {error ? <div className="mt-2 text-sm text-red-300 break-words">{error}</div> : null}
      </section>

      <section className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
        <h2 className="text-xl font-semibold">Récapitulatif</h2>
        {!draft ? (
          <div className="mt-2 text-sm text-slate-200/80">Brouillon non complet.</div>
        ) : (
          <div className="mt-3 space-y-2 text-sm">
            <div><span className="font-medium">Type:</span> {draft.kind}</div>
            <div><span className="font-medium">Vendeur:</span> {draft.seller.name}</div>
            <div><span className="font-medium">Client:</span> {draft.buyer.name}</div>
            <div>
              <span className="font-medium">Lignes:</span>
              <ul className="list-disc ml-5">
                {draft.items.map((it, idx) => (
                  <li key={idx}>{it.description} — {it.quantity} × {it.unitPrice}{it.vatRate != null ? ` (TVA ${Math.round((it.vatRate||0)*1000)/10}%)` : ''}</li>
                ))}
              </ul>
            </div>
            {totals ? (
              <div className="mt-2">
                <div>Sous-total: {formatCurrency(totals.subtotal, draft.currency)}</div>
                <div>TVA: {formatCurrency(totals.vat, draft.currency)}</div>
                <div className="font-medium">Total: {formatCurrency(totals.total, draft.currency)}</div>
              </div>
            ) : null}
            <div className="mt-3">
              <button
                disabled={!draft || pending}
                onClick={validateAndGenerate}
                className="rounded bg-emerald-600 text-white px-4 py-3 disabled:opacity-50 shadow hover:bg-emerald-500 transition"
              >
                Valider et générer le PDF
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function extractJson(text: string): any | null {
  // 1) Bloc de code ```json ... ``` ou ``` ... ```
  const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (blockMatch) {
    const inside = blockMatch[1].trim();
    try { return JSON.parse(inside); } catch {}
  }
  // 2) Prend du premier { au dernier }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) {
    const candidate = text.slice(start, end + 1);
    try { return JSON.parse(candidate); } catch {}
  }
  // 3) Direct
  try {
    const trimmed = text.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) return JSON.parse(trimmed);
  } catch {}
  return null;
}


