import { CanonError, FIELDS, type Field, type RawEntry } from './types.js';

/** Undo the backslash escapes a Markdown export adds to prose and table cells. */
export function unescapeMd(s: string): string {
  return s.replace(/\\([\\`*_{}[\]()#+\-.!|~>])/g, '$1');
}

/** Strip inline code ticks; the app shows plain text. */
function plain(s: string): string {
  return unescapeMd(s).replace(/`([^`]*)`/g, '$1').trim();
}

export function splitRow(line: string): string[] {
  const inner = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return inner.split(/(?<!\\)\|/).map((c) => plain(c));
}

export interface Table {
  columns: string[];
  rows: string[][];
}

export interface Chunk {
  heading: string;
  level: number;
  parent: string | null;
  /** Paragraphs before the first table or entry. */
  intro: string[];
  /** Paragraphs after the first table. */
  after: string[];
  tables: Table[];
  entries: RawEntry[];
}

export interface ParsedCanon {
  title: string;
  chunks: Chunk[];
  entries: RawEntry[];
  problems: string[];
}

const ID_RE = /^[A-Z]+-\d{4}$/;

/** Parse one fenced entry block. Problems are collected, not thrown. */
export function parseEntryBlock(
  lines: string[],
  startLine: number,
  problems: string[],
): Partial<Record<Field, string>> {
  const out: Partial<Record<Field, string>> = {};
  let last: Field | null = null;
  lines.forEach((raw, i) => {
    if (!raw.trim()) return;
    const m = /^([a-z_]+):(?:\s+(.*))?$/.exec(raw);
    if (m && (FIELDS as readonly string[]).includes(m[1])) {
      const key = m[1] as Field;
      if (key in out) problems.push(`line ${startLine + i}: field "${key}" appears twice in one entry`);
      out[key] = (m[2] ?? '').trim();
      last = key;
    } else if (last && /^\s+\S/.test(raw)) {
      out[last] = `${out[last]} ${raw.trim()}`.trim();
    } else {
      problems.push(`line ${startLine + i}: not a known entry field: "${raw.slice(0, 60)}"`);
    }
  });
  return out;
}

export function parseLinks(value: string): string[] | null {
  const m = /^\[(.*)\]$/.exec(value.trim());
  if (!m) return null;
  return m[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Read the Canon tab's Markdown into headings, tables and entries. */
export function parseCanon(md: string): ParsedCanon {
  const lines = md.split(/\r?\n/);
  const problems: string[] = [];
  const chunks: Chunk[] = [];
  const entries: RawEntry[] = [];
  let title = '';
  let h2: string | null = null;
  let cur: Chunk | null = null;
  let para: string[] = [];

  const flush = () => {
    if (para.length && cur) {
      const text = plain(para.join(' '));
      (cur.tables.length ? cur.after : cur.intro).push(text);
    }
    para = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      flush();
      const level = h[1].length;
      const heading = plain(h[2]);
      if (level === 1) {
        title = heading;
        continue;
      }
      if (level === 2) h2 = heading;
      cur = { heading, level, parent: level === 3 ? h2 : null, intro: [], after: [], tables: [], entries: [] };
      chunks.push(cur);
      continue;
    }
    if (/^```/.test(line)) {
      flush();
      const lang = line.slice(3).trim();
      const start = i + 1;
      let j = start;
      while (j < lines.length && !/^```\s*$/.test(lines[j])) j++;
      if (j >= lines.length) problems.push(`line ${i + 1}: code block is never closed`);
      const body = lines.slice(start, j);
      i = j;
      if (lang !== 'yaml' || !cur) continue;
      const f = parseEntryBlock(body, start + 1, problems);
      const label = f.id ? f.id : `entry at line ${start + 1}`;
      for (const key of FIELDS) {
        if (f[key] === undefined) problems.push(`${label}: missing field "${key}"`);
        else if (f[key] === '' ) problems.push(`${label}: field "${key}" is empty`);
      }
      if (f.id && !ID_RE.test(f.id)) problems.push(`${label}: id is not <TYPE>-<4 digits>`);
      const links = f.links ? parseLinks(f.links) : [];
      if (f.links && links === null) problems.push(`${label}: links is not a [list]`);
      const entry: RawEntry = {
        id: f.id ?? '',
        title: f.title ?? '',
        status: f.status ?? '',
        plausibility: f.plausibility ?? '',
        summary: f.summary ?? '',
        rules_and_limits: f.rules_and_limits ?? '',
        consequences: f.consequences ?? '',
        story_conflict: f.story_conflict ?? '',
        nearest_precedent: f.nearest_precedent ?? '',
        links: links ?? [],
        order: entries.length,
        section: cur.parent ?? cur.heading,
        subsection: cur.parent ? cur.heading : null,
        line: start + 1,
      };
      entries.push(entry);
      cur.entries.push(entry);
      continue;
    }
    if (/^\s*\|/.test(line)) {
      flush();
      const rows: string[][] = [];
      let j = i;
      while (j < lines.length && /^\s*\|/.test(lines[j])) {
        rows.push(splitRow(lines[j]));
        j++;
      }
      i = j - 1;
      const body = rows.filter((r) => !r.every((c) => /^:?-{2,}:?$/.test(c)));
      if (cur && body.length) cur.tables.push({ columns: body[0], rows: body.slice(1) });
      continue;
    }
    if (!line.trim()) flush();
    else para.push(line.trim());
  }
  flush();
  return { title, chunks, entries, problems };
}

/**
 * The checks the Build brief requires to fail loudly: every field present,
 * no duplicate id, every link pointing at an entry that exists.
 */
export function validateEntries(entries: RawEntry[], problems: string[] = []): string[] {
  const seen = new Map<string, number>();
  for (const e of entries) {
    if (!e.id) continue;
    if (seen.has(e.id)) problems.push(`${e.id}: duplicate id (lines ${seen.get(e.id)} and ${e.line})`);
    else seen.set(e.id, e.line);
  }
  for (const e of entries) {
    for (const l of e.links) {
      if (!seen.has(l)) problems.push(`${e.id}: links to ${l}, which does not exist`);
      if (l === e.id) problems.push(`${e.id}: links to itself`);
    }
    if (new Set(e.links).size !== e.links.length) problems.push(`${e.id}: lists the same link twice`);
  }
  return problems;
}

/** "It holds 58 entries" in the Canon tab's opening section. */
export function statedCount(chunks: Chunk[]): number | null {
  for (const c of chunks) {
    for (const p of [...c.intro, ...c.after]) {
      const m = /holds (\d+) entries/.exec(p);
      if (m) return Number(m[1]);
    }
  }
  return null;
}

export function assertValid(parsed: ParsedCanon): void {
  const problems = validateEntries(parsed.entries, [...parsed.problems]);
  if (parsed.entries.length === 0) problems.push('no entries found in the Canon tab');
  const stated = statedCount(parsed.chunks);
  if (stated === null) problems.push('the Canon tab does not state its entry count ("holds N entries")');
  else if (stated !== parsed.entries.length)
    problems.push(`the Canon tab states ${stated} entries but ${parsed.entries.length} were found`);
  if (problems.length) throw new CanonError(problems);
}

export interface RawBlock {
  kind: 'p' | 'ul' | 'ol';
  items: string[];
}
export interface RawSceneSection {
  heading: string;
  blocks: RawBlock[];
}
export interface RawScene {
  heading: string;
  sections: RawSceneSection[];
}

/** Read the Scenes tab's Markdown. Text is kept verbatim; only escapes are undone. */
export function parseScenes(md: string): { intro: string[]; scenes: RawScene[] } {
  const intro: string[] = [];
  const scenes: RawScene[] = [];
  let scene: RawScene | null = null;
  let section: RawSceneSection | null = null;
  let para: string[] = [];
  const push = (b: RawBlock) => {
    if (section) section.blocks.push(b);
  };
  const flush = () => {
    if (!para.length) return;
    const text = unescapeMd(para.join(' '));
    if (!scene) intro.push(text);
    else push({ kind: 'p', items: [text] });
    para = [];
  };
  for (const line of md.split(/\r?\n/)) {
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      flush();
      const text = unescapeMd(h[2]).trim();
      if (h[1].length === 2) {
        scene = { heading: text, sections: [] };
        section = null;
        scenes.push(scene);
      } else if (h[1].length === 3 && scene) {
        section = { heading: text, blocks: [] };
        scene.sections.push(section);
      }
      continue;
    }
    const li = /^\s*(-|\d+\.)\s+(.*)$/.exec(line);
    if (li && section) {
      flush();
      const kind = li[1] === '-' ? 'ul' : 'ol';
      const lastBlock = section.blocks[section.blocks.length - 1];
      const text = unescapeMd(li[2]);
      if (lastBlock && lastBlock.kind === kind) lastBlock.items.push(text);
      else push({ kind, items: [text] });
      continue;
    }
    if (!line.trim()) flush();
    else para.push(line.trim());
  }
  flush();
  return { intro, scenes };
}
