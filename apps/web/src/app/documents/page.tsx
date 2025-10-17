async function fetchDocuments() {
  const res = await fetch(`/api/documents`, {
    cache: 'no-store',
  });
  return res.json();
}

export default async function DocumentsPage() {
  const docs = await fetchDocuments();
  return (
    <main className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Documents</h1>
        <a href="/documents/new" className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-primary-foreground shadow hover:opacity-90">Nouveau devis/facture</a>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border bg-card/90">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b bg-accent/40">
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-3">Numéro</th>
              <th className="py-2 px-3">Client</th>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Total</th>
              <th className="py-2 px-3">PDF</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(docs) && docs.length > 0 ? (
              docs.map((d: any) => (
                <tr key={d.id} className="border-b">
                  <td className="py-2 px-3">{d.kind}</td>
                  <td className="py-2 px-3">{d.number}</td>
                  <td className="py-2 px-3">{d.customer?.name}</td>
                  <td className="py-2 px-3">{new Date(d.issueDate).toLocaleDateString('fr-CH')}</td>
                  <td className="py-2 px-3">{d.total}</td>
                  <td className="py-2 px-3">
                    {d.pdfPublicUrl ? (
                      <a href={d.pdfPublicUrl} className="text-primary underline" target="_blank">Ouvrir</a>
                    ) : null}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-6 text-center text-muted-foreground">Aucun document.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

