"use server"

import { and, eq } from "drizzle-orm"
import { db } from "../db"
import { type InsertBid, type SelectBid, bids } from "../schema/bids"
import { getListingById } from "./listing-queries"
import { createNotification } from "./notification-queries"
import { listings } from "../schema/listings"

// Create a new bid
export const createBid = async (data: InsertBid): Promise<SelectBid> => {
  try {
    // Get the listing
    const listing = await getListingById(data.listingId)

    if (!listing) {
      throw new Error("Listing not found")
    }

    // Check if auction has ended
    if (listing.status !== "active") {
      throw new Error("Auction has ended")
    }

    // Check if bid amount is greater than current bid
    if (data.amount <= listing.currentBid) {
      throw new Error("Bid amount must be greater than current bid")
    }

    // Start a transaction
    const [newBid] = await db.transaction(async (tx) => {
      // Update all previous bids to outbid status
      await tx
        .update(bids)
        .set({ status: "outbid" })
        .where(and(eq(bids.listingId, data.listingId), eq(bids.status, "active")))

      // Create the new bid
      const [bid] = await tx.insert(bids).values(data).returning()

      // Update the listing with new current bid and increment bids count
      await tx
        .update(listings)
        .set({
          currentBid: data.amount,
          bids: listing.bids + 1,
        })
        .where(eq(listings.id, data.listingId))

      // Notify previous bidders that they've been outbid
      const previousBidders = await tx
        .select()
        .from(bids)
        .where(and(eq(bids.listingId, data.listingId), eq(bids.status, "outbid")))

      // Create outbid notifications for previous bidders
      for (const prevBid of previousBidders) {
        if (prevBid.bidderId !== data.bidderId) {
          await createNotification({
            userId: prevBid.bidderId,
            type: "outbid",
            message: `You've been outbid on ${listing.title}`,
            listingId: data.listingId,
          })
        }
      }

      // Notify seller of new bid
      await createNotification({
        userId: listing.sellerId,
        type: "bid",
        message: `New bid of $${data.amount} on your listing: ${listing.title}`,
        listingId: data.listingId,
      })

      return [bid]
    })

    return newBid
  } catch (error) {
    console.error("Error creating bid:", error)
    throw new Error("Failed to create bid")
  }
}

// Get bid by ID
export const getBidById = async (id: string): Promise<SelectBid | null> => {
  try {
    const bid = await db.query.bids.findFirst({
      where: eq(bids.id, id),
    })

    return bid
  } catch (error) {
    console.error("Error getting bid by ID:", error)
    throw new Error("Failed to get bid")
  }
}

// Get bids by listing ID
export const getBidsByListingId = async (listingId: string): Promise<SelectBid[]> => {
  try {
    const listingBids = await db
      .select()
      .from(bids)
      .where(eq(bids.listingId, listingId))
      .orderBy(bids.amount, "desc")
      .execute()

    return listingBids
  } catch (error) {
    console.error("Error getting bids by listing ID:", error)
    throw new Error("Failed to get bids by listing ID")
  }
}

// Get bids by bidder ID
export const getBidsByBidderId = async (bidderId: string): Promise<SelectBid[]> => {
  try {
    const bidderBids = await db
      .select()
      .from(bids)
      .where(eq(bids.bidderId, bidderId))
      .orderBy(bids.createdAt, "desc")
      .execute()

    return bidderBids
  } catch (error) {
    console.error("Error getting bids by bidder ID:", error)
    throw new Error("Failed to get bids by bidder ID")
  }
}

// Get active bids by bidder ID
export const getActiveBidsByBidderId = async (bidderId: string): Promise<SelectBid[]> => {
  try {
    const activeBids = await db
      .select()
      .from(bids)
      .where(and(eq(bids.bidderId, bidderId), eq(bids.status, "active")))
      .orderBy(bids.createdAt, "desc")
      .execute()

    return activeBids
  } catch (error) {
    console.error("Error getting active bids by bidder ID:", error)
    throw new Error("Failed to get active bids by bidder ID")
  }
}

// Get winning bids by bidder ID
export const getWinningBidsByBidderId = async (bidderId: string): Promise<SelectBid[]> => {
  try {
    const winningBids = await db
      .select()
      .from(bids)
      .where(and(eq(bids.bidderId, bidderId), eq(bids.status, "winning")))
      .orderBy(bids.createdAt, "desc")
      .execute()

    return winningBids
  } catch (error) {
    console.error("Error getting winning bids by bidder ID:", error)
    throw new Error("Failed to get winning bids by bidder ID")
  }
}

// Get won bids by bidder ID
export const getWonBidsByBidderId = async (bidderId: string): Promise<SelectBid[]> => {
  try {
    const wonBids = await db
      .select()
      .from(bids)
      .where(and(eq(bids.bidderId, bidderId), eq(bids.status, "won")))
      .orderBy(bids.createdAt, "desc")
      .execute()

    return wonBids
  } catch (error) {
    console.error("Error getting won bids by bidder ID:", error)
    throw new Error("Failed to get won bids by bidder ID")
  }
}

// Delete bid
export const deleteBid = async (id: string): Promise<void> => {
  try {
    await db.delete(bids).where(eq(bids.id, id))
  } catch (error) {
    console.error("Error deleting bid:", error)
    throw new Error("Failed to delete bid")
  }
}

