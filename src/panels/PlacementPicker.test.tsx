import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlacementPicker } from "./PlacementPicker.js";
import { CT_PLACEMENT_STATIC, CT_PLACEMENT_DYNAMIC, CT_PLACEMENT_LAZY } from "@cartrawler/translations-core";

describe("PlacementPicker", () => {
  it("renders three segment buttons", () => {
    render(<PlacementPicker value={CT_PLACEMENT_STATIC} onChange={vi.fn()} />);
    expect(screen.getByText("Static")).toBeInTheDocument();
    expect(screen.getByText("Dynamic")).toBeInTheDocument();
    expect(screen.getByText("Lazy")).toBeInTheDocument();
  });

  it("highlights the active segment", () => {
    render(<PlacementPicker value={CT_PLACEMENT_DYNAMIC} onChange={vi.fn()} />);
    expect(screen.getByText("Dynamic")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Static")).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Lazy")).toHaveAttribute("aria-pressed", "false");
  });

  it("fires onChange with the correct placement value on click", () => {
    const onChange = vi.fn();
    render(<PlacementPicker value={CT_PLACEMENT_STATIC} onChange={onChange} />);
    fireEvent.click(screen.getByText("Lazy"));
    expect(onChange).toHaveBeenCalledWith(CT_PLACEMENT_LAZY);
  });
});
