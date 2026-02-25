export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { ticker: string } }) {
  const ticker = params.ticker.toUpperCase();
  const API_KEY = "7aC3r3MXoNnquGz4qVdS4w"; 

  try {
    const response = await fetch(
      `https://brapi.dev/api/quote/${ticker}?token=${API_KEY}&modules=fundamental`
    );
    const data = await response.json();

    // 1. CORREÇÃO: Pegar o primeiro item da lista de resultados
    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ error: "Ação não encontrada" }, { status: 404 });
    }

    const acao = data.results[0]; // Agora 'acao' contém os dados reais da PETR4, VALE3, etc.

    // 2. Lógica de Scores (Baseada nos dados reais que a Brapi entrega)
    const fundamental = acao.fundamental || {};
    
    // Valor: P/L baixo e positivo ganha nota alta
    const scoreValor = (fundamental.priceToEarnings > 0 && fundamental.priceToEarnings < 15) ? 85 : 40;
    
    // Saúde: Margem Líquida acima de 15% ganha nota alta
    const scoreSaude = (fundamental.netMargin || 0) > 15 ? 90 : 50;
    
    // Dividendos: DY acima de 8% ganha nota alta
    const scoreDividendos = (fundamental.dividendYield || 0) > 8 ? 95 : 60;

    // 3. RETORNO: Ajustado para o que o seu Dashboard (page.tsx) espera
    return NextResponse.json({
      ticker: acao.symbol,
      nome: acao.longName || acao.shortName,
      preco: acao.regularMarketPrice,
      scores: {
        valor: scoreValor,
        saude: scoreSaude,
        crescimento: 70, 
        dividendos: scoreDividendos,
        preco: 65
      },
      indicadores: {
        pl: fundamental.priceToEarnings || 0,
        dy: fundamental.dividendYield || 0,
        roe: fundamental.returnOnEquity || 0
      }
    });

  } catch (error) {
    return NextResponse.json({ error: "Erro na API Brapi" }, { status: 500 });
  }
}