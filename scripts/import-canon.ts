/**
 * Reads the canon snapshot in canon/ and writes the JSON the app reads into data/.
 * Fails loudly (non-zero exit) if an entry lacks a field, an id is duplicated,
 * a link points nowhere, or the entry count differs from the Canon tab's own.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './lib/build.js';
import { CanonError, type Config } from './lib/types.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const json = (p: string) => JSON.parse(read(p));

try {
  if (!existsSync(join(root, 'canon/source.md'))) {
    throw new CanonError(['canon/source.md is missing. Export the Canon tab as Markdown and add it there.']);
  }
  const scenesMd = existsSync(join(root, 'canon/scenes.md')) ? read('canon/scenes.md') : '';
  const snapshot = existsSync(join(root, 'canon/SNAPSHOT.json')) ? json('canon/SNAPSHOT.json') : null;
  const out = build(read('canon/source.md'), scenesMd, json('hold.config.json') as Config, snapshot);

  const dir = join(root, 'data');
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(dir, 'entries'), { recursive: true });
  const write = (name: string, value: unknown) =>
    writeFileSync(join(dir, name), JSON.stringify(value, null, 2) + '\n');
  for (const e of out.entries) write(`entries/${e.id}.json`, e);
  write('cast.json', out.cast);
  write('scenes.json', out.scenes);
  write('decisions.json', out.decisions);
  write('meta.json', out.meta);
  write('tally.json', out.tally);

  for (const w of out.warnings) console.warn(`warning: ${w}`);
  const rec = out.scenes.scenes.filter((s) => s.recorded).length;
  console.log(
    `canon imported: ${out.entries.length} entries (Canon tab states ${out.meta.statedCount}), ` +
      `${out.cast.rows.length} cast, ${rec} recorded scenes of ${out.scenes.scenes.length}, ` +
      `${out.decisions.rows.length} decisions`,
  );
} catch (err) {
  if (err instanceof CanonError) {
    console.error(err.message);
    process.exit(1);
  }
  throw err;
}
