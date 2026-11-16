import {
  PROSE_FIELDS,
  type Block,
  type Cast,
  type Config,
  type Decisions,
  type Entry,
  type KnownError,
  type Meta,
  type ProseField,
  type Scene,
  type Scenes,
  type Segment,
  type SupersededLine,
  type Tally,
} from './types.js';
import { assertValid, parseCanon, parseScenes, type Chunk, type Table } from './parse.js';
import { buildLexicon, editorialNote, linkIds, linkTerms, mapText, sentences, slug, splitBold } from './link.js';

export interface Output {
  entries: Entry[];
  cast: Cast;
  scenes: Scenes;
  decisions: Decisions;
  meta: Meta;
  tally: Tally;
  warnings: string[];
}

const EMPTY: Table = { columns: [], rows: [] };

function findChunk(chunks: Chunk[], test: (c: Chunk) => boolean): Chunk | undefined {
  return chunks.find(test);
}

/** A chunk is recognised by the columns of its table, not by its heading's wording. */
const hasColumns = (...cols: string[]) => (c: Chunk) =>
  c.tables.some((t) => cols.every((col) => t.columns.includes(col)));

function col(t: Table, name: string): number {
  return t.columns.indexOf(name);
}

export function build(canonMd: string, scenesMd: string, config: Config, snapshot: unknown = null): Output {
  const warnings: string[] = [];
  const warn = (m: string) => warnings.push(m);

  const parsed = parseCanon(canonMd);
  assertValid(parsed);
  const raw = parsed.entries;
  const ids = new Set(raw.map((e) => e.id));
  const byId = new Map(raw.map((e) => [e.id, e]));
  const ref = (t: string) => linkIds(t, ids);
  const unverifiableRes = config.uncertainty.unverifiable.patterns.map((p) => new RegExp(p, 'i'));
  const isUnverifiable = (t: string) => unverifiableRes.some((r) => r.test(t));

  // --- Decision log, known errors, superseded lines --------------------------------
  const decisionChunk = findChunk(parsed.chunks, hasColumns('Stage', 'What changed'));
  const errorChunk = findChunk(parsed.chunks, hasColumns('Belief', 'Truth'));
  const supersededChunk = findChunk(parsed.chunks, hasColumns('Scene', 'Line'));
  if (!decisionChunk) warn('no Decision log table found (columns Stage / What changed)');

  const stageRules = config.scenes.stages.map((s) => ({ ...s, re: new RegExp(s.pattern) }));
  const sceneKey = (text: string): { id: string; label: string } | null => {
    for (const r of stageRules) {
      const m = r.re.exec(text);
      if (!m) continue;
      const fill = (s: string) => s.replace(/\$(\d)/g, (_, n) => m[Number(n)] ?? '');
      return { id: fill(r.id), label: fill(r.label) };
    }
    return null;
  };
  /** "Dive 2 (named Dive 6)" or "Arrival" → the scene it first names. */
  const sceneFromLabel = (text: string): string | null => {
    for (const r of config.scenes.stages) {
      const label = r.label.replace(/\$\d/g, '(\\d+)');
      const m = new RegExp(`^${label}\\b`).exec(text);
      if (m) return r.id.replace(/\$(\d)/g, (_, n) => m[Number(n)] ?? '');
    }
    return null;
  };

  const dt = decisionChunk?.tables[0] ?? EMPTY;
  const decisionRows = dt.rows.map((r) => ({
    stage: r[col(dt, 'Stage')] ?? '',
    changed: ref(r[col(dt, 'What changed')] ?? ''),
    decidedBy: r[col(dt, 'Decided by')] ?? '',
    scene: sceneKey(r[col(dt, 'Stage')] ?? '')?.id ?? null,
  }));

  // --- Cast -------------------------------------------------------------------------
  const castChunk = findChunk(parsed.chunks, hasColumns('Name', 'Who'));
  if (!castChunk) warn('no Cast table found (columns Name / Who)');
  const ct = castChunk?.tables[0] ?? EMPTY;
  const titleToId = new Map(raw.map((e) => [e.title, e.id]));
  const cast: Cast = {
    intro: castChunk?.intro ?? [],
    columns: ct.columns,
    after: castChunk?.after ?? [],
    rows: ct.rows.map((r) => {
      const name = r[col(ct, 'Name')] ?? '';
      const firstSeen = r[col(ct, 'First seen')] ?? '';
      return {
        name,
        slug: slug(name),
        who: ref(r[col(ct, 'Who')] ?? ''),
        rail: ref(r[col(ct, 'Rail or position')] ?? ''),
        firstSeen,
        firstSeenScene: sceneFromLabel(firstSeen),
        entry: titleToId.get(name) ?? null,
      };
    }),
  };
  const castSlugs = new Set<string>();
  for (const row of cast.rows) {
    if (castSlugs.has(row.slug)) warn(`Cast lists "${row.name}" twice`);
    castSlugs.add(row.slug);
  }

  // --- Known in-world errors --------------------------------------------------------
  const et = errorChunk?.tables[0] ?? EMPTY;
  const knownErrors: KnownError[] = et.rows.map((r) => {
    const truth = r[col(et, 'Truth')] ?? '';
    const heldBy = r[col(et, 'Held by')] ?? '';
    return {
      belief: r[col(et, 'Belief')] ?? '',
      heldBy,
      truth: ref(truth),
      refs: [...truth.matchAll(/\b[A-Z]{3,5}-\d{4}\b/g)].map((m) => m[0]).filter((id) => ids.has(id)),
      holders: raw.filter((e) => heldBy.includes(e.title)).map((e) => e.id),
    };
  });

  const st = supersededChunk?.tables[0] ?? EMPTY;
  const superseded: SupersededLine[] = st.rows.map((r) => ({
    scene: r[col(st, 'Scene')] ?? '',
    sceneId: sceneFromLabel(r[col(st, 'Scene')] ?? ''),
    line: r[col(st, 'Line')] ?? '',
    status: ref(r[col(st, 'Status')] ?? ''),
  }));

  const decisions: Decisions = {
    intro: decisionChunk?.intro ?? [],
    columns: dt.columns,
    rows: decisionRows,
    knownErrors: {
      heading: errorChunk?.heading ?? '',
      intro: errorChunk?.intro ?? [],
      columns: et.columns,
      rows: knownErrors,
    },
    superseded: { heading: supersededChunk?.heading ?? '', columns: st.columns, rows: superseded },
  };

  // --- Scenes -----------------------------------------------------------------------
  const lexicon = buildLexicon(raw, cast.rows.map((r) => r.name), config.linking, warn);
  const rawScenes = parseScenes(scenesMd);
  const sceneRefs = new Map<string, Set<string>>();
  const recorded = new Map<string, Scene>();
  const ignore = (config.scenes.ignoreHeadings ?? []).map((p) => new RegExp(p));
  for (const rs of rawScenes.scenes) {
    const k = sceneKey(rs.heading);
    if (!k && ignore.some((r) => r.test(rs.heading))) continue;
    if (!k) {
      warn(`Scenes tab heading "${rs.heading}" matches no scene stage in hold.config.json; skipped`);
      continue;
    }
    const seen = new Set<string>();
    const refs = new Set<string>();
    const castSeen = new Set<string>();
    const sections = rs.sections.map((sec) => {
      const voice = /^narrator$/i.test(sec.heading) ? ('narrator' as const) : ('architect' as const);
      const blocks: Block[] = sec.blocks.map((b) => {
        const note = b.kind === 'p' ? editorialNote(b.items[0]) : null;
        if (note !== null) {
          const segs = ref(note);
          for (const s of segs) if (s.ref) refs.add(s.ref);
          return { kind: 'p', items: [segs], note: true };
        }
        const items = b.items.map((text) => {
          let segs: Segment[] = splitBold(text);
          segs = mapText(segs, ref);
          if (voice === 'narrator') segs = mapText(segs, (t) => linkTerms(t, lexicon, seen));
          for (const s of segs) {
            if (s.ref) refs.add(s.ref);
            if (s.cast) castSeen.add(s.cast);
          }
          return segs;
        });
        const flags = b.items.map(isUnverifiable);
        return flags.some(Boolean) ? { kind: b.kind, items, unverifiable: flags } : { kind: b.kind, items };
      });
      return { heading: sec.heading, voice, blocks };
    });
    sceneRefs.set(k.id, refs);
    recorded.set(k.id, {
      id: k.id,
      label: k.label,
      title: rs.heading,
      order: 0,
      recorded: true,
      stage: null,
      sections,
      superseded: [],
      refs: [...refs],
      cast: [...castSeen],
    });
  }

  // Scene order comes from the Decision log, oldest first. A stage with no recorded
  // scene is listed as missing; its text is never supplied from anywhere else.
  const sceneList: Scene[] = [];
  for (const row of [...decisionRows].reverse()) {
    if (!row.scene || sceneList.some((s) => s.id === row.scene)) continue;
    const k = sceneKey(row.stage)!;
    const rec = recorded.get(k.id);
    sceneList.push(
      rec
        ? { ...rec, stage: row }
        : {
            id: k.id,
            label: k.label,
            title: row.stage,
            order: 0,
            recorded: false,
            stage: row,
            sections: [],
            superseded: [],
            refs: [],
            cast: [],
          },
    );
  }
  for (const rec of recorded.values()) {
    if (!sceneList.some((s) => s.id === rec.id)) {
      warn(`scene "${rec.title}" has no row in the Decision log; listed last`);
      sceneList.push(rec);
    }
  }
  sceneList.forEach((s, i) => {
    s.order = i;
    s.superseded = superseded.filter((l) => l.sceneId === s.id);
  });
  const sceneIds = new Set(sceneList.map((s) => s.id));
  for (const row of cast.rows) if (row.firstSeenScene && !sceneIds.has(row.firstSeenScene)) row.firstSeenScene = null;
  for (const l of superseded) if (l.sceneId && !sceneIds.has(l.sceneId)) l.sceneId = null;
  const scenes: Scenes = { intro: rawScenes.intro, scenes: sceneList };

  // --- Entries ----------------------------------------------------------------------
  const linkedFrom = new Map<string, string[]>();
  for (const e of raw) for (const l of e.links) linkedFrom.set(l, [...(linkedFrom.get(l) ?? []), e.id]);
  const entries: Entry[] = raw.map((e) => ({
    ...e,
    type: e.id.split('-')[0],
    rich: Object.fromEntries(PROSE_FIELDS.map((f) => [f, ref(e[f])])) as Record<ProseField, Segment[]>,
    linkedFrom: linkedFrom.get(e.id) ?? [],
    unverifiable: PROSE_FIELDS.filter((f) => isUnverifiable(e[f])),
    knownErrors: knownErrors.flatMap((k, i) => (k.refs.includes(e.id) || k.holders.includes(e.id) ? [i] : [])),
    scenes: sceneList.filter((s) => sceneRefs.get(s.id)?.has(e.id)).map((s) => s.id),
  }));

  // --- Meta -------------------------------------------------------------------------
  const howChunk = parsed.chunks[0];
  const entryChunks = parsed.chunks.filter((c) => c.entries.length);
  const typeCodes = [...new Set(entries.map((e) => e.type))];
  const src = config.uncertainty.unverifiable.source;
  const srcEntry = src ? byId.get(src.entry) : undefined;
  const srcText = srcEntry ? sentences(String(srcEntry[src!.field as ProseField] ?? ''))[src!.sentence] : undefined;
  if (src && !srcText) warn('uncertainty.unverifiable.source does not resolve; the legend will not quote canon');
  const meta: Meta = {
    title: parsed.title,
    statedCount: entries.length,
    entryCount: entries.length,
    how: {
      heading: howChunk?.heading ?? '',
      intro: howChunk?.intro ?? [],
      columns: howChunk?.tables[0]?.columns ?? [],
      rows: (howChunk?.tables[0]?.rows ?? []).map((r) => r.map(ref)),
      after: howChunk?.after ?? [],
    },
    sections: entryChunks.map((c) => ({
      heading: c.heading,
      parent: c.parent,
      intro: c.intro,
      entries: c.entries.map((e) => e.id),
    })),
    types: typeCodes.map((code) => ({
      code,
      count: entries.filter((e) => e.type === code).length,
      sections: [...new Set(entries.filter((e) => e.type === code).map((e) => e.subsection ?? e.section))],
    })),
    snapshot,
    uncertaintySource: srcText ? { entry: src!.entry, text: srcText } : null,
  };

  // --- Tally ------------------------------------------------------------------------
  const field = (id: string, f: string): string | null => {
    const e = byId.get(id);
    const v = e ? (e as unknown as Record<string, unknown>)[f] : null;
    return typeof v === 'string' ? v : null;
  };
  const tally: Tally = { figures: [], rails: null, unresolved: null, hold: null };
  for (const fig of config.tally.figures) {
    const text = field(fig.entry, fig.field);
    const m = text ? new RegExp(fig.pattern).exec(text) : null;
    if (!text || !m?.[1]) {
      warn(`tally figure "${fig.key}" not found in ${fig.entry}.${fig.field}; left off the front page`);
      continue;
    }
    const sentence = sentences(text).find((s) => s.includes(m[0])) ?? text;
    tally.figures.push({
      key: fig.key,
      label: fig.label,
      value: m[1],
      entry: fig.entry,
      title: byId.get(fig.entry)!.title,
      sentence: ref(sentence),
    });
  }
  const rc = config.tally.rails;
  if (rc) {
    const all = sentences(field(rc.entry, rc.field) ?? '');
    const clauses = (all[rc.sentence] ?? '').split(rc.split).map((s) => s.trim()).filter(Boolean);
    if (clauses.length !== rc.expect) {
      warn(`tally rails: expected ${rc.expect} clauses in ${rc.entry}.${rc.field}, found ${clauses.length}; left off`);
    } else {
      tally.rails = {
        entry: rc.entry,
        title: byId.get(rc.entry)!.title,
        clauses: clauses.map(ref),
        rest: ref(all.filter((_, i) => i !== rc.sentence && i !== 0).join(' ')),
      };
    }
  }
  const uc = config.tally.unresolved;
  if (uc) {
    const all = sentences(field(uc.entry, uc.field) ?? '');
    const text = uc.sentences.map((i) => all[i]).filter(Boolean).join(' ');
    if (text) tally.unresolved = { entry: uc.entry, title: byId.get(uc.entry)!.title, text: ref(text) };
    else warn(`tally unresolved: ${uc.entry}.${uc.field} not found; left off`);
  }
  const hc = config.tally.hold;
  if (hc && byId.has(hc.entry)) {
    const e = byId.get(hc.entry)!;
    tally.hold = { entry: e.id, title: e.title, summary: ref(e.summary) };
  }

  return { entries, cast, scenes, decisions, meta, tally, warnings };
}
