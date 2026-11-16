import { Link } from 'react-router-dom';
import { PageHead } from '../components/voice';

export function NotFound({ what = 'page' }: { what?: string }) {
  return (
    <div className="page">
      <PageHead kicker="Architect" title={`No such ${what}`}>
        <p className="lede">Nothing in this snapshot of canon has that address.</p>
      </PageHead>
      <p>
        <Link to="/">Back to the tally</Link> · <Link to="/entries">All entries</Link> · <Link to="/scenes">All scenes</Link>
      </p>
    </div>
  );
}
