"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { signUpWithoutVerification, signInWithoutVerification } from "@/lib/auth-helpers"

type User = {
  id: string
  auth_id: string
  first_name: string
  last_name: string
  email: string
  avatar: string | null
  user_mode: string
  name?: string
  avatar_url?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<{ error?: { message: string } }>
  signIn: (email: string, password: string) => Promise<{ error?: { message: string } }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  signUp: async () => ({ }),
  signIn: async () => ({ })
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null)
          setLoading(false)
          return
        }

        // Try to fetch the user profile from Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid)
        const userDoc = await getDoc(userDocRef)

        if (!userDoc.exists()) {
          // No user found with this auth_id
          console.log("No user profile found for auth_id:", firebaseUser.uid)

          // Create a basic user profile if one doesn't exist
          const userData = {
            auth_id: firebaseUser.uid,
            email: firebaseUser.email || "",
            first_name: firebaseUser.displayName?.split(' ')[0] || "",
            last_name: firebaseUser.displayName?.split(' ').slice(1).join(' ') || "",
            user_mode: "buyer",
            created_at: new Date(),
            updated_at: new Date(),
          }

          await setDoc(userDocRef, userData)

          const newUser = {
            id: firebaseUser.uid,
            ...userData,
            name: `${userData.first_name} ${userData.last_name}`.trim(),
            avatar_url: firebaseUser.photoURL || null,
            avatar: firebaseUser.photoURL || null,
          }

          setUser(newUser)

          // Set user data in cookie for persistence
          Cookies.set("user", JSON.stringify(newUser), { expires: 7, secure: true })
        } else {
          // User found
          const userData = userDoc.data()
          const formattedUser = {
            id: userDoc.id,
            ...userData,
            name: `${userData.first_name} ${userData.last_name}`.trim(),
            avatar_url: userData.avatar || firebaseUser.photoURL || null,
          } as User

          setUser(formattedUser)

          // Set user data in cookie for persistence
          Cookies.set("user", JSON.stringify(formattedUser), { expires: 7, secure: true })
        }
      } catch (error) {
        console.error("Auth error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    // Try to get user from cookie if not authenticated yet
    if (!user && !loading) {
      const userFromCookie = Cookies.get("user")
      if (userFromCookie) {
        try {
          setUser(JSON.parse(userFromCookie))
        } catch (e) {
          console.error("Error parsing user cookie:", e)
          Cookies.remove("user")
        }
      }
    }

    return () => unsubscribe()
  }, [router])

  const signOut = async () => {
    await firebaseSignOut(auth)
    setUser(null)
    Cookies.remove("user")
    Cookies.remove("firebase-token")
    router.push("/")
    router.refresh()
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      await signUpWithoutVerification(email, password, name);
      
      // Redirect to dashboard - the auth state will be updated by onAuthStateChanged
      router.push("/dashboard");
      
      return {}; // Return empty object for success
    } catch (error: any) {
      console.error("Error signing up:", error);
      return { error: { message: error.message || 'Failed to create account' } };
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithoutVerification(email, password);
      
      // No need to redirect here as onAuthStateChanged will handle authentication state
      return {}; // Return empty object for success
    } catch (error: any) {
      console.error("Error signing in:", error);
      return { error: { message: error.message || 'Invalid email or password' } };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
        signUp,
        signIn
      }}
    >
      {children}
    </AuthContext.Provider>
  )
} 