"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Listing {
  id: string
  title: string
  currentBid: number
  timeLeft: string
  image: string
  category: string
  premium?: boolean
  featured?: boolean
}

export default function FeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([
    {
      id: "1",
      title: "Vintage Trinidad Carnival Costume",
      currentBid: 1200,
      timeLeft: "2 days, 5 hours",
      image: "/placeholder.svg?height=200&width=300",
      category: "Collectibles",
      premium: true,
      featured: true,
    },
    {
      id: "2",
      title: "Beachfront Property in Tobago",
      currentBid: 450000,
      timeLeft: "5 days, 12 hours",
      image: "/placeholder.svg?height=200&width=300",
      category: "Real Estate",
      premium: true,
    },
    {
      id: "3",
      title: "2022 Toyota Hilux 4x4",
      currentBid: 35000,
      timeLeft: "1 day, 8 hours",
      image: "/placeholder.svg?height=200&width=300",
      category: "Vehicles",
      featured: true,
    },
    {
      id: "4",
      title: "Antique Mahogany Dining Set",
      currentBid: 3500,
      timeLeft: "3 days, 9 hours",
      image: "/placeholder.svg?height=200&width=300",
      category: "Furniture",
    },
  ])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {listings.map((listing) => (
        <Link key={listing.id} href={`/listings/${listing.id}`} className="block h-full">
          <Card
            key={listing.id}
            className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md"
          >
            <div className="relative h-48">
              <Image src={listing.image || "/placeholder.svg"} alt={listing.title} fill className="object-cover" />
              <Badge className="absolute top-2 right-2 bg-emerald-600">{listing.category}</Badge>
              {listing.premium && <Badge className="absolute top-2 left-2 bg-purple-600">Premium</Badge>}
              {listing.featured && <Badge className="absolute top-10 left-2 bg-amber-500">Featured</Badge>}
            </div>
            <CardContent className="p-4 flex-grow">
              <h3 className="font-semibold text-lg line-clamp-2">{listing.title}</h3>
              <div className="flex justify-between items-center mt-2">
                <div>
                  <p className="text-sm text-gray-500">Current Bid</p>
                  <p className="font-bold text-emerald-600">TTD ${listing.currentBid.toLocaleString()}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {listing.timeLeft}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

