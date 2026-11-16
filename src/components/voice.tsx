import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { entryById, type Block, type Segment } from '../data';

/** Canon text with its links. Entry links carry the entry's title for screen readers and hover. */
export function Rich({ segs }: { segs: Segment[] }) {
  return (
    <>
      {segs.map((s, i) => {
        let node: ReactNode = s.t;
        if (s.ref) {
          const e = entryById.get(s.ref);
          node = (
            <Link to={`/entries/${s.ref}`} title={e ? `${e.id} ${e.title}` : s.ref} className={s.t === s.ref ? 'id-link' : 'term-link'}>
              {s.t}
            </Link>
          );
        } else if (s.cast) {
          node = (
            <Link to={`/cast/${s.cast}`} className="term-link">
              {s.t}
            </Link>
          );
        }
        if (s.i) node = <em>{node}</em>;
        return s.b ? <strong key={i}>{node}</strong> : <span key={i}>{node}</span>;
      })}
    </>
  );
}

/**
 * The Narrator's voice. Only text taken verbatim from a recorded scene goes in here.
 * Nothing in the Architect's voice may be placed inside this block.
 */
export function Narrator({
  children,
  label = 'Narrator',
  ariaLabel = label,
}: {
  children: ReactNode;
  label?: string;
  /** Distinguishes the landmarks when one scene has several Narrator blocks. */
  ariaLabel?: string;
}) {
  return (
    <section className="voice narrator" aria-label={ariaLabel}>
      <p className="voice-tag" aria-hidden="true">
        {label}
      </p>
      <div className="voice-body">{children}</div>
    </section>
  );
}

/** The Architect's voice: entries, labels, logs, and every piece of interface explanation. */
export function Architect({
  children,
  heading,
  label = 'Architect',
  level = 2,
  id,
}: {
  children: ReactNode;
  heading?: ReactNode;
  label?: string;
  level?: 2 | 3;
  id?: string;
}) {
  const H = level === 2 ? 'h2' : 'h3';
  return (
    <section className="voice architect" id={id}>
      <p className="voice-tag">{label}</p>
      {heading && <H className="voice-heading">{heading}</H>}
      <div className="voice-body">{children}</div>
    </section>
  );
}

export function Blocks({ blocks, legendId }: { blocks: Block[]; legendId?: string }) {
  return (
    <>
      {blocks.map((b, i) => {
        const mark = (j: number) =>
          b.unverifiable?.[j] ? { className: 'unverifiable', 'aria-describedby': legendId } : {};
        if (b.kind === 'p')
          return (
            <p key={i} {...mark(0)}>
              <Rich segs={b.items[0]} />
            </p>
          );
        const L = b.kind === 'ol' ? 'ol' : 'ul';
        return (
          <L key={i}>
            {b.items.map((item, j) => (
              <li key={j} {...mark(j)}>
                <Rich segs={item} />
              </li>
            ))}
          </L>
        );
      })}
    </>
  );
}

export type MarkKind = 'open' | 'unverifiable' | 'error' | 'superseded' | 'missing';
const MARK_TEXT: Record<MarkKind, string> = {
  open: 'open',
  unverifiable: 'unverifiable',
  error: 'in-world error',
  superseded: 'superseded',
  missing: 'not recorded',
};

/** A small label for anything canon leaves uncertain. Shape and word carry it, not colour alone. */
export function Mark({ kind, children }: { kind: MarkKind; children?: ReactNode }) {
  return <span className={`mark mark-${kind}`}>{children ?? MARK_TEXT[kind]}</span>;
}

export function EntryLink({ id, showTitle = true }: { id: string; showTitle?: boolean }) {
  const e = entryById.get(id);
  if (!e) return <span>{id}</span>;
  return (
    <Link to={`/entries/${id}`} className="entry-link">
      <span className="eid">{e.id}</span>
      {showTitle && <span className="etitle">{e.title}</span>}
      {e.status === 'open' && <Mark kind="open" />}
    </Link>
  );
}

export function PageHead({ kicker, title, children }: { kicker?: ReactNode; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="page-head">
      {kicker && <p className="kicker">{kicker}</p>}
      <h1>{title}</h1>
      {children}
    </header>
  );
}
