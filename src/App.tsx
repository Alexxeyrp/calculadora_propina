import { useEffect, useRef } from "react";
import MenuItem from "./components/MenuItem";
import OrderContents from "./components/OrderContents";
import OrderTotals from "./components/OrderTotals";
import TipPorcentageForm from "./components/TipPorcentageForm";
import { menuItems } from "./data/db";
import { formatCurrency } from "./helpers";
import useOrder from "./hooks/useOrder";
export default function App() {
  const state = useOrder();
  const { order, receipt } = state;
  const title = useRef<HTMLHeadingElement>(null);
  const receiptTitle = useRef<HTMLHeadingElement>(null);
  const previousReceipt = useRef(false);
  useEffect(() => {
    if (receipt) receiptTitle.current?.focus();
    else if (previousReceipt.current) title.current?.focus();
    previousReceipt.current = !!receipt;
  }, [receipt]);
  const count = order.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <>
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <header className="page-header">
        <div>
          <p className="eyebrow">DEL MENÚ A TU CUENTA</p>
          <h1>
            Calculadora de propinas <span>y consumo</span>
          </h1>
          <p className="muted">
            Elige, ajusta y finaliza tu cuenta. Todos los precios en USD.
          </p>
        </div>
        <span className="currency-badge">USD · Dólares</span>
      </header>
      <p
        className="announcement"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {state.message}
      </p>
      <main id="main" className={count ? "has-order" : ""}>
        {receipt ? (
          <section className="receipt panel" aria-labelledby="receipt-title">
            <p className="eyebrow">CUENTA FINALIZADA</p>
            <h2 id="receipt-title" ref={receiptTitle} tabIndex={-1}>
              Tu comprobante
            </h2>
            <p className="muted">
              Gracias. Aquí tienes el detalle de tu consumo.
            </p>
            <ul className="receipt-items">
              {receipt.order.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p className="muted">
                      {item.quantity} ×{" "}
                      {formatCurrency(Math.round(item.price * 100))}
                    </p>
                  </div>
                  <strong>
                    {formatCurrency(
                      Math.round(item.price * 100) * item.quantity,
                    )}
                  </strong>
                </li>
              ))}
            </ul>
            <OrderTotals order={receipt.order} percent={receipt.percent} />
            <button className="primary" onClick={state.newOrder}>
              Nueva orden
            </button>
          </section>
        ) : (
          <div className="workspace">
            <section aria-labelledby="menu-title">
              <div className="section-heading">
                <h2 id="menu-title" ref={title} tabIndex={-1}>
                  Menú
                </h2>
                <span className="muted">{menuItems.length} opciones</span>
              </div>
              <p className="muted menu-help">
                Pulsa un producto para añadirlo a tu cuenta.
              </p>
              <div className="menu-list">
                {menuItems.map((item) => (
                  <MenuItem key={item.id} item={item} addItem={state.addItem} />
                ))}
              </div>
            </section>
            <section className="panel account" aria-labelledby="account-title">
              <div className="section-heading">
                <h2 id="account-title" tabIndex={-1}>
                  Tu cuenta
                </h2>
                <span className="muted">
                  {count} {count === 1 ? "producto" : "productos"}
                </span>
              </div>
              {order.length ? (
                <>
                  <OrderContents
                    order={order}
                    changeQuantity={state.changeQuantity}
                    removeItem={state.removeItem}
                  />
                  <TipPorcentageForm {...state} />
                  <OrderTotals order={order} percent={state.percent} />
                  <button
                    className="primary"
                    disabled={!!state.error}
                    onClick={state.placeOrder}
                  >
                    Finalizar cuenta
                  </button>
                  <p className="footnote">
                    Podrás revisar el comprobante antes de empezar otra orden.
                  </p>
                </>
              ) : (
                <div className="empty">
                  <span aria-hidden="true">＋</span>
                  <h3>Tu cuenta empieza aquí</h3>
                  <p>Selecciona productos del menú para comenzar.</p>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
      {!receipt && count > 0 && (
        <a
          className="mobile-bar"
          href="#account-title"
          onClick={() => document.getElementById("account-title")?.focus()}
        >
          Ver cuenta · {count} {count === 1 ? "producto" : "productos"} ·{" "}
          {formatCurrency(state.totals.total)} <span aria-hidden="true">↑</span>
        </a>
      )}
      <footer>Calculadora de propinas y consumo · React + TypeScript</footer>
    </>
  );
}
