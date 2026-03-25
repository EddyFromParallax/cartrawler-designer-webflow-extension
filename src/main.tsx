import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import { WebflowBridge } from "./webflow-bridge.js";
import { DataClient } from "./data-client.js";
import { createMockWebflowApi } from "./dev/mock-webflow-api.js";
import { createMockDataClient } from "./dev/mock-data-client.js";
import "./styles.css";

const LOCALES = ["en-GB", "de-DE", "fr-FR"] as const;

const isWebflowDesigner = typeof webflow !== "undefined";

const bridge = isWebflowDesigner
  ? new WebflowBridge(webflow!)
  : new WebflowBridge(createMockWebflowApi());

const dataClient = isWebflowDesigner
  ? new DataClient()
  : createMockDataClient();

createRoot(document.getElementById("root")!).render(
  <App bridge={bridge} dataClient={dataClient} locales={[...LOCALES]} />
);
