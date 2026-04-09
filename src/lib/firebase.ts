import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPrdlRCQpZ-V0Yl9moeRL72gTJCMlM4WU",
  authDomain: "mandel-family-recipes.firebaseapp.com",
  projectId: "mandel-family-recipes",
  storageBucket: "mandel-family-recipes.firebasestorage.app",
  messagingSenderId: "651684354963",
  appId: "1:651684354963:web:1fa452db3a6cafa6a52666",
  measurementId: "G-X149SHQYKE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
