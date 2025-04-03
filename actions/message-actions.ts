"use server"

import {
  getMessagesByConversation,
  sendMessage,
  getConversationsByUserId,
  markConversationAsRead,
} from "@/db/queries/message-queries"
import type { ActionState, MessageData } from "@/types"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// Send message action
export async function sendMessageAction(data: MessageData): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    // Send message
    const message = await sendMessage({
      senderId: session.id,
      receiverId: data.receiverId,
      listingId: data.listingId,
      content: data.content,
      attachments: data.attachments,
    })

    revalidatePath("/dashboard/messages")

    return {
      status: "success",
      message: "Message sent successfully",
      data: message,
    }
  } catch (error) {
    console.error("Error sending message:", error)
    return { status: "error", message: "Failed to send message" }
  }
}

// Get conversation messages action
export async function getConversationMessagesAction(listingId: string, otherUserId: string): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    // Get messages
    const messages = await getMessagesByConversation(listingId, session.id, otherUserId)

    // Mark messages as read
    await markConversationAsRead(listingId, otherUserId, session.id)

    return {
      status: "success",
      message: "Messages retrieved successfully",
      data: messages,
    }
  } catch (error) {
    console.error("Error getting messages:", error)
    return { status: "error", message: "Failed to get messages" }
  }
}

// Get my conversations action
export async function getMyConversationsAction(): Promise<ActionState> {
  try {
    // Get current user
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    // Get conversations
    const conversations = await getConversationsByUserId(session.id)

    return {
      status: "success",
      message: "Conversations retrieved successfully",
      data: conversations,
    }
  } catch (error) {
    console.error("Error getting conversations:", error)
    return { status: "error", message: "Failed to get conversations" }
  }
}

