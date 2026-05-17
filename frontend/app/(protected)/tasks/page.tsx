"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TasksView from "@/components/tasks/TasksView";
import type { Filter } from "@/lib/types";


function TasksPageInner() {
  const sp = useSearchParams();
  const raw = sp.get("filter");
  const filter: Filter = raw === "active" || raw === "completed" ? raw : "all";
  return <TasksView filter={filter} />;
}


export default function TasksPage() {
  return (
    <Suspense fallback={<div className="container">Loading…</div>}>
      <TasksPageInner />
    </Suspense>
  );
}
