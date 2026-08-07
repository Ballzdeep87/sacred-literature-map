import { geoOrthographic, geoPath, geoDistance, geoGraticule, geoCircle } from "d3-geo";

/* ------------------------------------------------------------------ *
 * The map's geography (Phase 6 onward) uses real latitude/longitude,
 * projected through d3-geo's orthographic projection — the same math
 * used to draw a globe on paper. Per PROJECT-BRIEF.md.pdf section 5,
 * D3 is used only for this projection MATH; the coastlines, rivers,
 * and mountains drawn through it are still hand-picked and simplified
 * (see src/data/geography.js), not a modern basemap or borders.
 *
 * Centered over the Arabian Sea so the Near East and, later, South
 * and East Asia both sit comfortably in the visible hemisphere.
 * ------------------------------------------------------------------ */

export const GLOBE_SIZE = 900;
const CENTER = GLOBE_SIZE / 2;

export const projection = geoOrthographic()
  .rotate([-80, -25]) // bring 80°E, 25°N to the center of the view
  .scale(430)
  .translate([CENTER, CENTER])
  .clipAngle(90); // only the visible (front) hemisphere

export const pathGen = geoPath(projection);

// Project a single [lon, lat] point to [x, y]. Returns null if the
// point is on the far side of the globe (not visible) — clipAngle
// clips paths automatically, but a single projected point needs its
// own great-circle visibility check against the current view center.
export function project([lon, lat]) {
  const rotation = projection.rotate();
  const viewCenter = [-rotation[0], -rotation[1]];
  const distanceFromCenter = geoDistance([lon, lat], viewCenter); // radians
  if (distanceFromCenter > Math.PI / 2) return null;
  return projection([lon, lat]);
}

// GeoJSON helpers — keep the data files plain lon/lat arrays and build
// the feature shape here, once.
export const lineString = (coords) => ({ type: "LineString", coordinates: coords });
export const polygon = (coords) => ({ type: "Polygon", coordinates: [coords] });

// The globe's own outline (a circle at the current scale/translate) —
// used to fill the visible hemisphere before drawing land/sea on top.
export const GLOBE_OUTLINE = geoCircle().radius(90).center([80, 25])();

// Classic lat/long grid lines, every 20°, for the "this is a globe" read.
export const GRATICULE = geoGraticule().step([20, 20])();
