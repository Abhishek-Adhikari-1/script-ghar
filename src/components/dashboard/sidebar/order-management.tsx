"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { usePathname } from "next/navigation";
import { FaAngleRight } from "react-icons/fa6";
import Link from "next/link";
import { IconType } from "react-icons/lib";

const SideBarDropdownMenu = ({
  sideBarSubMenuItemList,
  children,
}: {
  sideBarSubMenuItemList: {
    name: string;
    href: string;
    icon: IconType;
  }[];
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isMainActive = sideBarSubMenuItemList.some(
    (item) => item?.href === pathname
  );

  return (
    <SidebarMenu className="mt-1">
      <Collapsible asChild className="group/collapsible" defaultOpen={isMainActive}>
        <div>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton isActive={isMainActive}>
              {children}
              <FaAngleRight className="max-w-[0.82rem] max-h-[0.82rem] ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {sideBarSubMenuItemList.map((item, index) => {
                return (
                  <SidebarMenuSubItem key={item?.name}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={item?.href === pathname}
                      className={index === 0 ? "mt-[0.15rem]" : ""}
                    >
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
  );
};

export default SideBarDropdownMenu;
