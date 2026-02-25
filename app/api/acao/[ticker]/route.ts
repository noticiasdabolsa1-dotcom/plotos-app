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

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ error: "Ação não encontrada" }, { status: 404 });
    }

    const acao = data.results[0];
    
    // Tenta pegar o P/L da raiz (priceEarnings) ou do módulo (fundamental)
    const plReal = acao.priceEarnings || acao.fundamental?.priceToEarnings || 0;
    const dyReal = acao.dividendYield || acao.fundamental?.dividendYield || 0;

    return NextResponse.json({
      ticker: acao.symbol,
      nome: acao.longName || acao.shortName,
      preco: acao.regularMarketPrice,
      scores: {
        valor: (plReal > 0 && plReal < 15) ? 80 : 45,
        saude: 70,
        crescimento: 65,
        dividendos: (dyReal > 6) ? 90 : 50,
        preco: 60
      },
      indicadores: {
        pl: plReal,
        dy: dyReal,
        roe: acao.fundamental?.returnOnEquity || 0
      }
    });

  } catch (error) {
    return NextResponse.json({ error: "Erro na API" }, { status: 500 });
  }
}