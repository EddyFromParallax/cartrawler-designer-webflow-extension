import { useState } from "react";
import type { Panel } from "./types.js";
import type { WebflowBridge } from "./webflow-bridge.js";
import type { DataClient } from "./data-client.js";
import { FALLBACK_PANEL } from "./constants.js";
import { BindPanel } from "./panels/BindPanel.js";
import { StatusDashboardPanel } from "./panels/StatusDashboardPanel.js";
import { SyncTriggerPanel } from "./panels/SyncTriggerPanel.js";

interface AppProps {
  bridge: WebflowBridge;
  dataClient: DataClient;
  locales: string[];
}

const TABS: { id: Panel; label: string }[] = [
  { id: "bind", label: "Bind" },
  { id: "status", label: "Status" },
  { id: "sync", label: "Sync" },
];

export function App({ bridge, dataClient, locales }: AppProps) {
  const [activePanel, setActivePanel] = useState<Panel>(FALLBACK_PANEL as Panel);
  const defaultLocale = locales[0] ?? "en-GB";

  return (
    <div>
      <nav>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-current={activePanel === tab.id ? "page" : undefined}
            onClick={() => setActivePanel(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      {activePanel === "bind" && (
        <BindPanel bridge={bridge} dataClient={dataClient} locale={defaultLocale} />
      )}
      {activePanel === "status" && (
        <StatusDashboardPanel locales={locales} dataClient={dataClient} />
      )}
      {activePanel === "sync" && (
        <SyncTriggerPanel locales={locales} dataClient={dataClient} />
      )}
    </div>
  );
}
