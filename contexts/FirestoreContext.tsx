"use client"

import React, { createContext, useContext, ReactNode } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { QueryConstraint, Timestamp } from 'firebase/firestore';

type FirestoreContextType = {
  loading: boolean;
  error: string | null;
  addDocument: (collectionName: string, data: any) => Promise<{ id: string }>;
  setDocument: (collectionName: string, docId: string, data: any) => Promise<{ id: string }>;
  getDocument: (collectionName: string, docId: string) => Promise<any>;
  getDocuments: (collectionName: string, constraints?: QueryConstraint[]) => Promise<any[]>;
  updateDocument: (collectionName: string, docId: string, data: any) => Promise<{ id: string }>;
  deleteDocument: (collectionName: string, docId: string) => Promise<{ id: string }>;
  uploadFile: (storagePath: string, file: File) => Promise<string>;
  deleteFile: (storagePath: string) => Promise<boolean>;
  where: typeof import('firebase/firestore').where;
  orderBy: typeof import('firebase/firestore').orderBy;
  limit: typeof import('firebase/firestore').limit;
  serverTimestamp: () => Timestamp;
};

const FirestoreContext = createContext<FirestoreContextType | undefined>(undefined);

export function useFirestoreContext() {
  const context = useContext(FirestoreContext);
  if (context === undefined) {
    throw new Error('useFirestoreContext must be used within a FirestoreProvider');
  }
  return context;
}

type FirestoreProviderProps = {
  children: ReactNode;
};

export function FirestoreProvider({ children }: FirestoreProviderProps) {
  const firestore = useFirestore();

  return (
    <FirestoreContext.Provider value={firestore}>
      {children}
    </FirestoreContext.Provider>
  );
} 