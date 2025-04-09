"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const categories = [
  {
    id: "vehicles",
    name: "Vehicles",
    icon: "🚗",
    description: "Cars, trucks, motorcycles, and more",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: "🏠",
    description: "Properties, land, and commercial spaces",
  },
  {
    id: "electronics",
    icon: "📱",
    name: "Electronics",
    description: "Phones, computers, TVs, and gadgets",
  },
  {
    id: "furniture",
    icon: "🛋️",
    name: "Furniture",
    description: "Home and office furniture",
  },
  {
    id: "collectibles",
    icon: "🏺",
    name: "Collectibles",
    description: "Antiques, art, and rare items",
  },
  {
    id: "jewelry",
    icon: "💍",
    name: "Jewelry",
    description: "Watches, rings, necklaces, and more",
  },
]

export default function CategorySection() {
  const [activeCategory, setActiveCategory] = useState("vehicles")
  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState([])

  useEffect(() => {
    async function fetchCategoryListings() {
      setLoading(true)
      try {
        // This would normally fetch from the API
        // For now, we'll just simulate loading
        await new Promise((resolve) => setTimeout(resolve, 500))
        setListings([])
      } catch (error) {
        console.error("Error fetching category listings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryListings()
  }, [activeCategory])

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            className={activeCategory === category.id ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse w-1/2 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-8 bg-gray-200 animate-pulse w-1/3"></div>
                  <div className="h-4 bg-gray-200 animate-pulse w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{/* Listings would be rendered here */}</div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold mb-4">No listings in this category yet</h3>
          <p className="text-gray-500 mb-6">Be the first to post an item in this category!</p>
          <Link href="/post-ad">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Post Your Ad</Button>
          </Link>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href={`/listings?category=${activeCategory}`}>
          <Button variant="outline" className="inline-flex items-center">
            View All {categories.find((c) => c.id === activeCategory)?.name} Listings
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
