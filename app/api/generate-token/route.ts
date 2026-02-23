export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    secret: process.env.JWT_SECRET || "SECRET_UNDEFINED"
  })
}