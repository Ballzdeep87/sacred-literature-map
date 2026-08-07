import { geoOrthographic, geoPath, geoDistance, geoGraticule, geoCircle } from "d3-geo";

/* ------------------------------------------------------------------ *
 * The map's geography (Phase 6 onward) uses real latitude/longitude,
 * projected through d3-geo's orthographic projection — the same math
 * used to draw a globe on paper. Per PROJECT-BRIEF.md.pdf section 5,
 * D3 is used only for this projection MATH; the coastlines, rivers,
 * and mountains drawn through it are still hand-picked and simplified
 * (see src/data/geography.js), not a modern basemap or borders.
 *
 * An orthographic projection only shows one hemisphere at a time — and
 * Phase 7's Mesoamerican content is genuinely on the opposite side of
 * the Earth from everything else on the map, not just "near the edge"
 * the way Iceland or West Africa are. Rather than add continuous
 * drag-to-rotate (a bigger, riskier build), GLOBE_FOCI defines a
 * couple of fixed viewing centers the user can switch between — same
 * lightweight toggle pattern as the Map/Influence-web switch.
 * ------------------------------------------------------------------ */

export const GLOBE_SIZE = 900;
const CENTER = GLOBE_SIZE / 2;

export const GLOBE_FOCI = {
  oldWorld: { center: [60, 35], label: "Old World" },
  americas: { center: [-90, 15], label: "Americas" },
};

// Builds a fresh projection (+ its path generator, point-projector, and
// hemisphere outline) centered on the given focus. Called from a
// useMemo keyed on the chosen focus — cheap enough to rebuild on toggle.
export function makeProjection(focusKey) {
  const { center } = GLOBE_FOCI[focusKey] ?? GLOBE_FOCI.oldWorld;

  const projection = geoOrthographic()
    .rotate([-center[0], -center[1]])
    .scale(430)
    .translate([CENTER, CENTER])
    .clipAngle(90); // only the visible (front) hemisphere

  const pathGen = geoPath(projection);

  // Project a single [lon, lat] point to [x, y]. Returns null if the
  // point is on the far side of the globe (not visible) — clipAngle
  // clips paths automatically, but a single projected point needs its
  // own great-circle visibility check against the current view center.
  function project([lon, lat]) {
    const distanceFromCenter = geoDistance([lon, lat], center); // radians
    if (distanceFromCenter > Math.PI / 2) return null;
    return projection([lon, lat]);
  }

  // The globe's own outline (a circle at the current center) — used to
  // fill the visible hemisphere before drawing land/sea on top.
  const outline = geoCircle().radius(90).center(center)();

  return { projection, pathGen, project, outline };
}

// GeoJSON helpers — keep the data files plain lon/lat arrays and build
// the feature shape here, once.
export const lineString = (coords) => ({ type: "LineString", coordinates: coords });
export const polygon = (coords) => ({ type: "Polygon", coordinates: [coords] });

// Classic lat/long grid lines, every 20° — doesn't depend on focus,
// since geoPath clips it to whichever hemisphere is current.
export const GRATICULE = geoGraticule().step([20, 20])();
