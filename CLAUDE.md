# The Hold — rules for any Claude session in this repo

The Hold is a static web app that displays the canon of Project Civilization III.
The canon of record is the doc at https://claude.ai/artifact/C4GvP7uPuemA1AQ29bPkKf.
Its **Build brief** tab governs this repo. Read it in full before building; this file
restates its section 1 and the working rules that follow from it.

## Authority

The author (Chief) has delegated all build decisions to Claude and keeps a veto.
Do not stop to ask about choices the brief or a sensible default can settle. Ask only
when a step needs something only the author has: an account, a credential, a payment,
or a public release.

## Never

| Never | Why |
| --- | --- |
| Invent, change, or reinterpret canon in code, copy, or data | Canon is made only in the Canon tab, by the dive runs. The app displays it |
| Edit the Canon, Run book, or Scenes tabs from a build session | One writer per tab. Report canon problems in `BUILD_LOG.md` instead |
| Resolve PREM-0004 or answer an open mystery in the interface | No screen may imply one rail is right, or show a mystery as solved |
| Make the 2026 visitor a character | The reader is the visitor: a frame only |
| Use anything known about the author personally | Author's rule |
| Publish, deploy publicly, or spend money without the author | Those are his to approve |

## Working rules

- **Start of every session:** refresh the snapshot in `canon/` from the doc (Markdown
  export of the Canon and Scenes tabs; never retype canon by hand), then run
  `npm run import-canon`. If canon looks inconsistent, do not fix it in the snapshot:
  note it in `BUILD_LOG.md` under "Canon notes for the next dive run".
- **No canon in components.** `src/` reads only the JSON in `data/`. Pointers into canon
  (which entry feeds which front-page figure, which words link where) live in
  `hold.config.json`. The app must need no code change when entries, characters, or
  scenes are added.
- **Two voices, never blended.** Narrator text and Architect text use different
  components (`Narrator`, `Architect`) and never share a block. Prefer quoting canon to
  writing new in-world copy. Interface copy is Architect voice: plain and analytical.
- **Respect the scale.** No profiles, feeds, currencies, or ratings for people or rails.
- **Show uncertainty.** Open mysteries, unverifiable readings, and known in-world errors
  stay marked wherever they appear.
- **Log decisions.** One dated line per decision in `BUILD_LOG.md`, with its weakest call.
- Version 2 (asking the Narrator questions) needs a model API key and a cost decision
  from the author. Do not start it without him.

## Commands

```bash
npm run import-canon   # canon/ -> data/, fails loudly on a bad snapshot
npm run dev            # local preview
npm test               # importer and link-resolution unit tests
npm run e2e            # builds, then opens every entry page in a browser
```
