export default function SortableHeaderCell({
  label,
  column,
  sortBy,
  sortDir,
  setSort,
}) {
  const active = sortBy === column;

  const handleClick = () => {
    setSort((prev) => {
      const prevBy = prev?.by ?? null;
      const prevDir = prev?.dir ?? "asc";
      const isActive = prevBy === column;

      if (!isActive) return { by: column, dir: "asc" };
      if (prevDir === "asc") return { by: column, dir: "desc" };
      return { by: null, dir: "asc" };
    });
  };

  return (
    <th>
      <button
        type="button"
        onClick={handleClick}
        className="th-button"
        aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
      >
        <span className="th-button-label">{label}</span>
        <span className={`sort-icons ${active ? "" : "sort-icons--inactive"}`}>
          <span
            className={
              active && sortDir === "asc"
                ? "sort-icon sort-icon--active"
                : "sort-icon"
            }
          >
            {"\u25B2"}
          </span>
          <span
            className={
              active && sortDir === "desc"
                ? "sort-icon sort-icon--active"
                : "sort-icon"
            }
          >
            {"\u25BC"}
          </span>
        </span>
      </button>
    </th>
  );
}
