import React from 'react';

// Highlight occurrences of keywords/phrases inside `text` and return an array of React nodes.
// Handles multi-word phrases and tokens that contain punctuation like dots (node.js).
export default function highlightText(text, keywords) {
  if (!text || !keywords || keywords.length === 0) return text;

  const phrases = keywords.filter(k => k && k.trim().includes(' ')).sort((a, b) => b.length - a.length);
  const singles = new Set(keywords.filter(k => k && !k.includes(' ')).map(s => s.toLowerCase()));

  const ranges = [];
  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');

  // phrase matching (allow punctuation inside phrases)
  phrases.forEach(ph => {
    const esc = escapeRegex(ph);
    const re = new RegExp(`(?<!\\w)${esc}(?!\\w)`, 'gi');
    let m;
    while ((m = re.exec(text)) !== null) {
      if (!ranges.some(r => (m.index >= r.start && m.index < r.end) || (m.index + m[0].length > r.start && m.index + m[0].length <= r.end))) {
        ranges.push({ start: m.index, end: m.index + m[0].length, text: m[0] });
      }
    }
  });

  // single/token matching (include dot and apostrophe)
  let idx = 0;
  while (idx < text.length) {
    const m = text.slice(idx).match(/\b[\w'.-]+\b/);
    if (!m) break;
    const wordStart = idx + m.index;
    const wordEnd = wordStart + m[0].length;
    if (!ranges.some(r => (wordStart >= r.start && wordStart < r.end) || (wordEnd > r.start && wordEnd <= r.end))) {
      if (singles.has(m[0].toLowerCase())) {
        ranges.push({ start: wordStart, end: wordEnd, text: m[0] });
      }
    }
    idx = wordEnd;
  }

  ranges.sort((a, b) => a.start - b.start);
  const result = [];
  let pos = 0;
  ranges.forEach((r, i) => {
    if (pos < r.start) result.push(<span key={`t${i}`}>{text.slice(pos, r.start)}</span>);
    result.push(<strong key={`b${i}`}>{r.text}</strong>);
    pos = r.end;
  });
  if (pos < text.length) result.push(<span key="end">{text.slice(pos)}</span>);
  return result.length ? result : text;
}
