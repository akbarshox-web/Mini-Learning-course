"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"

export default function DashboardPage() {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    const enrolled = localStorage.getItem("enrolledCourses")
    const enrolledIds = enrolled ? JSON.parse(enrolled) : []
    setEnrolledCourses(enrolledIds)

    fetch("https://5558ace6a3dff7ca.mokky.dev/products")
      .then((res) => res.json())
      .then((data) => {
        let productList = []
        if (Array.isArray(data) && data.length > 0 && data[0].products) {
          productList = data[0].products
        } else if (data.products && Array.isArray(data.products)) {
          productList = data.products
        } else if (Array.isArray(data)) {
          productList = data
        }

        const userCourses = productList
          .filter((p) => enrolledIds.includes(p.id))
          .map((p) => {
            const progressData = localStorage.getItem(`progress_${p.id}`)
            const progress = progressData ? JSON.parse(progressData).progress : 0

            const completedLessons = localStorage.getItem(`completed_lessons_${p.id}`)
            const completed = completedLessons ? JSON.parse(completedLessons) : []

            // Generate lesson count based on stock or default to 5
            const lessonCount = Math.min(p.stock || 5, 10)
            const calculatedProgress = completed.length > 0 ? Math.round((completed.length / lessonCount) * 100) : 0

            return {
              id: p.id,
              title: p.name || p.title,
              price: p.price ?? p.cost ?? 0,
              rating: p.rating || 5,
              progress: calculatedProgress,
              emoji: ["📚", "🎨", "💻", "📊", "🚀", "🎯"][p.id % 6],
            }
          })
        setCourses(userCourses)
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Kurslar yuklashda xato:", error)
        setLoading(false)
      })
  }, [router])

  const completedCourses = courses.filter((c) => c.progress === 100).length
  const inProgressCourses = courses.filter((c) => c.progress > 0 && c.progress < 100).length

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Mening Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card p-6 border rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Jami Kurslar</p>
            <p className="text-3xl font-bold">{courses.length}</p>
          </div>
          <div className="bg-card p-6 border rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Yakunlangan</p>
            <p className="text-3xl font-bold text-green-500">{completedCourses}</p>
          </div>
          <div className="bg-card p-6 border rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Davomida</p>
            <p className="text-3xl font-bold text-blue-500">{inProgressCourses}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Mening Kurslarim</h2>

        {loading ? (
          <p className="text-muted-foreground">Kurslar yuklanyapti...</p>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Hali kursga ro'yxatdan o'tmagansiz</p>
            <Link
              href="/courses"
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
            >
              Kurslarni ko'rish
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{course.emoji}</span>
                  <span className="text-sm font-bold">⭐ {course.rating}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 line-clamp-2">{course.title}</h3>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-bold">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded h-2">
                    <div
                      className={`h-2 rounded transition-all ${course.progress === 100 ? "bg-green-500" : "bg-primary"
                        }`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <Link
                  href={`/courses/${course.id}`}
                  className="w-full py-2 bg-secondary text-secondary-foreground rounded text-center font-medium hover:opacity-90 block"
                >
                  {course.progress === 100 ? "Qayta o'qish" : "Davom etish"}
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
