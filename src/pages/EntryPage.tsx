import { Link, useParams } from 'react-router-dom';
import { EntryLink, Mark, PageHead, Rich } from '../components/voice';
import { decisions, entries, entryById, fieldLabel, meta, sceneById } from '../data';
import { NotFound } from './NotFound';

const PROSE = ['summary', 'rules_and_limits', 'consequences', 'story_conflict', 'nearest_precedent'] as const;

export function EntryPage() {
  const { id = '' } = useParams();
  const e = entryById.get(id);
  if (!e) return <NotFound what="entry" />;
  const prev = entries[e.order - 1];
  const next = entries[e.order + 1];
  const open = e.status === 'open';
  const errors = e.knownErrors.map((i) => decisions.knownErrors.rows[i]).filter(Boolean);

  return (
    <article className="page entry" data-entry={e.id}>
      <PageHead
        kicker={
          <>
            <Link to="/entries">Entries</Link> · {e.section}
            {e.subsection && ` · ${e.subsection}`}
          </>
        }
        title={e.title}
      >
        <p className="entry-id">
          <span className="eid">{e.id}</span>
          {open && <Mark kind="open" />}
        </p>
      </PageHead>

      {open && (
        <p className="notice notice-open">
          <Mark kind="open" /> This is an open mystery. Canon does not answer it, and nothing on this page should be
          read as an answer.
        </p>
      )}

      {errors.map((k) => (
        <div className="notice notice-error" key={k.belief}>
          <p>
            <Mark kind="error" /> <strong>{decisions.knownErrors.heading}.</strong> {decisions.knownErrors.columns[0]}:{' '}
            {k.belief}. {decisions.knownErrors.columns[1]}: {k.heldBy}.
          </p>
          <p>
            {decisions.knownErrors.columns[2]}: <Rich segs={k.truth} />
          </p>
        </div>
      ))}

      <section className="voice architect entry-fields" aria-label="Canon entry">
        <p className="voice-tag">Architect · canon entry</p>
        <dl>
          <div className="field short">
            <dt>id</dt>
            <dd className="eid">{e.id}</dd>
          </div>
          <div className="field short">
            <dt>title</dt>
            <dd>{e.title}</dd>
          </div>
          <div className="field short">
            <dt>status</dt>
            <dd>{open ? <Mark kind="open" /> : e.status}</dd>
          </div>
          <div className="field short">
            <dt>plausibility</dt>
            <dd>{e.plausibility}</dd>
          </div>
          {PROSE.map((f) => (
            <div className="field" key={f}>
              <dt>
                {fieldLabel(f)}
                {e.unverifiable.includes(f) && <Mark kind="unverifiable">rests on an unverifiable reading</Mark>}
              </dt>
              <dd>
                <Rich segs={e.rich[f]} />
              </dd>
            </div>
          ))}
          <div className="field">
            <dt>links</dt>
            <dd>
              {e.links.length ? (
                <ul className="entry-list" data-testid="links-out">
                  {e.links.map((l) => (
                    <li key={l}>
                      <EntryLink id={l} />
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="muted">none</span>
              )}
            </dd>
          </div>
        </dl>
      </section>

      {e.unverifiable.length > 0 && meta.uncertaintySource && (
        <p className="notice">
          <Mark kind="unverifiable" /> Parts of this entry report a reading no one in-world can check. “
          {meta.uncertaintySource.text}” <EntryLink id={meta.uncertaintySource.entry} showTitle={false} />
        </p>
      )}

      <section className="voice architect" aria-labelledby="in-h">
        <p className="voice-tag">Architect · navigation</p>
        <h2 id="in-h" className="voice-heading">
          Linked from ({e.linkedFrom.length})
        </h2>
        {e.linkedFrom.length ? (
          <ul className="entry-list" data-testid="links-in">
            {e.linkedFrom.map((l) => (
              <li key={l}>
                <EntryLink id={l} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No other entry links here yet.</p>
        )}
        {e.scenes.length > 0 && (
          <>
            <h2 className="voice-heading">Named in scenes</h2>
            <ul className="chips">
              {e.scenes.map((s) => (
                <li key={s}>
                  <Link to={`/scenes/${s}`}>{sceneById.get(s)?.title ?? s}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="more">
          <Link to={`/map?focus=${e.id}`}>See {e.id} on the map of links</Link>
        </p>
      </section>

      <nav className="pager" aria-label="Entries in canon order">
        {prev ? (
          <Link to={`/entries/${prev.id}`} rel="prev">
            <span className="muted">Previous · {prev.id}</span>
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/entries/${next.id}`} rel="next">
            <span className="muted">Next · {next.id}</span>
            {next.title}
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
