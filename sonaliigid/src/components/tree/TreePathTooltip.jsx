import * as Tooltip from "@radix-ui/react-tooltip";
import { PATH_ARROW_CHAR, PATH_ARROW_COLOR } from "../../utils/tree/posTreeUtils.js";

const PATH_TOOLTIP_TEXT =
  "Selles harus on p-väärtuse järgi statistiliselt ebatüüpiline järjestus";

export default function TreePathTooltip() {
  return (
    <Tooltip.Provider delayDuration={100} skipDelayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span
            aria-label={PATH_TOOLTIP_TEXT}
            className="tree-path-arrow"
            style={{ color: PATH_ARROW_COLOR }}
          >
            {PATH_ARROW_CHAR}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content side="top" align="center" sideOffset={6} className="tooltip-content">
            {PATH_TOOLTIP_TEXT}
            <Tooltip.Arrow className="tooltip-arrow" width={10} height={5} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
