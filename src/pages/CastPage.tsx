import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EntryLink, PageHead, Rich } from '../components/voice';
import { cast, sceneById } from '../data';

export function CastPage() {
  const { slug } = useParams();
  useEffect(() => {
    if (!slug) return;
    const row = document.getElementById(`cast-${slug}`);
    row?.scrollIntoView({ block: 'center' });
  }, [slug]);
  const [cName, cWho, cRail, cSeen] = cast.columns;

  return (
    <div className="page">
      <PageHead kicker="Architect" title="Cast">
        {cast.intro.map((p) => (
          <p key={p} className="lede">
            {p}
          </p>
        ))}
      </PageHead>
      <table className="cast-table">
        <thead>
          <tr>
            <th scope="col">{cName}</th>
            <th scope="col">{cWho}</th>
            <th scope="col">{cRail}</th>
            <th scope="col">{cSeen}</th>
          </tr>
        </thead>
        <tbody>
          {cast.rows.map((r) => {
            const scene = r.firstSeenScene ? sceneById.get(r.firstSeenScene) : null;
            return (
              <tr key={r.slug} id={`cast-${r.slug}`} className={slug === r.slug ? 'current' : undefined} aria-current={slug === r.slug ? 'true' : undefined}>
                <th scope="row">
                  {r.name}
                  {r.entry && (
                    <span className="cast-entry">
                      <EntryLink id={r.entry} showTitle={false} />
                    </span>
                  )}
                </th>
                <td data-label={cWho}>
                  <Rich segs={r.who} />
                </td>
                <td data-label={cRail}>
                  <Rich segs={r.rail} />
                </td>
                <td data-label={cSeen}>{scene ? <Link to={`/scenes/${scene.id}`}>{r.firstSeen}</Link> : r.firstSeen}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {cast.after.map((p) => (
        <p key={p} className="muted">
          {p}
        </p>
      ))}
    </div>
  );
}
