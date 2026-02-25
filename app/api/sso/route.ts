export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  // console.log("--- DEBUG SSO START ---");
  // console.log("1. Token recebido:", token ? "Sim" : "Não");

  if (!token) {
    // Se não houver token, redireciona para o login do site principal
    return NextResponse.redirect(new URL("https://plotos.com.br/login", req.url));
  }

  try {
    const secret = process.env.JWT_SECRET;
    // console.log("2. JWT_SECRET configurado:", secret ? "Sim" : "Não");

    if (!secret) {
      throw new Error("JWT_SECRET não encontrado");
    }

    // Validação do Token
    const decoded = jwt.verify(token, secret);
    // console.log("3. Token validado com sucesso! Dados:", decoded);

    // Prepara o redirecionamento para a raiz do dashboard
    const response = NextResponse.redirect(new URL("/", req.url));

    // Configuração oficial do Cookie para a rede .plotos.com.br
    // console.log("4. Gravando cookie de sessão...");
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      domain: ".plotos.com.br",
      maxAge: 3600, // Expira em 1 hora
    });

    // console.log("--- DEBUG SSO SUCCESS ---");
    return response;

  } catch (err: any) {
    // console.log("--- DEBUG SSO ERROR ---", err.message);
    
    // Em caso de erro (token expirado ou inválido), manda de volta ao login
    return NextResponse.redirect(new URL("https://plotos.com.br/login?error=auth_failed", req.url));
  }
}