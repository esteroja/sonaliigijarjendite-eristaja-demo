import * as Tooltip from "@radix-ui/react-tooltip";

export default function AnalysisInfoTooltip() {
  return (
    <Tooltip.Provider delayDuration={100} skipDelayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span aria-label="Selgitus" className="tooltip-trigger-circle">
            ?
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            sideOffset={6}
            className="tooltip-content tooltip-content--extrawide"
          >
            <div className="tooltip-grid">
              <div>
                Võrdluse aluseks on eesti keele ühendkorpuse 2019. aasta
                koondkorpus.
              </div>
              <div>
                Erinevuste statistiliseks hindamiseks kasutab tööriist
                <strong> log-tõepära testi</strong>.
              </div>
              <div>
                Mitmese testimise mõju vähendamiseks rakendab tööriist
                <strong> Benjamini-Hochbergi meetodit</strong>.
              </div>
            </div>
            <Tooltip.Arrow className="tooltip-arrow" width={10} height={5} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
