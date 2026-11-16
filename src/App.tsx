import { useEffect, useRef, useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { meta } from './data';
import { CastPage } from './pages/CastPage';
import { EntriesPage } from './pages/EntriesPage';
import { EntryPage } from './pages/EntryPage';
import { LogPage } from './pages/LogPage';
import { MapPage } from './pages/MapPage';
import { NotFound } from './pages/NotFound';
import { ScenePage } from './pages/ScenePage';
import { ScenesPage } from './pages/ScenesPage';
import { TallyPage } from './pages/TallyPage';

const NAV = [
  { to: '/', label: 'Tally', end: true },
  { to: '/scenes', label: 'Scenes' },
  { to: '/entries', label: 'Entries' },
  { to: '/map', label: 'Map' },
  { to: '/cast', label: 'Cast' },
  { to: '/log', label: 'Log' },
];

type Theme = 'light' | 'dark';

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const flip = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('hold-theme', next);
    } catch {
      /* the choice just won't be remembered */
    }
    setTheme(next);
  };
  return (
    <button type="button" className="theme-toggle" onClick={flip} aria-pressed={theme === 'dark'}>
      <span aria-hidden="true">{theme === 'dark' ? '◐' : '◑'}</span>
      <span>Dark</span>
    </button>
  );
}

export function App() {
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); main.current?.focus(); }}>
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-header-inner">
          <NavLink to="/" className="wordmark" end>
            The Hold
          </NavLink>
          <nav aria-label="Sections">
            <ul>
              {NAV.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} end={n.end}>
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
        <div className="comb" aria-hidden="true" />
      </header>
      <main id="main" ref={main} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<TallyPage />} />
          <Route path="/scenes" element={<ScenesPage />} />
          <Route path="/scenes/:id" element={<ScenePage />} />
          <Route path="/entries" element={<EntriesPage />} />
          <Route path="/entries/:id" element={<EntryPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/cast" element={<CastPage />} />
          <Route path="/cast/:slug" element={<CastPage />} />
          <Route path="/log" element={<LogPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <p>
          {meta.title}. {meta.entryCount} entries in this snapshot. This site displays canon and changes none of it.
          No account, no tracking, no requests to anyone else.
        </p>
      </footer>
    </>
  );
}
