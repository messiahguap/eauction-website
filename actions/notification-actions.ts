"use server"

import {
  getNotificationsByUserId,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  getUnreadNotificationsCount,
  deleteNotification,
} from "@/db/queries/notification-queries"
import type { ActionState } from "@/types"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// Get my notifications action
export async function getMyNotificationsAction(): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    // Get notifications
    const notifications = await getNotificationsByUserId(session.id)

    return {
      status: "success",
      message: "Notifications retrieved successfully",
      data: notifications,
    }
  } catch (error) {
    console.error("Error getting notifications:", error)
    return { status: "error", message: "Failed to get notifications" }
  }
}

// Get unread notifications count action
export async function getUnreadNotificationsCountAction(): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    // Get unread count
    const count = await getUnreadNotificationsCount(session.id)

    return {
      status: "success",
      message: "Unread count retrieved successfully",
      data: count,
    }
  } catch (error) {
    console.error("Error getting unread count:", error)
    return { status: "error", message: "Failed to get unread count" }
  }
}

// Mark notification as read action
export async function markNotificationAsReadAction(id: string): Promise<ActionState> {
  try {
    // Mark as read
    const notification = await markNotificationAsRead(id)

    revalidatePath("/dashboard/notifications")

    return {
      status: "success",
      message: "Notification marked as read",
      data: notification,
    }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return { status: "error", message: "Failed to mark notification as read" }
  }
}

// Mark all notifications as read action
export async function markAllNotificationsAsReadAction(): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    // Mark all as read
    await markAllNotificationsAsRead(session.id)

    revalidatePath("/dashboard/notifications")

    return {
      status: "success",
      message: "All notifications marked as read",
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return { status: "error", message: "Failed to mark all notifications as read" }
  }
}

// Delete notification action
export async function deleteNotificationAction(id: string): Promise<ActionState> {
  try {
    // Delete notification
    await deleteNotification(id)

    revalidatePath("/dashboard/notifications")

    return {
      status: "success",
      message: "Notification deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting notification:", error)
    return { status: "error", message: "Failed to delete notification" }
  }
}

