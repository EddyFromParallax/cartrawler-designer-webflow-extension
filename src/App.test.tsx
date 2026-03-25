import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { App } from "./App.js";
import type { WebflowBridge } from "./webflow-bridge.js";
import type { DataClient } from "./data-client.js";
import type { WebflowElement } from "./types.js";

function makeElement(): WebflowElement {
  return {
    getCustomAttribute: vi.fn(async () => null),
    setCustomAttribute: vi.fn(async () => {}),
    removeCustomAttribute: vi.fn(async () => {}),
    getTagName: vi.fn(async () => "DIV"),
    getTextContent: vi.fn(async () => "mock text"),
  };
}

function makeBridge(): WebflowBridge {
  return {
    getSelectedElement: vi.fn(async () => makeElement()),
    getElementBinding: vi.fn(async () => null),
    bindKey: vi.fn(async () => {}),
    unbindKey: vi.fn(async () => {}),
  } as unknown as WebflowBridge;
}

function makeClient(): DataClient {
  return {
    fetchKoiosStrings: vi.fn(async () => []),
    triggerSync: vi.fn(async () => ({ added: 0, updated: 0, removed: 0, unchanged: 0 })),
    fetchManifest: vi.fn(async () => ({})),
  } as unknown as DataClient;
}

const LOCALES = ["en-GB", "de-DE"];

describe("App", () => {
  it("renders all 3 tab buttons", () => {
    render(<App bridge={makeBridge()} dataClient={makeClient()} locales={LOCALES} />);
    expect(screen.getByText("Bind")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Sync")).toBeInTheDocument();
  });

  it("defaults to the bind panel", async () => {
    render(<App bridge={makeBridge()} dataClient={makeClient()} locales={LOCALES} />);
    const bindTab = screen.getByText("Bind");
    expect(bindTab).toHaveAttribute("aria-current", "page");
  });

  it("switches to the Status panel when the Status tab is clicked", async () => {
    render(<App bridge={makeBridge()} dataClient={makeClient()} locales={LOCALES} />);
    fireEvent.click(screen.getByText("Status"));
    await waitFor(() => expect(screen.getByText("Status")).toHaveAttribute("aria-current", "page"));
  });

  it("switches to the Sync panel when the Sync tab is clicked", () => {
    render(<App bridge={makeBridge()} dataClient={makeClient()} locales={LOCALES} />);
    fireEvent.click(screen.getByText("Sync"));
    expect(screen.getByText("Sync Now")).toBeInTheDocument();
  });
});
