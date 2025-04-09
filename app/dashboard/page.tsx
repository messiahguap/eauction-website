import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { MyBids } from "@/components/dashboard/my-bids"
import { MyListings } from "@/components/dashboard/my-listings"
import { MyNotifications } from "@/components/dashboard/my-notifications"
import { MyWatchlist } from "@/components/dashboard/my-watchlist"

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/signin?redirect=/dashboard")
  }

  // Fetch user data
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", session.user.id)
    .maybeSingle()

  if (userError || !userData) {
    console.error("Error fetching user data:", userError)
    redirect("/auth/signin?error=User+profile+not+found")
  }

  // Fetch user's listings
  const { data: listings = [] } = await supabase
    .from("listings")
    .select("*")
    .eq("seller_id", userData.id)
    .order("created_at", { ascending: false })

  // Fetch user's bids
  const { data: bids = [] } = await supabase
    .from("bids")
    .select(`
      *,
      listing:listings(id, title, current_bid, end_date, images)
    `)
    .eq("bidder_id", userData.id)
    .order("created_at", { ascending: false })

  // Fetch user's watchlist
  const { data: watchlist = [] } = await supabase
    .from("watchlist")
    .select(`
      *,
      listing:listings(id, title, current_bid, end_date, images)
    `)
    .eq("user_id", userData.id)
    .order("created_at", { ascending: false })

  // Fetch user's notifications
  const { data: notifications = [] } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userData.id)
    .order("created_at", { ascending: false })

  const user = {
    ...userData,
    auth: session.user,
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome back! Here's an overview of your auction activity."
        user={user}
      />

      <div className="grid gap-6">
        <DashboardStats
          stats={[
            {
              title: "Active Listings",
              value: listings.filter((listing) => listing.status === "active").length,
              icon: "package",
            },
            {
              title: "Active Bids",
              value: bids.filter((bid) => bid.status === "active").length,
              icon: "gavel",
            },
            {
              title: "Watching",
              value: watchlist.length,
              icon: "eye",
            },
            {
              title: "Notifications",
              value: notifications.filter((notification) => !notification.is_read).length,
              icon: "bell",
            },
          ]}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <MyListings listings={listings.slice(0, 5)} />
          <MyBids bids={bids.slice(0, 5)} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <MyWatchlist watchlist={watchlist.slice(0, 5)} />
          <MyNotifications notifications={notifications.slice(0, 5)} />
        </div>
      </div>
    </DashboardShell>
  )
}
