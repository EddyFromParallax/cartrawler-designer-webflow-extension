import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SyncTriggerPanel } from "./SyncTriggerPanel.js";
import type { DataClient } from "../data-client.js";

const LOCALES = ["en-GB", "de-DE", "fr-FR"];

function makeClient(overrides: Partial<DataClient> = {}): DataClient {
  return {
    fetchKoiosStrings: vi.fn(),
    triggerSync: vi.fn(async () => ({ added: 3, updated: 1, removed: 0, unchanged: 20 })),
    fetchManifest: vi.fn(),
    ...overrides,
  } as unknown as DataClient;
}

describe("SyncTriggerPanel", () => {
  it("calls triggerSync with the selected locale when Sync Now is clicked", async () => {
    const client = makeClient();
    render(<SyncTriggerPanel locales={LOCALES} dataClient={client} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "de-DE" } });
    fireEvent.click(screen.getByText("Sync Now"));
    await waitFor(() => expect(client.triggerSync).toHaveBeenCalledWith("de-DE"));
  });

  it("shows result counts after a successful sync", async () => {
    render(<SyncTriggerPanel locales={LOCALES} dataClient={makeClient()} />);
    fireEvent.click(screen.getByText("Sync Now"));
    await waitFor(() => screen.getByText("Added: 3"));
    expect(screen.getByText("Updated: 1")).toBeInTheDocument();
    expect(screen.getByText("Removed: 0")).toBeInTheDocument();
    expect(screen.getByText("Unchanged: 20")).toBeInTheDocument();
  });

  it("shows error message when sync fails", async () => {
    const client = makeClient({
      triggerSync: vi.fn(async () => { throw new Error("Sync timeout"); }),
    });
    render(<SyncTriggerPanel locales={LOCALES} dataClient={client} />);
    fireEvent.click(screen.getByText("Sync Now"));
    await waitFor(() => screen.getByRole("alert"));
    expect(screen.getByRole("alert")).toHaveTextContent("Sync timeout");
  });

  it("disables the button while sync is in progress", async () => {
    let resolve!: (v: unknown) => void;
    const client = makeClient({
      triggerSync: vi.fn(() => new Promise((res) => { resolve = res; })),
    });
    render(<SyncTriggerPanel locales={LOCALES} dataClient={client} />);
    fireEvent.click(screen.getByText("Sync Now"));
    expect(screen.getByText("Sync Now")).toBeDisabled();
    resolve({ added: 0, updated: 0, removed: 0, unchanged: 0 });
    await waitFor(() => expect(screen.getByText("Sync Now")).not.toBeDisabled());
  });
});
