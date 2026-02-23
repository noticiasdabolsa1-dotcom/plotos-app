import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
  const { token } = await req.json()

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    )

    const response = NextResponse.json({ success: true })

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    })

    return response
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}