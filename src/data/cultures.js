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
  // Ends at Rome's annexation of Egypt (30 BCE) — after that, Egypt's
  // glow comes from the Greeks/Romans bands above, which already
  // include Alexandria.
  { name: "Ancient Egyptians", start: -2350, end: -30, color: "#2f6b8a",
    region: ["saqqara", "memphis", "deir_el_bersha", "thebes", "alexandria"] },
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
  // The Temple's destruction (70 CE) ends the "Israelites & Judeans" era
  // above; Judaism's story continues here, reorganized around study.
  { name: "Rabbinic Jewish diaspora", start: 70, end: 600, color: "#3f6f9e",
    region: ["sepphoris", "sura"] },
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
  // Marks the shift from a persecuted, decentralized movement to an
  // empire-sponsored, doctrinally standardized religion.
  { name: "Nicene Christianity (Roman Empire)", start: 300, end: 400, color: "#c98a5f",
    region: ["nicaea", "antioch"] },

  // Far Eastern traditions (Phase 6b) — same rules as above: soft,
  // fuzzy regions sized from their cities, not political borders.
  { name: "Vedic peoples", start: -1500, end: -500, color: "#c9622f",
    region: ["punjab", "ganges_plain"] },
  { name: "Zhou dynasty China", start: -1046, end: -256, color: "#a8452e",
    region: ["zhou", "guodian", "qufu"] },
  { name: "Early Buddhist community (Sangha)", start: -450, end: 100, color: "#8a6f9a",
    region: ["ganges_plain", "sri_lanka"] },

  // Phase 7 — first entry in the "all eras" pivot.
  { name: "Early Muslim community (Ummah)", start: 610, end: 632, color: "#4a8f5f",
    region: ["mecca"] },
  { name: "Abbasid-era Muslim scholars", start: 750, end: 900, color: "#3f9e6f",
    region: ["bukhara"] },
  // Mani's own lifetime — a deliberate synthesis of Zoroastrian,
  // Christian, and Buddhist ideas into one new religion.
  { name: "Manichaean community (Sasanian Empire)", start: 240, end: 274, color: "#8a3f6f",
    region: ["ctesiphon"] },

  // Isolated traditions (Phase 7) — no historical contact with anything
  // above; visible only when the map's Americas focus includes them.
  { name: "Medieval Icelanders", start: 800, end: 1270, color: "#4a7a9e",
    region: ["skalholt", "reykholt"] },
  { name: "K'iche' Maya", start: 1200, end: 1558, color: "#3fa89e",
    region: ["qumarkaj"] },
  { name: "Nahua (Aztec) peoples", start: 1325, end: 1570, color: "#2f8a80",
    region: ["tenochtitlan"] },
  { name: "Yoruba peoples", start: 1000, end: 1900, color: "#4a3f8a",
    region: ["ile_ife"] },
];
