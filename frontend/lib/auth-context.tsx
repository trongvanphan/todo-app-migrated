"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  getFirebase,
  signInWithGoogle,
  signInWithGithub,
  signInAnonymously,
  signOut,
} from "./firebase";


type AuthValue = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: typeof signInWithGoogle;
  signInWithGithub: typeof signInWithGithub;
  signInAnonymously: typeof signInAnonymously;
  signOut: typeof signOut;
};


const AuthContext = createContext<AuthValue | null>(null);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { auth } = getFirebase();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signInWithGithub, signInAnonymously, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
