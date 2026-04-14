import { useEffect, useMemo, useState } from "react";
import ExamplesModal from "../shared/ExamplesModal.jsx";
import TreeDetailsPanel from "./TreeDetailsPanel.jsx";
import PosTreeNode from "./PosTreeNode.jsx";
import {
    buildPosTree,
    codesToNamesString,
} from "../../utils/tree/posTreeUtils.js";

export default function PosTree({ rows, openRarePaths = false, getExamplesForKey }) {
    const { root, markPrefixes, markLeafKeys, byKey } = useMemo(() => buildPosTree(rows), [rows]);
    const [openSet, setOpenSet] = useState(new Set());
    const [activeDetailKey, setActiveDetailKey] = useState(null);
    const [modal, setModal] = useState({
        open: false,
        keyStr: null,
        title: "",
        items: [],
    });

    useEffect(() => {
        setOpenSet(new Set());
    }, [root]);

    useEffect(() => {
        if (activeDetailKey && !byKey.has(activeDetailKey)) {
            setActiveDetailKey(null);
        }
    }, [activeDetailKey, byKey]);

    useEffect(() => {
        if (openRarePaths) setOpenSet(new Set(markPrefixes));
        else setOpenSet(new Set());
    }, [openRarePaths, markPrefixes]);

    const openExamplesForDetail = async (detail) => {
        if (!detail || typeof getExamplesForKey !== "function") return;

        const raw = (await getExamplesForKey(detail.keyStr)) || [];
        setModal({
            open: true,
            keyStr: detail.keyStr,
            title: detail.title || detail.keyStr,
            items: raw,
        });
    };

    return (
        <>
            <div className={`tree-layout ${activeDetailKey ? "tree-layout--with-panel" : ""}`}>
                <div className="tree-root">
                    {Object.entries(root).map(([code, data]) => (
                        <PosTreeNode
                            key={code}
                            code={code}
                            data={data}
                            path={[]}
                            markPrefixes={markPrefixes}
                            markLeafKeys={markLeafKeys}
                            byKey={byKey}
                            openSet={openSet}
                            setOpenSet={setOpenSet}
                            activeDetailKey={activeDetailKey}
                            setActiveDetailKey={setActiveDetailKey}
                        />
                    ))}
                </div>

                <TreeDetailsPanel
                    detail={
                        activeDetailKey && byKey.has(activeDetailKey)
                            ? {
                                keyStr: activeDetailKey,
                                title: codesToNamesString(activeDetailKey),
                                n: activeDetailKey.split(",").length,
                                leafAgg: byKey.get(activeDetailKey),
                            }
                            : null
                    }
                    onClose={() => setActiveDetailKey(null)}
                    onOpenExamples={openExamplesForDetail}
                />
            </div>

            <ExamplesModal
                open={modal.open}
                title={modal.title}
                items={modal.items}
                keyStr={modal.keyStr}
                onClose={() => setModal({ open: false, keyStr: null, title: "", items: [] })}
            />
        </>
    );
}
