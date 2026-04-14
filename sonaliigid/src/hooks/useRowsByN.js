import { useMemo } from "react";
import { ALL_NS } from "../constants/pos.js";
import { useNgramRows } from "./useNgramRows.js";

export function useRowsByN(summaryData, alpha = null) {
    const rows1 = useNgramRows(summaryData, 1, alpha);
    const rows2 = useNgramRows(summaryData, 2, alpha);
    const rows3 = useNgramRows(summaryData, 3, alpha);
    const rows4 = useNgramRows(summaryData, 4, alpha);
    const rows5 = useNgramRows(summaryData, 5, alpha);
    const rowsByIndex = [rows1, rows2, rows3, rows4, rows5];

    return useMemo(
        () =>
            Object.fromEntries(
                ALL_NS.map((n, index) => [n, rowsByIndex[index]])
            ),
        [rows1, rows2, rows3, rows4, rows5]
    );
}
