import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Play, Pause, RotateCcw, Map as MapIcon, Share2 } from "lucide-react";

import { CITIES, EUPHRATES, TIGRIS, MED_COAST, GULF } from "./data/geography.js";
import { CULTURES } from "./data/cultures.js";
import { TEXTS, TEXT_BY_ID, CONFIDENCE_COLOR, LINK_TIER } from "./data/texts.js";
import { YEAR_MIN, YEAR_MAX } from "./data/timeRange.js";
import { fmtYear, fadeWeight } from "./utils.js";
import { S, CSS } from "./styles.js";
import InfoPanel from "./components/InfoPanel.jsx";
import InfluenceWeb from "./components/InfluenceWeb.jsx";

/* ------------------------------------------------------------------ *
 * A Living Map of Sacred Literature
 * A schematic map + timeline (Phase 1-3) and a dedicated influence web
 * (Phase 4, src/components/InfluenceWeb.jsx) sharing one timeline and
 * one info panel (src/components/InfoPanel.jsx).
 * ------------------------------------------------------------------ */

export default function App() {
  const [year, setYear] = useState(YEAR_MIN);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState(null);
  const [hover, setHover] = useState(null);
  const [view, setView] = useState("map"); // "map" | "web"
  const rafRef = useRef(null);
  const lastRef = useRef(null);

  const YEARS_PER_SEC = 260;

  // A soft glow per people/empire — centered and sized from the cities
  // listed in its `region` (src/data/cultures.js), NOT a political border.
  const regionGeom = useMemo(() => {
    return CULTURES.filter((c) => c.region?.length).map((c) => {
      const pts = c.region.map((id) => CITIES[id]).filter(Boolean);
      const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
      const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
      const r = Math.max(75, ...pts.map((p) => Math.hypot(p.x - cx, p.y - cy) + 85));
      return { name: c.name, color: c.color, start: c.start, end: c.end, cx, cy, r };
    });
  }, []);

  // Earliest year each city is tied to a text — drives its gentle fade-in.
  const cityRevealYear = useMemo(() => {
    const m = {};
    TEXTS.forEach((t) => {
      if (m[t.city] === undefined || t.start < m[t.city]) m[t.city] = t.start;
    });
    return m;
  }, []);

  useEffect(() => {
    if (!playing) return;
    const step = (t) => {
      if (lastRef.current == null) lastRef.current = t;
      const dt = (t - lastRef.current) / 1000;
      lastRef.current = t;
      setYear((y) => {
        const next = y + dt * YEARS_PER_SEC;
        if (next >= YEAR_MAX) {
          setPlaying(false);
          return YEAR_MAX;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastRef.current = null;
    };
  }, [playing]);

  const togglePlay = useCallback(() => {
    setYear((y) => (y >= YEAR_MAX ? YEAR_MIN : y));
    setPlaying((p) => !p);
  }, []);

  const reset = useCallback(() => {
    setPlaying(false);
    setYear(YEAR_MIN);
    setSelected(null);
  }, []);

  const revealed = (t) => year >= t.start - 0.5;
  const selText = selected ? TEXT_BY_ID[selected] : null;

  // timeline geometry
  const TL_W = 1000, TL_H = 250, PAD_L = 8, PAD_R = 8, AXIS_Y = 210;
  const tlX = (y) => PAD_L + ((y - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * (TL_W - PAD_L - PAD_R);
  const bandTop = 18, bandH = 12, bandGap = 3;

  const ticks = [];
  for (let y = -2500; y <= 0; y += 500) ticks.push(y);
  ticks.push(-2600); ticks.push(1); [50, 100, 150].forEach((y) => ticks.push(y));

  return (
    <div style={S.root}>
      <style>{CSS}</style>

      <header style={S.header}>
        <div>
          <div style={S.kicker}>An interactive history · Phase 4</div>
          <h1 style={S.h1}>A Living Map of Sacred Literature</h1>
          <p style={S.sub}>
            From the <em>Kesh Temple Hymn</em> (c. 2600 BCE) toward early Christianity. Press
            play to let time move — texts light up as the world reaches them, and peoples'
            presence rises and falls softly in the background.
          </p>
        </div>
        <div style={S.clock}>
          <div style={S.clockLabel}>Year</div>
          <div style={S.clockValue}>{fmtYear(year)}</div>
        </div>
      </header>

      <div style={S.viewToggle} role="tablist" aria-label="Choose a view">
        <button style={{ ...S.viewToggleBtn, ...(view === "map" ? S.viewToggleBtnActive : {}) }}
          role="tab" aria-selected={view === "map"} onClick={() => setView("map")}>
          <MapIcon size={14} /> Map
        </button>
        <button style={{ ...S.viewToggleBtn, ...(view === "web" ? S.viewToggleBtnActive : {}) }}
          role="tab" aria-selected={view === "web"} onClick={() => setView("web")}>
          <Share2 size={14} /> Influence web
        </button>
      </div>

      <div style={S.stage}>
        {view === "web" ? (
          <InfluenceWeb year={year} selected={selected} onSelect={setSelected} hover={hover} onHover={setHover} />
        ) : (
        <section style={S.mapWrap} aria-label="Schematic map of the ancient Near East">
          <svg viewBox="0 0 1000 620" style={S.mapSvg} role="img">
            <defs>
              <radialGradient id="land" cx="55%" cy="45%" r="75%">
                <stop offset="0%" stopColor="#2a2418" />
                <stop offset="100%" stopColor="#1c1810" />
              </radialGradient>
              <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1b3a5b" />
                <stop offset="100%" stopColor="#14283f" />
              </linearGradient>
              <filter id="soften" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="16" />
              </filter>
            </defs>

            <rect x="0" y="0" width="1000" height="620" fill="url(#land)" />

            {/* Zagros mountains, east */}
            {Array.from({ length: 9 }).map((_, i) => {
              const bx = 786 + (i % 3) * 26;
              const by = 120 + i * 52;
              return (
                <path key={i} d={`M${bx} ${by} l26 -34 l26 34 z`} fill="#3a3324" stroke="#4b4230" strokeWidth="1.5" />
              );
            })}

            {/* seas */}
            <path d={MED_COAST} fill="url(#water)" />
            <path d={GULF} fill="url(#water)" />
            <text x="80" y="300" style={S.seaLabel} transform="rotate(-90 80 300)">Mediterranean</text>
            <text x="840" y="600" style={S.seaLabel}>Persian Gulf</text>

            {/* rivers */}
            <path d={EUPHRATES} fill="none" stroke="#3f7fb0" strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
            <path d={TIGRIS} fill="none" stroke="#3f7fb0" strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
            <text x="470" y="330" style={S.riverLabel}>Euphrates</text>
            <text x="690" y="360" style={S.riverLabel}>Tigris</text>

            {/* peoples/empires — soft blurred glows sized from their cities,
                NOT political borders. Each fades gently in and out as `year`
                approaches and leaves its span (see cultures.js's `region` note). */}
            {regionGeom.map((c) => {
              const w = fadeWeight(year, c.start, c.end);
              if (w <= 0.02) return null;
              return (
                <circle key={c.name} cx={c.cx} cy={c.cy} r={c.r} fill={c.color}
                  opacity={w * 0.3} filter="url(#soften)" />
              );
            })}

            {/* influence arcs from selected text's sources — line style follows
                each influence's tier: solid = documented, dashed = probable,
                dotted = debated/speculative (see PROJECT-BRIEF.md.pdf section 4) */}
            {selText &&
              selText.influences.map((inf, i) => {
                const from = CITIES[TEXT_BY_ID[inf.from]?.city];
                const to = CITIES[selText.city];
                if (!from || !to) return null;
                const mx = (from.x + to.x) / 2;
                const my = (from.y + to.y) / 2 - 70;
                const dash = LINK_TIER[inf.tier]?.dash;
                return (
                  <path
                    key={i}
                    d={`M${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
                    fill="none" stroke="#e6b84a" strokeWidth="2"
                    strokeDasharray={dash || undefined}
                    opacity="0.9" className={dash ? "arc" : ""}
                  />
                );
              })}

            {/* cities — fade in gently over the 60 years before their
                earliest associated text, rather than switching on abruptly */}
            {Object.entries(CITIES).map(([id, c]) => {
              const revealYear = cityRevealYear[id];
              const w = revealYear === undefined ? 0 : Math.min(1, Math.max(0, (year - revealYear + 60) / 60));
              const lit = w > 0.5;
              const isSel = selText && (selText.city === id || selText.influences.some((f) => TEXT_BY_ID[f.from]?.city === id));
              return (
                <g key={id} opacity={0.32 + w * 0.68}>
                  <circle cx={c.x} cy={c.y} r={isSel ? 7 : 4.5}
                    fill={lit ? "#e6b84a" : "#6b6350"}
                    stroke={isSel ? "#fff3d0" : "none"} strokeWidth="2"
                    className={isSel ? "pulse" : ""} />
                  <text x={c.x + 9} y={c.y + 4} style={{ ...S.cityLabel, fill: lit ? "#e9e0c8" : "#7c745f" }}>
                    {c.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <div style={S.mapNote}>
            Schematic — city positions are approximate, meant for orientation rather than survey accuracy.
            The soft colored glows are a rough sense of where each people/empire was active, sized from
            their associated cities — not political borders, and not claims about any precise extent.
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
        )}

        <InfoPanel selText={selText} onClose={() => setSelected(null)} onSelect={setSelected} />
      </div>

      {/* TIMELINE */}
      <section style={S.timelineWrap} aria-label="Timeline">
        <svg viewBox={`0 0 ${TL_W} ${TL_H}`} style={{ width: "100%", display: "block" }}>
          {/* culture bands — same gentle fade as the map glows above */}
          {CULTURES.map((c, i) => {
            const x1 = tlX(Math.max(c.start, YEAR_MIN));
            const x2 = tlX(Math.min(c.end, YEAR_MAX));
            const y = bandTop + i * (bandH + bandGap);
            const w = fadeWeight(year, c.start, c.end);
            return (
              <g key={c.name} opacity={0.5 + w * 0.5}>
                <rect x={x1} y={y} width={Math.max(2, x2 - x1)} height={bandH} rx="3"
                  fill={c.color} opacity={0.4 + w * 0.5} />
                <text x={x1 + 6} y={y + bandH - 3} style={S.bandLabel}>{c.name}</text>
              </g>
            );
          })}

          {/* axis */}
          <line x1={PAD_L} y1={AXIS_Y} x2={TL_W - PAD_R} y2={AXIS_Y} stroke="#4a4636" strokeWidth="1.5" />
          {ticks.map((y) => (
            <g key={y}>
              <line x1={tlX(y)} y1={AXIS_Y - 4} x2={tlX(y)} y2={AXIS_Y + 4} stroke="#6b6450" strokeWidth="1.5" />
              <text x={tlX(y)} y={AXIS_Y + 20} style={S.tick}>{fmtYear(y)}</text>
            </g>
          ))}

          {/* text markers */}
          {TEXTS.map((t) => {
            const on = revealed(t);
            const isSel = selected === t.id;
            const cx = tlX(t.start);
            return (
              <g key={t.id} className="marker" tabIndex={0} role="button"
                aria-label={`${t.title}, ${t.display}`}
                onClick={() => setSelected(t.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(t.id); } }}
                onMouseEnter={() => setHover(t.id)} onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}>
                <line x1={cx} y1={AXIS_Y} x2={cx} y2={AXIS_Y - 18} stroke={on ? "#e6b84a" : "#524c3b"} strokeWidth="1.5" opacity={on ? 0.9 : 0.4} />
                <circle cx={cx} cy={AXIS_Y - 22} r={isSel ? 8 : 5.5}
                  fill={on ? "#e6b84a" : "#3a3628"} stroke={isSel ? "#fff3d0" : (on ? "#f0d488" : "#524c3b")}
                  strokeWidth={isSel ? 2.5 : 1.5} className={on ? "lit" : ""} />
                {(hover === t.id || isSel) && (
                  <g>
                    <rect x={cx - 4} y={AXIS_Y - 58} width={Math.max(70, t.title.length * 6.4)} height="22" rx="4" fill="#0f0d08" opacity="0.95" />
                    <text x={cx + 2} y={AXIS_Y - 43} style={S.tipText}>{t.title}</text>
                  </g>
                )}
              </g>
            );
          })}

          {/* playhead */}
          <line x1={tlX(year)} y1="8" x2={tlX(year)} y2={AXIS_Y + 8} stroke="#fff3d0" strokeWidth="2" opacity="0.85" />
          <circle cx={tlX(year)} cy="8" r="4" fill="#fff3d0" />
        </svg>

        {/* transport */}
        <div style={S.transport}>
          <button style={S.playBtn} onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause size={18} /> : <Play size={18} />}
            <span>{playing ? "Pause" : year >= YEAR_MAX ? "Replay" : "Play"}</span>
          </button>
          <button style={S.iconBtn} onClick={reset} aria-label="Reset to the beginning"><RotateCcw size={16} /></button>
          <input type="range" min={YEAR_MIN} max={YEAR_MAX} step={1} value={Math.round(year)}
            onChange={(e) => { setPlaying(false); setYear(Number(e.target.value)); }}
            style={S.slider} aria-label="Scrub through time" />
          <div style={S.yearReadout}>{fmtYear(year)}</div>
        </div>
      </section>

      <footer style={S.footer}>
        A starting point, not the last word · {TEXTS.length} texts · dates shown with ranges and confidence · sources noted on each entry
      </footer>
    </div>
  );
}
