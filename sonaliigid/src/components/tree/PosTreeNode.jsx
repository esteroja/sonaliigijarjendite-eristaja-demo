import { codeToName } from "../../constants/pos";
import { chipTone, pValueIntensity } from "../../utils/shared/intensity.js";
import TreeDetailsButton from "./TreeDetailsButton.jsx";
import TreePathTooltip from "./TreePathTooltip.jsx";
import TreeAtypicalTooltip from "./TreeAtypicalTooltip.jsx";
import {
  TREE_LEVEL_INDENT_PX,
  dirFromShares,
  sortTreeEntries,
} from "../../utils/tree/posTreeUtils.js";

export default function PosTreeNode({
  code,
  data,
  depth = 0,
  path = [],
  markPrefixes,
  markLeafKeys,
  byKey,
  openSet,
  setOpenSet,
  activeDetailKey,
  setActiveDetailKey,
}) {
  const children = data.__children || {};
  const childEntries = sortTreeEntries(Object.entries(children), [...path, code], byKey);
  const hasChildren = Object.keys(children).length > 0;

  const thisPath = [...path, code];
  const thisKey = thisPath.join(",");

  const isOnMarkedPath = markPrefixes.has(thisKey);
  const isMarkedLeaf = markLeafKeys.has(thisKey);

  const leafAgg = byKey.get(thisKey);
  const statsToShow = leafAgg ?? null;

  const myShare = statsToShow?.myShare ?? 0;
  const baseShare = statsToShow?.baseShare ?? 0;
  const dir = statsToShow?.dir ?? dirFromShares(myShare, baseShare);

  const tint = statsToShow
    ? pValueIntensity(statsToShow.p, statsToShow.alphaUsed, statsToShow.sigAny)
    : 0;
  const { bg, border } = chipTone(dir, tint, !!statsToShow?.sigAny);

  const diamondDir = leafAgg?.dir || "equal";
  const diamondColor =
    diamondDir === "down" ? "#e53935" : diamondDir === "up" ? "#1e88e5" : "#666";

  const isOpen = openSet.has(thisKey);
  const isDetailsOpen = activeDetailKey === thisKey;
  const indentStyle = { marginLeft: depth === 0 ? 0 : TREE_LEVEL_INDENT_PX };
  const labelText = codeToName[code] || code;

  const toggleOpen = () => {
    if (!hasChildren) return;
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(thisKey)) next.delete(thisKey);
      else next.add(thisKey);
      return next;
    });
  };

  const toggleControl = hasChildren ? (
    <button
      type="button"
      className="tree-toggle-btn"
      aria-label={isOpen ? "Sulge haru" : "Ava haru"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleOpen();
      }}
    >
      {isOpen ? "\u25BE" : "\u25B8"}
    </button>
  ) : (
    <span className="tree-toggle-spacer" aria-hidden="true" />
  );

  const rowContent = (
    <span className="tree-node-row">
      {toggleControl}
      {hasChildren ? (
        <button
          type="button"
          className="tree-chip tree-chip--button"
          style={{ background: bg, border: `1px solid ${border}` }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleOpen();
          }}
          aria-label={`${isOpen ? "Sulge" : "Ava"} haru: ${labelText}`}
        >
          {labelText}
        </button>
      ) : (
        <span
          className="tree-chip"
          style={{ background: bg, border: `1px solid ${border}` }}
        >
          {labelText}
        </span>
      )}
      <TreeDetailsButton
        leafAgg={leafAgg}
        isOpen={isDetailsOpen}
        onToggle={() =>
          setActiveDetailKey((prev) => (prev === thisKey ? null : thisKey))
        }
      />
      {isOnMarkedPath || isMarkedLeaf ? (
        isMarkedLeaf ? (
          <TreeAtypicalTooltip color={diamondColor} />
        ) : (
          <TreePathTooltip />
        )
      ) : null}
      {isMarkedLeaf && isOnMarkedPath && <TreePathTooltip />}
    </span>
  );

  if (!hasChildren) {
    return (
      <div className="tree-row" style={indentStyle}>
        {rowContent}
      </div>
    );
  }

  return (
    <details open={isOpen} className="tree-details" style={indentStyle}>
      <summary
        className="tree-summary"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {rowContent}
      </summary>

      {isOpen &&
        childEntries.map(([childCode, childData]) => (
          <PosTreeNode
            key={childCode}
            code={childCode}
            data={childData}
            depth={depth + 1}
            path={thisPath}
            markPrefixes={markPrefixes}
            markLeafKeys={markLeafKeys}
            byKey={byKey}
            openSet={openSet}
            setOpenSet={setOpenSet}
            activeDetailKey={activeDetailKey}
            setActiveDetailKey={setActiveDetailKey}
          />
        ))}
    </details>
  );
}
