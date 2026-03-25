import { describe, it, expect } from "vitest";
import { computeCoverage, getMissingKeys } from "./coverage.js";
import type { KoiosStringEntry } from "./types.js";

const strings: KoiosStringEntry[] = [
  { key: "koios:car.title", value: "Car Rental", locale: "en-GB" },
  { key: "koios:flight.search", value: "Find Flights", locale: "en-GB" },
  { key: "koios:car.title", value: "Autovermietung", locale: "de-DE" },
];

describe("computeCoverage", () => {
  it("returns 100% for a locale that has all keys", () => {
    const result = computeCoverage(strings, ["en-GB"]);
    expect(result[0]).toEqual({ locale: "en-GB", total: 2, present: 2, percentage: 100 });
  });

  it("returns partial coverage for a locale missing some keys", () => {
    const result = computeCoverage(strings, ["de-DE"]);
    expect(result[0]).toEqual({ locale: "de-DE", total: 2, present: 1, percentage: 50 });
  });

  it("returns 0% for a locale with no keys", () => {
    const result = computeCoverage(strings, ["fr-FR"]);
    expect(result[0]).toEqual({ locale: "fr-FR", total: 2, present: 0, percentage: 0 });
  });

  it("rounds percentage correctly", () => {
    const threeKeyStrings: KoiosStringEntry[] = [
      { key: "a", value: "A", locale: "en-GB" },
      { key: "b", value: "B", locale: "en-GB" },
      { key: "c", value: "C", locale: "en-GB" },
      { key: "a", value: "A", locale: "de-DE" },
    ];
    const result = computeCoverage(threeKeyStrings, ["de-DE"]);
    expect(result[0].percentage).toBe(33);
  });

  it("returns 100% when strings list is empty", () => {
    const result = computeCoverage([], ["en-GB"]);
    expect(result[0].percentage).toBe(100);
  });
});

describe("getMissingKeys", () => {
  it("returns keys not present for the given locale", () => {
    const missing = getMissingKeys(strings, "de-DE", ["koios:car.title", "koios:flight.search"]);
    expect(missing).toEqual(["koios:flight.search"]);
  });

  it("returns empty array when locale has all keys", () => {
    const missing = getMissingKeys(strings, "en-GB", ["koios:car.title", "koios:flight.search"]);
    expect(missing).toEqual([]);
  });

  it("returns all keys when locale has none", () => {
    const missing = getMissingKeys(strings, "fr-FR", ["koios:car.title", "koios:flight.search"]);
    expect(missing).toEqual(["koios:car.title", "koios:flight.search"]);
  });

  it("returns empty array when allKeys is empty", () => {
    expect(getMissingKeys(strings, "en-GB", [])).toEqual([]);
  });
});
