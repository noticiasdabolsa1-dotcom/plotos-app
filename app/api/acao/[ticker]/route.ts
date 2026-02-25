export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { ticker: string } }) {
  const ticker = params.ticker;
  const API_KEY = "7aC3r3MXoNnquGz4qVdS4w"; // Sua chave Brapi

  try {
    // Busca cotação e fundamentos na Brapi
    const response = await fetch(
      `https://brapi.dev/api/quote/${ticker}?token=${API_KEY}&modules=fundamental`
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ error: "Ação não encontrada" }, { status: 404 });
    }

    const acao = data.results;

    // Lógica de Scores Estilo Tradar (Exemplo de normalização 0-100)
    // No Tradar, quanto menor o P/L (positivo), maior a nota de Valor [6]
    const scoreValor = acao.fundamental?.priceToEarnings < 15 ? 85 : 40;
    const scoreSaude = (acao.fundamental?.netMargin || 0) > 15 ? 90 : 50;
    const scoreDividendos = (acao.fundamental?.dividendYield || 0) > 8 ? 95 : 60;

    return NextResponse.json({
      ticker: acao.symbol,
      nome: acao.longName,
      preco: acao.regularMarketPrice,
      scores: {
        valor: scoreValor,
        saude: scoreSaude,
        crescimento: 70, // Valor base para evoluirmos depois
        dividendos: scoreDividendos,
        preco: 65
      },
      indicadores: {
        pl: acao.fundamental?.priceToEarnings || 0,
        dy: acao.fundamental?.dividendYield || 0,
        roe: acao.fundamental?.returnOnEquity || 0
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro na API Brapi" }, { status: 500 });
  }
}