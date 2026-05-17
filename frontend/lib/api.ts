import { getFirebase } from "./firebase";
import type { Task, Filter } from "./types";


const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";


export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}


async function authHeaders(): Promise<HeadersInit> {
  const { auth } = getFirebase();
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}


async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...(await authHeaders()),
    ...(init.headers || {}),
  };
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {}
    throw new ApiError(res.status, detail);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}


export const listTasks = (filter: Filter = "all") =>
  apiFetch<Task[]>(`/api/tasks?filter=${filter}`);

export const createTask = (title: string) =>
  apiFetch<Task>(`/api/tasks`, { method: "POST", body: JSON.stringify({ title }) });

export const updateTask = (id: string, patch: Partial<Pick<Task, "title" | "completed">>) =>
  apiFetch<Task>(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(patch) });

export const deleteTask = (id: string) =>
  apiFetch<void>(`/api/tasks/${id}`, { method: "DELETE" });
