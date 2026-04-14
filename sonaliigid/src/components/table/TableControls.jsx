import { ALL_NS } from "../../constants/pos.js";
import DirectionLegend from "../shared/DirectionLegend.jsx";

export default function TableControls({
  selectedNs,
  setSelectedNs,
  onDownloadCsv,
  downloadLabel = "Laadi alla CSV",
}) {
  const canDownloadCsv = selectedNs.length > 0;

  const toggleN = (n) => {
    setSelectedNs((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n].sort()
    );
  };

  return (
    <div className="overview-controls">
      <div className="overview-filter-group">
        <div className="overview-filter-label">
          Järjestuse (n-grammi) pikkus
        </div>
        <div className="overview-filter-row">
          <div className="overview-ns">
            {ALL_NS.map((n) => (
              <label key={n} className="checkbox-chip">
                <input
                  type="checkbox"
                  checked={selectedNs.includes(n)}
                  onChange={() => toggleN(n)}
                />
                {n}
              </label>
            ))}
          </div>
          {typeof onDownloadCsv === "function" && (
            <div className="overview-actions-row">
              <button
                type="button"
                onClick={onDownloadCsv}
                disabled={!canDownloadCsv}
                className="secondary-button overview-controls-button"
              >
                {downloadLabel}
              </button>
            </div>
          )}
        </div>
        <DirectionLegend />
      </div>
    </div>
  );
}
