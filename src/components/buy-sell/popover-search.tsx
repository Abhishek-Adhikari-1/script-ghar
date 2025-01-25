"use client";

import * as React from "react";
import { LuCheck, LuChevronDown } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAllScrips } from "@/server/actions/fetch.data";

export type ScripStatus = {
  value: string;
  label: string;
  id: string;
};

export function PopoverSearch({
  selectedStatus,
  setSelectedStatus,
  isPending,
  setCurrentPrice,
}: {
  selectedStatus: ScripStatus | null;
  setSelectedStatus: React.Dispatch<React.SetStateAction<ScripStatus | null>>;
  isPending: boolean;
  setCurrentPrice: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const [scripList, setScripList] = React.useState<ScripStatus[] | null>();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchingData = async () => {
      const res = await getAllScrips();

      if (res?.success) {
        setScripList(res?.data || null);
      }
    };
    fetchingData();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-card transition-none hover:bg-card"
        >
          <span className="truncate">
            {/* {value
              ? scripList.find((framework) => framework.value === value)?.label
              : "Search Symbol or Scrip..."} */}
            {selectedStatus ? (
              <>{selectedStatus?.label}</>
            ) : (
              <>Search Symbol or Scrip...</>
            )}
          </span>
          <LuChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      {!isPending && (
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search Scrip..." className="h-9" />
            <CommandList>
              <CommandEmpty>No Scrip Found.</CommandEmpty>
              <CommandGroup>
                {scripList?.map((scrip) => (
                  <CommandItem
                    key={scrip.value}
                    value={scrip.value}
                    onSelect={(value) => {
                      setCurrentPrice(0);
                      setSelectedStatus(
                        scripList?.find(
                          (priority) => priority.value === value
                        ) || null
                      );
                      setOpen(false);
                    }}
                  >
                    {scrip.label}
                    <LuCheck
                      className={cn(
                        "ml-auto",
                        selectedStatus?.value === scrip.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
