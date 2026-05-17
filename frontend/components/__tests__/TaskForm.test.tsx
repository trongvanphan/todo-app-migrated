import { render, screen, fireEvent } from "@testing-library/react";
import { TaskForm } from "../TaskForm";

jest.mock("@/lib/api");
jest.mock("next-auth/react");

describe("TaskForm", () => {
  it("does not call onCreate when title is empty", () => {
    const onCreate = jest.fn();
    render(<TaskForm onCreate={onCreate} />);
    const input = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.submit(input.closest("form")!);
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("does not call onCreate when title is whitespace only", () => {
    const onCreate = jest.fn();
    render(<TaskForm onCreate={onCreate} />);
    const input = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.submit(input.closest("form")!);
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("calls onCreate with trimmed title on submit", () => {
    const onCreate = jest.fn();
    render(<TaskForm onCreate={onCreate} />);
    const input = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(input, { target: { value: "Buy milk" } });
    fireEvent.submit(input.closest("form")!);
    expect(onCreate).toHaveBeenCalledWith("Buy milk");
  });

  it("clears input on Escape", () => {
    const onCreate = jest.fn();
    render(<TaskForm onCreate={onCreate} />);
    const input = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(input).toHaveValue("");
  });
});
