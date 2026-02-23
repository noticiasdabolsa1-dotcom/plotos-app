export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  console.log("TOKEN RECEBIDO:", token)

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 400 })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

    console.log("TOKEN DECODIFICADO:", decoded)

    const response = NextResponse.redirect(
      new URL("/dashboard", req.url)
    )

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: true,
      path: "/",
    })

    return response
  } catch (err) {
    console.log("ERRO VERIFY:", err)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}