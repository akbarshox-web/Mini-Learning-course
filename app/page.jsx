"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <ThemeProvider>
      <Header />
      <main className="w-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto lg:max-w-6xl">
          <section className="text-center mb-8 sm:mb-12 md:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Xush kelibsiz!</h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
              O'z bilimingizni rivojlantiring, yangi kurslarni o'rganing
            </p>
            {user ? (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/courses"
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm sm:text-base"
                >
                  Kurslarni ko'rish
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground text-sm sm:text-base"
                >
                  Mening Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/login"
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm sm:text-base"
                >
                  Kirish
                </Link>
                <Link
                  href="/register"
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground text-sm sm:text-base"
                >
                  Ro'yxat
                </Link>
              </div>
            )}
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="p-4 sm:p-6 md:p-8 bg-card rounded-lg border">
              <div className="mb-3 sm:mb-4">
                <img src="/courses-books-learning.jpg" alt="Courses" className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">1000+</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Kurslar mavjud</p>
            </div>
            <div className="p-4 sm:p-6 md:p-8 bg-card rounded-lg border">
              <div className="mb-3 sm:mb-4">
                <img src="/students-people-learning-community.jpg" alt="Students" className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">50,000+</h3>
              <p className="text-sm sm:text-base text-muted-foreground">O'quvchilar</p>
            </div>
            <div className="p-4 sm:p-6 md:p-8 bg-card rounded-lg border">
              <div className="mb-3 sm:mb-4">
                <img src="/success-achievement-trophy-star.jpg" alt="Success" className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">95%</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Muvaffaqiyat darajasi</p>
            </div>
          </section>
        </div>
      </main>
    </ThemeProvider>
  )
}
