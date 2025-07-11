
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// IMPORTANT: Replace with your own Firebase project configuration.
const firebaseConfig = {
  apiKey: "AIzaSyA9onZiibMHGcJpqD8N61EEIzr6Y0V7ZHI",
  authDomain: "projetoes-14c61.firebaseapp.com",
  projectId: "projetoes-14c61",
  storageBucket: "projetoes-14c61.firebasestorage.app",
  messagingSenderId: "922199463173",
  appId: "1:922199463173:web:5fc53e90dea727ff2cd36c",
  measurementId: "G-TDBP0YJB4X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
