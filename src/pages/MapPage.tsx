import { useMemo, useRef, type KeyboardEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mark, PageHead } from '../components/voice';
import { entries, entryById, meta } from '../data';

const SIZE = 800;
const C = SIZE / 2;
const R = 285;
const GAP = 0.055; // radians left open between types

interface Node {
  id: string;
  type: string;
  a: number;
  x: number;
  y: number;
}

/** Entries on a ring, in canon order, one arc per type. Fixed layout: same canon, same picture. */
function layout() {
  const types = meta.types;
  const free = Math.PI * 2 - GAP * types.length;
  const step = free / entries.length;
  let a = -Math.PI / 2;
  const nodes: Node[] = [];
  const arcs: { code: string; from: number; to: number; count: number }[] = [];
  for (const t of types) {
    const members = entries.filter((e) => e.type === t.code);
    const from = a;
    members.forEach((e, i) => {
      const ang = a + step * (i + 0.5);
      nodes.push({ id: e.id, type: e.type, a: ang, x: C + R * Math.cos(ang), y: C + R * Math.sin(ang) });
    });
    a += step * members.length;
    arcs.push({ code: t.code, from, to: a, count: members.length });
    a += GAP;
  }
  const pos = new Map(nodes.map((n) => [n.id, n]));
  const seen = new Set<string>();
  const edges: { a: string; b: string }[] = [];
  for (const e of entries) {
    for (const l of e.links) {
      const k = [e.id, l].sort().join('|');
      if (seen.has(k)) continue;
      seen.add(k);
      edges.push({ a: e.id, b: l });
    }
  }
  return { nodes, arcs, edges, pos };
}

const pt = (ang: number, r: number) => `${(C + r * Math.cos(ang)).toFixed(1)},${(C + r * Math.sin(ang)).toFixed(1)}`;

export function MapPage() {
  const { nodes, arcs, edges, pos } = useMemo(layout, []);
  const [params, setParams] = useSearchParams();
  const focus = params.get('focus');
  const selected = focus ? entryById.get(focus) : undefined;
  const svg = useRef<SVGSVGElement>(null);
  const near = useMemo(
    () => new Set(selected ? [...selected.links, ...selected.linkedFrom] : []),
    [selected],
  );
  const select = (id: string | null) => setParams(id ? { focus: id } : {}, { replace: true });

  const onKey = (ev: KeyboardEvent, i: number) => {
    const move = (to: number) => {
      ev.preventDefault();
      const n = nodes[(to + nodes.length) % nodes.length];
      svg.current?.querySelector<SVGGElement>(`[data-node="${n.id}"]`)?.focus();
    };
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') move(i + 1);
    else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') move(i - 1);
    else if (ev.key === 'Home') move(0);
    else if (ev.key === 'End') move(nodes.length - 1);
    else if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      select(nodes[i].id);
    } else if (ev.key === 'Escape') select(null);
  };
  const tabStop = selected?.id ?? nodes[0]?.id;

  return (
    <div className="page map-page">
      <PageHead kicker="Architect" title="Map of links">
        <p className="lede">
          Every entry on one ring, grouped by type, with a line for each link between two entries. Choose an entry to
          see what it holds up and what holds it up.
        </p>
      </PageHead>

      <div className="map-layout">
        <figure className="map-figure">
          <svg
            ref={svg}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="group"
            aria-label={`Graph of ${entries.length} entries and ${edges.length} links. Use the arrow keys to move between entries and Enter to choose one.`}
            className={selected ? 'has-selection' : undefined}
          >
            <g className="edges" aria-hidden="true">
              {edges.map((e) => {
                const p = pos.get(e.a)!;
                const q = pos.get(e.b)!;
                const on = selected && (e.a === selected.id || e.b === selected.id);
                return (
                  <path
                    key={`${e.a}|${e.b}`}
                    className={on ? 'edge on' : 'edge'}
                    d={`M${p.x.toFixed(1)},${p.y.toFixed(1)} Q${C},${C} ${q.x.toFixed(1)},${q.y.toFixed(1)}`}
                  />
                );
              })}
            </g>
            <g className="arcs" aria-hidden="true">
              {arcs.map((arc) => {
                const mid = (arc.from + arc.to) / 2;
                const large = arc.to - arc.from > Math.PI ? 1 : 0;
                const [lx, ly] = pt(mid, R + 62).split(',').map(Number);
                return (
                  <g key={arc.code}>
                    <path className="arc" d={`M${pt(arc.from, R + 24)} A${R + 24},${R + 24} 0 ${large} 1 ${pt(arc.to, R + 24)}`} />
                    <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="arc-label">
                      {arc.code}
                    </text>
                  </g>
                );
              })}
            </g>
            <g className="nodes">
              {nodes.map((n, i) => {
                const e = entryById.get(n.id)!;
                const isSel = selected?.id === n.id;
                const cls = ['node', isSel && 'selected', near.has(n.id) && 'near', e.status === 'open' && 'open']
                  .filter(Boolean)
                  .join(' ');
                return (
                  <g
                    key={n.id}
                    data-node={n.id}
                    className={cls}
                    role="button"
                    tabIndex={n.id === tabStop ? 0 : -1}
                    aria-pressed={isSel}
                    aria-label={`${e.id} ${e.title}${e.status === 'open' ? ', open mystery' : ''}. Links to ${e.links.length}, linked from ${e.linkedFrom.length}.`}
                    onClick={() => select(isSel ? null : n.id)}
                    onKeyDown={(ev) => onKey(ev, i)}
                  >
                    <title>{`${e.id} ${e.title}`}</title>
                    <circle className="hit" cx={n.x} cy={n.y} r={15} />
                    <circle className="dot" cx={n.x} cy={n.y} r={isSel ? 10 : 7} />
                  </g>
                );
              })}
            </g>
            {selected && (
              <text x={C} y={C} textAnchor="middle" className="center-label" aria-hidden="true">
                <tspan x={C} dy="-0.4em" className="center-id">
                  {selected.id}
                </tspan>
                <tspan x={C} dy="1.5em">
                  {selected.title.length > 34 ? `${selected.title.slice(0, 32)}…` : selected.title}
                </tspan>
              </text>
            )}
          </svg>
          <figcaption>
            <span className="key"><span className="swatch dot-plain" /> entry</span>
            <span className="key"><span className="swatch dot-open" /> open mystery</span>
            <span className="key"><span className="swatch dot-near" /> linked to the chosen entry</span>
          </figcaption>
        </figure>

        <section className="map-panel voice architect" aria-live="polite" aria-label="Chosen entry">
          <p className="voice-tag">Architect</p>
          {selected ? (
            <>
              <h2 className="voice-heading">
                <span className="eid">{selected.id}</span> {selected.title} {selected.status === 'open' && <Mark kind="open" />}
              </h2>
              <p className="muted">
                {selected.subsection ?? selected.section} · {selected.plausibility}
              </p>
              <p>
                <Link className="button" to={`/entries/${selected.id}`}>
                  Open entry
                </Link>{' '}
                <button type="button" className="link-button" onClick={() => select(null)}>
                  Clear
                </button>
              </p>
              <h3>Links to ({selected.links.length})</h3>
              <ul className="entry-list">
                {selected.links.map((l) => (
                  <li key={l}>
                    <button type="button" className="node-button" onClick={() => select(l)}>
                      <span className="eid">{l}</span> {entryById.get(l)?.title}
                    </button>
                  </li>
                ))}
              </ul>
              <h3>Linked from ({selected.linkedFrom.length})</h3>
              <ul className="entry-list">
                {selected.linkedFrom.map((l) => (
                  <li key={l}>
                    <button type="button" className="node-button" onClick={() => select(l)}>
                      <span className="eid">{l}</span> {entryById.get(l)?.title}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h2 className="voice-heading">No entry chosen</h2>
              <p>Pick a point on the ring, or a name from the list below.</p>
              <p className="muted">
                {entries.length} entries, {edges.length} linked pairs.
              </p>
            </>
          )}
        </section>
      </div>

      <section className="map-index" aria-labelledby="types-h">
        <h2 id="types-h">Entries by type</h2>
        <div className="type-grid">
          {meta.types.map((t) => (
            <div key={t.code} className="type-group">
              <h3>
                <span className="eid">{t.code}</span> <span className="muted">{t.sections.join(', ')} · {t.count}</span>
              </h3>
              <ul>
                {entries
                  .filter((e) => e.type === t.code)
                  .map((e) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        className={`node-button${selected?.id === e.id ? ' selected' : ''}${near.has(e.id) ? ' near' : ''}`}
                        aria-pressed={selected?.id === e.id}
                        onClick={() => {
                          select(e.id);
                          svg.current?.scrollIntoView({ block: 'nearest' });
                        }}
                      >
                        {e.title} <span className="muted link-count">{e.links.length + e.linkedFrom.length}</span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="muted">The number beside each entry counts its links out and in.</p>
      </section>
    </div>
  );
}
