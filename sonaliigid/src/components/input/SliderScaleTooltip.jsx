import * as Tooltip from "@radix-ui/react-tooltip";

export default function SliderScaleTooltip() {
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
            className="tooltip-content tooltip-content--wide"
          >
            <div className="tooltip-grid">
              <div>
                <strong>Liuguri tasemete p-väärtuse piirid:</strong>
              </div>
              <div>väga range - p &lt; 0.001</div>
              <div>range - p &lt; 0.005</div>
              <div>keskmine - p &lt; 0.01</div>
              <div>leebe - p &lt; 0.05</div>
              <div>väga leebe - p &lt; 0.1</div>
            </div>
            <Tooltip.Arrow className="tooltip-arrow" width={10} height={5} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
