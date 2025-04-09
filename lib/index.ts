// Export client-side Firebase
export { app, auth, db, storage } from './firebase';

// Export server helpers
export { getServerAuth, getServerFirestore } from './server';

// Export environment variables
export { clientEnv, serverEnv } from './env';

// Export utilities
export * from './utils'; 