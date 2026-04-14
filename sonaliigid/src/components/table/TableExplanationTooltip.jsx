import * as Tooltip from "@radix-ui/react-tooltip";

export default function TableExplanationTooltip({ label, summary }) {
  return (
    <div className="table-help-row">
      <div className="table-help-copy">
        <span className="table-help-label">{label}</span>
        {summary ? <span className="table-help-summary">{summary}</span> : null}
      </div>
      <Tooltip.Provider delayDuration={100} skipDelayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <span
              aria-label="Selgitused"
              className="tooltip-trigger-circle table-help-dot"
            >
              ?
            </span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="top"
              align="start"
              sideOffset={6}
              className="tooltip-content tooltip-content--wide"
            >
              <div className="tooltip-grid">
                <div>
                  <strong>p-väärtus</strong> näitab, kui tõenäoline on, et selline erinevus on juhuslik (FDR-korrigeeritud). Mida väiksem on p-väärtus, seda vähem tõenäoline on, et erinevus on juhuslik.
                </div>
                <div>
                  <strong>Sinine:</strong> järjestus on suhteliselt sagedasem minu tekstis kui võrdluskorpuses
                </div>
                <div>
                  <strong>Punane:</strong> järjestus on suhteliselt harvem minu tekstis kui võrdluskorpuses
                </div>
                <div>
                  <strong>Värvi</strong> intensiivsem toon tähendab väiksemat p-väärtust.
                </div>
                <div>
                  <strong>Osakaalud</strong> näitavad, kui suure osa moodustab järjestus kõigist sama pikkusega järjestustest eraldi minu tekstis või võrdluskorpuses.
                </div>
              </div>
              <Tooltip.Arrow className="tooltip-arrow" width={10} height={5} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
