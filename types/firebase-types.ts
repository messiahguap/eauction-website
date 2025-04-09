/**
 * Shared Firebase data types
 */

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  created_at?: any;
  updated_at?: any;
  [key: string]: any;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  starting_bid: number;
  current_bid?: number;
  category: string;
  condition: string;
  images: string[];
  end_date: any;
  seller_id: string;
  seller_name?: string;
  status: string;
  bid_count: number;
  created_at: any;
  updated_at: any;
  is_premium?: boolean;
  is_featured?: boolean;
  [key: string]: any;
}

export interface Bid {
  id: string;
  amount: number;
  bidder_id: string;
  bidder_name?: string;
  listing_id: string;
  status: string;
  created_at: any;
  [key: string]: any;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  listing_id?: string;
  bid_id?: string;
  read: boolean;
  created_at: any;
  updated_at?: any;
  [key: string]: any;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
}

export interface ListingData {
  title: string;
  description: string;
  starting_bid: number;
  category: string;
  condition: string;
  images: string[];
  end_date: Date;
} 