import AppBar from "./bar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { TooltipProvider } from "./components/ui/tooltip";
import Grid from "./grid";

export default function App() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppBar />
        <main className="w-full">
          <SidebarTrigger className={"fixed bottom-4 right-8"} />
          <div className="w-full min-h-screen grid place-items-center">
            <Grid />
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
