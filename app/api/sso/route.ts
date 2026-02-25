export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  console.log("--- DEBUG SSO START ---");
  console.log("1. Token recebido:", token ? "Sim (presente)" : "Não (vazio)");

  if (!token) {
    console.log("Erro: Token ausente na URL");
    return NextResponse.json({ debug: "No token" }, { status: 400 });
  }

  try {
    // Verifica se o Secret existe
    const secret = process.env.JWT_SECRET;
    console.log("2. JWT_SECRET configurado na Vercel:", secret ? "Sim" : "Não");

    if (!secret) {
      throw new Error("JWT_SECRET não encontrado nas variáveis de ambiente");
    }

    // Tenta validar
    const decoded = jwt.verify(token, secret);
    console.log("3. Token validado com sucesso! Dados:", decoded);

    const response = NextResponse.redirect(new URL("/", req.url));

    // Configura o cookie
    console.log("4. Tentando gravar o cookie no domínio .plotos.com.br");
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      domain: ".plotos.com.br",
      maxAge: 3600,
    });

    console.log("--- DEBUG SSO SUCCESS ---");
    return response;

  } catch (err: any) {
    console.log("--- DEBUG SSO ERROR ---");
    console.log("Erro na validação:", err.message);
    
    return NextResponse.json({ 
      error: "Falha no Debug", 
      details: err.message,
      token_received: !!token 
    }, { status: 401 });
  }
}