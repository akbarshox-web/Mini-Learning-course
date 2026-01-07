"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!email || !password || !confirmPassword) {
      setError("Barcha maydonlarni to'ldiring")
      setLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Elektron pochtani to'g'ri kiriting")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Parollar mos kelmaydi")
      setLoading(false)
      return
    }

    try {
      setSuccess(
        "Ro'yxat muvaffaqiyatli bajarildi! Elektron pochtangizga tasdiqlash xati yuborildi. Iltimos, tasdiqlang va keyin kirish qiling.",
      )

      // Reset form
      setEmail("")
      setPassword("")
      setConfirmPassword("")

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError(err.message || "Ro'yxat xatosi yuz berdi")
      setLoading(false)
    }
  }

  return (
    <ThemeProvider>
      <Header />
      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-card p-8 rounded-lg border">
          <h1 className="text-2xl font-bold mb-6">Ro'yxatdan o'tish</h1>

          {error && <div className="p-4 mb-4 bg-destructive text-destructive-foreground rounded">{error}</div>}
          {success && <div className="p-4 mb-4 bg-accent text-accent-foreground rounded">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Elektron pochta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded bg-background text-foreground"
                placeholder="test@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Parol</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded bg-background text-foreground"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Parolni takrarlang</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded bg-background text-foreground"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary text-primary-foreground rounded font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Yuklanmoqda..." : "Ro'yxat"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            Allaqachon hisobingiz bor?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Kirish
            </Link>
          </p>
        </div>
      </main>
    </ThemeProvider>
  )
}
