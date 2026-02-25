'use client';

import { useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
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
        alert('Ação não encontrada!');
        setDados(null);
      } else {
        setDados(data);
      }
    } catch (err) {
      console.error('Erro ao buscar dados');
      setDados(null);
    } finally {
      setLoading(false);
    }
  }

  // 🔥 CORREÇÃO AQUI
  const radarData = {
    labels: ['Valor', 'Saúde', 'Crescimento', 'Dividendos', 'Preço'],
    datasets: [
      {
        label: 'Score Plotos',
        data: dados
          ? [
              dados?.scores?.valor ?? 0,
              dados?.scores?.saude ?? 0,
              dados?.scores?.crescimento ?? 0,
              dados?.scores?.dividendos ?? 0,
              dados?.scores?.preco ?? 0,
            ]
          : [0, 0, 0, 0, 0], // 👈 array padrão
        backgroundColor: 'rgba(255, 183, 0, 0.2)',
        borderColor: '#ffb700',
        borderWidth: 3,
        pointBackgroundColor: '#ffb700',
        pointBorderColor: '#fff',
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#fff', font: { size: 14 } },
        ticks: { display: false, stepSize: 20 },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h1 className="text-3xl font-bold tracking-tight">
            PLOTOS <span className="text-[#ffb700]">DASHBOARD</span>
          </h1>

          <div className="flex w-full md:w-auto gap-2">
            <input
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscarAcao()}
              type="text"
              placeholder="Buscar ativo (Ex: PETR4)"
              className="flex-1 md:w-64 p-4 rounded-xl bg-[#1a1a1a] border border-white/10 outline-none focus:border-[#ffb700] transition uppercase font-bold text-center"
            />
            <button
              onClick={buscarAcao}
              disabled={loading}
              className="bg-[#ffb700] text-black px-8 py-4 rounded-xl font-bold hover:bg-[#e6a500] transition active:scale-95 disabled:opacity-50"
            >
              {loading ? '...' : 'Analisar'}
            </button>
          </div>
        </header>

        {dados ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="bg-[#111] border border-white/5 p-8 rounded-3xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-5xl font-black mb-1">{dados.ticker}</h2>
                  <p className="text-gray-400 text-lg">{dados.nome}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">
                    R$ {dados?.preco?.toFixed(2)}
                  </p>
                  <p className="text-green-400 font-medium text-sm">
                    DADOS OFICIAIS B3
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
                  <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">
                    P/L Atual
                  </p>
                  <p className="text-2xl font-bold">
                    {dados?.indicadores?.pl?.toFixed(2)}
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
                  <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">
                    Div. Yield
                  </p>
                  <p className="text-2xl font-bold text-[#ffb700]">
                    {dados?.indicadores?.dy?.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center min-h-[400px]">
              <h3 className="text-xl font-bold mb-6">
                Pontuação Geral (0-100)
              </h3>
              <div className="w-full max-w-[380px]">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 bg-[#111] rounded-3xl border border-white/5">
            <p className="text-gray-500 text-xl font-medium">
              Digite o ticker de uma empresa para iniciar a análise inteligente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}