import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StringList } from "./StringList.js";
import type { KoiosStringEntry } from "../types.js";

const STRINGS: KoiosStringEntry[] = [
  { key: "koios:hero.title", value: "Find your perfect car", locale: "en-GB" },
  { key: "koios:cta.book_now", value: "Book Now", locale: "en-GB" },
];

describe("StringList", () => {
  it("renders values as primary text and keys as secondary", () => {
    render(<StringList strings={STRINGS} boundKey={null} flashKey={null} disabled={false} onSelect={vi.fn()} />);
    expect(screen.getByText("Find your perfect car")).toBeInTheDocument();
    expect(screen.getByText("koios:hero.title")).toBeInTheDocument();
    expect(screen.getByText("Book Now")).toBeInTheDocument();
    expect(screen.getByText("koios:cta.book_now")).toBeInTheDocument();
  });

  it("shows a bound badge on the matching row", () => {
    render(<StringList strings={STRINGS} boundKey="koios:hero.title" flashKey={null} disabled={false} onSelect={vi.fn()} />);
    expect(screen.getByText("bound")).toBeInTheDocument();
  });

  it("fires onSelect with the correct key on row click", () => {
    const onSelect = vi.fn();
    render(<StringList strings={STRINGS} boundKey={null} flashKey={null} disabled={false} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Book Now"));
    expect(onSelect).toHaveBeenCalledWith("koios:cta.book_now");
  });

  it("does not fire onSelect when disabled", () => {
    const onSelect = vi.fn();
    render(<StringList strings={STRINGS} boundKey={null} flashKey={null} disabled={true} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Book Now"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("applies flash class when flashKey matches a row", () => {
    const { container } = render(
      <StringList strings={STRINGS} boundKey={null} flashKey="koios:hero.title" disabled={false} onSelect={vi.fn()} />
    );
    const flashRow = container.querySelector(".string-row--flash");
    expect(flashRow).toBeInTheDocument();
  });
});
