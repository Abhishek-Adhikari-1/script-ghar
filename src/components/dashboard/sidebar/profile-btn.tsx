"use client";

import React from "react";
import Link from "next/link";
import { FiUser, FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/server/actions/auth.actions";

export const menuItems = [
  {
    icon: FiUser,
    label: "Profile",
    href: "/profile",
    visible: ["admin", "user", "broker"],
    badge: true,
  },
  {
    icon: FiSettings,
    label: "Settings",
    href: "/settings",
    visible: ["admin", "user", "broker"],
  },
  {
    icon: FiHelpCircle,
    label: "Help",
    href: "/help",
    visible: ["admin", "user", "broker"],
  },
];

export default function ProfileButton({
  currentUser,
}: {
  currentUser: {
    name: string | undefined;
    email: string | undefined;
    roles: string[];
  };
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 ring-2 ring-slate-500 ring-offset-[3px] ring-offset-white dark:ring-offset-card">
            <AvatarImage
              src="/placeholder.svg?height=32&width=32"
              alt="User avatar"
            />
            <AvatarFallback className="select-none">
              {currentUser?.name
                ?.split(" ")
                .slice(0, 3)
                .map((word) => word[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 max-w-[200px]">
            <p className="text-sm font-semibold leading-none truncate">
              {currentUser?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {currentUser?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {menuItems.map((item) => {
          const visible = new Set(item.visible);
          if (currentUser.roles.some((r) => visible.has(r))) {
            return (
              <DropdownMenuItem asChild key={item.label}>
                <Link href={item?.href} className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item?.label}</span>
                </Link>
              </DropdownMenuItem>
            );
          }
          return null;
        })}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => await signOut()}>
          <FiLogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
