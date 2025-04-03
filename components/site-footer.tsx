import Link from "next/link"
import { Facebook, Instagram, Heart } from 'lucide-react'
import { InstagramIcon as Tiktok } from 'lucide-react'

export default function SiteFooter() {
  return (
    <footer className="border-t bg-gray-50 relative">
      <div className="container py-10 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold">
                <span className="text-black">ezy</span>
                <span className="text-emerald-600">auction</span>
                <span className="text-black">.tt</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Trinidad & Tobago's premier online auction platform. Buy and sell with confidence.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="text-gray-500 hover:text-emerald-600">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://instagram.com" className="text-gray-500 hover:text-emerald-600">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://tiktok.com" className="text-gray-500 hover:text-emerald-600">
                <Tiktok className="h-5 w-5" />
                <span className="sr-only">TikTok</span>
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-sm font-medium">Quick Links</div>
            <ul className="grid gap-2 text-sm text-gray-500">
              <li>
                <Link href="/listings" className="hover:text-emerald-600">
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link href="/post-ad" className="hover:text-emerald-600">
                  Post Your Ad
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-600">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <div className="text-sm font-medium">Company</div>
            <ul className="grid gap-2 text-sm text-gray-500">
              <li>
                <Link href="/about" className="hover:text-emerald-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/listings" className="hover:text-emerald-600">
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-600">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <div className="text-sm font-medium">Help</div>
            <ul className="grid gap-2 text-sm text-gray-500">
              <li>
                <Link href="/faq" className="hover:text-emerald-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-600">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="border-t py-6 bg-gray-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-gray-500">© 2025 ezyauction.tt. All rights reserved.</div>
            <div className="flex items-center mt-2 sm:mt-0 text-sm text-gray-500">
              Made with <Heart className="h-3 w-3 mx-1 text-red-500 fill-red-500" /> by Messiah
            </div>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute bottom-2 left-2 text-[10px] text-gray-400 opacity-40">pin.tt</div>
    </footer>
  )
}

