import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { StatusDashboardPanel } from "./StatusDashboardPanel.js";
import type { DataClient } from "../data-client.js";
import type { KoiosStringEntry } from "../types.js";

const enStrings: KoiosStringEntry[] = [
  { key: "koios:car.title", value: "Car Rental", locale: "en-GB" },
  { key: "koios:flight.search", value: "Find Flights", locale: "en-GB" },
];
const deStrings: KoiosStringEntry[] = [
  { key: "koios:car.title", value: "Autovermietung", locale: "de-DE" },
];

function makeClient(): DataClient {
  return {
    fetchKoiosStrings: vi.fn(async (locale: string) => {
      if (locale === "en-GB") return enStrings;
      if (locale === "de-DE") return deStrings;
      return [];
    }),
    triggerSync: vi.fn(),
    fetchManifest: vi.fn(),
  } as unknown as DataClient;
}

describe("StatusDashboardPanel", () => {
  it("shows loading state initially", () => {
    const client = {
      fetchKoiosStrings: vi.fn(() => new Promise(() => {})),
    } as unknown as DataClient;
    render(<StatusDashboardPanel locales={["en-GB"]} dataClient={client} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders one row per locale", async () => {
    render(<StatusDashboardPanel locales={["en-GB", "de-DE"]} dataClient={makeClient()} />);
    await waitFor(() => screen.getByText(/en-GB/));
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
  });

  it("shows percentage for each locale", async () => {
    render(<StatusDashboardPanel locales={["en-GB", "de-DE"]} dataClient={makeClient()} />);
    await waitFor(() => screen.getByText(/en-GB: 100%/));
    expect(screen.getByText(/de-DE: 50%/)).toBeInTheDocument();
  });

  it("marks low-coverage locales (< 50%) with data-low attribute", async () => {
    const lowClient: DataClient = {
      fetchKoiosStrings: vi.fn(async (locale: string) => {
        if (locale === "en-GB") return enStrings;
        return [];
      }),
      triggerSync: vi.fn(),
      fetchManifest: vi.fn(),
    } as unknown as DataClient;
    render(<StatusDashboardPanel locales={["en-GB", "fr-FR"]} dataClient={lowClient} />);
    await waitFor(() => screen.getByText(/fr-FR/));
    const frItem = screen.getByText(/fr-FR/).closest("li");
    expect(frItem).toHaveAttribute("data-low", "true");
    const enItem = screen.getByText(/en-GB/).closest("li");
    expect(enItem).not.toHaveAttribute("data-low");
  });

  it("shows error state on fetch failure", async () => {
    const badClient: DataClient = {
      fetchKoiosStrings: vi.fn(async () => { throw new Error("Service unavailable"); }),
      triggerSync: vi.fn(),
      fetchManifest: vi.fn(),
    } as unknown as DataClient;
    render(<StatusDashboardPanel locales={["en-GB"]} dataClient={badClient} />);
    await waitFor(() => screen.getByRole("alert"));
    expect(screen.getByRole("alert")).toHaveTextContent("Service unavailable");
  });
});
