"use server"

import { and, eq, gt, lt, like, or } from "drizzle-orm"
import { db } from "../db"
import { type InsertListing, type SelectListing, listings } from "../schema/listings"
import { bids } from "../schema/bids"

// Create a new listing
export const createListing = async (data: InsertListing): Promise<SelectListing> => {
  try {
    // Calculate end date based on duration
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + data.duration)

    const [newListing] = await db
      .insert(listings)
      .values({
        ...data,
        endDate,
        currentBid: data.startingBid,
      })
      .returning()

    return newListing
  } catch (error) {
    console.error("Error creating listing:", error)
    throw new Error("Failed to create listing")
  }
}

// Get listing by ID
export const getListingById = async (id: string): Promise<SelectListing | null> => {
  try {
    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, id),
    })

    // Increment view count
    if (listing) {
      await db
        .update(listings)
        .set({ views: listing.views + 1 })
        .where(eq(listings.id, id))
    }

    return listing
  } catch (error) {
    console.error("Error getting listing by ID:", error)
    throw new Error("Failed to get listing")
  }
}

// Get all listings with filters
export const getListings = async (
  filters?: {
    category?: string
    subcategory?: string
    location?: string
    minPrice?: number
    maxPrice?: number
    condition?: string
    search?: string
    sellerId?: string
    status?: string
    featured?: boolean
    premium?: boolean
  },
  sort?: {
    field: "createdAt" | "endDate" | "currentBid" | "views"
    direction: "asc" | "desc"
  },
  pagination?: {
    page: number
    limit: number
  },
): Promise<{ listings: SelectListing[]; total: number }> => {
  try {
    let query = db.select().from(listings)

    // Apply filters
    if (filters) {
      const conditions = []

      if (filters.category && filters.category !== "All Categories") {
        conditions.push(eq(listings.category, filters.category))
      }

      if (filters.subcategory) {
        conditions.push(eq(listings.subcategory, filters.subcategory))
      }

      if (filters.location && filters.location !== "All Locations") {
        conditions.push(eq(listings.location, filters.location))
      }

      if (filters.minPrice !== undefined) {
        conditions.push(gt(listings.currentBid, filters.minPrice))
      }

      if (filters.maxPrice !== undefined) {
        conditions.push(lt(listings.currentBid, filters.maxPrice))
      }

      if (filters.condition) {
        conditions.push(eq(listings.condition, filters.condition))
      }

      if (filters.search) {
        conditions.push(
          or(like(listings.title, `%${filters.search}%`), like(listings.description, `%${filters.search}%`)),
        )
      }

      if (filters.sellerId) {
        conditions.push(eq(listings.sellerId, filters.sellerId))
      }

      if (filters.status) {
        conditions.push(eq(listings.status, filters.status))
      }

      if (filters.featured) {
        conditions.push(eq(listings.isFeatured, filters.featured))
      }

      if (filters.premium) {
        conditions.push(eq(listings.isPremium, filters.premium))
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions))
      }
    }

    // Count total results for pagination
    const countResult = await query.execute()
    const total = countResult.length

    // Apply sorting
    if (sort) {
      const { field, direction } = sort
      query = query.orderBy(listings[field], direction)
    } else {
      // Default sort by creation date, newest first
      query = query.orderBy(listings.createdAt, "desc")
    }

    // Apply pagination
    if (pagination) {
      const { page, limit } = pagination
      const offset = (page - 1) * limit
      query = query.limit(limit).offset(offset)
    }

    const result = await query.execute()

    return { listings: result, total }
  } catch (error) {
    console.error("Error getting listings:", error)
    throw new Error("Failed to get listings")
  }
}

// Get featured listings
export const getFeaturedListings = async (limit = 8): Promise<SelectListing[]> => {
  try {
    const featuredListings = await db
      .select()
      .from(listings)
      .where(eq(listings.isFeatured, true))
      .limit(limit)
      .execute()

    return featuredListings
  } catch (error) {
    console.error("Error getting featured listings:", error)
    throw new Error("Failed to get featured listings")
  }
}

// Get listings by seller ID
export const getListingsBySellerId = async (sellerId: string): Promise<SelectListing[]> => {
  try {
    const sellerListings = await db.select().from(listings).where(eq(listings.sellerId, sellerId)).execute()

    return sellerListings
  } catch (error) {
    console.error("Error getting listings by seller ID:", error)
    throw new Error("Failed to get listings by seller ID")
  }
}

// Update listing
export const updateListing = async (id: string, data: Partial<InsertListing>): Promise<SelectListing> => {
  try {
    const [updatedListing] = await db.update(listings).set(data).where(eq(listings.id, id)).returning()

    return updatedListing
  } catch (error) {
    console.error("Error updating listing:", error)
    throw new Error("Failed to update listing")
  }
}

// Update listing status
export const updateListingStatus = async (id: string, status: string): Promise<SelectListing> => {
  try {
    const [updatedListing] = await db.update(listings).set({ status }).where(eq(listings.id, id)).returning()

    return updatedListing
  } catch (error) {
    console.error("Error updating listing status:", error)
    throw new Error("Failed to update listing status")
  }
}

// Delete listing
export const deleteListing = async (id: string): Promise<void> => {
  try {
    await db.delete(listings).where(eq(listings.id, id))
  } catch (error) {
    console.error("Error deleting listing:", error)
    throw new Error("Failed to delete listing")
  }
}

// Increment watchers count
export const incrementWatchers = async (id: string): Promise<void> => {
  try {
    const listing = await getListingById(id)

    if (listing) {
      await db
        .update(listings)
        .set({ watchers: listing.watchers + 1 })
        .where(eq(listings.id, id))
    }
  } catch (error) {
    console.error("Error incrementing watchers:", error)
    throw new Error("Failed to increment watchers")
  }
}

// Decrement watchers count
export const decrementWatchers = async (id: string): Promise<void> => {
  try {
    const listing = await getListingById(id)

    if (listing && listing.watchers > 0) {
      await db
        .update(listings)
        .set({ watchers: listing.watchers - 1 })
        .where(eq(listings.id, id))
    }
  } catch (error) {
    console.error("Error decrementing watchers:", error)
    throw new Error("Failed to decrement watchers")
  }
}

// Check if auction has ended
export const checkAuctionEnded = async (id: string): Promise<boolean> => {
  try {
    const listing = await getListingById(id)

    if (!listing) {
      throw new Error("Listing not found")
    }

    const now = new Date()

    if (now > listing.endDate && listing.status === "active") {
      // Update listing status to ended
      await updateListingStatus(id, "ended")

      // If there are bids and the highest bid is greater than or equal to reserve price
      if (listing.bids > 0 && (!listing.reservePrice || listing.currentBid >= listing.reservePrice)) {
        // Get the highest bid
        const highestBid = await db.query.bids.findFirst({
          where: eq(bids.listingId, id),
          orderBy: (bids, { desc }) => [desc(bids.amount)],
        })

        if (highestBid) {
          // Update listing status to sold
          await db
            .update(listings)
            .set({
              status: "sold",
              winningBidderId: highestBid.bidderId,
            })
            .where(eq(listings.id, id))

          // Update bid status to won
          await db.update(bids).set({ status: "won" }).where(eq(bids.id, highestBid.id))
        }
      }

      return true
    }

    return false
  } catch (error) {
    console.error("Error checking if auction ended:", error)
    throw new Error("Failed to check if auction ended")
  }
}

