import { useState, useEffect } from "react";
import type { KoiosStringEntry, LocaleCoverage } from "../types.js";
import type { DataClient } from "../data-client.js";
import { computeCoverage } from "../coverage.js";

interface StatusDashboardPanelProps {
  locales: string[];
  dataClient: DataClient;
}

export function StatusDashboardPanel({ locales, dataClient }: StatusDashboardPanelProps) {
  const [coverage, setCoverage] = useState<LocaleCoverage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const requests = locales.map((locale) => dataClient.fetchKoiosStrings(locale));
    Promise.all(requests)
      .then((results) => {
        const all: KoiosStringEntry[] = results.flat();
        setCoverage(computeCoverage(all, locales));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Unknown error"))
      .finally(() => setLoading(false));
  }, [locales, dataClient]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div role="alert">{error}</div>;

  return (
    <ul>
      {coverage.map((c) => (
        <li key={c.locale} data-low={c.percentage < 50 ? "true" : undefined}>
          {c.locale}: {c.percentage}%
        </li>
      ))}
    </ul>
  );
}
