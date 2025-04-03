"use client"

import { useState } from "react"
import { Flag, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ReportDialogProps {
  itemId: string
  itemTitle: string
  variant?: "button" | "link" | "icon"
}

export default function ReportDialog({ itemId, itemTitle, variant = "button" }: ReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportDetails, setReportDetails] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  const handleSubmit = () => {
    if (!reportReason) {
      setFormError("Please select a reason for reporting")
      return
    }

    setIsSubmitting(true)
    setFormError("")

    // Simulate API call
    setTimeout(() => {
      console.log("Report submitted:", {
        itemId,
        itemTitle,
        reason: reportReason,
        details: reportDetails,
      })

      setIsSubmitting(false)
      setSubmitted(true)
    }, 1000)
  }

  const resetForm = () => {
    setReportReason("")
    setReportDetails("")
    setSubmitted(false)
    setFormError("")
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    setOpen(newOpen)
  }

  const renderTrigger = () => {
    switch (variant) {
      case "link":
        return (
          <Button variant="ghost" size="sm" className="flex items-center text-gray-500">
            <Flag className="h-4 w-4 mr-1" />
            Report
          </Button>
        )
      case "icon":
        return (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
            <Flag className="h-4 w-4" />
            <span className="sr-only">Report</span>
          </Button>
        )
      default:
        return (
          <Button variant="outline" size="sm" className="flex items-center">
            <Flag className="h-4 w-4 mr-1" />
            Report
          </Button>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{renderTrigger()}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Listing</DialogTitle>
          <DialogDescription>
            {submitted
              ? "Thank you for helping keep ezyauction.tt safe."
              : "Report this listing if you believe it violates our policies."}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <Flag className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Report Submitted</h3>
            <p className="text-gray-500 mb-4">
              Thank you for your report. Our team will review it and take appropriate action.
            </p>
            <Button onClick={() => setOpen(false)} className="bg-emerald-600 hover:bg-emerald-700">
              Close
            </Button>
          </div>
        ) : (
          <>
            {formError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="py-4">
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Item being reported:</p>
                <p className="text-sm bg-gray-50 p-2 rounded">{itemTitle}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Reason for report</Label>
                  <RadioGroup value={reportReason} onValueChange={setReportReason}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="prohibited" id="prohibited" />
                      <Label htmlFor="prohibited">Prohibited item</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="counterfeit" id="counterfeit" />
                      <Label htmlFor="counterfeit">Counterfeit or replica</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="misleading" id="misleading" />
                      <Label htmlFor="misleading">Misleading description</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="offensive" id="offensive" />
                      <Label htmlFor="offensive">Offensive content</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fraud" id="fraud" />
                      <Label htmlFor="fraud">Suspected fraud</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Additional details (optional)</Label>
                  <Textarea
                    id="details"
                    placeholder="Please provide any additional information that might help us investigate"
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

