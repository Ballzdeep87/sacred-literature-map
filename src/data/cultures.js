/* ------------------------------------------------------------------ *
 * Culture / people bands shown on the timeline.
 * start / end are years (negative = BCE, positive = CE).
 *
 * `region` (optional) lists city ids (from src/data/geography.js) this
 * people/empire was associated with — used to draw a soft, blurred glow
 * on the map, NOT a political border. Per PROJECT-BRIEF.md.pdf section 3
 * ("stay macro") and section 5 (schematic, not a modern political map),
 * this is deliberately fuzzy: a rough area of association, sized from
 * its cities, that fades in and out rather than switching on/off. A
 * culture with no `region` (Early Christians — a movement, not a
 * territory) gets no glow, only its city markers.
 * ------------------------------------------------------------------ */

export const CULTURES = [
  { name: "Sumerians", start: -2900, end: -1900, color: "#c9a94a",
    region: ["kesh", "ur", "uruk", "nippur", "shuruppak", "eridu", "larsa", "kish"] },
  { name: "Akkadians", start: -2334, end: -2154, color: "#b5763f",
    region: ["kish", "babylon", "mari"] },
  { name: "Babylonians", start: -1894, end: -539, color: "#8a6fb0",
    region: ["babylon", "sippar", "kish"] },
  { name: "Assyrians", start: -1350, end: -609, color: "#7a8fa6",
    region: ["nineveh", "assur"] },
  { name: "Canaanites / Ugarit", start: -1550, end: -1180, color: "#4f9a86",
    region: ["ugarit"] },
  { name: "Israelites & Judeans", start: -1200, end: -586, color: "#5b8dd9",
    region: ["jerusalem", "qumran"] },
  // Persian and Hellenistic extents are shown wide and soft on purpose —
  // both empires really did span from Bactria to the Levant — but this
  // is still a rough gesture, not a claim about any precise border.
  { name: "Persians", start: -550, end: -330, color: "#3f6fae",
    region: ["bactria", "babylon", "nineveh", "jerusalem", "ugarit"] },
  { name: "Greeks (Hellenistic)", start: -330, end: -63, color: "#6aa4c8",
    region: ["antioch", "ugarit", "babylon", "alexandria"] },
  // Rome's real hold on this map's frame was the Levant/Mediterranean
  // coast — Mesopotamia stayed under Parthian/Persian control through
  // most of this period, so its glow is deliberately NOT drawn there.
  { name: "Romans", start: -63, end: 300, color: "#a85a5a",
    region: ["antioch", "ugarit", "jerusalem", "alexandria"] },
  { name: "Early Christians", start: 30, end: 300, color: "#d98b3f" },
];
