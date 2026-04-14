import { codeToName } from "../../constants/pos.js";

export const PATH_ARROW_CHAR = "\u2192";
export const PATH_ARROW_COLOR = "#7B1FA2";
export const TREE_LEVEL_INDENT_PX = 16;

export const fmtPct = (x) => `${(x * 100).toFixed(3)}%`;

export function dirFromShares(myShare, baseShare) {
    if (myShare > baseShare) return "up";
    if (myShare < baseShare) return "down";
    return "equal";
}

export function codesToNamesString(key) {
    return key
        .split(",")
        .map((c) => codeToName[c] || c)
        .join(" + ");
}

export function sortTreeEntries(entries, path, byKey) {
    return [...entries].sort(([codeA], [codeB]) => {
        const keyA = [...path, codeA].join(",");
        const keyB = [...path, codeB].join(",");
        const pA = byKey.get(keyA)?.p;
        const pB = byKey.get(keyB)?.p;
        const hasPA = typeof pA === "number";
        const hasPB = typeof pB === "number";

        if (hasPA && hasPB && pA !== pB) return pA - pB;
        if (hasPA !== hasPB) return hasPA ? -1 : 1;

        const labelA = codeToName[codeA] || codeA;
        const labelB = codeToName[codeB] || codeB;
        return labelA.localeCompare(labelB, "et");
    });
}

export function buildPosTree(rows) {
    const root = {};
    const markPrefixes = new Set();
    const markLeafKeys = new Set();
    const byKey = new Map();

    const addStrictPrefixes = (parts) => {
        let acc = [];
        for (let i = 0; i < parts.length - 1; i++) {
            acc.push(parts[i]);
            markPrefixes.add(acc.join(","));
        }
    };

    (rows || []).forEach((row) => {
        const parts = row.key.split(",");
        let node = root;

        parts.forEach((code, i) => {
            if (!node[code]) {
                node[code] = {
                    __children: {},
                    __leaf: null,
                };
            }
            if (i === parts.length - 1) node[code].__leaf = row;
            node = node[code].__children;
        });

        byKey.set(parts.join(","), {
            myCount: row.myCount,
            baasCount: row.baasCount,
            myShare: row.myShare,
            baseShare: row.baseShare,
            sigAny: !!row.sigAny,
            dir: row.dir || "equal",
            p: row.p ?? undefined,
            g2: row.g2 ?? undefined,
            alphaUsed: row.alphaUsed ?? 0.05,
            method: row.method ?? undefined,
        });

        if (row.sigAny) {
            addStrictPrefixes(parts);
            markLeafKeys.add(parts.join(","));
        }
    });

    return {
        root,
        markPrefixes,
        markLeafKeys,
        byKey,
    };
}
