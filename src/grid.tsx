import { useState, type Dispatch, type SetStateAction } from "react";
import SwapyGrid, { SwapyAddItem } from "./components/badcn/swapyGrid";
import { ClockDisplay } from "./components/clockDisplay";
import { HugeiconsIcon } from "@hugeicons/react";
import { ClockAddIcon } from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./components/ui/tooltip";

export default function Grid({
  closeSidebar,
}: {
  closeSidebar: Dispatch<SetStateAction<boolean>>;
}) {
  const [id, setId] = useState(globalThis.crypto.randomUUID());
  const [size] = useState(() => {
    let w = localStorage.getItem("width");

    if (!w || w === "0") {
      w = String(window.screen.width * 0.4);
      localStorage.setItem("width", w);
    }

    return w;
  });

  return (
    <div style={{ maxWidth: `${size}px` }} className="w-full">
      <SwapyGrid
        className="w-full gap-2"
        initialsCols={3}
        initialSwapyData={[]}
        onEditStart={() => closeSidebar(true)}
        onEditEnd={() => closeSidebar(false)}
      >
        <div className="fixed top-4 right-4">
          <div className="grid gap-2">
            <Tooltip>
              <TooltipTrigger>
                <SwapyAddItem
                  id={id}
                  col={1}
                  row={1}
                  item={<ClockDisplay />}
                  variant={"ghost"}
                  size={"icon-xs"}
                  onAdd={() => setId(globalThis.crypto.randomUUID())}
                >
                  <HugeiconsIcon icon={ClockAddIcon} />
                </SwapyAddItem>
              </TooltipTrigger>
              <TooltipContent>Add clock.</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </SwapyGrid>
    </div>
  );
}
