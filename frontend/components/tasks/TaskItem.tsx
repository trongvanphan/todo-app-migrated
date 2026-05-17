"use client";

import type { Task } from "@/lib/types";


export default function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (t: Task) => void;
  onDelete: (t: Task) => void;
}) {
  return (
    <li className={`task-item ${task.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" ${task.completed ? "active" : "completed"}`}
      />
      <span className="task-title">{task.title}</span>
      <button className="icon-btn" onClick={() => onDelete(task)} aria-label="Delete">
        ×
      </button>
    </li>
  );
}
