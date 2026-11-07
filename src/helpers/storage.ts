import { menuItems } from "../data/db";
import { parseTip } from ".";
import type { OrderItem } from "../types";
export const DRAFT_KEY = "calculadora-propina:draft:v1";
export type Draft = { order: OrderItem[]; selection: string; custom: string };
export const emptyDraft = (): Draft => ({
  order: [],
  selection: "0",
  custom: "",
});
export function readDraft(): Draft {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null");
    if (
      !data ||
      typeof data !== "object" ||
      !("version" in data) ||
      data.version !== 1 ||
      !("items" in data) ||
      !Array.isArray(data.items) ||
      !("selection" in data) ||
      !("custom" in data)
    )
      return emptyDraft();
    const { selection, custom } = data;
    if (
      typeof selection !== "string" ||
      typeof custom !== "string" ||
      !["0", "10", "15", "20", "custom"].includes(selection) ||
      (selection === "custom" && parseTip(custom) === null)
    )
      return emptyDraft();
    const seen = new Set<number>();
    const order: OrderItem[] = [];
    for (const row of data.items as unknown[]) {
      if (
        !row ||
        typeof row !== "object" ||
        !("id" in row) ||
        !("quantity" in row) ||
        typeof row.id !== "number" ||
        typeof row.quantity !== "number" ||
        !Number.isSafeInteger(row.quantity) ||
        row.quantity <= 0 ||
        row.quantity > 9999 ||
        seen.has(row.id)
      )
        return emptyDraft();
      const item = menuItems.find((item) => item.id === row.id);
      if (!item) return emptyDraft();
      seen.add(item.id);
      order.push({ ...item, quantity: row.quantity });
    }
    return { order, selection, custom: selection === "custom" ? custom : "" };
  } catch {
    return emptyDraft();
  }
}
export function saveDraft(draft: Draft) {
  try {
    if (!draft.order.length) localStorage.removeItem(DRAFT_KEY);
    else
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          version: 1,
          items: draft.order.map(({ id, quantity }) => ({ id, quantity })),
          selection: draft.selection,
          custom: draft.custom,
        }),
      );
  } catch {
    /* Persistence is optional; the active account remains usable. */
  }
}
