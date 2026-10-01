import { expect, test } from "@playwright/test";

test("player can change the hypersphere visible slice and rotate through XW", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Hypersphere Thin Slice" })).toBeVisible();
  await expect(page.getByTestId("visible-radius")).toHaveText("1.00");

  await page.getByTestId("w-slider").fill("0.8");
  await expect(page.getByTestId("visible-radius")).toHaveText("0.60");
  await expect(page.getByTestId("slice-state")).toHaveText("visible");

  await page.getByTestId("w-slider").fill("1.5");
  await expect(page.getByTestId("visible-radius")).toHaveText("0.00");
  await expect(page.getByTestId("slice-state")).toHaveText("ghost-only");

  await page.getByTestId("reset-scene").click();
  await expect(page.getByTestId("visible-radius")).toHaveText("1.00");

  await page.getByTestId("rotate-xw").click();
  await expect(page.getByTestId("xw-rotation")).toHaveText("0.39");
  await expect(page.getByTestId("visible-radius")).not.toHaveText("1.00");

  expect(consoleErrors).toEqual([]);
});
