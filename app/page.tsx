'use client';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function Dashboard() {
  const [ticker, setTicker] = useState('');
  const [dados, setDados] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function buscarAcao() {
    if (!ticker) return;
    setLoading(true);
    try {
      // Conecta com a sua API interna que você configurou no StackBlitz
      const res = await fetch(`/api/acao/${ticker.toUpperCase()}`);
      const data = await res.json();
      if (data.erro) alert("Ação não encontrada!");
      else setDados(data);
    } catch (err) {
      console.error("Erro ao buscar dados");
    } finally {
      setLoading(false);
    }
  }

  const radarData = {
    labels: ['P/L', 'DY', 'ROE', 'Crescimento', 'Margem'],
    datasets: [{
      label: 'Score Plotos',
      data: dados ? [
        dados.pl < 15 ? 8 : 4,
        parseFloat(dados.dy) > 10 ? 9 : parseFloat(dados.dy) / 1.2,
        parseFloat(dados.roe) > 15 ? 9 : 5,
        7, 6 // Valores base para o gráfico não ficar vazio
      ] : [0, 0, 0, 0, 0],
      backgroundColor: 'rgba(30, 58, 138, 0.2)',
      borderColor: '#1e3a8a',
      borderWidth: 2,
    }],
  };

  return (
    <main className="min-h-screen bg-[#f1f5f9] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto">
        
        {/* Barra de Busca Profissional */}
        <div className="mb-8 flex gap-3">
          <input 
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            type="text" 
            placeholder="EX: PETR4" 
            className="flex-1 p-4 rounded-2xl border border-slate-200 outline-none shadow-sm uppercase font-bold"
          />
          <button 
            onClick={buscarAcao}
            className="bg-[#1e3a8a] text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-900 transition shadow-lg active:scale-95"
          >
            {loading ? '...' : 'Analisar'}
          </button>
        </div>

        {dados && (
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-white animate-in fade-in zoom-in duration-500">
            <span className="text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase">Análise de Ativo</span>
            <h1 className="text-5xl font-black text-slate-900 mt-2 tracking-tighter">{dados.ticker}</h1>
            <p className="text-2xl font-medium text-slate-400 mb-8">R$ {dados.preco.toFixed(2)}</p>

            {/* Grid de Indicadores (Fim do 0.00%) */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">P/L Atual</span>
                <span className="text-xl font-black text-slate-800">{dados.pl}</span>
              </div>
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Div. Yield</span>
                <span className="text-xl font-black text-emerald-600">{dados.dy}%</span>
              </div>
            </div>

            {/* Gráfico de Radar Plotos */}
            <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100">
               <Radar data={radarData} options={{ scales: { r: { min: 0, max: 10, ticks: { display: false } } }, plugins: { legend: { display: false } } }} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}