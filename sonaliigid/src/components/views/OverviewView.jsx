import TableControls from "../table/TableControls.jsx";
import NgramSections from "../table/NgramSections.jsx";
import { makeCsvDownloader } from "../../utils/table/csv.js";
import { ALL_NS } from "../../constants/pos.js";
import TableExplanationTooltip from "../table/TableExplanationTooltip.jsx";

export default function OverviewView({
  rowsByN,
  selectedNs,
  setSelectedNs,
  sortBy,
  sortDir,
  setSort,
  getExamplesForKey,
}) {
  const handleDownload = makeCsvDownloader({
    rowsByN,
    selectedNs,
    filenamePrefix: "koondvaade",
  });
  const hasSelectedNs = selectedNs.length > 0;

  return (
    <div className="view-wrapper">
      <div className="view-heading">Kõik sõnaliigid ja sõnaliikide järjestused</div>
      <div className="view-intro">
        Vaates näed kõiki oma tekstis leitud sõnaliike ja sõnaliigijärjestusi koos nende sageduse, osakaalu ja võrdluskorpuse vastavate näitajatega.
        <br />
        Vaade aitab saada üldpildi sellest, millised mustrid tekstis esinevad.
      </div>
      <div className="overview-header-row">
        <TableControls
          selectedNs={selectedNs}
          setSelectedNs={setSelectedNs}
          onDownloadCsv={handleDownload}
          downloadLabel={`Laadi alla CSV (${selectedNs.join(",") || "—"})`}
        />
        <TableExplanationTooltip
          label="Tabeli selgitused"
        />
      </div>
      {!hasSelectedNs && (
        <div className="tree-muted">
          Vali järjestuse pikkus.
        </div>
      )}
      <NgramSections
        ns={ALL_NS}
        rowsByN={rowsByN}
        selectedNs={selectedNs}
        titleForN={(n) => `${n}-grammid`}
        getExamplesForKey={getExamplesForKey}
        sortBy={sortBy}
        sortDir={sortDir}
        setSort={setSort}
      />
    </div>
  );
}
