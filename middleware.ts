// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // 1. PERMITIR que a rota de login (API) passe livremente
  if (pathname.startsWith("/api/sso")) {
    return NextResponse.next();
  }

  // 2. PROTEGER as páginas do dashboard
  // Se estiver na raiz "/" e não tiver sessão, bloqueia
  if (pathname === "/") {
    if (!session) {
      return NextResponse.rewrite(new URL("/login-necessario", request.url)); 
      // Ou redirecionar direto: return NextResponse.redirect("https://plotos.com.br/login");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};