export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  // Log para depuração no painel da Vercel
  console.log("TOKEN RECEBIDO DO WORDPRESS:", token)

  if (!token) {
    return NextResponse.json(
      { error: "No token" },
      { status: 400 }
    )
  }

  try {
    // Valida o token usando a sua chave mestre configurada na Vercel
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    )

    console.log("TOKEN VALIDADO COM SUCESSO PARA O USUÁRIO:", decoded)

    // Prepara o redirecionamento para o dashboard
    const response = NextResponse.redirect(
      new URL("/", req.url)
    )

    // Configuração vital do cookie para funcionar entre subdomínios
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: true, // Obrigatório para sameSite: "none"
      sameSite: "none", // Necessário para navegação vindo de domínio externo
      path: "/",
      domain: ".plotos.com.br", // Permite que o cookie seja lido em app.plotos.com.br
    })

    return response

  } catch (err) {
    console.log("ERRO NA VALIDAÇÃO DO JWT:", err)
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    )
  }
}