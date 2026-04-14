export default function TreeDetailsButton({ leafAgg, isOpen = false, onToggle }) {
  if (!leafAgg) return null;

  return (
    <button
      type="button"
      aria-label={isOpen ? "Sulge haru näitajad" : "Ava haru näitajad"}
      aria-pressed={isOpen}
      className={`tree-details-trigger tree-info-dot ${
        isOpen ? "tree-details-trigger--active" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
    >
      <span className="tree-details-trigger__icon" aria-hidden="true">
        i
      </span>
    </button>
  );
}
