export default function DirectionLegend() {
  return (
    <div className="direction-legend-block" aria-label="Värvide tähendus">
      <div className="direction-legend">
        <span className="direction-legend-item">
          <span
            className="direction-legend-swatch direction-legend-swatch--blue"
            aria-hidden="true"
          />
          Sagedasem minu tekstis
        </span>
        <span className="direction-legend-item">
          <span
            className="direction-legend-swatch direction-legend-swatch--red"
            aria-hidden="true"
          />
          Harvem minu tekstis
        </span>
      </div>
    </div>
  );
}
