/**
 * Refreshes canon/ from two saved docs exports (Canon tab and Scenes tab).
 *
 *   npm run refresh-snapshot -- --canon <export file> --scenes <export file> [--date YYYY-MM-DD]
 *       [--canon-md-bytes N] [--scenes-md-bytes N]
 *
 * Decodes each export, converts an HTML export to Markdown, drops the byline under the
 * Canon title, validates the Canon text with the importer's checks, and only then writes
 * canon/source.md, canon/scenes.md and canon/SNAPSHOT.json. Prints what changed.
 * --*-md-bytes: the byte length a Markdown export of that tab reported, when an HTML
 * export was converted instead; the converted text must match it exactly.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import {
  compareSnapshots,
  decodeExport,
  exportToMarkdown,
  reportLines,
  reportMarkdown,
  SnapshotError,
  stripByline,
  validateCanon,
  type DecodedExport,
} from './lib/snapshot.js';
import { CanonError } from './lib/types.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const at = (p: string) => join(root, p);

interface SnapshotFile {
  doc?: string;
  taken?: string;
  method?: string;
  files?: Record<string, { tab?: string; rev?: number | null; note?: string }>;
  [k: string]: unknown;
}

/** Same layout as the hand-written file: one line per tab under "files". */
function formatSnapshot(s: SnapshotFile): string {
  const inline = (v: unknown) =>
    JSON.stringify(v).replace(/^\{/, '{ ').replace(/\}$/, ' }').replace(/","/g, '", "').replace(/":/g, '": ').replace(/,"/g, ', "');
  const lines = Object.entries(s).map(([k, v]) => {
    if (k !== 'files' || !v || typeof v !== 'object') return `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`;
    const rows = Object.entries(v).map(([f, o]) => `    ${JSON.stringify(f)}: ${inline(o)}`);
    return `  "files": {\n${rows.join(',\n')}\n  }`;
  });
  return `{\n${lines.join(',\n')}\n}\n`;
}

const fmtBytes = (n: number) => n.toLocaleString('en-US');

function readExport(path: string, label: string): DecodedExport {
  let raw: string;
  try {
    raw = readFileSync(path, 'utf8');
  } catch (e) {
    throw new SnapshotError(`${label} export ${path} cannot be read: ${(e as Error).message}`);
  }
  return decodeExport(raw, `${label} export ${path}`);
}

function toMarkdown(exp: DecodedExport, label: string, expectBytes: number | null): string {
  let md: string;
  try {
    md = exportToMarkdown(exp);
  } catch (e) {
    if (e instanceof SnapshotError) throw new SnapshotError(`${label} HTML export: ${e.message}`);
    throw e;
  }
  if (expectBytes !== null) {
    const got = Buffer.byteLength(md, 'utf8');
    if (got !== expectBytes)
      throw new SnapshotError(`${label}: Markdown is ${got} bytes but the Markdown export reported ${expectBytes}`);
  }
  return md;
}

function note(exp: DecodedExport, md: string, extra: string): string {
  const mdBytes = fmtBytes(Buffer.byteLength(md, 'utf8'));
  const how =
    exp.format === 'markdown'
      ? `Markdown export (${fmtBytes(exp.bytes)} bytes), decoded by scripts/refresh-snapshot.ts.`
      : `HTML export (${fmtBytes(exp.bytes)} bytes), converted to Markdown (${mdBytes} bytes) by scripts/refresh-snapshot.ts.`;
  return `${how} ${extra}`.trim();
}

function main(): number {
  const { values } = parseArgs({
    options: {
      canon: { type: 'string' },
      scenes: { type: 'string' },
      date: { type: 'string' },
      'canon-md-bytes': { type: 'string' },
      'scenes-md-bytes': { type: 'string' },
    },
    strict: true,
  });
  if (!values.canon || !values.scenes)
    throw new SnapshotError('usage: npm run refresh-snapshot -- --canon <export file> --scenes <export file> [--date YYYY-MM-DD]');
  const date = values.date ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new SnapshotError(`--date must be YYYY-MM-DD, got "${date}"`);
  const num = (v: string | undefined, name: string): number | null => {
    if (v === undefined) return null;
    if (!/^\d+$/.test(v)) throw new SnapshotError(`--${name} must be a whole number`);
    return Number(v);
  };

  const canonExp = readExport(values.canon, 'Canon');
  const scenesExp = readExport(values.scenes, 'Scenes');
  const canonExpect = num(values['canon-md-bytes'], 'canon-md-bytes');
  const scenesExpect = num(values['scenes-md-bytes'], 'scenes-md-bytes');
  const canonFull = toMarkdown(canonExp, 'Canon', canonExpect);
  const scenesMd = toMarkdown(scenesExp, 'Scenes', scenesExpect);
  const checked = (n: number | null) =>
    n === null ? '' : `Checked: byte length equals the Markdown export (${fmtBytes(n)} bytes). `;

  const { text: canonMd, removed } = stripByline(canonFull);
  console.log(
    removed
      ? 'Canon: byline line under the title removed (with its following blank line).'
      : 'Canon: no byline line found under the title; nothing removed.',
  );

  // Validate before anything is written. Throws CanonError.
  const parsed = validateCanon(canonMd);
  console.log(`Canon: validation passed, ${parsed.entries.length} entries.`);

  const read = (p: string) => (existsSync(at(p)) ? readFileSync(at(p), 'utf8') : '');
  const old = { canon: read('canon/source.md'), scenes: read('canon/scenes.md') };
  const snap: SnapshotFile = existsSync(at('canon/SNAPSHOT.json'))
    ? JSON.parse(read('canon/SNAPSHOT.json'))
    : {};

  const report = compareSnapshots(old, { canon: canonMd, scenes: scenesMd });
  if (report.unchanged) {
    console.log(reportLines(report)[0]);
    return 0;
  }

  const files = snap.files ?? {};
  const oldCanonRev = files['source.md']?.rev ?? null;
  const oldScenesRev = files['scenes.md']?.rev ?? null;
  const next: SnapshotFile = {
    ...snap,
    taken: date,
    files: {
      ...files,
      'source.md': {
        ...files['source.md'],
        tab: 'Canon',
        rev: canonExp.rev,
        note: note(
          canonExp,
          canonFull,
          checked(canonExpect) +
            (removed
            ? "Byline line removed (it carried the author's name). Nothing else changed."
            : 'No byline line was found under the title. Nothing changed.'),
        ),
      },
      'scenes.md': {
        ...files['scenes.md'],
        tab: 'Scenes',
        rev: scenesExp.rev,
        note: note(scenesExp, scenesMd, `${checked(scenesExpect)}Nothing else changed.`),
      },
    },
  };

  writeFileSync(at('canon/source.md'), canonMd);
  writeFileSync(at('canon/scenes.md'), scenesMd);
  writeFileSync(at('canon/SNAPSHOT.json'), formatSnapshot(next));
  console.log(`Wrote canon/source.md, canon/scenes.md, canon/SNAPSHOT.json (Canon rev ${canonExp.rev}, Scenes rev ${scenesExp.rev}).`);

  console.log('\nWhat changed:');
  for (const l of reportLines(report)) console.log(`  ${l}`);
  console.log('\nFor BUILD_LOG.md (Phases table):\n');
  console.log(
    reportMarkdown(report, { date, canonRev: canonExp.rev, scenesRev: scenesExp.rev, oldCanonRev, oldScenesRev }),
  );
  console.log('\nNext: npm run import-canon');
  return 0;
}

try {
  process.exitCode = main();
} catch (err) {
  if (err instanceof CanonError) {
    console.error(`Nothing written. The new Canon text fails validation.\n${err.message}`);
    process.exitCode = 1;
  } else if (err instanceof SnapshotError || (err as { code?: string }).code?.startsWith('ERR_PARSE_ARGS')) {
    console.error(`Nothing written. ${(err as Error).message}`);
    process.exitCode = 1;
  } else throw err;
}
