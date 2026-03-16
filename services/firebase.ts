
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

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


// Initialize the Gemini Developer API backend service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
const model = getGenerativeModel(ai, { model: "gemini-3-flash-preview" });


// Wrap in an async function so you can use await
async function run() {
  // Provide a prompt that contains text
  const prompt =
    "";

  // To generate text output, call generateContent with the text input
  const result = await model.generateContent(prompt);

  const response = result.response;
  const text = response.text();
  console.log(text);
}

run();