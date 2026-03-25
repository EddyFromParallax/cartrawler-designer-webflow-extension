import type { WebflowDesignerApi, WebflowElement } from "../types.js";

function createMockElement(): WebflowElement {
  const attributes = new Map<string, string>();

  return {
    getCustomAttribute(name: string): Promise<string | null> {
      return Promise.resolve(attributes.get(name) ?? null);
    },
    setCustomAttribute(name: string, value: string): Promise<void> {
      attributes.set(name, value);
      return Promise.resolve();
    },
    removeCustomAttribute(name: string): Promise<void> {
      attributes.delete(name);
      return Promise.resolve();
    },
    getTagName(): Promise<string> {
      return Promise.resolve("H1");
    },
    getTextContent(): Promise<string> {
      return Promise.resolve("Find your perfect car");
    },
  };
}

export function createMockWebflowApi(): WebflowDesignerApi {
  const element = createMockElement();

  return {
    getSelectedElement(): Promise<WebflowElement | null> {
      return Promise.resolve(element);
    },
  };
}
