"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, deleteTask, getTasks, updateTask, type Task, type TaskUpdate } from "@/lib/api";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";

interface TasksContainerProps {
  completed?: string;
}

export function TasksContainer({ completed }: TasksContainerProps) {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks", completed],
    queryFn: () => getTasks(completed),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["tasks"] });

  const createMutation = useMutation({
    mutationFn: (title: string) => createTask(title),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, changes }: { id: number; changes: TaskUpdate }) =>
      updateTask(id, changes),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: invalidate,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <TaskForm onCreate={(title) => createMutation.mutate(title)} />
      <TaskList
        tasks={tasks}
        completed={completed}
        onUpdate={(id, changes) => updateMutation.mutate({ id, changes })}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </div>
  );
}
