import { useCallback, useMemo, useState } from "react";
import { formatGroupedInt, formatP } from "../../utils/shared/numberFormatting.js";
import { bgForRow } from "../../utils/shared/intensity.js";
import ExamplesModal from "../shared/ExamplesModal.jsx";
import ExamplesPreview from "./ExamplesPreview.jsx";
import SortableHeaderCell from "./SortableHeaderCell.jsx";
import { pct } from "../../utils/table/format.js";
import { keyToUiLabel } from "../../utils/table/posLabel.js";

export default function NgramTable({
  n,
  rows,
  startIndex = 0,
  getExamplesForKey,
  sortBy,
  sortDir,
  setSort,
}) {
  const [modal, setModal] = useState({
    open: false,
    key: null,
    title: "",
    items: [],
  });

  const openExamples = useCallback(
    async (key) => {
      if (typeof getExamplesForKey !== "function") return;
      const raw = (await getExamplesForKey(key)) || [];
      setModal({
        open: true,
        key,
        title: keyToUiLabel(key),
        items: raw,
      });
    },
    [getExamplesForKey]
  );

  const enriched = useMemo(
    () =>
      (rows || []).map((r) => ({
        ...r,
        label: keyToUiLabel(r.key),
      })),
    [rows]
  );

  const sortedRows = useMemo(() => {
    if (!sortBy) return enriched;

    const arr = [...enriched];

    arr.sort((a, b) => {
      let cmp = 0;

      switch (sortBy) {
        case "alphabet":
          cmp = a.label.localeCompare(b.label, "et");
          break;
        case "myCount":
          cmp = (a.myCount ?? 0) - (b.myCount ?? 0);
          break;
        case "baseCount":
          cmp = (a.baasCount ?? 0) - (b.baasCount ?? 0);
          break;
        case "myShare":
          cmp = (a.myShare ?? 0) - (b.myShare ?? 0);
          break;
        case "baseShare":
          cmp = (a.baseShare ?? 0) - (b.baseShare ?? 0);
          break;
        case "p":
          cmp = (a.p ?? Infinity) - (b.p ?? Infinity);
          break;
        default:
          return 0;
      }

      return sortDir === "asc" ? cmp : -cmp;
    });

    return arr;
  }, [enriched, sortBy, sortDir]);

  return (
    <>
      <div className="global-table-wrapper">
        <table className="global-table">
          <colgroup>
            <col className="global-table-col-number" />
            <col className="global-table-col-seq" />
            <col className="global-table-col-mine" />
            <col className="global-table-col-base" />
            <col className="global-table-col-mine" />
            <col className="global-table-col-base" />
            <col className="global-table-col-p" />
            <col className="global-table-col-examples" />
          </colgroup>
          <thead>
            <tr>
              <th className="global-table-number">#</th>
              <SortableHeaderCell
                label={
                  <span className="th-label-stack">
                    <span>{n === 1 ? "Sõnaliik" : "Järjestus"}</span>
                  </span>
                }
                column="alphabet"
                sortBy={sortBy}
                sortDir={sortDir}
                setSort={setSort}
              />
              <SortableHeaderCell
                label={
                  <span className="th-label-stack">
                    <span>Sagedus minu tekstis</span>
                  </span>
                }
                column="myCount"
                sortBy={sortBy}
                sortDir={sortDir}
                setSort={setSort}
              />
              <SortableHeaderCell
                label={
                  <span className="th-label-stack">
                    <span>Sagedus võrdluskorpuses</span>
                  </span>
                }
                column="baseCount"
                sortBy={sortBy}
                sortDir={sortDir}
                setSort={setSort}
              />
              <SortableHeaderCell
                label={
                  <span className="th-label-stack">
                    <span>Osakaal minu tekstis</span>
                  </span>
                }
                column="myShare"
                sortBy={sortBy}
                sortDir={sortDir}
                setSort={setSort}
              />
              <SortableHeaderCell
                label={
                  <span className="th-label-stack">
                    <span>Osakaal võrdluskorpuses</span>
                  </span>
                }
                column="baseShare"
                sortBy={sortBy}
                sortDir={sortDir}
                setSort={setSort}
              />
              <SortableHeaderCell
                label="p-väärtus"
                column="p"
                sortBy={sortBy}
                sortDir={sortDir}
                setSort={setSort}
              />
              <th>Kasutused tekstis</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((r, index) => {
              const rowStyle = {
                background: bgForRow(r.dir, r.p, r.alphaUsed, r.sigAny),
              };

              const canShowExamples = typeof getExamplesForKey === "function";

              return (
                <tr key={r.key} style={rowStyle}>
                  <td className="global-table-number">{startIndex + index + 1}</td>
                  <td className="global-table-cell-text">
                    <span className="global-table-seq">
                      <span>{r.label}</span>
                    </span>
                  </td>
                  <td>{formatGroupedInt(r.myCount)}</td>
                  <td>{formatGroupedInt(r.baasCount)}</td>
                  <td>{pct(r.myShare ?? 0)}</td>
                  <td>{pct(r.baseShare ?? 0)}</td>
                  <td>{r.p != null ? formatP({ p: r.p }) : "—"}</td>
                  <td>
                    {canShowExamples && (
                      <ExamplesPreview
                        keyStr={r.key}
                        getExamplesForKey={getExamplesForKey}
                        openModal={openExamples}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ExamplesModal
        open={modal.open}
        title={modal.title}
        items={modal.items}
        keyStr={modal.key}
        onClose={() =>
          setModal({ open: false, key: null, title: "", items: [] })
        }
      />
    </>
  );
}
