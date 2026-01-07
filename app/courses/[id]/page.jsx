"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { LessonItem } from "@/components/lesson-item"

export default function CourseDetailPage() {
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const router = useRouter()
  const params = useParams()
  const courseId = Number.parseInt(params.id)

  const generateLessons = (courseData) => {
    const lessonCount = Math.min(courseData.stock || 5, 10)
    const generatedLessons = []
    const courseName = courseData.name || courseData.title || "Dars"

    for (let i = 0; i < lessonCount; i++) {
      generatedLessons.push({
        id: i + 1,
        title: `${i + 1}-dars: ${courseName.split(" ")[0]} o'rganamiz`,
        duration: `${(i + 1) * 5} min`,
        emoji: ["📖", "📝", "🎥", "💡", "🧩", "📊", "🎯", "🚀", "⭐", "🏆"][i % 10],
      })
    }
    return generatedLessons
  }

  const calculateProgress = (completedCount, totalCount) => {
    if (totalCount === 0) return 0
    return Math.round((completedCount / totalCount) * 100)
  }

  const downloadCourseFile = (courseName) => {
    const courseContent = `
KURS: ${courseName}
=====================================

Bu fayl kurs materiallari o'z ichiga oladi.

Kurs Plani:
1. Kirish va asosiy tushunchalar
2. Fundamental ko'nikmalar
3. Ilg'or mavzular
4. Amaliy loyihalar
5. Takomillashtirish va natijalar

Siz bu kursni yakunlagandan keyin:
- Eng muhim ko'nikmalarni o'zlashtirasiz
- Amaliy tajribalarni to'plasiz
- Sertifikat olasiz

Omadli o'qish!
=====================================
Yaratilish vaqti: ${new Date().toLocaleString("uz-UZ")}
`

    const element = document.createElement("a")
    const file = new Blob([courseContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${courseName}_kurs_materiallari.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

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

        // Find the course with matching ID
        const foundCourse = productList.find((p) => p.id === courseId)

        if (foundCourse) {
          const generatedLessons = generateLessons(foundCourse)
          setLessons(generatedLessons)

          const price = foundCourse.price ?? foundCourse.cost ?? foundCourse.value ?? 0

          setCourse({
            id: foundCourse.id,
            name: foundCourse.name || foundCourse.title,
            description: foundCourse.description,
            image: foundCourse.image,
            price: price,
            rating: foundCourse.rating || 5,
            category: foundCourse.category,
            stock: foundCourse.stock,
          })

          const enrolled = localStorage.getItem("enrolledCourses")
          if (enrolled) {
            const enrolledList = JSON.parse(enrolled)
            setIsEnrolled(enrolledList.includes(foundCourse.id))

            const completedLessons = localStorage.getItem(`completed_lessons_${foundCourse.id}`)
            if (completedLessons) {
              const completed = JSON.parse(completedLessons)
              const calculatedProgress = calculateProgress(completed.length, generatedLessons.length)
              setProgress(calculatedProgress)
            }
          }
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error("Kurs yuklashda xato:", error)
        setLoading(false)
      })
  }, [courseId, router])

  const handleEnroll = () => {
    setShowPurchaseModal(true)
  }

  const handleConfirmPurchase = async () => {
    setIsPurchasing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const enrolled = localStorage.getItem("enrolledCourses")
    const enrolledList = enrolled ? JSON.parse(enrolled) : []

    if (!enrolledList.includes(courseId)) {
      enrolledList.push(courseId)
      localStorage.setItem("enrolledCourses", JSON.stringify(enrolledList))

      downloadCourseFile(course.name)

      setIsEnrolled(true)
    }

    setShowPurchaseModal(false)
    setIsPurchasing(false)
  }

  const handleLessonComplete = () => {
    const completedLessons = localStorage.getItem(`completed_lessons_${courseId}`)
    const completed = completedLessons ? JSON.parse(completedLessons) : []
    const calculatedProgress = calculateProgress(completed.length, lessons.length)
    setProgress(calculatedProgress)
  }

  if (loading) {
    return (
      <ThemeProvider>
        <Header />
        <main className="w-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
          <p className="text-center text-muted-foreground">Kurs yuklanyapti...</p>
        </main>
      </ThemeProvider>
    )
  }

  if (!course) {
    return (
      <ThemeProvider>
        <Header />
        <main className="w-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
          <p className="text-center text-destructive">Kurs topilmadi</p>
        </main>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <Header />
      <main className="w-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-2xl mx-auto lg:max-w-4xl">
          <div className="bg-card border rounded-lg overflow-hidden">
            {course.image && (
              <div className="h-48 sm:h-64 md:h-80 lg:h-96 bg-muted overflow-hidden">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-4 sm:p-6 md:p-8 lg:p-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{course.name}</h1>
              {course.category && (
                <p className="text-xs sm:text-sm text-muted-foreground mb-6">Kategoriya: {course.category}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="p-3 sm:p-4 bg-background rounded">
                  <p className="text-xs sm:text-sm text-muted-foreground">Narxi</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">${Number(course.price).toFixed(2)}</p>
                </div>
                <div className="p-3 sm:p-4 bg-background rounded">
                  <p className="text-xs sm:text-sm text-muted-foreground">Reyting</p>
                  <p className="text-xl sm:text-2xl font-bold">⭐ {course.rating}</p>
                </div>
                <div className="p-3 sm:p-4 bg-background rounded">
                  <p className="text-xs sm:text-sm text-muted-foreground">Darslar soni</p>
                  <p className="text-xl sm:text-2xl font-bold">{lessons.length}</p>
                </div>
              </div>

              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                {course.description || "Kurs ma'lumoti yo'q"}
              </p>

              {isEnrolled ? (
                <div>
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">Sizning Progress</h2>
                    <div className="mb-4">
                      <div className="flex justify-between mb-2 text-sm sm:text-base">
                        <span>Takomillashtirish</span>
                        <span className="font-bold">{progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded h-3 sm:h-4">
                        <div
                          className="bg-primary h-3 sm:h-4 rounded transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {progress === 100 && (
                      <div className="p-3 sm:p-4 bg-green-500 text-white rounded text-center font-bold text-sm sm:text-base">
                        ✓ Tabriklaymanman! Kursni yakunladingiz!
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">Kurs Darslar</h2>
                    <div className="space-y-2 sm:space-y-3">
                      {lessons.map((lesson) => (
                        <LessonItem
                          key={lesson.id}
                          courseId={courseId}
                          lesson={lesson}
                          onComplete={handleLessonComplete}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleEnroll}
                    className="w-full py-2 sm:py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 text-base sm:text-lg"
                  >
                    Sotib olish - ${Number(course.price).toFixed(2)}
                  </button>

                  {showPurchaseModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-card rounded-lg p-6 sm:p-8 max-w-md w-full">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4">Sotib olishni tasdiqlang</h2>
                        <p className="text-sm sm:text-base text-muted-foreground mb-6">
                          Siz "{course.name}" kursini sotib olmoqchisiz?
                        </p>
                        <div className="bg-background p-3 sm:p-4 rounded mb-6">
                          <div className="flex justify-between mb-2 text-sm">
                            <span className="text-muted-foreground">Kurs narxi:</span>
                            <span className="font-bold">${Number(course.price).toFixed(2)}</span>
                          </div>
                          <div className="border-t border-border pt-2 flex justify-between">
                            <span className="font-bold">Jami:</span>
                            <span className="text-lg sm:text-xl font-bold text-primary">
                              ${Number(course.price).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                          Sotib olgandan keyin kurs materiallari avtomatik ravishda yuklanib oladi.
                        </p>
                        <div className="flex gap-3 sm:gap-4">
                          <button
                            onClick={() => setShowPurchaseModal(false)}
                            disabled={isPurchasing}
                            className="flex-1 py-2 border border-border rounded-lg font-medium text-sm sm:text-base hover:bg-background disabled:opacity-50"
                          >
                            Bekor qilish
                          </button>
                          <button
                            onClick={handleConfirmPurchase}
                            disabled={isPurchasing}
                            className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm sm:text-base hover:opacity-90 disabled:opacity-50"
                          >
                            {isPurchasing ? "Qayta ishlanmoqda..." : "Sotib olish"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  )
}
