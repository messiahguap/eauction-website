"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Lock } from "lucide-react"

interface AuthRequiredDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: () => void
  onSignup: () => void
}

export default function AuthRequiredDialog({ open, onOpenChange, onLogin, onSignup }: AuthRequiredDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-emerald-600" />
          </div>
          <DialogTitle className="text-center">Authentication Required</DialogTitle>
          <DialogDescription className="text-center">
            You need to be signed in to post an ad on ezyauction.tt
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3 sm:justify-center">
          <Button variant="outline" onClick={onLogin}>
            Log in
          </Button>
          <Button onClick={onSignup} className="bg-emerald-600 hover:bg-emerald-700">
            Create an account
          </Button>
        </div>
        <DialogFooter className="sm:justify-center">
          <p className="text-xs text-center text-gray-500">Creating an account is free and only takes a minute</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

