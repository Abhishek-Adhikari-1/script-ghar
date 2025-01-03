"use server"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NavUser } from "./sidebar-footer";
import Image from "next/image";
import SideBarItem from "./sidebar-item";
import SideTriggerMbl from "./sidebar-trigger-mobile";
import { MdOutlineShoppingCart } from "react-icons/md";
import SideBarDropdownMenu from "./order-management";
import { sideBarOrderManagementList } from "@/lib/menu-items";

export async function AppSidebar({
  user,
  variant,
}: {
  user: {
    name: string;
    email: string;
    roles: string[];
  };
  variant?: "sidebar" | "floating" | "inset";
}) {
  return (
    <Sidebar collapsible="icon" variant={variant || "sidebar"}>
      <SidebarHeader className="relative">
        <SidebarMenuButton asChild className="hover:bg-transparent max-w-max">
          <Link href={"#"} className="flex">
            <Image src={"/favicon.ico"} height={20} width={20} alt="" />
            <span>{process.env?.APP_NAME || "ScriptGhar"}</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuBadge className="pointer-events-auto pt-4">
          <SideTriggerMbl />
        </SidebarMenuBadge>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Applications</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SideBarItem />
            </SidebarMenu>
          </SidebarGroupContent>
          <SideBarDropdownMenu
            sideBarSubMenuItemList={sideBarOrderManagementList}
          >
            <MdOutlineShoppingCart />
            <span>Order Management</span>
          </SideBarDropdownMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
          <SidebarMenuItem>
            <SideTriggerMbl />
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
