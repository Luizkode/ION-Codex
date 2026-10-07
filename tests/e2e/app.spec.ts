import { test, expect } from "@playwright/test";
test("diagnóstico, edição, apresentação e reset", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Calcular projeção" }).click();
  await expect(page.getByText("Preencha este campo.").first()).toBeVisible();
  await page.getByRole("button", { name: "Usar exemplo" }).click();
  await expect(page.locator("#population")).toHaveValue("723.000");
  await page.getByRole("button", { name: "Calcular projeção" }).click();
  await expect(page.locator(".lead-number")).toHaveText("~140");
  await expect(page.locator("#projection")).toContainText("Barbearia Prime");
  await page.getByRole("button", { name: "Editar cenário" }).click();
  await expect(page.locator("#companyName")).toHaveValue("Barbearia Prime");
  await page.locator("#monthlyCapacity").fill("30");
  await page.getByRole("button", { name: "Calcular projeção" }).click();
  await expect(page.locator(".capacity")).toContainText("acima da capacidade");
  await page.getByRole("button", { name: "Apresentar", exact: true }).click();
  await expect(page.locator(".form-panel")).toBeHidden();
  await page.getByRole("button", { name: "Sair da apresentação" }).click();
  await expect(page.locator(".form-panel")).toBeVisible();
  await page.getByRole("button", { name: "Nova projeção" }).click();
  await expect(page.locator("#companyName")).toHaveValue("");
  await expect(page.locator("#projection")).toHaveCount(0);
});
test("formatos e validação dos campos", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Usar exemplo" }).click();
  await page.locator("#averageTicket").fill("1500,5");
  await page.locator("#population").fill("250000");
  await page.locator("#maxAge").fill("19");
  await page.getByRole("button", { name: "Calcular projeção" }).click();
  await expect(page.locator("#averageTicket")).toHaveValue("1.500,50");
  await expect(page.locator("#population")).toHaveValue("250.000");
  await expect(page.locator("#maxAge-error")).toBeVisible();
  await page.locator("#maxAge").fill("45");
  await page.locator("#monthlyAdSpend").fill("-1");
  await page.getByRole("button", { name: "Calcular projeção" }).click();
  await expect(page.locator("#monthlyAdSpend-error")).toBeVisible();
});
for (const width of [390, 768, 1366, 1440, 1920])
  test(`layout ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.screenshot({
      path: `/tmp/ion-initial-${width}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Usar exemplo" }).click();
    await page.getByRole("button", { name: "Calcular projeção" }).click();
    await expect(page.locator(".lead-number")).toBeVisible();
    await page.locator("#projection").evaluate(async (el) => {
      await Promise.all(el.getAnimations().map((a) => a.finished));
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.screenshot({
      path: `/tmp/ion-result-${width}.png`,
      fullPage: true,
    });
  });

test("todos os controles atualizam o diagnóstico sem erros de execução", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Usar exemplo" }).click();
  await page.locator("#companyName").fill("Clínica Horizonte");
  await page.locator("#city").fill("São Paulo - SP");
  for (const [field, value] of Object.entries({
    averageTicket: "600",
    monthlyAdSpend: "3000",
    population: "12000000",
    minAge: "25",
    maxAge: "55",
    competitors: "12",
    monthlyCapacity: "40",
  }))
    await page.locator(`#${field}`).fill(value);
  await page.locator("#niche").selectOption("estetica");
  await page.locator("#segmentation").selectOption("completa");
  await page.getByRole("button", { name: "Feminino", exact: true }).click();
  await page.getByRole("button", { name: "Calcular projeção" }).click();
  await expect(page.locator("#projection")).toContainText("Clínica Horizonte");
  await expect(page.locator("#projection")).not.toContainText(/NaN|Infinity/);
  expect(errors).toEqual([]);
});
