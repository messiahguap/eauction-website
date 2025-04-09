import { db, auth, storage } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  Timestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { User as FirebaseUser } from 'firebase/auth';

// Collection names
const USERS_COLLECTION = 'users';

// Types
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  role: 'user' | 'admin';
  bio?: string;
}

// User service
export const userService = {
  // Create or update user profile after authentication
  async createUserProfile(user: FirebaseUser): Promise<UserProfile> {
    try {
      const userRef = doc(db, USERS_COLLECTION, user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Create new user profile
        const newUser: Omit<UserProfile, 'id'> = {
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          photoURL: user.photoURL || undefined,
          phoneNumber: user.phoneNumber || undefined,
          role: 'user',
          createdAt: serverTimestamp() as unknown as Timestamp,
          updatedAt: serverTimestamp() as unknown as Timestamp
        };
        
        await setDoc(userRef, newUser);
        
        return {
          id: user.uid,
          ...newUser
        };
      } else {
        // Return existing user profile
        return {
          id: user.uid,
          ...userSnap.data()
        } as UserProfile;
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  // Get user profile by ID
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as UserProfile;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      
      // Remove id field if it exists
      const { id, ...updateData } = data;
      
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Upload profile picture
  async uploadProfilePicture(userId: string, file: File): Promise<string> {
    try {
      // Delete previous profile picture first
      const user = await this.getUserProfile(userId);
      
      if (user?.photoURL) {
        try {
          // Try to delete old image if it's stored in Firebase Storage
          if (user.photoURL.includes('firebasestorage')) {
            const storageRef = ref(storage, user.photoURL);
            await deleteObject(storageRef);
          }
        } catch (deleteError) {
          console.error('Error deleting old profile picture:', deleteError);
          // Continue even if deletion fails
        }
      }
      
      // Upload new profile picture
      const filePath = `users/${userId}/profile-${Date.now()}-${file.name}`;
      const storageRef = ref(storage, filePath);
      
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      
      // Update user profile with new photoURL
      await this.updateUserProfile(userId, { photoURL: downloadUrl });
      
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  },

  // Check if user is an admin
  async isAdmin(userId: string): Promise<boolean> {
    try {
      const user = await this.getUserProfile(userId);
      return user?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  // Get all users (admin only)
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const q = query(collection(db, USERS_COLLECTION));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }
}; 