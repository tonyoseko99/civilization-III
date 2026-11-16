import { Link, useParams } from 'react-router-dom';
import { Architect, Blocks, EntryLink, Mark, Narrator, PageHead, Rich } from '../components/voice';
import { castBySlug, decisions, meta, sceneById, scenes, scenesIntro } from '../data';
import { NotFound } from './NotFound';

export function ScenePage() {
  const { id = '' } = useParams();
  const scene = sceneById.get(id);
  if (!scene) return <NotFound what="scene" />;
  const prev = scenes[scene.order - 1];
  const next = scenes[scene.order + 1];
  const hasUnverifiable = scene.sections.some((s) => s.blocks.some((b) => b.unverifiable?.some(Boolean)));
  const legendId = `legend-${scene.id}`;
  const name = scene.title.replace(/^[^:]+:\s*/, '');

  return (
    <article className="page scene">
      <PageHead kicker={<Link to="/scenes">Scenes</Link>} title={<><span className="scene-label">{scene.label}</span> {name !== scene.label && name}</>}>
        {!scene.recorded && (
          <p>
            <Mark kind="missing" />
          </p>
        )}
      </PageHead>

      {!scene.recorded && (
        <Architect heading="This scene is not in the canon doc">
          <p>
            The text of this scene was never recorded in the Scenes tab, so it is not shown here. Nothing has been
            written in its place.
          </p>
          {scenesIntro.map((p) => (
            <blockquote key={p}>{p}</blockquote>
          ))}
        </Architect>
      )}

      {scene.sections.map((sec, i) =>
        sec.voice === 'narrator' ? (
          <div key={i}>
            <Narrator>
              <Blocks blocks={sec.blocks} legendId={legendId} />
            </Narrator>
            {hasUnverifiable && (
              <Architect label="Architect · reading note" id={legendId}>
                <p>
                  <span className="dagger" aria-hidden="true">†</span> Marked passages rest on something no one
                  in-world can check. They are shown as told, not as established.
                </p>
                {meta.uncertaintySource && (
                  <p className="muted">
                    “{meta.uncertaintySource.text}” <EntryLink id={meta.uncertaintySource.entry} />
                  </p>
                )}
              </Architect>
            )}
          </div>
        ) : (
          <Architect key={i} heading={sec.heading}>
            <Blocks blocks={sec.blocks} />
          </Architect>
        ),
      )}

      {scene.superseded.length > 0 && (
        <Architect heading={decisions.superseded.heading}>
          <ul className="plain">
            {scene.superseded.map((l) => (
              <li key={l.line}>
                <p>
                  <Mark kind="superseded" /> {l.line}
                </p>
                <p className="muted">
                  <Rich segs={l.status} />
                </p>
              </li>
            ))}
          </ul>
        </Architect>
      )}

      {scene.stage && (
        <Architect heading="In the Decision log">
          <p>
            <Rich segs={scene.stage.changed} />
          </p>
          <p className="muted">
            {decisions.columns[2]}: {scene.stage.decidedBy}
          </p>
        </Architect>
      )}

      {(scene.refs.length > 0 || scene.cast.length > 0) && (
        <Architect heading="Named in this scene">
          {scene.cast.length > 0 && (
            <ul className="chips">
              {scene.cast.map((c) => (
                <li key={c}>
                  <Link to={`/cast/${c}`}>{castBySlug.get(c)?.name ?? c}</Link>
                </li>
              ))}
            </ul>
          )}
          <ul className="entry-list">
            {scene.refs.map((r) => (
              <li key={r}>
                <EntryLink id={r} />
              </li>
            ))}
          </ul>
        </Architect>
      )}

      <nav className="pager" aria-label="Scenes">
        {prev ? (
          <Link to={`/scenes/${prev.id}`} rel="prev">
            <span className="muted">Earlier</span>
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/scenes/${next.id}`} rel="next">
            <span className="muted">Later</span>
            {next.title}
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
