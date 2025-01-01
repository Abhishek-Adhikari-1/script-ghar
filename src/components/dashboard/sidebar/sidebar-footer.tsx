"use client";

import { LuChevronsUpDown } from "react-icons/lu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "@/server/actions/auth.actions";
import { menuItems } from "./profile-btn";
import Link from "next/link";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
    roles: string[];
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user?.name
                    ?.split(" ")
                    .slice(0, 3)
                    .map((word) => word[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <LuChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-full min-w-56 rounded-lg max-w-[200px]"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user?.name
                      ?.split(" ")
                      .slice(0, 3)
                      .map((word) => word[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {menuItems.map((item) => {
                const visible = new Set(item.visible);
                if (user.roles.some((r) => visible.has(r))) {
                  return (
                    <DropdownMenuItem asChild key={item.label}>
                      <Link
                        href={item?.href}
                        className="flex items-center relative"
                      >
                        <item.icon />
                        <span>{item?.label}</span>
                        {item?.badge === true && (
                          <span className="pointer-events-none absolute right-2 text-[0.6rem] font-semibold bg-slate-100 dark:bg-zinc-800 max-h-max px-2 rounded-full">
                            {user?.roles.join(", ")}
                          </span>
                        )}
                        {item?.badge && (
                          <span className="pointer-events-none absolute right-2 text-[0.6rem] font-semibold bg-slate-100 dark:bg-zinc-800 max-h-max px-2 rounded-full">
                            {item?.badge}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  );
                }
                return null;
              })}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={async () => await signOut()}>
              <FiLogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
