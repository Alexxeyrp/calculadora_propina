import { describe, expect, it, vi } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { DRAFT_KEY } from "./helpers/storage";
const account = () => within(screen.getByRole("region", { name: "Tu cuenta" }));
const addPizza = () =>
  screen.getByRole("button", { name: "Añadir Pizza a la Leña Chica" });
describe("cuenta", () => {
  it("añade sin duplicar, incrementa, reduce y elimina sin alterar otros productos", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(
      screen.queryByRole("button", { name: "Finalizar cuenta" }),
    ).not.toBeInTheDocument();
    await user.click(addPizza());
    await user.click(addPizza());
    await user.click(
      screen.getByRole("button", { name: "Añadir Café Americano" }),
    );
    expect(
      account().getByLabelText("Cantidad de Pizza a la Leña Chica"),
    ).toHaveTextContent("2");
    await user.click(
      screen.getByRole("button", {
        name: "Aumentar cantidad de Pizza a la Leña Chica",
      }),
    );
    expect(
      account().getByLabelText("Cantidad de Pizza a la Leña Chica"),
    ).toHaveTextContent("3");
    await user.click(
      screen.getByRole("button", {
        name: "Reducir cantidad de Pizza a la Leña Chica",
      }),
    );
    await user.click(
      screen.getByRole("button", { name: "Eliminar Pizza a la Leña Chica" }),
    );
    expect(
      account().getByLabelText("Cantidad de Café Americano"),
    ).toHaveTextContent("1");
    await waitFor(() =>
      expect(
        screen.getByRole("button", {
          name: "Reducir cantidad de Café Americano",
        }),
      ).toHaveFocus(),
    );
    await user.click(
      screen.getByRole("button", {
        name: "Reducir cantidad de Café Americano",
      }),
    );
    expect(
      account().getByText("Selecciona productos del menú para comenzar."),
    ).toBeVisible();
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Tu cuenta" })).toHaveFocus(),
    );
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
  });
  it("cambia propina, valida personalizada, genera comprobante y reinicia con foco", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(addPizza());
    await user.click(addPizza());
    await user.click(
      screen.getByRole("button", { name: "Añadir Café Americano" }),
    );
    expect(screen.getByRole("radio", { name: "Sin propina" })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: "10%" }));
    expect(account().getByText("$88.00")).toBeVisible();
    await user.click(screen.getByRole("radio", { name: "Sin propina" }));
    expect(account().getByText("Propina (0%)")).toBeVisible();
    await user.click(screen.getByRole("radio", { name: "Personalizada" }));
    const input = screen.getByLabelText("Porcentaje personalizado (%)");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(
      screen.getByRole("button", { name: "Finalizar cuenta" }),
    ).toBeDisabled();
    await user.type(input, "101");
    expect(input).toHaveAccessibleDescription(/Introduce un porcentaje/);
    await user.clear(input);
    await user.type(input, "12,5");
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(account().getByText("$90.00")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Finalizar cuenta" }));
    expect(
      screen.getByRole("heading", { name: "Tu comprobante" }),
    ).toHaveFocus();
    expect(screen.getByText("2 × $30.00")).toBeVisible();
    expect(screen.getByText("Propina (12.5%)")).toBeVisible();
    expect(screen.getByText("$90.00")).toBeVisible();
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
    await user.click(screen.getByRole("button", { name: "Nueva orden" }));
    expect(screen.getByRole("heading", { name: "Menú" })).toHaveFocus();
    await user.click(addPizza());
    expect(screen.getByRole("radio", { name: "Sin propina" })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: "Personalizada" }));
    expect(screen.getByLabelText("Porcentaje personalizado (%)")).toHaveValue(
      "",
    );
  });
  it("restaura antes de escribir y conserva solo propinas válidas", async () => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        version: 1,
        items: [{ id: 1, quantity: 2 }],
        selection: "10",
        custom: "",
      }),
    );
    render(<App />);
    expect(
      account().getByLabelText("Cantidad de Pizza a la Leña Chica"),
    ).toHaveTextContent("2");
    expect(screen.getByRole("radio", { name: "10%" })).toBeChecked();
    expect(JSON.parse(localStorage.getItem(DRAFT_KEY)!).items).toEqual([
      { id: 1, quantity: 2 },
    ]);
    const user = userEvent.setup();
    await user.click(screen.getByRole("radio", { name: "Personalizada" }));
    expect(JSON.parse(localStorage.getItem(DRAFT_KEY)!).selection).toBe("0");
  });
  it("sigue funcionando sin almacenamiento", async () => {
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("Blocked");
      });
    try {
      render(<App />);
      await userEvent.click(addPizza());
      expect(
        account().getByLabelText("Cantidad de Pizza a la Leña Chica"),
      ).toHaveTextContent("1");
    } finally {
      spy.mockRestore();
    }
  });
});
