import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { build } from '../scripts/lib/build';
import { buildLexicon, linkIds, linkTerms, sentences, splitBold } from '../scripts/lib/link';
import type { Config, RawEntry, Segment } from '../scripts/lib/types';

const config = JSON.parse(readFileSync('hold.config.json', 'utf8')) as Config;
const out = build(readFileSync('canon/source.md', 'utf8'), readFileSync('canon/scenes.md', 'utf8'), config);
const ids = new Set(out.entries.map((e) => e.id));
const byId = new Map(out.entries.map((e) => [e.id, e]));
const castSlugs = new Set(out.cast.rows.map((r) => r.slug));
const sceneIds = new Set(out.scenes.scenes.map((s) => s.id));

const allSegments = (): Segment[] => [
  ...out.entries.flatMap((e) => Object.values(e.rich).flat()),
  ...out.scenes.scenes.flatMap((s) => s.sections.flatMap((x) => x.blocks.flatMap((b) => b.items.flat()))),
  ...out.scenes.scenes.flatMap((s) => [...(s.stage?.changed ?? []), ...s.superseded.flatMap((l) => l.status)]),
  ...out.cast.rows.flatMap((r) => [...r.who, ...r.rail]),
  ...out.decisions.rows.flatMap((r) => r.changed),
  ...out.decisions.knownErrors.rows.flatMap((r) => r.truth),
  ...out.tally.figures.flatMap((f) => f.sentence),
  ...(out.tally.rails?.clauses.flat() ?? []),
];

describe('link resolution in the real snapshot', () => {
  it('resolves every link both ways', () => {
    for (const e of out.entries) {
      for (const l of e.links) {
        expect(ids.has(l), `${e.id} -> ${l}`).toBe(true);
        expect(byId.get(l)!.linkedFrom, `${l} linkedFrom ${e.id}`).toContain(e.id);
      }
      for (const b of e.linkedFrom) expect(byId.get(b)!.links, `${b} links ${e.id}`).toContain(e.id);
    }
  });

  it('has no dangling reference anywhere in the data', () => {
    for (const s of allSegments()) {
      if (s.ref) expect(ids.has(s.ref), s.ref).toBe(true);
      if (s.cast) expect(castSlugs.has(s.cast), s.cast).toBe(true);
    }
    for (const e of out.entries) for (const s of e.scenes) expect(sceneIds.has(s)).toBe(true);
    for (const r of out.cast.rows) {
      if (r.entry) expect(ids.has(r.entry)).toBe(true);
      if (r.firstSeenScene) expect(sceneIds.has(r.firstSeenScene)).toBe(true);
    }
    for (const k of out.decisions.knownErrors.rows) for (const r of [...k.refs, ...k.holders]) expect(ids.has(r)).toBe(true);
  });

  it('links every Cast name a recorded scene mentions', () => {
    for (const s of out.scenes.scenes.filter((x) => x.recorded)) {
      const narr = s.sections.filter((x) => x.voice === 'narrator');
      const text = narr.flatMap((x) => x.blocks.filter((b) => !b.note).flatMap((b) => b.items.map((i) => i.map((g) => g.t).join('')))).join('\n');
      const linked = new Set(narr.flatMap((x) => x.blocks.flatMap((b) => b.items.flat())).flatMap((g) => g.cast ?? g.ref ?? []));
      for (const r of out.cast.rows) {
        const bare = r.name.replace(/^The /, '');
        if (new RegExp(`(?<![\\w-])${bare}(?![\\w-])`).test(text)) {
          expect(linked.has(r.entry ?? r.slug), `${s.id}: ${r.name}`).toBe(true);
        }
      }
    }
  });

  it('puts term links only in Narrator text; Architect text links ids only', () => {
    for (const s of out.scenes.scenes) {
      for (const sec of s.sections.filter((x) => x.voice === 'architect')) {
        for (const g of sec.blocks.flatMap((b) => b.items.flat())) {
          expect(g.cast).toBeUndefined();
          if (g.ref) expect(g.t).toBe(g.ref);
        }
      }
    }
  });

  it('records which scenes link to an entry', () => {
    for (const s of out.scenes.scenes) for (const r of s.refs) expect(byId.get(r)!.scenes).toContain(s.id);
  });
});

describe('the linker', () => {
  const e = (id: string, title: string): RawEntry => ({
    id, title, status: 'established', plausibility: 'n/a', summary: 's', rules_and_limits: 'r', consequences: 'c',
    story_conflict: 'x', nearest_precedent: 'p', links: [], order: 0, section: 'S', subsection: null, line: 1,
  });
  const entries = [
    e('HIST-0004', 'The Hold'), e('ORG-0001', 'The Keepers'), e('PLACE-0003', 'The Comb (Before walls)'),
    e('MIND-0003', 'The Unread-born'), e('PLACE-0001', 'The Unread Houses'), e('MYST-0001', 'Is the Retraction Authentic?'),
    e('CHAR-0002', 'Ione'),
  ];
  const lex = buildLexicon(entries, ['Ione', 'Vane', 'The Narrator'], {
    caseSensitive: ['Hold', 'Unread'], maxTitleWords: 3, aliases: { Unread: 'PLACE-0001', nowhere: 'ZZZ-0001' },
  });
  const link = (t: string, seen = new Set<string>()) => linkTerms(t, lex, seen).filter((s) => s.ref || s.cast);

  it('links ids that exist and leaves the rest as text', () => {
    expect(linkIds('see (ORG-0001) and XXX-0001', new Set(['ORG-0001']))).toEqual([
      { t: 'see (' }, { t: 'ORG-0001', ref: 'ORG-0001' }, { t: ') and XXX-0001' },
    ]);
  });

  it('matches titles without "The", in singular and plural, and bracketed names', () => {
    expect(link("a keeper's key")).toEqual([{ t: 'keeper', ref: 'ORG-0001' }]);
    expect(link('on the comb')).toEqual([{ t: 'comb', ref: 'PLACE-0003' }]);
    expect(link('the Before walls')).toEqual([{ t: 'Before walls', ref: 'PLACE-0003' }]);
  });

  it('respects case-sensitive terms', () => {
    expect(link('the hold rail')).toEqual([]);
    expect(link('the Hold is sealed')).toEqual([{ t: 'Hold', ref: 'HIST-0004' }]);
  });

  it('prefers the longest term and does not match inside a hyphenated word', () => {
    expect(link('an Unread-born child')).toEqual([{ t: 'Unread-born', ref: 'MIND-0003' }]);
    expect(link('an Unread House')).toEqual([{ t: 'Unread House', ref: 'PLACE-0001' }]);
    expect(link('the keeper-stair')).toEqual([]);
  });

  it('links people to their entry when one exists, else to the Cast', () => {
    expect(link('Ione and Vane')).toEqual([{ t: 'Ione', ref: 'CHAR-0002' }, { t: 'Vane', cast: 'vane' }]);
  });

  it('links each target once per scene', () => {
    const seen = new Set<string>();
    expect(link('Vane spoke. Vane left.', seen).length).toBe(1);
    expect(link('Vane again', seen)).toEqual([]);
  });

  it('skips question titles and aliases that point nowhere', () => {
    expect(lex.some((l) => /Authentic/.test(l.term))).toBe(false);
    expect(lex.some((l) => l.term === 'nowhere')).toBe(false);
  });

  it('splits bold and sentences', () => {
    expect(splitBold('**Ione.** Wants')).toEqual([{ t: 'Ione.', b: true }, { t: ' Wants' }]);
    expect(sentences('One thing. "Two," she said. (3) more.')).toEqual(['One thing.', '"Two," she said.', '(3) more.']);
  });
});
