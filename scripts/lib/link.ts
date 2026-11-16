import type { Config, RawEntry, Segment } from './types.js';

export type Target = { ref: string } | { cast: string };

export interface Lexeme {
  term: string;
  target: Target;
  caseSensitive: boolean;
}

export function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ID_IN_TEXT = /\b[A-Z]{3,5}-\d{4}\b/g;

/** Split text on explicit entry ids such as "(POL-0003)", linking the ones that exist. */
export function linkIds(text: string, ids: Set<string>): Segment[] {
  const out: Segment[] = [];
  let at = 0;
  for (const m of text.matchAll(ID_IN_TEXT)) {
    if (!ids.has(m[0])) continue;
    if (m.index > at) out.push({ t: text.slice(at, m.index) });
    out.push({ t: m[0], ref: m[0] });
    at = m.index + m[0].length;
  }
  if (at < text.length) out.push({ t: text.slice(at) });
  return out;
}

function variants(term: string): string[] {
  const out = [term];
  if (/[^s]s$/.test(term)) out.push(term.slice(0, -1));
  else if (!/s$/.test(term)) out.push(`${term}s`);
  return out;
}

/**
 * The words that link to an entry or a Cast row: Cast names, entry titles
 * (short ones, with "The" and any bracketed part split off), then the aliases
 * from hold.config.json. Aliases win over titles, titles over nothing.
 */
export function buildLexicon(
  entries: RawEntry[],
  castNames: string[],
  config: Config['linking'],
  warn: (msg: string) => void = () => {},
): Lexeme[] {
  const byTerm = new Map<string, Lexeme>();
  const ids = new Set(entries.map((e) => e.id));
  const cs = new Set(config.caseSensitive);
  const add = (term: string, target: Target, caseSensitive: boolean, override = false) => {
    const key = term.toLowerCase();
    if (!term || (byTerm.has(key) && !override)) return;
    byTerm.set(key, { term, target, caseSensitive });
  };

  const titleToId = new Map(entries.map((e) => [e.title, e.id]));
  for (const name of castNames) {
    const id = titleToId.get(name);
    const bare = name.replace(/^The\s+/, '');
    add(bare, id ? { ref: id } : { cast: slug(name) }, true);
  }
  for (const e of entries) {
    const paren = /\(([^)]*)\)/.exec(e.title);
    const main = e.title.replace(/\s*\([^)]*\)/, '').trim();
    for (const raw of [main, paren?.[1] ?? '']) {
      const t = raw.replace(/^The\s+/, '').trim();
      if (!t || /[?]/.test(t) || t.split(/\s+/).length > config.maxTitleWords) continue;
      for (const v of variants(t)) add(v, { ref: e.id }, cs.has(t) || cs.has(v));
    }
  }
  for (const [term, id] of Object.entries(config.aliases)) {
    if (!ids.has(id)) {
      warn(`linking alias "${term}" points at ${id}, which does not exist; skipped`);
      continue;
    }
    add(term, { ref: id }, cs.has(term) || /^[A-Z]/.test(term.replace(/^the\s+/, '')), true);
  }
  return [...byTerm.values()].sort((a, b) => b.term.length - a.term.length);
}

export function lexiconRegex(lexicon: Lexeme[]): RegExp | null {
  if (!lexicon.length) return null;
  const alt = lexicon.map((l) => escapeRe(l.term)).join('|');
  return new RegExp(`(?<![\\p{L}\\p{N}-])(${alt})(?![\\p{L}\\p{N}-])`, 'giu');
}

const key = (t: Target) => ('ref' in t ? t.ref : `cast:${t.cast}`);

/**
 * Link the first mention of each person, place and term in a run of scene text.
 * `seen` carries across paragraphs so a scene links each target once.
 */
export function linkTerms(text: string, lexicon: Lexeme[], seen: Set<string>): Segment[] {
  const re = lexiconRegex(lexicon);
  if (!re) return [{ t: text }];
  const byLower = new Map(lexicon.map((l) => [l.term.toLowerCase(), l]));
  const out: Segment[] = [];
  let at = 0;
  for (const m of text.matchAll(re)) {
    const lex = byLower.get(m[1].toLowerCase());
    if (!lex) continue;
    if (lex.caseSensitive && !matchesCase(m[1], lex.term)) continue;
    const k = key(lex.target);
    if (seen.has(k)) continue;
    seen.add(k);
    if (m.index > at) out.push({ t: text.slice(at, m.index) });
    out.push({ t: m[1], ...lex.target });
    at = m.index + m[1].length;
  }
  if (at < text.length) out.push({ t: text.slice(at) });
  return out;
}

/** Case-sensitive terms still match with a sentence-initial capital ("The Before"). */
function matchesCase(found: string, term: string): boolean {
  return found === term || found === term[0].toUpperCase() + term.slice(1);
}

/** Split Markdown bold and italic into segments; everything else is left as text. */
export function splitBold(text: string): Segment[] {
  const out: Segment[] = [];
  let at = 0;
  for (const m of text.matchAll(/\*\*(.+?)\*\*|(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g)) {
    if (m.index > at) out.push({ t: text.slice(at, m.index) });
    out.push(m[1] !== undefined ? { t: m[1], b: true } : { t: m[2], i: true });
    at = m.index + m[0].length;
  }
  if (at < text.length) out.push({ t: text.slice(at) });
  return out;
}

/** "*[Correction 1 applied ...]*": a whole paragraph in italic square brackets is an editorial note. */
export function editorialNote(text: string): string | null {
  const m = /^\*\[(.*)\]\*$/s.exec(text.trim());
  return m ? m[1] : null;
}

export function mapText(segs: Segment[], fn: (t: string) => Segment[]): Segment[] {
  return segs.flatMap((s) =>
    s.ref || s.cast ? [s] : fn(s.t).map((n) => ({ ...n, ...(s.b ? { b: true } : {}), ...(s.i ? { i: true } : {}) })),
  );
}

export function sentences(text: string): string[] {
  return text.split(/(?<=[.?!]["”]?)\s+(?=[A-Z"“(])/).filter(Boolean);
}
