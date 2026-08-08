# A Living Map of Sacred Literature

A free, open-access, interactive timeline and schematic map showing how the world's
religious literature developed — from the Kesh Temple Hymn and Pyramid Texts
(c. 2600 BCE) to medieval scripture on four continents, all on one connected
(and honestly disconnected, where that's the truth) timeline.

**[View it live →](https://ballzdeep87.github.io/sacred-literature-map/)**

The project's guiding rules — what counts as evidence, how disputed dates are shown,
what stays in or out of scope — live in **[PROJECT-BRIEF.md.pdf](./PROJECT-BRIEF.md.pdf)**.
That file is the cornerstone: when in doubt, it wins.

## What's here

- A **globe map**, projected from real latitude/longitude (not a modern political map),
  with an Old World / Americas focus switch, scroll-to-zoom and drag-to-pan for crowded
  clusters, and soft "presence" glows for each people/empire that fade in and out over time
- A **timeline** you can scrub or play through, non-linear so the ancient world (where
  most of the content sits) gets the most room, with culture bands and text markers
- A dedicated **influence web** showing every text's scholarly influences at once,
  grouped by literary tradition, styled by how solid each connection is
  (documented / probable / debated)
- A **search box** to jump straight to any text by title
- 47 texts spanning Sumerian, Egyptian, Babylonian, Canaanite, Zoroastrian, Israelite/Jewish,
  early Christian, Vedic/Hindu, Chinese, Buddhist, Islamic, Manichaean, Norse, Mesoamerican,
  and West African traditions — each tagged with a confidence tier (well-established /
  probable / debated / speculative), a claim type, real sources, and — where relevant —
  notes on the influences flowing into it

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
  data/        the content — texts, cities, cultures, tradition (lane) groupings, geography
  components/  GlobeMap, InfluenceWeb, InfoPanel, SearchBox
  App.jsx      the main map + timeline + transport controls
  geo.js       projection math (d3-geo, used for math only — no basemap library)
  timeScale.js the non-linear timeline scale
  styles.js    all visual styling
```

`src/data/texts.js` is the file to edit to add, correct, or expand entries.

## Roadmap

- ✅ Phase 1 — map + timeline preview
- ✅ Phase 2 — core texts with real sources and four-tier tagging
- ✅ Phase 3 — gentle animation of peoples and cities over time
- ✅ Phase 4 — dedicated influence view, styled by claim type
- ✅ Phase 5 — published, open-access, on GitHub Pages
- ✅ Phase 6 — pivot to world religious literature across all eras; Far East texts added
- ✅ Phase 7 — connected-tradition extensions (Mishnah, Talmud, Sahih al-Bukhari, Nicene
  Creed, Manichaean Scriptures) and isolated traditions with no historical contact
  (Norse, Mesoamerican, West African)
- ✅ Phase 8 — zoomable/pannable globe, dual Old World / Americas focus
- ✅ Phase 9 — search: jump to any text by title

## License

Free and open — see the project brief for the values behind it (educate, don't
persuade; show uncertainty honestly; cite real sources).
