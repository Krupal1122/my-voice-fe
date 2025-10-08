// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut, type Auth } from "firebase/auth";
import { getFirestore, collection, addDoc, setDoc, getDocs, doc, updateDoc, onSnapshot, deleteDoc, query, where } from "firebase/firestore";
import { getFunctions, httpsCallable, type Functions } from "firebase/functions";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // ✅ must be .appspot.com
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
let auth: Auth;
let db: any;
let functions: Functions;

try {
  // Initialize analytics only if available
  if (typeof window !== 'undefined') {
    getAnalytics(app);
  }
  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app, 'us-central1');
  console.log('Firebase initialized successfully');
  console.log('Auth instance:', auth);
  console.log('Firestore instance:', db);
  console.log('Functions instance:', functions);
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Fallback initialization without analytics if needed
  auth = getAuth(app);
  db = getFirestore(app); 
  functions = getFunctions(app);
  console.log('Firebase fallback initialization completed');
}

export { 
  auth, 
  db,
  functions,
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithEmailAndPassword,
  signOut,
  collection,
  addDoc,
  setDoc,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  query,
  where,
  httpsCallable
};