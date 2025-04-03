"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Filter, Search, Clock, MapPin, Grid, List, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

interface Listing {
  id: string
  title: string
  description: string
  currentBid: number
  timeLeft: string
  image: string
  category: string
  location: string
  seller: string
  createdAt: string
}

// Sample data
const sampleListings: Listing[] = [
  {
    id: "1",
    title: "Vintage Trinidad Carnival Costume",
    description: "Authentic vintage carnival costume from the 1980s, perfect for collectors or displays.",
    currentBid: 1200,
    timeLeft: "2 days, 5 hours",
    image: "/placeholder.svg?height=200&width=300",
    category: "Collectibles",
    location: "Port of Spain",
    seller: "CarnivalLover",
    createdAt: "2023-12-01",
  },
  {
    id: "2",
    title: "Beachfront Property in Tobago",
    description: "Beautiful beachfront property with panoramic ocean views and private beach access.",
    currentBid: 450000,
    timeLeft: "5 days, 12 hours",
    image: "/placeholder.svg?height=200&width=300",
    category: "Real Estate",
    location: "Scarborough, Tobago",
    seller: "IslandProperties",
    createdAt: "2023-11-15",
  },
  {
    id: "3",
    title: "2022 Toyota Hilux 4x4",
    description: "Well-maintained Toyota Hilux with low mileage, perfect for both work and leisure.",
    currentBid: 35000,
    timeLeft: "1 day, 8 hours",
    image: "/placeholder.svg?height=200&width=300",
    category: "Vehicles",
    location: "San Fernando",
    seller: "AutoTrader",
    createdAt: "2023-12-10",
  },
  {
    id: "4",
    title: "Antique Mahogany Dining Set",
    description: "Exquisite mahogany dining set with 6 chairs, handcrafted by local artisans.",
    currentBid: 3500,
    timeLeft: "3 days, 9 hours",
    image: "/placeholder.svg?height=200&width=300",
    category: "Furniture",
    location: "Arima",
    seller: "VintageFinds",
    createdAt: "2023-12-05",
  },
  {
    id: "5",
    title: "Professional DSLR Camera Kit",
    description: "Complete professional camera kit with multiple lenses, tripod, and carrying case.",
    currentBid: 4200,
    timeLeft: "4 days, 3 hours",
    image: "/placeholder.svg?height=200&width=300",
    category: "Electronics",
    location: "Chaguanas",
    seller: "PhotoPro",
    createdAt: "2023-12-08",
  },
  {
    id: "6",
    title: "Handcrafted Leather Bag",
    description: "Genuine leather bag handmade by local artisans, perfect for everyday use.",
    currentBid: 850,
    timeLeft: "2 days, 15 hours",
    image: "/placeholder.svg?height=200&width=300",
    category: "Fashion",
    location: "Port of Spain",
    seller: "LeatherCrafts",
    createdAt: "2023-12-09",
  },
  {
    id: "7",
    title: "Commercial Kitchen Equipment",
    description: "Complete set of commercial kitchen equipment, ideal for restaurant startups.",
    currentBid: 15000,
    timeLeft: "6 days, 7 hours",
    image: "/placeholder.svg?height=200&width=300",
    category: "Business Equipment",
    location: "San Juan",
    seller: "RestaurantSupplies",
    createdAt: "2023-11-30",
  },
  {
    id: "8",
    title: "Rare Stamp Collection",
    description: "Extensive collection of rare Trinidad and Tobago stamps dating back to the 1900s.",
    currentBid: 2800,
    timeLeft: "3 days, 21 hours",
    image: "/placeholder.svg?height=200&width=300",
    category: "Collectibles",
    location: "Arima",
    seller: "StampCollector",
    createdAt: "2023-12-07",
  },
]

const categories = [
  "All Categories",
  "Vehicles",
  "Real Estate",
  "Collectibles",
  "Fashion",
  "Electronics",
  "Furniture",
  "Home & Kitchen",
  "Business Equipment",
]

const locations = [
  "All Locations",
  "Port of Spain",
  "San Fernando",
  "Arima",
  "Chaguanas",
  "San Juan",
  "Scarborough, Tobago",
  "Point Fortin",
  "Princes Town",
]

export default function ListingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [customMinPrice, setCustomMinPrice] = useState("0")
  const [customMaxPrice, setCustomMaxPrice] = useState("500000")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredListings, setFilteredListings] = useState<Listing[]>(sampleListings)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication status when component mounts
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = sampleListings

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((listing) => listing.category === selectedCategory)
    }

    // Location filter
    if (selectedLocation !== "All Locations") {
      filtered = filtered.filter((listing) => listing.location === selectedLocation)
    }

    // Price range filter - using custom inputs
    const minPrice = Number.parseInt(customMinPrice) || 0
    const maxPrice = Number.parseInt(customMaxPrice) || Number.MAX_SAFE_INTEGER
    filtered = filtered.filter((listing) => listing.currentBid >= minPrice && listing.currentBid <= maxPrice)

    // Sort results
    switch (sortBy) {
      case "newest":
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "ending-soon":
        filtered = [...filtered].sort((a, b) => {
          const aTime = a.timeLeft.split(", ")[0].split(" ")[0]
          const bTime = b.timeLeft.split(", ")[0].split(" ")[0]
          return Number.parseInt(aTime) - Number.parseInt(bTime)
        })
        break
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.currentBid - b.currentBid)
        break
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.currentBid - a.currentBid)
        break
    }

    setFilteredListings(filtered)

    // Count active filters
    let count = 0
    if (selectedCategory !== "All Categories") count++
    if (selectedLocation !== "All Locations") count++
    if (Number.parseInt(customMinPrice) > 0 || Number.parseInt(customMaxPrice) < 500000) count++
    if (searchTerm) count++
    setActiveFilters(count)
  }, [searchTerm, selectedCategory, selectedLocation, customMinPrice, customMaxPrice, sortBy])

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("All Categories")
    setSelectedLocation("All Locations")
    setCustomMinPrice("0")
    setCustomMaxPrice("500000")
    setPriceRange([0, 500000])
  }

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values)
    setCustomMinPrice(values[0].toString())
    setCustomMaxPrice(values[1].toString())
  }

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomMinPrice(value)
    if (value && !isNaN(Number.parseInt(value))) {
      setPriceRange([Number.parseInt(value), priceRange[1]])
    }
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomMaxPrice(value)
    if (value && !isNaN(Number.parseInt(value))) {
      setPriceRange([priceRange[0], Number.parseInt(value)])
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader isAuthenticated={isAuthenticated} />

      <div className="container px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold md:text-3xl">Browse Listings</h1>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-2/3 lg:w-1/2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search listings..."
                  className="pl-9 pr-4 py-2 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                      {activeFilters > 0 && (
                        <Badge className="ml-1 bg-emerald-600 hover:bg-emerald-700">{activeFilters}</Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>Filter Listings</SheetTitle>
                      <SheetDescription>Refine your search results with these filters.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium">Category</h3>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-sm font-medium">Location</h3>
                        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">Price Range (TTD)</h3>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={customMinPrice}
                            onChange={handleMinPriceChange}
                            className="w-full"
                          />
                          <span>-</span>
                          <Input
                            type="number"
                            placeholder="Max"
                            value={customMaxPrice}
                            onChange={handleMaxPriceChange}
                            className="w-full"
                          />
                        </div>
                        <Slider
                          defaultValue={[0, 500000]}
                          max={1000000}
                          step={1000}
                          value={priceRange}
                          onValueChange={handlePriceRangeChange}
                          className="py-4"
                        />
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-sm font-medium">Auction Status</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="ending-soon" />
                            <Label htmlFor="ending-soon">Ending Soon</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="newly-listed" />
                            <Label htmlFor="newly-listed">Newly Listed</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="no-bids" />
                            <Label htmlFor="no-bids">No Bids Yet</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <SheetFooter className="flex flex-row justify-between sm:justify-between">
                      <Button variant="outline" onClick={resetFilters}>
                        Reset Filters
                      </Button>
                      <SheetClose asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">Apply Filters</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="ending-soon">Ending Soon</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden md:flex border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-none ${viewMode === "grid" ? "bg-muted" : ""}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                    <span className="sr-only">Grid view</span>
                  </Button>
                  <Separator orientation="vertical" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-none ${viewMode === "list" ? "bg-muted" : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                    <span className="sr-only">List view</span>
                  </Button>
                </div>
              </div>
            </div>

            {activeFilters > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {selectedCategory !== "All Categories" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("All Categories")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedLocation !== "All Locations" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedLocation}
                    <button onClick={() => setSelectedLocation("All Locations")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {(Number.parseInt(customMinPrice) > 0 || Number.parseInt(customMaxPrice) < 500000) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    ${Number.parseInt(customMinPrice).toLocaleString()} - $
                    {Number.parseInt(customMaxPrice).toLocaleString()}
                    <button
                      onClick={() => {
                        setCustomMinPrice("0")
                        setCustomMaxPrice("500000")
                        setPriceRange([0, 500000])
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    "{searchTerm}"
                    <button onClick={() => setSearchTerm("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-sm">
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {filteredListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-6 mb-4">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No listings found</h2>
              <p className="text-gray-500 mb-6 max-w-md">
                We couldn't find any listings matching your search criteria. Try adjusting your filters or search term.
              </p>
              <Button onClick={resetFilters} className="bg-emerald-600 hover:bg-emerald-700">
                Reset Filters
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((listing) => (
                <Link key={listing.id} href={`/listings/${listing.id}`} className="block h-full">
                  <Card className="overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-md">
                    <div className="relative h-48">
                      <Image
                        src={listing.image || "/placeholder.svg"}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-emerald-600">{listing.category}</Badge>
                    </div>
                    <CardContent className="p-4 flex-grow">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        {listing.location}
                      </div>
                      <h3 className="font-semibold text-lg line-clamp-2 mb-1">{listing.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{listing.description}</p>
                      <div className="flex justify-between items-center mt-auto">
                        <div>
                          <p className="text-xs text-gray-500">Current Bid</p>
                          <p className="font-bold text-emerald-600">TTD ${listing.currentBid.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {listing.timeLeft}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredListings.map((listing) => (
                <Link key={listing.id} href={`/listings/${listing.id}`} className="block">
                  <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative h-48 md:h-auto md:w-48 lg:w-64">
                        <Image
                          src={listing.image || "/placeholder.svg"}
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-emerald-600">{listing.category}</Badge>
                      </div>
                      <div className="flex flex-col p-4 flex-grow">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {listing.location}
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{listing.description}</p>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-auto">
                          <div>
                            <p className="text-xs text-gray-500">Current Bid</p>
                            <p className="font-bold text-emerald-600">TTD ${listing.currentBid.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-2 sm:mt-0">
                            <Clock className="h-3 w-3 mr-1" />
                            {listing.timeLeft}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-6">
            <Button variant="outline" className="mx-1">
              1
            </Button>
            <Button variant="outline" className="mx-1">
              2
            </Button>
            <Button variant="outline" className="mx-1">
              3
            </Button>
            <Button variant="outline" className="mx-1">
              ...
            </Button>
            <Button variant="outline" className="mx-1">
              10
            </Button>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}

