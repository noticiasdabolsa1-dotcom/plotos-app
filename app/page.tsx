'use client';

import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, TrendingUp, Zap } from 'lucide-react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function DashboardRaiz() {
  const [ticker, setTicker] = useState('PETR4');

  const radarData = {
    labels: ['Valor', 'Saúde', 'Crescimento', 'Dividendos', 'Preço'],
    datasets: [
      {
        label: 'Score Plotos',
        data: [85, 75, 90, 70, 80],
        backgroundColor: 'rgba(0, 212, 255, 0.15)',
        borderColor: '#00d4ff',
        borderWidth: 2,
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: '#fff',
        pointRadius: 3,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        angleLines: { color: 'rgba(255,255,255,0.05)' },
        pointLabels: {
          color: '#64748b',
          font: { size: 11, weight: 'bold' as const },
        },
        ticks: { display: false },
        suggestMin: 0,
        suggestMax: 100,
      },
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-4 md:p-8 font-sans selection:bg-[#00d4ff]/30">
      {/* Luzes de fundo sutis como no primeiro design */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <div className="flex items-center gap-2">
          <div className="bg-[#00d4ff] text-black w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(0,212,255,0.4)]">
            P
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">Plotos</span>
        </div>

        <div className="relative group">
          <input
            type="text"
            placeholder="Buscar Ticker..."
            className="bg-[#0f172a] border border-white/10 text-white py-2.5 px-6 rounded-xl w-64 focus:outline-none focus:border-[#00d4ff]/50 transition-all font-bold text-sm"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#00d4ff]" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUNA ESQUERDA: PERFIL QUANTITATIVO (Igual ao AI Studio) */}
        <section className="lg:col-span-4 bg-[#0a0f1e] rounded-[2rem] border border-white/5 p-8 flex flex-col items-center">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Perfil Quantitativo</span>
          
          <div className="w-full h-64 mb-8">
            <Radar data={radarData} options={radarOptions} />
          </div>

          <div className="text-center w-full">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Veredito Plotos</p>
            <div className="text-8xl font-black tracking-tighter text-white mb-4">
              55<span className="text-2xl text-slate-600 font-bold">/100</span>
            </div>
            
            {/* Barra de Progresso do Primeiro Design */}
            <div className="flex justify-between text-[9px] font-bold text-slate-600 mb-2 uppercase px-1">
              <span>Evitar</span>
              <span>Aguardar</span>
              <span>Compra</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-[2px]">
              <div className="h-full bg-gradient-to-r from-blue-600 to-[#00d4ff] rounded-full shadow-[0_0_10px_#00d4ff]" style={{ width: '55%' }} />
            </div>
            <button className="w-full mt-6 py-4 bg-[#1e293b] hover:bg-[#334155] rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
              Na Média
            </button>
          </div>
        </section>

        {/* COLUNA DIREITA: INDICADORES E CHECKLIST */}
        <section className="lg:col-span-8 space-y-6">
          
          {/* Header do Ativo */}
          <div className="flex justify-between items-end bg-[#0a0f1e] p-8 rounded-[2rem] border border-white/5">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-6xl font-black tracking-tighter">{ticker}</h1>
                <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded font-bold">PN</span>
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Renova Energia S.A.</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black tracking-tighter">R$ 1.13</div>
              <div className="text-emerald-400 text-xs font-bold flex items-center justify-end gap-1">
                <TrendingUp className="w-3 h-3" /> 4.63%
              </div>
            </div>
          </div>

          {/* Grid de Indicadores (Estilo Cards do AI Studio) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MiniCard label="P/L" value="-2.57" />
            <MiniCard label="DY" value="0.00%" />
            <MiniCard label="ROE" value="0.00%" />
            <MiniCard label="M. CAP" value="R$ 0.0B" />
          </div>

          {/* Checklist de Segurança (Aquele toque que faltava no seu manual) */}
          <div className="bg-[#0a0f1e] p-8 rounded-[2rem] border border-white/5">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-4 h-4 text-[#00d4ff]" />
              <h3 className="font-black text-sm uppercase tracking-widest">Checklist de Segurança</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CheckItem label="Dívida Controlada" status={true} />
              <CheckItem label="Lucro Positivo" status={false} />
              <CheckItem label="Liquidez Corrente > 1" status={false} />
              <CheckItem label="Margem Líquida > 5%" status={false} />
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

// Sub-componentes para manter o código limpo
function MiniCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-[#0a0f1e] border border-white/5 p-5 rounded-2xl hover:border-[#00d4ff]/30 transition-colors">
      <p className="text-[9px] font-black text-slate-500 uppercase mb-1">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}

function CheckItem({ label, status }: { label: string, status: boolean }) {
  return (
    <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
      <span className="text-[11px] font-bold text-slate-300">{label}</span>
      {status ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
    </div>
  );
}