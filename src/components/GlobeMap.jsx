import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { zoom as d3zoom, zoomIdentity } from "d3-zoom";
import { select } from "d3-selection";
import { CITIES, RIVERS, MOUNTAINS } from "../data/geography.js";
import { CULTURES } from "../data/cultures.js";
import { TEXTS, TEXT_BY_ID, CONFIDENCE_COLOR, LINK_TIER } from "../data/texts.js";
import { fadeWeight } from "../utils.js";
import { S } from "../styles.js";
import { GLOBE_SIZE, GLOBE_FOCI, WORLD_LAND, makeProjection, lineString, GRATICULE } from "../geo.js";

/* ------------------------------------------------------------------ *
 * Phase 6 — the map, real geography (src/geo.js), rendered as an
 * orthographic (globe-shaped) projection. Everything from Phase 1-3
 * (region glows, city fade-in, influence arcs) still works the same
 * way — it just reads projected [lon,lat] points instead of made-up
 * local x/y ones.
 *
 * Phase 7: an orthographic projection only shows one hemisphere, and
 * Mesoamerica sits on the opposite side of the Earth from everything
 * else on the map. `focus` switches between fixed viewing centers
 * (src/geo.js's GLOBE_FOCI) rather than continuous drag-rotation.
 *
 * Phase 8: scroll/pinch-to-zoom and drag-to-pan, via d3-zoom — used
 * only for its pointer/wheel-to-transform math, the same spirit as
 * d3-geo being used only for projection math (PROJECT-BRIEF.md.pdf
 * section 5). Lets a dense cluster (Mesopotamia's 8 close-together
 * cities, say) be zoomed in to roughly a several-hundred-mile view
 * without touching the projection itself — just scale/pan the already-
 * rendered map. Zoom/pan resets whenever `focus` changes, since a pan
 * position from one hemisphere means nothing in the other.
 * ------------------------------------------------------------------ */

const ZOOM_MIN = 1;
const ZOOM_MAX = 12;

export default function GlobeMap({ year, selected, autoFocus = false }) {
  const [focus, setFocus] = useState("oldWorld");
  const { pathGen, project, outline } = useMemo(() => makeProjection(focus), [focus]);

  const svgRef = useRef(null);
  const zoomBehaviorRef = useRef(null);
  const tweenRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });

  useEffect(() => {
    const svgSel = select(svgRef.current);
    const behavior = d3zoom()
      .scaleExtent([ZOOM_MIN, ZOOM_MAX])
      .on("zoom", (event) => {
        const { x, y, k } = event.transform;
        setTransform({ x, y, k });
      });
    svgSel.call(behavior);
    zoomBehaviorRef.current = behavior;
    return () => svgSel.on(".zoom", null);
  }, []);

  const resetView = useCallback(() => {
    if (!zoomBehaviorRef.current || !svgRef.current) return;
    zoomBehaviorRef.current.transform(select(svgRef.current), zoomIdentity);
  }, []);

  // A different hemisphere makes any current pan/zoom meaningless.
  useEffect(() => { resetView(); }, [focus, resetView]);

  const selText = selected ? TEXT_BY_ID[selected] : null;

  // If a newly selected text (e.g. from search, or a shared permalink) sits
  // in the hemisphere we're not currently viewing, flip to the one that
  // shows it — otherwise its marker just silently doesn't render.
  useEffect(() => {
    if (!selText) return;
    const city = CITIES[selText.city];
    if (!city || project([city.lon, city.lat])) return; // already visible
    // Toggling blindly off the current focus breaks under StrictMode's
    // double-invoke (two flips cancel out) — find the hemisphere that
    // actually shows this city instead.
    const shownIn = Object.keys(GLOBE_FOCI).find((key) => {
      if (key === focus) return false;
      return makeProjection(key).project([city.lon, city.lat]) !== null;
    });
    if (shownIn) setFocus(shownIn);
  }, [selText, project, focus]);

  // Tour mode (App.jsx's `autoFocus`) — pan/zoom to whatever's newly
  // selected, so someone just watching doesn't have to find it themselves.
  // Hand-rolled tween (requestAnimationFrame + zoomBehavior.transform each
  // frame) rather than d3-zoom's own .transition(), which needs the
  // separate d3-transition package — this keeps it to the same "d3 for
  // math only" footprint as the rest of the map.
  useEffect(() => {
    if (!autoFocus || !selText) return;
    const city = CITIES[selText.city];
    if (!city) return;
    const target = project([city.lon, city.lat]);
    // Not visible in the current hemisphere yet — the effect above will
    // flip `focus`, which changes `project` and re-runs this effect.
    if (!target) return;

    if (tweenRef.current) cancelAnimationFrame(tweenRef.current);

    const targetK = 3.2;
    const targetX = GLOBE_SIZE / 2 - target[0] * targetK;
    const targetY = GLOBE_SIZE / 2 - target[1] * targetK;
    const start = { ...transform };
    const startTime = performance.now();
    const DURATION = 900;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const svgSel = select(svgRef.current);

    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / DURATION);
      const e = easeOutCubic(t);
      const x = start.x + (targetX - start.x) * e;
      const y = start.y + (targetY - start.y) * e;
      const k = start.k + (targetK - start.k) * e;
      if (zoomBehaviorRef.current) zoomBehaviorRef.current.transform(svgSel, zoomIdentity.translate(x, y).scale(k));
      tweenRef.current = t < 1 ? requestAnimationFrame(tick) : null;
    };
    tweenRef.current = requestAnimationFrame(tick);

    return () => {
      if (tweenRef.current) cancelAnimationFrame(tweenRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `transform` is
    // read once as the tween's start point, not a trigger to re-run on.
  }, [autoFocus, selText, project]);

  const regionGeom = useMemo(() => {
    return CULTURES.filter((c) => c.region?.length).map((c) => {
      const pts = c.region.map((id) => CITIES[id]).filter(Boolean);
      const lon = pts.reduce((s, p) => s + p.lon, 0) / pts.length;
      const lat = pts.reduce((s, p) => s + p.lat, 0) / pts.length;
      const center = project([lon, lat]);
      if (!center) return null;
      const r = Math.max(70, ...pts.map((p) => {
        const pp = project([p.lon, p.lat]);
        return pp ? Math.hypot(pp[0] - center[0], pp[1] - center[1]) + 80 : 0;
      }));
      return { name: c.name, color: c.color, start: c.start, end: c.end, cx: center[0], cy: center[1], r };
    }).filter(Boolean);
  }, [project]);

  const cityRevealYear = useMemo(() => {
    const m = {};
    TEXTS.forEach((t) => {
      if (m[t.city] === undefined || t.start < m[t.city]) m[t.city] = t.start;
    });
    return m;
  }, []);

  const medLabel = project([20, 33]);
  const gulfLabel = project([51.5, 26]);
  const euphratesLabel = project([41.5, 33.8]);
  const tigrisLabel = project([44.6, 34.2]);
  const zoomedIn = transform.k > 1.05;

  // Geography (coastlines, rivers, region glows) should scale up on zoom —
  // that's the whole point of "zoom in for a ~500 mile view." But point
  // markers and their text labels are UI, not geography: at k=6+ a city
  // dot was rendering 6x its size and 11px labels became inches-tall
  // overlapping type, unreadable and unclickable. Counter-scaling each
  // marker's own group by 1/k keeps it a constant screen size while its
  // position still tracks the zoomed/panned map underneath it.
  const markerScale = 1 / transform.k;

  return (
    <section style={S.mapWrap} aria-label="World map, real geography, ancient schematic style">
      <div style={S.mapControls}>
        <div style={S.globeFocusToggle} role="tablist" aria-label="Which hemisphere to view">
          {Object.entries(GLOBE_FOCI).map(([key, f]) => (
            <button key={key}
              style={{ ...S.globeFocusBtn, ...(focus === key ? S.globeFocusBtnActive : {}) }}
              role="tab" aria-selected={focus === key} onClick={() => setFocus(key)}>
              {f.label}
            </button>
          ))}
        </div>
        {zoomedIn && (
          <button style={S.resetViewBtn} onClick={resetView}>Reset view</button>
        )}
      </div>

      <svg ref={svgRef} viewBox={`0 0 ${GLOBE_SIZE} ${GLOBE_SIZE}`} style={{ ...S.mapSvg, cursor: "grab", touchAction: "none" }} role="img">
        <defs>
          <radialGradient id="land" cx="42%" cy="38%" r="75%">
            <stop offset="0%" stopColor="#2a2418" />
            <stop offset="100%" stopColor="#1c1810" />
          </radialGradient>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1b3a5b" />
            <stop offset="100%" stopColor="#14283f" />
          </linearGradient>
          <radialGradient id="space" cx="50%" cy="50%" r="70%">
            <stop offset="75%" stopColor="#0f0d08" stopOpacity="0" />
            <stop offset="100%" stopColor="#0f0d08" stopOpacity="1" />
          </radialGradient>
          <filter id="soften" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>

        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
          {/* the globe itself — ocean is the default fill (there's more sea
              than land on Earth), with real coastlines (src/geo.js's
              WORLD_LAND, from world-atlas/Natural Earth) drawn on top in
              land color. No country borders, no satellite imagery — just
              accurate coastline shape rendered in our own ink/sepia style. */}
          <path d={pathGen(outline)} fill="url(#water)" stroke="#4b4230" strokeWidth="1.5" />
          <path d={pathGen(WORLD_LAND)} fill="url(#land)" stroke="#4b4230" strokeWidth="1" />
          <path d={pathGen(GRATICULE)} fill="none" stroke="#4b4230" strokeWidth="0.5" opacity="0.2" />

          {/* mountain ranges, schematic — one small triangle glyph per
              traced point (src/data/geography.js's MOUNTAINS) */}
          {Object.entries(MOUNTAINS).flatMap(([rangeId, pts]) =>
            pts.map((pt, i) => {
              const p = project(pt);
              if (!p) return null;
              return (
                <g key={`${rangeId}-${i}`} transform={`translate(${p[0]},${p[1]}) scale(${markerScale})`}>
                  <path d="M0 0 l11 -15 l11 15 z" fill="#3a3324" stroke="#4b4230" strokeWidth="1.2" />
                </g>
              );
            })
          )}

          {medLabel && (
            <g transform={`translate(${medLabel[0]},${medLabel[1]}) scale(${markerScale})`}>
              <text style={S.seaLabel}>Mediterranean</text>
            </g>
          )}
          {gulfLabel && (
            <g transform={`translate(${gulfLabel[0]},${gulfLabel[1]}) scale(${markerScale})`}>
              <text style={S.seaLabel}>Persian Gulf</text>
            </g>
          )}

          {/* rivers */}
          {Object.entries(RIVERS).map(([id, coords]) => (
            <path key={id} d={pathGen(lineString(coords))} fill="none" stroke="#3f7fb0" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
          ))}
          {euphratesLabel && (
            <g transform={`translate(${euphratesLabel[0]},${euphratesLabel[1]}) scale(${markerScale})`}>
              <text style={S.riverLabel}>Euphrates</text>
            </g>
          )}
          {tigrisLabel && (
            <g transform={`translate(${tigrisLabel[0]},${tigrisLabel[1]}) scale(${markerScale})`}>
              <text style={S.riverLabel}>Tigris</text>
            </g>
          )}

          {/* peoples/empires — soft blurred glows, not political borders */}
          {regionGeom.map((c) => {
            const w = fadeWeight(year, c.start, c.end);
            if (w <= 0.02) return null;
            return (
              <circle key={c.name} cx={c.cx} cy={c.cy} r={c.r} fill={c.color}
                opacity={w * 0.3} filter="url(#soften)" />
            );
          })}

          {/* influence arcs from the selected text */}
          {selText &&
            selText.influences.map((inf, i) => {
              const fromCity = CITIES[TEXT_BY_ID[inf.from]?.city];
              const toCity = CITIES[selText.city];
              if (!fromCity || !toCity) return null;
              const from = project([fromCity.lon, fromCity.lat]);
              const to = project([toCity.lon, toCity.lat]);
              if (!from || !to) return null;
              const mx = (from[0] + to[0]) / 2;
              const my = (from[1] + to[1]) / 2 - 55;
              const dash = LINK_TIER[inf.tier]?.dash;
              return (
                <path
                  key={i}
                  d={`M${from[0]} ${from[1]} Q ${mx} ${my} ${to[0]} ${to[1]}`}
                  fill="none" stroke="#e6b84a" strokeWidth="2"
                  strokeDasharray={dash || undefined}
                  opacity="0.9" className={dash ? "arc" : ""}
                />
              );
            })}

          {/* cities — counter-scaled (see markerScale above) so dots and
              labels stay a constant, clickable, readable screen size no
              matter how far zoomed in; only their position tracks the map. */}
          {Object.entries(CITIES).map(([id, c]) => {
            const p = project([c.lon, c.lat]);
            if (!p) return null;
            const revealYear = cityRevealYear[id];
            const w = revealYear === undefined ? 0 : Math.min(1, Math.max(0, (year - revealYear + 60) / 60));
            const lit = w > 0.5;
            const isSel = selText && (selText.city === id || selText.influences.some((f) => TEXT_BY_ID[f.from]?.city === id));
            return (
              <g key={id} opacity={0.32 + w * 0.68} transform={`translate(${p[0]},${p[1]}) scale(${markerScale})`}>
                <circle cx={0} cy={0} r={isSel ? 7 : 4.5}
                  fill={lit ? "#e6b84a" : "#6b6350"}
                  stroke={isSel ? "#fff3d0" : "none"} strokeWidth="2"
                  className={isSel ? "pulse" : ""} />
                <text x={9} y={4} style={{ ...S.cityLabel, fill: lit ? "#e9e0c8" : "#7c745f" }}>
                  {c.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* vignette so the globe reads against the page background — kept
            outside the zoom group, since it's a viewport edge effect, not
            part of the map */}
        <circle cx={GLOBE_SIZE / 2} cy={GLOBE_SIZE / 2} r={GLOBE_SIZE / 2} fill="url(#space)" style={{ pointerEvents: "none" }} />
      </svg>

      <div style={S.mapNote}>
        Real coastlines, projected as a globe — not a modern political map: no modern borders,
        no satellite imagery, just accurate coasts under hand-placed rivers, mountains, and cities.
        Scroll or pinch to zoom in on a crowded cluster, drag to pan, and use the {GLOBE_FOCI.oldWorld.label}/
        {GLOBE_FOCI.americas.label} switch above to see the other hemisphere. City and river positions
        stay approximate, for orientation rather than survey accuracy.
      </div>

      <div style={S.legend}>
        <div style={S.legendGroup}>
          <span style={S.legendLabel}>Confidence:</span>
          {Object.entries(CONFIDENCE_COLOR).map(([tier, color]) => (
            <span key={tier} style={S.legendItem}>
              <span style={{ ...S.legendDot, background: color }} />
              {tier}
            </span>
          ))}
        </div>
        <div style={S.legendGroup}>
          <span style={S.legendLabel}>Influence line:</span>
          <span style={S.legendItem}><span className="legend-line" /> documented</span>
          <span style={S.legendItem}><span className="legend-line legend-line--dashed" /> probable</span>
          <span style={S.legendItem}><span className="legend-line legend-line--dotted" /> debated / speculative</span>
        </div>
      </div>
    </section>
  );
}
