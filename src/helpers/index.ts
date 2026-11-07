import type { OrderItem } from "../types";
export function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
export function calculateTotals(order: OrderItem[], percent: number) {
  const subtotal = order.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
    0,
  );
  const tipAmount = Math.round((subtotal * Math.round(percent * 100)) / 10000);
  return { subtotal, tipAmount, total: subtotal + tipAmount };
}
export function parseTip(value: string): number | null {
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(value)) return null;
  const number = Number(value.replace(",", "."));
  return number >= 0 && number <= 100 ? number : null;
}
