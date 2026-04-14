import NgramTable from "./NgramTable.jsx";

export default function NgramSections({
                                          ns,
                                          rowsByN,
                                          selectedNs,
                                          titleForN,
                                          rowFilter,
                                          getExamplesForKey,
                                          sortBy,
                                          sortDir,
                                          setSort,
                                      }) {
    const visibleSections = [];
    let nextStartIndex = 0;

    ns
        .filter((n) => selectedNs.includes(n))
        .forEach((n) => {
            const baseRows = rowsByN?.[n] || [];
            const rows = typeof rowFilter === "function" ? baseRows.filter(rowFilter) : baseRows;
            if (!rows.length) return;

            visibleSections.push({
                n,
                rows,
                startIndex: nextStartIndex,
            });
            nextStartIndex += rows.length;
        });

    return (
        <>
            {visibleSections.map(({ n, rows, startIndex }) => (
                <section key={n} className="view-section">
                    <h3 className="view-section-title">{titleForN(n)}</h3>

                    <NgramTable
                        n={n}
                        rows={rows}
                        startIndex={startIndex}
                        getExamplesForKey={getExamplesForKey}
                        sortBy={sortBy}
                        sortDir={sortDir}
                        setSort={setSort}
                    />
                </section>
            ))}
        </>
    );
}
