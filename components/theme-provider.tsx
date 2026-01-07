"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const savedDark = typeof window !== "undefined" ? localStorage?.getItem("theme") === "dark" : false
    const isDarkMode = savedDark || prefersDark
    setIsDark(isDarkMode)

    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("theme", newDark ? "dark" : "light")
      } catch (e) {
        console.log("[v0] localStorage not available, theme will reset on refresh")
      }
    }

    if (newDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  if (!mounted) return <>{children}</>

  return (
    <>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 w-12 h-12 p-0 bg-blue-600 hover:bg-blue-700 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-white dark:text-gray-900 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center justify-center text-xl font-bold border-2 border-white dark:border-gray-900"
        title={isDark ? "Kunduz rejimi" : "Tungi rejimi"}
        aria-label={isDark ? "Kunduz rejimi ga o'tish" : "Tungi rejimi ga o'tish"}
      >
        {isDark ? "☀️" : "🌙"}
      </button>
    </>
  )
}
