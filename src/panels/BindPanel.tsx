import { useState, useEffect, useCallback } from "react";
import type { WebflowBridge } from "../webflow-bridge.js";
import type { DataClient } from "../data-client.js";
import type { BoundKey, KoiosStringEntry, WebflowElement } from "../types.js";
import { CT_PLACEMENT_STATIC } from "@cartrawler/translations-core";
import { filterStrings } from "../string-filter.js";
import { BIND_FLASH_DURATION_MS } from "../constants.js";
import { ElementContextBar } from "./ElementContextBar.js";
import { PlacementPicker } from "./PlacementPicker.js";
import { StringList } from "./StringList.js";

type Placement = BoundKey["placement"];

interface BindPanelProps {
  bridge: WebflowBridge;
  dataClient: DataClient;
  locale: string;
}

export function BindPanel({ bridge, dataClient, locale }: BindPanelProps) {
  const [element, setElement] = useState<WebflowElement | null>(null);
  const [elementInfo, setElementInfo] = useState<{ tag: string; text: string } | null>(null);
  const [existingBinding, setExistingBinding] = useState<BoundKey | null>(null);
  const [placement, setPlacement] = useState<Placement>(CT_PLACEMENT_STATIC as Placement);
  const [strings, setStrings] = useState<KoiosStringEntry[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flashKey, setFlashKey] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    dataClient
      .fetchKoiosStrings(locale)
      .then(setStrings)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Unknown error"))
      .finally(() => setLoading(false));
  }, [locale, dataClient]);

  useEffect(() => {
    bridge.getSelectedElement().then(async (el) => {
      setElement(el);
      if (!el) {
        setElementInfo(null);
        setExistingBinding(null);
        return;
      }
      const [tag, text, binding] = await Promise.all([
        el.getTagName(),
        el.getTextContent(),
        bridge.getElementBinding(el),
      ]);
      setElementInfo({ tag, text });
      setExistingBinding(binding);
    });
  }, [bridge]);

  const handleSelect = useCallback(
    async (key: string) => {
      if (!element) return;
      try {
        await bridge.bindKey(element, key, placement);
        setExistingBinding({ key, placement });
        setFlashKey(key);
        setTimeout(() => setFlashKey(null), BIND_FLASH_DURATION_MS);
      } catch {
        setFlashKey(null);
      }
    },
    [element, bridge, placement],
  );

  const handleUnbind = useCallback(async () => {
    if (!element) return;
    await bridge.unbindKey(element);
    setExistingBinding(null);
  }, [element, bridge]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div role="alert">{error}</div>;

  const visible = filterStrings(strings, query);

  return (
    <div className="bind-panel">
      <ElementContextBar
        tag={elementInfo?.tag ?? null}
        text={elementInfo?.text ?? null}
        binding={existingBinding}
        onUnbind={handleUnbind}
      />
      <PlacementPicker value={placement} onChange={setPlacement} />
      <div className="bind-panel__search">
        <input
          aria-label="Search strings"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by value or key…"
        />
      </div>
      <StringList
        strings={visible}
        boundKey={existingBinding?.key ?? null}
        flashKey={flashKey}
        disabled={!element}
        onSelect={handleSelect}
      />
    </div>
  );
}
