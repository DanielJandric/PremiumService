async function fetchDocuments() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/documents`, {
    cache: 'no-store',
  });
  return res.json();
}

export default async function DocumentsPage() {
  const docs = await fetchDocuments();
  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Documents</h1>
        <a href="/wizard" className="rounded bg-black text-white px-3 py-1">Nouveau devis/facture</a>
      </div>
      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Type</th>
            <th className="py-2">Numéro</th>
            <th className="py-2">Client</th>
            <th className="py-2">Date</th>
            <th className="py-2">Total</th>
            <th className="py-2">PDF</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(docs) && docs.length > 0 ? (
            docs.map((d: any) => (
              <tr key={d.id} className="border-b">
                <td className="py-2">{d.kind}</td>
                <td className="py-2">{d.number}</td>
                <td className="py-2">{d.customer?.name}</td>
                <td className="py-2">{new Date(d.issueDate).toLocaleDateString('fr-CH')}</td>
                <td className="py-2">{d.total}</td>
                <td className="py-2">
                  {d.pdfPublicUrl ? (
                    <a href={d.pdfPublicUrl} className="text-blue-600 underline" target="_blank">Ouvrir</a>
                  ) : null}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-6 text-center text-slate-600">Aucun document.</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}

