import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface MyNotificationsProps {
  notifications: any[]
}

export function MyNotifications({ notifications }: MyNotificationsProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>My Notifications</CardTitle>
        <CardDescription>Recent activity and alerts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <h3 className="mt-2 text-sm font-semibold">No notifications</h3>
            <p className="mt-1 text-sm text-muted-foreground">You don&apos;t have any notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{notification.message}</span>
                    {notification.is_read === "false" && <Badge>New</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">{formatDateTime(notification.created_at)}</div>
                </div>
                {notification.listing_id && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/listings/${notification.listing_id}`}>View</Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/notifications">View All Notifications</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
