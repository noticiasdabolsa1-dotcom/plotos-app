export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  console.log("TOKEN RECEBIDO:", token)

  if (!token) {
    return NextResponse.json(
      { error: "No token" },
      { status: 400 }
    )
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string)

    const response = NextResponse.json({
      success: true,
      message: "Cookie should now be set"
    })

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      domain: ".plotos.com.br",
    })

    return response

  } catch (err) {
    console.log("ERRO VERIFY:", err)
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    )
  }
}