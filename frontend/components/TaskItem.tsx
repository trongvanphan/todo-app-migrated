"use client";

import { useEffect, useRef, useState } from "react";
import type { Task, TaskUpdate } from "@/lib/api";

interface TaskItemProps {
  task: Task;
  onUpdate: (changes: TaskUpdate) => void;
  onDelete: () => void;
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef(false);

  // autoFocus via useRef + useEffect — SSR-safe (mirrors Angular AutoFocusDirective)
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const startEdit = () => {
    setEditTitle(task.title);
    cancelRef.current = false;
    setIsEditing(true);
  };

  const handleSave = () => {
    if (cancelRef.current) return;
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdate({ title: trimmed });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    cancelRef.current = true;
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <div
      className={`flex items-center gap-3 py-3 sm540:py-4 border-b border-gray-700 min-h-[60px] ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      {/* Toggle completion */}
      <button
        onClick={() => onUpdate({ completed: !task.completed })}
        className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors"
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed && (
          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Title / edit input */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-white text-lg sm540:text-2xl focus:outline-none border-b border-gray-500"
          />
        ) : (
          <span
            className={`text-lg sm540:text-2xl ${
              task.completed ? "line-through text-gray-500" : "text-white"
            }`}
          >
            {task.title}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isEditing ? (
          <button
            onClick={handleCancel}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Cancel editing"
          >
            ✕
          </button>
        ) : (
          <>
            <button
              onClick={startEdit}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors"
              aria-label="Edit task"
            >
              ✎
            </button>
            <button
              onClick={onDelete}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors"
              aria-label="Delete task"
            >
              ✕
            </button>
          </>
        )}
      </div>
    </div>
  );
}
