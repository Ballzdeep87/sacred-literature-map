import { useMemo } from "react";
import { TEXTS, TEXT_BY_ID, LINK_TIER } from "../data/texts.js";
import { LANES, TEXT_LANE } from "../data/lanes.js";
import { makeTimeScale, TIME_TICKS } from "../timeScale.js";
import { fmtYear } from "../utils.js";
import { S } from "../styles.js";

/* ------------------------------------------------------------------ *
 * Phase 4 — the dedicated influence view.
 *
 * Every text, on the same time axis as the map's timeline, grouped
 * into rows by literary tradition (src/data/lanes.js) instead of by
 * geography. Every influence line is drawn at once — solid/dashed/
 * dotted by claim tier, exactly as on the map (PROJECT-BRIEF.md.pdf
 * section 4) — so the whole web of dependency is visible together,
 * not one text at a time.
 * ------------------------------------------------------------------ */

const W = 1000;
const PAD_L = 8, PAD_R = 8;
const LANE_H = 96;
const ROW_GAP = 24;
const AXIS_Y_GAP = 30;

const timeScale = makeTimeScale(W - PAD_L - PAD_R);
const tlX = (y) => PAD_L + timeScale(y);

// Greedy row-packing so nodes close in time within the same lane don't
// overlap — the classic "interval scheduling" trick, not a claim about
// any ordering beyond "these are close together in time."
function packRows(items, minGapPx) {
  const rowLastX = [];
  return items.map((item) => {
    let row = rowLastX.findIndex((lastX) => item.x - lastX >= minGapPx);
    if (row === -1) { row = rowLastX.length; rowLastX.push(item.x); }
    else { rowLastX[row] = item.x; }
    return { ...item, row };
  });
}

export default function InfluenceWeb({ year, selected, onSelect, hover, onHover }) {
  const nodes = useMemo(() => {
    const byLane = {};
    LANES.forEach((l) => { byLane[l.id] = []; });
    TEXTS.forEach((t) => {
      const laneId = TEXT_LANE[t.id];
      if (!laneId) return;
      byLane[laneId].push({ id: t.id, title: t.title, start: t.start, x: tlX(t.start) });
    });
    const laid = {};
    let cursorY = 26;
    const laneMeta = {};
    LANES.forEach((lane) => {
      const items = byLane[lane.id].slice().sort((a, b) => a.x - b.x);
      const packed = packRows(items, 24);
      const rows = Math.max(1, ...packed.map((p) => p.row + 1));
      const laneTop = cursorY;
      const laneHeight = 30 + rows * ROW_GAP;
      packed.forEach((p) => {
        laid[p.id] = { ...p, y: laneTop + 30 + p.row * ROW_GAP };
      });
      laneMeta[lane.id] = { top: laneTop, height: laneHeight, ...lane };
      cursorY += laneHeight + 10;
    });
    return { positions: laid, laneMeta, totalHeight: cursorY + AXIS_Y_GAP };
  }, []);

  const { positions, laneMeta, totalHeight } = nodes;

  const edges = useMemo(() => {
    const list = [];
    TEXTS.forEach((t) => {
      t.influences.forEach((inf, i) => {
        if (!positions[inf.from] || !positions[t.id]) return;
        list.push({ key: `${t.id}-${i}`, from: inf.from, to: t.id, tier: inf.tier });
      });
    });
    return list;
  }, [positions]);

  const revealWeight = (t) => Math.min(1, Math.max(0, (year - t.start + 60) / 60));

  const selText = selected ? TEXT_BY_ID[selected] : null;
  const AXIS_Y = totalHeight - AXIS_Y_GAP + 6;

  return (
    <section style={S.mapWrap} aria-label="Influence web — every text and its influences, grouped by tradition">
      <svg viewBox={`0 0 ${W} ${totalHeight}`} style={S.mapSvg} role="img">
        <rect x="0" y="0" width={W} height={totalHeight} fill="#0f0d08" />

        {/* lane bands + labels */}
        {LANES.map((lane) => {
          const m = laneMeta[lane.id];
          if (!m) return null;
          return (
            <g key={lane.id}>
              <rect x="0" y={m.top} width={W} height={m.height} fill={lane.color} opacity="0.06" />
              <text x={PAD_L} y={m.top + 16} style={{ ...S.bandLabel, fill: lane.color, fontSize: "11px" }}>
                {lane.label}
              </text>
            </g>
          );
        })}

        {/* axis */}
        <line x1={PAD_L} y1={AXIS_Y} x2={W - PAD_R} y2={AXIS_Y} stroke="#2b2718" strokeWidth="1.5" />
        {TIME_TICKS.map((y) => (
          <text key={y} x={tlX(y)} y={AXIS_Y + 16} style={S.tick}>{fmtYear(y)}</text>
        ))}

        {/* every influence edge, all at once — the point of this view */}
        {edges.map((e) => {
          const from = positions[e.from];
          const to = positions[e.to];
          const toText = TEXT_BY_ID[e.to];
          const w = revealWeight(toText);
          if (w <= 0.02) return null;
          const tierInfo = LINK_TIER[e.tier];
          const related = selText && (e.from === selText.id || e.to === selText.id);
          const dimmed = selText && !related;
          const dx = (to.x - from.x) * 0.4;
          return (
            <path
              key={e.key}
              d={`M${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`}
              fill="none"
              stroke={tierInfo?.color || "#e6b84a"}
              strokeWidth={related ? 2.6 : 1.6}
              strokeDasharray={tierInfo?.dash || undefined}
              opacity={(dimmed ? 0.1 : related ? 0.95 : 0.4) * w}
              className={tierInfo?.dash ? "arc" : ""}
            />
          );
        })}

        {/* nodes */}
        {TEXTS.map((t) => {
          const pos = positions[t.id];
          if (!pos) return null;
          const lane = LANES.find((l) => l.id === TEXT_LANE[t.id]);
          const w = revealWeight(t);
          const isSel = selected === t.id;
          const isHover = hover === t.id;
          return (
            <g key={t.id} opacity={0.25 + w * 0.75}>
              <g
                className="marker" tabIndex={0} role="button"
                aria-label={`${t.title}, ${t.display}`}
                onClick={() => onSelect(t.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(t.id); } }}
                onMouseEnter={() => onHover(t.id)} onMouseLeave={() => onHover(null)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={pos.x} cy={pos.y} r={isSel ? 8 : 5.5}
                  fill={w > 0.5 ? lane?.color : "#3a3628"}
                  stroke={isSel ? "#fff3d0" : "#12100a"} strokeWidth={isSel ? 2.5 : 1.5}
                  className={isSel ? "pulse" : ""} />
                {(isHover || isSel) && (
                  <g>
                    <rect x={pos.x - 4} y={pos.y - 30} width={Math.max(70, t.title.length * 6.2)} height="20" rx="4" fill="#0f0d08" opacity="0.95" />
                    <text x={pos.x + 2} y={pos.y - 16} style={S.tipText}>{t.title}</text>
                  </g>
                )}
              </g>
            </g>
          );
        })}

        {/* playhead */}
        <line x1={tlX(year)} y1="4" x2={tlX(year)} y2={AXIS_Y} stroke="#fff3d0" strokeWidth="1.5" opacity="0.5" />
      </svg>

      <div style={S.mapNote}>
        Rows group texts by literary tradition, not geography — this is the same {TEXTS.length}{" "}
        texts as the map, laid out to show the whole web of influence at once. Click any point to
        open its entry; its own connections brighten while the rest fade back.
      </div>

      <div style={S.legend}>
        <div style={S.legendGroup}>
          <span style={S.legendLabel}>Influence line:</span>
          <span style={S.legendItem}><span className="legend-line" style={{ borderTopColor: LINK_TIER.documented.color }} /> documented</span>
          <span style={S.legendItem}><span className="legend-line legend-line--dashed" style={{ borderTopColor: LINK_TIER.probable.color }} /> probable</span>
          <span style={S.legendItem}><span className="legend-line legend-line--dotted" style={{ borderTopColor: LINK_TIER.debated.color }} /> debated / speculative</span>
        </div>
      </div>
    </section>
  );
}
