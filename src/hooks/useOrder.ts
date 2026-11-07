import { useEffect, useState } from "react";
import type { MenuItem, OrderItem } from "../types";
import { calculateTotals, parseTip } from "../helpers";
import { emptyDraft, readDraft, saveDraft } from "../helpers/storage";
export default function useOrder() {
  const [draft, setDraft] = useState(readDraft);
  const [receipt, setReceipt] = useState<{
    order: OrderItem[];
    percent: number;
  } | null>(null);
  const [message, setMessage] = useState("");
  const { order, selection, custom } = draft;
  const parsed = selection === "custom" ? parseTip(custom) : Number(selection);
  const percent = parsed ?? 0;
  const error =
    parsed === null
      ? "Introduce un porcentaje entre 0 y 100, con hasta dos decimales."
      : "";
  useEffect(() => {
    saveDraft({
      ...draft,
      selection: error ? "0" : selection,
      custom: error ? "" : custom,
    });
  }, [draft, error, selection, custom]);
  function addItem(item: MenuItem) {
    setDraft((prev) => ({
      ...prev,
      order: prev.order.some((row) => row.id === item.id)
        ? prev.order.map((row) =>
            row.id === item.id
              ? { ...row, quantity: Math.min(9999, row.quantity + 1) }
              : row,
          )
        : [...prev.order, { ...item, quantity: 1 }],
    }));
    setMessage(
      `${item.name} añadido a la cuenta. ${order.reduce((sum, row) => sum + row.quantity, 0) + 1} productos en total.`,
    );
  }
  function changeQuantity(id: number, delta: number) {
    setDraft((prev) => ({
      ...prev,
      order: prev.order
        .map((row) =>
          row.id === id
            ? { ...row, quantity: Math.min(9999, row.quantity + delta) }
            : row,
        )
        .filter((row) => row.quantity > 0),
    }));
    setMessage("Cantidad actualizada.");
  }
  function removeItem(id: number) {
    setDraft((prev) => ({
      ...prev,
      order: prev.order.filter((row) => row.id !== id),
    }));
    setMessage("Producto eliminado.");
  }
  function placeOrder() {
    if (!order.length || error) return;
    setReceipt({ order: order.map((item) => ({ ...item })), percent });
    setDraft(emptyDraft());
    saveDraft(emptyDraft());
    setMessage("Cuenta finalizada. Comprobante disponible.");
  }
  function newOrder() {
    setReceipt(null);
    setDraft(emptyDraft());
    setMessage("Nueva orden lista.");
  }
  return {
    order,
    selection,
    custom,
    percent,
    error,
    receipt,
    message,
    addItem,
    changeQuantity,
    removeItem,
    placeOrder,
    newOrder,
    setSelection: (selection: string) =>
      setDraft((prev) => ({ ...prev, selection })),
    setCustom: (custom: string) => setDraft((prev) => ({ ...prev, custom })),
    totals: calculateTotals(order, percent),
  };
}
