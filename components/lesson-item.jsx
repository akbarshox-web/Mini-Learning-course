"use client"

import { useState, useEffect } from "react"

export function LessonItem({ courseId, lesson, onComplete }) {
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    // LocalStorage'dan o'qilgan darslarni yuklash
    const completedLessons = localStorage.getItem(`completed_lessons_${courseId}`)
    if (completedLessons) {
      const completed = JSON.parse(completedLessons)
      setIsCompleted(completed.includes(lesson.id))
    }
  }, [courseId, lesson.id])

  const handleToggleComplete = () => {
    const completedLessons = localStorage.getItem(`completed_lessons_${courseId}`)
    let completed = completedLessons ? JSON.parse(completedLessons) : []

    if (isCompleted) {
      completed = completed.filter((id) => id !== lesson.id)
    } else {
      if (!completed.includes(lesson.id)) {
        completed.push(lesson.id)
      }
    }

    localStorage.setItem(`completed_lessons_${courseId}`, JSON.stringify(completed))
    setIsCompleted(!isCompleted)
    onComplete?.()
  }

  return (
    <div
      className={`p-4 border rounded-lg flex items-center justify-between transition ${
        isCompleted ? "bg-green-50 dark:bg-green-950 border-green-300" : "bg-card border-border"
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={handleToggleComplete}
          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
            isCompleted ? "bg-green-500 border-green-500" : "border-muted-foreground hover:border-primary"
          }`}
        >
          {isCompleted && <span className="text-white text-sm font-bold">✓</span>}
        </button>
        <div className="flex-1">
          <h4 className={`font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>{lesson.title}</h4>
          <p className="text-sm text-muted-foreground">{lesson.duration}</p>
        </div>
      </div>
      <span className="text-2xl">{lesson.emoji}</span>
    </div>
  )
}
