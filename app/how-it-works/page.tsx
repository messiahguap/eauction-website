import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Search, Gavel, CreditCard, Award, Bell, ShieldCheck, Clock } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How ezyauction.tt Works</h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Your complete guide to buying and selling on Trinidad & Tobago's premier auction platform
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 items-start">
              <Card className="h-full">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle>1. Browse & Discover</CardTitle>
                  <CardDescription>Find exactly what you're looking for</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-emerald-600" />
                      <span>Search for specific items or browse by category</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-emerald-600" />
                      <span>Filter results by location, price, and condition</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-emerald-600" />
                      <span>View detailed listings with high-quality photos</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-emerald-600" />
                      <span>Save favorite items to your watchlist</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <Gavel className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle>2. Bid & Win</CardTitle>
                  <CardDescription>Participate in exciting auctions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-emerald-600" />
                      <span>Place bids on items you're interested in</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-emerald-600" />
                      <span>Set maximum bids and get outbid notifications</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-emerald-600" />
                      <span>Use "Buy Now" for immediate purchase when available</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-emerald-600" />
                      <span>Track active bids in your dashboard</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <CreditCard className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle>3. Pay & Collect</CardTitle>
                  <CardDescription>Secure transactions and delivery</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-emerald-600" />
                      <span>Pay securely through our platform</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-emerald-600" />
                      <span>Arrange pickup or delivery with the seller</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-emerald-600" />
                      <span>Inspect items before finalizing the transaction</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-emerald-600" />
                      <span>Leave feedback for the seller</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Selling on ezyauction.tt</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Turn your unused items into cash with our simple selling process
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
              <div className="relative">
                <div className="aspect-video overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Selling process illustration"
                    width={600}
                    height={400}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Create Your Listing</h3>
                    <p className="text-gray-500">
                      Take quality photos and write a detailed description of your item. Set your starting bid, reserve
                      price (optional), and auction duration.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Pay the Listing Fee</h3>
                    <p className="text-gray-500">
                      A small listing fee of TTD $50 helps maintain the quality of our platform. Premium options are
                      available for increased visibility.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Manage Your Auction</h3>
                    <p className="text-gray-500">
                      Answer buyer questions, track bids, and receive notifications when your item sells. All from your
                      seller dashboard.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Complete the Sale</h3>
                    <p className="text-gray-500">
                      Arrange payment and delivery with the winning bidder. Our platform handles the 5% commission on
                      successful sales automatically.
                    </p>
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/post-ad">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Start Selling Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Choose ezyauction.tt?</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  The safest and most trusted auction platform in Trinidad & Tobago
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <ShieldCheck className="h-8 w-8 text-emerald-600 mb-2" />
                  <CardTitle className="text-lg">Secure Platform</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    End-to-end encryption and secure payment processing protect your personal and financial information.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <Award className="h-8 w-8 text-emerald-600 mb-2" />
                  <CardTitle className="text-lg">Verified Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Our verification process ensures you're dealing with legitimate buyers and sellers.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <Bell className="h-8 w-8 text-emerald-600 mb-2" />
                  <CardTitle className="text-lg">Real-time Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Get instant notifications for new bids, outbids, questions, and when auctions are ending.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <Clock className="h-8 w-8 text-emerald-600 mb-2" />
                  <CardTitle className="text-lg">24/7 Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Our customer support team is available around the clock to assist with any issues.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Frequently Asked Questions</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Find answers to common questions about using ezyauction.tt
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How much does it cost to sell on ezyauction.tt?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      There is a TTD $50 listing fee for each item you post. This fee helps maintain the quality of our
                      platform and covers your listing for the duration you select (3-14 days). Additionally, we charge
                      a 5% commission on successful sales. Premium listing options are available for an additional fee
                      to increase your item's visibility.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I pay for items I've won?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      After winning an auction, you'll receive instructions for payment. We recommend using our secure
                      payment system, which protects both buyers and sellers. You can pay using credit/debit cards or
                      bank transfers. For high-value items, an escrow service is available for an additional fee.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What happens if I'm outbid?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      If someone outbids you, you'll receive an immediate notification via email and on the platform if
                      you have notifications enabled. You can then decide whether to place a higher bid or let it go.
                      You can also set a maximum bid amount, and our system will automatically bid up to that amount on
                      your behalf.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I cancel a bid I've placed?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      In general, bids are binding and cannot be retracted. However, in exceptional circumstances (such
                      as an obvious error in the item description), you can contact our support team who will review
                      your request. Sellers cannot cancel bids but can cancel the entire auction if necessary before any
                      bids are placed.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>What is a reserve price?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      A reserve price is the minimum amount a seller is willing to accept for an item. If the bidding
                      doesn't reach the reserve price, the seller is not obligated to sell the item. Listings with a
                      reserve price are marked accordingly, though the exact reserve amount is not disclosed to bidders.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>How is ezyauction.tt different from other marketplaces?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      ezyauction.tt is specifically designed for Trinidad & Tobago, with local categories, locations,
                      and payment methods. We focus exclusively on auctions rather than fixed-price listings, creating
                      an exciting and competitive marketplace. Our platform also offers enhanced security features,
                      verified users, and local customer support.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-emerald-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Get Started?</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Join thousands of users buying and selling on ezyauction.tt
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Create an Account</Button>
                </Link>
                <Link href="/listings">
                  <Button variant="outline">Browse Listings</Button>
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
