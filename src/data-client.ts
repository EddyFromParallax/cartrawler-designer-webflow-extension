import type { KoiosStringEntry, SyncResult } from "./types.js";
import {
  TRANSLATIONS_API_PATH,
  API_SUBPATH_KOIOS,
  API_SUBPATH_SYNC,
  API_SUBPATH_MANIFEST,
} from "@cartrawler/translations-core";

export class DataClient {
  private baseUrl: string;

  constructor(baseUrl: string = TRANSLATIONS_API_PATH) {
    this.baseUrl = baseUrl;
  }

  async fetchKoiosStrings(locale: string): Promise<KoiosStringEntry[]> {
    const res = await fetch(`${this.baseUrl}${API_SUBPATH_KOIOS}/${locale}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch KOIOS strings for locale "${locale}": ${res.status}`);
    }
    return res.json() as Promise<KoiosStringEntry[]>;
  }

  async triggerSync(locale: string): Promise<SyncResult> {
    const res = await fetch(`${this.baseUrl}${API_SUBPATH_SYNC}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    });
    if (!res.ok) {
      throw new Error(`Sync failed for locale "${locale}": ${res.status}`);
    }
    return res.json() as Promise<SyncResult>;
  }

  async fetchManifest(): Promise<Record<string, unknown>> {
    const res = await fetch(`${this.baseUrl}${API_SUBPATH_MANIFEST}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch manifest: ${res.status}`);
    }
    return res.json() as Promise<Record<string, unknown>>;
  }
}
