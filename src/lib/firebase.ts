import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyATt3FIpJi5Hicc07RnjpTPzj4PVz1jHRM",
  authDomain: "link-earner-edcc7.firebaseapp.com",
  projectId: "link-earner-edcc7",
  storageBucket: "link-earner-edcc7.firebasestorage.app",
  messagingSenderId: "809501561540",
  appId: "1:809501561540:web:24611993546c29043faf91",
  measurementId: "G-60FHR6LEJL"
};

// 1. Initialize App (Check if already initialized to prevent Next.js errors)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 2. Export Database and Auth for use in our app
export const db = getFirestore(app);
export const auth = getAuth(app);