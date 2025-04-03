"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, Calendar, MessageSquare, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

interface SellerProfileDialogProps {
  seller: {
    id: string
    name: string
    rating: number
    reviews: number
    memberSince: string
    verified: boolean
    avatar: string
    location?: string
    bio?: string
  }
  children: React.ReactNode
}

// Mock data for seller listings
const mockSellerListings = [
  {
    id: "1",
    title: "Vintage Trinidad Carnival Costume",
    currentBid: 1200,
    timeLeft: "2 days, 5 hours",
    image: "/placeholder.svg?height=100&width=150",
    status: "active",
  },
  {
    id: "2",
    title: "Antique Mahogany Dining Set",
    currentBid: 3500,
    timeLeft: "3 days, 9 hours",
    image: "/placeholder.svg?height=100&width=150",
    status: "active",
  },
  {
    id: "3",
    title: "Professional DSLR Camera Kit",
    currentBid: 0,
    timeLeft: "6 days, 12 hours",
    image: "/placeholder.svg?height=100&width=150",
    status: "active",
  },
]

// Mock data for seller reviews
const mockSellerReviews = [
  {
    id: "1",
    reviewer: "JohnD",
    rating: 5,
    comment: "Great seller! Item was exactly as described and shipping was fast.",
    date: "March 15, 2025",
  },
  {
    id: "2",
    reviewer: "MariaT",
    rating: 4,
    comment: "Good communication and the item arrived in good condition.",
    date: "February 28, 2025",
  },
  {
    id: "3",
    reviewer: "RobertK",
    rating: 5,
    comment: "Excellent transaction. Would definitely buy from this seller again!",
    date: "January 10, 2025",
  },
]

export default function SellerProfileDialog({ seller, children }: SellerProfileDialogProps) {
  const [open, setOpen] = useState(false)

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "text-amber-500 fill-current"
                : i < rating
                  ? "text-amber-500 fill-current opacity-50"
                  : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Seller Profile</DialogTitle>
          <DialogDescription>View details about this seller and their listings</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={seller.avatar} alt={seller.name} />
              <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{seller.name}</h3>
                {seller.verified && <Badge className="bg-blue-500">Verified</Badge>}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  {renderStars(seller.rating)}
                  <span className="ml-1 text-sm">{seller.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-500">({seller.reviews} reviews)</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  Member since {seller.memberSince}
                </div>
                {seller.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {seller.location}
                  </div>
                )}
              </div>
            </div>

            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>

          {seller.bio && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">About</h4>
              <p className="text-sm text-gray-600">{seller.bio}</p>
            </div>
          )}

          <Tabs defaultValue="listings">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="listings">Active Listings</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="listings" className="pt-4">
              {mockSellerListings.length === 0 ? (
                <p className="text-center text-gray-500 py-4">This seller has no active listings</p>
              ) : (
                <div className="space-y-4">
                  {mockSellerListings.map((listing) => (
                    <Link key={listing.id} href={`/listings/${listing.id}`} onClick={() => setOpen(false)}>
                      <Card className="overflow-hidden hover:bg-gray-50 transition-colors">
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            <div className="relative w-20 h-20 flex-shrink-0">
                              <Image
                                src={listing.image || "/placeholder.svg"}
                                alt={listing.title}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-2">{listing.title}</h4>
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-sm font-semibold text-emerald-600">
                                  TTD ${listing.currentBid.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">{listing.timeLeft}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}

                  <div className="text-center">
                    <Link
                      href={`/seller/${seller.id}`}
                      className="text-sm text-emerald-600 hover:underline inline-flex items-center"
                      onClick={() => setOpen(false)}
                    >
                      View all listings
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="pt-4">
              {mockSellerReviews.length === 0 ? (
                <p className="text-center text-gray-500 py-4">This seller has no reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {mockSellerReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{review.reviewer}</span>
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                        </div>
                      </div>
                      <p className="text-sm mt-2">{review.comment}</p>
                    </div>
                  ))}

                  <div className="text-center">
                    <Link
                      href={`/seller/${seller.id}/reviews`}
                      className="text-sm text-emerald-600 hover:underline inline-flex items-center"
                      onClick={() => setOpen(false)}
                    >
                      View all reviews
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

