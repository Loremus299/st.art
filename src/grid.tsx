import { useState, type Dispatch, type SetStateAction } from "react";
import SwapyGrid from "./components/badcn/swapyGrid";
import { ClockDisplay } from "./components/clockDisplay";

export default function Grid({
  closeSidebar,
}: {
  closeSidebar: Dispatch<SetStateAction<boolean>>;
}) {
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
        initialSwapyData={[
          { id: "0ewfowef", col: 2, row: 1, node: <ClockDisplay /> },
        ]}
        onEditStart={() => closeSidebar(true)}
        onEditEnd={() => closeSidebar(false)}
      >
        <div className="w-full h-full border rounded-md min-h-20 bg-foreground grid place-items-center col-span-3">
          Add Clock
        </div>
      </SwapyGrid>
    </div>
  );
}
