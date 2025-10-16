export default function HomePage() {
  return (
    <div>
      <div className="relative overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl min-h-[70vh] flex items-center">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <img src="/template/logo.png" alt="" className="opacity-20 w-[85%] max-w-[1100px] mix-blend-overlay" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-semibold">Bienvenue dans l’environnement de génération de factures et PDF de Premium Solution</h1>
          <p className="mt-3 text-slate-200/90 max-w-2xl">
            Créez des devis et des factures en quelques minutes, avec un assistant conversationnel, une
            validation stricte et des PDF élégants. Choisissez votre entrée ci-dessous.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/chat" className="rounded-lg bg-white/10 px-4 py-2 border border-white/20 hover:bg-white/15 transition">Assistant Chat</a>
            <a href="/documents" className="rounded-lg bg-white/10 px-4 py-2 border border-white/20 hover:bg-white/15 transition">Archive documents</a>
          </div>
        </div>
      </div>
    </div>
  );
}

