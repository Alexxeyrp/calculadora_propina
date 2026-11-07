import { useRef } from "react";
import { formatCurrency } from "../helpers";
import type { OrderItem } from "../types";
export default function OrderContents({
  order,
  changeQuantity,
  removeItem,
}: {
  order: OrderItem[];
  changeQuantity: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
}) {
  const list = useRef<HTMLDivElement>(null);
  function restoreFocus(index: number) {
    requestAnimationFrame(() => {
      const buttons =
        list.current?.querySelectorAll<HTMLButtonElement>(".decrease");
      if (buttons?.length) buttons[Math.min(index, buttons.length - 1)].focus();
      else document.getElementById("account-title")?.focus();
    });
  }
  return (
    <div ref={list}>
      {order.map((item, index) => (
        <div className="order-line" key={item.id}>
          <div className="line-heading">
            <strong>{item.name}</strong>
            <strong>
              {formatCurrency(Math.round(item.price * 100) * item.quantity)}
            </strong>
          </div>
          <div className="line-controls">
            <span className="muted">
              {formatCurrency(Math.round(item.price * 100))} / unidad
            </span>
            <div className="quantity">
              <button
                className="decrease"
                aria-label={`Reducir cantidad de ${item.name}`}
                onClick={() => {
                  changeQuantity(item.id, -1);
                  if (item.quantity === 1) restoreFocus(index);
                }}
              >
                −
              </button>
              <span aria-label={`Cantidad de ${item.name}`}>
                {item.quantity}
              </span>
              <button
                disabled={item.quantity >= 9999}
                aria-label={`Aumentar cantidad de ${item.name}`}
                onClick={() => changeQuantity(item.id, 1)}
              >
                +
              </button>
            </div>
            <button
              className="remove"
              aria-label={`Eliminar ${item.name}`}
              onClick={() => {
                removeItem(item.id);
                restoreFocus(index);
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
