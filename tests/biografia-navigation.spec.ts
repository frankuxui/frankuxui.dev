import { expect, test } from "@playwright/test";

test("entra a Biografía desde el inicio después de una navegación interna", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/sobre-mi");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  await page.locator("[data-toggle='header-link'][href='/biografia']").click();
  await page.waitForURL(/\/biografia\/?$/);
  await page.waitForTimeout(300);

  await expect(page.locator("#biografia-hero")).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  expect(await page.locator("#biografia-hero").evaluate((hero) => Math.abs(hero.getBoundingClientRect().top))).toBeLessThan(1);
});
