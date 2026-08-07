import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, X } from "lucide-react";

/* ------------------------------------------------------------------ *
 * A Living Map of Sacred Literature — Phase 1 preview
 * Schematic map of the ancient Near East + an interactive timeline.
 * Texts "ignite" as time reaches them; click one to see its entry
 * and the scholarly influences flowing into it.
 *
 * Everything below (cities, cultures, texts) is plain data — this is
 * the file we will grow together, one entry at a time.
 * ------------------------------------------------------------------ */

const YEAR_MIN = -2600; // 2600 BCE
const YEAR_MAX = 150; //  150 CE

const fmtYear = (y) => {
  const n = Math.round(y);
  if (n < 0) return `${-n} BCE`;
  if (n === 0) return `1 CE`;
  return `${n} CE`;
};

// --- Schematic geography (viewBox 1000 x 620) --------------------------------
const CITIES = {
  antioch: { x: 178, y: 150, label: "Antioch" },
  ugarit: { x: 165, y: 208, label: "Ugarit" },
  jerusalem: { x: 192, y: 396, label: "Jerusalem" },
  qumran: { x: 210, y: 414, label: "Qumran" },
  mari: { x: 420, y: 258, label: "Mari" },
  nineveh: { x: 702, y: 162, label: "Nineveh" },
  assur: { x: 662, y: 208, label: "Assur" },
  sippar: { x: 560, y: 346, label: "Sippar" },
  babylon: { x: 544, y: 378, label: "Babylon" },
  kish: { x: 588, y: 368, label: "Kish" },
  kesh: { x: 616, y: 426, label: "Kesh" },
  nippur: { x: 642, y: 440, label: "Nippur" },
  shuruppak: { x: 656, y: 472, label: "Shuruppak" },
  uruk: { x: 646, y: 506, label: "Uruk" },
  larsa: { x: 678, y: 516, label: "Larsa" },
  ur: { x: 666, y: 550, label: "Ur" },
  eridu: { x: 650, y: 574, label: "Eridu" },
};

// Rivers, sea, gulf, mountains as schematic paths
const EUPHRATES =
  "M300 70 C 360 150, 400 210, 420 258 C 450 320, 520 340, 544 378 C 580 430, 640 500, 650 574";
const TIGRIS =
  "M610 60 C 660 110, 700 140, 702 162 C 705 220, 668 250, 672 300 C 678 380, 690 470, 700 540";
const MED_COAST =
  "M120 60 C 150 150, 150 260, 205 360 C 235 415, 235 470, 210 560 L 60 560 L 60 60 Z";
const GULF =
  "M700 540 C 760 560, 860 566, 1000 560 L 1000 620 L 600 620 C 620 590, 660 556, 700 540 Z";

// Culture bands for the timeline (start, end in astronomical-ish years)
const CULTURES = [
  { name: "Sumerians", start: -2900, end: -1900, color: "#c9a94a" },
  { name: "Akkadians", start: -2334, end: -2154, color: "#b5763f" },
  { name: "Babylonians", start: -1894, end: -539, color: "#8a6fb0" },
  { name: "Assyrians", start: -1350, end: -609, color: "#7a8fa6" },
  { name: "Canaanites / Ugarit", start: -1550, end: -1180, color: "#4f9a86" },
  { name: "Israelites & Judeans", start: -1200, end: -586, color: "#5b8dd9" },
  { name: "Persians", start: -550, end: -330, color: "#3f6fae" },
  { name: "Greeks (Hellenistic)", start: -330, end: -63, color: "#6aa4c8" },
  { name: "Romans", start: -63, end: 300, color: "#a85a5a" },
  { name: "Early Christians", start: 30, end: 300, color: "#d98b3f" },
];

// The literature. Everything here is meant to be expanded and corrected.
const TEXTS = [
  {
    id: "kesh_hymn",
    title: "Kesh Temple Hymn",
    start: -2600, end: -2600, display: "c. 2600 BCE",
    confidence: "Medium",
    city: "kesh",
    origin: "Kesh (exact site uncertain; copies from Abu Salabikh & Nippur)",
    civ: "Sumerians", language: "Sumerian", script: "Cuneiform",
    tradition: "Sumerian temple religion", genre: "Temple hymn",
    summary: "A praise-hymn to the temple of the goddess Nintud at Kesh — among the very oldest surviving works of literature.",
    significance: "One of the earliest datable literary compositions on Earth; a natural starting point for the story of sacred writing.",
    sources: ["ETCSL 4.80.2", "Biggs, Inscriptions from Abu Salabikh (1974)"],
    influences: [],
  },
  {
    id: "shuruppak",
    title: "Instructions of Shuruppak",
    start: -2500, end: -2500, display: "c. 2600–2500 BCE (earliest)",
    confidence: "Medium",
    city: "shuruppak",
    origin: "Shuruppak (modern Fara)",
    civ: "Sumerians", language: "Sumerian", script: "Cuneiform",
    tradition: "Sumerian wisdom", genre: "Wisdom / instruction",
    summary: "A father's practical and moral advice to his son — one of the world's oldest wisdom texts.",
    significance: "Founds a genre (paternal instruction) that echoes down to Proverbs and beyond.",
    sources: ["ETCSL 5.6.1", "Alster, Wisdom of Ancient Sumer (2005)"],
    influences: [],
  },
  {
    id: "eridu_genesis",
    title: "Eridu Genesis (Sumerian Flood Story)",
    start: -1600, end: -1600, display: "tablet c. 1600 BCE; composition debated",
    confidence: "Low–Medium",
    city: "nippur",
    origin: "Setting at Eridu/Shuruppak; main copy from Nippur",
    civ: "Sumerians", language: "Sumerian", script: "Cuneiform",
    tradition: "Sumerian myth", genre: "Myth (creation & flood)",
    summary: "Creation of people and cities, then a great flood survived by the pious king Ziusudra.",
    significance: "An early node in the long tradition of Near Eastern flood narratives.",
    sources: ["ETCSL 1.7.4", "Jacobsen, 'The Eridu Genesis' (1981)"],
    influences: [],
  },
  {
    id: "atrahasis",
    title: "Atrahasis",
    start: -1700, end: -1700, display: "c. 1700 BCE (Old Babylonian)",
    confidence: "Medium",
    city: "sippar",
    origin: "Babylonia (copies incl. Sippar)",
    civ: "Babylonians", language: "Akkadian", script: "Cuneiform",
    tradition: "Babylonian myth", genre: "Myth (creation & flood)",
    summary: "Humanity is made to relieve the gods of labour, multiplies, and is nearly wiped out by a flood.",
    significance: "The fullest Mesopotamian creation-and-flood epic; a key comparison for Genesis.",
    sources: ["Lambert & Millard, Atra-ḫasīs (1969)"],
    influences: [],
  },
  {
    id: "gilgamesh",
    title: "Epic of Gilgamesh (Standard Babylonian)",
    start: -1200, end: -1200, display: "c. 1200 BCE; Sumerian tales c. 2100 BCE",
    confidence: "Medium",
    city: "babylon",
    origin: "Babylonia; famous copies from Nineveh's library",
    civ: "Babylonians", language: "Akkadian", script: "Cuneiform",
    tradition: "Babylonian epic", genre: "Epic",
    summary: "A king's quest for meaning and immortality, including a flood account told by its survivor.",
    significance: "The great epic of Mesopotamia; its flood tablet closely parallels earlier and later flood stories.",
    sources: ["George, The Babylonian Gilgamesh Epic (2003)"],
    influences: [
      { from: "atrahasis", note: "The flood in Tablet XI closely follows Atrahasis — most scholars see direct dependence." },
    ],
  },
  {
    id: "enuma_elish",
    title: "Enuma Elish",
    start: -1100, end: -1100, display: "c. 1100 BCE (dating debated)",
    confidence: "Low–Medium",
    city: "babylon",
    origin: "Babylon",
    civ: "Babylonians", language: "Akkadian", script: "Cuneiform",
    tradition: "Babylonian myth", genre: "Creation epic",
    summary: "Marduk defeats the sea-goddess Tiamat and orders the cosmos — Babylon's charter myth.",
    significance: "Its divine-combat pattern is compared with biblical creation and chaos imagery.",
    sources: ["Lambert, Babylonian Creation Myths (2013)"],
    influences: [],
  },
  {
    id: "baal_cycle",
    title: "Baal Cycle",
    start: -1300, end: -1300, display: "c. 1400–1200 BCE",
    confidence: "Medium",
    city: "ugarit",
    origin: "Ugarit (scribe Ilimilku)",
    civ: "Canaanites / Ugarit", language: "Ugaritic", script: "Alphabetic cuneiform",
    tradition: "Canaanite myth", genre: "Myth cycle",
    summary: "The storm-god Baal wins kingship over the sea (Yam) and death (Mot).",
    significance: "Our best window onto Canaanite religion — the world the Hebrew Bible grew out of and against.",
    sources: ["Smith, The Ugaritic Baal Cycle (1994–2009)"],
    influences: [],
  },
  {
    id: "song_deborah",
    title: "Song of Deborah (Judges 5)",
    start: -1100, end: -1100, display: "poem perhaps 12th–10th c. BCE (much debated)",
    confidence: "Low",
    city: "jerusalem",
    origin: "Israelite highlands (northern setting)",
    civ: "Israelites & Judeans", language: "Hebrew", script: "Paleo-Hebrew",
    tradition: "Israelite religion", genre: "Victory poem",
    summary: "A triumphant war-poem celebrating an Israelite victory, often held to be very archaic Hebrew.",
    significance: "A candidate for the oldest layer of the Hebrew Bible; dating is genuinely contested.",
    sources: ["Hendel & Joosten, How Old Is the Hebrew Bible? (2018)"],
    influences: [
      { from: "baal_cycle", note: "Shares storm-god imagery and archaic Canaanite poetic forms — a shared cultural background, not textual borrowing." },
    ],
  },
  {
    id: "torah",
    title: "Torah / Pentateuch traditions",
    start: -600, end: -400, display: "compiled c. 6th–5th c. BCE, from older material",
    confidence: "Low",
    city: "jerusalem",
    origin: "Judah & the Babylonian exile",
    civ: "Israelites & Judeans", language: "Hebrew", script: "Paleo-Hebrew / Aramaic square",
    tradition: "Second Temple Judaism", genre: "Law & narrative",
    summary: "The five books traditionally ascribed to Moses, reaching their shape over centuries of composition and editing.",
    significance: "The foundation of Judaism and, later, Christianity; its formation is one of the liveliest debates in the field.",
    sources: ["Baden, The Composition of the Pentateuch (2012)"],
    influences: [
      { from: "atrahasis", note: "The Genesis flood shares the Mesopotamian pattern; the channel and direction of transmission are debated." },
      { from: "gilgamesh", note: "Flood parallels (a hero, an ark, birds sent out) are close; scholars discuss shared tradition more than direct copying." },
      { from: "baal_cycle", note: "Divine-combat and storm imagery echo Ugaritic myth (e.g. Ps 29; Leviathan/Lotan). Widely noted; mechanism debated." },
    ],
  },
  {
    id: "dead_sea_scrolls",
    title: "Dead Sea Scrolls",
    start: -250, end: 68, display: "c. 250 BCE – 68 CE",
    confidence: "High",
    city: "qumran",
    origin: "Qumran and the Judean Desert",
    civ: "Second Temple Judaism", language: "Hebrew, Aramaic, Greek", script: "Aramaic square / Paleo-Hebrew",
    tradition: "Second Temple Judaism", genre: "Scripture, commentary, rules",
    summary: "A library of biblical and sectarian manuscripts — the oldest copies of much of the Hebrew Bible.",
    significance: "Transformed our picture of the biblical text and of Judaism just before Christianity.",
    sources: ["VanderKam & Flint, The Meaning of the Dead Sea Scrolls (2002)"],
    influences: [
      { from: "torah", note: "Preserve the earliest surviving manuscripts of the Torah — direct textual transmission." },
    ],
  },
  {
    id: "paul",
    title: "Undisputed Letters of Paul",
    start: 49, end: 58, display: "c. 49–58 CE",
    confidence: "High",
    city: "antioch",
    origin: "Written from various cities (Corinth, Ephesus…) — shown here at the eastern Mediterranean",
    civ: "Early Christians", language: "Greek", script: "Greek",
    tradition: "Early Christianity", genre: "Epistle",
    summary: "The earliest Christian writings we possess — real letters to young congregations.",
    significance: "Our first window onto the Jesus movement, predating the Gospels.",
    sources: ["Sanders, Paul: A Very Short Introduction (2001)"],
    influences: [
      { from: "torah", note: "Paul continually reads and reinterprets Israel's scriptures — direct engagement." },
    ],
  },
  {
    id: "mark",
    title: "Gospel of Mark",
    start: 68, end: 68, display: "c. 66–70 CE",
    confidence: "Medium–High",
    city: "antioch",
    origin: "Uncertain (Rome? Syria?)",
    civ: "Early Christians", language: "Greek", script: "Greek",
    tradition: "Early Christianity", genre: "Gospel",
    summary: "The shortest, likely earliest Gospel — urgent and spare.",
    significance: "Widely held to be the first written Gospel and a source for Matthew and Luke.",
    sources: ["Ehrman, The New Testament (7th ed.)"],
    influences: [
      { from: "torah", note: "Frames Jesus through Jewish scripture — direct citation and allusion." },
    ],
  },
  {
    id: "matthew",
    title: "Gospel of Matthew",
    start: 85, end: 85, display: "c. 80–90 CE",
    confidence: "Medium",
    city: "antioch",
    origin: "Often located to Antioch in Syria",
    civ: "Early Christians", language: "Greek", script: "Greek",
    tradition: "Early Christianity", genre: "Gospel",
    summary: "A teaching-rich Gospel presenting Jesus as fulfilling Israel's story.",
    significance: "Shows the early Jesus movement defining itself within Judaism.",
    sources: ["Ehrman, The New Testament (7th ed.)"],
    influences: [
      { from: "mark", note: "Uses most of Mark as a written source (Markan priority) — the majority scholarly view." },
      { from: "torah", note: "Structured around fulfilment of Jewish scripture — direct citation." },
    ],
  },
  {
    id: "luke",
    title: "Gospel of Luke",
    start: 85, end: 85, display: "c. 80–90 CE",
    confidence: "Medium",
    city: "antioch",
    origin: "Uncertain",
    civ: "Early Christians", language: "Greek", script: "Greek",
    tradition: "Early Christianity", genre: "Gospel",
    summary: "An ordered account addressed to 'Theophilus', paired with Acts.",
    significance: "Extends the story from Jesus to the early church.",
    sources: ["Ehrman, The New Testament (7th ed.)"],
    influences: [
      { from: "mark", note: "Uses Mark plus sayings shared with Matthew (the hypothesized 'Q') — direct dependence on Mark." },
    ],
  },
  {
    id: "john",
    title: "Gospel of John",
    start: 100, end: 100, display: "c. 90–110 CE",
    confidence: "Medium",
    city: "antioch",
    origin: "Uncertain (Ephesus?)",
    civ: "Early Christians", language: "Greek", script: "Greek",
    tradition: "Early Christianity", genre: "Gospel",
    summary: "A reflective, distinct Gospel with a high view of Jesus' identity.",
    significance: "Represents a stream of tradition largely independent of the other three.",
    sources: ["Ehrman, The New Testament (7th ed.)"],
    influences: [
      { from: "mark", note: "Shares a broad outline with the earlier Gospels; a direct literary relationship is debated." },
    ],
  },
  {
    id: "didache",
    title: "Didache",
    start: 100, end: 100, display: "c. 50–120 CE (wide range)",
    confidence: "Low",
    city: "antioch",
    origin: "Syria",
    civ: "Early Christians", language: "Greek", script: "Greek",
    tradition: "Early Christianity", genre: "Church manual",
    summary: "An early handbook of Christian ethics, baptism, and community order.",
    significance: "A rare glimpse of how the first congregations actually organised themselves.",
    sources: ["Niederwimmer, The Didache (1998)"],
    influences: [
      { from: "matthew", note: "Shares sayings with Matthew; whether it uses the Gospel or common tradition is debated." },
    ],
  },
  {
    id: "clement",
    title: "1 Clement",
    start: 96, end: 96, display: "c. 95–96 CE",
    confidence: "Medium–High",
    city: "antioch",
    origin: "Written from Rome (shown here at the eastern Mediterranean)",
    civ: "Early Christians", language: "Greek", script: "Greek",
    tradition: "Early Christianity", genre: "Epistle",
    summary: "A letter from the church at Rome to Corinth urging unity.",
    significance: "Among the earliest Christian writings outside the New Testament.",
    sources: ["Ehrman, Apostolic Fathers (Loeb, 2003)"],
    influences: [
      { from: "paul", note: "Cites and echoes Paul (especially 1 Corinthians) — direct knowledge." },
    ],
  },
];

const TEXT_BY_ID = Object.fromEntries(TEXTS.map((t) => [t.id, t]));

const CONFIDENCE_COLOR = {
  High: "#7bbf8f",
  "Medium–High": "#a9c47a",
  Medium: "#d8b24a",
  "Low–Medium": "#dc9a4a",
  Low: "#d0743f",
};

export default function App() {
  const [year, setYear] = useState(YEAR_MIN);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState(null);
  const [hover, setHover] = useState(null);
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
          <div style={S.kicker}>An interactive history · Phase 1 preview</div>
          <h1 style={S.h1}>A Living Map of Sacred Literature</h1>
          <p style={S.sub}>
            From the <em>Kesh Temple Hymn</em> (c. 2600 BCE) toward early Christianity. Press
            play to let time move — texts light up as the world reaches them.
          </p>
        </div>
        <div style={S.clock}>
          <div style={S.clockLabel}>Year</div>
          <div style={S.clockValue}>{fmtYear(year)}</div>
        </div>
      </header>

      <div style={S.stage}>
        {/* MAP */}
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

            {/* influence arcs from selected text's sources */}
            {selText &&
              selText.influences.map((inf, i) => {
                const from = CITIES[TEXT_BY_ID[inf.from]?.city];
                const to = CITIES[selText.city];
                if (!from || !to) return null;
                const mx = (from.x + to.x) / 2;
                const my = (from.y + to.y) / 2 - 70;
                return (
                  <path
                    key={i}
                    d={`M${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
                    fill="none" stroke="#e6b84a" strokeWidth="2" strokeDasharray="5 5"
                    opacity="0.9" className="arc"
                  />
                );
              })}

            {/* cities */}
            {Object.entries(CITIES).map(([id, c]) => {
              const relatedTexts = TEXTS.filter((t) => t.city === id);
              const anyRevealed = relatedTexts.some(revealed);
              const isSel = selText && (selText.city === id || selText.influences.some((f) => TEXT_BY_ID[f.from]?.city === id));
              return (
                <g key={id} opacity={anyRevealed ? 1 : 0.32}>
                  <circle cx={c.x} cy={c.y} r={isSel ? 7 : 4.5}
                    fill={anyRevealed ? "#e6b84a" : "#6b6350"}
                    stroke={isSel ? "#fff3d0" : "none"} strokeWidth="2"
                    className={isSel ? "pulse" : ""} />
                  <text x={c.x + 9} y={c.y + 4} style={{ ...S.cityLabel, fill: anyRevealed ? "#e9e0c8" : "#7c745f" }}>
                    {c.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <div style={S.mapNote}>Schematic — city positions are approximate, meant for orientation rather than survey accuracy.</div>
        </section>

        {/* INFO PANEL */}
        <aside style={S.panel} aria-live="polite">
          {!selText ? (
            <div style={S.panelEmpty}>
              <div style={S.panelEmptyMark}>☉</div>
              <p style={S.panelEmptyText}>
                Press <strong>Play</strong>, or click any lit point on the map or timeline, to open its entry.
              </p>
            </div>
          ) : (
            <div>
              <button style={S.close} onClick={() => setSelected(null)} aria-label="Close entry"><X size={16} /></button>
              <div style={S.pDate}>{selText.display}</div>
              <h2 style={S.pTitle}>{selText.title}</h2>
              <div style={S.badges}>
                <span style={S.badge}>{selText.tradition}</span>
                <span style={S.badge}>{selText.genre}</span>
                <span style={{ ...S.badge, color: CONFIDENCE_COLOR[selText.confidence], borderColor: CONFIDENCE_COLOR[selText.confidence] }}>
                  {selText.confidence} confidence
                </span>
              </div>
              <p style={S.pSummary}>{selText.summary}</p>

              <Row label="Origin" value={selText.origin} />
              <Row label="People" value={selText.civ} />
              <Row label="Language" value={`${selText.language} · ${selText.script}`} />
              <Row label="Why it matters" value={selText.significance} />

              {selText.influences.length > 0 && (
                <div style={S.section}>
                  <div style={S.sectionH}>Influences flowing in</div>
                  {selText.influences.map((inf, i) => (
                    <button key={i} style={S.infRow} onClick={() => setSelected(inf.from)}>
                      <span style={S.infArrow}>↳</span>
                      <span>
                        <strong>{TEXT_BY_ID[inf.from]?.title}</strong>
                        <span style={S.infNote}> — {inf.note}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div style={S.section}>
                <div style={S.sectionH}>Sources</div>
                {selText.sources.map((s, i) => (<div key={i} style={S.source}>{s}</div>))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* TIMELINE */}
      <section style={S.timelineWrap} aria-label="Timeline">
        <svg viewBox={`0 0 ${TL_W} ${TL_H}`} style={{ width: "100%", display: "block" }}>
          {/* culture bands */}
          {CULTURES.map((c, i) => {
            const x1 = tlX(Math.max(c.start, YEAR_MIN));
            const x2 = tlX(Math.min(c.end, YEAR_MAX));
            const y = bandTop + i * (bandH + bandGap);
            const active = year >= c.start && year <= c.end;
            return (
              <g key={c.name} opacity={active ? 1 : 0.5}>
                <rect x={x1} y={y} width={Math.max(2, x2 - x1)} height={bandH} rx="3"
                  fill={c.color} opacity={active ? 0.9 : 0.4} />
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

function Row({ label, value }) {
  return (
    <div style={S.row}>
      <div style={S.rowLabel}>{label}</div>
      <div style={S.rowValue}>{value}</div>
    </div>
  );
}

/* ----------------------------- styles ----------------------------- */
const serif = 'Palatino, "Palatino Linotype", "Book Antiqua", Georgia, serif';
const sans = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const mono = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

const CSS = `
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
`;

const S = {
  root: { background: "#12100a", color: "#e9e0c8", fontFamily: sans, minHeight: "100vh", padding: "20px", boxSizing: "border-box" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", flexWrap: "wrap", marginBottom: "16px" },
  kicker: { fontFamily: mono, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#c9a94a", marginBottom: "8px" },
  h1: { fontFamily: serif, fontSize: "30px", margin: "0 0 6px", color: "#f4ecd6", letterSpacing: "0.01em", fontWeight: 600 },
  sub: { margin: 0, maxWidth: "620px", fontSize: "14px", lineHeight: 1.5, color: "#b6ab8e" },
  clock: { textAlign: "right", fontFamily: mono, minWidth: "120px" },
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
  infNote: { color: "#a89d7d" },
  source: { fontSize: "12px", color: "#a89d7d", marginBottom: "4px", fontFamily: mono },

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
