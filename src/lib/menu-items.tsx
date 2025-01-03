"use client";

import { LuLayoutDashboard, LuFileStack } from "react-icons/lu";
import { RiExchangeDollarLine } from "react-icons/ri";
import { GoListOrdered } from "react-icons/go";
import { MdManageHistory } from "react-icons/md";
import { HiOutlineStatusOnline } from "react-icons/hi";

export const sideBarMenuItemsList = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LuLayoutDashboard,
    isActive: true,
    badge: "2",
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: LuFileStack,
  },
];

export const sideBarOrderManagementList = [
  {
    name: "Buy / Sell",
    href: "/buy-sell",
    icon: RiExchangeDollarLine,
  },
  {
    name: "Daily Orders",
    href: "/daily-orders",
    icon: GoListOrdered,
  },
  {
    name: "Order History",
    href: "/order-history",
    icon: MdManageHistory,
  },
  {
    name: "Order Status",
    href: "/order-status",
    icon: HiOutlineStatusOnline,
  },
];
