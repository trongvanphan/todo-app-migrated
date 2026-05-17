import { render, screen, fireEvent } from "@testing-library/react";
import { TaskItem } from "../TaskItem";

jest.mock("@/lib/api");
jest.mock("next-auth/react");

const mockTask = {
  id: 1,
  title: "Buy milk",
  completed: false,
  created_at: "2026-01-01T00:00:00",
};

describe("TaskItem", () => {
  it("does not call onUpdate when blur with empty title", () => {
    const onUpdate = jest.fn();
    render(<TaskItem task={mockTask} onUpdate={onUpdate} onDelete={jest.fn()} />);
    fireEvent.click(screen.getByLabelText("Edit task"));
    const input = screen.getByDisplayValue("Buy milk");
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("does not call onUpdate when blur with unchanged title", () => {
    const onUpdate = jest.fn();
    render(<TaskItem task={mockTask} onUpdate={onUpdate} onDelete={jest.fn()} />);
    fireEvent.click(screen.getByLabelText("Edit task"));
    const input = screen.getByDisplayValue("Buy milk");
    fireEvent.blur(input);
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("calls onUpdate with new title when blur with changed title", () => {
    const onUpdate = jest.fn();
    render(<TaskItem task={mockTask} onUpdate={onUpdate} onDelete={jest.fn()} />);
    fireEvent.click(screen.getByLabelText("Edit task"));
    const input = screen.getByDisplayValue("Buy milk");
    fireEvent.change(input, { target: { value: "Buy groceries" } });
    fireEvent.blur(input);
    expect(onUpdate).toHaveBeenCalledWith({ title: "Buy groceries" });
  });

  it("does not call onUpdate on Escape — cancels edit", () => {
    const onUpdate = jest.fn();
    render(<TaskItem task={mockTask} onUpdate={onUpdate} onDelete={jest.fn()} />);
    fireEvent.click(screen.getByLabelText("Edit task"));
    const input = screen.getByDisplayValue("Buy milk");
    fireEvent.change(input, { target: { value: "Changed" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onUpdate).not.toHaveBeenCalled();
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
  });

  it("calls onUpdate with completed:true when toggle clicked on incomplete task", () => {
    const onUpdate = jest.fn();
    render(<TaskItem task={mockTask} onUpdate={onUpdate} onDelete={jest.fn()} />);
    fireEvent.click(screen.getByLabelText("Mark complete"));
    expect(onUpdate).toHaveBeenCalledWith({ completed: true });
  });
});
