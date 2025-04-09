"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock, AlertCircle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getFeaturedListings } from "@/actions/listing-actions"
import { formatCurrency, getTimeLeft } from "@/lib/utils"

interface Listing {
  id: string
  title: string
  current_bid: number
  end_date: string
  images: string[]
  category: string
  is_premium?: boolean
  is_featured?: boolean
}

export default function FeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true)
        const { listings, error } = await getFeaturedListings(4)

        if (error) {
          setError(error)
        } else {
          setListings(listings)
        }
      } catch (err) {
        setError("Failed to load listings")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadListings()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden h-full flex flex-col">
            <div className="relative h-48 bg-gray-200 animate-pulse"></div>
            <CardContent className="p-4 flex-grow">
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
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Failed to load listings</h3>
        <p className="text-gray-500 mb-4">{error}</p>
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <h3 className="text-xl font-semibold mb-4">No listings available yet</h3>
        <p className="text-gray-500 mb-6">Be the first to post an item for auction!</p>
        <Link href="/post-ad">
          <Button className="bg-emerald-600 hover:bg-emerald-700">Post Your Ad</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {listings.map((listing) => (
        <Link key={listing.id} href={`/listings/${listing.id}`} className="block h-full">
          <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
            <div className="relative h-48">
              <Image
                src={listing.images?.[0] || "/placeholder.svg?height=200&width=300"}
                alt={listing.title}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-emerald-600">{listing.category}</Badge>
              {listing.is_premium && <Badge className="absolute top-2 left-2 bg-purple-600">Premium</Badge>}
              {listing.is_featured && <Badge className="absolute top-10 left-2 bg-amber-500">Featured</Badge>}
            </div>
            <CardContent className="p-4 flex-grow">
              <h3 className="font-semibold text-lg line-clamp-2">{listing.title}</h3>
              <div className="flex justify-between items-center mt-2">
                <div>
                  <p className="text-sm text-gray-500">Current Bid</p>
                  <p className="font-bold text-emerald-600">{formatCurrency(listing.current_bid)}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {getTimeLeft(listing.end_date)}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
