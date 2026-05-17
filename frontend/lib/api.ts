import { getSession } from "next-auth/react";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

export interface TaskUpdate {
  title?: string;
  completed?: boolean;
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const session = await getSession();
  const token = (session as any)?.accessToken;

  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${await response.text()}`);
  }

  return response;
}

export async function getTasks(completed?: string): Promise<Task[]> {
  const url = completed !== undefined ? `/tasks?completed=${completed}` : "/tasks";
  const res = await apiFetch(url);
  return res.json();
}

export async function createTask(title: string): Promise<Task> {
  const res = await apiFetch("/tasks", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function updateTask(id: number, changes: TaskUpdate): Promise<Task> {
  const res = await apiFetch(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
  return res.json();
}

export async function deleteTask(id: number): Promise<void> {
  await apiFetch(`/tasks/${id}`, { method: "DELETE" });
}
