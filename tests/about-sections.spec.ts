import { expect, test } from "@playwright/test";

test.describe("About content sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/sobre-mi");
    await page.waitForTimeout(400);
  });

  test("muestra Next.js como contenido estático centrado", async ({ page }) => {
    const section = page.locator("section[aria-labelledby='about-nextjs-title']");
    const content = section.locator(":scope > div");

    await expect(section).toBeVisible();
    expect(await content.evaluate((element) => element.getBoundingClientRect().width)).toBeLessThanOrEqual(1024);
    expect(await section.evaluate((element) => element.closest(".pin-spacer"))).toBeNull();
    await expect(section.locator("[aria-label='Casos de uso'] li")).toHaveCount(6);
  });

  test("convierte las tarjetas de conocimiento en un Swiper navegable", async ({ page }) => {
    const swiper = page.locator(".knowledge-swiper");
    const nextButton = page.locator(".knowledge-next");

    await expect(swiper).toHaveClass(/swiper-initialized/);
    await expect(swiper.locator(".swiper-slide")).toHaveCount(21);
    expect(await page.locator(".knowledge-swiper-pagination .swiper-pagination-bullet").count()).toBeGreaterThan(1);

    const initialIndex = await swiper.evaluate((element: HTMLElement & { swiper?: { activeIndex: number } }) => element.swiper?.activeIndex ?? -1);
    await nextButton.click();
    await expect
      .poll(() => swiper.evaluate((element: HTMLElement & { swiper?: { activeIndex: number } }) => element.swiper?.activeIndex ?? -1))
      .toBeGreaterThan(initialIndex);
  });
});
