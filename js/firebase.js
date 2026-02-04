import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyArLV5gn4tvMvpI_pY7tLDXJrskhTZGI4Q",
  authDomain: "hotelmanagementsystem-891c1.firebaseapp.com",
  projectId: "hotelmanagementsystem-891c1",
  storageBucket: "hotelmanagementsystem-891c1.firebasestorage.app",
  messagingSenderId: "1016045938719",
  appId: "1:1016045938719:web:e1688f535fb5d461ff4d2a",
  measurementId: "G-5GYW5KGVGP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ EXPORT EVERYTHING YOU USE
export const auth = getAuth(app);
export const db = getFirestore(app);
