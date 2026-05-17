import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInAnonymously as fbSignInAnonymously,
  signOut as fbSignOut,
  Auth,
} from "firebase/auth";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;


export function getFirebase(): { app: FirebaseApp; auth: Auth } {
  if (!_app) {
    _app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    _auth = getAuth(_app);
  }
  return { app: _app, auth: _auth! };
}


export async function signInWithGoogle() {
  const { auth } = getFirebase();
  return signInWithPopup(auth, new GoogleAuthProvider());
}


export async function signInWithGithub() {
  const { auth } = getFirebase();
  return signInWithPopup(auth, new GithubAuthProvider());
}


export async function signInAnonymously() {
  const { auth } = getFirebase();
  return fbSignInAnonymously(auth);
}


export async function signOut() {
  const { auth } = getFirebase();
  return fbSignOut(auth);
}
