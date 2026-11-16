import { Link } from 'react-router-dom';
import { Architect, Mark, PageHead, Rich } from '../components/voice';
import { scenes, scenesIntro } from '../data';

export function ScenesPage() {
  const recorded = scenes.filter((s) => s.recorded).length;
  return (
    <div className="page">
      <PageHead kicker="The way in" title="Scenes">
        <p className="lede">
          {scenes.length} scenes in the order they were written. {recorded} are recorded in the canon doc;{' '}
          {scenes.length - recorded} are not, and are listed as missing.
        </p>
      </PageHead>
      <Architect heading="From the Scenes tab" level={2}>
        {scenesIntro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </Architect>
      <ol className="scene-list">
        {scenes.map((s) => (
          <li key={s.id} className={s.recorded ? 'recorded' : 'missing'}>
            <Link to={`/scenes/${s.id}`}>
              <span className="scene-label">{s.label}</span>
              <span className="scene-title">{s.recorded ? s.title.replace(/^[^:]+:\s*/, '') : s.title.replace(/^[^:]+:\s*/, '')}</span>
            </Link>
            {!s.recorded && <Mark kind="missing" />}
            {s.superseded.length > 0 && <Mark kind="superseded">{s.superseded.length} superseded</Mark>}
            {s.stage && !s.recorded && (
              <p className="muted scene-stage">
                <Rich segs={s.stage.changed} />
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
