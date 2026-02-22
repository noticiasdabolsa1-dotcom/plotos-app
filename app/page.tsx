export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#f1f5f9] p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header Simples Plotos */}
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-black text-[#1e3a8a] tracking-tighter">PLOTOS ANALISE</h1>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm text-xs font-bold text-slate-500 border border-slate-100">
            ÁREA DE MEMBROS
          </div>
        </header>

        {/* Ticker de Cotações (Placeholder) */}
        <div className="bg-[#1e3a8a] text-white p-2 rounded-lg mb-8 text-sm overflow-hidden whitespace-nowrap">
          <span className="inline-block animate-pulse">PETR4 R$ 37,81 • VALE3 R$ 66,20 • ITUB4 R$ 32,15 • </span>
        </div>

        {/* Área onde entrará o Radar e Indicadores */}
        <div className="bg-white rounded-[32px] p-10 shadow-xl border border-slate-100 text-center">
          <p className="text-slate-400 font-medium">Bem-vindo ao seu novo Dashboard Profissional.</p>
          <p className="text-xs text-slate-300 mt-2 italic">Aguardando integração com SSO WordPress...</p>
        </div>
      </div>
    </main>
  );
}