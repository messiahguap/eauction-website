"use client"

// This file replaces server-side actions with client-side mock implementations

import { cookies } from "next/headers"
import { redirect } from "next/navigation" 

// Mock function to get current user
export async function getCurrentUser() {
  // Get user from localStorage
  if (typeof window !== 'undefined') {
    const userJson = localStorage.getItem('mock_current_user');
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }
  return null;
}

// Mock function to get auth token
export async function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('mock_auth_token');
  }
  return null;
}

// Mock function to set auth cookie
export async function setAuthCookie(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mock_auth_token', token);
  }
}

// Mock function to clear auth cookie
export async function clearAuthCookie() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('mock_auth_token');
  }
}

// Mock function to create user profile
export async function createUserProfile(userId: string, userData: {
  email: string;
  displayName?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}) {
  if (typeof window !== 'undefined') {
    const userKey = `mock_users_${userId}`;
    
    // Check if user exists
    const existingUser = localStorage.getItem(userKey);
    if (existingUser) {
      return {
        success: true,
        user: JSON.parse(existingUser)
      };
    }
    
    // Create new user profile
    const newUser = {
      id: userId,
      email: userData.email,
      displayName: userData.displayName || `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
      phone: userData.phone || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      settings: {
        email_notifications: true,
        push_notifications: true,
        bid_alerts: true,
        message_alerts: true,
        newsletter: false
      }
    };
    
    localStorage.setItem(userKey, JSON.stringify(newUser));
    
    return {
      success: true,
      user: newUser
    };
  }
  
  return {
    error: "Browser storage not available"
  };
}

// Mock function to require auth
export async function requireAuth(redirectPath?: string) {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('mock_auth_token');
    const user = localStorage.getItem('mock_current_user');
    
    if (!token || !user) {
      window.location.href = redirectPath || "/login";
      return false;
    }
    
    return true;
  }
  
  return false;
}

// Mock function to create admin user
export async function createAdminUser(email: string, password: string, displayName: string) {
  if (typeof window !== 'undefined') {
    const currentUser = localStorage.getItem('mock_current_user');
    if (!currentUser) {
      return {
        error: "Not authenticated"
      };
    }
    
    const currentUserObj = JSON.parse(currentUser);
    if (!currentUserObj.is_admin) {
      return {
        error: "Unauthorized. Only admins can create admin users."
      };
    }
    
    // Generate a user ID
    const userId = Math.random().toString(36).substring(2, 15);
    
    // Create user with admin flag
    const adminUser = {
      id: userId,
      email,
      displayName,
      first_name: displayName.split(' ')[0] || "",
      last_name: displayName.split(' ').slice(1).join(' ') || "",
      is_admin: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Store in localStorage
    const userKey = `mock_users_${userId}`;
    localStorage.setItem(userKey, JSON.stringify(adminUser));
    
    // Also store auth credentials
    const users = localStorage.getItem('mock_users') || '{}';
    const usersObj = JSON.parse(users);
    usersObj[email] = {
      uid: userId,
      email,
      displayName,
      password,
      emailVerified: true,
      photoURL: null
    };
    localStorage.setItem('mock_users', JSON.stringify(usersObj));
    
    return {
      success: true,
      user: {
        id: userId,
        email,
        displayName
      }
    };
  }
  
  return {
    error: "Browser storage not available"
  };
} 