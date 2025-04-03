import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core"
import { users } from "./users"
import { listings } from "./listings"

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  senderId: uuid("sender_id")
    .references(() => users.id)
    .notNull(),
  receiverId: uuid("receiver_id")
    .references(() => users.id)
    .notNull(),
  listingId: uuid("listing_id")
    .references(() => listings.id)
    .notNull(),
  content: text("content").notNull(),
  attachments: jsonb("attachments"),
  isRead: text("is_read").default("false").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type InsertMessage = typeof messages.$inferInsert
export type SelectMessage = typeof messages.$inferSelect

