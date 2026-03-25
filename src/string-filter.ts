import type { KoiosStringEntry } from "./types.js";
import {
  KOIOS_KEY_NAMESPACE,
  NEOCMS_JSON_KEY_NAMESPACE,
  NEOCMS_XML_KEY_NAMESPACE,
} from "@cartrawler/translations-core";

export function filterStrings(strings: KoiosStringEntry[], query: string): KoiosStringEntry[] {
  if (!query) return strings;
  const lower = query.toLowerCase();
  return strings.filter(
    (s) => s.key.toLowerCase().includes(lower) || s.value.toLowerCase().includes(lower)
  );
}

export function sortByKey(strings: KoiosStringEntry[]): KoiosStringEntry[] {
  return [...strings].sort((a, b) => a.key.localeCompare(b.key));
}

export function groupByNamespace(
  strings: KoiosStringEntry[]
): Record<string, KoiosStringEntry[]> {
  const groups: Record<string, KoiosStringEntry[]> = {};
  for (const s of strings) {
    const ns = getNamespace(s.key);
    if (!groups[ns]) groups[ns] = [];
    groups[ns].push(s);
  }
  return groups;
}

function getNamespace(key: string): string {
  if (key.startsWith(KOIOS_KEY_NAMESPACE)) return KOIOS_KEY_NAMESPACE;
  if (key.startsWith(NEOCMS_JSON_KEY_NAMESPACE)) return NEOCMS_JSON_KEY_NAMESPACE;
  if (key.startsWith(NEOCMS_XML_KEY_NAMESPACE)) return NEOCMS_XML_KEY_NAMESPACE;
  return "other";
}
