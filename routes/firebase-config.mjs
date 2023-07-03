// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDvfUwbchAE6Nsg2UvYeRo6aGIJG0SKvKo",
  authDomain: "project-bc1d8.firebaseapp.com",
  projectId: "project-bc1d8",
  storageBucket: "project-bc1d8.appspot.com",
  messagingSenderId: "886987436760",
  appId: "1:886987436760:web:b6434bb7ce675a43599dad",
  measurementId: "G-V5DR0EFY60"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export  const storage = getStorage(app);
export const provider = new GoogleAuthProvider();