'use client';

import React from 'react';
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
import { Target } from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function CardRadar() {
  const data = {
    labels: ['Valor', 'Saúde', 'Crescimento', 'Dividendos', 'Preço'],
    datasets: [
      {
        label: 'Pontuação Plotos',
        data: [85, 70, 90, 65, 80],
        backgroundColor: 'rgba(0, 212, 255, 0.2)',
        borderColor: '#00d4ff',
        borderWidth: 3,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#00d4ff',
        pointHoverBackgroundColor: '#00d4ff',
        pointHoverBorderColor: '#fff',
        pointRadius: 4,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: {
          color: '#94a3b8',
          font: { size: 12, weight: 'bold' as const },
        },
        ticks: { display: false, count: 5 },
        suggestedMin: 0, // corrigido
        suggestedMax: 100, // corrigido
      },
    },
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-[#081b3b] rounded-[2.5rem] p-10 shadow-2xl border border-white/5 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
      
      <div className="absolute top-10 left-10 flex items-center gap-3">
        <div className="p-2 bg-[#00d4ff]/10 rounded-lg">
          <Target className="w-5 h-5 text-[#00d4ff]" />
        </div>
        <h3 className="text-xl font-black tracking-tight text-white uppercase">
          Radar Quantitativo
        </h3>
      </div>

      <div className="w-full h-full mt-12">
        <Radar data={data} options={options} />
      </div>

      <div className="absolute bottom-10 right-10 text-right">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
          Score Geral
        </p>
        <div className="text-5xl font-black text-[#00d4ff] tracking-tighter">
          78<span className="text-xl text-slate-500">/100</span>
        </div>
      </div>

    </div>
  );
}