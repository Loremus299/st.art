import { useState } from "react";
import AppBar from "./bar";
import { SidebarProvider } from "./components/ui/sidebar";
import { TooltipProvider } from "./components/ui/tooltip";
import Grid from "./grid";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [background] = useState(() => {
    let image = localStorage.getItem("image");
    let type = localStorage.getItem("image-type");

    if (!image || !type || image === "" || type === "") {
      localStorage.setItem("image", "");
      localStorage.setItem("image-type", "");
      image = "";
      type = "";
    }

    return { image, type };
  });
  return (
    <TooltipProvider>
      <SidebarProvider open={sidebarOpen}>
        <AppBar />
        <main className="w-full">
          <div
            className="w-full min-h-screen grid place-items-center"
            style={{
              backgroundImage:
                background.type === "url"
                  ? `url("${background.image}")`
                  : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Grid closeSidebar={setSidebarOpen} />
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
