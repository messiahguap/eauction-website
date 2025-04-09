"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { signUpWithoutVerification, signInWithoutVerification, signOutUser } from "@/lib/auth-helpers"

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
    // Check if there's a user in localStorage 
    const checkStorageForUser = () => {
      const userData = localStorage.getItem('mock_current_user')
      
      if (userData) {
        try {
          const mockUser = JSON.parse(userData)
          
          // Format the user data in the expected structure
          const formattedUser: User = {
            id: mockUser.uid,
            auth_id: mockUser.uid,
            first_name: mockUser.displayName.split(' ')[0] || "",
            last_name: mockUser.displayName.split(' ').slice(1).join(' ') || "",
            email: mockUser.email,
            avatar: mockUser.photoURL,
            user_mode: "buyer",
            name: mockUser.displayName,
            avatar_url: mockUser.photoURL
          }
          
          setUser(formattedUser)
          
          // Set cookie for persistence
          Cookies.set("user", JSON.stringify(formattedUser), { expires: 7, secure: true })
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      
      setLoading(false)
    }
    
    // Initial check
    checkStorageForUser()
    
    // Set up storage event listener to detect changes across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'mock_current_user') {
        checkStorageForUser()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const signOut = async () => {
    try {
      await signOutUser()
      setUser(null)
      Cookies.remove("user")
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Use the mock helper function to sign up
      const mockUser = await signUpWithoutVerification(email, password, name)
      
      // Create a user object in the expected format
      const newUser: User = {
        id: mockUser.uid,
        auth_id: mockUser.uid,
        first_name: name.split(' ')[0] || "",
        last_name: name.split(' ').slice(1).join(' ') || "",
        email: mockUser.email,
        avatar: "",
        user_mode: "buyer",
        name: name,
        avatar_url: ""
      }
      
      // Store in localStorage (simulating Firestore)
      localStorage.setItem(`mock_users_${mockUser.uid}`, JSON.stringify(newUser))
      
      // Update state
      setUser(newUser)
      
      // Set cookie for persistence
      Cookies.set("user", JSON.stringify(newUser), { expires: 7, secure: true })
      
      // Redirect to dashboard
      router.push("/dashboard")
      
      return {}
    } catch (error: any) {
      console.error("Error signing up:", error)
      return { error: { message: error.message || 'Failed to create account' } }
    }
  }
  
  const signIn = async (email: string, password: string) => {
    try {
      // Use the mock helper function to sign in
      const mockUser = await signInWithoutVerification(email, password)
      
      // Get user data from localStorage (simulating Firestore)
      const userData = localStorage.getItem(`mock_users_${mockUser.uid}`)
      
      let userObj: User
      
      if (userData) {
        // Use stored user data
        userObj = JSON.parse(userData)
      } else {
        // Create basic user object if not found
        userObj = {
          id: mockUser.uid,
          auth_id: mockUser.uid,
          first_name: mockUser.displayName?.split(' ')[0] || "",
          last_name: mockUser.displayName?.split(' ').slice(1).join(' ') || "",
          email: mockUser.email,
          avatar: "",
          user_mode: "buyer",
          name: mockUser.displayName || "",
          avatar_url: ""
        }
        
        // Store for future reference
        localStorage.setItem(`mock_users_${mockUser.uid}`, JSON.stringify(userObj))
      }
      
      // Update state
      setUser(userObj)
      
      // Set cookie for persistence
      Cookies.set("user", JSON.stringify(userObj), { expires: 7, secure: true })
      
      return {}
    } catch (error: any) {
      console.error("Error signing in:", error)
      return { error: { message: error.message || 'Invalid email or password' } }
    }
  }

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
