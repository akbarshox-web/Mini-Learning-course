"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export function CourseCard({ course }) {
  const [enrolledCourses, setEnrolledCourses] = useState([])

  useEffect(() => {
    const enrolled = localStorage.getItem("enrolledCourses")
    if (enrolled) {
      setEnrolledCourses(JSON.parse(enrolled))
    }
  }, [])

  const isEnrolled = enrolledCourses.includes(course.id)

  const imageUrl = course.images && course.images.length > 0 ? course.images[0] : course.image

  const price = course.price ?? course.cost ?? 0
  const displayPrice = Number(price).toFixed(2)

  return (
    <div className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition">
      <div className="h-40 bg-muted overflow-hidden">
        <img src={imageUrl || "/placeholder.svg"} alt={course.title} className="w-full h-full object-cover" />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description || "Kurs ma'lumoti yo'q"}</p>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Narxi</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">${displayPrice}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Reyting</p>
            <p className="text-lg font-bold">⭐ {course.rating || "5"}</p>
          </div>
        </div>

        <Link
          href={`/courses/${course.id}`}
          className={`w-full py-2 rounded font-medium text-center transition ${
            isEnrolled
              ? "bg-secondary text-secondary-foreground hover:opacity-90"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          {isEnrolled ? "✓ Ro'yxatdan o'tgan" : "Tafsilotlari"}
        </Link>
      </div>
    </div>
  )
}
