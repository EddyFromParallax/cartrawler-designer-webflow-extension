import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BindPanel } from "./BindPanel.js";
import type { WebflowBridge } from "../webflow-bridge.js";
import type { WebflowElement, BoundKey, KoiosStringEntry } from "../types.js";
import type { DataClient } from "../data-client.js";

function makeElement(
  tag = "H1",
  text = "Welcome to our site",
  attrs: Record<string, string | null> = {},
): WebflowElement {
  return {
    getCustomAttribute: vi.fn(async (name: string) => attrs[name] ?? null),
    setCustomAttribute: vi.fn(async () => {}),
    removeCustomAttribute: vi.fn(async () => {}),
    getTagName: vi.fn(async () => tag),
    getTextContent: vi.fn(async () => text),
  };
}

function makeBridge(
  el: WebflowElement | null,
  binding: BoundKey | null = null,
): WebflowBridge {
  return {
    getSelectedElement: vi.fn(async () => el),
    getElementBinding: vi.fn(async () => binding),
    bindKey: vi.fn(async () => {}),
    unbindKey: vi.fn(async () => {}),
  } as unknown as WebflowBridge;
}

const MOCK_STRINGS: KoiosStringEntry[] = [
  { key: "koios:hero.title", value: "Find your perfect car", locale: "en-GB" },
  { key: "koios:cta.book_now", value: "Book Now", locale: "en-GB" },
];

function makeClient(): DataClient {
  return {
    fetchKoiosStrings: vi.fn(async () => MOCK_STRINGS),
    triggerSync: vi.fn(),
    fetchManifest: vi.fn(),
  } as unknown as DataClient;
}

describe("BindPanel", () => {
  it("shows prompt when no element is selected", async () => {
    render(<BindPanel bridge={makeBridge(null)} dataClient={makeClient()} locale="en-GB" />);
    await waitFor(() =>
      expect(screen.getByText("Select an element on the canvas to bind a key")).toBeInTheDocument()
    );
  });

  it("shows element tag and text when element is selected", async () => {
    render(<BindPanel bridge={makeBridge(makeElement())} dataClient={makeClient()} locale="en-GB" />);
    await waitFor(() => expect(screen.getByText("H1")).toBeInTheDocument());
    expect(screen.getByText(/Welcome to our site/)).toBeInTheDocument();
  });

  it("shows existing binding in context bar", async () => {
    const binding: BoundKey = { key: "koios:hero.title", placement: "static" };
    render(
      <BindPanel bridge={makeBridge(makeElement(), binding)} dataClient={makeClient()} locale="en-GB" />
    );
    await waitFor(() => expect(screen.getByText("Unbind")).toBeInTheDocument());
    expect(screen.getByText(/Bound: koios:hero.title/)).toBeInTheDocument();
  });

  it("filters string list when typing in search", async () => {
    render(<BindPanel bridge={makeBridge(makeElement())} dataClient={makeClient()} locale="en-GB" />);
    await waitFor(() => screen.getByText("Book Now"));
    fireEvent.change(screen.getByPlaceholderText("Search by value or key…"), {
      target: { value: "Book" },
    });
    expect(screen.queryByText("Find your perfect car")).not.toBeInTheDocument();
    expect(screen.getByText("Book Now")).toBeInTheDocument();
  });

  it("calls bridge.bindKey when clicking a row", async () => {
    const el = makeElement();
    const bridge = makeBridge(el);
    render(<BindPanel bridge={bridge} dataClient={makeClient()} locale="en-GB" />);
    await waitFor(() => screen.getByText("Book Now"));
    fireEvent.click(screen.getByText("Book Now"));
    await waitFor(() =>
      expect(bridge.bindKey).toHaveBeenCalledWith(el, "koios:cta.book_now", "static")
    );
  });

  it("calls bridge.unbindKey when clicking Unbind", async () => {
    const el = makeElement();
    const binding: BoundKey = { key: "koios:hero.title", placement: "static" };
    const bridge = makeBridge(el, binding);
    render(<BindPanel bridge={bridge} dataClient={makeClient()} locale="en-GB" />);
    await waitFor(() => screen.getByText("Unbind"));
    fireEvent.click(screen.getByText("Unbind"));
    await waitFor(() => expect(bridge.unbindKey).toHaveBeenCalledWith(el));
  });

  it("disables rows when no element is selected", async () => {
    const bridge = makeBridge(null);
    render(<BindPanel bridge={bridge} dataClient={makeClient()} locale="en-GB" />);
    await waitFor(() => screen.getByText("Book Now"));
    fireEvent.click(screen.getByText("Book Now"));
    expect(bridge.bindKey).not.toHaveBeenCalled();
  });

  it("shows error when string fetch fails", async () => {
    const client = {
      fetchKoiosStrings: vi.fn(async () => { throw new Error("Network error"); }),
      triggerSync: vi.fn(),
      fetchManifest: vi.fn(),
    } as unknown as DataClient;
    render(<BindPanel bridge={makeBridge(makeElement())} dataClient={client} locale="en-GB" />);
    await waitFor(() => screen.getByRole("alert"));
    expect(screen.getByRole("alert")).toHaveTextContent("Network error");
  });
});
