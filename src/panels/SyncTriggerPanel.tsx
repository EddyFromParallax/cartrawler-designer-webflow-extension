import { useState } from "react";
import type { SyncResult } from "../types.js";
import type { DataClient } from "../data-client.js";

interface SyncTriggerPanelProps {
  locales: string[];
  dataClient: DataClient;
}

export function SyncTriggerPanel({ locales, dataClient }: SyncTriggerPanelProps) {
  const [selectedLocale, setSelectedLocale] = useState(locales[0] ?? "");
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSync() {
    setSyncing(true);
    setError(null);
    setResult(null);
    try {
      const syncResult = await dataClient.triggerSync(selectedLocale);
      setResult(syncResult);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div>
      <select
        aria-label="Locale"
        value={selectedLocale}
        onChange={(e) => setSelectedLocale(e.target.value)}
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {locale}
          </option>
        ))}
      </select>
      <button type="button" onClick={handleSync} disabled={syncing}>
        Sync Now
      </button>
      {syncing && <p>Syncing...</p>}
      {result && (
        <ul aria-label="Sync result">
          <li>Added: {result.added}</li>
          <li>Updated: {result.updated}</li>
          <li>Removed: {result.removed}</li>
          <li>Unchanged: {result.unchanged}</li>
        </ul>
      )}
      {error && <div role="alert">{error}</div>}
    </div>
  );
}
