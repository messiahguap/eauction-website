export type ActionState = {
  status: "success" | "error"
  message: string
  data?: any
}

export type UserData = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type LoginData = {
  email: string
  password: string
}

export type ListingData = {
  title: string
  description: string
  category: string
  subcategory: string
  condition: string
  startingBid: number
  reservePrice?: number
  buyNowPrice?: number
  images: string[]
  features?: string[]
  location: string
  duration: number
  isPremium?: boolean
  isFeatured?: boolean
  hasBoldTitle?: boolean
  isHighlighted?: boolean
  shippingOptions?: string[]
}

export type BidData = {
  amount: number
  listingId: string
}

export type MessageData = {
  receiverId: string
  listingId: string
  content: string
  attachments?: any[]
}

