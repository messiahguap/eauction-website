"use server"

import {
  createBid,
  getActiveBidsByBidderId,
  getBidsByBidderId,
  getBidsByListingId,
  getWinningBidsByBidderId,
  getWonBidsByBidderId,
} from "@/db/queries/bid-queries"
import { getListingById } from "@/db/queries/listing-queries"
import type { ActionState, BidData } from "@/types"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// Place bid action
export async function placeBidAction(data: BidData): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    // Get listing
    const listing = await getListingById(data.listingId)

    if (!listing) {
      return { status: "error", message: "Listing not found" }
    }

    // Check if user is the seller
    if (listing.sellerId === session.id) {
      return { status: "error", message: "You cannot bid on your own listing" }
    }

    // Check if auction has ended
    if (listing.status !== "active") {
      return { status: "error", message: "Auction has ended" }
    }

    // Check if bid amount is greater than current bid
    if (data.amount <= listing.currentBid) {
      return { status: "error", message: "Bid amount must be greater than current bid" }
    }

    // Place bid
    const newBid = await createBid({
      amount: data.amount,
      bidderId: session.id,
      listingId: data.listingId,
      status: "active",
    })

    revalidatePath(`/listings/${data.listingId}`)
    revalidatePath("/dashboard")

    return {
      status: "success",
      message: "Bid placed successfully",
      data: newBid,
    }
  } catch (error) {
    console.error("Error placing bid:", error)
    return { status: "error", message: "Failed to place bid" }
  }
}

// Get bids by listing ID action
export async function getBidsByListingIdAction(listingId: string): Promise<ActionState> {
  try {
    const bids = await getBidsByListingId(listingId)

    return {
      status: "success",
      message: "Bids retrieved successfully",
      data: bids,
    }
  } catch (error) {
    console.error("Error getting bids:", error)
    return { status: "error", message: "Failed to get bids" }
  }
}

// Get my bids action
export async function getMyBidsAction(): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    const myBids = await getBidsByBidderId(session.id)

    return {
      status: "success",
      message: "My bids retrieved successfully",
      data: myBids,
    }
  } catch (error) {
    console.error("Error getting my bids:", error)
    return { status: "error", message: "Failed to get my bids" }
  }
}

// Get my active bids action
export async function getMyActiveBidsAction(): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    const activeBids = await getActiveBidsByBidderId(session.id)

    return {
      status: "success",
      message: "Active bids retrieved successfully",
      data: activeBids,
    }
  } catch (error) {
    console.error("Error getting active bids:", error)
    return { status: "error", message: "Failed to get active bids" }
  }
}

// Get my winning bids action
export async function getMyWinningBidsAction(): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    const winningBids = await getWinningBidsByBidderId(session.id)

    return {
      status: "success",
      message: "Winning bids retrieved successfully",
      data: winningBids,
    }
  } catch (error) {
    console.error("Error getting winning bids:", error)
    return { status: "error", message: "Failed to get winning bids" }
  }
}

// Get my won bids action
export async function getMyWonBidsAction(): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    const wonBids = await getWonBidsByBidderId(session.id)

    return {
      status: "success",
      message: "Won bids retrieved successfully",
      data: wonBids,
    }
  } catch (error) {
    console.error("Error getting won bids:", error)
    return { status: "error", message: "Failed to get won bids" }
  }
}

