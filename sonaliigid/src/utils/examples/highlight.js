import { keyFromCodes } from "../shared/keys.js";

function normalizedMatches(matches, filterKey) {
  const active = filterKey
    ? matches.filter((m) => keyFromCodes(m.koodid || []) === filterKey)
    : matches;

  return active
    .filter(
      (m) =>
        typeof m?.algus === "number" &&
        typeof m?.lopp === "number" &&
        m.lopp > m.algus
    )
    .sort((a, b) => a.algus - b.algus || a.lopp - b.lopp);
}

function mergeAdjacentSegments(segments) {
  const merged = [];

  for (const segment of segments) {
    const previous = merged[merged.length - 1];

    if (
      previous &&
      previous.highlight === segment.highlight &&
      (previous.overlapDepth || 0) === (segment.overlapDepth || 0)
    ) {
      previous.text += segment.text;
      continue;
    }

    merged.push({ ...segment });
  }

  return merged;
}

function alignWhitespaceDepth(segments) {
  return segments.map((segment, index) => {
    if (!segment.highlight || !/^\s+$/.test(segment.text)) {
      return segment;
    }

    const previousDepth = segments[index - 1]?.highlight
      ? segments[index - 1].overlapDepth || 0
      : 0;
    const nextDepth = segments[index + 1]?.highlight
      ? segments[index + 1].overlapDepth || 0
      : 0;

    return {
      ...segment,
      overlapDepth: Math.max(segment.overlapDepth || 0, previousDepth, nextDepth),
    };
  });
}

export function buildSegments(sentence, matches, filterKey = null) {
  if (!matches || matches.length === 0) {
    return [{ text: sentence, highlight: false, overlapDepth: 0 }];
  }

  const active = normalizedMatches(matches, filterKey);

  if (active.length === 0) {
    return [{ text: sentence, highlight: false, overlapDepth: 0 }];
  }

  const boundaries = new Set([0, sentence.length]);
  active.forEach((m) => {
    boundaries.add(Math.max(0, Math.min(sentence.length, m.algus)));
    boundaries.add(Math.max(0, Math.min(sentence.length, m.lopp)));
  });

  const orderedBoundaries = [...boundaries].sort((a, b) => a - b);
  const segments = [];

  for (let i = 0; i < orderedBoundaries.length - 1; i += 1) {
    const start = orderedBoundaries[i];
    const end = orderedBoundaries[i + 1];

    if (end <= start) continue;

    const text = sentence.slice(start, end);
    const overlapDepth = active.reduce(
      (count, match) => count + (match.algus < end && match.lopp > start ? 1 : 0),
      0
    );

    segments.push({
      text,
      highlight: overlapDepth > 0,
      overlapDepth,
    });
  }

  return mergeAdjacentSegments(alignWhitespaceDepth(segments));
}
