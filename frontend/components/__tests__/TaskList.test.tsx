import { render, screen } from "@testing-library/react";
import { TaskList } from "../TaskList";

const mockTask = { id: 1, title: "Buy milk", completed: false, created_at: "2026-01-01T00:00:00" };

describe("TaskList", () => {
  it("renders empty state when no tasks", () => {
    render(
      <TaskList tasks={[]} completed={undefined} onUpdate={jest.fn()} onDelete={jest.fn()} />
    );
    expect(screen.getByText("No tasks")).toBeInTheDocument();
  });

  it("renders task items when tasks exist", () => {
    render(
      <TaskList tasks={[mockTask]} completed={undefined} onUpdate={jest.fn()} onDelete={jest.fn()} />
    );
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
  });

  it("marks All filter as active when completed is undefined", () => {
    render(
      <TaskList tasks={[]} completed={undefined} onUpdate={jest.fn()} onDelete={jest.fn()} />
    );
    const allLink = screen.getByText("All");
    expect(allLink).toHaveClass("text-white");
  });

  it("marks Active filter as active when completed is false", () => {
    render(
      <TaskList tasks={[]} completed="false" onUpdate={jest.fn()} onDelete={jest.fn()} />
    );
    const activeLink = screen.getByText("Active");
    expect(activeLink).toHaveClass("text-white");
  });
});
