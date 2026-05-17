"use client";

import { FormEvent, useState } from "react";


export default function TaskForm({ onCreate }: { onCreate: (title: string) => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t || busy) return;
    setBusy(true);
    try {
      await onCreate(t);
      setTitle("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <input
        className="task-input"
        autoFocus
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={busy}
      />
    </form>
  );
}
