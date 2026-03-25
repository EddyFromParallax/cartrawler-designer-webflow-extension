import type { WebflowDesignerApi, WebflowElement, BoundKey } from "./types.js";
import { CT_KEY_ATTR, CT_PLACEMENT_ATTR } from "./constants.js";

export class WebflowBridge {
  private api: WebflowDesignerApi;

  constructor(api: WebflowDesignerApi) {
    this.api = api;
  }

  getSelectedElement(): Promise<WebflowElement | null> {
    return this.api.getSelectedElement();
  }

  async getElementBinding(el: WebflowElement): Promise<BoundKey | null> {
    const key = await el.getCustomAttribute(CT_KEY_ATTR);
    if (!key) return null;
    const placement = (await el.getCustomAttribute(CT_PLACEMENT_ATTR)) ?? "static";
    return { key, placement: placement as BoundKey["placement"] };
  }

  async bindKey(
    el: WebflowElement,
    key: string,
    placement: BoundKey["placement"]
  ): Promise<void> {
    await el.setCustomAttribute(CT_KEY_ATTR, key);
    await el.setCustomAttribute(CT_PLACEMENT_ATTR, placement);
  }

  async unbindKey(el: WebflowElement): Promise<void> {
    await el.removeCustomAttribute(CT_KEY_ATTR);
    await el.removeCustomAttribute(CT_PLACEMENT_ATTR);
  }
}
