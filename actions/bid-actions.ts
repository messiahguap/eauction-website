"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { getServerAuth, getServerFirestore } from "@/lib/server"
import { FieldValue } from "firebase-admin/firestore"
import { User, Listing, Bid } from "@/types/firebase-types"

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

export async function placeBid(listingId: string, amount: number) {
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

    // Check if the listing is active
    if (listing.status !== "active") {
      return {
        error: "This auction has ended"
      }
    }

    // Check if the user is the seller
    if (listing.seller_id === user.id) {
      return {
        error: "You cannot bid on your own listing"
      }
    }

    // Check if the bid amount is valid
    if (amount <= (listing.current_bid || listing.starting_bid)) {
      return {
        error: "Your bid must be higher than the current bid"
      }
    }

    // Use a transaction to ensure data consistency
    const result = await db.runTransaction(async (transaction) => {
      // Mark all previous active bids as outbid
      const activeBidsQuery = db.collection("bids")
        .where("listing_id", "==", listingId)
        .where("status", "==", "active")
      
      const activeBidsSnapshot = await transaction.get(activeBidsQuery)
      
      const outbidUserIds = new Set<string>()
      
      activeBidsSnapshot.forEach(doc => {
        const bidData = doc.data()
        if (bidData.bidder_id !== user.id) {
          outbidUserIds.add(bidData.bidder_id)
        }
        transaction.update(doc.ref, { 
          status: "outbid",
          updated_at: FieldValue.serverTimestamp()
        })
      })

    // Create the new bid
      const newBidRef = db.collection("bids").doc()
      const bidData = {
        amount,
        bidder_id: user.id,
        bidder_name: user.displayName || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Anonymous',
        listing_id: listingId,
        status: "active",
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp()
      }
      
      transaction.set(newBidRef, bidData)

    // Update the listing with the new current bid
      transaction.update(listingRef, {
        current_bid: amount,
        bid_count: FieldValue.increment(1),
        updated_at: FieldValue.serverTimestamp()
      })

    // Create a notification for the seller
      const sellerNotifRef = db.collection("notifications").doc()
      transaction.set(sellerNotifRef, {
      user_id: listing.seller_id,
      type: "bid",
      message: `New bid of $${amount} on your listing "${listing.title}"`,
      listing_id: listingId,
        read: false,
        created_at: FieldValue.serverTimestamp()
    })

    // Create notifications for outbid users
      for (const outbidUserId of outbidUserIds) {
        const outbidNotifRef = db.collection("notifications").doc()
        transaction.set(outbidNotifRef, {
          user_id: outbidUserId,
        type: "outbid",
        message: `You have been outbid on "${listing.title}"`,
        listing_id: listingId,
          read: false,
          created_at: FieldValue.serverTimestamp()
        })
      }
      
      return {
        bid: {
          id: newBidRef.id,
          ...bidData
        }
      }
    })

    revalidatePath(`/listings/${listingId}`)

    return {
      success: true,
      bid: result.bid
    }
  } catch (error: any) {
    console.error("Place bid error:", error)
    return {
      error: error.message || "An unexpected error occurred"
    }
  }
}

export async function getMyBids() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Not authenticated",
        bids: []
      }
    }

    // Get all bids by the current user
    const bidsQuery = db.collection("bids")
      .where("bidder_id", "==", user.id)
      .orderBy("created_at", "desc")
    
    const bidsSnapshot = await bidsQuery.get()
    
    // Array to hold the results
    const bids = []
    
    // For each bid, get the associated listing
    for (const bidDoc of bidsSnapshot.docs) {
      const bid = {
        id: bidDoc.id,
        ...bidDoc.data()
      } as Bid
      
      // Get the listing
      const listingRef = db.collection("listings").doc(bid.listing_id)
      const listingDoc = await listingRef.get()
      
      if (listingDoc.exists) {
        const listing = {
          id: listingDoc.id,
          ...listingDoc.data()
        } as Listing
        
        bids.push({
          ...bid,
          listing
        })
      }
    }

    return {
      bids
    }
  } catch (error: any) {
    console.error("Get my bids error:", error)
    return {
      error: error.message || "An unexpected error occurred",
      bids: []
    }
  }
}

export async function getWinningBids() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Not authenticated",
        bids: []
      }
    }

    // Find listings that have ended and user has winning bid
    // First, get all active bids by user
    const bidsQuery = db.collection("bids")
      .where("bidder_id", "==", user.id)
      .where("status", "==", "active")
    
    const bidsSnapshot = await bidsQuery.get()
    
    // Array to hold the results
    const winningBids = []
    
    // For each active bid, check if the listing has ended
    for (const bidDoc of bidsSnapshot.docs) {
      const bid = {
        id: bidDoc.id,
        ...bidDoc.data()
      } as Bid
      
      // Get the listing
      const listingRef = db.collection("listings").doc(bid.listing_id)
      const listingDoc = await listingRef.get()
      
      if (listingDoc.exists) {
        const listing = {
          id: listingDoc.id,
          ...listingDoc.data()
        } as Listing
        
        // Check if listing has ended and user won
        const now = new Date()
        const endDate = listing.end_date?.toDate ? listing.end_date.toDate() : new Date(listing.end_date)
        
        if (endDate < now && listing.current_bid === bid.amount) {
          // Get seller info
          const sellerRef = db.collection("users").doc(listing.seller_id)
          const sellerDoc = await sellerRef.get()
          
          if (sellerDoc.exists) {
            const seller = {
              id: sellerDoc.id,
              ...sellerDoc.data()
            } as User
            
            winningBids.push({
              ...listing,
              seller,
              winning_bid: bid
            })
          }
        }
      }
    }

    return {
      bids: winningBids
    }
  } catch (error: any) {
    console.error("Get winning bids error:", error)
    return {
      error: error.message || "An unexpected error occurred",
      bids: []
    }
  }
}

export async function getActiveBids() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Not authenticated",
        bids: []
      }
    }

    // Get all active bids by the current user
    const bidsQuery = db.collection("bids")
      .where("bidder_id", "==", user.id)
      .where("status", "==", "active")
      .orderBy("created_at", "desc")
    
    const bidsSnapshot = await bidsQuery.get()
    
    // Array to hold the results
    const bids = []
    
    // For each bid, get the associated listing
    for (const bidDoc of bidsSnapshot.docs) {
      const bid = {
        id: bidDoc.id,
        ...bidDoc.data()
      } as Bid
      
      // Get the listing
      const listingRef = db.collection("listings").doc(bid.listing_id)
      const listingDoc = await listingRef.get()
      
      if (listingDoc.exists) {
        const listing = {
          id: listingDoc.id,
          ...listingDoc.data()
        } as Listing
        
        bids.push({
          ...bid,
          listing
        })
      }
    }

    return {
      bids
    }
  } catch (error: any) {
    console.error("Get active bids error:", error)
    return {
      error: error.message || "An unexpected error occurred",
      bids: []
    }
  }
}

export async function withdrawBid(bidId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Not authenticated"
      }
    }

    // Get the bid
    const bidRef = db.collection("bids").doc(bidId)
    const bidDoc = await bidRef.get()
    
    if (!bidDoc.exists) {
      return {
        error: "Bid not found"
      }
    }
    
    const bid = {
      id: bidDoc.id,
      ...bidDoc.data()
    } as Bid

    // Check if the user is the bidder
    if (bid.bidder_id !== user.id) {
      return {
        error: "You are not authorized to withdraw this bid"
      }
    }

    // Check if the bid is active
    if (bid.status !== "active") {
      return {
        error: "This bid cannot be withdrawn"
      }
    }

    // Get the listing
    const listingRef = db.collection("listings").doc(bid.listing_id)
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

    // Check if the listing is active
    if (listing.status !== "active") {
      return {
        error: "Cannot withdraw bid on a listing that has ended"
      }
    }

    // Use a transaction to ensure data consistency
    await db.runTransaction(async (transaction) => {
      // Update the bid status
      transaction.update(bidRef, {
        status: "withdrawn",
        updated_at: FieldValue.serverTimestamp()
      })

      // If this was the highest bid, we need to find the next highest bid
      if (listing.current_bid === bid.amount) {
        // Find the next highest active bid
        const nextBidQuery = db.collection("bids")
          .where("listing_id", "==", bid.listing_id)
          .where("status", "==", "outbid")
          .orderBy("amount", "desc")
          .limit(1)
        
        const nextBidSnapshot = await transaction.get(nextBidQuery)
        
        if (!nextBidSnapshot.empty) {
          // Set the next highest bid as the active bid
          const nextBid = nextBidSnapshot.docs[0]
          const nextBidData = nextBid.data()
          
          transaction.update(nextBid.ref, {
            status: "active",
            updated_at: FieldValue.serverTimestamp()
          })
          
          // Update the listing with the new current bid
          transaction.update(listingRef, {
            current_bid: nextBidData.amount,
            updated_at: FieldValue.serverTimestamp()
          })
          
          // Create a notification for the new highest bidder
          const notifRef = db.collection("notifications").doc()
          transaction.set(notifRef, {
            user_id: nextBidData.bidder_id,
            type: "highest_bid",
            message: `You are now the highest bidder on "${listing.title}"`,
            listing_id: bid.listing_id,
            read: false,
            created_at: FieldValue.serverTimestamp()
          })
        } else {
          // No other bids, revert to starting bid
          transaction.update(listingRef, {
            current_bid: null,
            updated_at: FieldValue.serverTimestamp()
          })
        }
      }

      // Create a notification for the seller
      const sellerNotifRef = db.collection("notifications").doc()
      transaction.set(sellerNotifRef, {
        user_id: listing.seller_id,
        type: "bid_withdrawn",
        message: `A bid of $${bid.amount} on your listing "${listing.title}" has been withdrawn`,
        listing_id: bid.listing_id,
        read: false,
        created_at: FieldValue.serverTimestamp()
      })
    })

    revalidatePath(`/listings/${bid.listing_id}`)
    revalidatePath("/my-bids")

    return {
      success: true
    }
  } catch (error: any) {
    console.error("Withdraw bid error:", error)
    return {
      error: error.message || "An unexpected error occurred"
    }
  }
} 