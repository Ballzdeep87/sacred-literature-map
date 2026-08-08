/* ------------------------------------------------------------------ *
 * Geography — real latitude/longitude, projected through src/geo.js's
 * orthographic projection. Coastlines themselves come from real data
 * (src/geo.js's WORLD_LAND, Phase 12) — what's hand-placed here are the
 * schematic annotations layered on top: cities, rivers, and mountains.
 * Positions are still meant for orientation rather than survey accuracy.
 *
 * Coordinates are [longitude, latitude], matching GeoJSON convention.
 * ------------------------------------------------------------------ */

export const CITIES = {
  antioch: { lon: 36.16, lat: 36.20, label: "Antioch" },
  ugarit: { lon: 35.78, lat: 35.60, label: "Ugarit" },
  jerusalem: { lon: 35.22, lat: 31.78, label: "Jerusalem" },
  qumran: { lon: 35.46, lat: 31.74, label: "Qumran" },
  mari: { lon: 40.89, lat: 34.55, label: "Mari" },
  nineveh: { lon: 43.15, lat: 36.36, label: "Nineveh" },
  assur: { lon: 43.26, lat: 35.46, label: "Assur" },
  sippar: { lon: 44.29, lat: 33.06, label: "Sippar" },
  babylon: { lon: 44.42, lat: 32.54, label: "Babylon" },
  kish: { lon: 44.62, lat: 32.55, label: "Kish" },
  kesh: { lon: 45.30, lat: 31.90, label: "Kesh" },
  nippur: { lon: 45.24, lat: 32.13, label: "Nippur" },
  shuruppak: { lon: 45.11, lat: 31.83, label: "Shuruppak" },
  uruk: { lon: 45.64, lat: 31.32, label: "Uruk" },
  larsa: { lon: 45.86, lat: 31.23, label: "Larsa" },
  ur: { lon: 46.10, lat: 30.96, label: "Ur" },
  eridu: { lon: 45.99, lat: 30.81, label: "Eridu" },
  alexandria: { lon: 29.92, lat: 31.20, label: "Alexandria" },
  bactria: { lon: 66.90, lat: 36.75, label: "Bactria" },

  // South Asia (Phase 6b)
  punjab: { lon: 74.30, lat: 31.60, label: "Punjab" },
  ganges_plain: { lon: 83.00, lat: 25.30, label: "Ganges Plain" },
  sri_lanka: { lon: 80.62, lat: 7.47, label: "Aluvihare" },

  // East Asia (Phase 6b)
  zhou: { lon: 108.90, lat: 34.30, label: "Zhou (Xi'an)" },
  guodian: { lon: 112.19, lat: 31.03, label: "Guodian" },
  qufu: { lon: 116.99, lat: 35.60, label: "Qufu" },

  // Egypt (Phase 6c)
  saqqara: { lon: 31.216, lat: 29.871, label: "Saqqara" },
  memphis: { lon: 31.251, lat: 29.844, label: "Memphis" },
  deir_el_bersha: { lon: 30.82, lat: 27.78, label: "Deir el-Bersha" },
  thebes: { lon: 32.60, lat: 25.72, label: "Thebes" },

  // Arabia (Phase 7)
  mecca: { lon: 39.83, lat: 21.42, label: "Mecca" },

  // Norse — medieval Iceland (Phase 7)
  skalholt: { lon: -20.55, lat: 64.13, label: "Skálholt" },
  reykholt: { lon: -21.29, lat: 64.67, label: "Reykholt" },

  // Mesoamerica — Americas focus (Phase 7)
  qumarkaj: { lon: -91.15, lat: 15.03, label: "Q'umarkaj" },
  tenochtitlan: { lon: -99.13, lat: 19.43, label: "Tenochtitlan" },

  // West Africa (Phase 7)
  ile_ife: { lon: 4.57, lat: 7.48, label: "Ile-Ife" },

  // Phase 7d — the "next chapter" of three already-connected traditions
  sepphoris: { lon: 35.27, lat: 32.75, label: "Sepphoris" },
  sura: { lon: 44.40, lat: 31.90, label: "Sura" },
  bukhara: { lon: 64.42, lat: 39.77, label: "Bukhara" },
  nicaea: { lon: 29.72, lat: 40.43, label: "Nicaea" },

  // Phase 7e — Mani's Sasanian Mesopotamia, a hub connecting four
  // traditions already on the map.
  ctesiphon: { lon: 44.58, lat: 33.09, label: "Ctesiphon" },
};

// Coastlines are real now (src/geo.js's WORLD_LAND, Phase 12) — SEAS and
// LANDMASSES, the hand-guessed polygons that used to carve water out of
// a land-colored base, are gone. Sea/river name labels below are just
// text placed at a chosen [lon, lat], independent of any polygon.

export const RIVERS = {
  euphrates: [
    [39.0, 39.3], [38.5, 37.0], [38.2, 36.0], [38.5, 35.3], [40.0, 34.7],
    [40.89, 34.55], [43.0, 33.3], [44.0, 32.8], [44.3, 32.5], [44.6, 31.3],
    [45.6, 31.3], [46.1, 30.96], [47.5, 30.5], [48.0, 29.9],
  ],
  tigris: [
    [39.8, 38.3], [41.0, 37.5], [42.5, 36.9], [43.15, 36.36], [43.26, 35.46],
    [44.1, 34.5], [44.4, 33.3], [44.9, 32.6], [45.8, 31.9], [47.0, 31.0],
    [47.8, 30.5], [48.0, 29.9],
  ],
  nile: [
    [32.60, 25.72], [32.40, 26.50], [31.80, 27.20], [30.90, 27.75],
    [31.00, 28.50], [31.15, 29.30], [31.23, 29.86], [31.10, 30.50],
    [30.90, 30.50], [29.92, 31.20],
  ],
  indus: [[73.0, 34.5], [71.5, 30.5], [70.0, 27.0], [68.0, 25.0], [67.3, 23.9]],
  ganges: [[79.0, 30.2], [81.5, 26.0], [83.5, 25.5], [86.0, 25.3], [88.0, 23.8], [90.2, 22.0]],
  yellowRiver: [
    [96, 35], [100, 36], [104, 36], [108, 35], [110, 34.5],
    [113, 35.5], [115, 36], [117, 37.5], [119, 38],
  ],
  yangtze: [
    [97, 33], [102, 29], [106, 29.5], [110, 30.5], [112.2, 31],
    [114, 30.5], [117, 30.8], [120, 31.5], [121.5, 31.2],
  ],
};

// Mountain ranges, schematic — Zagros (northeast of Mesopotamia) and
// the Himalayan front (north of the Ganges plain).
export const MOUNTAINS = [
  [45.5, 37.2], [46.3, 36.0], [47.0, 34.8], [47.8, 33.6],
  [48.4, 32.4], [49.0, 31.2], [49.6, 30.0],
  [75, 32], [78, 30], [81, 29], [84, 28], [87, 27], [90, 27],
];
