import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, getTimeLeft, isAuctionEnded } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface MyBidsProps {
  bids: any[]
}

export function MyBids({ bids }: MyBidsProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>My Bids</CardTitle>
        <CardDescription>Track your auction bids</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bids.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <h3 className="mt-2 text-sm font-semibold">No bids</h3>
            <p className="mt-1 text-sm text-muted-foreground">You haven&apos;t placed any bids yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => (
              <div key={bid.id} className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{bid.listing?.title}</span>
                    <Badge variant={getBidStatusVariant(bid.status)}>{formatBidStatus(bid.status)}</Badge>
                  </div>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>Your bid: {formatCurrency(bid.amount)}</span>
                    <span>•</span>
                    <span>
                      {bid.listing?.status === "active"
                        ? isAuctionEnded(bid.listing?.end_date)
                          ? "Ended"
                          : getTimeLeft(bid.listing?.end_date)
                        : formatListingStatus(bid.listing?.status)}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/listings/${bid.listing_id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/listings">Browse Listings</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function formatBidStatus(status: string) {
  switch (status) {
    case "active":
      return "Active"
    case "outbid":
      return "Outbid"
    case "won":
      return "Won"
    default:
      return status.charAt(0).toUpperCase() + status.slice(1)
  }
}

function getBidStatusVariant(status: string): "default" | "secondary" | "destructive" | "success" {
  switch (status) {
    case "active":
      return "default"
    case "outbid":
      return "destructive"
    case "won":
      return "success"
    default:
      return "secondary"
  }
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
