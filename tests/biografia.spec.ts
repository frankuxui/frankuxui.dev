import { expect, test } from "@playwright/test";

const SCROLL_DISTANCE_FACTOR = 0.9;

async function waitForBiografiaIntro(page: import("@playwright/test").Page) {
  await page.waitForFunction(() => document.documentElement.style.overflow !== "hidden");
  await page.waitForTimeout(150);
}

async function scrollStoryTo(page: import("@playwright/test").Page, progress: number) {
  await page.evaluate(({ value, factor }) => window.scrollTo(0, window.innerHeight * 9 * factor * value), {
    value: progress,
    factor: SCROLL_DISTANCE_FACTOR
  });
  await page.waitForTimeout(850);
}

async function scrollPortableCardsTo(page: import("@playwright/test").Page, progress: number) {
  const range = await page.locator(".biografia-vertical-stage").evaluate((stage) => ({
    start: stage.getBoundingClientRect().top + window.scrollY,
    distance: Math.max((stage as HTMLElement).offsetHeight - window.innerHeight, 1)
  }));
  await page.evaluate(({ start, distance, value }) => window.scrollTo(0, start + distance * value), { ...range, value: progress });
  await page.waitForTimeout(850);
}

test.describe("Biografía motion narrative", () => {
  test("conserva la intro y revela eyebrow, title y description en orden", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/biografia");

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.locator(".biografia-vertical-card")).toHaveCount(5);
    await expect(page.locator(".biografia-card")).toHaveCount(5);
    await waitForBiografiaIntro(page);
    await expect(page.locator('[data-toggle="header"]')).not.toHaveAttribute("data-contrast", "dark");

    await scrollStoryTo(page, 0.105);
    const eyebrowStep = await page.evaluate(() => ({
      eyebrow: Number(getComputedStyle(document.querySelector(".biografia-eyebrow")!).opacity),
      visibleTitleChars: Array.from(document.querySelectorAll(".biografia-title span")).filter((char) => Number(getComputedStyle(char).opacity) > 0.5).length,
      desc: Number(getComputedStyle(document.querySelector(".biografia-desc")!).opacity)
    }));
    expect(eyebrowStep.eyebrow).toBeGreaterThan(0.65);
    expect(eyebrowStep.visibleTitleChars).toBeLessThan(4);
    expect(eyebrowStep.desc).toBeLessThan(0.1);

    await scrollStoryTo(page, 0.18);
    const titleStep = await page.evaluate(() => ({
      eyebrow: Number(getComputedStyle(document.querySelector(".biografia-eyebrow")!).opacity),
      visibleTitleChars: Array.from(document.querySelectorAll(".biografia-title span")).filter((char) => Number(getComputedStyle(char).opacity) > 0.5).length,
      desc: Number(getComputedStyle(document.querySelector(".biografia-desc")!).opacity)
    }));
    expect(titleStep.eyebrow).toBeGreaterThan(0.95);
    expect(titleStep.visibleTitleChars).toBeGreaterThan(5);
    expect(titleStep.desc).toBeLessThan(0.1);

    await scrollStoryTo(page, 0.27);
    const descriptionStep = await page.evaluate(() => {
      const logo = document.querySelector(".biografia-logo-svg")!.getBoundingClientRect();
      const eyebrow = document.querySelector(".biografia-eyebrow")!.getBoundingClientRect();
      const headerLogo = document.querySelector('[data-toggle="header"] [data-testid="header-logo"]')!.getBoundingClientRect();
      return {
        desc: Number(getComputedStyle(document.querySelector(".biografia-desc")!).opacity),
        stageClip: getComputedStyle(document.querySelector(".biografia-vertical-stage")!).clipPath,
        logoLetterFill: getComputedStyle(document.querySelector(".bio-letter")!).fill,
        horizontalAlignmentDelta: Math.abs(logo.left - eyebrow.left),
        headerLogoAlignmentDelta: Math.abs(logo.left - headerLogo.left),
        headerTextAlignmentDelta: Math.abs(eyebrow.left - headerLogo.left),
        logoToTextGap: eyebrow.top - logo.bottom
      };
    });
    expect(descriptionStep.desc).toBeGreaterThan(0.9);
    expect(descriptionStep.stageClip).toContain("100%");
    expect(descriptionStep.logoLetterFill).toBe("rgb(20, 91, 91)");
    expect(descriptionStep.horizontalAlignmentDelta).toBeLessThan(3);
    expect(descriptionStep.headerLogoAlignmentDelta).toBeLessThan(3);
    expect(descriptionStep.headerTextAlignmentDelta).toBeLessThan(3);
    expect(descriptionStep.logoToTextGap).toBeGreaterThanOrEqual(-10);
    expect(descriptionStep.logoToTextGap).toBeLessThan(120);
    expect(errors).toEqual([]);
  });

  test("transforma el aside y recorre las cinco tarjetas verticales", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/biografia");
    await waitForBiografiaIntro(page);

    await expect(page.locator(".biografia-vertical-card h2")).toHaveText(["Diseño con intención", "Experiencia primero", "Código sostenible", "Movimiento funcional", "Evolución constante"]);
    await expect(page.locator(".biografia-vertical-card-image")).toHaveCount(5);
    const verticalCardImages = await page.locator(".biografia-vertical-card-image").evaluateAll((images) =>
      images.map((image) => ({
        src: image.getAttribute("src"),
        position: getComputedStyle(image).position,
        zIndex: Number(getComputedStyle(image).zIndex)
      }))
    );
    expect(verticalCardImages.map((image) => image.src)).toEqual([
      "/biography-cards/card-01.webp",
      "/biography-cards/card-02.webp",
      "/biography-cards/card-03.webp",
      "/biography-cards/card-04.webp",
      "/biography-cards/card-05.webp"
    ]);
    expect(verticalCardImages.every((image) => image.position === "absolute" && image.zIndex === 0)).toBe(true);
    await expect(page.locator(".biografia-vertical-card-copy").first()).toHaveCSS("z-index", "2");
    const imageVignette = await page
      .locator(".biografia-vertical-card")
      .first()
      .evaluate((card) => {
        const style = getComputedStyle(card, "::before");
        return { position: style.position, backgroundImage: style.backgroundImage };
      });
    expect(imageVignette.position).toBe("absolute");
    expect(imageVignette.backgroundImage).toContain("radial-gradient");
    expect(imageVignette.backgroundImage).toContain("linear-gradient");

    await scrollStoryTo(page, 0.36);
    const transformedAside = await page.evaluate(() => ({
      eyebrowColor: getComputedStyle(document.querySelector(".biografia-eyebrow")!).color,
      titleColor: getComputedStyle(document.querySelector(".biografia-title")!).color,
      descColor: getComputedStyle(document.querySelector(".biografia-desc")!).color,
      asideTransform: getComputedStyle(document.querySelector(".biografia-aside-inner")!).transform,
      stageBackground: getComputedStyle(document.querySelector(".biografia-vertical-stage")!).backgroundColor,
      stageClip: getComputedStyle(document.querySelector(".biografia-vertical-stage")!).clipPath,
      logoZIndex: Number(getComputedStyle(document.querySelector(".biografia-logo-layer")!).zIndex),
      photoZIndex: Number(getComputedStyle(document.querySelector(".biografia-photo-layer")!).zIndex),
      stageZIndex: Number(getComputedStyle(document.querySelector(".biografia-vertical-stage")!).zIndex),
      visibleLogoLetters: Array.from(document.querySelectorAll(".bio-letter")).filter((letter) => Number(getComputedStyle(letter).opacity) > 0.9).length,
      logoLetterFill: getComputedStyle(document.querySelector(".bio-letter")!).fill,
      horizontalAlignmentDelta: Math.abs(document.querySelector(".biografia-logo-svg")!.getBoundingClientRect().left - document.querySelector(".biografia-eyebrow")!.getBoundingClientRect().left)
    }));
    expect(transformedAside.eyebrowColor).toBe("rgb(245, 245, 240)");
    expect(transformedAside.titleColor).toBe("rgb(245, 245, 240)");
    expect(transformedAside.descColor).toBe("rgb(245, 245, 240)");
    expect(transformedAside.asideTransform).not.toBe("none");
    expect(transformedAside.stageBackground).toBe("rgb(0, 0, 0)");
    expect(transformedAside.stageClip).toContain("inset(0%");
    expect(transformedAside.logoZIndex).toBeGreaterThan(transformedAside.stageZIndex);
    expect(transformedAside.photoZIndex).toBeGreaterThan(transformedAside.logoZIndex);
    expect(transformedAside.visibleLogoLetters).toBeGreaterThan(0);
    expect(transformedAside.logoLetterFill).toBe("rgb(255, 255, 255)");
    expect(transformedAside.horizontalAlignmentDelta).toBeLessThan(3);
    await expect(page.locator('[data-toggle="header"]')).toHaveAttribute("data-contrast", "dark");
    await expect(page.locator('[data-toggle="header"] [data-testid="header-logo"]')).toHaveCSS("color", "rgb(245, 245, 240)");
    await expect(page.locator('[data-toggle="palette-modal"]')).toHaveCSS("color", "rgb(245, 245, 240)");
    for (const [index, progress] of [0.44, 0.55, 0.66, 0.78, 0.92].entries()) {
      await scrollStoryTo(page, progress);
      const cardStates = await page.locator(".biografia-vertical-card").evaluateAll((cards) =>
        cards.map((card) => {
          const rect = card.getBoundingClientRect();
          return {
            opacity: Number(getComputedStyle(card).opacity),
            crossesViewportCenter: rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2
          };
        })
      );
      expect(cardStates[index].crossesViewportCenter).toBe(true);
      expect(cardStates.every((card) => card.opacity === 1)).toBe(true);
    }

    const activeCardCenter = await page
      .locator(".biografia-vertical-card")
      .last()
      .evaluate((card) => {
        const rect = card.getBoundingClientRect();
        return (rect.left + rect.width / 2) / window.innerWidth;
      });
    expect(activeCardCenter).toBeGreaterThan(0.495);
    expect(activeCardCenter).toBeLessThan(0.505);

    const storyEnd = 900 * 9 * SCROLL_DISTANCE_FACTOR;
    await page.evaluate((top) => window.scrollTo(0, top + window.innerHeight * 0.75), storyEnd);
    await page.waitForTimeout(850);
    const naturalExit = await page.evaluate(() => ({
      introTop: document.querySelector("#biografia-hero")!.getBoundingClientRect().top,
      asideTop: document.querySelector(".biografia-aside")!.getBoundingClientRect().top,
      stageTop: document.querySelector(".biografia-vertical-stage")!.getBoundingClientRect().top
    }));
    expect(naturalExit.introTop).toBeLessThan(0);
    expect(naturalExit.asideTop).toBeLessThan(0);
    expect(naturalExit.stageTop).toBeLessThan(0);
  });

  test("ocupa todo el viewport en horizontal, usa primary y termina antes del cierre negro", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/biografia");
    await waitForBiografiaIntro(page);

    const horizontalStart = await page.locator(".biografia-horizontal-section").evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((top) => window.scrollTo(0, top), horizontalStart);
    await page.waitForTimeout(1000);
    await expect(page.locator('[data-toggle="header"]')).toHaveAttribute("data-contrast", "dark");
    await expect(page.locator('[data-toggle="header"] [data-testid="header-logo"]')).toHaveCSS("color", "rgb(245, 245, 240)");

    await expect(page.locator(".biografia-horizontal-eyebrow")).toHaveText("Visión y proceso");
    await expect(page.locator("#biografia-horizontal-title")).toContainText("Diseño y desarrollo");
    await expect(page.locator(".biografia-horizontal-intro")).toContainText("Más de siete años construyendo experiencias digitales");

    const horizontalGeometry = await page.evaluate(() => {
      const section = document.querySelector(".biografia-horizontal-section")!;
      const viewport = document.querySelector(".biografia-horizontal-viewport")!;
      const heading = document.querySelector(".biografia-horizontal-heading")!.getBoundingClientRect();
      const intro = document.querySelector(".biografia-horizontal-intro")!.getBoundingClientRect();
      const card = document.querySelector(".biografia-card")!.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      return {
        sectionWidth: section.getBoundingClientRect().width,
        sectionBackground: getComputedStyle(section).backgroundColor,
        viewportLeft: viewportRect.left,
        viewportWidth: viewportRect.width,
        viewportTop: viewportRect.top,
        headingLeft: heading.left,
        headingRight: heading.right,
        headingBottom: heading.bottom,
        introLeft: intro.left,
        introTop: intro.top,
        introBottom: intro.bottom,
        cardWidth: card.width,
        cardHeight: card.height,
        pageScrollWidth: document.documentElement.scrollWidth
      };
    });
    expect(horizontalGeometry.sectionWidth).toBe(1440);
    expect(horizontalGeometry.sectionBackground).toBe("rgb(20, 91, 91)");
    expect(horizontalGeometry.viewportLeft).toBe(0);
    expect(horizontalGeometry.viewportWidth).toBe(1440);
    expect(horizontalGeometry.headingRight).toBeLessThan(horizontalGeometry.introLeft);
    expect(horizontalGeometry.introTop).toBeLessThan(horizontalGeometry.viewportTop);
    expect(Math.max(horizontalGeometry.headingBottom, horizontalGeometry.introBottom)).toBeLessThan(horizontalGeometry.viewportTop + 10);
    expect(horizontalGeometry.cardWidth).toBeLessThanOrEqual(361);
    expect(horizontalGeometry.cardHeight / horizontalGeometry.cardWidth).toBeGreaterThan(1.45);
    expect(horizontalGeometry.pageScrollWidth).toBeLessThanOrEqual(1440);

    const horizontalPinDistance = await page.locator(".biografia-horizontal-section").evaluate((_section, factor) => {
      const viewport = document.querySelector(".biografia-horizontal-viewport") as HTMLElement;
      const track = document.querySelector(".biografia-horizontal-track") as HTMLElement;
      const lastCard = document.querySelector(".biografia-card:last-child") as HTMLElement;
      const startX = viewport.clientWidth * (window.innerWidth < 1024 ? 0.88 : 0.78);
      const endX = lastCard ? -(lastCard.offsetLeft + lastCard.offsetWidth) : -track.scrollWidth;
      return Math.max(Math.round(Math.max(startX - endX, window.innerWidth) * factor), window.innerWidth);
    }, SCROLL_DISTANCE_FACTOR);
    await page.evaluate(({ top, distance }) => window.scrollTo(0, top + distance - 2), {
      top: horizontalStart,
      distance: horizontalPinDistance
    });
    await page.waitForTimeout(1200);

    const lastCardRight = await page
      .locator(".biografia-card")
      .last()
      .evaluate((card) => card.getBoundingClientRect().right);
    expect(lastCardRight).toBeLessThanOrEqual(5);

    const finalStart = await page.locator(".biografia-final-section").evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
    expect(finalStart).toBeGreaterThan(horizontalStart + horizontalPinDistance);

    await page.evaluate(({ top, distance }) => window.scrollTo(0, top + distance + 120), {
      top: horizontalStart,
      distance: horizontalPinDistance
    });
    await page.waitForTimeout(700);
    const finalEntryTop = await page.locator(".biografia-final-section").evaluate((element) => element.getBoundingClientRect().top);
    expect(finalEntryTop).toBeLessThan(900);

    await page.evaluate((top) => window.scrollTo(0, top), finalStart);
    await page.waitForTimeout(1000);
    await expect(page.locator(".biografia-final-section")).toHaveCSS("background-color", "rgb(0, 0, 0)");
    await expect(page.locator('[data-toggle="header"]')).toHaveAttribute("data-contrast", "dark");

    const finalPinDistance = await page.locator(".biografia-final-section").evaluate((_section, factor) => {
      const chars = document.querySelectorAll(".biografia-final-char").length;
      return Math.round(Math.max(window.innerHeight * 2.2, chars * 42) * factor);
    }, SCROLL_DISTANCE_FACTOR);
    await page.evaluate(({ top, distance }) => window.scrollTo(0, top + distance * 0.58), { top: finalStart, distance: finalPinDistance });
    await page.waitForTimeout(1000);

    const characterState = await page.locator(".biografia-final-char").evaluateAll((characters) => {
      const visible = characters.filter((character) => Number(getComputedStyle(character).opacity) > 0.8).length;
      return { visible, total: characters.length };
    });
    expect(characterState.visible).toBeGreaterThan(0);
    expect(characterState.visible).toBeLessThan(characterState.total);
  });

  test("libera el Hero antes de las cards y evita overflow en portátil", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 800 });
    await page.goto("/biografia");
    await waitForBiografiaIntro(page);

    await scrollPortableCardsTo(page, 0.12);
    const laptopState = await page.evaluate(() => {
      const intro = document.querySelector("#biografia-hero")!;
      const aside = document.querySelector(".biografia-aside")!.getBoundingClientRect();
      const firstCard = document.querySelector(".biografia-vertical-card")!.getBoundingClientRect();
      return {
        introPosition: getComputedStyle(intro).position,
        introHasPinSpacer: intro.parentElement?.classList.contains("pin-spacer") ?? false,
        asideBottom: aside.bottom,
        cardsPosition: getComputedStyle(document.querySelector(".biografia-vertical-cards")!).position,
        firstCardCrossesCenter: firstCard.top <= window.innerHeight / 2 && firstCard.bottom >= window.innerHeight / 2,
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth
      };
    });
    expect(laptopState.introPosition).not.toBe("fixed");
    expect(laptopState.introHasPinSpacer).toBe(false);
    expect(laptopState.asideBottom).toBeLessThanOrEqual(0);
    expect(laptopState.cardsPosition).toBe("sticky");
    expect(laptopState.firstCardCrossesCenter).toBe(true);
    expect(laptopState.scrollWidth).toBeLessThanOrEqual(laptopState.viewportWidth);
  });

  test("mantiene el Hero estático y recupera las cards horizontales animadas en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/biografia");
    await page.waitForLoadState("domcontentloaded");

    const mobileGeometry = await page.evaluate(() => {
      const logo = document.querySelector(".biografia-logo-svg")!.getBoundingClientRect();
      const logoLayer = document.querySelector(".biografia-logo-layer")!.getBoundingClientRect();
      const aside = document.querySelector(".biografia-aside-inner")!.getBoundingClientRect();
      const photo = document.querySelector(".biografia-photo-layer")!.getBoundingClientRect();
      const photoImage = document.querySelector(".biografia-photo")!.getBoundingClientRect();
      const stage = document.querySelector(".biografia-vertical-stage")!.getBoundingClientRect();
      const cards = Array.from(document.querySelectorAll(".biografia-vertical-card"));
      const cardRects = cards.map((card) => card.getBoundingClientRect());
      const title = document.querySelector(".biografia-title") as HTMLElement;
      return {
        htmlOverflow: document.documentElement.style.overflow,
        bodyOverflow: document.body.style.overflow,
        scrollY: window.scrollY,
        titleWasSplit: title.dataset.split === "true",
        titleCharacterSpans: title.querySelectorAll("span").length,
        introHasPinSpacer: document.querySelector("#biografia-hero")?.parentElement?.classList.contains("pin-spacer") ?? false,
        logoPosition: getComputedStyle(document.querySelector(".biografia-logo-layer")!).position,
        asidePosition: getComputedStyle(document.querySelector(".biografia-aside")!).position,
        cardsPosition: getComputedStyle(document.querySelector(".biografia-vertical-cards")!).position,
        firstCardPosition: getComputedStyle(cards[0]).position,
        logoOpacity: Number(getComputedStyle(document.querySelector(".bio-letter")!).opacity),
        photoOpacity: Number(getComputedStyle(document.querySelector(".biografia-photo")!).opacity),
        eyebrowOpacity: Number(getComputedStyle(document.querySelector(".biografia-eyebrow")!).opacity),
        asideBeforePhoto: aside.bottom <= photo.top,
        logoOverlapsPhoto: logo.top < photoImage.bottom && logo.bottom > photoImage.top,
        logoBehindPhoto: Number(getComputedStyle(document.querySelector(".biografia-logo-layer")!).zIndex) < Number(getComputedStyle(document.querySelector(".biografia-photo-layer")!).zIndex),
        photoStageGap: Math.abs(stage.top - photo.bottom),
        compositionHeight: Math.abs(logoLayer.height - photo.height),
        cardsInOrder: cardRects.every((rect, index) => index === 0 || rect.top > cardRects[index - 1].top),
        asideLeft: aside.left,
        asideRight: aside.right,
        cardsInsideViewport: cardRects.every((rect) => rect.left >= 0 && rect.right <= window.innerWidth),
        verticalCards: cards.length,
        horizontalCards: document.querySelectorAll(".biografia-card").length,
        pageScrollWidth: document.documentElement.scrollWidth
      };
    });
    expect(mobileGeometry.htmlOverflow).not.toBe("hidden");
    expect(mobileGeometry.bodyOverflow).not.toBe("hidden");
    expect(mobileGeometry.scrollY).toBe(0);
    expect(mobileGeometry.titleWasSplit).toBe(false);
    expect(mobileGeometry.titleCharacterSpans).toBe(0);
    expect(mobileGeometry.introHasPinSpacer).toBe(false);
    expect(mobileGeometry.logoPosition).toBe("relative");
    expect(mobileGeometry.asidePosition).toBe("relative");
    expect(mobileGeometry.cardsPosition).toBe("relative");
    expect(mobileGeometry.firstCardPosition).toBe("relative");
    expect(mobileGeometry.logoOpacity).toBe(1);
    expect(mobileGeometry.photoOpacity).toBe(1);
    expect(mobileGeometry.eyebrowOpacity).toBe(1);
    expect(mobileGeometry.asideBeforePhoto).toBe(true);
    expect(mobileGeometry.logoOverlapsPhoto).toBe(true);
    expect(mobileGeometry.logoBehindPhoto).toBe(true);
    expect(mobileGeometry.photoStageGap).toBeLessThanOrEqual(1);
    expect(mobileGeometry.compositionHeight).toBeLessThanOrEqual(1);
    expect(mobileGeometry.cardsInOrder).toBe(true);
    expect(mobileGeometry.asideLeft).toBeGreaterThanOrEqual(0);
    expect(mobileGeometry.asideRight).toBeLessThanOrEqual(390);
    expect(mobileGeometry.cardsInsideViewport).toBe(true);
    expect(mobileGeometry.verticalCards).toBe(5);
    expect(mobileGeometry.horizontalCards).toBe(5);
    expect(mobileGeometry.pageScrollWidth).toBeLessThanOrEqual(390);

    const horizontalStart = await page.locator(".biografia-horizontal-section").evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((top) => window.scrollTo(0, top), horizontalStart);
    await page.waitForTimeout(300);

    const mobileHorizontal = await page.evaluate(() => {
      const heading = document.querySelector(".biografia-horizontal-heading")!.getBoundingClientRect();
      const intro = document.querySelector(".biografia-horizontal-intro")!.getBoundingClientRect();
      const card = document.querySelector(".biografia-card")!.getBoundingClientRect();
      const viewport = document.querySelector(".biografia-horizontal-viewport") as HTMLElement;
      const section = document.querySelector(".biografia-horizontal-section")!;
      return {
        headingBottom: heading.bottom,
        introTop: intro.top,
        introRight: intro.right,
        cardWidth: card.width,
        cardHeight: card.height,
        viewportPosition: getComputedStyle(viewport).position,
        viewportOverflowX: getComputedStyle(viewport).overflowX,
        trackTransform: getComputedStyle(document.querySelector(".biografia-horizontal-track")!).transform,
        sectionHasPinSpacer: section.parentElement?.classList.contains("pin-spacer") ?? false,
        scrollWidth: document.documentElement.scrollWidth
      };
    });
    expect(mobileHorizontal.introTop).toBeGreaterThanOrEqual(mobileHorizontal.headingBottom);
    expect(mobileHorizontal.introRight).toBeLessThanOrEqual(390);
    expect(mobileHorizontal.cardHeight).toBeGreaterThan(mobileHorizontal.cardWidth);
    expect(mobileHorizontal.viewportPosition).toBe("absolute");
    expect(mobileHorizontal.viewportOverflowX).toBe("clip");
    expect(mobileHorizontal.trackTransform).not.toBe("none");
    expect(mobileHorizontal.sectionHasPinSpacer).toBe(true);
    expect(mobileHorizontal.scrollWidth).toBeLessThanOrEqual(390);

    const horizontalDistance = await page.locator(".biografia-horizontal-section").evaluate((_section, factor) => {
      const viewport = document.querySelector(".biografia-horizontal-viewport") as HTMLElement;
      const lastCard = document.querySelector(".biografia-card:last-child") as HTMLElement;
      const startX = viewport.clientWidth * 0.88;
      const endX = -(lastCard.offsetLeft + lastCard.offsetWidth);
      return Math.max(Math.round(Math.max(startX - endX, window.innerWidth) * factor), window.innerWidth);
    }, SCROLL_DISTANCE_FACTOR);
    await page.evaluate(({ top, distance }) => window.scrollTo(0, top + distance * 0.5), {
      top: horizontalStart,
      distance: horizontalDistance
    });
    await page.waitForTimeout(700);
    const middleTransform = await page.locator(".biografia-horizontal-track").evaluate((track) => getComputedStyle(track).transform);
    expect(middleTransform).not.toBe(mobileHorizontal.trackTransform);

    await expect(page.locator('[data-toggle="header"]')).toHaveAttribute("data-contrast", "dark");
    await expect(page.locator(".header-mobile-toggle")).toHaveCSS("color", "rgb(245, 245, 240)");

    const finalState = await page.locator(".biografia-final-section").evaluate((section) => ({
      position: getComputedStyle(section).position,
      hasPinSpacer: section.parentElement?.classList.contains("pin-spacer") ?? false,
      visibleCharacters: Array.from(section.querySelectorAll(".biografia-final-char")).filter((character) => Number(getComputedStyle(character).opacity) > 0.9).length
    }));
    expect(finalState.position).not.toBe("fixed");
    expect(finalState.hasPinSpacer).toBe(false);
    expect(finalState.visibleCharacters).toBeGreaterThan(0);
  });
});
