"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Check, X, MessageSquare, DollarSign, Clock, AlertCircle, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface NotificationsPopoverProps {
  notificationCount?: number
}

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "outbid",
    message: "You've been outbid on Beachfront Property in Tobago",
    time: "2 hours ago",
    read: false,
    link: "/listings/2",
  },
  {
    id: "2",
    type: "question",
    message: "New question on your listing: Vintage Trinidad Carnival Costume",
    time: "5 hours ago",
    read: false,
    link: "/dashboard/listings/1",
  },
  {
    id: "3",
    type: "ending",
    message: "Your watched item 'Vintage Vinyl Records Collection' ends in 24 hours",
    time: "1 day ago",
    read: false,
    link: "/listings/3",
  },
  {
    id: "4",
    type: "sold",
    message: "Congratulations! Your item 'Handcrafted Leather Bag' has sold for TTD $950",
    time: "3 days ago",
    read: true,
    link: "/dashboard/listings/4",
  },
  {
    id: "5",
    type: "system",
    message: "Welcome to ezyauction.tt! Complete your profile to get started.",
    time: "3 months ago",
    read: true,
    link: "/dashboard/settings",
  },
]

export default function NotificationsPopover({ notificationCount = 0 }: NotificationsPopoverProps) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<typeof mockNotifications>([])
  const [markAllAsReadDialog, setMarkAllAsReadDialog] = useState(false)

  useEffect(() => {
    // Check if there are any notifications in localStorage
    const storedNotifications = localStorage.getItem("notifications")
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications))
      } catch (e) {
        console.error("Error parsing notifications", e)
        setNotifications([])
      }
    } else {
      // If no notifications, show empty state
      setNotifications([])
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
    setMarkAllAsReadDialog(false)
  }

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter((n) => n.id !== id)
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "outbid":
        return <DollarSign className="h-4 w-4 text-red-500" />
      case "question":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "ending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "sold":
        return <Check className="h-4 w-4 text-emerald-500" />
      case "system":
        return <Info className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 ? (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] px-1 bg-red-500">{unreadCount}</Badge>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => setMarkAllAsReadDialog(true)}>
                Mark all as read
              </Button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">No notifications</div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start p-4 border-b hover:bg-gray-50 ${!notification.read ? "bg-gray-50" : ""}`}
                  >
                    <div className="mr-3 mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={notification.link}
                        className="block"
                        onClick={() => {
                          markAsRead(notification.id)
                          setOpen(false)
                        }}
                      >
                        <p className={`text-sm ${!notification.read ? "font-medium" : ""}`}>{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </Link>
                    </div>
                    <div className="flex ml-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t text-center">
            <Link
              href="/dashboard/notifications"
              className="text-sm text-emerald-600 hover:underline"
              onClick={() => setOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={markAllAsReadDialog} onOpenChange={setMarkAllAsReadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark all as read?</DialogTitle>
            <DialogDescription>This will mark all {unreadCount} unread notifications as read.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button variant="ghost" onClick={() => setMarkAllAsReadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={markAllAsRead} className="bg-emerald-600 hover:bg-emerald-700">
              Mark all as read
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
