import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, getTimeLeft, isAuctionEnded } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface MyListingsProps {
  listings: any[]
}

export function MyListings({ listings }: MyListingsProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>My Listings</CardTitle>
        <CardDescription>Manage your auction listings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {listings.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <h3 className="mt-2 text-sm font-semibold">No listings</h3>
            <p className="mt-1 text-sm text-muted-foreground">You haven&apos;t created any listings yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{listing.title}</span>
                    <Badge variant={getStatusVariant(listing.status)}>{formatStatus(listing.status)}</Badge>
                  </div>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>{formatCurrency(listing.current_bid || listing.starting_bid)}</span>
                    <span>•</span>
                    <span>{listing.bids} bids</span>
                    <span>•</span>
                    <span>{isAuctionEnded(listing.end_date) ? "Ended" : getTimeLeft(listing.end_date)}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/listings/${listing.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/listings/create">Create New Listing</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function formatStatus(status: string) {
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

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
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
