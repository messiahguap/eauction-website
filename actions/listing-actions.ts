"use server"

import {
  createListing,
  deleteListing,
  getFeaturedListings,
  getListingById,
  getListings,
  getListingsBySellerId,
  updateListing,
} from "@/db/queries/listing-queries"
import type { ActionState, ListingData } from "@/types"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// Create listing action
export async function createListingAction(data: ListingData): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    // Calculate end date
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + data.duration)

    // Create listing
    const newListing = await createListing({
      title: data.title,
      description: data.description,
      category: data.category,
      subcategory: data.subcategory,
      condition: data.condition,
      startingBid: data.startingBid,
      currentBid: data.startingBid,
      reservePrice: data.reservePrice,
      buyNowPrice: data.buyNowPrice,
      images: data.images,
      features: data.features || [],
      location: data.location,
      duration: data.duration,
      endDate,
      sellerId: session.id,
      isPremium: data.isPremium || false,
      isFeatured: data.isFeatured || false,
      hasBoldTitle: data.hasBoldTitle || false,
      isHighlighted: data.isHighlighted || false,
      shippingOptions: data.shippingOptions || [],
    })

    revalidatePath("/listings")
    revalidatePath("/")

    return {
      status: "success",
      message: "Listing created successfully",
      data: newListing,
    }
  } catch (error) {
    console.error("Error creating listing:", error)
    return { status: "error", message: "Failed to create listing" }
  }
}

// Get listing by ID action
export async function getListingByIdAction(id: string): Promise<ActionState> {
  try {
    const listing = await getListingById(id)

    if (!listing) {
      return { status: "error", message: "Listing not found" }
    }

    return {
      status: "success",
      message: "Listing retrieved successfully",
      data: listing,
    }
  } catch (error) {
    console.error("Error getting listing:", error)
    return { status: "error", message: "Failed to get listing" }
  }
}

// Get listings action
export async function getListingsAction(filters?: any, sort?: any, pagination?: any): Promise<ActionState> {
  try {
    const { listings, total } = await getListings(filters, sort, pagination)

    return {
      status: "success",
      message: "Listings retrieved successfully",
      data: { listings, total },
    }
  } catch (error) {
    console.error("Error getting listings:", error)
    return { status: "error", message: "Failed to get listings" }
  }
}

// Get featured listings action
export async function getFeaturedListingsAction(limit = 8): Promise<ActionState> {
  try {
    const featuredListings = await getFeaturedListings(limit)

    return {
      status: "success",
      message: "Featured listings retrieved successfully",
      data: featuredListings,
    }
  } catch (error) {
    console.error("Error getting featured listings:", error)
    return { status: "error", message: "Failed to get featured listings" }
  }
}

// Get listings by seller ID action
export async function getListingsBySellerIdAction(sellerId: string): Promise<ActionState> {
  try {
    const sellerListings = await getListingsBySellerId(sellerId)

    return {
      status: "success",
      message: "Seller listings retrieved successfully",
      data: sellerListings,
    }
  } catch (error) {
    console.error("Error getting seller listings:", error)
    return { status: "error", message: "Failed to get seller listings" }
  }
}

// Get my listings action
export async function getMyListingsAction(): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    const myListings = await getListingsBySellerId(session.id)

    return {
      status: "success",
      message: "My listings retrieved successfully",
      data: myListings,
    }
  } catch (error) {
    console.error("Error getting my listings:", error)
    return { status: "error", message: "Failed to get my listings" }
  }
}

// Update listing action
export async function updateListingAction(id: string, data: Partial<ListingData>): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    // Get listing
    const listing = await getListingById(id)

    if (!listing) {
      return { status: "error", message: "Listing not found" }
    }

    // Check if user is the seller
    if (listing.sellerId !== session.id) {
      return { status: "error", message: "Not authorized to update this listing" }
    }

    // Update listing
    const updatedListing = await updateListing(id, data)

    revalidatePath(`/listings/${id}`)
    revalidatePath("/listings")
    revalidatePath("/dashboard")

    return {
      status: "success",
      message: "Listing updated successfully",
      data: updatedListing,
    }
  } catch (error) {
    console.error("Error updating listing:", error)
    return { status: "error", message: "Failed to update listing" }
  }
}

// Delete listing action
export async function deleteListingAction(id: string): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    // Get listing
    const listing = await getListingById(id)

    if (!listing) {
      return { status: "error", message: "Listing not found" }
    }

    // Check if user is the seller
    if (listing.sellerId !== session.id) {
      return { status: "error", message: "Not authorized to delete this listing" }
    }

    // Delete listing
    await deleteListing(id)

    revalidatePath("/listings")
    revalidatePath("/dashboard")

    return {
      status: "success",
      message: "Listing deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting listing:", error)
    return { status: "error", message: "Failed to delete listing" }
  }
}

