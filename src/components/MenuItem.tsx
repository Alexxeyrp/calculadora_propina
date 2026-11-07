import type { MenuItem as Item } from "../types";
import { formatCurrency } from "../helpers";
export default function MenuItem({
  item,
  addItem,
}: {
  item: Item;
  addItem: (item: Item) => void;
}) {
  return (
    <button
      className="menu-item"
      onClick={() => addItem(item)}
      aria-label={`Añadir ${item.name}`}
    >
      <span>{item.name}</span>
      <strong>{formatCurrency(Math.round(item.price * 100))}</strong>
      <span className="add-mark" aria-hidden="true">
        +
      </span>
    </button>
  );
}
