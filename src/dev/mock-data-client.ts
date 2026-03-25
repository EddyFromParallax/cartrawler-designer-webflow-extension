import type { KoiosStringEntry, SyncResult } from "../types.js";
import type { DataClient } from "../data-client.js";
import {
  KOIOS_KEY_NAMESPACE,
  NEOCMS_JSON_KEY_NAMESPACE,
  NEOCMS_XML_KEY_NAMESPACE,
} from "@cartrawler/translations-core";

const MOCK_FETCH_DELAY_MS = 200;
const MOCK_SYNC_DELAY_MS = 500;
const MOCK_MANIFEST_DELAY_MS = 100;

const MOCK_STRINGS: KoiosStringEntry[] = [
  // en-GB — full coverage (12 keys)
  { key: `${KOIOS_KEY_NAMESPACE}hero.title`, value: "Find your perfect car", locale: "en-GB" },
  { key: `${KOIOS_KEY_NAMESPACE}hero.subtitle`, value: "Search deals from top providers", locale: "en-GB" },
  { key: `${KOIOS_KEY_NAMESPACE}cta.book_now`, value: "Book Now", locale: "en-GB" },
  { key: `${KOIOS_KEY_NAMESPACE}cta.learn_more`, value: "Learn More", locale: "en-GB" },
  { key: `${KOIOS_KEY_NAMESPACE}nav.home`, value: "Home", locale: "en-GB" },
  { key: `${KOIOS_KEY_NAMESPACE}nav.about`, value: "About", locale: "en-GB" },
  { key: `${KOIOS_KEY_NAMESPACE}footer.copyright`, value: "All rights reserved", locale: "en-GB" },
  { key: `${KOIOS_KEY_NAMESPACE}footer.privacy`, value: "Privacy Policy", locale: "en-GB" },
  { key: `${NEOCMS_JSON_KEY_NAMESPACE}promo.banner`, value: "Summer sale — 20% off", locale: "en-GB" },
  { key: `${NEOCMS_JSON_KEY_NAMESPACE}promo.details`, value: "Valid until September", locale: "en-GB" },
  { key: `${NEOCMS_XML_KEY_NAMESPACE}legal.terms`, value: "Terms and Conditions", locale: "en-GB" },
  { key: `${NEOCMS_XML_KEY_NAMESPACE}legal.cookie`, value: "Cookie Notice", locale: "en-GB" },

  // de-DE — partial coverage (8 keys)
  { key: `${KOIOS_KEY_NAMESPACE}hero.title`, value: "Finden Sie Ihr perfektes Auto", locale: "de-DE" },
  { key: `${KOIOS_KEY_NAMESPACE}hero.subtitle`, value: "Angebote von Top-Anbietern", locale: "de-DE" },
  { key: `${KOIOS_KEY_NAMESPACE}cta.book_now`, value: "Jetzt buchen", locale: "de-DE" },
  { key: `${KOIOS_KEY_NAMESPACE}cta.learn_more`, value: "Mehr erfahren", locale: "de-DE" },
  { key: `${KOIOS_KEY_NAMESPACE}nav.home`, value: "Startseite", locale: "de-DE" },
  { key: `${KOIOS_KEY_NAMESPACE}nav.about`, value: "Über uns", locale: "de-DE" },
  { key: `${NEOCMS_JSON_KEY_NAMESPACE}promo.banner`, value: "Sommerangebot — 20% Rabatt", locale: "de-DE" },
  { key: `${NEOCMS_XML_KEY_NAMESPACE}legal.terms`, value: "Allgemeine Geschäftsbedingungen", locale: "de-DE" },

  // fr-FR — low coverage (4 keys)
  { key: `${KOIOS_KEY_NAMESPACE}hero.title`, value: "Trouvez la voiture idéale", locale: "fr-FR" },
  { key: `${KOIOS_KEY_NAMESPACE}cta.book_now`, value: "Réserver", locale: "fr-FR" },
  { key: `${KOIOS_KEY_NAMESPACE}nav.home`, value: "Accueil", locale: "fr-FR" },
  { key: `${NEOCMS_XML_KEY_NAMESPACE}legal.terms`, value: "Conditions générales", locale: "fr-FR" },
];

const MOCK_SYNC_RESULT: SyncResult = {
  added: 3,
  updated: 1,
  removed: 0,
  unchanged: 8,
};

function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function createMockDataClient(): DataClient {
  return {
    fetchKoiosStrings(locale: string): Promise<KoiosStringEntry[]> {
      const filtered = MOCK_STRINGS.filter((s) => s.locale === locale);
      return delay(MOCK_FETCH_DELAY_MS, filtered);
    },
    triggerSync(_locale: string): Promise<SyncResult> {
      return delay(MOCK_SYNC_DELAY_MS, MOCK_SYNC_RESULT);
    },
    fetchManifest(): Promise<Record<string, unknown>> {
      return delay(MOCK_MANIFEST_DELAY_MS, { version: 1, locales: ["en-GB", "de-DE", "fr-FR"] });
    },
  } as unknown as DataClient;
}
