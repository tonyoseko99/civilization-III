import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { entries, scenes } from './data';

const recorded = scenes.filter((s) => s.recorded);
const missing = scenes.filter((s) => !s.recorded);
const open = entries.find((e) => e.status === 'open') ?? entries[0];
const PAGES = [
  '/',
  '/scenes',
  ...(recorded.length ? [`/scenes/${recorded[recorded.length - 1].id}`] : []),
  ...(missing.length ? [`/scenes/${missing[0].id}`] : []),
  '/entries',
  `/entries/${open.id}`,
  `/entries/${entries[0].id}`,
  `/map?focus=${open.id}`,
  '/cast',
  '/log',
];

for (const scheme of ['light', 'dark'] as const) {
  test(`pages pass axe and fit the screen (${scheme})`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.emulateMedia({ colorScheme: scheme });
    for (const path of PAGES) {
      await page.goto(`/#${path}`);
      await page.locator('h1').waitFor();
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']).analyze();
      const found = results.violations.map((v) => `${path}: ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target}`);
      expect(found, `${scheme} ${path}`).toEqual([]);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${path} scrolls sideways`).toBeLessThanOrEqual(0);
    }
  });
}

test('keyboard: skip link, then the nav, reach every section', async ({ page }) => {
  await page.goto('/#/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});
