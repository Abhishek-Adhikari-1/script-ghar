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

const OrderTable = () => {
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
      <div className="flex items-center justify-between p-4">
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

export default OrderTable;
