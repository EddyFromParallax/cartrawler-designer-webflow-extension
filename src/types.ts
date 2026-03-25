import type {
  CT_PLACEMENT_STATIC,
  CT_PLACEMENT_DYNAMIC,
  CT_PLACEMENT_LAZY,
} from "@cartrawler/translations-core";

export type { SyncResult } from "@cartrawler/translations-core";

export type Panel = "bind" | "status" | "sync";

export interface KoiosStringEntry {
  key: string;
  value: string;
  locale: string;
}

export interface BoundKey {
  key: string;
  placement: typeof CT_PLACEMENT_STATIC | typeof CT_PLACEMENT_DYNAMIC | typeof CT_PLACEMENT_LAZY;
}

export interface LocaleCoverage {
  locale: string;
  total: number;
  present: number;
  percentage: number;
}

export interface WebflowElement {
  getCustomAttribute(name: string): Promise<string | null>;
  setCustomAttribute(name: string, value: string): Promise<void>;
  removeCustomAttribute(name: string): Promise<void>;
  getTagName(): Promise<string>;
  getTextContent(): Promise<string>;
}

export interface WebflowDesignerApi {
  getSelectedElement(): Promise<WebflowElement | null>;
}
