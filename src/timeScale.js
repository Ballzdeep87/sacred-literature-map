/* ------------------------------------------------------------------ *
 * Phase 7 — a non-linear time scale, shared by the timeline and the
 * influence web (src/App.jsx, src/components/InfluenceWeb.jsx).
 *
 * Per PROJECT-BRIEF.md.pdf section 5: now that the map spans all eras,
 * a strictly-linear "year -> pixel" mapping would squash the ancient
 * world — where nearly all current content lives — into a sliver next
 * to the (currently sparse) medieval and modern eras. Instead, each
 * era below gets a fixed share of the available width, linear within
 * itself. Dates shown to the user are always the real ones — this only
 * changes where a date lands on screen, not what it says.
 *
 * Adjust `widthFrac` values (they should sum to 1) as content grows —
 * e.g. once the medieval era has as many texts as the ancient one,
 * its share should grow too.
 * ------------------------------------------------------------------ */

export const TIME_ZONES = [
  { label: "Ancient world", start: -2600, end: 150, widthFrac: 0.78 },
  { label: "Late Antique – Medieval", start: 150, end: 1500, widthFrac: 0.14 },
  { label: "Early Modern – Present", start: 1500, end: 2026, widthFrac: 0.08 },
];

// Suggested axis tick years — denser where zones are narrow, so labels
// don't overlap.
export const TIME_TICKS = [
  -2600, -2000, -1500, -1000, -500, 1, 150, 500, 1000, 1500, 2026,
];

// Returns a yearToX(year) function mapping a year onto [0, totalWidth]
// using the zones above.
export function makeTimeScale(totalWidth) {
  let cursor = 0;
  const zones = TIME_ZONES.map((z) => {
    const x0 = cursor;
    const w = z.widthFrac * totalWidth;
    cursor += w;
    return { ...z, x0, w };
  });
  const globalStart = TIME_ZONES[0].start;
  const globalEnd = TIME_ZONES[TIME_ZONES.length - 1].end;

  return function yearToX(year) {
    const y = Math.max(globalStart, Math.min(globalEnd, year));
    const zone = zones.find((z) => y >= z.start && y <= z.end) ?? zones[zones.length - 1];
    const frac = zone.end === zone.start ? 0 : (y - zone.start) / (zone.end - zone.start);
    return zone.x0 + frac * zone.w;
  };
}
