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

// Registra os componentes necessários para o gráfico de radar
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

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
        alert("Ação não encontrada!");
        setDados(null);
      } else {
        setDados(data);
      }
    } catch (err) {
      console.error("Erro ao buscar dados");
    } finally {
      setLoading(false);
    }
  }

  // Configuração do Radar baseada nas 5 dimensões do Tradar
  const radarData = {
    labels: ['Valor', 'Saúde', 'Crescimento', 'Dividendos', 'Preço'],
    datasets: [
      {
        label: 'Score Plotos',
        data: dados ? [
          dados.scores.valor,
          dados.scores.saude,
          dados.scores.crescimento,
          dados.scores.dividendos,
          dados.scores.preco
        ] : ,
        backgroundColor: 'rgba(255, 183, 0, 0.2)', // Amarelo/Dourado estilo Tradar
        borderColor: '#ffb700',
        borderWidth: 3,
        pointBackgroundColor: '#ffb700',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#ffb700',
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
          <h1 className="text-3xl font-bold tracking-tight">PLOTOS <span className="text-[#ffb700]">DASHBOARD</span></h1>
          
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
              className="bg-[#ffb700] text-black px-8 py-4 rounded-xl font-bold hover:bg-[#e6a500] transition active:scale-95 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? '...' : 'Analisar'}
            </button>
          </div>
        </header>

        {dados ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            {/* Bloco de Informações Principais */}
            <div className="bg-[#111] border border-white/5 p-8 rounded-3xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-5xl font-black mb-1">{dados.ticker}</h2>
                  <p className="text-gray-400 text-lg">{dados.nome}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">R$ {dados.preco.toFixed(2)}</p>
                  <p className="text-green-400 font-medium">Dados Oficiais B3</p>
                </div>
              </div>

              {/* Grid de Mini Indicadores */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl text-center">
                  <p className="text-gray-500 text-sm mb-1 uppercase">P/L Atual</p>
                  <p className="text-2xl font-bold">{dados.indicadores.pl.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl text-center">
                  <p className="text-gray-500 text-sm mb-1 uppercase">Dividend Yield</p>
                  <p className="text-2xl font-bold text-[#ffb700]">{dados.indicadores.dy.toFixed(2)}%</p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-[#ffb700]/5 border border-[#ffb700]/20 rounded-2xl">
                <h3 className="text-[#ffb700] font-bold mb-2">Veredito do Radar</h3>
                <p className="text-gray-300 leading-relaxed">
                  O ativo apresenta um forte score em <span className="text-white font-bold">Saúde Financeira</span> ({dados.scores.saude}) e 
                  <span className="text-white font-bold"> Dividendos</span> ({dados.scores.dividendos}), superando a média do setor.
                </p>
              </div>
            </div>

            {/* Bloco do Gráfico de Radar */}
            <div className="bg-[#111] border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center min-h-[400px]">
              <h3 className="text-xl font-bold mb-6">Pontuação Geral (0-100)</h3>
              <div className="w-full max-w-[400px]">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-[#111] rounded-3xl border border-white/5">
            <p className="text-gray-500 text-xl">Digite um ticker acima para iniciar a análise inteligente.</p>
          </div>
        )}
      </div>
    </div>
  );
}