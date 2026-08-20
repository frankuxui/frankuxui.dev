import { expect, test } from "@playwright/test";

async function getDesktopRange(page: import("@playwright/test").Page) {
  return page.locator(".fx-narrative").evaluate((narrative) => {
    const spacer = narrative.parentElement as HTMLElement;
    return {
      start: spacer.getBoundingClientRect().top + window.scrollY,
      distance: Number.parseFloat(spacer.style.marginBottom)
    };
  });
}

async function scrollBrandStory(page: import("@playwright/test").Page, progress: number) {
  const range = await getDesktopRange(page);
  await page.evaluate(({ start, distance, progress }) => window.scrollTo(0, start + distance * progress), { ...range, progress });
  await page.waitForTimeout(350);
}

test.describe("About brand scroll narrative", () => {
  test("ordena título, lead, desplazamiento y cards dentro de una sola escena", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/sobre-mi");
    await page.waitForTimeout(500);

    await expect(page.locator(".fx-card")).toHaveCount(3);
    expect(await page.locator(".fx-card-key").evaluateAll((keys) => keys.map((key) => key.getAttribute("aria-label")))).toEqual(["Frank", "UX", "UI"]);
    await expect(page.locator(".fx-card-char").first()).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator(".fx-narrative").locator("xpath=..")).toHaveClass(/pin-spacer/);

    await scrollBrandStory(page, 0.12);
    expect(await page.locator(".about-brand-fx .fx-title").evaluate((title) => Number(getComputedStyle(title.querySelector(".fx-brand")!).opacity))).toBeGreaterThan(0.9);
    await expect(page.locator(".about-brand-fx .fx-lead")).toHaveCSS("opacity", "0");

    await scrollBrandStory(page, 0.24);
    expect(Number(await page.locator(".about-brand-fx .fx-lead").evaluate((lead) => getComputedStyle(lead).opacity))).toBeGreaterThan(0.9);
    expect(await page.locator(".fx-card").evaluateAll((cards) => cards.every((card) => Number(getComputedStyle(card).opacity) < 0.05))).toBe(true);

    await scrollBrandStory(page, 0.37);
    const positionedHeader = await page.evaluate(() => {
      const heading = document.querySelector(".fx-heading")!.getBoundingClientRect();
      const stage = document.querySelector(".fx-stage")!;
      const stageRect = stage.getBoundingClientRect();
      const expectedLeft = stageRect.left + Number.parseFloat(getComputedStyle(stage).paddingLeft);
      return { delta: Math.abs(heading.left - expectedLeft), cardOpacity: Number(getComputedStyle(document.querySelector(".fx-card")!).opacity) };
    });
    expect(positionedHeader.delta).toBeLessThan(6);
    expect(positionedHeader.cardOpacity).toBeLessThan(0.05);

    await scrollBrandStory(page, 0.62);
    const firstCard = await page
      .locator(".fx-card")
      .first()
      .evaluate((card) => ({
        visibleChars: Array.from(card.querySelectorAll(".fx-card-char")).filter((char) => Number(getComputedStyle(char).opacity) > 0.9).length,
        title: Number(getComputedStyle(card.querySelector(".fx-card-title")!).opacity),
        body: Number(getComputedStyle(card.querySelector(".fx-card-body")!).opacity)
      }));
    expect(firstCard.visibleChars).toBe(5);
    expect(firstCard.title).toBeGreaterThan(0.9);
    expect(firstCard.body).toBeGreaterThan(0.9);
    await expect(page.locator(".fx-card").nth(1)).toHaveCSS("opacity", "0");

    await scrollBrandStory(page, 0.9);
    expect(await page.locator(".fx-card").evaluateAll((cards) => Number(getComputedStyle(cards[2]).opacity))).toBeGreaterThan(0.9);
    expect(
      await page
        .locator(".fx-card")
        .nth(2)
        .locator(".fx-card-body")
        .evaluate((body) => Number(getComputedStyle(body).opacity))
    ).toBeLessThan(0.1);

    await scrollBrandStory(page, 1);
    expect(await page.locator(".fx-card-body").evaluateAll((bodies) => bodies.every((body) => Number(getComputedStyle(body).opacity) > 0.9))).toBe(true);
    expect(await page.locator(".fx-cta").evaluate((cta) => cta.closest(".pin-spacer") === null)).toBe(true);
  });

  test("simplifica móvil y reduced-motion sin pin prolongado", async ({ browser }) => {
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto("/sobre-mi");
    await mobilePage.waitForTimeout(400);
    expect(await mobilePage.locator(".fx-narrative").evaluate((narrative) => narrative.parentElement?.classList.contains("pin-spacer"))).toBe(false);
    expect(await mobilePage.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await mobilePage.close();

    const reducedPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    await reducedPage.goto("/sobre-mi");
    await reducedPage.waitForTimeout(400);
    expect(await reducedPage.locator(".fx-narrative").evaluate((narrative) => narrative.parentElement?.classList.contains("pin-spacer"))).toBe(false);
    expect(await reducedPage.locator(".fx-card").evaluateAll((cards) => cards.every((card) => Number(getComputedStyle(card).opacity) === 1))).toBe(true);
    expect(await reducedPage.locator(".fx-heading").evaluate((heading) => getComputedStyle(heading).position)).not.toBe("absolute");
    await reducedPage.close();
  });
});
