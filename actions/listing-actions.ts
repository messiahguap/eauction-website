"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { getServerAuth, getServerFirestore } from "@/lib/server"
import { Listing, User, ListingData } from "@/types/firebase-types"
import { FieldValue } from "firebase-admin/firestore"

// Get Firestore instance
const db = getServerFirestore()

// Get the currently logged-in user from cookies
async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies()
  const token = cookieStore.get("firebase-token")?.value
  
  if (!token) {
    return null
  }
  
  try {
    const auth = getServerAuth()
    const decodedToken = await auth.verifyIdToken(token)
    
    // Get user profile from Firestore
    const userDocRef = db.collection('users').doc(decodedToken.uid)
    const userDoc = await userDocRef.get()
    
    if (!userDoc.exists) {
      return null
    }
    
      return {
      id: userDoc.id,
      ...userDoc.data()
    } as User
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}

export async function createListing(data: ListingData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Not authenticated"
      }
    }

    // Validate the required fields
    if (!data.title || !data.description || !data.starting_bid || !data.category || !data.end_date) {
      return {
        error: "Missing required fields"
      }
    }

    // Ensure at least one image
    if (!data.images || data.images.length === 0) {
      return {
        error: "At least one image is required"
      }
    }

    // Make sure end date is in the future
    const now = new Date()
    const endDate = new Date(data.end_date)
    if (endDate <= now) {
      return {
        error: "End date must be in the future"
      }
    }

    // Create the listing
    const listingRef = db.collection("listings").doc()
    await listingRef.set({
      ...data,
        seller_id: user.id,
      seller_name: user.displayName || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Anonymous',
      status: "active",
      bid_count: 0,
      is_featured: false,
      is_premium: false,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp()
    })

    // Create a notification for the user
    const notifRef = db.collection("notifications").doc()
    await notifRef.set({
      user_id: user.id,
      type: "listing_created",
      message: `Your listing for "${data.title}" has been created`,
      listing_id: listingRef.id,
      read: false,
      created_at: FieldValue.serverTimestamp()
    })

    revalidatePath("/my-listings")

    return {
      success: true,
      listingId: listingRef.id
    }
  } catch (error: any) {
    console.error("Create listing error:", error)
    return {
      error: error.message || "An unexpected error occurred"
    }
  }
}

export async function updateListing(listingId: string, data: Partial<ListingData>) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Not authenticated"
      }
    }

    // Get the listing
    const listingRef = db.collection("listings").doc(listingId)
    const listingDoc = await listingRef.get()
    
    if (!listingDoc.exists) {
      return {
        error: "Listing not found"
      }
    }
    
    const listing = {
      id: listingDoc.id,
      ...listingDoc.data()
    } as Listing

    // Check if the user is the seller
    if (listing.seller_id !== user.id) {
      return {
        error: "You are not authorized to update this listing"
      }
    }

    // Check if the listing is active
    if (listing.status !== "active") {
      return {
        error: "Cannot update a listing that has ended"
      }
    }

    // If end date is being updated, make sure it's in the future
    if (data.end_date) {
      const now = new Date()
      const endDate = new Date(data.end_date)
      if (endDate <= now) {
        return {
          error: "End date must be in the future"
        }
      }
    }

    // Update the listing
    await listingRef.update({
      ...data,
      updated_at: FieldValue.serverTimestamp()
    })

    revalidatePath(`/listings/${listingId}`)
    revalidatePath("/my-listings")

    return {
      success: true
    }
  } catch (error: any) {
    console.error("Update listing error:", error)
    return {
      error: error.message || "An unexpected error occurred"
    }
  }
}

export async function deleteListing(listingId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Not authenticated"
      }
    }

    // Get the listing
    const listingRef = db.collection("listings").doc(listingId)
    const listingDoc = await listingRef.get()
    
    if (!listingDoc.exists) {
      return {
        error: "Listing not found"
      }
    }
    
    const listing = {
      id: listingDoc.id,
      ...listingDoc.data()
    } as Listing

    // Check if the user is the seller
    if (listing.seller_id !== user.id) {
      return {
        error: "You are not authorized to delete this listing"
      }
    }

    // Check if there are any bids on the listing
    const bidsQuery = db.collection("bids")
      .where("listing_id", "==", listingId)
      .limit(1)
    
    const bidsSnapshot = await bidsQuery.get()
    
    if (!bidsSnapshot.empty) {
      return {
        error: "Cannot delete a listing with bids"
      }
    }

    // Delete the listing
    await listingRef.delete()

    revalidatePath("/my-listings")

    return {
      success: true
    }
  } catch (error: any) {
    console.error("Delete listing error:", error)
    return {
      error: error.message || "An unexpected error occurred"
    }
  }
}

export async function getMyListings() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Not authenticated",
        listings: []
      }
    }

    // Get all listings by the current user
    const listingsQuery = db.collection("listings")
      .where("seller_id", "==", user.id)
      .orderBy("created_at", "desc")
    
    const listingsSnapshot = await listingsQuery.get()
    
    const listings = listingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Listing[]

      return {
      listings
    }
  } catch (error: any) {
    console.error("Get my listings error:", error)
    return {
      error: error.message || "An unexpected error occurred",
      listings: []
    }
  }
}

export async function getListingById(listingId: string) {
  try {
    // Get the listing
    const listingRef = db.collection("listings").doc(listingId)
    const listingDoc = await listingRef.get()
    
    if (!listingDoc.exists) {
      return {
        error: "Listing not found"
      }
    }
    
    const listing = {
      id: listingDoc.id,
      ...listingDoc.data()
    } as Listing

    // Get the seller info
    const sellerRef = db.collection("users").doc(listing.seller_id)
    const sellerDoc = await sellerRef.get()
    
    let seller = null
    if (sellerDoc.exists) {
      seller = {
        id: sellerDoc.id,
        ...sellerDoc.data()
      } as User
    }

    // Get the bids for this listing
    const bidsQuery = db.collection("bids")
      .where("listing_id", "==", listingId)
      .orderBy("created_at", "desc")
    
    const bidsSnapshot = await bidsQuery.get()
    
    const bids = bidsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      listing,
      seller,
      bids
    }
  } catch (error: any) {
    console.error("Get listing error:", error)
    return {
      error: error.message || "An unexpected error occurred"
    }
  }
}

export async function getFeaturedListings(limit = 6) {
  try {
    // Get active listings, sorted by recency
    const listingsQuery = db.collection("listings")
      .where("status", "==", "active")
      .orderBy("created_at", "desc")
      .limit(limit)

    const listingsSnapshot = await listingsQuery.get()
    
    const listings = listingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Listing[]

    return {
      listings
    }
  } catch (error: any) {
    console.error("Get featured listings error:", error)
    return {
      error: error.message || "An unexpected error occurred",
      listings: []
    }
  }
}

export async function getRecentListings(limit = 12) {
  try {
    // Get active listings, sorted by recency
    const listingsQuery = db.collection("listings")
      .where("status", "==", "active")
      .orderBy("created_at", "desc")
      .limit(limit)
    
    const listingsSnapshot = await listingsQuery.get()
    
    const listings = listingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Listing[]

    return {
      listings
    }
  } catch (error: any) {
    console.error("Get recent listings error:", error)
    return {
      error: error.message || "An unexpected error occurred",
      listings: []
    }
  }
}

export async function getListingsByCategory(category: string, limit = 12) {
  try {
    // Get active listings from specific category
    const listingsQuery = db.collection("listings")
      .where("status", "==", "active")
      .where("category", "==", category)
      .orderBy("created_at", "desc")
      .limit(limit)
    
    const listingsSnapshot = await listingsQuery.get()
    
    const listings = listingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Listing[]

    return {
      listings
    }
  } catch (error: any) {
    console.error(`Get listings by category (${category}) error:`, error)
      return {
      error: error.message || "An unexpected error occurred",
      listings: []
    }
  }
}

export async function searchListings(query: string, category?: string, sort = "newest") {
  try {
    // Start with a base query
    let listingsQuery = db.collection("listings")
      .where("status", "==", "active")
    
    // Add category filter if specified
    if (category && category !== "all") {
      listingsQuery = listingsQuery.where("category", "==", category)
    }
    
    // Add sort order
    if (sort === "newest") {
      listingsQuery = listingsQuery.orderBy("created_at", "desc")
    } else if (sort === "oldest") {
      listingsQuery = listingsQuery.orderBy("created_at", "asc")
    } else if (sort === "price_high") {
      listingsQuery = listingsQuery.orderBy("starting_bid", "desc")
    } else if (sort === "price_low") {
      listingsQuery = listingsQuery.orderBy("starting_bid", "asc")
    }
    
    const listingsSnapshot = await listingsQuery.get()
    
    // Filter results by title/description if query is provided
    let listings = listingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Listing[]
    
    if (query) {
      const lowerQuery = query.toLowerCase()
      listings = listings.filter(listing => 
        listing.title.toLowerCase().includes(lowerQuery) || 
        listing.description.toLowerCase().includes(lowerQuery)
      )
    }

    return {
      listings
    }
  } catch (error: any) {
    console.error("Search listings error:", error)
    return {
      error: error.message || "An unexpected error occurred",
      listings: []
    }
  }
}

export async function promoteListing(listingId: string, promotionType: 'featured' | 'premium') {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Not authenticated"
      }
    }

    // Get the listing
    const listingRef = db.collection("listings").doc(listingId)
    const listingDoc = await listingRef.get()
    
    if (!listingDoc.exists) {
      return {
        error: "Listing not found"
      }
    }
    
    const listing = {
      id: listingDoc.id,
      ...listingDoc.data()
    } as Listing

    // Check if the user is the seller
    if (listing.seller_id !== user.id) {
      return {
        error: "You are not authorized to promote this listing"
      }
    }

    // Check if the listing is active
    if (listing.status !== "active") {
      return {
        error: "Cannot promote a listing that has ended"
      }
    }

    // Update the promotion status
    const updateData: Record<string, any> = {
      updated_at: FieldValue.serverTimestamp()
    }

    if (promotionType === 'featured') {
      updateData.is_featured = true
    } else if (promotionType === 'premium') {
      updateData.is_premium = true
    }

    // Update the listing
    await listingRef.update(updateData)

    revalidatePath(`/listings/${listingId}`)
    revalidatePath("/my-listings")

    return {
      success: true
    }
  } catch (error: any) {
    console.error("Promote listing error:", error)
    return {
      error: error.message || "An unexpected error occurred"
    }
  }
}