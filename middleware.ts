import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value
  const { pathname } = request.nextUrl

  // 1. Se o usuário tentar acessar a raiz (onde está o dashboard agora)
  if (pathname === "/") {
    // Se não houver sessão, bloqueia e manda para o login
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Se houver sessão, tenta validar o JWT
    try {
      jwt.verify(session, process.env.JWT_SECRET as string)
      return NextResponse.next()
    } catch (err) {
      // Se o token for inválido ou expirado, manda para o login
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

// O Matcher agora deve vigiar apenas a raiz
export const config = {
  matcher: ["/"],
}