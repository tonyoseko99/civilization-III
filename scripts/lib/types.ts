/** A run of text. `ref` links to an entry id, `cast` to a Cast row, `b` is bold. */
export interface Segment {
  t: string;
  ref?: string;
  cast?: string;
  b?: boolean;
}

export const FIELDS = [
  'id',
  'title',
  'status',
  'plausibility',
  'summary',
  'rules_and_limits',
  'consequences',
  'story_conflict',
  'nearest_precedent',
  'links',
] as const;
export type Field = (typeof FIELDS)[number];

export const PROSE_FIELDS = [
  'summary',
  'rules_and_limits',
  'consequences',
  'story_conflict',
  'nearest_precedent',
] as const;
export type ProseField = (typeof PROSE_FIELDS)[number];

/** An entry exactly as the Canon tab states it. */
export interface RawEntry {
  id: string;
  title: string;
  status: string;
  plausibility: string;
  summary: string;
  rules_and_limits: string;
  consequences: string;
  story_conflict: string;
  nearest_precedent: string;
  links: string[];
  /** Position in the Canon tab. */
  order: number;
  section: string;
  subsection: string | null;
  /** Line in canon/source.md, for error messages. */
  line: number;
}

/** An entry as the app reads it: the ten canon fields plus derived navigation. */
export interface Entry extends RawEntry {
  type: string;
  rich: Record<ProseField, Segment[]>;
  linkedFrom: string[];
  /** Prose fields that match an uncertainty pattern. */
  unverifiable: ProseField[];
  /** Indexes into decisions.knownErrors. */
  knownErrors: number[];
  /** Scenes whose text links here. */
  scenes: string[];
}

export interface Section {
  heading: string;
  parent: string | null;
  intro: string[];
  entries: string[];
}

export interface CastRow {
  name: string;
  slug: string;
  who: Segment[];
  rail: Segment[];
  firstSeen: string;
  firstSeenScene: string | null;
  entry: string | null;
}

export interface Cast {
  intro: string[];
  columns: string[];
  rows: CastRow[];
  after: string[];
}

export interface DecisionRow {
  stage: string;
  changed: Segment[];
  decidedBy: string;
  scene: string | null;
}

export interface KnownError {
  belief: string;
  heldBy: string;
  truth: Segment[];
  refs: string[];
  holders: string[];
}

export interface SupersededLine {
  scene: string;
  sceneId: string | null;
  line: string;
  status: Segment[];
}

export interface Decisions {
  intro: string[];
  columns: string[];
  rows: DecisionRow[];
  knownErrors: { heading: string; intro: string[]; columns: string[]; rows: KnownError[] };
  superseded: { heading: string; columns: string[]; rows: SupersededLine[] };
}

export interface Block {
  kind: 'p' | 'ul' | 'ol';
  /** One item for a paragraph, one per bullet for a list. */
  items: Segment[][];
  /** Per item: true when it matches an uncertainty pattern. */
  unverifiable?: boolean[];
}

export interface SceneSection {
  heading: string;
  voice: 'narrator' | 'architect';
  blocks: Block[];
}

export interface Scene {
  id: string;
  label: string;
  title: string;
  order: number;
  recorded: boolean;
  stage: DecisionRow | null;
  sections: SceneSection[];
  superseded: SupersededLine[];
  refs: string[];
  cast: string[];
}

export interface Scenes {
  intro: string[];
  scenes: Scene[];
}

export interface Meta {
  title: string;
  statedCount: number;
  entryCount: number;
  how: { heading: string; intro: string[]; columns: string[]; rows: Segment[][][]; after: string[] };
  sections: Section[];
  types: { code: string; count: number; sections: string[] }[];
  snapshot: unknown;
  uncertaintySource: { entry: string; text: string } | null;
}

export interface TallyFigure {
  key: string;
  label: string;
  value: string;
  entry: string;
  title: string;
  sentence: Segment[];
}

export interface Tally {
  figures: TallyFigure[];
  rails: { entry: string; title: string; clauses: Segment[][]; rest: Segment[] } | null;
  unresolved: { entry: string; title: string; text: Segment[] } | null;
  hold: { entry: string; title: string; summary: Segment[] } | null;
}

export interface Config {
  scenes: { stages: { pattern: string; id: string; label: string }[] };
  tally: {
    figures: { key: string; entry: string; field: string; pattern: string; label: string }[];
    rails?: { entry: string; field: string; sentence: number; split: string; expect: number };
    unresolved?: { entry: string; field: string; sentences: number[] };
    hold?: { entry: string };
  };
  linking: { caseSensitive: string[]; maxTitleWords: number; aliases: Record<string, string> };
  uncertainty: {
    unverifiable: {
      patterns: string[];
      source?: { entry: string; field: string; sentence: number };
    };
  };
}

export class CanonError extends Error {
  problems: string[];
  constructor(problems: string[]) {
    super(
      `Canon import failed with ${problems.length} problem${problems.length === 1 ? '' : 's'}:\n` +
        problems.map((p) => `  - ${p}`).join('\n'),
    );
    this.name = 'CanonError';
    this.problems = problems;
  }
}
