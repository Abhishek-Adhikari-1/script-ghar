"use client";

import { LuLayoutDashboard, LuUserRound } from "react-icons/lu";
import { RiExchangeDollarLine } from "react-icons/ri";
import { GoListOrdered } from "react-icons/go";
import { MdManageHistory, MdOutlinePlaylistAdd } from "react-icons/md";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { HiOutlineUsers } from "react-icons/hi2";

export const sideBarMenuItemsList = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LuLayoutDashboard,
    isActive: true,
    badge: "2",
    roles: ["mvp", "admin", "broker", "user"],
  },
  {
    title: "My Information",
    url: "/client-information",
    icon: LuUserRound,
    roles: ["mvp", "admin", "broker", "user"],
  },
  {
    title: "Add Scripts",
    url: "/add-scripts",
    icon: MdOutlinePlaylistAdd,
    roles: ["mvp", "admin"],
  },
  {
    title: "Manage Users",
    url: "/manage-users",
    icon: HiOutlineUsers,
    roles: ["mvp", "admin"],
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
