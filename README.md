# The Hold

A static web app for reading and exploring the universe of Project Civilization III.
The reader arrives as the visitor from 2026 and explores the Narrator's region.

The app **displays** canon. It never makes or changes it. Canon lives in the doc of record,
<https://claude.ai/artifact/C4GvP7uPuemA1AQ29bPkKf>, and is written only by the dive runs.
The doc's Build brief tab governs this repo; `CLAUDE.md` restates its hard limits.

## Run it

Needs Node 20 or newer.

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:5173>. `dev`, `build` and `test` each re-run the importer first.

| Command | What it does |
| --- | --- |
| `npm run import-canon` | Parses `canon/` into `data/`. Exits non-zero on a bad snapshot |
| `npm run dev` | Local preview with reload |
| `npm run build` | Type-checks and builds the static site into `dist/` |
| `npm run preview` | Serves `dist/` at <http://localhost:4173> |
| `npm test` | Unit tests: importer, validation, link resolution |
| `npm run e2e` | Builds, then opens every entry page and scene in a browser, with an accessibility pass in light and dark at desktop and phone sizes |
| `npm run check` | Both test suites |

## What is in it

| Surface | Route | Built from |
| --- | --- | --- |
| The tally | `#/` | `tally.json`, `cast.json`, open entries, `decisions.json` |
| Scenes | `#/scenes`, `#/scenes/:id` | `scenes.json` |
| Entries | `#/entries`, `#/entries/:id` | one JSON file per entry |
| Map of links | `#/map` | entry links |
| Cast | `#/cast` | `cast.json` |
| Decision log | `#/log` | `decisions.json`, `meta.json` |

## How canon gets in

```
canon doc ──export──▶ canon/source.md   (Canon tab)
                      canon/scenes.md   (Scenes tab)
                           │
                 scripts/import-canon   ◀── hold.config.json (pointers, not canon)
                           │
                         data/          entries/<ID>.json, cast.json, scenes.json,
                           │            decisions.json, meta.json, tally.json
                         src/           reads data/ and nothing else
```

- `canon/` is a verbatim Markdown export of two tabs. Never edit it by hand and never retype
  canon. To refresh it, export the Canon and Scenes tabs as Markdown and replace the files
  (drop the byline line under the Canon title; it carries a personal name). Record the tab
  revisions and the method in `canon/SNAPSHOT.json`.
- If a tab's Markdown export cannot be saved as a file (for example, it comes back inline),
  export the same tab as HTML and convert it to Markdown mechanically, with a script. Then
  check that the result has exactly the byte length of the Markdown export. Note the method
  in `canon/SNAPSHOT.json`.
- `data/` is generated and not committed.
- The importer **fails loudly** if an entry lacks one of the ten fields, an id is duplicated,
  a link points to an id that does not exist, or the entry count differs from the count the
  Canon tab states. All problems are reported in one run.
- `hold.config.json` holds everything that points into canon: which entry and pattern feed
  each front-page figure, which Decision log stages are scenes, which of the Narrator's words
  link to which entry, and which phrases mark a passage as unverifiable. A pointer that stops
  resolving is a warning, and that item is left off the page.
- New entries, entry types, characters and scenes need no code change. Recorded scenes are
  ordered by the Decision log; a stage with no recorded scene is shown as missing and its
  text is never supplied from anywhere else.

## Design rules the code enforces

- **Two voices.** Narrator text is rendered only by the `Narrator` component (serif, warm
  ground, ember rule). Everything else is the Architect (sans, bordered card). They never
  share a block; an end-to-end test checks that.
- **Uncertainty stays visible.** Open mysteries carry an `open` mark everywhere they are
  listed. Passages that rest on an unverifiable reading carry a dagger and a note. Known
  in-world errors are flagged on the entries they touch. Marks differ by word and border
  shape, not colour alone.
- **No canon in components.** Components contain interface copy only.
- **No account, no tracking, no third-party requests.** Fonts are bundled. The only thing
  stored in the browser is the light or dark choice.

## Layout

```
canon/               snapshot of the doc (source of truth for the build)
scripts/import-canon.ts, scripts/lib/   parser, validator, linker, builder
hold.config.json     pointers into canon and linking rules
src/                 React app (Vite, TypeScript, hash routing)
tests/               unit tests (Vitest)
e2e/                 browser tests (Playwright, axe)
BUILD_LOG.md         one dated line per build decision, with its weakest call
.github/workflows/pages.yml   GitHub Pages deploy on push to main
```

## Hosting

Public hosting was approved by the author on 2026-11-16. `.github/workflows/pages.yml`
runs the unit tests, builds the site and deploys `dist/` to GitHub Pages on every push to
`main` (or when started by hand). The site uses a relative base and hash routing, so it
needs no base-path setting.

The site is not deployed yet. Two steps only the repo owner can take:

1. Create or choose `main` as the default branch, and merge this branch into it.
2. In the repository's Settings → Pages, set Source to "GitHub Actions".

GitHub Pages on a private repository needs a paid plan. A public site publishes the canon
text. The public name and version 2 (asking the Narrator questions) are still the author's
decisions; see the end of `BUILD_LOG.md`.
