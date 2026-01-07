"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  if (!mounted) return null

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-40">
      <nav className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <img src="/education-learning-logo-book.jpg" alt="Learning" className="w-8 h-8 sm:w-10 sm:h-10" />
              <span className="hidden sm:inline">Learning</span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex gap-4 lg:gap-6 items-center">
              {user ? (
                <>
                  <Link href="/courses" className="hover:opacity-80 text-sm lg:text-base">
                    Kurslar
                  </Link>
                  <Link href="/dashboard" className="hover:opacity-80 text-sm lg:text-base">
                    Dashboard
                  </Link>
                  <span className="text-xs lg:text-sm truncate max-w-xs">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 lg:px-4 py-1 lg:py-2 bg-secondary text-secondary-foreground rounded hover:opacity-80 text-sm lg:text-base"
                  >
                    Chiqish
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:opacity-80 text-sm lg:text-base">
                    Kirish
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 lg:px-4 py-1 lg:py-2 bg-secondary text-secondary-foreground rounded hover:opacity-80 text-sm lg:text-base"
                  >
                    Ro'yxat
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 hover:opacity-80" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile navigation menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-primary-foreground/20 pt-4 space-y-3">
              {user ? (
                <>
                  <Link href="/courses" className="block hover:opacity-80 text-sm">
                    Kurslar
                  </Link>
                  <Link href="/dashboard" className="block hover:opacity-80 text-sm">
                    Dashboard
                  </Link>
                  <div className="text-xs truncate">{user.email}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded hover:opacity-80 text-sm"
                  >
                    Chiqish
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block hover:opacity-80 text-sm">
                    Kirish
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full px-4 py-2 bg-secondary text-secondary-foreground rounded hover:opacity-80 text-sm text-center"
                  >
                    Ro'yxat
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
