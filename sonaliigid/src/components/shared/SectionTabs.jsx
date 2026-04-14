const SECTION_OPTIONS = [
  { id: "overview", label: "Koondvaade" },
  { id: "atypical", label: "Ebatüüpilised" },
  { id: "tree", label: "Sõnaliigipuu" },
];

export default function SectionTabs({ visible, section, setSection }) {
  if (!visible) return null;

  return (
    <div className="section-toggle-row">
      {SECTION_OPTIONS.map(({ id, label }) => {
        const active = section === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setSection(id)}
            aria-pressed={active}
            className={`section-toggle-btn ${
              active ? "section-toggle-btn--active" : ""
            }`}
          >
            <span className="section-toggle-btn-label">{label}</span>
            <span className="section-toggle-btn-sizer" aria-hidden="true">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
