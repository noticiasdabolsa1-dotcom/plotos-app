export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 400 })
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string)

    const response = NextResponse.redirect(
      new URL("/dashboard", req.url)
    )

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    })

    return response
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}