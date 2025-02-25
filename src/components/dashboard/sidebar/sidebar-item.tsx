"use client";

import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sideBarMenuItemsList } from "@/lib/menu-items";

const SideBarItem = ({ roles }: { roles: string[] }) => {
  const pathname = usePathname();

  return (
    <>
      {sideBarMenuItemsList.map((item) => {
        const hasRole =
          Array.isArray(roles) &&
          item.roles.some((role) => roles.includes(role));

        if (!hasRole) return null;

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={item?.url === pathname}>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
          </SidebarMenuItem>
        );
      })}
    </>
  );
};

export default SideBarItem;
