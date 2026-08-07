import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Map as MapIcon, Share2 } from "lucide-react";

import { CULTURES } from "./data/cultures.js";
import { TEXTS, TEXT_BY_ID } from "./data/texts.js";
import { YEAR_MIN, YEAR_MAX } from "./data/timeRange.js";
import { fmtYear, fadeWeight } from "./utils.js";
import { S, CSS } from "./styles.js";
import InfoPanel from "./components/InfoPanel.jsx";
import InfluenceWeb from "./components/InfluenceWeb.jsx";
import GlobeMap from "./components/GlobeMap.jsx";

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
  const TL_W = 1000, TL_H = 285, PAD_L = 8, PAD_R = 8, AXIS_Y = 250;
  const tlX = (y) => PAD_L + ((y - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * (TL_W - PAD_L - PAD_R);
  const bandTop = 10, bandH = 11, bandGap = 2;

  const ticks = [];
  for (let y = -2500; y <= 0; y += 500) ticks.push(y);
  ticks.push(-2600); ticks.push(1); [50, 100, 150].forEach((y) => ticks.push(y));

  return (
    <div style={S.root}>
      <style>{CSS}</style>

      <header style={S.header}>
        <div>
          <div style={S.kicker}>An interactive history · Phase 6</div>
          <h1 style={S.h1}>A Living Map of Sacred Literature</h1>
          <p style={S.sub}>
            From the <em>Kesh Temple Hymn</em> (c. 2600 BCE) in the Near East to the <em>Rigveda</em>,
            the <em>Analects</em>, and the <em>Pali Canon</em> further east — one real-geography
            globe, one timeline. Press play to let time move.
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
          <GlobeMap year={year} selected={selected} />
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
