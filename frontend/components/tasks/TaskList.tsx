"use client";

import type { Task } from "@/lib/types";
import TaskItem from "./TaskItem";


export default function TaskList({
  tasks,
  onToggle,
  onDelete,
}: {
  tasks: Task[];
  onToggle: (t: Task) => void;
  onDelete: (t: Task) => void;
}) {
  if (tasks.length === 0) return <p style={{ color: "#888", marginTop: 24 }}>No tasks.</p>;
  return (
    <ul className="task-list">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}
