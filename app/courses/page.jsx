"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CourseCard } from "@/components/course-card"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"

export default function CoursesPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

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
        }
        setProducts(productList)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Kurslar yuklashda xato:", error)
        setLoading(false)
      })
  }, [router])

  const filteredProducts = products.filter(
    (product) =>
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <ThemeProvider>
      <Header />
      <main className="w-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">Barcha Kurslar</h1>

          <div className="mb-6 sm:mb-8">
            <input
              type="text"
              placeholder="Kurs qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 border rounded bg-background text-foreground text-sm sm:text-base"
            />
          </div>

          {loading ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-muted-foreground text-sm sm:text-base">Kurslar yuklanyapti...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-muted-foreground text-sm sm:text-base">Kurslar topilmadi</p>
            </div>
          ) : (
            /* Responsive course grid: 1 col mobile, 2 cols tablet, 3 cols desktop, 4 cols large screens */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <CourseCard key={product.id} course={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </ThemeProvider>
  )
}
