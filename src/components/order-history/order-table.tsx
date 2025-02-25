"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LuRotateCcw,
  LuChevronRight,
  LuChevronLeft,
  LuChevronFirst,
  LuChevronLast,
} from "react-icons/lu";
import { Button } from "../ui/button";
import { PropSelectedOrders } from "@/app/(dashboard)/(order-management)/buy-sell/trading-box";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";

export const OrderTable = () => {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.N</TableHead>
            <TableHead>ACTION</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>SYMBOL</TableHead>
            <TableHead>TYPE</TableHead>
            <TableHead>QTY</TableHead>
            <TableHead>PRICE(NPR)</TableHead>
            <TableHead>REM QTY</TableHead>
            <TableHead>VALUE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={9}
              className="text-center text-muted-foreground py-4"
            >
              No records available.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <LuChevronFirst className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <LuChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <LuChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <LuChevronLast className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            0 - 0 of 0 items
          </span>
          <Button variant="ghost" size="icon" className="rounded-full">
            <LuRotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const BuySellTable = ({ data }: { data: PropSelectedOrders }) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Sort orders: Buy orders first, then Sell orders
  const sortedData = [...data].sort((a) => (a.action === "sell" ? -1 : 1));

  // Toggle row selection
  const toggleSelection = (index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>
              <input
                type="checkbox"
                onChange={(e) =>
                  setSelectedRows(
                    e.target.checked ? sortedData.map((_, i) => i) : []
                  )
                }
                checked={selectedRows.length === sortedData.length}
              />
            </TableHead>
            <TableHead>S.N</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>QTY</TableHead>
            <TableHead>PRICE (NPR)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground py-4"
              >
                No records available.
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((item, index) => (
              <TableRow
                key={index}
                className={
                  selectedRows.includes(index)
                    ? "transition-colors bg-muted/50"
                    : ""
                }
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(index)}
                    onCheckedChange={() => toggleSelection(index)}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell
                  className={
                    item.action === "buy"
                      ? "text-green-500 font-semibold"
                      : "text-red-500 font-semibold"
                  }
                >
                  {item.action.toUpperCase()}
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <LuChevronFirst className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <LuChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <LuChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <LuChevronLast className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {sortedData.length === 0 ? "0 - 0" : `1 - ${sortedData.length}`} of{" "}
            {sortedData.length} items
          </span>
          <Button variant="ghost" size="icon" className="rounded-full">
            <LuRotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
