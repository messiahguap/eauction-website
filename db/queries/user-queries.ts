"use server"

import { eq } from "drizzle-orm"
import { db } from "../db"
import { type InsertUser, type SelectUser, users } from "../schema/users"
import * as crypto from "crypto"

// Hash password
const hashPassword = (password: string): string => {
  return crypto.createHash("sha256").update(password).digest("hex")
}

// Create a new user
export const createUser = async (data: InsertUser): Promise<SelectUser> => {
  try {
    // Hash the password before storing
    const hashedPassword = hashPassword(data.password)

    const [newUser] = await db
      .insert(users)
      .values({
        ...data,
        password: hashedPassword,
      })
      .returning()

    return newUser
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

// Get user by ID
export const getUserById = async (id: string): Promise<SelectUser | null> => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    })

    return user
  } catch (error) {
    console.error("Error getting user by ID:", error)
    throw new Error("Failed to get user")
  }
}

// Get user by email
export const getUserByEmail = async (email: string): Promise<SelectUser | null> => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    return user
  } catch (error) {
    console.error("Error getting user by email:", error)
    throw new Error("Failed to get user by email")
  }
}

// Authenticate user
export const authenticateUser = async (email: string, password: string): Promise<SelectUser | null> => {
  try {
    const user = await getUserByEmail(email)

    if (!user) {
      return null
    }

    const hashedPassword = hashPassword(password)

    if (user.password !== hashedPassword) {
      return null
    }

    return user
  } catch (error) {
    console.error("Error authenticating user:", error)
    throw new Error("Failed to authenticate user")
  }
}

// Update user
export const updateUser = async (id: string, data: Partial<InsertUser>): Promise<SelectUser> => {
  try {
    // If password is being updated, hash it
    if (data.password) {
      data.password = hashPassword(data.password)
    }

    const [updatedUser] = await db.update(users).set(data).where(eq(users.id, id)).returning()

    return updatedUser
  } catch (error) {
    console.error("Error updating user:", error)
    throw new Error("Failed to update user")
  }
}

// Update user mode
export const updateUserMode = async (id: string, mode: "buyer" | "seller"): Promise<SelectUser> => {
  try {
    const [updatedUser] = await db.update(users).set({ userMode: mode }).where(eq(users.id, id)).returning()

    return updatedUser
  } catch (error) {
    console.error("Error updating user mode:", error)
    throw new Error("Failed to update user mode")
  }
}

// Delete user
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await db.delete(users).where(eq(users.id, id))
  } catch (error) {
    console.error("Error deleting user:", error)
    throw new Error("Failed to delete user")
  }
}

