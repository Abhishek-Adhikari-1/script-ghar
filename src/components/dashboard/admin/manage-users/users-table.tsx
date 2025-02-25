"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LuArrowUpDown, LuChevronDown, LuTrash2 } from "react-icons/lu";
import { FiMoreHorizontal } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PropsUserList } from "@/app/(dashboard)/(admin)/manage-users/page";
import { IoCopy } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoMailOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteIdentity } from "@/server/actions/user.actions";
import { TbLoader2 } from "react-icons/tb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ActionsCell = ({
  row,
  onUserDeleted,
}: {
  row: Row<PropsUserList>;
  onUserDeleted: (id: string) => void;
}) => {
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);

  const handleDeleteUser = (data: PropsUserList) => {
    startTransition(async () => {
      try {
        const res = await deleteIdentity(data);
        if (res?.success === false) {
          console.error(res);
          return;
        }

        onUserDeleted(data.$id);
        console.log(res);
      } catch (error) {
        console.error(error);
      } finally {
        setOpen(false);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <FiMoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>Send email</DropdownMenuItem>
          <DropdownMenuItem>Generate invoice</DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={() => {
                setOpen(true);
                document.body.style.pointerEvents = "auto";
              }}
              className="text-red-600 dark:text-red-500 dark:hover:text-red-100 hover:bg-red-100 dark:hover:bg-red-900 focus:bg-red-200 focus:text-red-700 dark:focus:text-red-100 dark:focus:bg-red-900 transition-colors duration-75"
            >
              <LuTrash2 className="mr-2 h-4 w-4" />
              Delete user
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete user{" "}
            <b>{row.original.email}</b> account and remove their data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isPending ? (
            <Button variant={"destructive"}>
              Deleting User <TbLoader2 className="animate-spin" />
            </Button>
          ) : (
            <Button
              variant={"destructive"}
              onClick={() => handleDeleteUser(row.original)}
              disabled={isPending}
            >
              Confirm Delete
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export function UsersDataTable({ userList }: { userList: PropsUserList[] }) {
  const { state } = useSidebar();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [users, setUsers] = React.useState<PropsUserList[]>(userList);

  const handleUserDeleted = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.$id !== userId));
  };

  const columns = React.useMemo<ColumnDef<PropsUserList>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "Identity",
        header: "Identity",
        cell: ({ row }) => (
          <div className="flex flex-row items-center gap-2">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                className="object-cover"
                src={row.original.avatar}
                alt={row.original.fullName}
              />
              <AvatarFallback className="rounded-lg">
                {row.original.fullName
                  ?.split(" ")
                  .slice(0, 3)
                  .map((word) => word[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="capitalize">
              <div className="font-semibold">{row.original.fullName}</div>
              <span
                className="relative text-muted-foreground text-[0.7rem]/[0.5rem] bg-muted rounded-sm px-1 py-[0.2rem] cursor-pointer group flex flex-row justify-center items-center max-w-fit"
                title="Click to copy ID"
                onClick={() => navigator.clipboard.writeText(row.original.$id)}
              >
                {row.original.$id}
                <span className="absolute right-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-75 pl-1">
                  <IoCopy />
                </span>
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Email
              <LuArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("email")}</div>
        ),
      },
      {
        accessorKey: "Role",
        header: () => <div>Role</div>,
        cell: ({ row }) => {
          return (
            <div className="flex gap-1">
              {row.original.labels.length > 0 && (
                <>
                  {row.original.labels.map((label) => (
                    <div key={label}>
                      {label === "user" && (
                        <span className="bg-indigo-100 text-indigo-700 text-sm font-medium rounded-sm dark:bg-indigo-900 dark:text-indigo-300 max-w-fit">
                          <span className="px-2">{label}</span>
                        </span>
                      )}
                      {label === "mvp" && (
                        <span className="bg-red-100 text-red-700 text-sm font-medium rounded-sm dark:bg-red-900 dark:text-red-300 max-w-fit">
                          <span className="px-2">{label}</span>
                        </span>
                      )}
                      {label === "admin" && (
                        <span className="bg-orange-100 text-orange-700 text-sm font-medium rounded-sm dark:bg-orange-900 dark:text-orange-300 max-w-fit">
                          <span className="px-2">{label}</span>
                        </span>
                      )}
                      {label === "broker" && (
                        <span className="bg-yellow-100 text-yellow-700 text-sm font-medium rounded-sm dark:bg-yellow-900 dark:text-yellow-400 max-w-fit">
                          <span className="px-2">{label}</span>
                        </span>
                      )}
                      {label !== "user" &&
                        label !== "admin" &&
                        label !== "broker" &&
                        label !== "mvp" && (
                          <span className="bg-gray-100 text-gray-700 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-gray-300 max-w-fit">
                            {label}
                          </span>
                        )}
                    </div>
                  ))}
                </>
              )}
            </div>
            // <Select
            //   onValueChange={(value) => console.log(row.original.$id, value)}
            //   defaultValue={row.original.labels[0]} // Assuming a single role
            // >
            //   <SelectTrigger>
            //     <SelectValue placeholder="Select Role" />
            //   </SelectTrigger>
            //   <SelectContent>
            //     <SelectItem value="user">User</SelectItem>
            //     <SelectItem value="admin">Admin</SelectItem>
            //     <SelectItem value="mvp">MVP</SelectItem>
            //     <SelectItem value="broker">Broker</SelectItem>
            //   </SelectContent>
            // </Select>
          );
        },
      },
      {
        accessorKey: "Account Type",
        header: () => <div>Account Type</div>,
        cell: ({ row }) => (
          <div className="flex gap-2 flex-row">
            {row.original.accountType.map((item) => {
              const size = 20;
              if (item === "email") {
                return (
                  <div key={item} className="relative left-0 top-0">
                    <IoMailOutline size={size} />
                  </div>
                );
              } else if (item === "google") {
                return (
                  <div key={item}>
                    <FcGoogle size={size} />
                  </div>
                );
              } else if (item === "github") {
                return (
                  <div key={item}>
                    <SiGithub size={size} />
                  </div>
                );
              }
            })}
          </div>
        ),
      },
      {
        accessorKey: "Created At",
        header: () => <div>Created At</div>,
        cell: ({ row }) => (
          <div className="">
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit",
            }).format(new Date(row.original.$createdAt))}
          </div>
        ),
      },
      {
        accessorKey: "Last Login",
        header: () => <div>Last Login</div>,
        cell: ({ row }) => (
          <div className="">
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).format(new Date(row.original.accessDate))}
          </div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        header: () => <div>Actions</div>,
        cell: ({ row }) => (
          <ActionsCell row={row} onUserDeleted={handleUserDeleted} />
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div
      className={cn(
        "relative transition-[max-width] ease-linear duration-200",
        state === "expanded"
          ? "md:max-w-[calc(100dvw-17.5rem)]"
          : "md:max-w-[calc(100dvw-5.5rem)]"
      )}
    >
      <div className="flex items-center py-2">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <LuChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-20 text-center"
                >
                  No Users Found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
