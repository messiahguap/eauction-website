export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface FirestoreData {
  users: {
    id: string
    auth_id: string
    first_name: string
    last_name: string
    email: string
    avatar: string | null
    phone: string | null
    location: string | null
    bio: string | null
    member_since: Date
    is_verified: boolean
    rating: number
    reviews: number
    user_mode: string
    created_at: Date
    updated_at: Date
  }
  listings: {
    id: string
    title: string
    description: string
    category: string
    subcategory: string
    condition: string
    starting_bid: number
    current_bid: number | null
    reserve_price: number | null
    buy_now_price: number | null
    images: Json
    features: Json | null
    location: string
    duration: number
    end_date: Date
    status: string
    seller_id: string
    winning_bidder_id: string | null
    views: number
    watchers: number
    bids: number
    is_premium: boolean
    is_featured: boolean
    has_bold_title: boolean
    is_highlighted: boolean
    shipping_options: Json | null
    created_at: Date
    updated_at: Date
  }
  bids: {
    id: string
    amount: number
    bidder_id: string
    listing_id: string
    status: string
    created_at: Date
    updated_at: Date
  }
  watchlist: {
    id: string
    user_id: string
    listing_id: string
    created_at: Date
    updated_at: Date
  }
  messages: {
    id: string
    sender_id: string
    receiver_id: string
    listing_id: string
    content: string
    attachments: Json | null
    is_read: boolean
    created_at: Date
    updated_at: Date
  }
  notifications: {
    id: string
    user_id: string
    type: string
    message: string
    is_read: boolean
    listing_id: string | null
    created_at: Date
    updated_at: Date
  }
  reviews: {
    id: string
    reviewer_id: string
    target_id: string
    listing_id: string
    rating: number
    comment: string
    created_at: Date
    updated_at: Date
  }
  transactions: {
    id: string
    listing_id: string
    buyer_id: string
    seller_id: string
    amount: number
    status: string
    payment_method: string
    shipping_address: string | null
    created_at: Date
    updated_at: Date
  }
}
