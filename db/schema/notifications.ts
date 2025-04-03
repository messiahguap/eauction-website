import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { users } from "./users"
import { listings } from "./listings"

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  type: text("type").notNull(), // outbid, question, ending, sold, system
  message: text("message").notNull(),
  isRead: text("is_read").default("false").notNull(),
  listingId: uuid("listing_id").references(() => listings.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type InsertNotification = typeof notifications.$inferInsert
export type SelectNotification = typeof notifications.$inferSelect

