import { Link } from 'react-router-dom';
import { Mark, PageHead, Rich } from '../components/voice';
import { scenes } from '../data';

export const sceneName = (title: string, label: string) =>
  title.replace(/^[^:]+:\s*/, '').replace(label, '').replace(/^\s*\((.*)\)$/, '$1').trim();

export function ScenesPage() {
  const recorded = scenes.filter((s) => s.recorded).length;
  return (
    <div className="page">
      <PageHead kicker="The way in" title="Scenes">
        <p className="lede">
          {scenes.length} scenes in the order they were written.{' '}
          {recorded === scenes.length
            ? 'All are recorded in the canon doc.'
            : `${recorded} are recorded in the canon doc; ${scenes.length - recorded} are not, and are listed as missing.`}
        </p>
      </PageHead>
      <ol className="scene-list">
        {scenes.map((s) => (
          <li key={s.id} className={s.recorded ? 'recorded' : 'missing'}>
            <Link to={`/scenes/${s.id}`}>
              <span className="scene-label">{s.label}</span>
              <span className="scene-title">{sceneName(s.title, s.label)}</span>
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
