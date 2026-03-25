import { describe, it, expect, vi } from "vitest";
import { WebflowBridge } from "./webflow-bridge.js";
import type { WebflowDesignerApi, WebflowElement } from "./types.js";

function makeElement(attrs: Record<string, string | null> = {}): WebflowElement {
  return {
    getCustomAttribute: vi.fn(async (name: string) => attrs[name] ?? null),
    setCustomAttribute: vi.fn(async () => {}),
    removeCustomAttribute: vi.fn(async () => {}),
    getTagName: vi.fn(async () => "DIV"),
    getTextContent: vi.fn(async () => "mock text"),
  };
}

function makeApi(element: WebflowElement | null = null): WebflowDesignerApi {
  return { getSelectedElement: vi.fn(async () => element) };
}

describe("WebflowBridge.getSelectedElement", () => {
  it("delegates to the underlying API", async () => {
    const el = makeElement();
    const bridge = new WebflowBridge(makeApi(el));
    expect(await bridge.getSelectedElement()).toBe(el);
  });

  it("returns null when no element is selected", async () => {
    const bridge = new WebflowBridge(makeApi(null));
    expect(await bridge.getSelectedElement()).toBeNull();
  });
});

describe("WebflowBridge.getElementBinding", () => {
  it("returns null when element has no binding", async () => {
    const bridge = new WebflowBridge(makeApi());
    const el = makeElement({});
    expect(await bridge.getElementBinding(el)).toBeNull();
  });

  it("returns bound key and placement when attributes exist", async () => {
    const bridge = new WebflowBridge(makeApi());
    const el = makeElement({ "data-ct-key": "koios:car.title", "data-ct-placement": "dynamic" });
    const result = await bridge.getElementBinding(el);
    expect(result).toEqual({ key: "koios:car.title", placement: "dynamic" });
  });

  it("defaults placement to static when ct-placement is absent", async () => {
    const bridge = new WebflowBridge(makeApi());
    const el = makeElement({ "data-ct-key": "koios:car.title" });
    const result = await bridge.getElementBinding(el);
    expect(result?.placement).toBe("static");
  });
});

describe("WebflowBridge.bindKey", () => {
  it("sets both key and placement attributes on the element", async () => {
    const bridge = new WebflowBridge(makeApi());
    const el = makeElement();
    await bridge.bindKey(el, "koios:flight.search", "lazy");
    expect(el.setCustomAttribute).toHaveBeenCalledWith("data-ct-key", "koios:flight.search");
    expect(el.setCustomAttribute).toHaveBeenCalledWith("data-ct-placement", "lazy");
  });
});

describe("WebflowBridge.unbindKey", () => {
  it("removes both key and placement attributes from the element", async () => {
    const bridge = new WebflowBridge(makeApi());
    const el = makeElement({ "data-ct-key": "koios:car.title", "data-ct-placement": "static" });
    await bridge.unbindKey(el);
    expect(el.removeCustomAttribute).toHaveBeenCalledWith("data-ct-key");
    expect(el.removeCustomAttribute).toHaveBeenCalledWith("data-ct-placement");
  });
});
