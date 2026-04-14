import * as Tooltip from "@radix-ui/react-tooltip";

const LEAF_TOOLTIP_TEXT = "Statistiliselt ebatüüpiline sõnaliigijärjestus";

export default function TreeAtypicalTooltip({ color }) {
  return (
    <Tooltip.Provider delayDuration={100} skipDelayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span
            aria-label={LEAF_TOOLTIP_TEXT}
            className="tree-leaf-diamond"
            style={{ background: color }}
          />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            sideOffset={6}
            className="tooltip-content"
          >
            {LEAF_TOOLTIP_TEXT}
            <Tooltip.Arrow className="tooltip-arrow" width={10} height={5} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
