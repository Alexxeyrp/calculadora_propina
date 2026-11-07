import { calculateTotals, formatCurrency } from "../helpers";
import type { OrderItem } from "../types";
export default function OrderTotals({
  order,
  percent,
}: {
  order: OrderItem[];
  percent: number;
}) {
  const { subtotal, tipAmount, total } = calculateTotals(order, percent);
  return (
    <dl className="totals">
      <div>
        <dt>Subtotal</dt>
        <dd>{formatCurrency(subtotal)}</dd>
      </div>
      <div>
        <dt>Propina ({percent}%)</dt>
        <dd>{formatCurrency(tipAmount)}</dd>
      </div>
      <div className="grand-total">
        <dt>
          Total a pagar <small>USD</small>
        </dt>
        <dd>{formatCurrency(total)}</dd>
      </div>
    </dl>
  );
}
