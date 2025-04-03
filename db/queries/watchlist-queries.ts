"use server"

import { and, eq } from "drizzle-orm"
import { db } from "../db"
import { type InsertWatchlistItem, type SelectWatchlistItem, watchlist } from "../schema/watchlist"
import { decrementWatchers, incrementWatchers } from "./listing-queries"

// Add item to watchlist
export const addToWatchlist = async (data: InsertWatchlistItem): Promise<SelectWatchlistItem> => {
  try {
    // Check if item is already in watchlist
    const existingItem = await db.query.watchlist.findFirst({
      where: and(eq(watchlist.userId, data.userId), eq(watchlist.listingId, data.listingId)),
    })

    if (existingItem) {
      return existingItem
    }

    // Add to watchlist
    const [newItem] = await db.insert(watchlist).values(data).returning()

    // Increment watchers count on listing
    await incrementWatchers(data.listingId)

    return newItem
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    throw new Error("Failed to add to watchlist")
  }
}

// Remove item from watchlist
export const removeFromWatchlist = async (userId: string, listingId: string): Promise<void> => {
  try {
    await db.delete(watchlist).where(and(eq(watchlist.userId, userId), eq(watchlist.listingId, listingId)))

    // Decrement watchers count on listing
    await decrementWatchers(listingId)
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    throw new Error("Failed to remove from watchlist")
  }
}

// Get watchlist items by user ID
export const getWatchlistByUserId = async (userId: string): Promise<SelectWatchlistItem[]> => {
  try {
    const watchlistItems = await db.select().from(watchlist).where(eq(watchlist.userId, userId)).execute()

    return watchlistItems
  } catch (error) {
    console.error("Error getting watchlist by user ID:", error)
    throw new Error("Failed to get watchlist by user ID")
  }
}

// Check if item is in watchlist
export const isInWatchlist = async (userId: string, listingId: string): Promise<boolean> => {
  try {
    const item = await db.query.watchlist.findFirst({
      where: and(eq(watchlist.userId, userId), eq(watchlist.listingId, listingId)),
    })

    return !!item
  } catch (error) {
    console.error("Error checking if item is in watchlist:", error)
    throw new Error("Failed to check if item is in watchlist")
  }
}

