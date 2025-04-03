import { pgTable, text, timestamp, uuid, integer, boolean, jsonb } from "drizzle-orm/pg-core"
import { users } from "./users"

export const listings = pgTable("listings", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory").notNull(),
  condition: text("condition").notNull(),
  startingBid: integer("starting_bid").notNull(),
  currentBid: integer("current_bid"),
  reservePrice: integer("reserve_price"),
  buyNowPrice: integer("buy_now_price"),
  images: jsonb("images").notNull(),
  features: jsonb("features"),
  location: text("location").notNull(),
  duration: integer("duration").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").default("active").notNull(),
  sellerId: uuid("seller_id")
    .references(() => users.id)
    .notNull(),
  winningBidderId: uuid("winning_bidder_id").references(() => users.id),
  views: integer("views").default(0).notNull(),
  watchers: integer("watchers").default(0).notNull(),
  bids: integer("bids").default(0).notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  hasBoldTitle: boolean("has_bold_title").default(false).notNull(),
  isHighlighted: boolean("is_highlighted").default(false).notNull(),
  shippingOptions: jsonb("shipping_options"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type InsertListing = typeof listings.$inferInsert
export type SelectListing = typeof listings.$inferSelect

