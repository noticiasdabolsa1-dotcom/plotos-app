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
    // Valida o token com a chave da Vercel
    jwt.verify(token, process.env.JWT_SECRET as string)

    // Prepara o redirecionamento para a raiz (onde seu dashboard está agora)
    const response = NextResponse.redirect(new URL("/", req.url))

    // CONFIGURAÇÃO MESTRA DO COOKIE
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // Necessário para navegação vinda do WordPress
      path: "/",
      domain: ".plotos.com.br", // O ponto inicial permite que funcione em qualquer subdomínio
    })

    return response
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}