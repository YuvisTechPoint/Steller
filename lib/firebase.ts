import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider, Auth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// Initialize Firebase with error handling
let app: FirebaseApp;
let auth: Auth;
let githubProvider: GithubAuthProvider;
let googleProvider: GoogleAuthProvider;

try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    githubProvider = new GithubAuthProvider();
    googleProvider = new GoogleAuthProvider();
} catch (error) {
    console.warn("Firebase initialization failed. Using demo mode:", error);
    // Create a mock app for development without Firebase
    app = {} as FirebaseApp;
    auth = {} as Auth;
    githubProvider = new GithubAuthProvider();
    googleProvider = new GoogleAuthProvider();
}

export { auth, githubProvider, googleProvider };
