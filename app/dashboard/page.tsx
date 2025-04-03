"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Package, ShoppingCart, Heart, Bell, Settings, MessageSquare, DollarSign, TrendingUp, Clock, User, ChevronRight, Plus } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

// Mock data for the dashboard
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=100&width=100",
  memberSince: "January 2023",
  rating: 4.8,
  reviews: 12,
  balance: 2500,
  notifications: 3,
}

const mockListings = [
  {
    id: "1",
    title: "Vintage Trinidad Carnival Costume",
    currentBid: 1200,
    bids: 8,
    watchers: 24,
    views: 342,
    timeLeft: "2 days, 5 hours",
    endDate: "April 15, 2024",
    image: "/placeholder.svg?height=200&width=300",
    status: "active",
    featured: true,
  },
  {
    id: "2",
    title: "Antique Mahogany Dining Set",
    currentBid: 3500,
    bids: 5,
    watchers: 18,
    views: 215,
    timeLeft: "3 days, 9 hours",
    endDate: "April 16, 2024",
    image: "/placeholder.svg?height=200&width=300",
    status: "active",
    featured: false,
  },
  {
    id: "3",
    title: "Professional DSLR Camera Kit",
    currentBid: 0,
    bids: 0,
    watchers: 7,
    views: 89,
    timeLeft: "6 days, 12 hours",
    endDate: "April 19, 2024",
    image: "/placeholder.svg?height=200&width=300",
    status: "active",
    featured: false,
  },
  {
    id: "4",
    title: "Handcrafted Leather Bag",
    currentBid: 950,
    bids: 12,
    watchers: 31,
    views: 278,
    timeLeft: "Ended",
    endDate: "March 30, 2024",
    image: "/placeholder.svg?height=200&width=300",
    status: "sold",
    featured: false,
    soldPrice: 950,
  },
]

const mockBids = [
  {
    id: "1",
    title: "Beachfront Property in Tobago",
    yourBid: 450000,
    currentBid: 475000,
    timeLeft: "5 days, 12 hours",
    endDate: "April 18, 2024",
    image: "/placeholder.svg?height=200&width=300",
    status: "outbid",
  },
  {
    id: "2",
    title: "2022 Toyota Hilux 4x4",
    yourBid: 35000,
    currentBid: 35000,
    timeLeft: "1 day, 8 hours",
    endDate: "April 14, 2024",
    image: "/placeholder.svg?height=200&width=300",
    status: "winning",
  },
  {
    id: "3",
    title: "Rare Stamp Collection",
    yourBid: 2800,
    currentBid: 2800,
    timeLeft: "3 days, 21 hours",
    endDate: "April 16, 2024",
    image: "/placeholder.svg?height=200&width=300",
    status: "winning",
  },
]

const mockWatchlist = [
  {
    id: "1",
    title: "Antique Pocket Watch",
    currentBid: 850,
    bids: 6,
    timeLeft: "4 days, 3 hours",
    endDate: "April 17, 2024",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    title: "Handmade Ceramic Vase Set",
    currentBid: 320,
    bids: 3,
    timeLeft: "2 days, 15 hours",
    endDate: "April 15, 2024",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [userMode, setUserMode] = useState<'buyer' | 'seller'>('buyer')
  const [userData, setUserData] = useState({
    name: "Messiah Hamilton",
    email: "messiahhamiltonguap@gmail.com",
    avatar: "/placeholder.svg?height=100&width=100",
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication status
    const auth = localStorage.getItem('isAuthenticated')
    if (auth !== 'true') {
      router.push('/auth/login')
      return
    }
    
    setIsAuthenticated(true)
    
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUserData({
          ...userData,
          name: parsedUser.name || userData.name,
          email: parsedUser.email || userData.email,
        })
      } catch (e) {
        console.error("Error parsing user data", e)
      }
    }
    
    // Get user mode from localStorage
    const storedMode = localStorage.getItem('userMode')
    if (storedMode === 'buyer' || storedMode === 'seller') {
      setUserMode(storedMode)
    }
  }, [router])

  const formatCurrency = (amount: number) => {
    return `TTD $${Math.abs(amount).toLocaleString()}`
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader isAuthenticated={true} userMode={userMode} />

      <div className="container px-4 py-8 md:px-6 md:py-10 flex-1">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
              <p className="text-gray-500">Welcome back, {userData.name}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/post-ad">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Post New Ad
                </Button>
              </Link>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
                  <TabsList className="flex flex-col items-start justify-start gap-2 p-4 w-full">
                    <TabsTrigger value="overview" className="w-full justify-start">
                      <Package className="mr-2 h-4 w-4" />
                      Overview
                    </TabsTrigger>
                    {userMode === 'seller' ? (
                      <>
                        <TabsTrigger value="listings" className="w-full justify-start">
                          <Package className="mr-2 h-4 w-4" />
                          My Listings
                        </TabsTrigger>
                        <TabsTrigger value="sold" className="w-full justify-start">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Sold Items
                        </TabsTrigger>
                      </>
                    ) : (
                      <>
                        <TabsTrigger value="bids" className="w-full justify-start">
                          <DollarSign className="mr-2 h-4 w-4" />
                          My Bids
                        </TabsTrigger>
                        <TabsTrigger value="purchases" className="w-full justify-start">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Purchases
                        </TabsTrigger>
                      </>
                    )}
                    <TabsTrigger value="watchlist" className="w-full justify-start">
                      <Heart className="mr-2 h-4 w-4" />
                      Watchlist
                    </TabsTrigger>
                    <TabsTrigger value="messages" className="w-full justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="w-full justify-start">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </aside>
                <div className="w-full">
                  <TabsContent value="overview" className="p-0 mt-0">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            {userMode === 'seller' ? 'Total Sales' : 'Total Spent'}
                          </CardTitle>
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{formatCurrency(2500)}</div>
                          <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            {userMode === 'seller' ? 'Active Listings' : 'Active Bids'}
                          </CardTitle>
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{userMode === 'seller' ? 3 : 2}</div>
                          <p className="text-xs text-muted-foreground">
                            {userMode === 'seller' ? '2 ending soon' : '1 winning bid'}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
                          <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{mockWatchlist.length}</div>
                          <p className="text-xs text-muted-foreground">
                            1 ending soon
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-6">
                      <h2 className="text-xl font-semibold mb-4">
                        {userMode === 'seller' ? 'Recent Listings' : 'Recent Activity'}
                      </h2>
                      <div className="grid gap-4">
                        {(userMode === 'seller' ? mockListings.slice(0, 3) : mockBids).map((item) => (
                          <Card key={item.id} className="overflow-hidden">
                            <div className="flex flex-col sm:flex-row">
                              <div className="relative h-40 sm:h-auto sm:w-40 flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <CardContent className="flex flex-col justify-between p-4 flex-1">
                                <div>
                                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                                    <div>
                                      <span className="text-gray-500">Current Bid: </span>
                                      <span className="font-medium text-emerald-600">
                                        {formatCurrency('currentBid' in item ? item.currentBid : 0)}
                                      </span>
                                    </div>
                                    {'yourBid' in item && (
                                      <div>
                                        <span className="text-gray-500">Your Bid: </span>
                                        <span className="font-medium">
                                          {formatCurrency(item.yourBid)}
                                        </span>
                                      </div>
                                    )}
                                    <div>
                                      <span className="text-gray-500">Time Left: </span>
                                      <span className="font-medium">{item.timeLeft}</span>
                                    </div>
                                    {'status' in item && (
                                      <div>
                                        <span className="text-gray-500">Status: </span>
                                        <span className={`font-medium ${
                                          item.status === 'winning' ? 'text-emerald-600' : 
                                          item.status === 'outbid' ? 'text-red-500' : 
                                          item.status === 'sold' ? 'text-blue-500' : ''
                                        }`}>
                                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                  <Link href={`/listings/${item.id}`}>
                                    <Button variant="outline" size="sm">
                                      View Details
                                      <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                  </Link>
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        ))}
                      </div>
                      <div className="mt-4 text-center">
                        <Button variant="outline" onClick={() => setActiveTab(userMode === 'seller' ? 'listings' : 'bids')}>
                          View All
                        </Button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row gap-6 items-start">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden">
                              <Image
                                src={userData.avatar || "/placeholder.svg"}
                                alt={userData.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 space-y-4">
                              <div>
                                <h3 className="font-semibold text-lg">{userData.name}</h3>
                                <p className="text-gray-500">{userData.email}</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Member Since</p>
                                  <p className="font-medium">April 2025</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Account Type</p>
                                  <p className="font-medium capitalize">{userMode}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Rating</p>
                                  <div className="flex items-center">
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                          key={star}
                                          className={`h-4 w-4 ${
                                            star <= 5 ? "text-yellow-400 fill-current" : "text-gray-300"
                                          }`}
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                        >
                                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                      ))}
                                    </div>
                                    <span className="ml-1 text-sm">(0 reviews)</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 px-6 py-3">
                          <Link href="/dashboard/settings">
                            <Button variant="outline" size="sm">
                              Edit Profile
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="listings" className="p-0 mt-0">
                    <h2 className="text-xl font-semibold mb-4">My Listings</h2>
                    {userMode === 'seller' ? (
                      <div className="grid gap-4">
                        {mockListings.map((listing) => (
                          <Card key={listing.id} className="overflow-hidden">
                            <div className="flex flex-col sm:flex-row">
                              <div className="relative h-40 sm:h-auto sm:w-40 flex-shrink-0">
                                <Image
                                  src={listing.image || "/placeholder.svg"}
                                  alt={listing.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <CardContent className="flex flex-col justify-between p-4 flex-1">
                                <div>
                                  <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
                                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                                    <div>
                                      <span className="text-gray-500">Current Bid: </span>
                                      <span className="font-medium text-emerald-600">
                                        {formatCurrency(listing.currentBid)}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Bids: </span>
                                      <span className="font-medium">{listing.bids}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Watchers: </span>
                                      <span className="font-medium">{listing.watchers}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Views: </span>
                                      <span className="font-medium">{listing.views}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Time Left: </span>
                                      <span className="font-medium">{listing.timeLeft}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Status: </span>
                                      <span className={`font-medium ${
                                        listing.status === 'active' ? 'text-emerald-600' : 
                                        listing.status === 'sold' ? 'text-blue-500' : ''
                                      }`}>
                                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-end mt-4 gap-2">
                                  <Link href={`/listings/${listing.id}/edit`}>
                                    <Button variant="outline" size="sm">
                                      Edit
                                    </Button>
                                  </Link>
                                  <Link href={`/listings/${listing.id}`}>
                                    <Button variant="outline" size="sm">
                                      View
                                    </Button>
                                  </Link>
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <User className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Switch to Seller Mode</h3>
                        <p className="text-gray-500 mb-6 max-w-md">
                          You're currently in Buyer mode. Switch to Seller mode to view and manage your listings.
                        </p>
                        <Button onClick={() => {
                          setUserMode('seller')
                          localStorage.setItem('userMode', 'seller')
                        }} className="bg-emerald-600 hover:bg-emerald-700">
                          Switch to Seller
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="bids" className="p-0 mt-0">
                    <h2 className="text-xl font-semibold mb-4">My Bids</h2>
                    {userMode === 'buyer' ? (
                      <div className="grid gap-4">
                        {mockBids.map((bid) => (
                          <Card key={bid.id} className="overflow-hidden">
                            <div className="flex flex-col sm:flex-row">
                              <div className="relative h-40 sm:h-auto sm:w-40 flex-shrink-0">
                                <Image
                                  src={bid.image || "/placeholder.svg"}
                                  alt={bid.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <CardContent className="flex flex-col justify-between p-4 flex-1">
                                <div>
                                  <h3 className="font-semibold text-lg mb-1">{bid.title}</h3>
                                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                                    <div>
                                      <span className="text-gray-500">Your Bid: </span>
                                      <span className="font-medium">
                                        {formatCurrency(bid.yourBid)}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Current Bid: </span>
                                      <span className="font-medium text-emerald-600">
                                        {formatCurrency(bid.currentBid)}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Time Left: </span>
                                      <span className="font-medium">{bid.timeLeft}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Status: </span>
                                      <span className={`font-medium ${
                                        bid.status === 'winning' ? 'text-emerald-600' : 
                                        bid.status === 'outbid' ? 'text-red-500' : 
                                        bid.status === 'won' ? 'text-blue-500' : ''
                                      }`}>
                                        {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                  <Link href={`/listings/${bid.id}`}>
                                    <Button variant="outline" size="sm">
                                      View Listing
                                    </Button>
                                  </Link>
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <User className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Switch to Buyer Mode</h3>
                        <p className="text-gray-500 mb-6 max-w-md">
                          You're currently in Seller mode. Switch to Buyer mode to view and manage your bids.
                        </p>
                        <Button onClick={() => {
                          setUserMode('buyer')
                          localStorage.setItem('userMode', 'buyer')
                        }} className="bg-emerald-600 hover:bg-emerald-700">
                          Switch to Buyer
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="watchlist" className="p-0 mt-0">
                    <h2 className="text-xl font-semibold mb-4">Watchlist</h2>
                    <div className="grid gap-4">
                      {mockWatchlist.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <div className="flex flex-col sm:flex-row">
                            <div className="relative h-40 sm:h-auto sm:w-40 flex-shrink-0">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <CardContent className="flex flex-col justify-between p-4 flex-1">
                              <div>
                                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                                  <div>
                                    <span className="text-gray-500">Current Bid: </span>
                                    <span className="font-medium text-emerald-600">
                                      {formatCurrency(item.currentBid)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Bids: </span>
                                    <span className="font-medium">{item.bids}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Time Left: </span>
                                    <span className="font-medium">{item.timeLeft}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end mt-4 gap-2">
                                <Button variant="outline" size="sm">
                                  Remove
                                </Button>
                                <Link href={`/listings/${item.id}`}>
                                  <Button variant="outline" size="sm">
                                    View Listing
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="messages" className="p-0 mt-0">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Messages Yet</h3>
                      <p className="text-gray-500 mb-6 max-w-md">
                        You don't have any messages yet. When you receive messages from buyers or sellers, they will appear here.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="notifications" className="p-0 mt-0">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bell className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Notifications</h3>
                      <p className="text-gray-500 mb-6 max-w-md">
                        You don't have any notifications yet. When you receive updates about your listings or bids, they will appear here.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="p-0 mt-0">
                    <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={userData.name} readOnly />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={userData.email} readOnly />
                              </div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Account Preferences</h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">Account Type</p>
                                  <p className="text-sm text-gray-500">Switch between buyer and seller mode</p>
                                </div>
                                <Button 
                                  variant="outline"
                                  onClick={() => {
                                    const newMode = userMode === 'buyer' ? 'seller' : 'buyer'
                                    setUserMode(newMode)
                                    localStorage.setItem('userMode', newMode)
                                  }}
                                >
                                  Switch to {userMode === 'buyer' ? 'Seller' : 'Buyer'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}

