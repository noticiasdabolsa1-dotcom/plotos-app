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
    
    // A Brapi coloca os dados fundamentais dentro de 'fundamental' ou às vezes 
    // direto no objeto se o módulo foi carregado com sucesso.
    const f = acao.fundamental || acao;

    // Lógica de Scores para o Radar (0-100)
    const scoreValor = (f.priceToEarnings > 0 && f.priceToEarnings < 15) ? 85 : 40;
    const scoreSaude = (f.netMargin > 15) ? 90 : 50;
    const scoreDividendos = (f.dividendYield > 8) ? 95 : 60;

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
        // Tentamos pegar de várias chaves possíveis que a Brapi usa
        pl: f.priceToEarnings || f.pe || 0,
        dy: f.dividendYield || f.yield || 0,
        roe: f.returnOnEquity || f.roe || 0
      }
    });

  } catch (error) {
    return NextResponse.json({ error: "Erro na API Brapi" }, { status: 500 });
  }
}