import { useState } from "react";
import SwapyGrid from "./components/badcn/swapyGrid";

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
      <SwapyGrid className="w-full gap-2" initialsCols={3} />
    </div>
  );
}
