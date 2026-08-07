# A Living Map of Sacred Literature

A free, open-access, interactive timeline and schematic map showing how religious
literature developed, from the Kesh Temple Hymn (c. 2600 BCE) through early
Christianity (c. 150 CE).

The project's guiding rules — what counts as evidence, how disputed dates are shown,
what stays in or out of scope — live in **[PROJECT-BRIEF.md.pdf](./PROJECT-BRIEF.md.pdf)**.
That file is the cornerstone: when in doubt, it wins.

## What's here

- An interactive **map** of the ancient Near East with cities, rivers, and soft
  "presence" glows for each people/empire that fade in and out over time
- A **timeline** you can scrub or play through, with culture bands and text markers
- A dedicated **influence web** showing every text's scholarly influences at once,
  grouped by literary tradition, styled by how solid each connection is
- 25 texts, each tagged with a confidence tier (well-established / probable /
  debated / speculative), a claim type, sources, and — where relevant — notes on
  the influences flowing into it

Built by directing an AI in plain English ("vibe-coding"), plain JavaScript + React
+ Vite, no TypeScript.

## Running it locally

```bash
npm install
npm run dev
```

Then open the local address it prints (usually `http://localhost:5173`).

## Project structure

```
src/
  data/        the content — texts, cities, cultures, tradition groupings
  components/  the info panel and influence-web view
  App.jsx      the main map + timeline
  styles.js    all visual styling
```

`src/data/texts.js` is the file to edit to add, correct, or expand entries.

## Roadmap

- ✅ Phase 1 — map + timeline preview
- ✅ Phase 2 — 25 core texts with real sources and four-tier tagging
- ✅ Phase 3 — gentle animation of peoples and cities over time
- ✅ Phase 4 — dedicated influence view, styled by claim type
- ✅ Phase 5 — published, open-access, on GitHub Pages

## License

Free and open — see the project brief for the values behind it (educate, don't
persuade; show uncertainty honestly; cite real sources).
