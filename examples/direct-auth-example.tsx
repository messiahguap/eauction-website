/**
 * Example of direct Firebase authentication without email verification
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import Cookies from "js-cookie"

// Example auth component
export function DirectAuthExample() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  const auth = getAuth()
  
  // Sign up without email verification
  const handleSignUp = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Create a new user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Extract first and last name for the user profile
      const nameParts = name.split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || ""
      
      // Create user profile in Firestore
      const userData = {
        auth_id: user.uid,
        email: email,
        first_name: firstName,
        last_name: lastName,
        user_mode: "buyer",
        created_at: new Date(),
        updated_at: new Date(),
      }
      
      await setDoc(doc(db, "users", user.uid), userData)
      
      // Get the ID token and set it in a cookie
      const idToken = await user.getIdToken()
      Cookies.set("firebase-token", idToken, { expires: 7, secure: true })
      
      // Save user in local storage for client-side access
      const userForStorage = {
        id: user.uid,
        ...userData,
        name: `${firstName} ${lastName}`.trim(),
      }
      localStorage.setItem("user", JSON.stringify(userForStorage))
      
      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message || "Failed to create account")
      console.error("Signup error:", error)
    } finally {
      setLoading(false)
    }
  }
  
  // Sign in without checking email verification
  const handleSignIn = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Get the ID token and set it in a cookie
      const idToken = await user.getIdToken()
      Cookies.set("firebase-token", idToken, { expires: 7, secure: true })
      
      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message || "Invalid email or password")
      console.error("Signin error:", error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      <h2>Direct Firebase Authentication</h2>
      
      {error && <div className="text-red-500">{error}</div>}
      
      <div className="space-y-4">
        <div>
          <label>
            Email:
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="border p-2 ml-2"
            />
          </label>
        </div>
        
        <div>
          <label>
            Password:
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 ml-2" 
            />
          </label>
        </div>
        
        <div>
          <label>
            Full Name (for signup):
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="border p-2 ml-2" 
            />
          </label>
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={handleSignUp}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
          
          <button 
            onClick={handleSignIn}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Processing..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  )
} 