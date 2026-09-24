import { useState } from "react";
import AppBar from "./bar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { TooltipProvider } from "./components/ui/tooltip";
import Grid from "./grid";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <TooltipProvider>
      <SidebarProvider open={sidebarOpen}>
        <AppBar />
        <main className="w-full">
          <SidebarTrigger className={"hidden"} />
          <div className="w-full min-h-screen grid place-items-center">
            <Grid closeSidebar={setSidebarOpen} />
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
