import { formatGroupedInt, formatP } from "../../utils/shared/numberFormatting.js";
import { codesToNamesString, fmtPct } from "../../utils/tree/posTreeUtils.js";

export default function TreeDetailsPanel({ detail, onClose, onOpenExamples }) {
  if (!detail) return null;

  const { keyStr, n, leafAgg } = detail;
  const formattedP = formatP({ p: leafAgg?.p });
  const pLabel = formattedP.startsWith("p ") ? formattedP : `p = ${formattedP}`;

  return (
    <aside className="tree-details-panel" aria-live="polite">
      <div className="tree-details-panel__header">
        <div className="tree-details-panel__title">
          {codesToNamesString(keyStr)}
        </div>
        <button
          type="button"
          className="tree-details-panel__close"
          aria-label="Sulge näitajate paneel"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <div className="tree-details-panel__grid">
        <div className="tree-details-panel__item">
          <span className="tree-details-panel__label">Järjestus</span>
          <span className="tree-details-panel__value">{codesToNamesString(keyStr)}</span>
        </div>
        <div className="tree-details-panel__item">
          <span className="tree-details-panel__label">Minu tekstis</span>
          <span className="tree-details-panel__value">
            {formatGroupedInt(leafAgg.myCount)} tk · {fmtPct(leafAgg.myShare)} ({n}-grammidest)
          </span>
        </div>
        <div className="tree-details-panel__item">
          <span className="tree-details-panel__label">Võrdluskorpuses</span>
          <span className="tree-details-panel__value">
            {formatGroupedInt(leafAgg.baasCount)} tk · {fmtPct(leafAgg.baseShare)} ({n}-grammidest)
          </span>
        </div>
        {leafAgg.p != null && (
          <div className="tree-details-panel__item tree-details-panel__item--accent">
            <span className="tree-details-panel__label">p-väärtus</span>
            <span className="tree-details-panel__value">
              {pLabel}
              {leafAgg.sigAny ? (
                <strong className="tree-details-panel__flag">
                  EBATÜÜPILINE JÄRJESTUS
                </strong>
              ) : null}
            </span>
          </div>
        )}
      </div>

      {typeof onOpenExamples === "function" && (
        <div className="tree-details-panel__actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => onOpenExamples(detail)}
          >
            Näita kohti tekstis
          </button>
        </div>
      )}
    </aside>
  );
}
