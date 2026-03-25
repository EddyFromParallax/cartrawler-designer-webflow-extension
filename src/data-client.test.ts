import { describe, it, expect, vi, afterEach } from "vitest";
import { DataClient } from "./data-client.js";

const BASE = "/api/translations";

function mockFetch(status: number, body: unknown) {
  return vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response);
}

afterEach(() => vi.restoreAllMocks());

describe("DataClient.fetchKoiosStrings", () => {
  it("requests the correct URL for a locale", async () => {
    const spy = mockFetch(200, []);
    await new DataClient().fetchKoiosStrings("en-GB");
    expect(spy).toHaveBeenCalledWith(`${BASE}/koios/en-GB`);
  });

  it("returns parsed JSON on success", async () => {
    const payload = [{ key: "koios:car.title", value: "Car Rental", locale: "en-GB" }];
    mockFetch(200, payload);
    const result = await new DataClient().fetchKoiosStrings("en-GB");
    expect(result).toEqual(payload);
  });

  it("throws a descriptive error on non-ok status", async () => {
    mockFetch(500, null);
    await expect(new DataClient().fetchKoiosStrings("en-GB")).rejects.toThrow(
      /Failed to fetch KOIOS strings.*en-GB.*500/
    );
  });
});

describe("DataClient.triggerSync", () => {
  it("POSTs to the sync endpoint with the locale in the body", async () => {
    const spy = mockFetch(200, { added: 1, updated: 0, removed: 0, unchanged: 5 });
    await new DataClient().triggerSync("de-DE");
    expect(spy).toHaveBeenCalledWith(
      `${BASE}/sync`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ locale: "de-DE" }),
      })
    );
  });

  it("returns parsed sync result on success", async () => {
    const payload = { added: 2, updated: 1, removed: 0, unchanged: 10 };
    mockFetch(200, payload);
    const result = await new DataClient().triggerSync("en-GB");
    expect(result).toEqual(payload);
  });

  it("throws a descriptive error on non-ok status", async () => {
    mockFetch(503, null);
    await expect(new DataClient().triggerSync("en-GB")).rejects.toThrow(
      /Sync failed.*en-GB.*503/
    );
  });
});

describe("DataClient.fetchManifest", () => {
  it("requests the manifest endpoint", async () => {
    const spy = mockFetch(200, {});
    await new DataClient().fetchManifest();
    expect(spy).toHaveBeenCalledWith(`${BASE}/manifest`);
  });

  it("returns parsed manifest on success", async () => {
    const payload = { version: "1.0", locales: ["en-GB", "de-DE"] };
    mockFetch(200, payload);
    const result = await new DataClient().fetchManifest();
    expect(result).toEqual(payload);
  });

  it("throws a descriptive error on non-ok status", async () => {
    mockFetch(404, null);
    await expect(new DataClient().fetchManifest()).rejects.toThrow(/Failed to fetch manifest.*404/);
  });
});

describe("DataClient custom baseUrl", () => {
  it("uses a custom base URL", async () => {
    const spy = mockFetch(200, []);
    await new DataClient("/custom/api").fetchKoiosStrings("en-GB");
    expect(spy).toHaveBeenCalledWith("/custom/api/koios/en-GB");
  });
});
