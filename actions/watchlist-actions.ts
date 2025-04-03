"use server"

import {
  getWatchlistByUserId,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
} from "@/db/queries/watchlist-queries"
import type { ActionState } from "@/types"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// Add to watchlist action
export async function addToWatchlistAction(listingId: string): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    // Add to watchlist
    const watchlistItem = await addToWatchlist({
      userId: session.id,
      listingId,
    })

    revalidatePath(`/listings/${listingId}`)
    revalidatePath("/dashboard")

    return {
      status: "success",
      message: "Added to watchlist",
      data: watchlistItem,
    }
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    return { status: "error", message: "Failed to add to watchlist" }
  }
}

// Remove from watchlist action
export async function removeFromWatchlistAction(listingId: string): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    // Remove from watchlist
    await removeFromWatchlist(session.id, listingId)

    revalidatePath(`/listings/${listingId}`)
    revalidatePath("/dashboard")

    return {
      status: "success",
      message: "Removed from watchlist",
    }
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    return { status: "error", message: "Failed to remove from watchlist" }
  }
}

// Get my watchlist action
export async function getMyWatchlistAction(): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    // Get watchlist
    const watchlist = await getWatchlistByUserId(session.id)

    return {
      status: "success",
      message: "Watchlist retrieved successfully",
      data: watchlist,
    }
  } catch (error) {
    console.error("Error getting watchlist:", error)
    return { status: "error", message: "Failed to get watchlist" }
  }
}

// Check if item is in watchlist action
export async function isInWatchlistAction(listingId: string): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    // Check if in watchlist
    const inWatchlist = await isInWatchlist(session.id, listingId)

    return {
      status: "success",
      message: "Watchlist status retrieved",
      data: inWatchlist,
    }
  } catch (error) {
    console.error("Error checking watchlist status:", error)
    return { status: "error", message: "Failed to check watchlist status" }
  }
}

