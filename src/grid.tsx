import { useState, type ReactNode } from "react";
import SwapyGrid from "./components/badcn/swapyGrid";

export default function Grid() {
  const [size] = useState(() => {
    let w = localStorage.getItem("width");

    if (!w || w === "0") {
      w = String(window.screen.width * 0.8);
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
          { id: "1", col: 1, row: 1, node: <DemoDisplay>🍍</DemoDisplay> },
          { id: "2", col: 2, row: 1, node: <DemoDisplay>🍓</DemoDisplay> },
          { id: "3", col: 3, row: 1, node: <DemoDisplay>🍍</DemoDisplay> },
        ]}
      />
    </div>
  );
}

function DemoDisplay({ children }: { children: ReactNode }) {
  return (
    <div className="p-2 border bg-background rounded-md w-full h-full grid place-items-center">
      {children}
    </div>
  );
}
