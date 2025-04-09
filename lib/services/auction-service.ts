import { db, storage } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  Timestamp,
  increment,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Collection names
const LISTINGS_COLLECTION = 'listings';
const BIDS_COLLECTION = 'bids';
const USERS_COLLECTION = 'users';

// Types
export interface Listing {
  id?: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  imageUrls: string[];
  category: string;
  condition: string;
  sellerId: string;
  sellerName: string;
  status: 'active' | 'ended' | 'sold' | 'draft';
  endDate: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  location: string;
  bidCount: number;
}

export interface Bid {
  id?: string;
  listingId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  createdAt?: Timestamp;
  isWinning?: boolean;
}

export interface ListingsQueryParams {
  category?: string;
  status?: 'active' | 'ended' | 'sold' | 'draft';
  sellerId?: string;
  sortBy?: 'createdAt' | 'endDate' | 'currentPrice';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  startAfter?: DocumentSnapshot;
}

// Listings service
export const listingsService = {
  // Create a new listing
  async createListing(listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'currentPrice' | 'bidCount'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, LISTINGS_COLLECTION), {
        ...listing,
        currentPrice: listing.startingPrice,
        bidCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  },

  // Upload listing images and return URLs
  async uploadListingImages(listingId: string, files: File[]): Promise<string[]> {
    try {
      const imageUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `listings/${listingId}/${Date.now()}-${file.name}`;
        const storageRef = ref(storage, filePath);
        
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        imageUrls.push(downloadUrl);
      }
      
      return imageUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  // Get listing by ID
  async getListingById(id: string): Promise<Listing | null> {
    try {
      const docRef = doc(db, LISTINGS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Listing;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting listing:', error);
      throw error;
    }
  },

  // Get listings with filters
  async getListings(params: ListingsQueryParams = {}): Promise<{
    listings: Listing[];
    lastVisible: DocumentSnapshot | null;
  }> {
    try {
      const queryConstraints = [];
      
      // Add filters
      if (params.category) {
        queryConstraints.push(where('category', '==', params.category));
      }
      
      if (params.status) {
        queryConstraints.push(where('status', '==', params.status));
      }
      
      if (params.sellerId) {
        queryConstraints.push(where('sellerId', '==', params.sellerId));
      }
      
      // Add sorting
      const sortBy = params.sortBy || 'createdAt';
      const sortDirection = params.sortDirection || 'desc';
      queryConstraints.push(orderBy(sortBy, sortDirection));
      
      // Add pagination
      const limitCount = params.limit || 10;
      queryConstraints.push(limit(limitCount));
      
      // Start after for pagination
      if (params.startAfter) {
        queryConstraints.push(startAfter(params.startAfter));
      }
      
      const q = query(collection(db, LISTINGS_COLLECTION), ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      const listings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Listing[];
      
      const lastVisible = querySnapshot.docs.length > 0 
        ? querySnapshot.docs[querySnapshot.docs.length - 1] 
        : null;
      
      return {
        listings,
        lastVisible
      };
    } catch (error) {
      console.error('Error getting listings:', error);
      throw error;
    }
  },

  // Update a listing
  async updateListing(id: string, data: Partial<Listing>): Promise<void> {
    try {
      const docRef = doc(db, LISTINGS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  },

  // Delete a listing and its images
  async deleteListing(id: string): Promise<void> {
    try {
      // Get the listing to get image URLs
      const listing = await this.getListingById(id);
      
      if (listing && listing.imageUrls) {
        // Delete images from storage
        for (const imageUrl of listing.imageUrls) {
          try {
            // Extract the path from the URL
            const storageRef = ref(storage, imageUrl);
            await deleteObject(storageRef);
          } catch (imageError) {
            console.error('Error deleting image:', imageError);
            // Continue even if image deletion fails
          }
        }
      }
      
      // Delete the listing document
      const docRef = doc(db, LISTINGS_COLLECTION, id);
      await deleteDoc(docRef);
      
      // TODO: Also delete all bids for this listing?
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  },

  // Place a bid on a listing
  async placeBid(bid: Omit<Bid, 'id' | 'createdAt' | 'isWinning'>): Promise<string> {
    try {
      // Get the current listing
      const listing = await this.getListingById(bid.listingId);
      
      if (!listing) {
        throw new Error('Listing not found');
      }
      
      if (listing.status !== 'active') {
        throw new Error('Auction is not active');
      }
      
      if (listing.endDate.toMillis() < Date.now()) {
        throw new Error('Auction has ended');
      }
      
      if (bid.amount <= listing.currentPrice) {
        throw new Error('Bid must be higher than the current price');
      }
      
      // Add the bid
      const bidRef = await addDoc(collection(db, BIDS_COLLECTION), {
        ...bid,
        createdAt: serverTimestamp(),
        isWinning: true
      });
      
      // Update the listing with the new price
      await updateDoc(doc(db, LISTINGS_COLLECTION, bid.listingId), {
        currentPrice: bid.amount,
        bidCount: increment(1),
        updatedAt: serverTimestamp()
      });
      
      // Update previous winning bid if exists
      const prevWinningBidsQuery = query(
        collection(db, BIDS_COLLECTION),
        where('listingId', '==', bid.listingId),
        where('isWinning', '==', true),
        where('amount', '<', bid.amount)
      );
      
      const prevWinningBids = await getDocs(prevWinningBidsQuery);
      
      for (const prevBidDoc of prevWinningBids.docs) {
        if (prevBidDoc.id !== bidRef.id) {
          await updateDoc(doc(db, BIDS_COLLECTION, prevBidDoc.id), {
            isWinning: false
          });
        }
      }
      
      return bidRef.id;
    } catch (error) {
      console.error('Error placing bid:', error);
      throw error;
    }
  },

  // Get bids for a listing
  async getListingBids(listingId: string): Promise<Bid[]> {
    try {
      const q = query(
        collection(db, BIDS_COLLECTION),
        where('listingId', '==', listingId),
        orderBy('amount', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Bid[];
    } catch (error) {
      console.error('Error getting bids:', error);
      throw error;
    }
  },

  // End an auction and declare a winner
  async endAuction(listingId: string): Promise<void> {
    try {
      const listing = await this.getListingById(listingId);
      
      if (!listing) {
        throw new Error('Listing not found');
      }
      
      if (listing.status !== 'active') {
        throw new Error('Auction is not active');
      }
      
      // Get the winning bid
      const q = query(
        collection(db, BIDS_COLLECTION),
        where('listingId', '==', listingId),
        where('isWinning', '==', true),
        limit(1)
      );
      
      const winningBidSnapshot = await getDocs(q);
      
      if (winningBidSnapshot.empty) {
        // No bids, just end the auction
        await updateDoc(doc(db, LISTINGS_COLLECTION, listingId), {
          status: 'ended',
          updatedAt: serverTimestamp()
        });
      } else {
        // Has winning bid, mark as sold
        await updateDoc(doc(db, LISTINGS_COLLECTION, listingId), {
          status: 'sold',
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error ending auction:', error);
      throw error;
    }
  },

  // Get user's bids
  async getUserBids(userId: string): Promise<{
    bid: Bid;
    listing: Listing;
  }[]> {
    try {
      const q = query(
        collection(db, BIDS_COLLECTION),
        where('bidderId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const bids = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Bid[];
      
      // Get listings for each bid
      const result = await Promise.all(bids.map(async (bid) => {
        const listing = await this.getListingById(bid.listingId);
        return {
          bid,
          listing: listing!
        };
      }));
      
      return result.filter(item => item.listing !== null);
    } catch (error) {
      console.error('Error getting user bids:', error);
      throw error;
    }
  }
}; 