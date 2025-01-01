"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarTrigger } from "../../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const SideTriggerMbl = ({ type = "" }: { type?: "mobile" | "" }) => {
  const isMobile = useIsMobile();

  if (type === "mobile") {
    return (
      <>
        {isMobile && (
          <SidebarTrigger className="sticky top-2 left-2 bg-muted scale-105 z-50" />
        )}
      </>
    );
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="h-7 w-full px-2" />
          </TooltipTrigger>
          {!isMobile && (
            <TooltipContent>
              <p>Toggle Sidebar ⌘B</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default SideTriggerMbl;
