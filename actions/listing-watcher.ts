"use server"

import { getServerAuth, getServerFirestore } from "@/lib/server"
import { FieldValue } from "firebase-admin/firestore"
import { Listing, Bid, User } from "@/types/firebase-types"
import { getAuthToken } from "./auth-actions"

// Get Firestore instance
const db = getServerFirestore()

// Check for ended auctions and process them
export async function processEndedAuctions() {
  try {
    const now = new Date()
    
    // Find all active listings that have ended
    const listingsQuery = db.collection("listings")
      .where("status", "==", "active")
      .where("end_date", "<=", now)
      .limit(100) // Process in batches
    
    const listingsSnapshot = await listingsQuery.get()
    
    if (listingsSnapshot.empty) {
      return {
        success: true,
        processed: 0
      }
    }
    
    let processed = 0
    
    // Process each ended auction
    for (const listingDoc of listingsSnapshot.docs) {
      const listing = {
        id: listingDoc.id,
        ...listingDoc.data()
      } as Listing
      
      // Use a transaction to ensure data consistency
      await db.runTransaction(async (transaction) => {
        // Update the listing status
        transaction.update(listingDoc.ref, {
          status: "ended",
          updated_at: FieldValue.serverTimestamp()
        })
        
        // If there's a winning bid, notify the winner and seller
        if (listing.current_bid) {
          // Find the winning bid
          const winningBidQuery = db.collection("bids")
            .where("listing_id", "==", listing.id)
            .where("status", "==", "active")
            .where("amount", "==", listing.current_bid)
            .limit(1)
          
          const winningBidSnapshot = await transaction.get(winningBidQuery)
          
          if (!winningBidSnapshot.empty) {
            const winningBid = {
              id: winningBidSnapshot.docs[0].id,
              ...winningBidSnapshot.docs[0].data()
            } as Bid
            
            // Notify the winner
            const winnerNotifRef = db.collection("notifications").doc()
            transaction.set(winnerNotifRef, {
              user_id: winningBid.bidder_id,
              type: "auction_won",
              message: `Congratulations! You won the auction for "${listing.title}" with a bid of $${winningBid.amount}`,
              listing_id: listing.id,
              bid_id: winningBid.id,
              read: false,
              created_at: FieldValue.serverTimestamp()
            })
            
            // Notify the seller
            const sellerNotifRef = db.collection("notifications").doc()
            transaction.set(sellerNotifRef, {
              user_id: listing.seller_id,
              type: "auction_ended",
              message: `Your auction for "${listing.title}" has ended with a winning bid of $${winningBid.amount}`,
              listing_id: listing.id,
              bid_id: winningBid.id,
              read: false,
              created_at: FieldValue.serverTimestamp()
            })
          }
        } else {
          // No sellerNotifRef, notify the seller
          const sellerNotifRef = db.collection("notifications").doc()
          transaction.set(sellerNotifRef, {
            user_id: listing.seller_id,
            type: "auction_ended_no_bids",
            message: `Your auction for "${listing.title}" has ended without any bids`,
            listing_id: listing.id,
            read: false,
            created_at: FieldValue.serverTimestamp()
          })
        }
      })
      
      processed++
    }
    
    return {
      success: true,
      processed
    }
  } catch (error: any) {
    console.error("Process ended auctions error:", error)
    return {
      error: error.message || "An unexpected error occurred",
      processed: 0
    }
  }
}

// Manually end an auction (admin or seller only)
export async function endAuction(listingId: string) {
  try {
    // Get the current user from cookies
    const auth = getServerAuth()
    const token = await getAuthToken()
    
    if (!token) {
      return {
        error: "Not authenticated"
      }
    }
    
    // Verify the token and get the user
    const decodedToken = await auth.verifyIdToken(token)
    
    if (!decodedToken) {
      return {
        error: "Invalid authentication"
      }
    }
    
    // Get user profile from Firestore
    const userDoc = await db.collection("users").doc(decodedToken.uid).get()
    
    if (!userDoc.exists) {
      return {
        error: "User profile not found"
      }
    }
    
    const currentUser = {
      uid: decodedToken.uid,
      ...userDoc.data()
    } as User
    
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
    
    // Check if the user is the seller or an admin
    if (listing.seller_id !== currentUser.uid && !currentUser.is_admin) {
      return {
        error: "You are not authorized to end this auction"
      }
    }
    
    // Check if the listing is already ended
    if (listing.status !== "active") {
      return {
        error: "This auction has already ended"
      }
    }
    
    // Use a transaction to ensure data consistency
    await db.runTransaction(async (transaction) => {
      // Update the listing status
      transaction.update(listingRef, {
        status: "ended",
        updated_at: FieldValue.serverTimestamp()
      })
      
      // If there's a winning bid, notify the winner and seller
      if (listing.current_bid) {
        // Find the winning bid
        const winningBidQuery = db.collection("bids")
          .where("listing_id", "==", listing.id)
          .where("status", "==", "active")
          .where("amount", "==", listing.current_bid)
          .limit(1)
        
        const winningBidSnapshot = await transaction.get(winningBidQuery)
        
        if (!winningBidSnapshot.empty) {
          const winningBid = {
            id: winningBidSnapshot.docs[0].id,
            ...winningBidSnapshot.docs[0].data()
          } as Bid
          
          // Notify the winner
          const winnerNotifRef = db.collection("notifications").doc()
          transaction.set(winnerNotifRef, {
            user_id: winningBid.bidder_id,
            type: "auction_won",
            message: `Congratulations! You won the auction for "${listing.title}" with a bid of $${winningBid.amount}`,
            listing_id: listing.id,
            bid_id: winningBid.id,
            read: false,
            created_at: FieldValue.serverTimestamp()
          })
          
          // Notify the seller
          const sellerNotifRef = db.collection("notifications").doc()
          transaction.set(sellerNotifRef, {
            user_id: listing.seller_id,
            type: "auction_ended",
            message: `Your auction for "${listing.title}" has ended with a winning bid of $${winningBid.amount}`,
            listing_id: listing.id,
            bid_id: winningBid.id,
            read: false,
            created_at: FieldValue.serverTimestamp()
          })
        }
      } else {
        // No bids, notify the seller
        const sellerNotifRef = db.collection("notifications").doc()
        transaction.set(sellerNotifRef, {
          user_id: listing.seller_id,
          type: "auction_ended_no_bids",
          message: `Your auction for "${listing.title}" has ended without any bids`,
          listing_id: listing.id,
          read: false,
          created_at: FieldValue.serverTimestamp()
        })
      }
    })
    
    return {
      success: true
    }
  } catch (error: any) {
    console.error("End auction error:", error)
    return {
      error: error.message || "An unexpected error occurred"
    }
  }
}

// API endpoint for scheduled execution (can be called by cron jobs or other schedulers)
export async function processAuctionsApiHandler() {
  // Check for API key or other auth method if needed
  // This function can be exposed via a Next.js API route and called by a cron job service
  
  try {
    const result = await processEndedAuctions()
    return {
      status: 200,
      body: result
    }
  } catch (error: any) {
    console.error("API handler error:", error)
    return {
      status: 500,
      body: {
        error: error.message || "An unexpected error occurred"
      }
    }
  }
}

// Function to set up a simple interval-based auction watcher (for development)
// Note: For production, use a proper cron job service or cloud function
let watcherInterval: NodeJS.Timeout | null = null

export function startAuctionWatcher(intervalMinutes = 5) {
  // Clear any existing interval
  if (watcherInterval) {
    clearInterval(watcherInterval)
  }
  
  // Convert minutes to milliseconds
  const intervalMs = intervalMinutes * 60 * 1000
  
  // Set up the interval
  watcherInterval = setInterval(async () => {
    console.log(`[${new Date().toISOString()}] Running auction watcher...`)
    try {
      const result = await processEndedAuctions()
      console.log(`Auction watcher processed ${result.processed} listings`)
    } catch (error) {
      console.error("Error in auction watcher:", error)
    }
  }, intervalMs)
  
  console.log(`Auction watcher started with ${intervalMinutes} minute interval`)
  return true
}

export function stopAuctionWatcher() {
  if (watcherInterval) {
    clearInterval(watcherInterval)
    watcherInterval = null
    console.log("Auction watcher stopped")
    return true
  }
  return false
} 