import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import SwapyGrid, {
  SwapyAddItem,
  type SwapyNode,
} from "./components/badcn/swapyGrid";
import { ClockDisplay } from "./components/clockDisplay";
import { HugeiconsIcon } from "@hugeicons/react";
import { ClockAddIcon } from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./components/ui/tooltip";
import dexie from "./dexie";

export default function Grid({
  closeSidebar,
}: {
  closeSidebar: Dispatch<SetStateAction<boolean>>;
}) {
  const [id, setId] = useState(globalThis.crypto.randomUUID());
  const [data, setData] = useState<SwapyNode[]>([]);

  useEffect(() => {
    const x = async () => {
      const items = await tableToData();
      console.log(items);
      setData(items);
    };
    x();
  }, []);
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
        initialEdit={false}
        initialSwapyData={data}
        onEditStart={async () => {
          closeSidebar(true);
        }}
        onEditEnd={(items) => {
          items.forEach((item, index) => {
            dexie.updateItemById(item.id, index, {
              col: item.col,
              row: item.row,
            });
          });
          closeSidebar(false);
        }}
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
                  variant={"secondary"}
                  size={"icon-xs"}
                  onAdd={async () => {
                    await dexie.addItem({
                      type: "clock",
                      row: 1,
                      col: 1,
                      index: 10000,
                      reference: id,
                    });
                    setId(globalThis.crypto.randomUUID());
                  }}
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

async function tableToData() {
  const table = await dexie.readAllItems();
  const data: SwapyNode[] = [];
  for (const item of table) {
    if (item.type === "clock") {
      data.push({
        col: item.col,
        row: item.row,
        id: item.reference,
        node: <ClockDisplay />,
      });
    }
  }

  return data;
}
