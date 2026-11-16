/**
 * Pure functions behind scripts/refresh-snapshot.ts: decode a saved docs export,
 * convert the HTML export to Markdown, drop the Canon byline, and compare snapshots.
 * Anything this code does not recognise is an error, never a silent drop.
 */
import { assertValid, parseCanon, parseScenes, type Chunk, type ParsedCanon, type Table } from './parse.js';
import { FIELDS, type RawEntry } from './types.js';

export class SnapshotError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SnapshotError';
  }
}

// --- Export files -------------------------------------------------------------------

export interface DecodedExport {
  format: 'markdown' | 'html';
  rev: number | null;
  name: string;
  /** Byte length of the export as decoded. */
  bytes: number;
  text: string;
}

/** Parse the first JSON value in `raw`; anything after it is ignored. */
export function firstJsonValue(raw: string): unknown {
  const start = raw.search(/\S/);
  if (start < 0 || raw[start] !== '{') throw new SnapshotError('does not start with a JSON object');
  let depth = 0;
  let inString = false;
  for (let i = start; i < raw.length; i++) {
    const c = raw[i];
    if (inString) {
      if (c === '\\') i++;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') inString = true;
    else if (c === '{' || c === '[') depth++;
    else if (c === '}' || c === ']') {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(raw.slice(start, i + 1));
        } catch (e) {
          throw new SnapshotError(`its JSON object does not parse: ${(e as Error).message}`);
        }
      }
    }
  }
  throw new SnapshotError('its JSON object is never closed');
}

/** Decode the text of a saved export result. `label` names the file in error messages. */
export function decodeExport(raw: string, label: string): DecodedExport {
  const fail = (m: string): never => {
    throw new SnapshotError(`${label}: ${m}`);
  };
  let obj: unknown;
  try {
    obj = firstJsonValue(raw);
  } catch (e) {
    return fail((e as Error).message);
  }
  const o = obj as { rev?: unknown; data?: Record<string, unknown> };
  const data = o.data;
  if (!data || typeof data !== 'object') return fail('no "data" object in the export');
  const format = data.format;
  if (format !== 'markdown' && format !== 'html')
    return fail(`export format is ${JSON.stringify(format)}; expected "markdown" or "html"`);
  if (typeof data.bytes_b64 !== 'string' || !data.bytes_b64) return fail('the export has no "bytes_b64"');
  if (typeof data.bytes !== 'number') return fail('the export has no "bytes" length to check against');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(data.bytes_b64.replace(/\s+/g, '')))
    return fail('"bytes_b64" is not valid base64');
  const buf = Buffer.from(data.bytes_b64, 'base64');
  if (buf.length !== data.bytes)
    return fail(`decoded length is ${buf.length} bytes but the export says ${data.bytes}`);
  const text = buf.toString('utf8');
  if (Buffer.byteLength(text, 'utf8') !== buf.length || text.includes('�'))
    return fail('the decoded bytes are not valid UTF-8');
  return {
    format,
    rev: typeof o.rev === 'number' ? o.rev : null,
    name: typeof data.name === 'string' ? data.name : '',
    bytes: buf.length,
    text,
  };
}

// --- HTML to Markdown ---------------------------------------------------------------

const NAMED: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ndash: '–', mdash: '—', hellip: '…', middot: '·', bull: '•',
  lsquo: '‘', rsquo: '’', sbquo: '‚', ldquo: '“', rdquo: '”', bdquo: '„',
  laquo: '«', raquo: '»', lsaquo: '‹', rsaquo: '›',
  copy: '©', reg: '®', trade: '™', deg: '°', times: '×', divide: '÷',
  plusmn: '±', minus: '−', prime: '′', Prime: '″', sect: '§', para: '¶',
  dagger: '†', Dagger: '‡', shy: '­', thinsp: ' ', ensp: ' ', emsp: ' ',
  zwj: '‍', zwnj: '‌', larr: '←', rarr: '→', uarr: '↑', darr: '↓',
  harr: '↔', frac12: '½', frac14: '¼', frac34: '¾', micro: 'µ',
  iexcl: '¡', iquest: '¿', cent: '¢', pound: '£', euro: '€', yen: '¥',
};

/** Decode HTML character references. An unknown named reference is an error. */
export function decodeEntities(s: string): string {
  return s.replace(/&(#[0-9]+|#[xX][0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]*);/g, (whole, ref: string) => {
    if (ref[0] === '#') {
      const n = ref[1] === 'x' || ref[1] === 'X' ? parseInt(ref.slice(2), 16) : parseInt(ref.slice(1), 10);
      if (!Number.isFinite(n) || n > 0x10ffff || (n >= 0xd800 && n <= 0xdfff) || n === 0)
        throw new SnapshotError(`invalid character reference ${whole}`);
      return String.fromCodePoint(n);
    }
    if (!(ref in NAMED)) throw new SnapshotError(`unknown HTML entity ${whole}`);
    return NAMED[ref];
  });
}

interface El {
  tag: string;
  attrs: Record<string, string | true>;
  children: Node[];
  at: number;
}
type Node = El | string;

const KNOWN = new Set(['h1', 'h2', 'h3', 'p', 'em', 'strong', 'ul', 'ol', 'li', 'input']);
const ATTRS: Record<string, string[]> = {
  h1: ['id'], h2: ['id'], h3: ['id'], li: ['data-checked'], input: ['type', 'disabled', 'checked'],
};
const TAG_RE = /^<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s"'<>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/;
const ATTR_RE = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function snippet(html: string, at: number): string {
  return JSON.stringify(html.slice(at, at + 60));
}

/** Tokenise HTML into a tree. Unknown tags, stray markup and mismatched tags are errors. */
function parseHtml(html: string): El {
  const root: El = { tag: '#root', attrs: {}, children: [], at: 0 };
  const stack: El[] = [root];
  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    const end = lt < 0 ? html.length : lt;
    if (end > i) {
      const text = html.slice(i, end);
      const gt = text.indexOf('>');
      if (gt >= 0) throw new SnapshotError(`leftover unparsed HTML at offset ${i + gt}: ${snippet(html, i + gt)}`);
      stack[stack.length - 1].children.push(text);
      i = end;
      continue;
    }
    const m = TAG_RE.exec(html.slice(i));
    if (!m) throw new SnapshotError(`leftover unparsed HTML at offset ${i}: ${snippet(html, i)}`);
    const [whole, close, rawTag, rawAttrs, selfClose] = m;
    const tag = rawTag.toLowerCase();
    if (!KNOWN.has(tag)) throw new SnapshotError(`unknown HTML tag <${close}${tag}> at offset ${i}`);
    if (close) {
      const top = stack[stack.length - 1];
      if (top.tag !== tag)
        throw new SnapshotError(`</${tag}> at offset ${i} does not close <${top.tag}>`);
      stack.pop();
    } else {
      const attrs: Record<string, string | true> = {};
      for (const a of rawAttrs.matchAll(ATTR_RE)) {
        const name = a[1].toLowerCase();
        if (!(ATTRS[tag] ?? []).includes(name))
          throw new SnapshotError(`unknown attribute "${name}" on <${tag}> at offset ${i}`);
        attrs[name] = a[2] ?? a[3] ?? a[4] ?? true;
      }
      const el: El = { tag, attrs, children: [], at: i };
      stack[stack.length - 1].children.push(el);
      if (tag !== 'input') {
        if (selfClose) throw new SnapshotError(`<${tag}/> at offset ${i} is self-closed`);
        stack.push(el);
      }
    }
    i += whole.length;
  }
  if (stack.length > 1) {
    const top = stack[stack.length - 1];
    throw new SnapshotError(`<${top.tag}> at offset ${top.at} is never closed`);
  }
  return root;
}

const isBlank = (n: Node) => typeof n === 'string' && !n.trim();

function escapeText(raw: string): string {
  return decodeEntities(raw).replace(/[[\]]/g, (c) => `\\${c}`);
}

function inline(nodes: Node[], ctx: string): string {
  let out = '';
  for (const n of nodes) {
    if (typeof n === 'string') out += escapeText(n);
    else if (n.tag === 'em') out += `*${inline(n.children, ctx)}*`;
    else if (n.tag === 'strong') out += `**${inline(n.children, ctx)}**`;
    else throw new SnapshotError(`<${n.tag}> at offset ${n.at} is not allowed inside ${ctx}`);
  }
  return out;
}

function checkbox(input: El): string {
  if (input.attrs.type !== 'checkbox' || input.attrs.disabled === undefined)
    throw new SnapshotError(`<input> at offset ${input.at} is not a disabled checkbox`);
  return input.attrs.checked !== undefined ? '[x] ' : '[ ] ';
}

function listItem(li: El): string {
  if (li.tag !== 'li') throw new SnapshotError(`<${li.tag}> at offset ${li.at} is not allowed directly inside a list`);
  const kids = li.children.filter((n) => !isBlank(n));
  const p = kids[0];
  if (kids.length !== 1 || typeof p === 'string' || p.tag !== 'p')
    throw new SnapshotError(`<li> at offset ${li.at} does not hold exactly one <p>`);
  let children = p.children;
  let marker = '';
  const first = children[0];
  if (first && typeof first !== 'string' && first.tag === 'input') {
    marker = checkbox(first);
    const dc = li.attrs['data-checked'];
    if (dc !== undefined && (dc === 'true') !== (marker === '[x] '))
      throw new SnapshotError(`<li> at offset ${li.at}: data-checked disagrees with its checkbox`);
    children = children.slice(1);
    if (typeof children[0] === 'string') children = [children[0].replace(/^\s+/, ''), ...children.slice(1)];
  } else if (li.attrs['data-checked'] !== undefined) {
    throw new SnapshotError(`<li> at offset ${li.at} has data-checked but no checkbox`);
  }
  return marker + inline(children, '<li><p>');
}

/**
 * Convert the docs HTML export to the Markdown the docs Markdown export produces.
 * Supports h1-h3, p, em, strong, ul, ol, li (one p each) and disabled checkboxes.
 */
export function htmlToMarkdown(html: string): string {
  const root = parseHtml(html);
  const blocks: string[] = [];
  for (const n of root.children) {
    if (typeof n === 'string') {
      if (n.trim()) throw new SnapshotError(`text outside any block: ${JSON.stringify(n.trim().slice(0, 60))}`);
      continue;
    }
    if (/^h[123]$/.test(n.tag)) blocks.push(`${'#'.repeat(Number(n.tag[1]))} ${inline(n.children, `<${n.tag}>`)}`);
    else if (n.tag === 'p') blocks.push(inline(n.children, '<p>'));
    else if (n.tag === 'ul' || n.tag === 'ol') {
      const items = n.children.filter((c) => !isBlank(c));
      if (!items.length) throw new SnapshotError(`<${n.tag}> at offset ${n.at} is empty`);
      blocks.push(
        items
          .map((li, k) => {
            if (typeof li === 'string') throw new SnapshotError(`text directly inside <${n.tag}> at offset ${n.at}`);
            return `${n.tag === 'ol' ? `${k + 1}.` : '-'} ${listItem(li)}`;
          })
          .join('\n'),
      );
    } else throw new SnapshotError(`<${n.tag}> at offset ${n.at} is not allowed at the top level`);
  }
  return blocks.join('\n\n') + '\n';
}

/** The Markdown text of an export, converting HTML when that is what was exported. */
export function exportToMarkdown(exp: DecodedExport): string {
  return exp.format === 'html' ? htmlToMarkdown(exp.text) : exp.text;
}

// --- Byline ---------------------------------------------------------------------------

const DATE_RE =
  /\b(?:\d{4}-\d{2}-\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.? \d{1,2}, \d{4}|\d{1,2} (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]* \d{4})\b/;

/**
 * Remove the byline under the `# ` title: the first non-blank line after it, if it holds
 * a date and an `@` mention, together with the blank line that follows. Nothing else.
 */
export function stripByline(md: string): { text: string; removed: boolean } {
  const lines = md.split('\n');
  const t = lines.findIndex((l) => /^# /.test(l));
  if (t < 0) return { text: md, removed: false };
  let b = t + 1;
  while (b < lines.length && !lines[b].trim()) b++;
  const line = lines[b];
  if (line === undefined || /^#/.test(line) || !line.includes('@') || !DATE_RE.test(line))
    return { text: md, removed: false };
  const drop = b + 1 < lines.length && lines[b + 1].trim() === '' ? 2 : 1;
  lines.splice(b, drop);
  return { text: lines.join('\n'), removed: true };
}

/** Validate Canon Markdown with the importer's own checks. Throws CanonError. */
export function validateCanon(md: string): ParsedCanon {
  const parsed = parseCanon(md);
  assertValid(parsed);
  return parsed;
}

// --- Change report --------------------------------------------------------------------

export interface RowChange {
  key: string;
  columns: string[];
}

export interface ChangeReport {
  /** True when both files are byte-identical to the previous snapshot. */
  unchanged: boolean;
  canonTextChanged: boolean;
  scenesTextChanged: boolean;
  entriesAdded: string[];
  entriesRemoved: string[];
  entriesRevised: { id: string; fields: string[] }[];
  castAdded: string[];
  castRemoved: string[];
  castChanged: RowChange[];
  scenesAdded: string[];
  scenesRemoved: string[];
  scenesChanged: string[];
  decisionsAdded: string[];
  decisionsRemoved: string[];
  oldCount: number;
  newCount: number;
}

const hasColumns = (...cols: string[]) => (c: Chunk) =>
  c.tables.some((t) => cols.every((col) => t.columns.includes(col)));

function tableOf(chunks: Chunk[], ...cols: string[]): Table | null {
  const c = chunks.find(hasColumns(...cols));
  return c?.tables.find((t) => cols.every((col) => t.columns.includes(col))) ?? null;
}

function keyed(t: Table | null, keyCol: string): Map<string, Record<string, string>> {
  const out = new Map<string, Record<string, string>>();
  if (!t) return out;
  const k = t.columns.indexOf(keyCol);
  for (const r of t.rows) {
    const rec: Record<string, string> = {};
    t.columns.forEach((c, i) => (rec[c] = r[i] ?? ''));
    out.set(r[k] ?? '', rec);
  }
  return out;
}

function diffRows(a: Map<string, Record<string, string>>, b: Map<string, Record<string, string>>) {
  const added = [...b.keys()].filter((k) => !a.has(k));
  const removed = [...a.keys()].filter((k) => !b.has(k));
  const changed: RowChange[] = [];
  for (const [k, row] of b) {
    const old = a.get(k);
    if (!old) continue;
    const cols = [...new Set([...Object.keys(old), ...Object.keys(row)])].filter((c) => old[c] !== row[c]);
    if (cols.length) changed.push({ key: k, columns: cols });
  }
  return { added, removed, changed };
}

const fieldValue = (e: RawEntry, f: (typeof FIELDS)[number]) =>
  f === 'links' ? e.links.join(', ') : (e[f] as string);

/** Compare two snapshots with the importer's own parser. */
export function compareSnapshots(
  old: { canon: string; scenes: string },
  next: { canon: string; scenes: string },
): ChangeReport {
  const a = parseCanon(old.canon);
  const b = parseCanon(next.canon);
  const aE = new Map(a.entries.map((e) => [e.id, e]));
  const bE = new Map(b.entries.map((e) => [e.id, e]));
  const entriesRevised: { id: string; fields: string[] }[] = [];
  for (const [id, e] of bE) {
    const o = aE.get(id);
    if (!o) continue;
    const fields = FIELDS.filter((f) => fieldValue(o, f) !== fieldValue(e, f));
    if (fields.length) entriesRevised.push({ id, fields });
  }
  const cast = diffRows(keyed(tableOf(a.chunks, 'Name', 'Who'), 'Name'), keyed(tableOf(b.chunks, 'Name', 'Who'), 'Name'));
  const dec = diffRows(
    keyed(tableOf(a.chunks, 'Stage', 'What changed'), 'Stage'),
    keyed(tableOf(b.chunks, 'Stage', 'What changed'), 'Stage'),
  );
  const sa = new Map(parseScenes(old.scenes).scenes.map((s) => [s.heading, JSON.stringify(s.sections)]));
  const sb = new Map(parseScenes(next.scenes).scenes.map((s) => [s.heading, JSON.stringify(s.sections)]));
  const canonTextChanged = old.canon !== next.canon;
  const scenesTextChanged = old.scenes !== next.scenes;
  return {
    unchanged: !canonTextChanged && !scenesTextChanged,
    canonTextChanged,
    scenesTextChanged,
    entriesAdded: [...bE.keys()].filter((k) => !aE.has(k)),
    entriesRemoved: [...aE.keys()].filter((k) => !bE.has(k)),
    entriesRevised,
    castAdded: cast.added,
    castRemoved: cast.removed,
    castChanged: cast.changed,
    scenesAdded: [...sb.keys()].filter((k) => !sa.has(k)),
    scenesRemoved: [...sa.keys()].filter((k) => !sb.has(k)),
    scenesChanged: [...sb.keys()].filter((k) => sa.has(k) && sa.get(k) !== sb.get(k)),
    decisionsAdded: dec.added,
    decisionsRemoved: dec.removed,
    oldCount: a.entries.length,
    newCount: b.entries.length,
  };
}

export const NO_CHANGES = 'No canon changes since the last snapshot.';

const list = (xs: string[]) => (xs.length ? xs.join(', ') : 'none');
const quoted = (xs: string[]) => (xs.length ? xs.map((x) => `"${x}"`).join(', ') : 'none');

/** Lines of the change report, for the terminal. */
export function reportLines(r: ChangeReport): string[] {
  if (r.unchanged) return [NO_CHANGES];
  const lines = [
    `Entries: ${r.oldCount} -> ${r.newCount}`,
    `  added: ${list(r.entriesAdded)}`,
    `  removed: ${list(r.entriesRemoved)}`,
    `  revised: ${r.entriesRevised.length ? r.entriesRevised.map((e) => `${e.id} (${e.fields.join(', ')})`).join('; ') : 'none'}`,
    `Cast rows`,
    `  added: ${quoted(r.castAdded)}`,
    `  removed: ${quoted(r.castRemoved)}`,
    `  changed: ${r.castChanged.length ? r.castChanged.map((c) => `"${c.key}" (${c.columns.join(', ')})`).join('; ') : 'none'}`,
    `Scenes`,
    `  newly recorded: ${quoted(r.scenesAdded)}`,
    `  changed: ${quoted(r.scenesChanged)}`,
    `  removed: ${quoted(r.scenesRemoved)}`,
    `Decision log rows`,
    `  added: ${quoted(r.decisionsAdded)}`,
    `  removed: ${quoted(r.decisionsRemoved)}`,
  ];
  const other = otherTextNote(r);
  if (other) lines.push(other);
  return lines;
}

/** When the text changed but no entry, Cast row, scene or Decision row did, say so. */
function otherTextNote(r: ChangeReport): string | null {
  const structural =
    r.entriesAdded.length + r.entriesRemoved.length + r.entriesRevised.length +
    r.castAdded.length + r.castRemoved.length + r.castChanged.length +
    r.scenesAdded.length + r.scenesRemoved.length + r.scenesChanged.length +
    r.decisionsAdded.length + r.decisionsRemoved.length;
  if (structural || r.unchanged) return null;
  const which = [r.canonTextChanged && 'Canon', r.scenesTextChanged && 'Scenes'].filter(Boolean).join(' and ');
  return `Other text changed in the ${which} tab (outside entries, Cast, scenes and Decision log rows).`;
}

const cell = (s: string) => s.replace(/\|/g, '\\|');

/** One row for the Phases table in BUILD_LOG.md. */
export function reportMarkdown(
  r: ChangeReport,
  meta: { date: string; canonRev: number | null; scenesRev: number | null; oldCanonRev: number | null; oldScenesRev: number | null },
): string {
  if (r.unchanged) return NO_CHANGES;
  const n = (xs: unknown[], one: string, many: string) => `${xs.length} ${xs.length === 1 ? one : many}`;
  const parts = [
    `${n(r.entriesAdded, 'entry', 'entries')} added${r.entriesAdded.length ? ` (${r.entriesAdded.join(', ')})` : ''}`,
    `${n(r.entriesRevised, 'entry', 'entries')} revised${r.entriesRevised.length ? ` (${r.entriesRevised.map((e) => `${e.id}: ${e.fields.join(', ')}`).join('; ')})` : ''}`,
  ];
  if (r.entriesRemoved.length) parts.push(`${n(r.entriesRemoved, 'entry', 'entries')} removed (${r.entriesRemoved.join(', ')})`);
  parts.push(`now ${r.newCount} entries`);
  parts.push(`${n(r.castAdded, 'Cast row', 'Cast rows')} added${r.castAdded.length ? ` (${r.castAdded.join(', ')})` : ''}`);
  if (r.castChanged.length) parts.push(`${n(r.castChanged, 'Cast row', 'Cast rows')} changed (${r.castChanged.map((c) => `${c.key}: ${c.columns.join(', ')}`).join('; ')})`);
  if (r.castRemoved.length) parts.push(`${n(r.castRemoved, 'Cast row', 'Cast rows')} removed (${r.castRemoved.join(', ')})`);
  parts.push(`${n(r.scenesAdded, 'scene', 'scenes')} newly recorded${r.scenesAdded.length ? ` (${quoted(r.scenesAdded)})` : ''}`);
  if (r.scenesChanged.length) parts.push(`${n(r.scenesChanged, 'scene', 'scenes')} changed (${quoted(r.scenesChanged)})`);
  if (r.scenesRemoved.length) parts.push(`${n(r.scenesRemoved, 'scene', 'scenes')} removed (${quoted(r.scenesRemoved)})`);
  parts.push(`${n(r.decisionsAdded, 'new Decision log row', 'new Decision log rows')}${r.decisionsAdded.length ? ` (${quoted(r.decisionsAdded)})` : ''}`);
  if (r.decisionsRemoved.length) parts.push(`${n(r.decisionsRemoved, 'Decision log row', 'Decision log rows')} removed (${quoted(r.decisionsRemoved)})`);
  const other = otherTextNote(r);
  if (other) parts.push(other.replace(/\.$/, ''));
  const rev = (x: number | null) => (x === null ? '?' : String(x));
  const result = cell(
    `Done. Snapshot: Canon tab rev ${rev(meta.canonRev)}, Scenes tab rev ${rev(meta.scenesRev)}. ` +
      `Since rev ${rev(meta.oldCanonRev)} / rev ${rev(meta.oldScenesRev)}: ${parts.join('; ')}`,
  );
  return `| ${meta.date} | Canon refresh | ${result} |`;
}
