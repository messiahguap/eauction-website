import Link from "next/link"
import Image from "next/image"
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About ezyauction.tt</h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Trinidad & Tobago's premier online auction platform, connecting buyers and sellers since 2025
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 md:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Story</h2>
                <p className="text-gray-500 md:text-lg">
                  ezyauction.tt was founded in 2025 by Messiah Hamilton with a simple mission: to create a secure,
                  user-friendly online auction platform specifically designed for the people of Trinidad & Tobago.
                </p>
                <p className="text-gray-500 md:text-lg">
                  We recognized that while global auction platforms existed, none catered to the unique needs of our
                  local market. From understanding local shipping challenges to incorporating familiar payment methods,
                  we built ezyauction.tt from the ground up with Trinidad & Tobago in mind.
                </p>
                <p className="text-gray-500 md:text-lg">
                  Today, we're proud to be the fastest-growing auction platform in the country, connecting thousands of
                  buyers and sellers across our beautiful twin islands.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-video overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="ezyauction.tt team"
                    width={600}
                    height={400}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Mission & Values</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">What drives us every day</p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    To create a thriving online marketplace that empowers Trinbagonians to buy and sell with confidence,
                    fostering a culture of trust, transparency, and community.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    To become the most trusted platform for online commerce in Trinidad & Tobago, known for exceptional
                    user experience, security, and customer satisfaction.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Our Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-500">
                    <li>
                      <strong>Integrity:</strong> We operate with honesty and transparency in all we do.
                    </li>
                    <li>
                      <strong>Security:</strong> We prioritize the protection of our users' data and transactions.
                    </li>
                    <li>
                      <strong>Community:</strong> We celebrate and support our local Trinbagonian community.
                    </li>
                    <li>
                      <strong>Innovation:</strong> We continuously improve our platform to better serve our users.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Meet Our Founder</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">The visionary behind ezyauction.tt</p>
              </div>
            </div>

            <div className="max-w-md mx-auto">
              <Card className="bg-white">
                <CardHeader className="text-center">
                  <div className="mx-auto w-24 h-24 rounded-full overflow-hidden mb-4">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="CEO portrait"
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                  <CardTitle>Messiah Hamilton</CardTitle>
                  <CardDescription>CEO & Founder</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-500">
                    I'm 16 years old and passionate about technology and entrepreneurship. I founded ezyauction.tt to
                    revolutionize the way Trinbagonians buy and sell online, creating a platform that truly understands
                    the local market.
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
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Impact</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Making a difference in Trinidad & Tobago
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">10,000+</div>
                <p className="text-gray-500">Registered Users</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">TTD 5M+</div>
                <p className="text-gray-500">In Successful Auctions</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">50+</div>
                <p className="text-gray-500">Local Jobs Created</p>
              </div>
            </div>

            <div className="mt-12 bg-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Community Initiatives</h3>
              <p className="text-gray-500 mb-6">
                At ezyauction.tt, we believe in giving back to the community that supports us. We're proud to support
                several local initiatives:
              </p>
              <ul className="space-y-2 text-gray-500">
                <li>• Annual technology scholarships for students at the University of the West Indies</li>
                <li>• Monthly charity auctions where 100% of proceeds go to local non-profits</li>
                <li>• Free business workshops for small entrepreneurs in Trinidad & Tobago</li>
                <li>• Environmental initiatives including beach clean-ups and tree planting</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Contact Us</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">We'd love to hear from you</p>
              </div>
            </div>

            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-bold mb-4">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Our Office</p>
                      <p className="text-gray-500">123 Frederick Street, Port of Spain, Trinidad & Tobago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Email Us</p>
                      <p className="text-gray-500">messiahhamiltonguap@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Call Us</p>
                      <p className="text-gray-500">(868) 340-9000</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold mt-8 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <Link href="https://facebook.com" className="text-gray-500 hover:text-emerald-600">
                    <Facebook className="h-6 w-6" />
                    <span className="sr-only">Facebook</span>
                  </Link>
                  <Link href="https://instagram.com" className="text-gray-500 hover:text-emerald-600">
                    <Instagram className="h-6 w-6" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                  <Link href="https://twitter.com" className="text-gray-500 hover:text-emerald-600">
                    <Twitter className="h-6 w-6" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                </div>
              </div>

              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=600"
                  alt="Map of office location"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

