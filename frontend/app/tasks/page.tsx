import { TasksContainer } from "@/components/TasksContainer";

interface TasksPageProps {
  searchParams: { completed?: string };
}

export default function TasksPage({ searchParams }: TasksPageProps) {
  return <TasksContainer completed={searchParams.completed} />;
}
