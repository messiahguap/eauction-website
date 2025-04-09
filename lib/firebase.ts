// Mock Firebase Implementation
// This file replaces the real Firebase implementation with mocks

// Mock Firebase Auth
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Check local storage for user data on initialization
    const userData = localStorage.getItem('mock_current_user');
    if (userData) {
      callback(JSON.parse(userData));
    } else {
      callback(null);
    }
    
    // Listen for storage events to detect changes
    const storageListener = (event: StorageEvent) => {
      if (event.key === 'mock_current_user') {
        if (event.newValue) {
          callback(JSON.parse(event.newValue));
        } else {
          callback(null);
        }
      }
    };
    
    window.addEventListener('storage', storageListener);
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener('storage', storageListener);
    };
  }
};

// Mock Firestore
export const db = {
  collection: (name: string) => ({
    doc: (id: string) => ({
      get: async () => {
        const key = `mock_${name}_${id}`;
        const data = localStorage.getItem(key);
        
        return {
          exists: !!data,
          data: () => data ? JSON.parse(data) : null,
          id
        };
      },
      set: async (data: any) => {
        const key = `mock_${name}_${id}`;
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      },
      update: async (data: any) => {
        const key = `mock_${name}_${id}`;
        const existingData = localStorage.getItem(key);
        const updatedData = existingData 
          ? { ...JSON.parse(existingData), ...data } 
          : data;
        localStorage.setItem(key, JSON.stringify(updatedData));
        return true;
      }
    }),
    add: async (data: any) => {
      const id = Math.random().toString(36).substring(2, 15);
      const key = `mock_${name}_${id}`;
      localStorage.setItem(key, JSON.stringify(data));
      return { id };
    },
    where: () => ({
      get: async () => ({
        empty: true,
        docs: []
      })
    })
  })
};

// Mock Storage
export const storage = {
  ref: (path: string) => ({
    put: async (file: File) => {
      // Mock storage operation
      return {
        ref: {
          getDownloadURL: async () => {
            // Return a fake URL that uses a data URL of a placeholder image
            return 'https://via.placeholder.com/150';
          }
        }
      };
    }
  })
};

// Expose functions to match Firebase API
export const getFirebaseApp = () => ({
  name: 'mock-firebase-app'
});

export default {
  auth,
  db,
  storage
}; 