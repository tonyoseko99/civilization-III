import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mark, PageHead } from '../components/voice';
import { entries, entryById, meta } from '../data';

export function EntriesPage() {
  const [q, setQ] = useState('');
  const needle = q.trim().toLowerCase();
  const hits = useMemo(() => {
    if (!needle) return null;
    return new Set(
      entries
        .filter((e) =>
          [e.id, e.title, e.summary, e.rules_and_limits, e.consequences, e.story_conflict, e.nearest_precedent]
            .join('\n')
            .toLowerCase()
            .includes(needle),
        )
        .map((e) => e.id),
    );
  }, [needle]);
  const shown = hits ? hits.size : entries.length;

  return (
    <div className="page">
      <PageHead kicker="Architect" title="Entries">
        <p className="lede">
          {meta.entryCount} canon entries, in the order and sections of the Canon tab.
        </p>
      </PageHead>
      <div className="filter">
        <label htmlFor="q">Find in entries</label>
        <input id="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="a word, a name, an id" autoComplete="off" />
        <p role="status" className="muted">
          {needle ? `${shown} of ${entries.length} entries match` : `${entries.length} entries`}
        </p>
      </div>
      {needle && shown === 0 && <p className="empty">No entry contains “{q.trim()}”. Canon may simply not say.</p>}
      {meta.sections.map((sec) => {
        const ids = sec.entries.filter((id) => !hits || hits.has(id));
        if (!ids.length) return null;
        const H = sec.parent ? 'h3' : 'h2';
        return (
          <section key={sec.heading} className="entry-section">
            <H>{sec.heading}</H>
            {!needle && sec.intro.map((p) => <p key={p} className="section-intro">{p}</p>)}
            <ul className="entry-rows">
              {ids.map((id) => {
                const e = entryById.get(id)!;
                return (
                  <li key={id}>
                    <Link to={`/entries/${id}`}>
                      <span className="eid">{e.id}</span>
                      <span className="etitle">{e.title}</span>
                    </Link>
                    <span className="row-meta">
                      {e.status === 'open' && <Mark kind="open" />}
                      <span className="plaus">{e.plausibility}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
