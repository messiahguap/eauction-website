"use server"

import { eq } from "drizzle-orm"
import { db } from "../db"
import { type InsertNotification, type SelectNotification, notifications } from "../schema/notifications"

// Create a notification
export const createNotification = async (data: InsertNotification): Promise<SelectNotification> => {
  try {
    const [newNotification] = await db.insert(notifications).values(data).returning()

    return newNotification
  } catch (error) {
    console.error("Error creating notification:", error)
    throw new Error("Failed to create notification")
  }
}

// Get notifications by user ID
export const getNotificationsByUserId = async (userId: string): Promise<SelectNotification[]> => {
  try {
    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(notifications.createdAt, "desc")
      .execute()

    return userNotifications
  } catch (error) {
    console.error("Error getting notifications by user ID:", error)
    throw new Error("Failed to get notifications by user ID")
  }
}

// Get unread notifications count by user ID
export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
  try {
    const unreadNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId), eq(notifications.isRead, "false"))
      .execute()

    return unreadNotifications.length
  } catch (error) {
    console.error("Error getting unread notifications count:", error)
    throw new Error("Failed to get unread notifications count")
  }
}

// Mark notification as read
export const markNotificationAsRead = async (id: string): Promise<SelectNotification> => {
  try {
    const [updatedNotification] = await db
      .update(notifications)
      .set({ isRead: "true" })
      .where(eq(notifications.id, id))
      .returning()

    return updatedNotification
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw new Error("Failed to mark notification as read")
  }
}

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    await db
      .update(notifications)
      .set({ isRead: "true" })
      .where(eq(notifications.userId, userId), eq(notifications.isRead, "false"))
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    throw new Error("Failed to mark all notifications as read")
  }
}

// Delete notification
export const deleteNotification = async (id: string): Promise<void> => {
  try {
    await db.delete(notifications).where(eq(notifications.id, id))
  } catch (error) {
    console.error("Error deleting notification:", error)
    throw new Error("Failed to delete notification")
  }
}

