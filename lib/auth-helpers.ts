// Mock auth helpers that use localStorage instead of Firebase
// This replaces the original Firebase authentication with a simple mockup

// Define types for better TypeScript support
type MockUser = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  emailVerified: boolean;
};

// Store to keep user data
const USERS_STORAGE_KEY = 'mock_users';
const CURRENT_USER_KEY = 'mock_current_user';

// Save users to localStorage
const saveUsers = (users: Record<string, any>) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Get users from localStorage
const getUsers = (): Record<string, any> => {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : {};
};

// Save current user to localStorage
const saveCurrentUser = (user: MockUser | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Get current user from localStorage
export const getCurrentUser = (): MockUser | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Mock sign up without verification
export const signUpWithoutVerification = async (
  email: string, 
  password: string, 
  name: string
): Promise<MockUser> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = getUsers();
  
  // Check if user already exists
  if (users[email]) {
    throw new Error('Email already in use');
  }
  
  // Create new user
  const userId = generateId();
  const newUser: MockUser = {
    uid: userId,
    email,
    displayName: name,
    photoURL: null,
    emailVerified: true
  };
  
  // Store user with password
  users[email] = {
    ...newUser,
    password
  };
  
  saveUsers(users);
  saveCurrentUser(newUser);
  
  return newUser;
};

// Mock sign in without verification
export const signInWithoutVerification = async (
  email: string, 
  password: string
): Promise<MockUser> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = getUsers();
  const user = users[email];
  
  // Check if user exists and password matches
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }
  
  const mockUser: MockUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified
  };
  
  saveCurrentUser(mockUser);
  
  return mockUser;
};

// Mock sign out
export const signOutUser = async (): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  saveCurrentUser(null);
}; 