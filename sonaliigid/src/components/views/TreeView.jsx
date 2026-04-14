import { useMemo, useState } from "react";
import PosTree from "../tree/PosTree.jsx";
import TreeControls from "../tree/TreeControls.jsx";
import TreeExplanationTooltip from "../tree/TreeExplanationTooltip.jsx";
import Slider from "../shared/Slider.jsx";

export default function TreeView({
    rowsByN,
    selectedNs,
    setSelectedNs,
    getExamplesForKey,
    alpha,
    setAlpha,
    isLoading = false,
}) {
    const [onlyMarked, setOnlyMarked] = useState(false);
    const [openMarkedPaths, setOpenMarkedPaths] = useState(true);

    const rows = useMemo(() => {
        const byN = rowsByN || {};
        const treeNs = selectedNs.filter((n) => n > 1);
        const merged = treeNs.flatMap((n) => byN[n] || []);

        return merged.filter((r) => {
            return !(onlyMarked && !r.sigAny);
        });
    }, [rowsByN, selectedNs, onlyMarked]);

    const markedCount = useMemo(() => rows.filter((r) => !!r.sigAny).length, [rows]);
    const disableOpenMarked = markedCount === 0;

    return (
        <div className="view-wrapper">
            <div className="view-heading">Sõnaliigipuu</div>
            <div className="view-intro">
              Vaates on sõnaliigijärjestused esitatud vasakult paremale harudena, kus igal järgmisel tasemel lisandub järjestusele üks sõnaliik.
              <br />
              Vaade aitab näha, kuidas pikemad järjestused moodustuvad lühematest.
              <br/>
              <strong>
                Järjestuse kõrval kuvatakse sümbol
                <span
                  aria-hidden="true"
                  className="tree-leaf-diamond"
                  style={{ background: "#000000", marginLeft: 5, marginRight: 5 }}
                />
                , kui selle p-väärtus on väiksem kui liugurilt valitud lävend ehk kui järjestus on ebatüüpiline.</strong>
            </div>
            <Slider setAlpha={setAlpha} alpha={alpha} isLoading={isLoading} />
            <div className="overview-header-row">
                <TreeControls
                    selectedNs={selectedNs}
                    setSelectedNs={setSelectedNs}
                    onlyMarked={onlyMarked}
                    setOnlyMarked={setOnlyMarked}
                />
                <TreeExplanationTooltip label="Puu selgitused" />
            </div>

            <div className="tree-legend">
                <div className="legend-col">
                    {!disableOpenMarked && (
                        <button
                            type="button"
                            className={`rare-toggle-btn ${openMarkedPaths ? "rare-toggle-btn--active" : ""}`}
                            onClick={() => setOpenMarkedPaths((v) => !v)}
                        >
                            {openMarkedPaths ? "Sulge kõik harud" : "Ava ebatüüpiliste järjestustega harud"}
                            {!disableOpenMarked ? ` (${markedCount})` : ""}
                        </button>
                    )}

                    {disableOpenMarked && (
                        <div className="tree-muted">
                            Valitud järjestusi ei leitud.
                        </div>
                    )}
                </div>
            </div>

            {!disableOpenMarked && (
                <div className="tree-help-note">
                    Iga sõnaliigi kõrval olev infonupp avab sõnaliigile eelneva haru täpse võrdluse.
                </div>
            )}

            <PosTree rows={rows} openRarePaths={openMarkedPaths} getExamplesForKey={getExamplesForKey} />
        </div>
    );
}
