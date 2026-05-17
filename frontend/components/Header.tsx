"use client";

import { signOut, useSession } from "next-auth/react";

export function Header() {
  const { status } = useSession();

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <h1 className="text-white font-light tracking-wide">Todo App</h1>
        {status === "authenticated" && (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Sign out
          </button>
        )}
      </div>
    </header>
  );
}
