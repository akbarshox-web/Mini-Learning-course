"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { loginUser } from "@/lib/auth"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import "./login.css"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email || !password) {
      setError("Barcha maydonlarni to'ldiring")
      setLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Elektron pochtani to'g'ri kiriting")
      setLoading(false)
      return
    }

    try {
      await loginUser(email, password)
      router.push("/courses")
    } catch (err) {
      setError(err.message || "Login xatosi yuz berdi")
      setLoading(false)
    }
  }

  return (
    <ThemeProvider>
      <Header />
      <main className="min-h-screen flex items-center justify-center">
        <div className="login-container">
          {/* Animated background elements */}
          {[...Array(50)].map((_, i) => (
            <span key={i} style={{ "--i": i }}></span>
          ))}

          {/* Login form box */}
          <div className="login-box">
            <h2>Tizimga kirish</h2>
            <form onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}

              <div className="input-box">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  disabled={loading}
                  required
                />
                <label>Email</label>
              </div>

              <div className="input-box">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parol"
                  disabled={loading}
                  required
                />
                <label>Parol</label>
              </div>

              <div className="forgot-password">
                <a href="#">Parolni unutdingizmi?</a>
              </div>

              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Yuklanmoqda..." : "Kirish"}
              </button>

              <div className="signup-link">
                <Link href="/register">Ro'yxat</Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </ThemeProvider>
  )
}
