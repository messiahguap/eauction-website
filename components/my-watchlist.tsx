import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, getTimeLeft, isAuctionEnded } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface MyWatchlistProps {
  watchlist: any[]
}

export function MyWatchlist({ watchlist }: MyWatchlistProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>My Watchlist</CardTitle>
        <CardDescription>Items you&apos;re watching</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {watchlist.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <h3 className="mt-2 text-sm font-semibold">No watched items</h3>
            <p className="mt-1 text-sm text-muted-foreground">You aren&apos;t watching any items yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {watchlist.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.listing?.title}</span>
                    <Badge variant={getListingStatusVariant(item.listing?.status)}>
                      {formatListingStatus(item.listing?.status)}
                    </Badge>
                  </div>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>Current bid: {formatCurrency(item.listing?.current_bid || item.listing?.starting_bid)}</span>
                    <span>•</span>
                    <span>{item.listing?.bids} bids</span>
                    <span>•</span>
                    <span>
                      {item.listing?.status === "active"
                        ? isAuctionEnded(item.listing?.end_date)
                          ? "Ended"
                          : getTimeLeft(item.listing?.end_date)
                        : formatListingStatus(item.listing?.status)}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/listings/${item.listing_id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/watchlist">View All Watched Items</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function formatListingStatus(status: string) {
  switch (status) {
    case "active":
      return "Active"
    case "ended":
      return "Ended"
    case "ended_no_bids":
      return "No Bids"
    case "reserve_not_met":
      return "Reserve Not Met"
    default:
      return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ")
  }
}

function getListingStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
      return "default"
    case "ended":
      return "secondary"
    case "ended_no_bids":
    case "reserve_not_met":
      return "destructive"
    default:
      return "outline"
  }
}
