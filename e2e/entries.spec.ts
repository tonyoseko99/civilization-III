import { expect, test } from '@playwright/test';
import { cast, entries, scenes, tally } from './data';

const FIELD_LABELS = ['id', 'title', 'status', 'plausibility', 'summary', 'rules and limits', 'consequences', 'story conflict', 'nearest precedent', 'links'];
const ids = new Set(entries.map((e) => e.id));

test('every entry page opens, shows all ten fields, and links both ways', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  expect(entries.length).toBeGreaterThan(0);

  for (const e of entries) {
    await page.goto(`/#/entries/${e.id}`);
    await expect(page.locator('h1'), e.id).toHaveText(e.title);
    await expect(page.locator('.entry-fields dt'), e.id).toHaveCount(FIELD_LABELS.length);
    const labels = await page.locator('.entry-fields dt').evaluateAll((els) => els.map((d) => d.childNodes[0].textContent?.trim()));
    expect(labels, e.id).toEqual(FIELD_LABELS);
    await expect(page.locator('.entry-fields'), e.id).toContainText(e.summary.slice(0, 80));
    await expect(page.locator('.entry-fields'), e.id).toContainText(e.nearest_precedent.slice(0, 80));

    const out = await page.locator('[data-testid="links-out"] a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(out, `${e.id} links out`).toEqual(e.links.map((l) => `#/entries/${l}`));
    const inn = await page.locator('[data-testid="links-in"] a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(inn, `${e.id} linked from`).toEqual(e.linkedFrom.map((l) => `#/entries/${l}`));

    const all = await page.locator('main a[href^="#/entries/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!.split('/').pop()!));
    for (const id of all) expect(ids.has(id), `${e.id} -> ${id}`).toBe(true);

    if (e.status === 'open') await expect(page.locator('.notice-open'), e.id).toBeVisible();
    else await expect(page.locator('.notice-open'), e.id).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test('following a link and its backlink returns to the start', async ({ page }) => {
  const e = entries.find((x) => x.links.length > 0)!;
  await page.goto(`/#/entries/${e.id}`);
  await page.locator('[data-testid="links-out"] a').first().click();
  await expect(page.locator('h1')).toHaveText(entries.find((x) => x.id === e.links[0])!.title);
  await page.locator(`[data-testid="links-in"] a[href="#/entries/${e.id}"]`).click();
  await expect(page.locator('h1')).toHaveText(e.title);
});

test('every scene opens; recorded ones carry the Narrator, missing ones say so', async ({ page }) => {
  for (const s of scenes) {
    await page.goto(`/#/scenes/${s.id}`);
    await expect(page.locator('h1')).toContainText(s.label);
    if (s.recorded) {
      await expect(page.locator('.narrator')).toHaveCount(1);
      // The two voices never share a block.
      await expect(page.locator('.narrator .architect, .architect .narrator')).toHaveCount(0);
      const hrefs = await page.locator('.narrator a').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
      expect(hrefs.length).toBeGreaterThan(0);
      for (const h of hrefs) {
        const [, kind, key] = h.split('/');
        if (kind === 'entries') expect(ids.has(key), h).toBe(true);
        else expect(cast.rows.some((r) => r.slug === key), h).toBe(true);
      }
    } else {
      await expect(page.locator('.narrator')).toHaveCount(0);
      await expect(page.locator('.mark-missing').first()).toBeVisible();
    }
  }
});

test('the tally shows figures read from canon and every open mystery as open', async ({ page }) => {
  await page.goto('/#/');
  for (const f of tally.figures) await expect(page.locator('main')).toContainText(new RegExp(f.value, 'i'));
  const open = entries.filter((e) => e.status === 'open');
  await expect(page.locator('.mysteries li')).toHaveCount(open.length);
  await expect(page.locator('.mysteries .mark-open')).toHaveCount(open.length);
  await expect(page.locator('.rails li')).toHaveCount(tally.rails!.clauses.length);
  await expect(page.locator('.cast-compact li')).toHaveCount(cast.rows.length);
});

test('the map draws every entry and can be driven from the keyboard', async ({ page }) => {
  await page.goto('/#/map');
  await expect(page.locator('svg .node')).toHaveCount(entries.length);
  await page.locator('svg .node[tabindex="0"]').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  const second = entries.filter((e) => e.type === entries[0].type)[1] ?? entries[1];
  await expect(page.locator('.map-panel h2')).toContainText(second.title);
  await expect(page.locator('svg .edge.on')).not.toHaveCount(0);
  await page.locator('.map-panel a.button').click();
  await expect(page.locator('h1')).toHaveText(second.title);
});

test('cast names link to their row', async ({ page }) => {
  const row = cast.rows[cast.rows.length - 1];
  await page.goto(`/#/cast/${row.slug}`);
  await expect(page.locator(`#cast-${row.slug}`)).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('tbody tr')).toHaveCount(cast.rows.length);
});

test('an unknown address says so', async ({ page }) => {
  await page.goto('/#/entries/NOPE-0000');
  await expect(page.locator('h1')).toHaveText('No such entry');
});
