"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { getServerAuth, getServerFirestore } from "@/lib/server"
import { User, ProfileUpdateData, Notification } from "@/types/firebase-types"
import { FieldValue } from "firebase-admin/firestore"

// Get Firestore instance
const db = getServerFirestore()

// Get the currently logged-in user from cookies
async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies()
  const token = cookieStore.get("firebase-token")?.value
  
  if (!token) {
    return null
  }
  
  try {
    const auth = getServerAuth()
    const decodedToken = await auth.verifyIdToken(token)
    
    // Get user profile from Firestore
    const userDocRef = db.collection('users').doc(decodedToken.uid)
    const userDoc = await userDocRef.get()
    
    if (!userDoc.exists) {
      return null
    }
    
    return {
      id: userDoc.id,
      ...userDoc.data()
    } as User
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}

export async function getUserProfile() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Not authenticated"
      }
    }

    return {
      user
    }
  } catch (error: any) {
    console.error("Get user profile error:", error)
    return {
      error: error.message || "An unexpected error occurred"
    }
  }
}

export async function updateProfile(data: ProfileUpdateData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Not authenticated"
      }
    }

    // Update the user's displayName in Firebase Auth if first_name or last_name is provided
    if (data.first_name || data.last_name) {
      const auth = getServerAuth()
      
      // Compute the new display name
      const firstName = data.first_name || user.first_name || ""
      const lastName = data.last_name || user.last_name || ""
      const displayName = `${firstName} ${lastName}`.trim()
      
      if (displayName) {
        await auth.updateUser(user.id, {
          displayName
        })
      }
    }

    // Update the user document in Firestore
    const userRef = db.collection("users").doc(user.id)
    await userRef.update({
      ...data,
      displayName: data.first_name || data.last_name 
        ? `${data.first_name || user.first_name || ""} ${data.last_name || user.last_name || ""}`.trim() 
        : user.displayName,
      updated_at: FieldValue.serverTimestamp()
    })

    revalidatePath("/profile")

    return {
      success: true
    }
  } catch (error: any) {
    console.error("Update profile error:", error)
    return {
      error: error.message || "An unexpected error occurred"
    }
  }
}

export async function getNotifications() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Not authenticated",
        notifications: []
      }
    }

    // Get all notifications for the user
    const notificationsQuery = db.collection("notifications")
      .where("user_id", "==", user.id)
      .orderBy("created_at", "desc")
      .limit(50)
    
    const notificationsSnapshot = await notificationsQuery.get()
    
    const notifications = notificationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[]

    return {
      notifications
    }
  } catch (error: any) {
    console.error("Get notifications error:", error)
    return {
      error: error.message || "An unexpected error occurred",
      notifications: []
    }
  }
}

export async function getUnreadNotificationsCount() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Not authenticated",
        count: 0
      }
    }

    // Get count of unread notifications
    const notificationsQuery = db.collection("notifications")
      .where("user_id", "==", user.id)
      .where("read", "==", false)
    
    const notificationsSnapshot = await notificationsQuery.get()
    
    return {
      count: notificationsSnapshot.size
    }
  } catch (error: any) {
    console.error("Get unread notifications count error:", error)
    return {
      error: error.message || "An unexpected error occurred",
      count: 0
    }
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Not authenticated"
      }
    }

    // Get the notification
    const notificationRef = db.collection("notifications").doc(notificationId)
    const notificationDoc = await notificationRef.get()
    
    if (!notificationDoc.exists) {
      return {
        error: "Notification not found"
      }
    }
    
    const notification = notificationDoc.data()

    // Make sure the notification belongs to the user
    if (notification?.user_id !== user.id) {
      return {
        error: "Unauthorized"
      }
    }

    // Mark the notification as read
    await notificationRef.update({
      read: true,
      updated_at: FieldValue.serverTimestamp()
    })

    revalidatePath("/notifications")

    return {
      success: true
    }
  } catch (error: any) {
    console.error("Mark notification as read error:", error)
    return {
      error: error.message || "An unexpected error occurred"
    }
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Not authenticated"
      }
    }

    // Get all unread notifications for the user
    const notificationsQuery = db.collection("notifications")
      .where("user_id", "==", user.id)
      .where("read", "==", false)
    
    const notificationsSnapshot = await notificationsQuery.get()
    
    // Use a batch to update all notifications at once
    const batch = db.batch()
    
    notificationsSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        read: true,
        updated_at: FieldValue.serverTimestamp()
      })
    })
    
    await batch.commit()

    revalidatePath("/notifications")

    return {
      success: true
    }
  } catch (error: any) {
    console.error("Mark all notifications as read error:", error)
    return {
      error: error.message || "An unexpected error occurred"
    }
  }
}

export async function updateUserSettings(settings: {
  email_notifications?: boolean,
  push_notifications?: boolean,
  bid_alerts?: boolean,
  message_alerts?: boolean,
  newsletter?: boolean
}) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Not authenticated"
      }
    }

    // Update user settings in Firestore
    const userRef = db.collection("users").doc(user.id)
    await userRef.update({
      settings: {
        ...user.settings || {},
        ...settings
      },
      updated_at: FieldValue.serverTimestamp()
    })

    revalidatePath("/profile/settings")

    return {
      success: true
    }
  } catch (error: any) {
    console.error("Update user settings error:", error)
    return {
      error: error.message || "An unexpected error occurred"
    }
  }
} 