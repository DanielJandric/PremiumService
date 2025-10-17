"use client";
import { useState } from 'react';
import Editor from '@monaco-editor/react';

const defaultHtml = `<h1 style="color: {{brand.primaryColor}};">{{company.name}}</h1>`;
const defaultCss = `@page { margin: 20mm; }`;

export default function TemplatesPage() {
  const [html, setHtml] = useState<string>(defaultHtml);
  const [css, setCss] = useState<string>(defaultCss);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function onPreview() {
    setLoading(true);
    setError(null);
    setPreviewUrl(null);
    try {
      const res = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/pdf' },
        body: JSON.stringify({
          html,
          css,
          data: {
            brand: { primaryColor: '#0b1f1a' },
            company: { name: 'Premium Solution' },
          },
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (e: any) {
      setError(e?.message ?? 'Erreur inconnue lors de la génération du PDF');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-10"
        style={{
          backgroundImage: `url('${['/Gemini_Generated_Image_82nrsb82nrsb82nr.png','/Gemini_Generated_Image_dgh8bqdgh8bqdgh8 (1).png','/Gemini_Generated_Image_dgh8bqdgh8bqdgh8 (3).png'][new Date().getDay()%3]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      <div className="bg-card/90 border rounded-2xl p-4 shadow-xl">
        <h2 className="text-lg font-semibold text-foreground">Éditeur de template</h2>
        <div className="mt-3 text-xs text-muted-foreground">HTML</div>
        <div className="mt-1 overflow-hidden rounded-lg border">
          <Editor height="50vh" defaultLanguage="html" value={html} onChange={(v) => setHtml(v ?? '')} theme="vs-dark" options={{ minimap: { enabled: false } }} />
        </div>
        <div className="mt-4 text-xs text-muted-foreground">CSS</div>
        <div className="mt-1 overflow-hidden rounded-lg border">
          <Editor height="22vh" defaultLanguage="css" value={css} onChange={(v) => setCss(v ?? '')} theme="vs-dark" options={{ minimap: { enabled: false } }} />
        </div>
        <div className="mt-4">
          <button className="rounded-lg bg-primary text-primary-foreground px-4 py-2 shadow hover:opacity-90 transition disabled:opacity-50" onClick={onPreview} disabled={loading}>
            {loading ? 'Génération…' : 'Aperçu PDF'}
          </button>
          {error ? (
            <div className="mt-2 text-sm text-destructive break-words">{error}</div>
          ) : null}
        </div>
      </div>
      <div className="bg-card/90 border rounded-2xl p-4 shadow-card min-h-[78vh] flex items-center justify-center">
        {previewUrl ? (
          <iframe src={previewUrl} className="w-full h-[76vh] rounded-lg border bg-background" />
        ) : (
          <div className="text-muted-foreground text-sm">Appuyez sur “Aperçu PDF” pour générer un PDF temporaire.</div>
        )}
      </div>
      </div>
    </div>
  );
}

