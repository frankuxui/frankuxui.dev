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
    await page.setViewportSize({ width: 3840, height: 1920 });
    await page.reload();
    await page.waitForTimeout(300);

    const swiper = page.locator(".knowledge-swiper");
    const nextButton = page.locator(".knowledge-next");

    await expect(swiper).toHaveClass(/swiper-initialized/);
    await expect(swiper.locator(".swiper-slide")).toHaveCount(21);
    expect(await page.locator(".knowledge-swiper-pagination .swiper-pagination-bullet").count()).toBeGreaterThan(1);

    const cardSizes = await swiper.locator(".swiper-slide").evaluateAll((cards) =>
      cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      })
    );
    expect(Math.max(...cardSizes.map(({ width }) => width)) - Math.min(...cardSizes.map(({ width }) => width))).toBeLessThan(1);
    expect(Math.max(...cardSizes.map(({ height }) => height)) - Math.min(...cardSizes.map(({ height }) => height))).toBeLessThan(1);

    const firstName = swiper.locator(".fx-stack-name").first();
    await page.evaluate(() => document.documentElement.style.setProperty("--gradient-1", "#123456"));
    await expect(firstName).toHaveCSS("color", "rgba(0, 0, 0, 0)");
    expect(await firstName.evaluate((name) => getComputedStyle(name).backgroundImage)).toContain("rgb(18, 52, 86)");

    const initialIndex = await swiper.evaluate((element: HTMLElement & { swiper?: { activeIndex: number } }) => element.swiper?.activeIndex ?? -1);
    await nextButton.click();
    await expect
      .poll(() => swiper.evaluate((element: HTMLElement & { swiper?: { activeIndex: number } }) => element.swiper?.activeIndex ?? -1))
      .toBeGreaterThan(initialIndex);
  });

  test("no fija la narrativa de marca antes de terminar Knowledge", async ({ page }) => {
    await page.setViewportSize({ width: 3840, height: 1920 });
    await page.reload();
    await page.waitForTimeout(500);

    const brand = page.locator(".about-brand-fx");
    const brandTop = await brand.evaluate((section) => section.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((target) => window.scrollTo(0, target), brandTop - 1920 * 0.65);
    await page.waitForTimeout(500);

    const state = await page.evaluate(() => {
      const section = document.querySelector(".about-brand-fx")!;
      const narrative = section.querySelector(".fx-narrative")!;
      return {
        sectionTop: section.getBoundingClientRect().top,
        narrativePosition: getComputedStyle(narrative).position
      };
    });

    expect(state.sectionTop).toBeGreaterThan(0);
    expect(state.narrativePosition).not.toBe("fixed");
  });
});
