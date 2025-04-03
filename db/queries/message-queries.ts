"use server"

import { and, eq, or } from "drizzle-orm"
import { db } from "../db"
import { type InsertMessage, type SelectMessage, messages } from "../schema/messages"
import { createNotification } from "./notification-queries"

// Send a message
export const sendMessage = async (data: InsertMessage): Promise<SelectMessage> => {
  try {
    const [newMessage] = await db.insert(messages).values(data).returning()

    // Create notification for receiver
    await createNotification({
      userId: data.receiverId,
      type: "message",
      message: "You have a new message",
      listingId: data.listingId,
    })

    return newMessage
  } catch (error) {
    console.error("Error sending message:", error)
    throw new Error("Failed to send message")
  }
}

// Get messages by conversation (listing ID and between two users)
export const getMessagesByConversation = async (
  listingId: string,
  userId1: string,
  userId2: string,
): Promise<SelectMessage[]> => {
  try {
    const conversationMessages = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.listingId, listingId),
          or(
            and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
            and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1)),
          ),
        ),
      )
      .orderBy(messages.createdAt, "asc")
      .execute()

    return conversationMessages
  } catch (error) {
    console.error("Error getting messages by conversation:", error)
    throw new Error("Failed to get messages by conversation")
  }
}

// Get conversations for a user
export const getConversationsByUserId = async (userId: string): Promise<any[]> => {
  try {
    // This is a complex query to get unique conversations
    // In a real app, you might want to use a more efficient approach
    const userMessages = await db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(messages.createdAt, "desc")
      .execute()

    // Group messages by conversation (listing + other user)
    const conversationsMap = new Map()

    for (const message of userMessages) {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId
      const conversationKey = `${message.listingId}-${otherUserId}`

      if (!conversationsMap.has(conversationKey)) {
        conversationsMap.set(conversationKey, {
          listingId: message.listingId,
          otherUserId,
          lastMessage: message,
          unreadCount: message.senderId !== userId && message.isRead === "false" ? 1 : 0,
        })
      } else if (message.senderId !== userId && message.isRead === "false") {
        // Count unread messages
        const conversation = conversationsMap.get(conversationKey)
        conversation.unreadCount += 1
      }
    }

    return Array.from(conversationsMap.values())
  } catch (error) {
    console.error("Error getting conversations by user ID:", error)
    throw new Error("Failed to get conversations by user ID")
  }
}

// Mark message as read
export const markMessageAsRead = async (id: string): Promise<SelectMessage> => {
  try {
    const [updatedMessage] = await db.update(messages).set({ isRead: "true" }).where(eq(messages.id, id)).returning()

    return updatedMessage
  } catch (error) {
    console.error("Error marking message as read:", error)
    throw new Error("Failed to mark message as read")
  }
}

// Mark all messages in a conversation as read
export const markConversationAsRead = async (
  listingId: string,
  senderId: string,
  receiverId: string,
): Promise<void> => {
  try {
    await db
      .update(messages)
      .set({ isRead: "true" })
      .where(
        and(
          eq(messages.listingId, listingId),
          eq(messages.senderId, senderId),
          eq(messages.receiverId, receiverId),
          eq(messages.isRead, "false"),
        ),
      )
  } catch (error) {
    console.error("Error marking conversation as read:", error)
    throw new Error("Failed to mark conversation as read")
  }
}

// Delete message
export const deleteMessage = async (id: string): Promise<void> => {
  try {
    await db.delete(messages).where(eq(messages.id, id))
  } catch (error) {
    console.error("Error deleting message:", error)
    throw new Error("Failed to delete message")
  }
}

