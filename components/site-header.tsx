"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, User, LogOut, Settings, MessageSquare, Heart, UserCog, Store, Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"

export default function SiteHeader() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [mode, setMode] = useState<"buyer" | "seller">("buyer")
  const [notificationCount, setNotificationCount] = useState(0)

  const isAuthenticated = !!user

  useEffect(() => {
    // Get user mode from localStorage if available
    const storedMode = localStorage.getItem("userMode")
    if (storedMode === "buyer" || storedMode === "seller") {
      setMode(storedMode)
    }

    // This would normally fetch notifications from the API
    // For now, we'll just set it to 0
    setNotificationCount(0)
  }, [user])

  const handlePostAdClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/signin?redirect=/post-ad")
    } else {
      router.push("/post-ad")
    }
  }

  const toggleMode = () => {
    const newMode = mode === "buyer" ? "seller" : "buyer"
    setMode(newMode)
    localStorage.setItem("userMode", newMode)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-6 py-4">
                <Link href="/" className="flex items-center gap-2" onClick={() => setShowMobileMenu(false)}>
                  <div className="text-xl font-bold">
                    <span className="text-black">ezy</span>
                    <span className="text-emerald-600">auction</span>
                    <span className="text-black">.tt</span>
                  </div>
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/listings"
                    className="text-base font-medium hover:text-emerald-600"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Browse Listings
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="text-base font-medium hover:text-emerald-600"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    How It Works
                  </Link>
                  <Link
                    href="/about"
                    className="text-base font-medium hover:text-emerald-600"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    href="/faq"
                    className="text-base font-medium hover:text-emerald-600"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    FAQ
                  </Link>
                </nav>
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link href="/dashboard" className="w-full" onClick={() => setShowMobileMenu(false)}>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Dashboard</Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        handlePostAdClick()
                        setShowMobileMenu(false)
                      }}
                    >
                      Post Your Ad
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link href="/auth/signin" className="w-full" onClick={() => setShowMobileMenu(false)}>
                      <Button variant="outline" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="w-full" onClick={() => setShowMobileMenu(false)}>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Sign up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <div className="text-xl font-bold hidden md:block">
              <span className="text-black">ezy</span>
              <span className="text-emerald-600">auction</span>
              <span className="text-black">.tt</span>
            </div>
            <div className="text-lg font-bold md:hidden">
              <span className="text-black">ezy</span>
              <span className="text-emerald-600">auction</span>
              <span className="text-black">.tt</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6">
          <Link href="/listings" className="text-sm font-medium hover:text-emerald-600 transition-colors">
            Browse Listings
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium hover:text-emerald-600 transition-colors">
            How It Works
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-emerald-600 transition-colors">
            About Us
          </Link>
          <Link href="/faq" className="text-sm font-medium hover:text-emerald-600 transition-colors">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button
                size="sm"
                className="hidden md:block bg-emerald-600 hover:bg-emerald-700"
                onClick={handlePostAdClick}
              >
                Post Your Ad
              </Button>

              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                    {notificationCount}
                  </Badge>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar_url || "/placeholder.svg?height=32&width=32"} alt="User" />
                      <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/messages" className="cursor-pointer">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/watchlist" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Watchlist</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleMode}>
                    {mode === "buyer" ? (
                      <>
                        <Store className="mr-2 h-4 w-4" />
                        <span>Switch to Seller</span>
                      </>
                    ) : (
                      <>
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>Switch to Buyer</span>
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="hidden md:block">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  Sign up
                </Button>
              </Link>
              <Button size="sm" variant="outline" className="hidden md:block" onClick={handlePostAdClick}>
                Post Your Ad
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
