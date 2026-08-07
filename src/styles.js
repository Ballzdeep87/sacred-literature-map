/* ----------------------------- styles ----------------------------- */
export const serif = 'Palatino, "Palatino Linotype", "Book Antiqua", Georgia, serif';
export const sans = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
export const mono = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

export const CSS = `
  .marker:focus { outline: none; }
  .marker:focus circle { stroke: #fff3d0; stroke-width: 2.5; }
  .lit { filter: drop-shadow(0 0 5px rgba(230,184,74,0.8)); }
  .pulse { animation: pulse 1.6s ease-in-out infinite; }
  .arc { animation: dash 22s linear infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
  @keyframes dash { to { stroke-dashoffset: -400; } }
  input[type=range]{ -webkit-appearance:none; appearance:none; height:4px; border-radius:3px;
    background:#4a4636; outline:none; }
  input[type=range]::-webkit-slider-thumb{ -webkit-appearance:none; width:16px; height:16px;
    border-radius:50%; background:#e6b84a; cursor:pointer; box-shadow:0 0 0 3px rgba(230,184,74,0.25); }
  input[type=range]::-moz-range-thumb{ width:16px; height:16px; border:none; border-radius:50%;
    background:#e6b84a; cursor:pointer; }
  @media (prefers-reduced-motion: reduce){ .pulse,.arc{ animation:none; } }
  .legend-line{ width:18px; height:0; border-top:2px solid #e6b84a; display:inline-block; }
  .legend-line--dashed{ border-top-style:dashed; }
  .legend-line--dotted{ border-top-style:dotted; }
`;

export const S = {
  root: { background: "#12100a", color: "#e9e0c8", fontFamily: sans, minHeight: "100vh", padding: "20px", boxSizing: "border-box" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", flexWrap: "wrap", marginBottom: "16px" },
  kicker: { fontFamily: mono, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#c9a94a", marginBottom: "8px" },
  h1: { fontFamily: serif, fontSize: "30px", margin: "0 0 6px", color: "#f4ecd6", letterSpacing: "0.01em", fontWeight: 600 },
  sub: { margin: 0, maxWidth: "620px", fontSize: "14px", lineHeight: 1.5, color: "#b6ab8e" },
  clock: { textAlign: "right", fontFamily: mono, minWidth: "120px" },

  viewToggle: { display: "inline-flex", gap: "6px", background: "#171308", border: "1px solid #2b2718", borderRadius: "9px", padding: "4px", marginBottom: "16px" },
  viewToggleBtn: { display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", borderRadius: "6px", padding: "7px 14px", fontSize: "12.5px", fontFamily: sans, color: "#a89d7d", cursor: "pointer", fontWeight: 600 },
  viewToggleBtnActive: { background: "#e6b84a", color: "#1a1509" },
  clockLabel: { fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8a815f" },
  clockValue: { fontSize: "26px", color: "#e6b84a", fontWeight: 600 },

  stage: { display: "flex", gap: "16px", alignItems: "stretch", flexWrap: "wrap" },
  mapWrap: { flex: "1 1 560px", background: "#0f0d08", border: "1px solid #2b2718", borderRadius: "12px", padding: "10px", minWidth: "300px" },
  mapSvg: { width: "100%", display: "block", borderRadius: "8px" },
  mapNote: { fontSize: "11px", color: "#7c745f", fontStyle: "italic", marginTop: "6px", paddingLeft: "4px" },
  seaLabel: { fontFamily: serif, fontSize: "13px", fill: "#5f7d97", letterSpacing: "0.1em" },
  riverLabel: { fontFamily: serif, fontSize: "12px", fill: "#6c93b3", fontStyle: "italic" },
  cityLabel: { fontFamily: sans, fontSize: "11px" },

  panel: { flex: "0 1 340px", background: "#171308", border: "1px solid #2b2718", borderRadius: "12px", padding: "18px", position: "relative", minWidth: "260px" },
  panelEmpty: { textAlign: "center", padding: "40px 10px", color: "#8a815f" },
  panelEmptyMark: { fontSize: "34px", color: "#c9a94a", marginBottom: "10px" },
  panelEmptyText: { fontSize: "13px", lineHeight: 1.5 },
  close: { position: "absolute", top: "12px", right: "12px", background: "transparent", border: "none", color: "#8a815f", cursor: "pointer" },
  pDate: { fontFamily: mono, fontSize: "12px", color: "#c9a94a", marginBottom: "4px" },
  pTitle: { fontFamily: serif, fontSize: "21px", margin: "0 0 10px", color: "#f4ecd6", lineHeight: 1.2, paddingRight: "20px" },
  badges: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" },
  badge: { fontSize: "10px", padding: "3px 8px", borderRadius: "20px", border: "1px solid #3f3a28", color: "#c2b791", letterSpacing: "0.03em" },
  pSummary: { fontSize: "14px", lineHeight: 1.55, color: "#d8cdac", margin: "0 0 14px" },
  row: { marginBottom: "10px" },
  rowLabel: { fontFamily: mono, fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a815f", marginBottom: "2px" },
  rowValue: { fontSize: "13px", lineHeight: 1.45, color: "#ded2b0" },
  section: { marginTop: "14px", borderTop: "1px solid #2b2718", paddingTop: "12px" },
  sectionH: { fontFamily: mono, fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a94a", marginBottom: "8px" },
  infRow: { display: "flex", gap: "8px", alignItems: "flex-start", width: "100%", textAlign: "left", background: "transparent", border: "none", color: "#ded2b0", cursor: "pointer", padding: "6px 6px", borderRadius: "6px", fontSize: "12.5px", lineHeight: 1.45 },
  infArrow: { color: "#e6b84a", flexShrink: 0 },
  infTier: { color: "#8a815f", fontSize: "11px", fontStyle: "italic" },
  infNote: { color: "#a89d7d" },
  infSource: { color: "#7c745f", fontFamily: mono, fontSize: "11px", marginTop: "3px" },
  source: { fontSize: "12px", color: "#a89d7d", marginBottom: "4px", fontFamily: mono },

  legend: { display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px", paddingLeft: "4px" },
  legendGroup: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", fontSize: "10.5px", color: "#a89d7d" },
  legendLabel: { fontFamily: mono, letterSpacing: "0.06em", color: "#7c745f", textTransform: "uppercase", fontSize: "9.5px" },
  legendItem: { display: "inline-flex", alignItems: "center", gap: "5px", textTransform: "capitalize" },
  legendDot: { width: "8px", height: "8px", borderRadius: "50%", display: "inline-block" },

  timelineWrap: { background: "#0f0d08", border: "1px solid #2b2718", borderRadius: "12px", padding: "14px 14px 10px", marginTop: "16px" },
  bandLabel: { fontFamily: sans, fontSize: "9px", fill: "#0f0d08", fontWeight: 700, letterSpacing: "0.02em" },
  tick: { fontFamily: mono, fontSize: "10px", fill: "#8a815f", textAnchor: "middle" },
  tipText: { fontFamily: sans, fontSize: "11px", fill: "#f4ecd6", fontWeight: 600 },
  transport: { display: "flex", alignItems: "center", gap: "12px", marginTop: "12px", flexWrap: "wrap" },
  playBtn: { display: "inline-flex", alignItems: "center", gap: "8px", background: "#e6b84a", color: "#1a1509", border: "none", borderRadius: "8px", padding: "9px 16px", fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: sans },
  iconBtn: { display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#1f1a0e", color: "#c9a94a", border: "1px solid #3f3a28", borderRadius: "8px", padding: "9px", cursor: "pointer" },
  slider: { flex: 1, minWidth: "160px" },
  yearReadout: { fontFamily: mono, fontSize: "14px", color: "#e6b84a", minWidth: "84px", textAlign: "right" },

  footer: { marginTop: "16px", fontSize: "11px", color: "#6b6450", fontFamily: mono, letterSpacing: "0.04em", textAlign: "center" },
};
