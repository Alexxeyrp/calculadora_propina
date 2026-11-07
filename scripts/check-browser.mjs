import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ headless: true, channel: "chromium" });
const page = await browser.newPage();
page.setDefaultTimeout(60000);
await page.emulateMedia({ reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const base = process.env.APP_URL || "http://127.0.0.1:5180";
try {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  const add = page.getByRole("button", {
    name: "Añadir Pizza a la Leña Chica",
    exact: true,
  });
  await add.click();
  await add.click();
  await page
    .getByRole("button", { name: "Añadir Café Americano", exact: true })
    .click();
  await page.getByRole("radio", { name: "10%", exact: true }).check();
  await expect(page.locator(".grand-total dd")).toHaveText("$88.00");
  await page.reload();
  await expect(
    page.getByLabel("Cantidad de Pizza a la Leña Chica", { exact: true }),
  ).toHaveText("2");
  await expect(
    page.getByRole("radio", { name: "10%", exact: true }),
  ).toBeChecked();
  await page.screenshot({
    path: "docs/screenshots/desktop.png",
    fullPage: true,
  });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width < 768) {
      await expect(
        page.getByRole("link", { name: /Ver cuenta · 3 productos/ }),
      ).toBeVisible();
      await page.getByRole("link", { name: /Ver cuenta/ }).click();
      await expect(
        page.getByRole("heading", { name: "Tu cuenta", exact: true }),
      ).toBeFocused();
      const finalize = page.getByRole("button", {
        name: "Finalizar cuenta",
        exact: true,
      });
      await finalize.scrollIntoViewIfNeeded();
      const buttonBox = await finalize.boundingBox();
      const barBox = await page.locator(".mobile-bar").boundingBox();
      expect(buttonBox.y + buttonBox.height).toBeLessThanOrEqual(barBox.y);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("link", { name: /Ver cuenta/ }).click();
  await page.screenshot({
    path: "docs/screenshots/mobile.png",
    fullPage: true,
  });
  await page.getByRole("radio", { name: "Personalizada", exact: true }).check();
  const custom = page.getByLabel("Porcentaje personalizado (%)", {
    exact: true,
  });
  await custom.fill("101");
  await expect(
    page.getByRole("button", { name: "Finalizar cuenta" }),
  ).toBeDisabled();
  await custom.fill("12.5");
  await custom.press("Tab");
  await expect(
    page.getByRole("button", { name: "Finalizar cuenta" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Tu comprobante" }),
  ).toBeFocused();
  await expect(page.locator(".grand-total dd")).toHaveText("$90.00");
  expect(
    await page.evaluate(() =>
      localStorage.getItem("calculadora-propina:draft:v1"),
    ),
  ).toBeNull();
  await page.screenshot({
    path: "docs/screenshots/receipt.png",
    fullPage: true,
  });
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Menú", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(
    page.getByLabel("Cantidad de Pizza a la Leña Chica", { exact: true }),
  ).toHaveText("1");
  await expect(page.getByRole("radio", { name: "Sin propina" })).toBeChecked();
  expect(errors).toEqual([]);
  console.log(
    "Browser checks passed: 320/390/768/1024/1440px, persistence, tips, receipt, keyboard, no overflow or console errors.",
  );
} finally {
  await browser.close();
}
