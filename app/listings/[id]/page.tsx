"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Mail,
  Heart,
  DollarSign,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Info,
  AlertTriangle,
  Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import ReportDialog from "@/components/report-dialog"
import ShareDialog from "@/components/share-dialog"
import SellerProfileDialog from "@/components/seller-profile-dialog"
import MessagingDialog from "@/components/messaging-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

// Mock data for a listing
const mockListing = {
  id: "123456",
  title: "Vintage Trinidad Carnival Costume from 1980s",
  description:
    "This authentic vintage carnival costume from the 1980s is in excellent condition and perfect for collectors or displays. The costume features intricate beadwork, vibrant colors, and traditional designs that showcase Trinidad's rich carnival heritage.\n\nThe costume includes the full headpiece, body piece, arm bands, and leg pieces. All feathers and sequins are intact with minimal fading. This is a rare find as most costumes from this era have not survived in such good condition.\n\nThe costume was designed by legendary mas man Peter Minshall for the band 'River' which won Band of the Year in 1983.",
  currentBid: 1200,
  startingBid: 800,
  bids: 8,
  timeLeft: "2 days, 5 hours",
  endDate: "April 15, 2025 at 3:00 PM",
  images: [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ],
  category: "Collectibles",
  subcategory: "Memorabilia",
  condition: "Excellent",
  location: "Port of Spain",
  seller: {
    id: "seller123",
    name: "CarnivalLover",
    rating: 4.8,
    reviews: 23,
    memberSince: "January 2022",
    verified: true,
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Passionate collector of Trinidad & Tobago carnival memorabilia with over 20 years of experience. I specialize in vintage costumes, historical carnival photographs, and rare carnival-related items.",
    phone: "868-555-1234",
  },
  features: [
    "Authentic 1980s design",
    "Complete costume set",
    "Designed by Peter Minshall",
    "Award-winning band",
    "Excellent condition",
    "Rare collector's item",
  ],
  bidHistory: [
    { bidder: "Carnival2024", amount: 1200, date: "April 1, 2025" },
    { bidder: "MasLover", amount: 1100, date: "March 30, 2025" },
    { bidder: "TriniFan", amount: 1000, date: "March 29, 2025" },
    { bidder: "Collector123", amount: 950, date: "March 28, 2025" },
    { bidder: "IslandStyle", amount: 900, date: "March 27, 2025" },
    { bidder: "CaribbeanArt", amount: 850, date: "March 26, 2025" },
    { bidder: "FestivalFan", amount: 825, date: "March 25, 2025" },
    { bidder: "MasQueen", amount: 800, date: "March 24, 2025" },
  ],
  questions: [
    {
      id: 1,
      user: "TriniBuyer",
      question: "What are the dimensions of the headpiece?",
      date: "March 28, 2025",
      answer: "The headpiece is approximately 24 inches wide and 18 inches tall.",
      answerDate: "March 29, 2025",
    },
    {
      id: 2,
      user: "CarnivalFan",
      question: "Do you have any documentation proving its authenticity?",
      date: "March 25, 2025",
      answer:
        "Yes, I have the original program from the 1983 carnival which features this costume, as well as a certificate of authenticity from the Trinidad Carnival Museum.",
      answerDate: "March 26, 2025",
    },
    {
      id: 3,
      user: "Collector456",
      question: "Would you ship internationally?",
      date: "March 22, 2025",
      answer:
        "Yes, I can ship internationally, but additional shipping costs would apply. Please contact me for a shipping quote to your location.",
      answerDate: "March 23, 2025",
    },
  ],
  views: 342,
  watchlist: 24,
  premium: true,
  featured: true,
  buyNowPrice: 2500,
  reservePrice: 1500,
  shippingOptions: [
    "Local pickup (Port of Spain)",
    "Delivery within Trinidad (TTD $50)",
    "Shipping to Tobago (TTD $100)",
    "International shipping (contact seller)",
  ],
}

export default function ListingDetailPage() {
  const params = useParams()
  const listingId = params.id as string
  const listing = mockListing // In a real app, you would fetch the listing by ID

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [bidAmount, setBidAmount] = useState(listing.currentBid + 100)
  const [showBidConfirmation, setShowBidConfirmation] = useState(false)
  const [showBidSuccess, setShowBidSuccess] = useState(false)
  const [question, setQuestion] = useState("")
  const [showQuestionSuccess, setShowQuestionSuccess] = useState(false)
  const [isWatching, setIsWatching] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Check authentication status when component mounts
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))
  }

  const handleBidSubmit = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true)
      return
    }

    setShowBidConfirmation(false)
    setShowBidSuccess(true)
    // In a real app, you would submit the bid to your API
  }

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setShowAuthDialog(true)
      return
    }

    if (question.trim()) {
      setShowQuestionSuccess(true)
      setQuestion("")
      // In a real app, you would submit the question to your API
    }
  }

  const toggleWatchlist = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true)
      return
    }

    setIsWatching(!isWatching)
    // In a real app, you would update the watchlist status in your API
  }

  const formatCurrency = (amount: number) => {
    return `TTD $${amount.toLocaleString()}`
  }

  const formatPhoneNumber = (phone: string) => {
    // Format as (868) XXX-XXXX
    const cleaned = phone.replace(/\D/g, "")
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return phone
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader isAuthenticated={isAuthenticated} />

      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-6">
            <Link href="/listings" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to listings
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Images */}
            <div className="lg:col-span-2 space-y-6">
              <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={listing.images[currentImageIndex] || "/placeholder.svg"}
                  alt={listing.title}
                  fill
                  className="object-contain"
                />

                {listing.premium && <Badge className="absolute top-4 left-4 bg-emerald-600">Premium</Badge>}

                {listing.featured && <Badge className="absolute top-4 left-[110px] bg-amber-500">Featured</Badge>}

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-10 w-10"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                  <span className="sr-only">Previous image</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-10 w-10"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                  <span className="sr-only">Next image</span>
                </Button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {listing.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2.5 h-2.5 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <span className="sr-only">Image {index + 1}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-  => (
                  <button
                    key={index}
                    className={\`aspect-square rounded-md overflow-hidden border-2 ${
                      index === currentImageIndex ? "border-emerald-600" : "border-transparent"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>

              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="questions">Questions ({listing.questions.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="pt-4">
                  <div className="space-y-4">
                    <div className="whitespace-pre-line text-gray-700">{listing.description}</div>

                    {listing.features.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-3">Key Features</h3>
                        <div className="flex flex-wrap gap-2">
                          {listing.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="details" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">Category</span>
                        <span className="font-medium">{listing.category}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">Subcategory</span>
                        <span className="font-medium">{listing.subcategory}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">Condition</span>
                        <span className="font-medium">{listing.condition}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">Location</span>
                        <span className="font-medium">{listing.location}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">Listing ID</span>
                        <span className="font-medium">{listing.id}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">Views</span>
                        <span className="font-medium">{listing.views}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">Watchers</span>
                        <span className="font-medium">{listing.watchlist}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">Auction Ends</span>
                        <span className="font-medium">{listing.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Shipping Options</h3>
                    <ul className="space-y-2">
                      {listing.shippingOptions.map((option, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-emerald-600 mr-2 flex-shrink-0" />
                          <span>{option}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="questions" className="pt-4">
                  <div className="space-y-6">
                    {listing.questions.map((q) => (
                      <div key={q.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <MessageCircle className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">{q.question}</p>
                              <p className="text-sm text-gray-500">
                                Asked by {q.user} on {q.date}
                              </p>
                            </div>
                          </div>
                        </div>

                        {q.answer && (
                          <div className="mt-3 pl-7">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-gray-700">{q.answer}</p>
                              <p className="text-sm text-gray-500 mt-1">Answered on {q.answerDate}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {showQuestionSuccess ? (
                      <Alert className="bg-emerald-50 text-emerald-800 border-emerald-200">
                        <Check className="h-4 w-4 text-emerald-600" />
                        <AlertTitle>Question Submitted</AlertTitle>
                        <AlertDescription>
                          Your question has been sent to the seller. You'll be notified when they respond.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <form onSubmit={handleQuestionSubmit} className="space-y-3">
                        <h3 className="text-lg font-medium">Ask the Seller a Question</h3>
                        <Textarea
                          placeholder="What would you like to know about this item?"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          rows={3}
                        />
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                          Submit Question
                        </Button>
                      </form>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right column - Bidding and seller info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{listing.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.location}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Current Bid:</span>
                      <span className="text-2xl font-bold text-emerald-600">{formatCurrency(listing.currentBid)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Starting Bid:</span>
                      <span>{formatCurrency(listing.startingBid)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Number of Bids:</span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="p-0 h-auto text-emerald-600 hover:underline">
                            {listing.bids} bids
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Bid History</DialogTitle>
                            <DialogDescription>{listing.bids} bids placed on this item</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4 max-h-[300px] overflow-y-auto">
                            {listing.bidHistory.map((bid, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b">
                                <div>
                                  <div className="font-medium">{bid.bidder}</div>
                                  <div className="text-xs text-gray-500">{bid.date}</div>
                                </div>
                                <div className="font-semibold">{formatCurrency(bid.amount)}</div>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {listing.buyNowPrice && (
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-gray-500">Buy Now Price:</span>
                        <span className="font-semibold">{formatCurrency(listing.buyNowPrice)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 text-amber-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Time Left:</span>
                      </div>
                      <span className="font-semibold">{listing.timeLeft}</span>
                    </div>

                    <div className="text-xs text-gray-500 text-right">Auction ends {listing.endDate}</div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Label htmlFor="bidAmount" className="w-1/3">
                        Your Bid:
                      </Label>
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          id="bidAmount"
                          type="number"
                          className="pl-9"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(Number(e.target.value))}
                          min={listing.currentBid + 1}
                        />
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">Enter {formatCurrency(listing.currentBid + 1)} or more</div>

                    <div className="grid grid-cols-1 gap-3">
                      <Dialog open={showBidConfirmation} onOpenChange={setShowBidConfirmation}>
                        <DialogTrigger asChild>
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Place Bid</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Your Bid</DialogTitle>
                            <DialogDescription>
                              You are about to place a bid of {formatCurrency(bidAmount)} on this item.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="flex justify-between">
                              <span className="font-medium">Item:</span>
                              <span>{listing.title}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Your Bid:</span>
                              <span className="font-bold text-emerald-600">{formatCurrency(bidAmount)}</span>
                            </div>
                            <Alert variant="warning" className="bg-amber-50 border-amber-200 text-amber-800">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>Important</AlertTitle>
                              <AlertDescription>
                                By placing this bid, you are committing to buy this item if you win the auction.
                              </AlertDescription>
                            </Alert>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowBidConfirmation(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleBidSubmit} className="bg-emerald-600 hover:bg-emerald-700">
                              Confirm Bid
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {listing.buyNowPrice && (
                        <Button className="w-full" variant="secondary">
                          Buy Now for {formatCurrency(listing.buyNowPrice)}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center ${isWatching ? "text-red-500" : "text-gray-500"}`}
                      onClick={toggleWatchlist}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${isWatching ? "fill-current" : ""}`} />
                      {isWatching ? "Watching" : "Watch"}
                    </Button>

                    <ShareDialog itemId={listing.id} itemTitle={listing.title} variant="link" />

                    <ReportDialog itemId={listing.id} itemTitle={listing.title} variant="link" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Seller Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SellerProfileDialog seller={listing.seller}>
                    <div className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={listing.seller.avatar} alt={listing.seller.name} />
                        <AvatarFallback>{listing.seller.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center">
                          {listing.seller.name}
                          {listing.seller.verified && (
                            <Badge className="ml-2 bg-blue-500" variant="secondary">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">Member since {listing.seller.memberSince}</div>
                      </div>
                    </div>
                  </SellerProfileDialog>

                  <div className="flex items-center text-sm">
                    <div className="flex items-center mr-3">
                      <div className="text-amber-500 flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(listing.seller.rating) ? "fill-current" : "stroke-current fill-none"}`}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1">{listing.seller.rating}</span>
                    </div>
                    <Link href="#" className="text-emerald-600 hover:underline">
                      {listing.seller.reviews} reviews
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {isDesktop ? (
                      <div className="flex items-center p-3 border rounded-md">
                        <Phone className="h-4 w-4 mr-2 text-emerald-600" />
                        <span>{formatPhoneNumber(listing.seller.phone)}</span>
                      </div>
                    ) : (
                      <Button variant="outline" className="w-full flex items-center justify-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Seller
                      </Button>
                    )}

                    <MessagingDialog seller={listing.seller}>
                      <Button variant="outline" className="w-full flex items-center justify-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Message Seller
                      </Button>
                    </MessagingDialog>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Safety Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <Info className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                      <span>Meet in a public place for high-value items</span>
                    </li>
                    <li className="flex items-start">
                      <Info className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                      <span>Inspect the item thoroughly before payment</span>
                    </li>
                    <li className="flex items-start">
                      <Info className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                      <span>Use our secure payment system when possible</span>
                    </li>
                    <li className="flex items-start">
                      <Info className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                      <span>Report suspicious activity immediately</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <Link key={index} href={`/listings/${index + 5}`}>
                  <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
                    <div className="relative h-48">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Similar item"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg line-clamp-2">Carnival Costume {index + 1}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <p className="text-sm text-gray-500">Current Bid</p>
                          <p className="font-bold text-emerald-600">TTD ${(800 + index * 100).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />3 days
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showBidSuccess} onOpenChange={setShowBidSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bid Placed Successfully!</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="mb-2">Your bid of {formatCurrency(bidAmount)} has been placed.</p>
            <p className="text-sm text-gray-500">
              You will receive notifications if you are outbid or if you win the auction.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowBidSuccess(false)} className="bg-emerald-600 hover:bg-emerald-700">
              Continue Browsing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>You need to be signed in to perform this action</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3 sm:justify-center py-4">
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full">
                Log in
              </Button>
            </Link>
            <Link href="/auth/signup" className="w-full">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Create an account</Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  )
}

