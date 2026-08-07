/* ------------------------------------------------------------------ *
 * Schematic geography of the ancient Near East.
 * Positions are approximate — meant for orientation, not survey
 * accuracy (see PROJECT-BRIEF.md.pdf, section 5, on the map approach).
 * viewBox is 1000 x 620.
 * ------------------------------------------------------------------ */

export const CITIES = {
  antioch: { x: 178, y: 150, label: "Antioch" },
  ugarit: { x: 165, y: 208, label: "Ugarit" },
  jerusalem: { x: 192, y: 396, label: "Jerusalem" },
  qumran: { x: 210, y: 414, label: "Qumran" },
  mari: { x: 420, y: 258, label: "Mari" },
  nineveh: { x: 702, y: 162, label: "Nineveh" },
  assur: { x: 662, y: 208, label: "Assur" },
  sippar: { x: 560, y: 346, label: "Sippar" },
  babylon: { x: 544, y: 378, label: "Babylon" },
  kish: { x: 588, y: 368, label: "Kish" },
  kesh: { x: 616, y: 426, label: "Kesh" },
  nippur: { x: 642, y: 440, label: "Nippur" },
  shuruppak: { x: 656, y: 472, label: "Shuruppak" },
  uruk: { x: 646, y: 506, label: "Uruk" },
  larsa: { x: 678, y: 516, label: "Larsa" },
  ur: { x: 666, y: 550, label: "Ur" },
  eridu: { x: 650, y: 574, label: "Eridu" },
  // Two schematic additions, outside this map's usual Mesopotamia/Levant
  // frame — see each linked text's `origin` field for the caveat.
  alexandria: { x: 35, y: 548, label: "Alexandria" },
  bactria: { x: 900, y: 260, label: "Bactria" },
};

// Rivers, sea, gulf, mountains — schematic SVG paths
export const EUPHRATES =
  "M300 70 C 360 150, 400 210, 420 258 C 450 320, 520 340, 544 378 C 580 430, 640 500, 650 574";
export const TIGRIS =
  "M610 60 C 660 110, 700 140, 702 162 C 705 220, 668 250, 672 300 C 678 380, 690 470, 700 540";
export const MED_COAST =
  "M120 60 C 150 150, 150 260, 205 360 C 235 415, 235 470, 210 560 L 60 560 L 60 60 Z";
export const GULF =
  "M700 540 C 760 560, 860 566, 1000 560 L 1000 620 L 600 620 C 620 590, 660 556, 700 540 Z";
