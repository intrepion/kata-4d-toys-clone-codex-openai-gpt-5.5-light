import { expect, test } from "@playwright/test";

test("player can change visible slices and rotate selected toys through XW", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Starter Scene" })).toBeVisible();
  await page.getByTestId("debug-toggle").click();
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

  await page.getByTestId("rotation-plane").selectOption("YZ");
  await page.getByTestId("rotate-xw").click();
  await expect(page.getByTestId("xw-rotation")).toHaveText("0.79");

  await page.getByTestId("spawn-selected").click();
  await expect(page.locator("body")).toHaveAttribute("data-selected-toy", /hypersphere-/);

  const beforeDrag = await page.getByTestId("toy-position").textContent();
  await page.locator("#toybox-canvas").dragTo(page.locator("#toybox-canvas"), {
    sourcePosition: { x: 420, y: 280 },
    targetPosition: { x: 540, y: 340 }
  });
  await expect(page.getByTestId("toy-position")).not.toHaveText(beforeDrag ?? "");

  await page.getByRole("button", { name: "Tesseract" }).click();
  await expect(page.getByTestId("selected-toy")).toHaveText("Tesseract");
  await expect(page.getByTestId("visible-radius")).toHaveText("0.62");
  await page.getByTestId("offset-slider").fill("0.5");
  await expect(page.getByTestId("visible-radius")).toHaveText("0.81");

  await page.getByRole("button", { name: "5-Cell Simplex" }).click();
  await expect(page.getByTestId("selected-toy")).toHaveText("5-Cell Simplex");
  await page.getByTestId("w-slider").fill("1.5");
  await expect(page.getByTestId("slice-state")).toHaveText("ghost-only");

  await page.getByTestId("reset-scene").click();
  await page.getByRole("button", { name: "Duocylinder" }).click();
  await expect(page.getByTestId("selected-toy")).toHaveText("Duocylinder");
  await page.getByTestId("offset-slider").fill("0");
  await expect(page.getByTestId("visible-radius")).toHaveText("0.94");

  await page.getByTestId("toss-selected").click();
  await expect(page.getByTestId("visible-radius")).toHaveText("0.94");
  await expect(page.getByTestId("debug-toggle")).toHaveText("Hide Debug");
  await page.getByRole("button", { name: "Tesseract" }).hover();
  await expect(page.getByTestId("hover-label")).toHaveText("Hover: Tesseract");
  await page.getByText("Controls").click();
  await expect(page.getByText("Toss Selected demonstrates auto-return recovery.")).toBeVisible();

  expect(consoleErrors).toEqual([]);
});
