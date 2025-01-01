"use client";

import { LuLayoutDashboard, LuFileStack } from "react-icons/lu";
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LuLayoutDashboard,
    isActive: true,
    badge: "2",
  },
  {
    title: "Invoices",
    url: "/dashboard/invoices",
    icon: LuFileStack,
  },
];

const SideBarItem = () => {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => (
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
