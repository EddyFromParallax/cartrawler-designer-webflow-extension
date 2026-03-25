import type { KoiosStringEntry, LocaleCoverage } from "./types.js";

export function computeCoverage(
  strings: KoiosStringEntry[],
  allLocales: string[]
): LocaleCoverage[] {
  const allKeys = [...new Set(strings.map((s) => s.key))];
  const total = allKeys.length;

  return allLocales.map((locale) => {
    const localeKeys = new Set(
      strings.filter((s) => s.locale === locale).map((s) => s.key)
    );
    const present = allKeys.filter((k) => localeKeys.has(k)).length;
    const percentage = total === 0 ? 100 : Math.round((present / total) * 100);
    return { locale, total, present, percentage };
  });
}

export function getMissingKeys(
  strings: KoiosStringEntry[],
  locale: string,
  allKeys: string[]
): string[] {
  const localeKeys = new Set(
    strings.filter((s) => s.locale === locale).map((s) => s.key)
  );
  return allKeys.filter((k) => !localeKeys.has(k));
}
