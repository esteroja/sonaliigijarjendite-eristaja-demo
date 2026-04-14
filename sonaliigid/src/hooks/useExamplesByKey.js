import { useCallback, useMemo } from "react";
import { keyFromCodes } from "../utils/shared/keys.js";

function buildExamplesByKey(sourceRows) {
  const map = new Map();
  if (!Array.isArray(sourceRows)) return map;

  sourceRows.forEach((sentenceObj) => {
    const highlights = sentenceObj.esinemised || [];
    if (highlights.length === 0) return;

    const perKey = new Map();

    highlights.forEach((highlight) => {
      const key = keyFromCodes(highlight.koodid || []);
      if (!perKey.has(key)) perKey.set(key, []);
      perKey.get(key).push(highlight);
    });

    for (const [key, matches] of perKey.entries()) {
      if (!map.has(key)) map.set(key, []);
      map.get(key).push({
        text: sentenceObj.tekst,
        matches,
      });
    }
  });

  return map;
}

export function useExamplesByKey(sourceRows) {
  const examplesByKey = useMemo(() => buildExamplesByKey(sourceRows), [sourceRows]);

  return useCallback((key) => examplesByKey.get(key) || [], [examplesByKey]);
}
