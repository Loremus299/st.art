import { useState, type ReactNode } from "react";
import SwapyGrid, { SwapyAddItem } from "./components/badcn/swapyGrid";

export default function Grid() {
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
      <SwapyGrid className="w-full gap-2" initialsCols={3}>
        <SwapyAddItem
          id={globalThis.crypto.randomUUID()}
          col={1}
          row={1}
          item={<Display>Hi</Display>}
          className={"rounded-xl min-h-20 w-full h-full"}
        />
      </SwapyGrid>
    </div>
  );
}

function Display({ children }: { children: ReactNode }) {
  return (
    <div className="border rounded-md w-full min-h-20 h-full grid place-items-center bg-amber-900">
      {children}
    </div>
  );
}
