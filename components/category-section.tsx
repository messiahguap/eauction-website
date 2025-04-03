import Link from "next/link"
import { Car, Home, Gem, Shirt, Laptop, Sofa, Utensils, Briefcase } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    name: "Vehicles",
    icon: Car,
    slug: "vehicles",
    color: "bg-amber-100",
  },
  {
    name: "Real Estate",
    icon: Home,
    slug: "real-estate",
    color: "bg-emerald-100",
  },
  {
    name: "Collectibles",
    icon: Gem,
    slug: "collectibles",
    color: "bg-purple-100",
  },
  {
    name: "Fashion",
    icon: Shirt,
    slug: "fashion",
    color: "bg-pink-100",
  },
  {
    name: "Electronics",
    icon: Laptop,
    slug: "electronics",
    color: "bg-sky-100",
  },
  {
    name: "Furniture",
    icon: Sofa,
    slug: "furniture",
    color: "bg-orange-100",
  },
  {
    name: "Home & Kitchen",
    icon: Utensils,
    slug: "home-kitchen",
    color: "bg-red-100",
  },
  {
    name: "Business Equipment",
    icon: Briefcase,
    slug: "business-equipment",
    color: "bg-teal-100",
  },
]

export default function CategorySection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {categories.map((category) => (
        <Link key={category.slug} href={`/categories/${category.slug}`}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className={`p-3 rounded-full ${category.color} mb-3`}>
                <category.icon className="h-6 w-6" />
              </div>
              <span className="font-medium">{category.name}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

