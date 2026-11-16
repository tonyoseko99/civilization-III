import { Link } from 'react-router-dom';
import { Architect, Mark, PageHead, Rich } from '../components/voice';
import { decisions, meta } from '../data';

export function LogPage() {
  const snap = meta.snapshot as { taken?: string; doc?: string } | null;
  return (
    <div className="page">
      <PageHead kicker="Architect" title="Decision log">
        {decisions.intro.map((p) => (
          <p key={p} className="lede">
            {p}
          </p>
        ))}
      </PageHead>

      <ol className="log" reversed>
        {decisions.rows.map((r, i) => (
          <li key={i}>
            <h2>{r.scene ? <Link to={`/scenes/${r.scene}`}>{r.stage}</Link> : r.stage}</h2>
            <p>
              <Rich segs={r.changed} />
            </p>
            <p className="muted">
              {decisions.columns[2]}: {r.decidedBy}
            </p>
          </li>
        ))}
      </ol>

      {decisions.superseded.rows.length > 0 && (
        <Architect heading={decisions.superseded.heading}>
          <ul className="plain">
            {decisions.superseded.rows.map((l) => (
              <li key={l.line}>
                <p>
                  <Mark kind="superseded" />{' '}
                  <strong>{l.sceneId ? <Link to={`/scenes/${l.sceneId}`}>{l.scene}</Link> : l.scene}.</strong> {l.line}
                </p>
                <p className="muted">
                  <Rich segs={l.status} />
                </p>
              </li>
            ))}
          </ul>
        </Architect>
      )}

      <Architect heading={meta.how.heading}>
        {meta.how.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <dl className="how">
          {meta.how.rows.map((r, i) => (
            <div key={i}>
              <dt>
                <Rich segs={r[0]} />
              </dt>
              <dd>
                <Rich segs={r[1] ?? []} />
              </dd>
            </div>
          ))}
        </dl>
        {meta.how.after.map((p) => (
          <p key={p} className="muted">
            {p}
          </p>
        ))}
      </Architect>

      {snap?.taken && (
        <p className="muted">
          Snapshot of the canon doc taken {snap.taken}. Canon may have grown since.
        </p>
      )}
    </div>
  );
}
