import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core"
import { users } from "./users"
import { listings } from "./listings"

export const bids = pgTable("bids", {
  id: uuid("id").defaultRandom().primaryKey(),
  amount: integer("amount").notNull(),
  bidderId: uuid("bidder_id")
    .references(() => users.id)
    .notNull(),
  listingId: uuid("listing_id")
    .references(() => listings.id)
    .notNull(),
  status: text("status").default("active").notNull(), // active, outbid, winning, won
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type InsertBid = typeof bids.$inferInsert
export type SelectBid = typeof bids.$inferSelect

