"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import * as api from "@/lib/api";
import type { Task, Filter } from "@/lib/types";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import TaskFooter from "./TaskFooter";


export default function TasksView({ filter }: { filter: Filter }) {
  const { user, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setTasks(await api.listTasks(filter));
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  }, [filter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onCreate = async (title: string) => {
    await api.createTask(title);
    await refresh();
  };

  const onToggle = async (t: Task) => {
    await api.updateTask(t.id, { completed: !t.completed });
    await refresh();
  };

  const onDelete = async (t: Task) => {
    await api.deleteTask(t.id);
    await refresh();
  };

  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>todos</h1>
          <button className="btn" onClick={() => signOut()}>
            Sign out ({user?.email || user?.uid.slice(0, 6)})
          </button>
        </div>
        <TaskForm onCreate={onCreate} />
        {error && <div style={{ color: "#c33", margin: "8px 0" }}>{error}</div>}
        <TaskList tasks={tasks} onToggle={onToggle} onDelete={onDelete} />
        <TaskFooter remaining={remaining} filter={filter} />
      </div>
    </div>
  );
}
