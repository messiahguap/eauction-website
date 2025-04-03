import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core"
import { users } from "./users"
import { listings } from "./listings"

export const watchlist = pgTable("watchlist", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  listingId: uuid("listing_id")
    .references(() => listings.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type InsertWatchlistItem = typeof watchlist.$inferInsert
export type SelectWatchlistItem = typeof watchlist.$inferSelect

