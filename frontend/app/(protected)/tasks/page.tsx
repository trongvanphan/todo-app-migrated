"use client";

import { useSearchParams } from "next/navigation";
import TasksView from "@/components/tasks/TasksView";
import type { Filter } from "@/lib/types";


export default function TasksPage() {
  const sp = useSearchParams();
  const raw = sp.get("filter");
  const filter: Filter = raw === "active" || raw === "completed" ? raw : "all";
  return <TasksView filter={filter} />;
}
