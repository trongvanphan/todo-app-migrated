"use client";

import Link from "next/link";
import type { Filter } from "@/lib/types";


const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];


export default function TaskFooter({ remaining, filter }: { remaining: number; filter: Filter }) {
  return (
    <div className="footer">
      <span>
        {remaining} item{remaining === 1 ? "" : "s"} left
      </span>
      <nav style={{ display: "flex", gap: 4 }}>
        {filters.map((f) => (
          <Link
            key={f.key}
            href={f.key === "all" ? "/tasks" : `/tasks?filter=${f.key}`}
            className={filter === f.key ? "active" : ""}
          >
            {f.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
