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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NavUser } from "./sidebar-footer";
import Image from "next/image";
import SideBarItem from "./sidebar-item";
import SideTriggerMbl from "./sidebar-trigger-mobile";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FaAngleRight } from "react-icons/fa6";
import { RiExchangeDollarLine } from "react-icons/ri";
import { GoListOrdered } from "react-icons/go";
import { MdManageHistory } from "react-icons/md";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { MdOutlineShoppingCart } from "react-icons/md";

const orderList = [
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

export function AppSidebar({
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
          <SidebarMenu className="mt-1">
            <Collapsible asChild className="group/collapsible">
              <div>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <MdOutlineShoppingCart />
                    <span>Order Management</span>
                    <FaAngleRight className="max-w-[0.82rem] max-h-[0.82rem] ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {orderList.map((item) => {
                      return (
                        <SidebarMenuSubItem key={item?.name}>
                          <SidebarMenuSubButton asChild>
                            <Link href={item?.href}>
                              <item.icon />
                              <span>{item?.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </SidebarMenu>
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
