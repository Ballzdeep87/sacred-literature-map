/* ------------------------------------------------------------------ *
 * Geography (Phase 6) — real latitude/longitude, projected through
 * src/geo.js's orthographic projection. Positions are still meant for
 * orientation rather than survey accuracy: coastlines, rivers, and
 * mountains below are hand-simplified, not traced from real map data
 * (see PROJECT-BRIEF.md.pdf section 5 — no modern map library).
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
};

// Simplified coastlines, as [lon, lat] point lists — GeoJSON polygons
// (closed shapes) for named seas, drawn over a full land-colored base.
export const SEAS = {
  mediterranean: [
    [-9, 36], [-4, 37.5], [0, 38.5], [4, 39.5], [8, 40.5], [12, 40.2],
    [16, 39.2], [20, 38.3], [24, 36.4], [27, 37], [30, 36.6], [33, 36.4],
    [35, 36.2], [36, 35], [35.9, 33.5], [35, 31.6], [34, 31.3], [32, 31.4],
    [30, 32], [27, 36.5], [23, 38], [19, 40], [15, 38], [12, 40], [9, 38],
    [5, 38], [0, 37], [-5, 36], [-9, 36],
  ],
  redSea: [
    [32.5, 29.9], [34, 28], [36, 24], [38, 19.5], [40, 15.8], [43, 12.8],
    [43.5, 12.3], [41.8, 12.5], [39.5, 15.3], [37, 19], [34.8, 23],
    [33.3, 27], [32.5, 29.9],
  ],
  persianGulf: [
    [48.0, 30.0], [49.5, 30.0], [52.2, 29.6], [55.0, 28.2], [56.5, 27.1],
    [56.3, 26.6], [53.5, 25.4], [52.3, 26.0], [51.2, 27.0], [50.2, 28.3],
    [49.2, 29.4], [48.0, 30.0],
  ],
  // A broad, deliberately loose sketch of the Arabian Sea / western
  // Indian Ocean — this is filler for the wider frame, not a claim
  // about any coastline detail.
  arabianSea: [
    [43, 12.5], [48, 10], [55, 12], [60, 15], [63, 20], [66, 23],
    [69, 22], [71, 18], [73, 12], [72, 6], [66, 3], [58, 5], [50, 8],
    [45, 10], [43, 12.5],
  ],
  bayOfBengal: [
    [80, 8], [83, 10], [86, 14], [89, 18], [92, 20], [93, 15], [90, 10],
    [85, 6], [80, 8],
  ],
  // South China Sea + a gesture toward the Yellow Sea — simplified, to
  // carve East Asia's coast out of the land backdrop.
  chinaSea: [
    [107, 10], [105, 14], [108, 18], [112, 24], [116, 30], [118, 34],
    [120, 37], [123, 38], [124, 36], [122, 33], [121, 30], [122, 27],
    [122, 22], [120, 18], [118, 14], [115, 10], [110, 8], [107, 10],
  ],
};

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
