# Build log

One dated line per build decision, each with its weakest call. Newest phase last.
Canon problems are not fixed here; they are listed at the end for the next dive run.

## Phases

| Date | Phase | Result |
| --- | --- | --- |
| 2026-11-16 | 1. Snapshot and importer | Done. 58 entries import, validation passes, count matches the Canon tab's stated 58. Snapshot: Canon tab rev 37, Scenes tab rev 4 |
| 2026-11-16 | 2. Entries and links | Done. Every entry has a page with all ten fields; 343 links resolve out and back. An end-to-end test opens all 58 |
| 2026-11-16 | 3. Scenes | Done. Dives 8, 9, 10 read on a phone with names linked. Arrival and dives 1 to 7 are listed as missing; nothing is written in their place |
| 2026-11-16 | 4. Tally and map | Done. Front page and graph render from `data/` alone. No canon text, id or number appears in `src/` |
| 2026-11-16 | 5. Polish and review | Done. axe passes on ten page kinds, light and dark, desktop and phone; keyboard paths tested. Stopped for author review |

## Decisions

| Date | Decision | Weakest call |
| --- | --- | --- |
| 2026-11-16 | Snapshot taken by Markdown export of the Canon and Scenes tabs through the docs connector. Canon came back as a file. Scenes came back inline, so it was written out from the export's encoded bytes and then checked: exact byte length (13,253) and a word-for-word match against a second, independent PDF export | The Scenes file passed through the session once. The two checks would catch any changed word, but not a changed blank line |
| 2026-11-16 | Removed the byline line from `canon/source.md` because it carries the author's name. Nothing else in the snapshot differs from the export | It is the one place the snapshot is not verbatim. A refresh must repeat it; the README says so |
| 2026-11-16 | Entry blocks are parsed line by line against the ten known field names, not with a YAML parser | Canon's blocks are not valid YAML (values contain ": " and "["). A future entry that wraps a value onto an unindented line will fail the import, loudly |
| 2026-11-16 | The importer throws on the brief's four conditions (missing field, duplicate id, dangling link, count mismatch) plus empty fields, unknown fields, malformed ids and self-links. Everything else is a warning | Treating an empty field as fatal goes one step past the brief |
| 2026-11-16 | `data/` is generated and git-ignored; `dev`, `build` and `test` re-run the importer | A reviewer cannot see a canon change as a data diff in a pull request, only as a snapshot diff |
| 2026-11-16 | Added `meta.json` and `tally.json` beside the three files the brief names | Two more files than the brief lists |
| 2026-11-16 | All pointers into canon live in `hold.config.json`: tally figures are read from entry text by pattern (304 from HIST-0004, nine from ORG-0001, the three rails by splitting one sentence of POL-0001) | A reworded entry can stop a pattern matching. The item is then dropped with a warning; the page does not show a stale number |
| 2026-11-16 | Hash routing and a relative base, so the built site runs from any static host or folder | URLs carry a `#`. Changing later breaks shared links |
| 2026-11-16 | Scene order comes from the Decision log, oldest first. "Phase 1A" is treated as the Arrival scene | The Arrival mapping is a config rule based on the log's own wording ("Arrival scene") |
| 2026-11-16 | In Narrator text, the first mention of each person, place or term in a scene is linked, not every mention. Architect sections link explicit ids only | The brief says every name links. Linking each once keeps the prose readable; every named thing is still reachable from the scene and listed under it |
| 2026-11-16 | Term links come from entry titles and Cast names automatically, plus 23 aliases in `hold.config.json` for words the Narrator uses that are not titles (throat, ledger, strips, bowl, key, the Before, and so on) | **The weakest call in the build.** Each alias is a judgement about what a word refers to. "throat" points at TECH-0001 on the strength of the Run book's style note; "the Before" points at MYST-0003. A wrong alias is a quiet reinterpretation of canon. "cold house" was left unlinked for that reason |
| 2026-11-16 | People without a CHAR entry link to their row on the Cast page, not to an invented entry | Twelve of fifteen characters have no entry page |
| 2026-11-16 | Unverifiable passages are found by seven patterns in config (for example "cannot be checked", "Pell read") and marked with a dagger in scenes and a label on entry fields. The note quotes HIST-0005 | Pattern matching will miss a rephrased uncertainty and can over-mark; "Pell read it twice" is marked though the sentence itself asserts nothing |
| 2026-11-16 | Known in-world errors are shown on the tally and on every entry the table's Truth column cites or whose title appears under "Held by" | "Held by" is matched by title text, so "most of the region" marks nothing |
| 2026-11-16 | The map is a fixed ring: entries in canon order, one arc per type, a curve per linked pair. No physics simulation | A ring shows who links to whom but not clusters. On a phone the points are small, so the same choices are offered as a list underneath |
| 2026-11-16 | The three rails are shown as three equal boxes in canon's own order and words, with PREM-0004's rule quoted beneath | Canon's order (release, hold, third) is still an order |
| 2026-11-16 | The front page opens with the first two paragraphs of the earliest recorded scene | When an earlier scene is recorded, the front page will change by itself |
| 2026-11-16 | Visual identity: lichen-tinted neutrals, one ember accent, a row of comb cuts under the header. Newsreader is reserved for the Narrator; IBM Plex Sans carries everything else. Fonts are bundled | Taste. About 140 KB of fonts |
| 2026-11-16 | Light and dark follow the device, with a toggle whose choice is kept in `localStorage` | That is the one thing stored on the reader's device |
| 2026-11-16 | Accessibility is checked by axe in the test suite, plus keyboard tests for the skip link and the map | Automated checks find roughly a third of real problems. No screen-reader pass was done by a person |

## Canon notes for the next dive run

Nothing below was changed in the snapshot.

1. **Scenes missing from the doc.** The Arrival and dives 1 to 7 are not in the Scenes tab. The app shows eight scenes as missing.
2. **Dive 8 has no Changelog section** in the Scenes tab; dives 9 and 10 do.
3. **Generations in the Unread Houses.** PLACE-0001 says speech strains "after nine generations" in houses that obeyed "nearly 300 years ago". The Cast gives Pell as 190 and second generation, and Imre as about 70 and third generation. Nine generations in 300 years does not sit easily beside a 190-year-old in the second.
4. **"The cold house."** Dive 9's scene uses it for where Ione was raised and sleeps. PLACE-0002 calls the Glossed House "colder and poorer", but no entry gives "cold house" as a name, so the app leaves it unlinked.
5. **"The throat."** Used throughout the scenes and in several entries (POL-0003, POL-0006, ORG-0001), and defined only in the Run book's style note. No entry defines it. The app links it to TECH-0001.
6. **Heading case.** The Decision log has "Dive 8: custody and exchange"; the Scenes tab has "Dive 8: Custody and exchange".
7. **Superseded lines.** Replacement lines for the Arrival are "proposed in chat" and are not in the doc.

## Open decisions for the author

| Decision | Options | Recommendation |
| --- | --- | --- |
| Hosting | Keep local; GitHub Pages; Netlify or Cloudflare Pages | The build is a plain `dist/` folder and needs no server. Any of these works. Nothing is deployed until you say so |
| Public or private | A public site publishes the canon text | Decide before choosing a host |
| Name | "The Hold" is the working name from the brief | Keep it unless you object |
| Version 2 | Asking the Narrator questions needs a model API key and a per-question cost. A static site cannot hold a key, so it also needs a small server or function | Not started. Needs your key, a spending cap, and a hosting choice first |
| Missing scenes | Paste the Arrival and dives 1 to 7 into the Scenes tab, or leave them missing | Canon work, not build work. The app picks them up with no code change |
| Committing `data/` | Generated now; could be committed so canon changes show as diffs | Leave generated |
| Snapshot refresh | Manual export at the start of each build session | Fine while the canon grows one dive a day |
