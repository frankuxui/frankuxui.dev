import { test, expect } from '@playwright/test';

// La pagina contiene titulo correcto
test('La página principal tiene el título correcto', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  await expect(page).toHaveTitle(/Frankuxui/);
});

// La poagina contiene la etiqueta meta description
test('La página principal tiene la etiqueta meta description correcta', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(description).toBeTruthy(); // Puedes ajustar el valor esperado si tienes un texto específico
});

// La pagina contiene la etiqueta meta keywords
test('La página principal tiene la etiqueta meta keywords correcta', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  const keywords = await page.locator('meta[name="keywords"]').getAttribute('content');
  expect(keywords).toBeTruthy(); // Puedes ajustar el valor esperado si tienes un texto específico
});

// La pagina contiene la etiqueta meta robots
test('La página principal tiene la etiqueta meta robots correcta', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  const robots = await page.locator('meta[name="robots"]').getAttribute('content');
  expect(robots).toBeTruthy(); // Puedes ajustar el valor esperado si tienes un texto específico
});

// La pagina contiene la etiqueta meta og:title
test('La página principal tiene la etiqueta meta og:title correcta', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
  expect(ogTitle).toBeTruthy(); // Puedes ajustar el valor esperado si tienes un texto específico
});

// La pagina contiene la etiqueta meta og:description
test('La página principal tiene la etiqueta meta og:description correcta', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
  expect(ogDescription).toBeTruthy(); // Puedes ajustar el valor esperado si tienes un texto específico
});

// La pagina contiene la etiqueta meta og:image
test('La página principal tiene la etiqueta meta og:image correcta', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(ogImage).toBeTruthy(); // Puedes ajustar el valor esperado si tienes un texto específico
});

// La pagina contiene la etiqueta meta og:url
test('La página principal tiene la etiqueta meta og:url correcta', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
  expect(ogUrl).toBeTruthy(); // Puedes ajustar el valor esperado si tienes un texto específico
});

// La pagina contiene la etiqueta meta twitter:card
test('La página principal tiene la etiqueta meta twitter:card correcta', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
  expect(twitterCard).toBeTruthy(); // Puedes ajustar el valor esperado si tienes un texto específico
});

// La pagina contiene la etiqueta meta twitter:title
test('La página principal tiene la etiqueta meta twitter:title correcta', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  const twitterTitle = await page.locator('meta[property="twitter:title"]').getAttribute('content');
  expect(twitterTitle).toBeTruthy(); // Puedes ajustar el valor esperado si tienes un texto específico
});

// La pagina contiene la etiqueta meta twitter:description
test('La página principal tiene la etiqueta meta twitter:description correcta', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  const twitterDescription = await page.locator('meta[property="twitter:description"]').getAttribute('content');
  expect(twitterDescription).toBeTruthy(); // Puedes ajustar el valor esperado si tienes un texto específico
});

// La pagina contiene la etiqueta meta twitter:image
test('La página principal tiene la etiqueta meta twitter:image correcta', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  const twitterImage = await page.locator('meta[property="twitter:image"]').getAttribute('content');
  expect(twitterImage).toBeTruthy(); // Puedes ajustar el valor esperado si tienes un texto específico
});

// La pagina contiene la etiqueta meta viewport
test('La página principal tiene la etiqueta meta viewport correcta', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(viewport).toBeTruthy(); // Puedes ajustar el valor esperado si tienes un texto específico
});

// La pagina contiene la etiqueta meta charset

test('La página principal tiene la etiqueta meta charset correcta', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  const charset = await page.locator('meta[charset]').getAttribute('charset');
  expect(charset?.toLowerCase()).toBe('utf-8');
});

// La pagina contiene la etiqueta link rel="canonical"
test('La página principal tiene la etiqueta link rel="canonical" correcta', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical).toBeTruthy(); // Puedes ajustar el valor esperado si tienes un enlace específico
});

// La pagina contiene la etiqueta link rel="icon"
test('La página principal tiene al menos un link rel="icon" con href válido', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  const icons = await page.locator('link[rel="icon"]').all();
  let foundValid = false;
  for (const icon of icons) {
    const href = await icon.getAttribute('href');
    if (href && href.trim() !== '') {
      foundValid = true;
      break;
    }
  }
  expect(foundValid).toBe(true);
});

// La pagina contiene Json-LD
test('La página principal contiene al menos un script de tipo application/ld+json', async ({ page }) => {
  await page.goto("http://localhost:4312/");
  const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
  expect(jsonLdScripts.length).toBeGreaterThan(0); // Asegura que al menos un script de tipo application/ld+json esté presente
});

// El footer muestra el año actual correctamente
// Requiere que el elemento tenga data-test-id="web-date"
test('El footer muestra el año actual actualizado', async ({ page }) => {
  await page.goto('http://localhost:4312/');
  const year = new Date().getFullYear().toString();
  const footerText = await page.locator('[data-test-id="web-date"]').innerText();
  expect(footerText).toContain(year);
});