import { describe, it, expect } from "vitest";
import { filterStrings, sortByKey, groupByNamespace } from "./string-filter.js";
import type { KoiosStringEntry } from "./types.js";

const entries: KoiosStringEntry[] = [
  { key: "koios:car.title", value: "Car Rental", locale: "en-GB" },
  { key: "koios:flight.search", value: "Find Flights", locale: "en-GB" },
  { key: "neocms-json:hero.subtitle", value: "Book Now", locale: "en-GB" },
  { key: "neocms-xml:footer.links", value: "Footer Links", locale: "en-GB" },
];

describe("filterStrings", () => {
  it("returns all strings when query is empty", () => {
    expect(filterStrings(entries, "")).toHaveLength(4);
  });

  it("filters by key (case-insensitive)", () => {
    const result = filterStrings(entries, "CAR");
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe("koios:car.title");
  });

  it("filters by value (case-insensitive)", () => {
    const result = filterStrings(entries, "find");
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe("Find Flights");
  });

  it("searches both key and value fields", () => {
    const result = filterStrings(entries, "book");
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe("neocms-json:hero.subtitle");
  });

  it("returns empty list when nothing matches", () => {
    expect(filterStrings(entries, "zzznomatch")).toHaveLength(0);
  });

  it("handles empty input list", () => {
    expect(filterStrings([], "car")).toHaveLength(0);
  });
});

describe("sortByKey", () => {
  it("sorts entries alphabetically by key", () => {
    const unsorted: KoiosStringEntry[] = [
      { key: "koios:z", value: "Z", locale: "en-GB" },
      { key: "koios:a", value: "A", locale: "en-GB" },
      { key: "koios:m", value: "M", locale: "en-GB" },
    ];
    const result = sortByKey(unsorted);
    expect(result.map((e) => e.key)).toEqual(["koios:a", "koios:m", "koios:z"]);
  });

  it("does not mutate the original array", () => {
    const original = [...entries];
    sortByKey(entries);
    expect(entries).toEqual(original);
  });
});

describe("groupByNamespace", () => {
  it("groups by koios: prefix", () => {
    const result = groupByNamespace(entries);
    expect(result["koios:"]).toHaveLength(2);
  });

  it("groups by neocms-json: prefix", () => {
    const result = groupByNamespace(entries);
    expect(result["neocms-json:"]).toHaveLength(1);
  });

  it("groups by neocms-xml: prefix", () => {
    const result = groupByNamespace(entries);
    expect(result["neocms-xml:"]).toHaveLength(1);
  });

  it("returns empty object for empty list", () => {
    expect(groupByNamespace([])).toEqual({});
  });
});
