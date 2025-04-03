"use client"

import type React from "react"

import { useState } from "react"
import { Share2, Copy, Check, Facebook, Twitter, PhoneIcon as WhatsApp, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface ShareDialogProps {
  itemId: string
  itemTitle: string
  variant?: "button" | "link" | "icon"
}

export default function ShareDialog({ itemId, itemTitle, variant = "button" }: ShareDialogProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/listings/${itemId}` : `/listings/${itemId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  const shareViaTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this listing on ezyauction.tt: ${itemTitle}`)}`,
      "_blank",
    )
  }

  const shareViaWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`Check out this listing on ezyauction.tt: ${itemTitle} ${shareUrl}`)}`,
      "_blank",
    )
  }

  const shareViaEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent(`Check out this listing on ezyauction.tt: ${itemTitle}`)}&body=${encodeURIComponent(`I found this listing on ezyauction.tt and thought you might be interested: ${shareUrl}`)}`,
      "_blank",
    )
  }

  const renderTrigger = () => {
    switch (variant) {
      case "link":
        return (
          <Button variant="ghost" size="sm" className="flex items-center text-gray-500">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        )
      case "icon":
        return (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
        )
      default:
        return (
          <Button variant="outline" size="sm" className="flex items-center">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{renderTrigger()}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Listing</DialogTitle>
          <DialogDescription>Share this listing with friends and family</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Item:</p>
            <p className="text-sm bg-gray-50 p-2 rounded">{itemTitle}</p>
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <div className="grid flex-1 gap-2">
              <Label>Link</Label>
              <div className="flex items-center">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button size="sm" variant="ghost" className="px-3 ml-2" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Share via</Label>
            <div className="grid grid-cols-4 gap-2">
              <Button variant="outline" className="flex flex-col items-center py-4 h-auto" onClick={shareViaFacebook}>
                <Facebook className="h-5 w-5 mb-1 text-blue-600" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center py-4 h-auto" onClick={shareViaTwitter}>
                <Twitter className="h-5 w-5 mb-1 text-blue-400" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center py-4 h-auto" onClick={shareViaWhatsApp}>
                <WhatsApp className="h-5 w-5 mb-1 text-green-500" />
                <span className="text-xs">WhatsApp</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center py-4 h-auto" onClick={shareViaEmail}>
                <Mail className="h-5 w-5 mb-1 text-gray-600" />
                <span className="text-xs">Email</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {children}
    </div>
  )
}

