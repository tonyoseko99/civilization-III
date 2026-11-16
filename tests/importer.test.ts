import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { build } from '../scripts/lib/build';
import { parseCanon, parseScenes, statedCount, unescapeMd } from '../scripts/lib/parse';
import { CanonError, FIELDS, type Config } from '../scripts/lib/types';

const canon = readFileSync('canon/source.md', 'utf8');
const scenes = readFileSync('canon/scenes.md', 'utf8');
const config = JSON.parse(readFileSync('hold.config.json', 'utf8')) as Config;

const entry = (id: string, links = '[]', extra = '') => `\`\`\`yaml
id: ${id}
title: Title of ${id}
status: established
plausibility: n/a
summary: A summary.
rules_and_limits: A limit.
consequences: Politics: one thing. Society: another.
story_conflict: A conflict.
nearest_precedent: A precedent.
links: ${links}
${extra}\`\`\`
`;
const doc = (n: number, ...blocks: string[]) =>
  `# T\n\n## How\n\nIt holds ${n} entries.\n\n## Things\n\n${blocks.join('\n')}`;
const problems = (md: string): string[] => {
  try {
    build(md, '', config);
  } catch (e) {
    if (e instanceof CanonError) return e.problems;
    throw e;
  }
  return [];
};

describe('the real snapshot', () => {
  const out = build(canon, scenes, config);

  it('imports every entry and matches the count the Canon tab states', () => {
    const stated = statedCount(parseCanon(canon).chunks);
    expect(stated).not.toBeNull();
    expect(out.entries.length).toBe(stated);
    expect(out.entries.length).toBe((canon.match(/^```yaml$/gm) ?? []).length);
  });

  it('gives every entry all ten fields, non-empty', () => {
    for (const e of out.entries) {
      for (const f of FIELDS) {
        const v = e[f];
        expect(Array.isArray(v) ? true : v.length > 0, `${e.id}.${f}`).toBe(true);
      }
      expect(e.id.startsWith(`${e.type}-`)).toBe(true);
    }
  });

  it('keeps field text verbatim, including colons inside a value', () => {
    for (const e of out.entries) {
      for (const f of ['summary', 'rules_and_limits', 'consequences', 'story_conflict', 'nearest_precedent'] as const) {
        expect(canon, `${e.id}.${f}`).toContain(`${f}: ${e[f]}\n`);
        expect(e.rich[f].map((s) => s.t).join('')).toBe(e[f]);
      }
    }
  });

  it('raises no warnings', () => {
    expect(out.warnings).toEqual([]);
  });

  it('reads the Cast, the Decision log and its two side tables', () => {
    expect(out.cast.rows.length).toBe((canon.split('## Cast')[1].split('\n## ')[0].match(/^\| /gm) ?? []).length - 2);
    expect(out.decisions.rows.length).toBeGreaterThan(0);
    expect(out.decisions.knownErrors.rows.length).toBeGreaterThan(0);
    expect(out.decisions.superseded.rows.length).toBeGreaterThan(0);
    for (const r of out.cast.rows) expect(r.name && r.slug).toBeTruthy();
  });

  it('keeps scene text verbatim', () => {
    const raw = parseScenes(scenes);
    const recorded = out.scenes.scenes.filter((s) => s.recorded);
    expect(recorded.length).toBe(raw.scenes.length);
    for (const s of recorded) {
      for (const sec of s.sections) {
        for (const b of sec.blocks) {
          for (const item of b.items) {
            const text = item.map((x) => (x.b ? `**${x.t}**` : x.t)).join('');
            expect(scenes).toContain(text);
          }
        }
      }
    }
  });

  it('lists unrecorded scenes as missing, with no text', () => {
    const missing = out.scenes.scenes.filter((s) => !s.recorded);
    expect(missing.length).toBeGreaterThan(0);
    for (const s of missing) {
      expect(s.sections).toEqual([]);
      expect(s.stage).not.toBeNull();
    }
    expect(out.scenes.scenes.map((s) => s.order)).toEqual(out.scenes.scenes.map((_, i) => i));
  });

  it('marks only the Narrator section as narrator voice', () => {
    for (const s of out.scenes.scenes) {
      for (const sec of s.sections) expect(sec.voice).toBe(sec.heading === 'Narrator' ? 'narrator' : 'architect');
    }
  });

  it('resolves every tally pointer from canon text', () => {
    expect(out.tally.figures.length).toBe(config.tally.figures.length);
    for (const f of out.tally.figures) {
      const e = out.entries.find((x) => x.id === f.entry)!;
      expect(e.summary).toContain(f.value);
    }
    expect(out.tally.rails?.clauses.length).toBe(config.tally.rails?.expect);
    expect(out.tally.hold).not.toBeNull();
    expect(out.tally.unresolved).not.toBeNull();
  });

  it('never writes the author byline into the data', () => {
    expect(JSON.stringify(out)).not.toMatch(/@\w+ \w+/);
  });
});

describe('validation fails loudly', () => {
  it('accepts a well-formed document', () => {
    expect(problems(doc(2, entry('AAA-0001', '[BBB-0001]'), entry('BBB-0001')))).toEqual([]);
  });

  it('rejects an entry that lacks a field', () => {
    const md = doc(1, entry('AAA-0001').replace(/^story_conflict:.*\n/m, ''));
    expect(problems(md)).toContain('AAA-0001: missing field "story_conflict"');
  });

  it('rejects an empty field', () => {
    const md = doc(1, entry('AAA-0001').replace(/^summary:.*$/m, 'summary:'));
    expect(problems(md)).toContain('AAA-0001: field "summary" is empty');
  });

  it('rejects a duplicated id', () => {
    expect(problems(doc(2, entry('AAA-0001'), entry('AAA-0001'))).join('\n')).toMatch(/AAA-0001: duplicate id/);
  });

  it('rejects a link to an id that does not exist', () => {
    expect(problems(doc(1, entry('AAA-0001', '[ZZZ-9999]')))).toContain(
      'AAA-0001: links to ZZZ-9999, which does not exist',
    );
  });

  it('rejects a count that differs from the stated count', () => {
    expect(problems(doc(3, entry('AAA-0001'))).join('\n')).toMatch(/states 3 entries but 1 were found/);
  });

  it('rejects an unknown field and a malformed id or links list', () => {
    expect(problems(doc(1, entry('AAA-0001', '[]', 'mood: grim\n'))).join('\n')).toMatch(/not a known entry field/);
    expect(problems(doc(1, entry('aaa-1'))).join('\n')).toMatch(/id is not <TYPE>-<4 digits>/);
    expect(problems(doc(1, entry('AAA-0001', 'BBB-0001'))).join('\n')).toMatch(/links is not a \[list\]/);
  });

  it('reports every problem at once', () => {
    const p = problems(doc(2, entry('AAA-0001', '[ZZZ-9999]'), entry('AAA-0001')));
    expect(p.length).toBeGreaterThanOrEqual(2);
  });

  it('needs no code change for a new type, entry or scene', () => {
    const md = doc(2, entry('NEW-0001', '[AAA-0001]'), entry('AAA-0001')) +
      '\n## Decision log\n\n| Stage | What changed | Decided by |\n| --- | --- | --- |\n| Dive 2: later | Added NEW-0001 | Claude |\n| Dive 1: first | Added AAA-0001 | Claude |\n';
    const out = build(md, '## Dive 2: later\n\n### Narrator\n\nA line.\n', config);
    expect(out.meta.types.map((t) => t.code)).toEqual(['NEW', 'AAA']);
    expect(out.scenes.scenes.map((s) => [s.id, s.recorded])).toEqual([['dive-1', false], ['dive-2', true]]);
    expect(out.decisions.rows[0].changed).toEqual([{ t: 'Added ' }, { t: 'NEW-0001', ref: 'NEW-0001' }]);
  });
});

describe('markdown handling', () => {
  it('undoes export escapes', () => {
    expect(unescapeMd('rules\\_and\\_limits \\| a')).toBe('rules_and_limits | a');
  });
});
