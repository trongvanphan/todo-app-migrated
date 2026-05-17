"use client";

import { useRef, useState } from "react";

interface TaskFormProps {
  onCreate: (title: string) => void;
}

export function TaskForm({ onCreate }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate(title.trim());
    setTitle("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 mt-10">
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What needs to be done?"
        autoFocus
        className="w-full bg-transparent border-b border-gray-600 text-white text-2xl sm540:text-3xl font-light placeholder-gray-600 focus:outline-none focus:border-gray-400 pb-2"
      />
    </form>
  );
}
