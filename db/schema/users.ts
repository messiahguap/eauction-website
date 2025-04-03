import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  phone: text("phone"),
  location: text("location"),
  bio: text("bio"),
  memberSince: timestamp("member_since").defaultNow().notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  rating: text("rating").default("0"),
  reviews: text("reviews").default("0"),
  userMode: text("user_mode").default("buyer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect

