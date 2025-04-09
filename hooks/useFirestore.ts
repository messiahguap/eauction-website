"use client"

import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  DocumentData,
  QueryConstraint,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export function useFirestore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add a document to a collection
  const addDocument = async (collectionName: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      setLoading(false);
      return { id: docRef.id };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Set a document with a specific ID
  const setDocument = async (collectionName: string, docId: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      
      await setDoc(doc(db, collectionName, docId), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      setLoading(false);
      return { id: docId };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Get a document by ID
  const getDocument = async (collectionName: string, docId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const docSnap = await getDoc(doc(db, collectionName, docId));
      
      setLoading(false);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Get documents with optional query constraints
  const getDocuments = async (
    collectionName: string, 
    constraints: QueryConstraint[] = []
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setLoading(false);
      return documents;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Update a document
  const updateDocument = async (collectionName: string, docId: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      
      await updateDoc(doc(db, collectionName, docId), {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      setLoading(false);
      return { id: docId };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Delete a document
  const deleteDocument = async (collectionName: string, docId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteDoc(doc(db, collectionName, docId));
      
      setLoading(false);
      return { id: docId };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Upload a file to storage and return the download URL
  const uploadFile = async (
    storagePath: string, 
    file: File
  ): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setLoading(false);
      return downloadURL;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Delete a file from storage
  const deleteFile = async (storagePath: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
      
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    loading,
    error,
    addDocument,
    setDocument,
    getDocument,
    getDocuments,
    updateDocument,
    deleteDocument,
    uploadFile,
    deleteFile,
    // Utility functions
    where,
    orderBy,
    limit,
    serverTimestamp
  };
} 