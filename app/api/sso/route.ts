export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 400 })
  }

  try {
    // Valida o token recebido usando a chave secreta da Vercel
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

    // Prepara o redirecionamento para o dashboard (raiz)
    const response = NextResponse.redirect(new URL("/", req.url))

    // Configuração de cookie para SSO entre subdomínios
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // Necessário para redirecionamentos entre domínios diferentes
      path: "/",
      domain: ".plotos.com.br", // O PONTO ANTES É ESSENCIAL para compartilhar entre plotos.com.br e app.plotos.com.br
    })

    return response
  } catch (err) {
    console.log("ERRO VERIFY:", err)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}