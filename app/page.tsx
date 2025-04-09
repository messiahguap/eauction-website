import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Search, Users, Award, MapPin, Shield } from "lucide-react"

import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import FeaturedListings from "@/components/featured-listings"
import CategorySection from "@/components/category-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-emerald-50 to-teal-50 py-16 md:py-24">
          <div className="container grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Discover incredible deals, support local sellers, and bid with confidence
              </h1>
              <p className="text-lg text-gray-600">
                ezyauction.tt is Trinidad & Tobago's premier online auction platform. Buy and sell with confidence.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/listings">Start Bidding Now</Link>
                </Button>
                <Button variant="outline">
                  <Link href="/post-ad">Find Your Next Deal</Link>
                </Button>
              </div>
              <p className="text-sm text-gray-500">Join hundreds of satisfied users today!</p>
            </div>
            <div className="relative h-64 rounded-lg bg-white p-6 shadow-lg md:h-96">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Auction items"
                  width={500}
                  height={400}
                  className="rounded-lg object-cover"
                />
                <div className="absolute bottom-4 right-4 rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
                  Ending soon: 2 hours left!
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12">
          <div className="container">
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input type="search" placeholder="Search for items..." className="pl-10 pr-4 py-6 text-base" />
                <Button className="absolute right-1 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t border-b py-12">
          <div className="container">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <Users className="mb-4 h-8 w-8 text-emerald-600" />
                <h3 className="text-2xl font-bold">Registered Users</h3>
                <p className="text-gray-500">Join our growing community</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Award className="mb-4 h-8 w-8 text-emerald-600" />
                <h3 className="text-2xl font-bold">Successful Auctions</h3>
                <p className="text-gray-500">Completed with satisfaction</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <MapPin className="mb-4 h-8 w-8 text-emerald-600" />
                <h3 className="text-2xl font-bold">Local Jobs Created</h3>
                <p className="text-gray-500">Supporting our economy</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="mb-4 h-8 w-8 text-emerald-600" />
                <h3 className="text-2xl font-bold">Secure Transactions</h3>
                <p className="text-gray-500">Safe and protected</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings Section */}
        <section className="py-12">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold">Featured Listings</h2>
              <Link href="/listings" className="flex items-center text-emerald-600 hover:text-emerald-700">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <Suspense fallback={<div>Loading featured listings...</div>}>
              <FeaturedListings />
            </Suspense>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-gray-50 py-12">
          <div className="container">
            <h2 className="mb-8 text-center text-3xl font-bold">Hot Deals</h2>
            <CategorySection />
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16">
          <div className="container text-center">
            <h2 className="mb-8 text-3xl font-bold">
              We're committed to providing the best auction experience in Trinidad & Tobago
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <Shield className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
                <h3 className="mb-2 text-xl font-bold">Secure Platform</h3>
                <p className="text-gray-600">
                  Our platform ensures your payments and personal information are always protected with bank-level
                  security.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <Users className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
                <h3 className="mb-2 text-xl font-bold">Verified Sellers</h3>
                <p className="text-gray-600">
                  We verify all sellers to ensure you're dealing with legitimate businesses and individuals from across
                  Trinidad & Tobago.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <Clock className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
                <h3 className="mb-2 text-xl font-bold">Real-time Bidding</h3>
                <p className="text-gray-600">
                  Our real-time bidding system ensures you never miss out on an item you want with instant
                  notifications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-50 py-16">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Don't just take our word for it - hear from our satisfied users
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="mb-4 italic text-gray-600">
                  "I've sold over 20 items on ezyauction.tt and the process has always been smooth. The platform is easy
                  to use and the team is very responsive."
                </p>
                <p className="font-semibold">Port of Spain</p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="mb-4 italic text-gray-600">
                  "Found a vintage record player that I've been looking for years! The bidding process was exciting and
                  the seller was great to work with."
                </p>
                <p className="font-semibold">San Fernando</p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="mb-4 italic text-gray-600">
                  "As a business owner, I've been able to reach more customers through ezyauction.tt. The premium
                  listing options really help my items stand out."
                </p>
                <p className="font-semibold">Arima</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-lg bg-emerald-50 p-8">
                <h3 className="mb-4 text-2xl font-bold">
                  List your items for auction and reach thousands of potential buyers across Trinidad & Tobago.
                </h3>
                <Link href="/post-ad">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Start Selling Now</Button>
                </Link>
              </div>
              <div className="rounded-lg bg-blue-50 p-8">
                <h3 className="mb-4 text-2xl font-bold">
                  Browse thousands of listings and bid on items you love at great prices.
                </h3>
                <Link href="/listings">
                  <Button className="bg-blue-600 hover:bg-blue-700">Find Your Next Deal</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function Star(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function Clock(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
