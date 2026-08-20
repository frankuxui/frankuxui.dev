import { expect, test } from "@playwright/test";

test("el logo animado adopta el contraste de la superficie que tiene debajo", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => localStorage.setItem("frankuxui-logo-side", "right"));
  await page.goto("/sobre-mi");
  await page.waitForTimeout(300);

  const logo = page.locator("#logo-intro");
  await expect(logo).not.toHaveAttribute("data-contrast", "dark");

  await page.evaluate(() => document.documentElement.style.setProperty("--primary", "#123456"));
  await expect(logo).toHaveCSS("color", "rgb(18, 52, 86)");

  await page.locator(".about-knowledge-fx").scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
  await expect(logo).toHaveAttribute("data-contrast", "dark");
  await expect(logo).toHaveCSS("color", "rgb(255, 255, 255)");
});
