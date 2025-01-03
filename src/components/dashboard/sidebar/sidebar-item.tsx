"use client";

import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sideBarMenuItemsList } from "@/lib/menu-items";

const SideBarItem = () => {
  const pathname = usePathname();

  return (
    <>
      {sideBarMenuItemsList.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item?.url === pathname}>
            <Link href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuBadge>{item?.badge}</SidebarMenuBadge>
        </SidebarMenuItem>
      ))}
    </>
  );
};

export default SideBarItem;
