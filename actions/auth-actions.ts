"use server"

import { authenticateUser, createUser, getUserByEmail } from "@/db/queries/user-queries"
import type { ActionState, LoginData, UserData } from "@/types"
import { cookies } from "next/headers"

// Sign up action
export async function signUpAction(data: UserData): Promise<ActionState> {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(data.email)

    if (existingUser) {
      return {
        status: "error",
        message: "Email already in use",
      }
    }

    // Create user
    const newUser = await createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      userMode: "buyer",
    })

    // Set session cookie
    const session = {
      id: newUser.id,
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      userMode: newUser.userMode,
    }

    cookies().set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Increment registered users count
    const currentUsers = Number.parseInt(process.env.REGISTERED_USERS || "0")
    process.env.REGISTERED_USERS = (currentUsers + 1).toString()

    return {
      status: "success",
      message: "Account created successfully",
      data: {
        id: newUser.id,
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        userMode: newUser.userMode,
      },
    }
  } catch (error) {
    console.error("Error signing up:", error)
    return { status: "error", message: "Failed to create account" }
  }
}

// Login action
export async function loginAction(data: LoginData): Promise<ActionState> {
  try {
    // Authenticate user
    const user = await authenticateUser(data.email, data.password)

    if (!user) {
      return {
        status: "error",
        message: "Invalid email or password",
      }
    }

    // Set session cookie
    const session = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      userMode: user.userMode,
    }

    cookies().set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return {
      status: "success",
      message: "Logged in successfully",
      data: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        userMode: user.userMode,
      },
    }
  } catch (error) {
    console.error("Error logging in:", error)
    return { status: "error", message: "Failed to log in" }
  }
}

// Logout action
export async function logoutAction(): Promise<ActionState> {
  try {
    // Clear session cookie
    cookies().delete("session")

    return { status: "success", message: "Logged out successfully" }
  } catch (error) {
    console.error("Error logging out:", error)
    return { status: "error", message: "Failed to log out" }
  }
}

// Get current user action
export async function getCurrentUserAction(): Promise<ActionState> {
  try {
    // Get session cookie
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return { status: "error", message: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)

    return {
      status: "success",
      message: "User retrieved successfully",
      data: session,
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return { status: "error", message: "Failed to get current user" }
  }
}

