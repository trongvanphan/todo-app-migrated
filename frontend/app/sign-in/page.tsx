"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";


export default function SignInPage() {
  const { user, loading, signInWithGoogle, signInWithGithub, signInAnonymously } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/tasks");
  }, [user, loading, router]);

  const run = (fn: () => Promise<unknown>) => async () => {
    setError(null);
    setBusy(true);
    try {
      await fn();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Sign in</h1>
        {error && <div style={{ color: "#c33", marginBottom: 12 }}>{error}</div>}
        <div className="signin-stack">
          <button className="btn btn-primary" disabled={busy} onClick={run(signInWithGoogle)}>
            Sign in with Google
          </button>
          <button className="btn" disabled={busy} onClick={run(signInWithGithub)}>
            Sign in with GitHub
          </button>
          <button className="btn" disabled={busy} onClick={run(signInAnonymously)}>
            Continue anonymously
          </button>
        </div>
      </div>
    </div>
  );
}
