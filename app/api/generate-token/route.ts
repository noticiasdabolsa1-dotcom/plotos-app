export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET() {
  const token = jwt.sign(
    {
      user_id: 1,
      email: "teste@plotos.com",
      plan: "premium",
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  )

  return NextResponse.json({ token })
}