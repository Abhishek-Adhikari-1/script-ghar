"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BuySellThemeProvider,
  useBuySellTheme,
} from "@/hooks/use-buy-sell-theme";
import { Slider } from "@/components/ui/slider";
import { useSidebar } from "@/components/ui/sidebar";
import {
  PopoverSearch,
  ScripStatus,
} from "@/components/buy-sell/popover-search";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { buySellFormSchema } from "@/lib/zod-auth-schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  searchSelectedScrip,
  submitScripBuySell,
} from "@/server/order-management/buy-sell.trade";
import OrderTable from "@/components/order-history/order-table";

function TradingFormContent() {
  const { theme, setThemeByMode } = useBuySellTheme();
  const { state } = useSidebar();
  const [isPending, startTransition] = React.useTransition();
  const [value, setValue] = React.useState(1);
  const [selectedStatus, setSelectedStatus] =
    React.useState<ScripStatus | null>(null);
  const [currentPrice, setCurrentPrice] = React.useState<number | null>(0);

  React.useEffect(() => {
    const fetchingData = async () => {
      const res = await searchSelectedScrip(selectedStatus);

      if (res?.success) {
        // setSelectedStatus(res?.data ? res.data[0] : null);
        setCurrentPrice(res?.data ? res.data[0].currentPrice : null);
        console.log(res);
      }
    };
    fetchingData();
  }, [selectedStatus]);

  const form = useForm<z.infer<typeof buySellFormSchema>>({
    resolver: zodResolver(buySellFormSchema),
    defaultValues: {
      action: 1,
      quantity: 0,
      price: 0,
    },
  });

  function onSubmit(values: z.infer<typeof buySellFormSchema>) {
    startTransition(async () => {
      const response = await submitScripBuySell(values, selectedStatus);
      console.log(response);

      if (response?.error) {
        if (response?.error?.cause == "SELECTED_SCRIP_NULL") {
          setSelectedStatus(null);
          alert(response?.error?.message);
        }
      }
    });
  }

  const handleValueChange = (newValue: number[]) => {
    setValue(newValue[0]);
    setThemeByMode(newValue[0]);
  };

  const headerClass = cn(
    "sticky top-13 z-10 border-b p-4 rounded-tr-lg rounded-tl-lg",
    theme === "blue" && "bg-blue-500 dark:bg-blue-800",
    theme === "red" && "bg-red-600 dark:bg-red-800",
    theme === "neutral" && "bg-gray-300 dark:bg-zinc-700"
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative transition-[max-width] ease-linear duration-200",
          state === "expanded"
            ? "md:max-w-[calc(100dvw-16.5rem)]"
            : "md:max-w-[calc(100dvw-4.5rem)]"
        )}
      >
        <Card
          className={cn(
            "backdrop-blur-sm bg-card shadow-lg box-border w-full border-2 dark:border",
            theme === "blue" && "border-blue-600",
            theme === "red" && "border-red-600"
          )}
        >
          <CardHeader className={headerClass}>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div></div>
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center">
                    <span
                      className={cn(
                        "mr-2 text-sm font-medium transition-colors",
                        value === 0
                          ? "text-primary-foreground dark:text-primary"
                          : value !== 1
                          ? "text-zinc-200 dark:text-zinc-400"
                          : "text-muted-foreground"
                      )}
                    >
                      SELL
                    </span>
                    <Slider
                      {...form.register("action")}
                      defaultValue={[1]}
                      value={[value]}
                      onValueChange={handleValueChange}
                      min={0}
                      max={2}
                      step={1}
                      className="w-[4.5rem] cursor-pointer"
                      trackClassName="h-6 rounded-full"
                    />
                    <span
                      className={cn(
                        "ml-2 text-sm font-medium transition-colors",
                        value === 2
                          ? "text-primary-foreground dark:text-primary"
                          : value !== 1
                          ? "text-zinc-200 dark:text-zinc-400"
                          : "text-muted-foreground"
                      )}
                    >
                      BUY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>CLIENT NAME / CODE</Label>
                  <Input
                    placeholder="Enter name or code"
                    defaultValue="Abhishek Adhikari"
                    tabIndex={-1}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label>CLIENT CODE</Label>
                  <Input defaultValue="20230635871" readOnly tabIndex={-1} />
                </div>
                <div className="space-y-2">
                  <Label>FATHER&apos;S NAME</Label>
                  <Input
                    defaultValue="Bishnu Prasad Adhikari"
                    readOnly
                    tabIndex={-1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>PAN</Label>
                  <Input defaultValue="N/A" readOnly tabIndex={-1} />
                </div>
              </div>

              <div className="mt-4">
                <div className="grid gap-6 md:grid-cols-5">
                  <div className="space-y-2">
                    <Label>INST</Label>
                    <Select defaultValue="EQ" disabled={isPending}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EQ">EQ</SelectItem>
                        <SelectItem value="FUT">FUT</SelectItem>
                        <SelectItem value="OPT">OPT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>SYMBOL</Label>
                    <div>
                      <PopoverSearch
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                        isPending={isPending}
                        setCurrentPrice={setCurrentPrice}
                      />
                      {selectedStatus && (
                        <div className="text-[0.85rem] text-muted-foreground">
                          Currently trading this scrip in{" "}
                          <span className="text-primary font-mono font-bold">
                            NPR {currentPrice}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>QTY</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="10"
                              type="tel"
                              autoComplete="off"
                              value={field.value || ""}
                              disabled={isPending}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : parseFloat(value)
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                          <FormDescription>
                            Quantity should be {">="} 10
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>PRICE (NPR)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="0.00"
                              type="tel"
                              autoComplete="off"
                              value={field.value || ""}
                              disabled={isPending}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : parseFloat(value)
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    className="select-none"
                    disabled={value === 1 || isPending}
                  >
                    {value === 1 ? "-" : value === 0 ? "Sell" : "Buy"}
                  </Button>
                </div>
              </div>
            </div>
            <OrderTable />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

export default function TradingForm() {
  return (
    <BuySellThemeProvider>
      <TradingFormContent />
    </BuySellThemeProvider>
  );
}
