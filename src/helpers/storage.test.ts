import { describe, expect, it, vi, afterEach } from "vitest";
import { DRAFT_KEY, readDraft, saveDraft, emptyDraft } from "./storage";
afterEach(() => vi.restoreAllMocks());
function store(items: unknown, extra = {}) {
  localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify({
      version: 1,
      items,
      selection: "custom",
      custom: "12.5",
      ...extra,
    }),
  );
}
describe("borrador", () => {
  it("restaura catálogo actual y propina válida", () => {
    store([{ id: 1, quantity: 2, price: 0, name: "Falso" }]);
    expect(readDraft()).toMatchObject({
      order: [{ id: 1, quantity: 2, price: 30, name: "Pizza a la Leña Chica" }],
      selection: "custom",
      custom: "12.5",
    });
  });
  it("tolera JSON corrupto", () => {
    localStorage.setItem(DRAFT_KEY, "{");
    expect(readDraft()).toEqual(emptyDraft());
  });
  it.each([
    [{ id: 999, quantity: 1 }],
    [{ id: 1, quantity: 0 }],
    [{ id: 1, quantity: 1.5 }],
    [
      { id: 1, quantity: 1 },
      { id: 1, quantity: 1 },
    ],
  ])("rechaza filas inválidas", (...items) => {
    store(items);
    expect(readDraft()).toEqual(emptyDraft());
  });
  it("rechaza versiones y propinas incompatibles", () => {
    store([], { version: 2 });
    expect(readDraft()).toEqual(emptyDraft());
    store([], { custom: "101" });
    expect(readDraft()).toEqual(emptyDraft());
  });
  it("tolera almacenamiento bloqueado", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Blocked");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("Blocked");
    });
    expect(readDraft()).toEqual(emptyDraft());
    expect(() =>
      saveDraft({
        order: [{ id: 1, name: "Pizza", price: 30, quantity: 1 }],
        selection: "0",
        custom: "",
      }),
    ).not.toThrow();
    expect(() => saveDraft(emptyDraft())).not.toThrow();
  });
  it("elimina solo su propia clave", () => {
    localStorage.setItem("other", "keep");
    saveDraft(emptyDraft());
    expect(localStorage.getItem("other")).toBe("keep");
  });
});
