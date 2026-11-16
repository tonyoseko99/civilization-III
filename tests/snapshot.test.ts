import { describe, expect, it } from 'vitest';
import {
  compareSnapshots,
  decodeEntities,
  decodeExport,
  firstJsonValue,
  htmlToMarkdown,
  NO_CHANGES,
  reportLines,
  reportMarkdown,
  SnapshotError,
  stripByline,
  validateCanon,
} from '../scripts/lib/snapshot';
import { CanonError } from '../scripts/lib/types';

const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64');
const exportFile = (text: string, format = 'markdown', bytes = Buffer.byteLength(text, 'utf8'), rev = 7) =>
  JSON.stringify({ verdict: 'allow', rev, data: { name: 'Tab.md', format, bytes, bytes_b64: b64(text) } });

describe('decodeExport', () => {
  it('decodes the first JSON value and ignores trailing text', () => {
    const raw = exportFile('# Title\n\nBody with "quotes" and {braces}.\n') + '\n\nSome trailing note {not json';
    const d = decodeExport(raw, 'test');
    expect(d).toMatchObject({ format: 'markdown', rev: 7, text: '# Title\n\nBody with "quotes" and {braces}.\n' });
  });

  it('handles braces and escaped quotes inside JSON strings', () => {
    expect(firstJsonValue('{"a":"x}\\"{"} tail}')).toEqual({ a: 'x}"{' });
  });

  it('rejects a decoded length that differs from data.bytes', () => {
    expect(() => decodeExport(exportFile('abc', 'markdown', 4), 'test')).toThrow(/decoded length is 3 bytes but the export says 4/);
  });

  it('counts bytes, not characters', () => {
    expect(decodeExport(exportFile('a\u2014b'), 't').bytes).toBe(5);
  });

  it('rejects a missing bytes_b64', () => {
    const raw = JSON.stringify({ rev: 1, data: { format: 'markdown', bytes: 0 } });
    expect(() => decodeExport(raw, 'test')).toThrow(/no "bytes_b64"/);
  });

  it('rejects an unreadable file and an unknown format', () => {
    expect(() => decodeExport('not json at all', 'test')).toThrow(SnapshotError);
    expect(() => decodeExport('{"data": {', 'test')).toThrow(/never closed/);
    expect(() => decodeExport(exportFile('x', 'pdf'), 'test')).toThrow(/format is "pdf"/);
  });
});

describe('htmlToMarkdown', () => {
  it('converts headings, paragraphs and both list kinds', () => {
    const html =
      '<h1 id="a">Top</h1>\n<p>One para.</p>\n<h2 id="b">Second</h2>\n<h3 id="c">Third</h3>\n' +
      '<ul><li><p>first</p></li><li><p>second</p></li></ul>\n<ol><li><p>alpha</p></li><li><p>beta</p></li></ol>\n';
    expect(htmlToMarkdown(html)).toBe(
      '# Top\n\nOne para.\n\n## Second\n\n### Third\n\n- first\n- second\n\n1. alpha\n2. beta\n',
    );
  });

  it('converts em, strong and nesting of the two', () => {
    expect(htmlToMarkdown('<p>a <em>b</em> <strong>c</strong> <strong><em>d</em></strong> <em>e <strong>f</strong></em></p>')).toBe(
      'a *b* **c** ***d*** *e **f***\n',
    );
    expect(htmlToMarkdown('<ol><li><p><strong>Name.</strong> Wants.</p></li></ol>')).toBe('1. **Name.** Wants.\n');
  });

  it('escapes square brackets in text', () => {
    expect(htmlToMarkdown('<p><em>[Note applied. Original: &quot;x [y]&quot;]</em></p>')).toBe(
      '*\\[Note applied. Original: "x \\[y\\]"\\]*\n',
    );
  });

  it('writes task-list items without escaping their box', () => {
    const html =
      '<ul><li data-checked="true"><p><input type="checkbox" disabled checked> Done [a]</p></li>' +
      '<li data-checked="false"><p><input type="checkbox" disabled> Not done</p></li></ul>';
    expect(htmlToMarkdown(html)).toBe('- [x] Done \\[a\\]\n- [ ] Not done\n');
  });

  it('decodes entities', () => {
    expect(htmlToMarkdown('<p>&quot;a&quot; &#39;b&#39; &amp; &lt;c&gt; &#x2014; &mdash; &hellip;</p>')).toBe(
      '"a" \'b\' & <c> \u2014 \u2014 \u2026\n',
    );
    expect(() => decodeEntities('&bogus;')).toThrow(/unknown HTML entity/);
  });

  it('rejects an unknown tag', () => {
    expect(() => htmlToMarkdown('<p>a <a href="x">link</a></p>')).toThrow(/unknown HTML tag <a>/);
    expect(() => htmlToMarkdown('<table><tr><td>x</td></tr></table>')).toThrow(/unknown HTML tag <table>/);
    expect(() => htmlToMarkdown('<blockquote><p>x</p></blockquote>')).toThrow(/unknown HTML tag/);
  });

  it('rejects known tags in unknown places and leftover markup', () => {
    expect(() => htmlToMarkdown('<ul><li><p>a</p><ul><li><p>b</p></li></ul></li></ul>')).toThrow(/exactly one <p>/);
    expect(() => htmlToMarkdown('<p>a <p>b</p></p>')).toThrow(/not allowed inside/);
    expect(() => htmlToMarkdown('<p>a</p>stray')).toThrow(/text outside any block/);
    expect(() => htmlToMarkdown('<p>a <!-- c --></p>')).toThrow(/leftover unparsed HTML/);
    expect(() => htmlToMarkdown('<p>a</em></p>')).toThrow(/does not close/);
    expect(() => htmlToMarkdown('<p>a')).toThrow(/never closed/);
    expect(() => htmlToMarkdown('<p class="x">a</p>')).toThrow(/unknown attribute "class"/);
    expect(() => htmlToMarkdown('<p><input type="checkbox" disabled> a</p>')).toThrow(/not allowed inside/);
  });
});

describe('stripByline', () => {
  const body = '## How\n\nText.\n';
  it('removes exactly the byline line and the blank line after it', () => {
    const md = `# The Title\n\nJan 2, 2030 · @Sample Person\n\n${body}`;
    const out = stripByline(md);
    expect(out.removed).toBe(true);
    expect(out.text).toBe(`# The Title\n\n${body}`);
    expect(md.split('\n').length - out.text.split('\n').length).toBe(2);
  });

  it('leaves the text alone when there is no byline', () => {
    for (const md of [`# T\n\n${body}`, `# T\n\nJan 2, 2030 without a mention\n\n${body}`, `# T\n\n@someone but no date\n\n${body}`]) {
      expect(stripByline(md)).toEqual({ text: md, removed: false });
    }
  });

  it('only looks directly under the title', () => {
    const md = `# T\n\nIntro line.\n\nJan 2, 2030 · @Sample Person\n`;
    expect(stripByline(md).removed).toBe(false);
  });
});

// --- Change report ----------------------------------------------------------------------

const entry = (id: string, summary = 'A summary.', links = '[]') => `\`\`\`yaml
id: ${id}
title: Title of ${id}
status: established
plausibility: n/a
summary: ${summary}
rules_and_limits: A limit.
consequences: One thing.
story_conflict: A conflict.
nearest_precedent: A precedent.
links: ${links}
\`\`\`
`;
const canonDoc = (opts: { entries: string[]; cast: string[]; decisions: string[] }) =>
  [
    '# Sample Canon',
    '',
    '## How',
    '',
    `It holds ${opts.entries.length} entries.`,
    '',
    '## Cast',
    '',
    '| Name | Who | First seen |',
    '| --- | --- | --- |',
    ...opts.cast,
    '',
    '## Things',
    '',
    ...opts.entries,
    '## Decision log',
    '',
    '| Stage | What changed | Decided by |',
    '| --- | --- | --- |',
    ...opts.decisions,
    '',
  ].join('\n');
const scenesDoc = (...scenes: string[]) => `# Scenes\n\nIntro.\n\n${scenes.join('\n\n')}\n`;
const scene = (title: string, text: string) => `## ${title}\n\n### Narrator\n\n${text}`;

const base = {
  canon: canonDoc({
    entries: [entry('THING-0001'), entry('THING-0002', 'Second.', '[THING-0001]')],
    cast: ['| Aster | A keeper | Dive 1 |'],
    decisions: ['| Dive 1 | Added things | Claude |'],
  }),
  scenes: scenesDoc(scene('Dive 1: Start', 'Once.')),
};

describe('compareSnapshots', () => {
  it('reports no changes for identical text', () => {
    const r = compareSnapshots(base, { ...base });
    expect(r.unchanged).toBe(true);
    expect(reportLines(r)).toEqual([NO_CHANGES]);
    expect(NO_CHANGES).toBe('No canon changes since the last snapshot.');
  });

  it('detects an added entry, a revised field, a new Cast row, a new scene and a new Decision row', () => {
    const next = {
      canon: canonDoc({
        entries: [
          entry('THING-0001', 'A revised summary.'),
          entry('THING-0002', 'Second.', '[THING-0001]'),
          entry('THING-0003', 'Third.', '[THING-0002]'),
        ],
        cast: ['| Aster | A keeper | Dive 1 |', '| Bryn | A walker | Dive 2 |'],
        decisions: ['| Dive 2 | Added more | Claude |', '| Dive 1 | Added things | Claude |'],
      }),
      scenes: scenesDoc(scene('Dive 2: Next', 'Twice.'), scene('Dive 1: Start', 'Once.')),
    };
    validateCanon(next.canon);
    const r = compareSnapshots(base, next);
    expect(r.unchanged).toBe(false);
    expect(r.entriesAdded).toEqual(['THING-0003']);
    expect(r.entriesRemoved).toEqual([]);
    expect(r.entriesRevised).toEqual([{ id: 'THING-0001', fields: ['summary'] }]);
    expect(r.castAdded).toEqual(['Bryn']);
    expect(r.castChanged).toEqual([]);
    expect(r.scenesAdded).toEqual(['Dive 2: Next']);
    expect(r.scenesChanged).toEqual([]);
    expect(r.decisionsAdded).toEqual(['Dive 2']);
    expect(r.oldCount).toBe(2);
    expect(r.newCount).toBe(3);
    const md = reportMarkdown(r, { date: '2030-01-03', canonRev: 8, scenesRev: 4, oldCanonRev: 7, oldScenesRev: 3 });
    expect(md).toMatch(/^\| 2030-01-03 \| Canon refresh \| Done\. Snapshot: Canon tab rev 8, Scenes tab rev 4\. Since rev 7 \/ rev 3: /);
    expect(md).toMatch(/1 entry added \(THING-0003\)/);
    expect(md).toMatch(/1 entry revised \(THING-0001: summary\)/);
    expect(md).toMatch(/1 Cast row added \(Bryn\)/);
    expect(md).toMatch(/1 scene newly recorded/);
    expect(md).toMatch(/1 new Decision log row \("Dive 2"\)/);
    expect(md.endsWith(' |')).toBe(true);
    expect(md.split('\n')).toHaveLength(1);
  });

  it('detects a changed Cast row, a changed scene and changed links', () => {
    const next = {
      canon: canonDoc({
        entries: [entry('THING-0001'), entry('THING-0002', 'Second.', '[]')],
        cast: ['| Aster | A keeper, now older | Dive 1 |'],
        decisions: ['| Dive 1 | Added things | Claude |'],
      }),
      scenes: scenesDoc(scene('Dive 1: Start', 'Once, again.')),
    };
    const r = compareSnapshots(base, next);
    expect(r.entriesRevised).toEqual([{ id: 'THING-0002', fields: ['links'] }]);
    expect(r.castChanged).toEqual([{ key: 'Aster', columns: ['Who'] }]);
    expect(r.scenesChanged).toEqual(['Dive 1: Start']);
  });

  it('says when only other text changed', () => {
    const r = compareSnapshots(base, { ...base, scenes: base.scenes.replace('Intro.', 'Intro, revised.') });
    expect(r.unchanged).toBe(false);
    expect(reportLines(r).at(-1)).toMatch(/Other text changed in the Scenes tab/);
  });
});

describe('validateCanon', () => {
  it('passes a valid Canon and rejects a bad one', () => {
    expect(validateCanon(base.canon).entries).toHaveLength(2);
    expect(() => validateCanon(base.canon.replace('holds 2 entries', 'holds 3 entries'))).toThrow(CanonError);
  });
});
