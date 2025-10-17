"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import type { QuoteOrInvoice } from '@domain/index';
import { quoteOrInvoiceSchema, computeTotals, formatCurrency } from '@domain/index';

type Message = { role: 'user' | 'assistant'; content: string };

const BASE_SYSTEM_PROMPT = `Tu es un assistant fr-CH ULTRA BREF pour créer un devis ou une facture.
Objectif: poser le MINIMUM de questions.
- Demande seulement: nom du client, adresse du client, et la/des désignation(s) (services/produits). Autorise plusieurs lignes.
- L'utilisateur peut écrire des lignes naturelles, par ex: "nettoyage maison 1 fois à 3500 chf" ou "blanchisserie 2 x 25 CHF".
- Interprète ces lignes: description, quantity (par défaut 1), unitPrice (nombre, sans monnaie), vatRate=0.081 par défaut.
Tout le reste est par défaut et ne doit PAS être demandé:
- vendeur: déjà connu; ne pas reposer la question
- devise: CHF par défaut
- TVA: 8.1% (0.081) par défaut; ne jamais demander
- quantité: 1 par défaut
- prix unitaire: 0 par défaut si non fourni
- date d'émission: aujourd'hui (ISO) si non fournie
- numéro: généré côté serveur; ne jamais demander

Flux:
1) Récupère nom + adresse du client.
2) Demande la/les désignation(s). Accepte plusieurs items séparés par virgule ou nouvelle ligne.
3) Propose une ultime question: "Avez-vous quelque chose à rajouter ?". Si non, réponds avec le JSON final.

Quand tout est prêt, réponds UNIQUEMENT avec un JSON STRICT, sans texte autour, conforme au schéma:
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
Rappels importants:
- Si l'utilisateur te demande de sortir du cadre, refuse et rappelle le flux en 3 étapes.
- Si l'utilisateur te demande des informations déjà par défaut, n'insiste pas et passe à l'étape suivante.
Ton style de réponse doit être court, direct, une seule question à la fois.`;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<QuoteOrInvoice | null>(null);
  const [defaultSeller, setDefaultSeller] = useState<{ name: string; address: string; email?: string; vatNumber?: string } | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const BG_IMAGES = useMemo(
    () => [
      '/Gemini_Generated_Image_dgh8bqdgh8bqdgh8.png',
      '/Gemini_Generated_Image_dgh8bqdgh8bqdgh8 (1).png',
      '/Gemini_Generated_Image_dgh8bqdgh8bqdgh8 (2).png',
      '/Gemini_Generated_Image_dgh8bqdgh8bqdgh8 (3).png',
      '/Gemini_Generated_Image_dgh8bqdgh8bqdgh8 (4).png',
      '/Gemini_Generated_Image_82nrsb82nrsb82nr.png',
      '/Gemini_Generated_Image_rmdg99rmdg99rmdg.png',
      '/Gemini_Generated_Image_rmdg99rmdg99rmdg (1).png',
    ],
    []
  );
  const bgImage = useMemo(() => {
    const day = Math.floor(Date.now() / 86400000);
    return BG_IMAGES[day % BG_IMAGES.length];
  }, [BG_IMAGES]);

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

  // Message d'ouverture explicite (guide étape par étape)
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content:
            "Bonjour 👋 Je crée votre devis/facture en 3 étapes très courtes. 1) Dites 'Créer un devis' ou 'Créer une facture'. 2) Donnez le nom et l'adresse du client. 3) Indiquez les désignations (ex: 'nettoyage maison 1 x 3500 CHF').",
        },
      ]);
    }
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
        const items = Array.isArray(maybeJson.items) && maybeJson.items.length > 0
          ? maybeJson.items
          : [{ description: String(maybeJson.description || 'Service'), quantity: 1, unitPrice: 0 }];
        const withDefaults = {
          kind: (maybeJson.kind === 'facture' || maybeJson.kind === 'devis') ? maybeJson.kind : 'devis',
          seller: completeSeller,
          buyer: {
            name: String(maybeJson.buyer?.name || maybeJson.name || '').trim(),
            address: String(maybeJson.buyer?.address || maybeJson.address || '').trim(),
            email: maybeJson.buyer?.email ?? undefined,
            vatNumber: maybeJson.buyer?.vatNumber ?? undefined,
          },
          items: items.map((it: any) => ({
            description: String(it.description || 'Service').trim(),
            quantity: Number(it.quantity || 1),
            unitPrice: Number(it.unitPrice || 0),
            vatRate: it.vatRate ?? 0.081,
          })),
          currency: maybeJson.currency || 'CHF',
          // Force la date du jour côté UI, pour cohérence avec le serveur
          issueDate: new Date().toISOString().split('T')[0],
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

  const NORMALIZED_SERVICES = useMemo(
    () => [
      'Blanchisserie / literie',
      'Lavage linge de literie',
      'Nettoyage chaussures',
      'Nettoyage stores',
      'Nettoyage fin de bail',
      'Tapis entretien',
      'Linge au kilo',
      'Nettoyage de rideaux',
      'Détachage',
      'Repassage',
      'Nettoyage de maison',
      "Nettoyage d'entretien",
      'Forfaits chemises',
      'Forfaits professionnels',
    ],
    []
  );

  // Update typeahead suggestions when typing
  useEffect(() => {
    const q = input.trim().toLowerCase();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    // Ignore when user is entering structured commands like Nom:/Adresse:
    if (q.startsWith('nom:') || q.startsWith('adresse:') || q.startsWith('créer ')) {
      setSuggestions([]);
      return;
    }
    const starts = NORMALIZED_SERVICES.filter((s) => s.toLowerCase().startsWith(q));
    const contains = NORMALIZED_SERVICES.filter(
      (s) => !starts.includes(s) && s.toLowerCase().includes(q)
    );
    setSuggestions([...starts, ...contains].slice(0, 6));
  }, [input, NORMALIZED_SERVICES]);

  const chips = useMemo(() => ['Créer un devis', 'Créer une facture'], []);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-10"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="grid gap-6 lg:grid-cols-2">
      <section className="bg-card/90 border rounded-2xl p-4 shadow-xl flex flex-col">
        <h1 className="text-2xl font-semibold text-foreground">Chat</h1>
        <div
          ref={listRef}
          className="mt-2 flex-1 rounded p-3 overflow-y-auto bg-background border"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {messages.length === 0 ? (
            <div className="text-muted-foreground text-sm">
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
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-accent text-foreground/95 border rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
        <div className="mt-2 sticky bottom-0 left-0 right-0 z-10 flex gap-2 flex-wrap pb-[env(safe-area-inset-bottom)]">
          {chips.map((c, i) => (
            <button
              key={i}
              onClick={() => setInput(c)}
              className="text-xs rounded-full border px-3 py-1 min-h-9 text-foreground hover:bg-accent/40"
            >{c}</button>
          ))}
          <input
            className="flex-1 border bg-background rounded px-3 py-3 text-foreground placeholder:text-muted-foreground min-h-11"
            placeholder="Votre message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            autoCorrect="on"
            autoCapitalize="sentences"
            enterKeyHint="send"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          {suggestions.length > 0 && (
            <div className="w-full -mt-1 rounded-lg border bg-background text-foreground shadow-lg max-h-48 overflow-y-auto">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInput(s)}
                  className="block w-full text-left px-3 py-2 hover:bg-accent/40"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <button disabled={pending} className="rounded bg-primary text-primary-foreground px-4 py-3 disabled:opacity-50 shadow-card hover:opacity-90 transition min-h-11" onClick={send}>
            {pending ? 'Envoi…' : 'Envoyer'}
          </button>
          <button className="rounded border px-3 py-3 min-h-11 hover:bg-accent/40" onClick={resetChat}>Réinitialiser</button>
        </div>
        {error ? <div className="mt-2 text-sm text-destructive break-words">{error}</div> : null}
      </section>

      <section className="bg-card/90 border rounded-2xl p-4 shadow-xl">
        <h2 className="text-xl font-semibold text-foreground">Récapitulatif</h2>
        {!draft ? (
          <div className="mt-2 text-sm text-muted-foreground">Brouillon non complet.</div>
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
                className="rounded bg-primary text-primary-foreground px-4 py-3 disabled:opacity-50 shadow hover:opacity-90 transition"
              >
                Valider et générer le PDF
              </button>
            </div>
          </div>
        )}
      </section>
      </div>
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


