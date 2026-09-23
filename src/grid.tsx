import type { ReactNode } from "react";
import SwapyGrid from "./components/badcn/swapyGrid";

export default function Grid() {
  const { w, h }: { w: string; h: string } = {
    w: localStorage.getItem("width") ?? "1000px",
    h: localStorage.getItem("height") ?? "1000px",
  };

  return (
    <SwapyGrid
      style={{ width: w, height: h }}
      className="w-full"
      initialSwapyData={[
        { id: "1", col: 1, row: 1, node: <DemoDisplay>🍍</DemoDisplay> },
        { id: "2", col: 2, row: 1, node: <DemoDisplay>🍓</DemoDisplay> },
        { id: "3", col: 2, row: 1, node: <DemoDisplay>🍍</DemoDisplay> },
      ]}
    ></SwapyGrid>
  );
}

function DemoDisplay({ children }: { children: ReactNode }) {
  return (
    <div className="p-2 border bg-background rounded-md w-full h-full grid place-items-center">
      {children}
    </div>
  );
}
