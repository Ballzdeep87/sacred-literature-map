/* ------------------------------------------------------------------ *
 * Small pure helpers shared by the map view and the influence-web view.
 * ------------------------------------------------------------------ */

export const fmtYear = (y) => {
  const n = Math.round(y);
  if (n < 0) return `${-n} BCE`;
  if (n === 0) return `1 CE`;
  return `${n} CE`;
};

// A smooth 0..1 ramp: rises over `ramp` years before `start`, holds at 1
// across [start, end], falls over `ramp` years after `end`. Used so
// peoples, cities, and texts fade gently in and out rather than
// switching on/off.
export const fadeWeight = (year, start, end, ramp = 80) => {
  if (year < start - ramp || year > end + ramp) return 0;
  const inRamp = Math.min(1, Math.max(0, (year - (start - ramp)) / ramp));
  const outRamp = Math.min(1, Math.max(0, (end + ramp - year) / ramp));
  return Math.min(inRamp, outRamp);
};
