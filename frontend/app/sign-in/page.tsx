"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";


export default function SignInPage() {
  const { user, loading, signInWithGoogle, signInWithGithub, signInAnonymously } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/tasks");
  }, [user, loading, router]);

  return (
    <div className="container">
      <div className="card">
        <h1>Sign in</h1>
        <div className="signin-stack">
          <button className="btn btn-primary" onClick={() => signInWithGoogle()}>
            Sign in with Google
          </button>
          <button className="btn" onClick={() => signInWithGithub()}>
            Sign in with GitHub
          </button>
          <button className="btn" onClick={() => signInAnonymously()}>
            Continue anonymously
          </button>
        </div>
      </div>
    </div>
  );
}
