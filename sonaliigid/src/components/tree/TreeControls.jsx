import { ALL_NS } from "../../constants/pos.js";
import DirectionLegend from "../shared/DirectionLegend.jsx";

export default function TreeControls({
  selectedNs,
  setSelectedNs,
  onlyMarked,
  setOnlyMarked,
}) {
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
        <div className="overview-ns">
          {ALL_NS.filter((n) => n > 1).map((n) => (
            <label key={n} className="checkbox-chip">
              <input
                type="checkbox"
                checked={selectedNs.includes(n)}
                onChange={() => toggleN(n)}
              />
              {n}
            </label>
          ))}
          <label className="checkbox-chip overview-extra-chip">
            <input
              type="checkbox"
              checked={onlyMarked}
              onChange={(e) => setOnlyMarked(e.target.checked)}
            />
            Näita ainult ebatüüpilisi järjestusi
          </label>
        </div>
        <DirectionLegend />
      </div>
    </div>
  );
}
