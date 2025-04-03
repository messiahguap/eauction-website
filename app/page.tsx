"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Award, Clock, Search, ShieldCheck, TrendingUp, Users, DollarSign } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FeaturedListings from "@/components/featured-listings"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState({
    users: 0,
    auctions: 0,
    jobs: 0
  })

  // Check authentication status when component mounts
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }

    // Increment stats when a new user signs up
    const currentUsers = localStorage.getItem('registeredUsers')
    const currentAuctions = localStorage.getItem('successfulAuctions')
    const currentJobs = localStorage.getItem('localJobs')

    setStats({
      users: currentUsers ? parseInt(currentUsers) : 0,
      auctions: currentAuctions ? parseInt(currentAuctions) : 0,
      jobs: currentJobs ? parseInt(currentJobs) : 0
    })
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader isAuthenticated={isAuthenticated} />

      <main className="flex-1">
        <section className="relative w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-emerald-50 to-white overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Trinidad & Tobago's Premier Online Auction Platform
                </h1>
                <p className="text-xl text-gray-600 max-w-[600px]">
                  Buy and sell everything from collectibles to real estate. Simple, secure, and local.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Link href="/post-ad" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-lg py-6">
                      Post Your Ad <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/listings" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto text-lg py-6">
                      Browse Listings
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative hidden md:block">
                <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
                  <Image 
                    src="/placeholder.svg?height=400&width=600" 
                    alt="Auction items" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 hidden lg:block">
            <div className="w-64 h-64 rounded-full bg-emerald-100 opacity-50"></div>
          </div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 hidden lg:block">
            <div className="w-48 h-48 rounded-full bg-emerald-100 opacity-50"></div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border">
                <Users className="h-10 w-10 text-emerald-600 mb-4" />
                <h3 className="text-3xl font-bold mb-2">{stats.users}</h3>
                <p className="text-gray-500">Registered Users</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border">
                <DollarSign className="h-10 w-10 text-emerald-600 mb-4" />
                <h3 className="text-3xl font-bold mb-2">TTD ${stats.auctions}</h3>
                <p className="text-gray-500">In Successful Auctions</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border">
                <TrendingUp className="h-10 w-10 text-emerald-600 mb-4" />
                <h3 className="text-3xl font-bold mb-2">{stats.jobs}</h3>
                <p className="text-gray-500">Local Jobs Created</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Listings</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Check out our hottest items with active bidding
                </p>
              </div>
            </div>
            <FeaturedListings />
            <div className="flex justify-center mt-8">
              <Link href="/listings">
                <Button variant="outline" size="lg">View All Listings</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 items-center justify-center">
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-gray-50 rounded-lg">
                <ShieldCheck className="h-12 w-12 text-emerald-600" />
                <h3 className="text-xl font-bold">Secure Transactions</h3>
                <p className="text-gray-500">
                  Our platform ensures your payments and personal information are always protected.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-gray-50 rounded-lg">
                <Award className="h-12 w-12 text-emerald-600" />
                <h3 className="text-xl font-bold">Verified Sellers</h3>
                <p className="text-gray-500">
                  We verify all sellers to ensure you're dealing with legitimate businesses and individuals.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-gray-50 rounded-lg">
                <Clock className="h-12 w-12 text-emerald-600" />
                <h3 className="text-xl font-bold">Real-time Bidding</h3>
                <p className="text-gray-500">
                  Our real-time bidding system ensures you never miss out on an item you want.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-emerald-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Start?</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Join thousands of users buying and selling on ezyauction.tt
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
              <Card className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm h-full">
                <CardContent className="flex flex-col items-center text-center p-0 h-full">
                  <h3 className="text-xl font-bold mb-4">I Want to Sell</h3>
                  <p className="text-gray-500 text-center mb-6">
                    List your items for auction and reach thousands of potential buyers across Trinidad & Tobago.
                  </p>
                  <Link href="/post-ad" className="mt-auto">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Post Your Ad</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm h-full">
                <CardContent className="flex flex-col items-center text-center p-0 h-full">
                  <h3 className="text-xl font-bold mb-4">I Want to Buy</h3>
                  <p className="text-gray-500 text-center mb-6">
                    Browse thousands of listings and bid on items you love at great prices.
                  </p>
                  <Link href="/listings" className="mt-auto">
                    <Button variant="outline">Browse Listings</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Trusted By</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Join these satisfied users on ezyauction.tt
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-8 opacity-70">
              <div className="w-32 h-12 bg-gray-200 rounded flex items-center justify-center">Logo 1</div>
              <div className="w-32 h-12 bg-gray-200 rounded flex items-center justify-center">Logo 2</div>
              <div className="w-32 h-12 bg-gray-200 rounded flex items-center justify-center">Logo 3</div>
              <div className="w-32 h-12 bg-gray-200 rounded flex items-center justify-center">Logo 4</div>
              <div className="w-32 h-12 bg-gray-200 rounded flex items-center justify-center">Logo 5</div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

