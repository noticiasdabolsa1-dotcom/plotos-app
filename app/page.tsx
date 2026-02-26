'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Search, TrendingUp, Zap, Activity, DollarSign } from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// 🔥 Import dinâmico para evitar erro SSR na Vercel
const Radar = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Radar),
  { ssr: false }
);

export default function Dashboard() {
  const [ticker, setTicker] = useState('');
  const [dados, setDados] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function buscarAcao() {
    if (!ticker) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/acao/${ticker.toUpperCase()}`);
      const data = await res.json();

      if (data.error) {
        alert('Ativo não encontrado!');
        setDados(null);
      } else {
        setDados(data);
      }
    } catch (err) {
      console.error('Erro na busca', err);
    } finally {
      setLoading(false);
    }
  }

  const radarData = {
    labels: ['Valor', 'Saúde', 'Crescimento', 'Dividendos', 'Preço'],
    datasets: [
      {
        label: 'Score Plotos',
        data: [
          dados?.scores?.valor ?? 0,
          dados?.scores?.saude ?? 0,
          dados?.scores?.crescimento ?? 0,
          dados?.scores?.dividendos ?? 0,
          dados?.scores?.preco ?? 0,
        ],
        backgroundColor: 'rgba(0, 212, 255, 0.2)',
        borderColor: '#00d4ff',
        borderWidth: 3,
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: '#fff',
        pointRadius: 4,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: {
          color: '#cbd5e1',
          font: { size: 12, weight: 'bold' as const },
        },
        ticks: { display: false },
        min: 0,
        max: 100,
      },
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#081b3b] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">P</span>
            </div>
            <h1 className="text-2xl font-black text-[#081b3b] uppercase tracking-tighter">
              Plotos
            </h1>
          </div>

          <div className="flex w-full md:w-auto bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200/60">
            <input
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscarAcao()}
              type="text"
              placeholder="Buscar ativo... (Ex: PETR4)"
              className="flex-1 md:w-64 px-4 py-3 rounded-xl outline-none text-slate-600 font-medium uppercase"
            />
            <button
              onClick={buscarAcao}
              className="bg-[#081b3b] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0a2652] transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? '...' : <Search size={20} />}
            </button>
          </div>
        </header>

        {dados ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-[#081b3b] rounded-[2.5rem] shadow-2xl p-8 text-white border border-white/5">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-6xl font-black mb-1 tracking-tighter">
                    {dados.ticker}
                  </h2>
                  <p className="text-blue-200/70 font-semibold uppercase text-sm">
                    {dados.nome}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold tracking-tight">
                    R$ {dados?.preco?.toFixed?.(2) ?? '0.00'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-10">
                <MiniCard
                  label="P/L Atual"
                  value={(dados?.indicadores?.pl ?? 0).toFixed(2)}
                  icon={<Activity size={14} />}
                />
                <MiniCard
                  label="Div. Yield"
                  value={`${(dados?.indicadores?.dy ?? 0).toFixed(2)}%`}
                  icon={<DollarSign size={14} />}
                  highlight
                />
                <MiniCard
                  label="ROE"
                  value={`${(dados?.indicadores?.roe ?? 0).toFixed(2)}%`}
                  icon={<TrendingUp size={14} />}
                />
              </div>

              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
                <h3 className="text-[#00d4ff] font-bold text-sm mb-2 flex items-center gap-2">
                  <Zap size={16} fill="#00d4ff" /> Veredito do Radar
                </h3>
                <p className="text-blue-100/80 text-sm leading-relaxed font-medium">
                  Nota geral:{' '}
                  {(
                    (
                      (dados?.scores?.valor ?? 0) +
                      (dados?.scores?.saude ?? 0) +
                      (dados?.scores?.crescimento ?? 0) +
                      (dados?.scores?.dividendos ?? 0) +
                      (dados?.scores?.preco ?? 0)
                    ) / 5
                  ).toFixed(0)}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#081b3b] rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center justify-center border border-white/5 min-h-[450px]">
              <h3 className="text-lg font-bold text-white mb-8">
                Pontuação Geral (0-100)
              </h3>
              <div className="w-full h-[300px]">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[3rem] shadow-sm border border-slate-200/50">
            <p className="text-slate-400 lg:text-xl font-medium px-6">
              Digite um ticker para iniciar a análise inteligente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white/5 p-5 rounded-3xl border border-white/10 text-center flex flex-col items-center">
      <div className="text-blue-200/50 mb-2">{icon}</div>
      <p className="text-blue-200/50 text-[10px] font-bold uppercase mb-1 tracking-wider">
        {label}
      </p>
      <p
        className={`text-xl font-black ${
          highlight ? 'text-[#00d4ff]' : 'text-white'
        }`}
      >
        {value}
      </p>
    </div>
  );
}