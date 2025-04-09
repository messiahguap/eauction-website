import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext"
import { FirestoreProvider } from "@/contexts/FirestoreContext"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ezyauction.tt - Trinidad & Tobago's Premier Online Auction Platform",
  description: "Buy and sell items through online auctions in Trinidad & Tobago",
  keywords: "auction, online auction, Trinidad, Tobago, buy, sell, bid",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <FirestoreProvider>
              {children}
              <Toaster />
            </FirestoreProvider>
          </AuthProvider>
        </ThemeProvider>
        <Script src="https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
