import { useState } from "react";
import { X, Link as LinkIcon, Check } from "lucide-react";
import { TEXT_BY_ID, CONFIDENCE_COLOR, LINK_TIER } from "../data/texts.js";
import { S } from "../styles.js";
import Row from "./Row.jsx";

// Fallback for browsers/contexts that block navigator.clipboard (older
// Safari, non-secure contexts, restricted iframes) — a hidden textarea
// plus the deprecated but still near-universally supported execCommand.
function legacyCopy(text, onDone) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); onDone(); } catch { /* nothing more to try */ }
  document.body.removeChild(ta);
}

export default function InfoPanel({ selText, onClose, onSelect }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("text", selText.id);
    const flash = () => { setCopied(true); setTimeout(() => setCopied(false), 1600); };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url.toString()).then(flash, () => legacyCopy(url.toString(), flash));
    } else {
      legacyCopy(url.toString(), flash);
    }
  };

  if (!selText) {
    return (
      <aside style={S.panel} aria-live="polite">
        <div style={S.panelEmpty}>
          <div style={S.panelEmptyMark}>☉</div>
          <p style={S.panelEmptyText}>
            Press <strong>Play</strong>, or click any lit point on the map, timeline, or influence
            web, to open its entry.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside style={S.panel} aria-live="polite">
      <div>
        <button style={S.close} onClick={onClose} aria-label="Close entry"><X size={16} /></button>
        <button style={{ ...S.shareBtn, ...(copied ? S.shareBtnActive : {}) }} onClick={copyLink}
          aria-label="Copy link to this entry" title={copied ? "Link copied!" : "Copy link to this entry"}>
          {copied ? <Check size={16} /> : <LinkIcon size={16} />}
        </button>
        <div style={S.pDate}>{selText.display}</div>
        <h2 style={S.pTitle}>{selText.title}</h2>
        <div style={S.badges}>
          <span style={S.badge}>{selText.tradition}</span>
          <span style={S.badge}>{selText.genre}</span>
          <span style={{ ...S.badge, color: CONFIDENCE_COLOR[selText.confidence], borderColor: CONFIDENCE_COLOR[selText.confidence] }}>
            Confidence: {selText.confidence}
          </span>
          <span style={S.badge}>Claim: {selText.claimType}</span>
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
              <button key={i} style={S.infRow} onClick={() => onSelect(inf.from)}>
                <span style={{ ...S.infArrow, color: LINK_TIER[inf.tier]?.color }}>↳</span>
                <span>
                  <strong>{TEXT_BY_ID[inf.from]?.title}</strong>
                  <span style={S.infTier}> ({LINK_TIER[inf.tier]?.label})</span>
                  <span style={S.infNote}> — {inf.note}</span>
                  {inf.source && <div style={S.infSource}>{inf.source}</div>}
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
    </aside>
  );
}
