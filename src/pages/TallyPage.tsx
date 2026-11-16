import { Link } from 'react-router-dom';
import { Architect, Blocks, EntryLink, Mark, Narrator, Rich } from '../components/voice';
import { cast, decisions, entries, isOpen, meta, scenes, tally } from '../data';

export function TallyPage() {
  const open = entries.filter(isOpen);
  const firstScene = scenes.find((s) => s.recorded);
  const opening = firstScene?.sections.find((s) => s.voice === 'narrator');
  const errors = decisions.knownErrors;
  const [lead, ...rest] = tally.figures;

  return (
    <div className="page tally">
      <h1 className="visually-hidden">The Hold: the tally</h1>

      {lead && (
        <section className="count" aria-labelledby="count-h">
          <p className="voice-tag">Architect</p>
          <h2 id="count-h" className="count-figure">
            <span className="num">{lead.value}</span> <span className="unit">{lead.label}</span>
          </h2>
          <p className="count-source">
            <Rich segs={tally.hold?.summary ?? lead.sentence} />
          </p>
          <p className="more">
            <EntryLink id={lead.entry} />
          </p>
        </section>
      )}

      {firstScene && opening && (
        <div className="way-in">
          <Narrator>
            <Blocks blocks={opening.blocks.slice(0, 2)} />
          </Narrator>
          <p className="way-in-link">
            <Link to={`/scenes/${firstScene.id}`} className="button">
              Read on: {firstScene.title}
            </Link>
            <Link to="/scenes">All scenes in order</Link>
          </p>
        </div>
      )}

      {tally.rails && (
        <Architect heading={tally.rails.title}>
          <ol className="rails" aria-label={tally.rails.title}>
            {tally.rails.clauses.map((c, i) => (
              <li key={i}>
                <Rich segs={c} />
              </li>
            ))}
          </ol>
          <p>
            <Rich segs={tally.rails.rest} />
          </p>
          {tally.unresolved && (
            <p className="rule-note">
              <Rich segs={tally.unresolved.text} /> <EntryLink id={tally.unresolved.entry} />
            </p>
          )}
          <p className="more">
            <EntryLink id={tally.rails.entry} />
          </p>
        </Architect>
      )}

      {rest.map((f) => (
        <Architect key={f.key} heading={<><span className="word-figure">{f.value}</span> {f.label}</>}>
          <p>
            <Rich segs={f.sentence} />
          </p>
          <p className="more">
            <EntryLink id={f.entry} />
          </p>
        </Architect>
      ))}

      <Architect heading="The Cast">
        {cast.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <ul className="cast-compact">
          {cast.rows.map((r) => (
            <li key={r.slug}>
              <Link to={`/cast/${r.slug}`}>{r.name}</Link>
              <span className="muted">
                <Rich segs={r.rail} />
              </span>
            </li>
          ))}
        </ul>
        {cast.after.map((p) => (
          <p key={p} className="muted">
            {p}
          </p>
        ))}
      </Architect>

      <Architect heading={`Open mysteries (${open.length})`}>
        {meta.sections
          .filter((s) => s.entries.some((id) => open.some((e) => e.id === id)))
          .flatMap((s) => s.intro)
          .map((p) => (
            <p key={p}>{p}</p>
          ))}
        <ul className="mysteries">
          {open.map((e) => (
            <li key={e.id}>
              <Link to={`/entries/${e.id}`}>
                <span className="eid">{e.id}</span>
                <span className="etitle">{e.title}</span>
              </Link>
              <Mark kind="open" />
            </li>
          ))}
        </ul>
      </Architect>

      {errors.rows.length > 0 && (
        <Architect heading={errors.heading}>
          {errors.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <ul className="errors">
            {errors.rows.map((r) => (
              <li key={r.belief}>
                <p>
                  <Mark kind="error" /> <span className="belief">{r.belief}</span>
                </p>
                <p className="muted">
                  {errors.columns[1]}: {r.heldBy}
                </p>
                <p>
                  {errors.columns[2]}: <Rich segs={r.truth} />
                </p>
              </li>
            ))}
          </ul>
        </Architect>
      )}

      <nav className="doors" aria-label="Explore">
        <Link to="/entries">
          <strong>Entries</strong>
          <span>{meta.entryCount} in {meta.types.length} types</span>
        </Link>
        <Link to="/map">
          <strong>Map of links</strong>
          <span>{entries.reduce((n, e) => n + e.links.length, 0)} links</span>
        </Link>
        <Link to="/log">
          <strong>Decision log</strong>
          <span>{decisions.rows.length} stages</span>
        </Link>
      </nav>
    </div>
  );
}
