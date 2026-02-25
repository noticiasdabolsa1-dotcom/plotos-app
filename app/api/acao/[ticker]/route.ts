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
    
    // Tentamos pegar os fundamentos. Se não existirem (como no caso da COGN3), usamos um objeto vazio.
    const f = acao.fundamental || {};

    // Lógica de Scores - Se o dado for nulo, damos uma nota neutra (50) para o gráfico não sumir
    const scoreValor = (acao.priceEarnings && acao.priceEarnings < 15) ? 85 : 50;
    const scoreSaude = (f.netMargin > 15) ? 90 : 50;
    const scoreDividendos = (f.dividendYield > 5) ? 90 : 40;

    return NextResponse.json({
      ticker: acao.symbol,
      nome: acao.longName || acao.shortName || "Empresa",
      preco: acao.regularMarketPrice || 0,
      scores: {
        valor: scoreValor,
        saude: scoreSaude,
        crescimento: 60,
        dividendos: scoreDividendos,
        preco: 55
      },
      indicadores: {
        // Se for null, enviamos 0 para o dashboard tratar
        pl: acao.priceEarnings || 0,
        dy: f.dividendYield || 0,
        roe: f.returnOnEquity || 0
      }
    });

  } catch (error) {
    return NextResponse.json({ error: "Erro na API Brapi" }, { status: 500 });
  }
}