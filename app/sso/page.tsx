"use client"
import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function SSOPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      router.push("/login")
      return
    }

    fetch("/api/auth/sso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).then((res) => {
      if (res.ok) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    })
  }, [])

  return <p>Autenticando...</p>
}