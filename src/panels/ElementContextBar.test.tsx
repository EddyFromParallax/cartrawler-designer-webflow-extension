import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ElementContextBar } from "./ElementContextBar.js";

describe("ElementContextBar", () => {
  it("shows prompt when no element is selected", () => {
    render(<ElementContextBar tag={null} text={null} binding={null} onUnbind={vi.fn()} />);
    expect(screen.getByText("Select an element on the canvas to bind a key")).toBeInTheDocument();
  });

  it("shows tag badge and text when element is selected", () => {
    render(<ElementContextBar tag="H1" text="Find your perfect car" binding={null} onUnbind={vi.fn()} />);
    expect(screen.getByText("H1")).toBeInTheDocument();
    expect(screen.getByText(/Find your perfect car/)).toBeInTheDocument();
  });

  it("shows 'No binding' when element has no binding", () => {
    render(<ElementContextBar tag="H1" text="Hello" binding={null} onUnbind={vi.fn()} />);
    expect(screen.getByText("No binding")).toBeInTheDocument();
  });

  it("shows binding info and Unbind link when binding exists", () => {
    render(
      <ElementContextBar
        tag="H1"
        text="Hello"
        binding={{ key: "koios:hero.title", placement: "static" }}
        onUnbind={vi.fn()}
      />
    );
    expect(screen.getByText(/koios:hero.title/)).toBeInTheDocument();
    expect(screen.getByText(/static/)).toBeInTheDocument();
    expect(screen.getByText("Unbind")).toBeInTheDocument();
  });

  it("fires onUnbind when Unbind is clicked", () => {
    const onUnbind = vi.fn();
    render(
      <ElementContextBar
        tag="H1"
        text="Hello"
        binding={{ key: "koios:hero.title", placement: "static" }}
        onUnbind={onUnbind}
      />
    );
    fireEvent.click(screen.getByText("Unbind"));
    expect(onUnbind).toHaveBeenCalledOnce();
  });
});
