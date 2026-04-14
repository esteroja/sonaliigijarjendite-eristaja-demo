import { memo, useEffect, useMemo, useState } from "react";
import { buildSegments } from "../../utils/examples/highlight.js";
import {
  edgeClassName,
  highlightClassName,
} from "../../utils/examples/exampleHighlightClasses.js";

function readImmediateExamples(getExamplesForKey, keyStr) {
  if (typeof getExamplesForKey !== "function") {
    return { items: [], isAsync: false };
  }

  const result = getExamplesForKey(keyStr);
  if (result && typeof result.then === "function") {
    return { items: [], isAsync: true };
  }

  return { items: result || [], isAsync: false };
}

function ExamplesPreviewInner({ keyStr, getExamplesForKey, openModal }) {
  const immediate = useMemo(
    () => readImmediateExamples(getExamplesForKey, keyStr),
    [getExamplesForKey, keyStr]
  );

  const [asyncItems, setAsyncItems] = useState([]);

  useEffect(() => {
    if (!immediate.isAsync) {
      setAsyncItems([]);
      return;
    }

    let active = true;

    const load = async () => {
      const res = await Promise.resolve(getExamplesForKey(keyStr));
      if (active) {
        setAsyncItems(res || []);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [immediate, keyStr, getExamplesForKey]);

  const items = immediate.isAsync ? asyncItems : immediate.items;

  const preview = useMemo(() => items.slice(0, 3), [items]);
  const hasMore = items.length > 3;
  const totalHits = useMemo(
    () => items.reduce((sum, ex) => sum + (ex.matches?.length ?? 0), 0),
    [items]
  );
  const previewRows = useMemo(
    () =>
      preview.map((ex, index) => ({
        id: index,
        segments: buildSegments(ex.text, ex.matches, keyStr),
      })),
    [preview, keyStr]
  );

  if (!items.length) return null;

  return (
    <div className="examples-preview">
      {previewRows.map((row) => (
        <div key={row.id} className="example-row">
          <p>
            {row.segments.map((seg, index) => (
              <span
                key={index}
                className={`${highlightClassName(seg)} ${edgeClassName(row.segments, index)}`.trim()}
              >
                {seg.text}
              </span>
            ))}
          </p>
        </div>
      ))}

      {hasMore && (
        <button
          className="link-button"
          type="button"
          onClick={() => openModal(keyStr)}
        >
          Näita kõiki ({totalHits} kohta {items.length} lauses)
        </button>
      )}
    </div>
  );
}

const ExamplesPreview = memo(ExamplesPreviewInner);

export default ExamplesPreview;
