import { useMemo } from "react";

export function useNgramRows(summaryData, activeN, alphaOverride = null) {
  return useMemo(() => {
    if (!summaryData) return [];

    const mkRow = (
      key,
      myCount,
      baasCount,
      kokku,
      baasKokku,
      test,
      alphaRow
    ) => {
      const myShare = kokku > 0 ? myCount / kokku : 0;
      const baseShare = (baasKokku || 1) > 0 ? baasCount / baasKokku : 0;
      const p = test ? (test.p_adj ?? test.p) : null;
      const g2 = test?.g2 ?? null;
      const method = test?.meetod ?? null;
      const activeAlpha =
        typeof alphaOverride === "number" ? alphaOverride : alphaRow;
      const sigAny = !!(test && p != null && p < activeAlpha);
      const dir =
        test?.suund ??
        (myShare > baseShare
          ? "up"
          : myShare < baseShare
            ? "down"
            : "equal");
      return {
        key,
        myCount,
        myShare,
        baasCount,
        baseShare,
        sigAny,
        dir,
        p,
        g2,
        method,
        alphaUsed: activeAlpha,
      };
    };

    if (activeN === "all") {
      const lengths = Object.keys(summaryData)
        .map(Number)
        .filter((n) => n >= 1 && n <= 5);
      const globalKokku = lengths.reduce(
        (s, n) => s + (summaryData[String(n)]?.kokku || 0),
        0
      );
      const globalBaasKokku =
        lengths.reduce(
          (s, n) => s + (summaryData[String(n)]?.baas_kokku || 0),
          0
        ) || 1;

      const rowsAll = [];
      lengths.forEach((n) => {
        const block = summaryData[String(n)];
        if (!block) return;
        const tests = block.testid || {};
        const alphaRow = typeof block.alpha === "number" ? block.alpha : 0.05;

        Object.entries(block.jarjestused || {}).forEach(([key, myCount]) => {
          const baasCount = (block.baas_jarjestused || {})[key] || 0;
          const test = tests[key];
          rowsAll.push(
            mkRow(
              key,
              myCount,
              baasCount,
              globalKokku,
              globalBaasKokku,
              test,
              alphaRow
            )
          );
        });
      });
      rowsAll.sort((a, b) => b.myShare - a.myShare);
      return rowsAll;
    }

    const block = summaryData[String(activeN)];
    if (!block) return [];
    const kokku = block.kokku || 0;
    const baasKokku = block.baas_kokku || 1;
    const tests = block.testid || {};
    const alphaRow = typeof block.alpha === "number" ? block.alpha : 0.05;

    const rows = Object.entries(block.jarjestused || {}).map(
      ([key, myCount]) => {
        const baasCount = (block.baas_jarjestused || {})[key] || 0;
        const test = tests[key];
        return mkRow(key, myCount, baasCount, kokku, baasKokku, test, alphaRow);
      }
    );

    rows.sort((a, b) => b.myShare - a.myShare);
    return rows;
  }, [summaryData, activeN, alphaOverride]);
}
