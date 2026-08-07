import { useMemo, useState } from "react";
import { CITIES, SEAS, RIVERS, MOUNTAINS, LANDMASSES } from "../data/geography.js";
import { CULTURES } from "../data/cultures.js";
import { TEXTS, TEXT_BY_ID, CONFIDENCE_COLOR, LINK_TIER } from "../data/texts.js";
import { fadeWeight } from "../utils.js";
import { S } from "../styles.js";
import { GLOBE_SIZE, GLOBE_FOCI, makeProjection, lineString, polygon, GRATICULE } from "../geo.js";

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
 * ------------------------------------------------------------------ */

export default function GlobeMap({ year, selected }) {
  const [focus, setFocus] = useState("oldWorld");
  const { pathGen, project, outline } = useMemo(() => makeProjection(focus), [focus]);

  const selText = selected ? TEXT_BY_ID[selected] : null;

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

  return (
    <section style={S.mapWrap} aria-label="World map, real geography, ancient schematic style">
      <div style={S.globeFocusToggle} role="tablist" aria-label="Which hemisphere to view">
        {Object.entries(GLOBE_FOCI).map(([key, f]) => (
          <button key={key}
            style={{ ...S.globeFocusBtn, ...(focus === key ? S.globeFocusBtnActive : {}) }}
            role="tab" aria-selected={focus === key} onClick={() => setFocus(key)}>
            {f.label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${GLOBE_SIZE} ${GLOBE_SIZE}`} style={S.mapSvg} role="img">
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

        {/* the globe itself */}
        <path d={pathGen(outline)} fill="url(#land)" stroke="#4b4230" strokeWidth="1.5" />
        <path d={pathGen(GRATICULE)} fill="none" stroke="#4b4230" strokeWidth="0.5" opacity="0.35" />

        {/* Zagros / Himalaya mountains, schematic */}
        {MOUNTAINS.map((pt, i) => {
          const p = project(pt);
          if (!p) return null;
          return <path key={i} d={`M${p[0]} ${p[1]} l11 -15 l11 15 z`} fill="#3a3324" stroke="#4b4230" strokeWidth="1.2" />;
        })}

        {/* seas */}
        {Object.entries(SEAS).map(([id, coords]) => (
          <path key={id} d={pathGen(polygon(coords))} fill="url(#water)" />
        ))}
        {medLabel && <text x={medLabel[0]} y={medLabel[1]} style={S.seaLabel}>Mediterranean</text>}
        {gulfLabel && <text x={gulfLabel[0]} y={gulfLabel[1]} style={S.seaLabel}>Persian Gulf</text>}

        {/* small islands, drawn back on top of a sea (see LANDMASSES) */}
        {Object.entries(LANDMASSES).map(([id, coords]) => (
          <path key={id} d={pathGen(polygon(coords))} fill="url(#land)" stroke="#4b4230" strokeWidth="1" />
        ))}

        {/* rivers */}
        {Object.entries(RIVERS).map(([id, coords]) => (
          <path key={id} d={pathGen(lineString(coords))} fill="none" stroke="#3f7fb0" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        ))}
        {euphratesLabel && <text x={euphratesLabel[0]} y={euphratesLabel[1]} style={S.riverLabel}>Euphrates</text>}
        {tigrisLabel && <text x={tigrisLabel[0]} y={tigrisLabel[1]} style={S.riverLabel}>Tigris</text>}

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

        {/* cities */}
        {Object.entries(CITIES).map(([id, c]) => {
          const p = project([c.lon, c.lat]);
          if (!p) return null;
          const revealYear = cityRevealYear[id];
          const w = revealYear === undefined ? 0 : Math.min(1, Math.max(0, (year - revealYear + 60) / 60));
          const lit = w > 0.5;
          const isSel = selText && (selText.city === id || selText.influences.some((f) => TEXT_BY_ID[f.from]?.city === id));
          return (
            <g key={id} opacity={0.32 + w * 0.68}>
              <circle cx={p[0]} cy={p[1]} r={isSel ? 7 : 4.5}
                fill={lit ? "#e6b84a" : "#6b6350"}
                stroke={isSel ? "#fff3d0" : "none"} strokeWidth="2"
                className={isSel ? "pulse" : ""} />
              <text x={p[0] + 9} y={p[1] + 4} style={{ ...S.cityLabel, fill: lit ? "#e9e0c8" : "#7c745f" }}>
                {c.label}
              </text>
            </g>
          );
        })}

        {/* vignette so the globe reads against the page background */}
        <circle cx={GLOBE_SIZE / 2} cy={GLOBE_SIZE / 2} r={GLOBE_SIZE / 2} fill="url(#space)" style={{ pointerEvents: "none" }} />
      </svg>

      <div style={S.mapNote}>
        Real latitude/longitude, projected as a globe — not a modern political map: no modern
        borders, no satellite imagery, just hand-simplified coasts, rivers, and mountains. An
        orthographic globe only shows one hemisphere at a time, so use the {GLOBE_FOCI.oldWorld.label}/
        {GLOBE_FOCI.americas.label} switch above to see the other side. Positions stay approximate,
        for orientation rather than survey accuracy.
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
