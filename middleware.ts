import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Pega apenas o VALOR do cookie (o .value é essencial no Next 13/14)
  const session = request.cookies.get("session")?.value

  // Se não houver cookie e a pessoa tentar acessar o dashboard, manda para login
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Se houver cookie, deixa passar (a validação profunda o dashboard fará)
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}