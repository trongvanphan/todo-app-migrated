"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOAuth = (provider: string) => {
    signIn(provider, { callbackUrl: "/tasks" });
  };

  const handleAnonymous = async () => {
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", { redirect: false });
    if (result?.error) {
      setError("Sign-in failed. Please try again.");
      setLoading(false);
    } else if (result?.ok) {
      router.push("/tasks");
    }
  };

  return (
    <div className="w-full max-w-xs">
      <h1 className="text-3xl font-light text-center text-white mb-9">Sign in</h1>

      {error && (
        <p className="text-red-400 text-sm text-center mb-4">{error}</p>
      )}

      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleOAuth("google")}
          className="w-full h-12 border border-gray-500 text-white bg-transparent hover:border-gray-300 transition-colors"
        >
          Google
        </button>
        <button
          onClick={() => handleOAuth("github")}
          className="w-full h-12 border border-gray-500 text-white bg-transparent hover:border-gray-300 transition-colors"
        >
          GitHub
        </button>
        <button
          onClick={handleAnonymous}
          disabled={loading}
          className="w-full h-12 border border-gray-500 text-white bg-transparent hover:border-gray-300 transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Continue as guest"}
        </button>
      </div>
    </div>
  );
}
