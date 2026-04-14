import TableControls from "../table/TableControls.jsx";
import NgramSections from "../table/NgramSections.jsx";
import { makeCsvDownloader } from "../../utils/table/csv.js";
import { ALL_NS } from "../../constants/pos.js";
import TableExplanationTooltip from "../table/TableExplanationTooltip.jsx";
import Slider from "../shared/Slider.jsx";

export default function AtypicalView({
  rowsByN,
  selectedNs,
  setSelectedNs,
  sortBy,
  sortDir,
  setSort,
  getExamplesForKey,
  setAlpha,
  alpha,
  isLoading = false,
}) {
  const hasAtypicalRows = selectedNs.some((n) =>
    (rowsByN?.[n] || []).some((row) => row.sigAny)
  );

  const handleDownload = makeCsvDownloader({
    rowsByN,
    selectedNs,
    filenamePrefix: "ebatyypilised",
    rowFilter: (r) => r.sigAny,
  });

  return (
    <div className="view-wrapper">
      <div className="view-heading">
        Ebatavaliselt sagedased või harvad sõnaliigid/järjestused
      </div>
      <div className="view-intro">
        Vaates kuvatakse ainult need sõnaliigid ja sõnaliigijärjestused, mis erinevad võrdluskorpusest statistiliselt märgatavalt.
        <br />
        Vaade aitab kiiresti leida mustrid, mis eristuvad sinu tekstis kõige selgemalt.
        <br/>
        <strong>Järjestus kuvatakse vaates, kui selle p-väärtus on väiksem kui liugurilt valitud lävend ehk kui järjestus on ebatüüpiline.</strong>
      </div>
      <Slider setAlpha={setAlpha} alpha={alpha} isLoading={isLoading} />
      <div className="overview-header-row">
        <TableControls
          selectedNs={selectedNs}
          setSelectedNs={setSelectedNs}
          onDownloadCsv={handleDownload}
          downloadLabel={`Laadi alla CSV (${selectedNs.join(",") || "-"})`}
        />
        <TableExplanationTooltip
          label="Tabeli selgitused"
        />
      </div>

      {!hasAtypicalRows && (
        <div className="tree-muted">
          Ebatüüpilisi järjestusi ei leitud.
        </div>
      )}

      <NgramSections
        ns={ALL_NS}
        rowsByN={rowsByN}
        selectedNs={selectedNs}
        titleForN={(n) => `${n}-grammid`}
        rowFilter={(r) => r.sigAny}
        getExamplesForKey={getExamplesForKey}
        sortBy={sortBy}
        sortDir={sortDir}
        setSort={setSort}
      />
    </div>
  );
}
