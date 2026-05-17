"use client";

import Link from "next/link";
import type { Task, TaskUpdate } from "@/lib/api";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  completed?: string;
  onUpdate: (id: number, changes: TaskUpdate) => void;
  onDelete: (id: number) => void;
}

const FILTERS = [
  { label: "All", href: "/tasks", value: undefined },
  { label: "Active", href: "/tasks?completed=false", value: "false" },
  { label: "Completed", href: "/tasks?completed=true", value: "true" },
];

export function TaskList({ tasks, completed, onUpdate, onDelete }: TaskListProps) {
  return (
    <div>
      {/* Filter tabs */}
      <ul className="flex gap-3 mb-6 text-base sm540:text-lg">
        {FILTERS.map((filter) => (
          <li key={filter.label}>
            <Link
              href={filter.href}
              className={
                completed === filter.value
                  ? "text-white font-semibold"
                  : "text-gray-400 hover:text-gray-200 transition-colors"
              }
            >
              {filter.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Task list */}
      <div className="border-t border-gray-700">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tasks</p>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={(changes) => onUpdate(task.id, changes)}
              onDelete={() => onDelete(task.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
