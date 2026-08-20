import { expect, test } from "@playwright/test";

test("el logo animado adopta el contraste de la superficie que tiene debajo", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => localStorage.setItem("frankuxui-logo-side", "right"));
  await page.goto("/sobre-mi");
  await page.waitForTimeout(300);

  const logo = page.locator("#logo-intro");
  const logoButton = page.locator("#logo-intro-btn");
  const eye = page.locator("#eye-left ellipse");
  const pupil = page.locator("#pupil-left");
  await expect(logo).not.toHaveAttribute("data-contrast", "dark");
  await expect(eye).toHaveCSS("fill", "rgb(255, 255, 255)");
  await expect(pupil).toHaveCSS("fill", "rgb(11, 11, 11)");

  await page.evaluate(() => document.documentElement.style.setProperty("--primary", "#123456"));
  await expect(logo).toHaveCSS("color", "rgb(18, 52, 86)");

  await page.locator(".about-knowledge-fx").scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
  await expect(logo).toHaveAttribute("data-contrast", "dark");
  await expect(logo).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(eye).toHaveCSS("fill", "rgb(11, 11, 11)");
  await expect(pupil).toHaveCSS("fill", "rgb(255, 255, 255)");

  await page.locator("#about-brand-cta").scrollIntoViewIfNeeded();
  await expect(logo).toHaveAttribute("data-contrast", "dark");
  await expect(logoButton).toHaveCSS("opacity", "1", { timeout: 3_000 });
});
