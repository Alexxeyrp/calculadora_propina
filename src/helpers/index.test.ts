import { describe, expect, it } from "vitest";
import { calculateTotals, parseTip } from ".";
describe("cálculos en céntimos", () => {
  it("calcula 80 + 8 = 88", () => {
    expect(
      calculateTotals(
        [
          { id: 1, name: "Pizza", price: 30, quantity: 2 },
          { id: 2, name: "Café", price: 20, quantity: 1 },
        ],
        10,
      ),
    ).toEqual({ subtotal: 8000, tipAmount: 800, total: 8800 });
  });
  it("redondea la propina una sola vez", () => {
    expect(
      calculateTotals(
        [{ id: 1, name: "Producto", price: 0.05, quantity: 3 }],
        10,
      ),
    ).toEqual({ subtotal: 15, tipAmount: 2, total: 17 });
    expect(
      calculateTotals(
        [{ id: 1, name: "Producto", price: 1.01, quantity: 1 }],
        12.55,
      ),
    ).toEqual({ subtotal: 101, tipAmount: 13, total: 114 });
  });
  it.each(["", "-1", "101", "hola", "1.234", "NaN", "1e2", "Infinity"])(
    "rechaza %s",
    (value) => expect(parseTip(value)).toBeNull(),
  );
  it.each([
    ["0", 0],
    ["100", 100],
    ["12.55", 12.55],
    ["12,55", 12.55],
  ])("acepta %s", (value, expected) =>
    expect(parseTip(String(value))).toBe(expected),
  );
});
