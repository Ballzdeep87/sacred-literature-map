import { useState, useMemo, useRef } from "react";
import { Search, X } from "lucide-react";
import { TEXTS } from "../data/texts.js";
import { S } from "../styles.js";

/* ------------------------------------------------------------------ *
 * Phase 9 — jump straight to any text by title, from any view. Filters
 * on title only (not summary/tradition text) — simple, predictable,
 * fast for the stated need. Selecting a result just calls onSelect,
 * same setSelected already used by every marker/node/panel link, so
 * the Map, Influence web, and Timeline all pick it up automatically.
 * ------------------------------------------------------------------ */

const MAX_RESULTS = 8;

export default function SearchBox({ onSelect }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return TEXTS.filter((t) => t.title.toLowerCase().includes(q)).slice(0, MAX_RESULTS);
  }, [query]);

  const open = focused && results.length > 0;

  const pick = (t) => {
    onSelect(t.id);
    setQuery("");
    setActiveIndex(0);
    inputRef.current?.blur();
  };

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) pick(results[activeIndex]);
    } else if (e.key === "Escape") {
      setQuery("");
    }
  };

  return (
    <div style={S.searchWrap}>
      <Search size={13} style={S.searchIcon} />
      <input
        ref={inputRef}
        type="text"
        value={query}
        placeholder="Jump to a text…"
        aria-label="Search texts by title"
        role="combobox"
        aria-expanded={open}
        aria-controls="search-results"
        style={S.searchInput}
        onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {query && (
        <button style={S.searchClear} aria-label="Clear search" onClick={() => { setQuery(""); inputRef.current?.focus(); }}>
          <X size={13} />
        </button>
      )}
      {open && (
        <ul id="search-results" role="listbox" style={S.searchDropdown}>
          {results.map((t, i) => (
            <li key={t.id} role="option" aria-selected={i === activeIndex}>
              <button
                style={{ ...S.searchResult, ...(i === activeIndex ? S.searchResultActive : {}) }}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => { e.preventDefault(); pick(t); }}
              >
                <span style={S.searchResultTitle}>{t.title}</span>
                <span style={S.searchResultMeta}>{t.display}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
