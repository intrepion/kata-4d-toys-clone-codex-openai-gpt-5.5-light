import { expect, test } from "@playwright/test";
import path from "node:path";

test("root index.html launches from file protocol", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  const fileUrl = `file://${path.resolve("index.html")}`;
  await page.goto(fileUrl);
  await page.getByTestId("debug-toggle").click();
  await expect(page.getByRole("heading", { name: "Starter Scene" })).toBeVisible();
  await expect(page.getByTestId("visible-radius")).toHaveText("1.00");
  await page.getByTestId("w-slider").fill("0.8");
  await expect(page.getByTestId("visible-radius")).toHaveText("0.60");
  expect(consoleErrors).toEqual([]);
});
