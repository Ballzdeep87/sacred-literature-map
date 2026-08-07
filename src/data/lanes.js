/* ------------------------------------------------------------------ *
 * Lane grouping for the influence web (src/components/InfluenceWeb.jsx).
 * Purely a display grouping — texts are sorted into the major literary
 * tradition they belong to, at the "stay macro" level PROJECT-BRIEF.md.pdf
 * asks for (section 3), not by denomination or school.
 *
 * When adding a new text to src/data/texts.js, add its id here too —
 * anything missing just won't appear in the influence web.
 * ------------------------------------------------------------------ */

export const LANES = [
  { id: "sumerian", label: "Sumerian", color: "#c9a94a" },
  { id: "babylonian", label: "Babylonian & Akkadian", color: "#8a6fb0" },
  { id: "canaanite", label: "Canaanite", color: "#4f9a86" },
  { id: "zoroastrian", label: "Zoroastrian", color: "#c77dc0" },
  { id: "jewish", label: "Israelite & Jewish", color: "#5b8dd9" },
  { id: "christian", label: "Early Christian", color: "#d98b3f" },
];

export const TEXT_LANE = {
  kesh_hymn: "sumerian",
  enheduanna: "sumerian",
  shuruppak: "sumerian",
  descent_of_inanna: "sumerian",
  eridu_genesis: "sumerian",
  atrahasis: "babylonian",
  gilgamesh: "babylonian",
  enuma_elish: "babylonian",
  baal_cycle: "canaanite",
  gathas: "zoroastrian",
  song_deborah: "jewish",
  isaiah: "jewish",
  torah: "jewish",
  enoch: "jewish",
  daniel: "jewish",
  dead_sea_scrolls: "jewish",
  septuagint: "jewish",
  paul: "christian",
  mark: "christian",
  matthew: "christian",
  luke: "christian",
  john: "christian",
  revelation: "christian",
  didache: "christian",
  clement: "christian",
};
